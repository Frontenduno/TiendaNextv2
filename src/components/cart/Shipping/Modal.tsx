'use client';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ visible, onClose, children }: ModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 max-w-xl w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-black cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
