const sharp = require("sharp");
const cloudinary = require("./cloudinary");

const uploadBufferToCloudinary = (buffer, folder, filename, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const encrypt = async (inputBuffer, fileId) => {
  try {
    const image = sharp(inputBuffer);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const key = [];
    const encrypted = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
      const k = Math.floor(Math.random() * 256);
      key.push(k);
      encrypted[i] = data[i] ^ k;
    }

    const keyBuffer = Buffer.from(key).toString("base64");

    const encryptedImageBuffer = await sharp(encrypted, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels,
      },
    }).png().toBuffer();

    const encryptedImageUrl = await uploadBufferToCloudinary(encryptedImageBuffer, "encrypted", `encrypted-${fileId}`);
    const keyFileUrl = await uploadBufferToCloudinary(Buffer.from(keyBuffer), "keys", `key-${fileId}`, "raw");

    return { encryptedImageUrl, keyFileUrl };
  } catch (err) {
    throw new Error("Encryption Failed: " + err.message);
  }
};

module.exports = encrypt;
