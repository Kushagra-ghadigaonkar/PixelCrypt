import React, { useState } from "react";
import upload_img from "../assets/upload_area.png";
import { AiOutlineCloudUpload } from "react-icons/ai";


const Mainpage = () => {
    const host="http://localhost:5000"
    const [encryptPreview, setEncryptPreview] = useState(null);
    const [decryptPreview, setDecryptPreview] = useState(null);
    const [encryptFile, setEncryptFile] = useState(null);
    const [decryptFile, setDecryptFile] = useState(null);
    const [keyFile, setKeyFile] = useState(null);

    // Encrypt Handler
    const encryptImage = async () => {
        try{
            if (!encryptFile) return alert("Please select an image to encrypt.");

        const form = new FormData();
        form.append("image", encryptFile);

        const res = await fetch(host+"/api/encrypt", {
            method: "POST",
            body: form,
        });

        if (!res.ok) return alert("Encryption failed.");

        const data = await res.blob();
        const url = URL.createObjectURL(data);
        window.open(url, "_blank");
        }catch(err){
            console.log(err)
        }
        
    };

    // Decrypt Handler
    const decryptImage = async () => {
        if (!decryptFile || !keyFile)
            return alert("Please select both an encrypted image and a key file.");

        const form = new FormData();
        form.append("image", decryptFile);
        form.append("key", keyFile);

        const res = await fetch(host+"/api/decrypt", {
            method: "POST",
            body: form,
        });

        if (!res.ok) return alert("Decryption failed.");

        const data = await res.blob();
        const url = URL.createObjectURL(data);
        window.open(url, "_blank");
    };

    return (
        <div className="m-5">
            <div className="p-4  flex flex-col items-center border-2 rounded-3xl mt-10">
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

                <hr className="my-3" />
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
            </div>
        </div>
    );
};

export default Mainpage;
