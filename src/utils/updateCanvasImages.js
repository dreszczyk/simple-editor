import { findIndex } from 'lodash';

export const updateCanvasImages = (images, update) => {
    const newImages = [...images];
    const imageDataIndex = findIndex(newImages, image => image.imageId === update.imageId);
    newImages[imageDataIndex].imagex = update.x;
    newImages[imageDataIndex].imagey = update.y;
    console.log('newImages', newImages)
    return newImages;
}