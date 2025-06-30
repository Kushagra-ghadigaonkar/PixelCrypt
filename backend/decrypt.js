const fs = require("fs");
const sharp = require("sharp");

const decrypt = async (imagePath, keyPath, outputPath) => {
  try {
    // Read encrypted image as raw data
    const image = sharp(imagePath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    // Read and decode the key
    const keyBase64 = fs.readFileSync(keyPath, "utf-8");
    const keyBuffer = Buffer.from(keyBase64, "base64");

    if (keyBuffer.length !== data.length) {
      throw new Error("Key length doesn't match image data length");
    }

    // XOR decrypt
    const decrypted = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      decrypted[i] = data[i] ^ keyBuffer[i];
    }

    // Write the decrypted image
    await sharp(decrypted, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    })
      .png()
      .toFile(outputPath);

  } catch (err) {
    throw new Error("Decryption Failed: " + err.message);
  }
};

module.exports = decrypt;
