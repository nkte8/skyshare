import { useEffect, useState } from 'react';

export const useGetImageUrl = (file: File | null) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (!file) {
            return;
        }

        let reader: FileReader | null = new FileReader();
        reader.onloadend = () => {
            // base64のimageUrlを生成する。
            const base64 = reader && reader.result;
            if (base64 && typeof base64 === 'string') {
                setImageUrl(base64);
            }
        };
        reader.readAsDataURL(file);

        return () => {
            reader = null;
        };
    }, [file]);

    return imageUrl;
};
export default useGetImageUrl