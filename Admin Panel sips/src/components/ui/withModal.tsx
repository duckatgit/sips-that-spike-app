import { useState } from "react";
import ReactDOM from "react-dom";


export function withModal<T extends object>(
  Wrapped: React.ComponentType<T>
) {
  return function ModalWrapper(props: T) {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
      <>
        {/* Expose controls */}
        <Wrapped {...props} openModal={open} />

        {isOpen &&
          ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                {/* Close */}
                <button
                  onClick={close}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>

                {/* Render wrapped component content */}
                <Wrapped {...props} closeModal={close} isModalContent />
              </div>
            </div>,
            document.body
          )}
      </>
    );
  };
}
