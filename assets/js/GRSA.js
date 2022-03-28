
  window.getRsaKeys = () => {
    return new Promise((resolve, reject) => {

      function RSA2text(buffer, isPrivate = 0) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        var base64 = window.btoa(binary);
        var text = "-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----\n";
        text += base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
        text += "\n-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----";
        return text;
      }
      window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: "SHA-512" },
        },
        true,
        ["encrypt", "decrypt"]
      ).then(function (key) {
        window.crypto.subtle.exportKey(
          "pkcs8",
          key.privateKey
        ).then(function (keydata1) {
          window.crypto.subtle.exportKey(
            "spki",
            key.publicKey
          ).then(function (keydata2) {
            var privateKey = RSA2text(keydata1, 1);
            var publicKey = RSA2text(keydata2);
            resolve({
              priv: privateKey,
              pub: publicKey
            })
          }).catch(function (err) {
            reject(err)
          });
        })
          .catch(function (err) {
            reject(err)
          });
      })
        .catch(function (err) {
          reject(err)
        });
    })
  };