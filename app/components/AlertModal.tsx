import { type ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  showCancel?: boolean;
  cancelLabel?: string;
  onConfirm?: () => void;
}

const alertConfig = {
  success: {
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-100',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    borderColor: 'border-green-200',
  },
  error: {
    icon: (
      <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-100',
    buttonColor: 'bg-red-600 hover:bg-red-700',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: (
      <svg className="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    borderColor: 'border-yellow-200',
  },
  info: {
    icon: (
      <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    borderColor: 'border-blue-200',
  },
};

export function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmLabel = 'OK',
  showCancel = false,
  cancelLabel = 'Cancel',
  onConfirm,
}: AlertModalProps) {
  if (!isOpen) return null;

  const config = alertConfig[type];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 ${config.borderColor} animate-in fade-in zoom-in duration-300`}>
        {/* Modal Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`${config.iconBg} rounded-full p-4`}>
              {config.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 font-montserrat-bold text-center mb-3">
            {title}
          </h3>

          {/* Message */}
          <div className={`text-center mb-6 ${config.bgColor} rounded-lg p-4`}>
            {typeof message === 'string' ? (
              <p className="text-gray-700 font-montserrat-regular">{message}</p>
            ) : (
              message
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            {showCancel && (
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl font-montserrat-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-6 py-3 ${config.buttonColor} text-white rounded-xl font-montserrat-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

