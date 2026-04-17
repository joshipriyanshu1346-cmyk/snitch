import ImageKit from '@imagekit/nodejs';
import { CONFIG } from '../config/config.js';
const client = new ImageKit({
  privateKey: CONFIG.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export async function uploadFile({buffer,filename,folder='snitch'}){
    const response = await client.files.upload({
        file: buffer,
        fileName: filename,
        folder
    })
    return response 
}