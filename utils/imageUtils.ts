const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ProcessedImage {
    base64Data: string;
    mimeType: string;
    previewUrl: string;
}

export const processImageFile = (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            return reject(new Error('image_max_size'));
        }
        if (!SUPPORTED_TYPES.includes(file.type)) {
            return reject(new Error('image_unsupported_type'));
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64Data = dataUrl.split(',')[1];
            resolve({ base64Data, mimeType: file.type, previewUrl: dataUrl });
        };
        reader.onerror = error => reject(error);
    });
};
