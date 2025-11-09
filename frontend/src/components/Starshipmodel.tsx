import React, { useEffect } from "react";

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
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "25px 30px",
          width: "80%",
          maxWidth: "750px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transform: "translateY(0)",
          animation: "slideIn 0.25s ease-out",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ✖
        </button>
        {children}
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default StarshipModal;
