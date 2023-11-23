import { unlink } from 'fs/promises';
import * as path from 'path';

function deleteImage(imgName: string) {
  const oldImagePath = path.join('files', 'images', imgName);
  try {
    unlink(oldImagePath);
  } catch (err) {
    console.error('Error deleting old image:', err);
  }
}

export default deleteImage;
