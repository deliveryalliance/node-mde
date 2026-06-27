'use strict'

const { SignedXml } = require('xml-crypto')

// Algoritmos exigidos pela assinatura de eventos da NF-e (mantidos explícitos
// pois o xml-crypto v5+ não assume mais SHA-1 por padrão). Produzem assinatura
// byte-a-byte idêntica à do xml-crypto 2.x usado anteriormente.
const ENVELOPED_SIGNATURE = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
const C14N = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
const RSA_SHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
const SHA1 = 'http://www.w3.org/2000/09/xmldsig#sha1'

class Assinatura {
  /**
   *
   * @param {string} cert
   * @param {string} key
   * @param {string} xml
   * @returns {string}
   */
  static assinarXml(cert, key, xml) {
    const xpath = "//*[local-name(.)='infEvento']"
    const transforms = [ENVELOPED_SIGNATURE, C14N]

    const sig = new SignedXml({
      privateKey: key,
      publicCert: cert,
      signatureAlgorithm: RSA_SHA1,
      canonicalizationAlgorithm: C14N,
      getKeyInfoContent: () =>
        `<X509Data><X509Certificate>${cert
          .split('-----')[2]
          .replace(/[\r\n]/g, '')}</X509Certificate></X509Data>`,
    })

    sig.addReference({
      xpath: xpath,
      transforms: transforms,
      digestAlgorithm: SHA1,
    })

    sig.computeSignature(xml, {
      location: {
        reference: xpath,
        action: 'after',
      },
    })

    return sig.getSignedXml()
  }
}

module.exports = Object.freeze(Assinatura)
