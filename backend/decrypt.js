const sharp = require("sharp");

const decrypt = async (imageBuffer, keyBuffer) => {
  try {
    const key = Buffer.from(keyBuffer.toString(), "base64");

    const image = sharp(imageBuffer);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    if (key.length !== data.length) {
      throw new Error("Key length doesn't match image data length");
    }

    const decrypted = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      decrypted[i] = data[i] ^ key[i];
    }

    const outputBuffer = await sharp(decrypted, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    }).png().toBuffer();

    return outputBuffer;
  } catch (err) {
    throw new Error("Decryption Failed: " + err.message);
  }
};

module.exports = decrypt;
