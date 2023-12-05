'use server'

import sharp from 'sharp';

export async function convertWebpToPng(downloadUrl) {
    const imageBuffer = await fetch(downloadUrl).then(res => res.arrayBuffer());
    try {
        const pngBuffer = await sharp(imageBuffer)
        .resize(600)
        .withMetadata({ density: 96 }) // Set the DPI to 96 for screen display
        .png()
        .toBuffer();
        
        //Convert buffer to base64 string
        const base64String = pngBuffer.toString('base64');
        return `data:image/png;base64,${base64String}`;
    } catch (err) {
        return "";
    }
}

export async function validateUrl(url) {
    try {
        const response = await fetch(url);
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}