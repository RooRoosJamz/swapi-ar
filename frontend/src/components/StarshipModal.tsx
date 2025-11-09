import React, { useEffect } from "react";
import "./StarshipModal.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const StarshipModal: React.FC<ModalProps> = ({ children, onClose }) => {
  // Close when pressing ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close when clicking outside the content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content p-4 shadow rounded">
        <button className="btn-close position-absolute top-0 end-0 m-2" onClick={onClose}></button>
        {children}
      </div>
    </div>
  );
};

export default StarshipModal;
