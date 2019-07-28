import { findIndex } from 'lodash';

export const updateCanvasImages = (changeType, images, update) => {
    const newImages = [...images];
    if (changeType === 'drag') {
        const imageDataIndex = findIndex(newImages, image => image.imageId === update.imageId);
        newImages[imageDataIndex].imagex = update.x;
        newImages[imageDataIndex].imagey = update.y;
    }
    if (changeType === 'scale') {
        const imageDataIndex = findIndex(newImages, image => image.imageId === update.imageId);
        const imageData = newImages[imageDataIndex];
        newImages[imageDataIndex].imagewidth = imageData.imagewidth + update.width;
        newImages[imageDataIndex].imageheight = imageData.imageheight + update.height;
    }
    return newImages;
}