import chatIcon from '../resources/images/no_image_icon.jpg'
export const defaultProfileIcon = `${process.env.REACT_APP_BACK_BASE_URL}/src/main/resources/static/standart_icon.jpg`;
export const defaultBannerImage = `${process.env.REACT_APP_BACK_BASE_URL}/src/main/resources/static/standart_banner.jpg`;
export const defaultChatIcon = chatIcon;
export const defaultMusicIcon = `${process.env.REACT_APP_BACK_BASE_URL}/src/main/resources/static/defaultMusicIcon.jpg`;
export const photo_box_style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1700px',
    overflowY: 'auto',
    bgcolor: '#333',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2
};