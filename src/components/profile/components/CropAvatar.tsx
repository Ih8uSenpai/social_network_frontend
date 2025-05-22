import React, {useState, useRef, useEffect} from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
} from 'react-image-crop'
import { canvasPreview } from "./CanvasPreview";
import { useDebounceEffect } from '../utils/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import {ProfileData} from "../../utils/Types";


function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

interface CropTestProps{
    profile: ProfileData;
    token: string;
    fetchProfile;
    setShowWindow;
    setShowSettings;
}

export const CropAvatar: React.FC<CropTestProps> = ({profile, token, fetchProfile, setShowWindow, setShowSettings}) => {
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [aspect, setAspect] = useState<number | undefined>(9 / 9)
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!cropModalOpen) {
            setShowWindow(false);
            console.log("showwindow was set to false")
        }
        else {
            setShowWindow(true);
        }
    }, [cropModalOpen]);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setCropModalOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleClose = () => {
        setCropModalOpen(false);
        setShowSettings(false);
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const onDownloadCropClick = async () => {
        if (!previewCanvasRef.current || !completedCrop) {
            return;
        }


        previewCanvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }

            const formData = new FormData();

            formData.append('image', blob);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/upload-icon/${profile.user.userId}`, {
                    method: 'POST',
                    headers: {
                         'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log('Upload successful');
                fetchProfile();
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            handleClose();
        }, 'image/png');
    };


    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                )
            }
        },
        100,
        [completedCrop],
    )


    return (
        <div className="App">
            <div className="Crop-Controls">
                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                    Изменить иконку профиля
                </label>

            </div>

            <Dialog open={cropModalOpen} onClose={handleClose} maxWidth="lg">
                <DialogTitle>Crop your image</DialogTitle>
                <DialogContent>
            {!!imgSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    // minWidth={400}
                    minHeight={100}
                    circularCrop
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            )}
            {!!completedCrop && (
                <>
                    <div style={{display:"none"}}>
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: completedCrop.width,
                                height: completedCrop.height,
                            }}
                        />
                    </div>
                    <div>
                        <a
                            href="src/components/profile/components/CropAvatar.tsx"
                            ref={hiddenAnchorRef}
                            download
                            style={{
                                position: 'absolute',
                                top: '-200vh',
                                visibility: 'hidden',
                            }}
                        >
                            Hidden download
                        </a>
                    </div>
                </>
            )}
                </DialogContent>
                {!!completedCrop && (<Button onClick={onDownloadCropClick}>Save</Button>)}
                <Button onClick={handleClose}>Close</Button>
            </Dialog>
        </div>
    )
}