let SignedXml = require("xml-crypto").SignedXml, ENVELOPED_SIGNATURE = "http://www.w3.org/2000/09/xmldsig#enveloped-signature", C14N = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315", RSA_SHA1 = "http://www.w3.org/2000/09/xmldsig#rsa-sha1", SHA1 = "http://www.w3.org/2000/09/xmldsig#sha1";

class Assinatura {
    static assinarXml(e, t, a) {
        var r = "//*[local-name(.)='infEvento']", i = [ ENVELOPED_SIGNATURE, C14N ], t = new SignedXml({
            privateKey: t,
            publicCert: e,
            signatureAlgorithm: RSA_SHA1,
            canonicalizationAlgorithm: C14N,
            getKeyInfoContent: () => `<X509Data><X509Certificate>${e.split("-----")[2].replace(/[\r\n]/g, "")}</X509Certificate></X509Data>`
        });
        return t.addReference({
            xpath: r,
            transforms: i,
            digestAlgorithm: SHA1
        }), t.computeSignature(a, {
            location: {
                reference: r,
                action: "after"
            }
        }), t.getSignedXml();
    }
}

module.exports = Object.freeze(Assinatura);