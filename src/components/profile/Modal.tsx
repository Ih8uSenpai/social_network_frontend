import React from 'react';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="modal">
            <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={onClose}>X</button>
            </div>
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
};

export default Modal;
