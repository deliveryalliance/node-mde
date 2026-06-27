'use strict'

/**
 * Tests for the XML digital signature of NF-e events (`Assinatura.assinarXml`),
 * which migrated from xml-crypto 2.x to 6.x.
 *
 * The signature is validated by SEFAZ, so the migration must keep the exact
 * algorithm profile the homologação/produção endpoints accept:
 *   - SignatureMethod  : RSA-SHA1
 *   - DigestMethod     : SHA1
 *   - Canonicalization : C14N (xml-c14n-20010315)
 *   - Transforms       : enveloped-signature + C14N
 *   - Reference URI    : #<infEvento Id>
 *   - KeyInfo          : X509Data/X509Certificate
 * (A byte-for-byte parity check against xml-crypto 2.1.6 confirmed the output
 * is identical; this committed test locks the resulting structure and proves
 * the signature verifies.)
 *
 * An ephemeral self-signed certificate is generated with node-forge so the
 * test needs no real A1 certificate.
 */

const assert = require('assert')
const forge = require('node-forge')
const { SignedXml } = require('xml-crypto')
const { Assinatura, Xml } = require('../src/util')
const { RecepcaoSchema } = require('../src/schemas')

const ENVELOPED = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
const C14N = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
const RSA_SHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
const SHA1 = 'http://www.w3.org/2000/09/xmldsig#sha1'

const INF_EVENTO_ID = 'ID21020041000000000000000000000000000000000000004101'

function gerarCertificado() {
  const keys = forge.pki.rsa.generateKeyPair(2048)
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date('2024-01-01T00:00:00Z')
  cert.validity.notAfter = new Date('2030-01-01T00:00:00Z')
  const attrs = [{ name: 'commonName', value: 'TESTE NFE A1' }]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.sign(keys.privateKey, forge.md.sha256.create())
  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey),
  }
}

function montarEventoXml() {
  const schema = RecepcaoSchema.montarSchema({
    cOrgao: '91',
    tpAmb: '2',
    cnpj: '99999999999999',
    chNFe: '41000000000000000000000000000000000000000041',
    dhEvento: '2026-06-27T10:00:00-03:00',
    tpEvento: '210200',
    nSeqEvento: '1',
    descEvento: 'Confirmacao da Operacao',
    infEventoId: INF_EVENTO_ID,
    idLote: '1',
  })

  return Xml.jsonToXml(schema)
}

describe('Assinatura', function () {
  let cert
  let key
  let xml
  let signedXml

  before(function () {
    this.timeout(30000) // geração de chave RSA 2048 em JS puro
    const certificado = gerarCertificado()
    cert = certificado.cert
    key = certificado.key
    xml = montarEventoXml()
    signedXml = Assinatura.assinarXml(cert, key, xml)
  })

  describe('#assinarXml()', function () {
    it('Insere um elemento Signature', function () {
      assert.ok(/<Signature[\s>]/.test(signedXml))
      assert.ok(signedXml.includes('xmlns="http://www.w3.org/2000/09/xmldsig#"'))
    })

    it('Usa o perfil de algoritmos exigido pela SEFAZ (RSA-SHA1 / SHA1 / C14N)', function () {
      assert.ok(
        signedXml.includes(`<SignatureMethod Algorithm="${RSA_SHA1}"`),
        'SignatureMethod deve ser RSA-SHA1'
      )
      assert.ok(
        signedXml.includes(`<DigestMethod Algorithm="${SHA1}"`),
        'DigestMethod deve ser SHA1'
      )
      assert.ok(
        signedXml.includes(`<CanonicalizationMethod Algorithm="${C14N}"`),
        'CanonicalizationMethod deve ser C14N'
      )
    })

    it('Referencia o infEvento pelo Id e aplica os transforms corretos', function () {
      assert.ok(
        signedXml.includes(`<Reference URI="#${INF_EVENTO_ID}"`),
        'Reference URI deve apontar para #<infEventoId>'
      )
      assert.ok(signedXml.includes(`<Transform Algorithm="${ENVELOPED}"`))
      assert.ok(signedXml.includes(`<Transform Algorithm="${C14N}"`))
    })

    it('Inclui o certificado em KeyInfo/X509Data/X509Certificate', function () {
      const corpoCert = cert.split('-----')[2].replace(/[\r\n]/g, '')
      assert.ok(signedXml.includes('<X509Data>'))
      assert.ok(
        signedXml.includes(`<X509Certificate>${corpoCert}</X509Certificate>`)
      )
    })

    it('Posiciona a Signature dentro do evento, após o infEvento', function () {
      const fimInfEvento = signedXml.indexOf('</infEvento>')
      const inicioSignature = signedXml.indexOf('<Signature')
      const fimEvento = signedXml.indexOf('</evento>')

      assert.ok(fimInfEvento !== -1 && inicioSignature !== -1 && fimEvento !== -1)
      assert.ok(
        fimInfEvento < inicioSignature && inicioSignature < fimEvento,
        'Signature deve ficar entre </infEvento> e </evento>'
      )
    })

    it('Mantém o evento extraível como em RecepcaoHelper.montarRequest', function () {
      // Mesma fatia usada na montagem do lote.
      const trecho = signedXml.substring(
        signedXml.indexOf('<evento versao="1.00">'),
        signedXml.indexOf('</envEvento>')
      )
      assert.ok(trecho.startsWith('<evento versao="1.00">'))
      assert.ok(trecho.includes('<infEvento Id='))
      assert.ok(trecho.includes('<Signature'))
      assert.ok(trecho.trimEnd().endsWith('</evento>'))
    })

    it('Gera uma assinatura verificável (round-trip)', function () {
      const signatureNode = signedXml.match(/<Signature[\s\S]*<\/Signature>/)[0]
      const verifier = new SignedXml({ publicCert: cert })
      verifier.loadSignature(signatureNode)

      assert.strictEqual(verifier.checkSignature(signedXml), true)
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Assinatura.assinarXml = 'subscrever assinarXml'
      })
    })
  })
})
