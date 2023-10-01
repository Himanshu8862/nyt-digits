import React, { useRef, useEffect, useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, hasCloseBtn = true, onClose, children }) => {
    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef(null);

    const handleCloseModal = () => {
        if (onClose) {
            onClose();
        }
        setModalOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        setModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        const modalElement = modalRef.current;

        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);

    return (
        <dialog
            ref={modalRef}
            onKeyDown={handleKeyDown}
            className={`modal ${isModalOpen ? 'open' : ''}`}
        >
                {children}
                {hasCloseBtn && (
                    <>
                        <div className="modal-close-btn">
                            <svg onClick={handleCloseModal} width="26" height="26" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-6 w-6 cursor-pointer"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </>
                )}
        </dialog>
    );
};

export default Modal;
