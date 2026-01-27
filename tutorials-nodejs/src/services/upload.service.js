'use strict';

import cloudinary from "../configs/cloudinary.config.js";

// 1. upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://img.freepik.com/free-vector/flat-design-comics-style-background_23-2148802688.jpg?t=st=1769084953~exp=1769088553~hmac=48f4414a0b26a0f045508ee10281d82293d5c7838ada9fbdecc61267b3afd8c4&w=740';
        const folderName = 'product/8409';
        const newFileName = 'testdemo';

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        })
        console.log(result)
        return result
    } catch (error) {
        console.error(`Error:::`, error.message);
    }
}

// 2. upload from image local
const uploadImageFromLocal = async ({ path, folderName = 'product/8409' }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })
        console.log(result);
        return {
            image_url: result.secure_url,
            shopId: '8409',
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error(`Error uploading image::`, error.mesagge)
    }
}

// 3. upload from image local
const uploadImageFromLocalFiles = async ({
    files, folderName = 'product/8409'
}) => {
    try {
        console.log(`files::`, files, folderName);
        if (!files.length) return;

        const uploadedUrls = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })

            uploadedUrls.push({
                image_url: result.secure_url,
                shopId: '8409',
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                })
            });
        }

        return uploadedUrls;
    } catch (error) {
        console.error(`Error uploading image::`, error.message);
    }
}

export default {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles
};