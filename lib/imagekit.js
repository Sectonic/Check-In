import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});  

export const uploadFile = async (imageName, imageBase64) => {
    const res = await imagekit.upload({
        file: imageBase64,
        folder: '/meets/',
        fileName: imageName,
    });
    return {
        id: res.fileId,
        url: res.url
    }
}

export const deleteFile = (fileId) => {
    imagekit.deleteFile(fileId);
}