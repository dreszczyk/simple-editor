import { findIndex, filter } from 'lodash';

export const updateCanvas = (changeType, elements, update) => {
    const newElements = [...elements];
    if (changeType === 'drag') {
        const elementDataIndex = findIndex(newElements, image => image.imageId === update.imageId);
        newElements[elementDataIndex].imagex = update.x;
        newElements[elementDataIndex].imagey = update.y;
    }
    if (changeType === 'drag-text') {
        const elementDataIndex = findIndex(newElements, text => text.textId === update.textId);
        newElements[elementDataIndex].textx = update.x;
        newElements[elementDataIndex].texty = update.y;
    }
    if (changeType === 'scale') {
        const elementDataIndex = findIndex(newElements, image => image.imageId === update.imageId);
        const imageData = newElements[elementDataIndex];
        newElements[elementDataIndex].imagewidth = imageData.imagewidth + update.width;
        newElements[elementDataIndex].imageheight = imageData.imageheight + update.height;
    }
    return newElements;
}
export const removeFromCanvas = (elements, idx) => {
    return filter(elements, (image, index) => index !== idx);
}