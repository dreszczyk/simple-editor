export const preloadImage = (url, callback) => {
    const img = new Image();
    img.src = url;
    img.onload = callback;
}