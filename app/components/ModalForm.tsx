import { type ReactNode } from 'react';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    description?: string;
    children: ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    submitDisabled?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export function ModalForm({
    isOpen,
    onClose,
    onSubmit,
    title,
    description,
    children,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    isLoading = false,
    submitDisabled = false,
    maxWidth = '4xl',
}: ModalFormProps) {
    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden flex flex-col`}>
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-gray-600 font-montserrat-medium">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        {children}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 rounded-xl font-montserrat-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || submitDisabled}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-montserrat-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center space-x-2">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Submitting...</span>
                                </span>
                            ) : (
                                submitLabel
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

