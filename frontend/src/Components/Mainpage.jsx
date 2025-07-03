import React, { useState } from "react";
import upload_img from "../assets/upload_area.png";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import { ImFolderDownload } from "react-icons/im";

const Mainpage = () => {
    const host = "http://localhost:5000"
    const [encryptPreview, setEncryptPreview] = useState(null);
    const [decryptPreview, setDecryptPreview] = useState(null);
    const [encryptFile, setEncryptFile] = useState(null);
    const [decryptFile, setDecryptFile] = useState(null);
    const [keyFile, setKeyFile] = useState(null);

    const [encryptedUrl, setEncryptedUrl] = useState(null);
    const [keyUrl, setKeyUrl] = useState(null);

    // In encryptImage()


    // Encrypt Handler
    const encryptImage = async () => {
        try {
            if (!encryptFile) return alert("Please select an image to encrypt.");

            if (encryptFile.size > 10 * 1024 * 1024) {
                return alert("❌ Image must be smaller than 10MB.");
            }


            const form = new FormData();
            form.append("image", encryptFile);

            const res = await fetch(host + "/api/encrypt", {
                method: "POST",
                body: form,
            });

            if (res.status === 500) {
                alert("❌ Image too large. Please upload an image smaller than 10MB.");
                return;
            }

            if (!res.ok) return alert("Encryption failed.");

            const data = await res.json();

            setEncryptedUrl(data.encryptedImageUrl);
            setKeyUrl(data.keyFileUrl);

            // 🔥 Show or download Cloudinary-hosted files
            if (data.encryptedImageUrl && data.keyFileUrl) {
                window.open(data.encryptedImageUrl, "_blank"); // Open encrypted image
                window.open(data.keyFileUrl, "_blank"); // Open key file
            } else {
                alert("Encryption succeeded but no files returned.");
            }
        } catch (err) {
            console.log("Encryption Error:", err);
            alert("Encryption failed");
        }
    };


    // Decrypt Handler
    const decryptImage = async () => {
        if (!decryptFile || !keyFile)
            return alert("Please select both an encrypted image and a key file.");

        const form = new FormData();
        form.append("image", decryptFile);
        form.append("key", keyFile);

        const res = await fetch(host + "/api/decrypt", {
            method: "POST",
            body: form,
        });

        if (!res.ok) return alert("Decryption failed.");

        const data = await res.blob();
        const url = URL.createObjectURL(data);
        window.open(url, "_blank");
    };
    const downloadFileFromUrl = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const tempUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = tempUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(tempUrl);
        } catch (err) {
            console.error("Download failed:", err);
        }
    };


    return (
        <div className="m-5">
            <p className="text-red-400 text-center">! Attention</p>
            <p className="text-center text-red-400">Encrypted Image and coded key file <br />will not save after reload</p>
            <div className="p-4  flex flex-col items-center border-2 rounded-3xl mt-5">
                <h1 className="text-orange-400 text-4xl mt-5">PixelCrypt</h1>
                <h2 className="text-xl font-semibold mb-2 mt-5">🔐 Encrypt Image</h2>
                <p>Upload Image</p>
                <label htmlFor="encrypt-image" className="cursor-pointer">
                    {encryptPreview ? (
                        <img
                            src={URL.createObjectURL(encryptPreview)}
                            alt="Uploaded Preview"
                            className="w-40 h-40 object-cover border rounded-md"
                        />
                    ) : (
                        <div className="mt-5 w-15 h-15 flex items-center justify-center border border-dashed rounded-md text-gray-400">
                            <AiOutlineCloudUpload size={40} />
                        </div>
                    )}
                </label>

                <input
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file.size > 10 * 1024 * 1024) {
                            alert("❌ Selected image is larger than 10MB.");
                            setEncryptPreview(null);
                            setEncryptFile(null);
                            return;
                        }
                        setEncryptPreview(file);
                        setEncryptFile(file);
                    }}
                    type="file"
                    id="encrypt-image"
                    hidden
                    required
                />

                <button
                    className="bg-blue-600 text-white w-[20%]  mt-4 rounded-[20px]"
                    onClick={encryptImage}
                >
                    Encrypt
                </button>
                <p className="mt-4">Max image upload size 10 mb</p>

                <hr className="my-3 border-[1px] border-white w-[80%]" />
                <h2 className="text-xl font-semibold mb-2">🔓 Decrypt Image</h2>
                <div className="mb-2">
                    <label htmlFor="decrypt-image" className="cursor-pointer">
                        {decryptPreview ? (
                            <img
                                src={URL.createObjectURL(decryptPreview)}
                                alt="Uploaded Preview"
                                className="w-40 h-40 object-cover border rounded-md"
                            />
                        ) : (
                            <div className="mt-5 w-15 h-15 flex items-center justify-center border border-dashed rounded-md text-gray-400">
                                <AiOutlineCloudUpload size={40} />
                            </div>
                        )}
                    </label>

                    <input
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setDecryptPreview(file);
                            setDecryptFile(file);
                        }}
                        type="file"
                        id="decrypt-image"
                        hidden
                        required
                    />
                </div>

                <div className="mb-2 flex flex-col items-center">
                    <label className="text-center mt-2 text-xl font-bold">📄 Key File</label>

                    <div className="mt-2 w-full flex justify-center">
                        <input
                            type="file"
                            accept=".txt"
                            onChange={(e) => setKeyFile(e.target.files[0])}
                            className="block w-[60%]"

                        />
                    </div>
                </div>

                <button
                    className="bg-green-600 text-white w-[20%]  mt-4 rounded-[20px] mb-5"
                    onClick={decryptImage}
                >
                    Decrypt
                </button>
                {encryptedUrl && (
                    <button
                        onClick={() => downloadFileFromUrl(encryptedUrl, "encrypted_image.png")}
                        className="text-blue-600 flex items-center gap-2 mb-5"
                    >
                        <IoMdDownload size={25} /> Download Encrypted Image
                    </button>
                )}

                {keyUrl && (
                    <a href={keyUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 flex gap-3 mb-3">
                        <ImFolderDownload size={20} /> Download Key File
                    </a>
                )}
            </div>
        </div>
    );
};

export default Mainpage;
