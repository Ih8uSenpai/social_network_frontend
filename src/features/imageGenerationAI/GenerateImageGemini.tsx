import React, { useState } from 'react';



const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) {
            alert('Введите prompt');
            return;
        }

        setLoading(true);
        setImageUrl('');

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('output_format', 'png');
        formData.append('aspect_ratio', '1:1');
        formData.append('style_preset', 'photographic');
        formData.append('seed', '0');

        try {
            const response = await fetch(
                'https://api.stability.ai/v2beta/stable-image/generate/core',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_STABILITY_API_KEY}`,
                        Accept: 'image/*', // ✅ Правильный заголовок
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const err = await response.json();
                console.error(err);
                throw new Error(err.errors?.join(', ') || 'Ошибка генерации');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Произошла ошибка при генерации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Генерация изображения по описанию</h2>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например, 'castle on a hill at sunset'"
                style={{ width: '400px', padding: '10px', fontSize: '16px' }}
            />
            <button
                onClick={handleGenerate}
                style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                Генерировать
            </button>

            {loading && <p>Генерация изображения...</p>}

            {imageUrl && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Результат:</h3>
                    <img
                        src={imageUrl}
                        alt="Generated"
                        style={{ maxWidth: '100%', borderRadius: '10px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
