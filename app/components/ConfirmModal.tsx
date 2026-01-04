import { type ReactNode } from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string | ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmColor?: 'green' | 'red' | 'blue' | 'yellow';
	isLoading?: boolean;
}

const colorClasses = {
	green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
	red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
	blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
	yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
};

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	confirmColor = 'blue',
	isLoading = false,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	const confirmButtonClass = colorClasses[confirmColor];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-300">
				<div className="p-6">
					{/* Title */}
					<h3 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-4">
						{title}
					</h3>

					{/* Message */}
					<div className="mb-6">
						{typeof message === 'string' ? (
							<p className="text-gray-700 font-montserrat-regular">{message}</p>
						) : (
							message
						)}
					</div>

					{/* Actions */}
					<div className="flex justify-end space-x-3">
						<button
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium"
						>
							{cancelLabel}
						</button>
						<button
							onClick={onConfirm}
							disabled={isLoading}
							className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass} disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium`}
						>
							{isLoading ? (
								<span className="flex items-center">
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Processing...
								</span>
							) : (
								confirmLabel
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

