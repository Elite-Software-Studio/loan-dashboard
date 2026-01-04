import { useState } from 'react';

interface RejectLoanModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
	loanNumber?: string;
	isLoading?: boolean;
}

export function RejectLoanModal({
	isOpen,
	onClose,
	onConfirm,
	loanNumber,
	isLoading = false,
}: RejectLoanModalProps) {
	const [rejectionReason, setRejectionReason] = useState('');
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleConfirm = () => {
		if (!rejectionReason.trim()) {
			setError('Rejection reason is required');
			return;
		}

		if (rejectionReason.trim().length < 10) {
			setError('Rejection reason must be at least 10 characters');
			return;
		}

		setError('');
		onConfirm(rejectionReason.trim());
	};

	const handleClose = () => {
		setRejectionReason('');
		setError('');
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-300">
				<div className="p-6">
					{/* Title */}
					<h3 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-2">
						Reject Loan Request
					</h3>
					{loanNumber && (
						<p className="text-sm text-gray-600 font-montserrat-regular mb-4">
							Loan Number: <span className="font-medium">{loanNumber}</span>
						</p>
					)}

					{/* Message */}
					<p className="text-gray-700 font-montserrat-regular mb-4">
						Please provide a reason for rejecting this loan request. This information will be shared with the borrower.
					</p>

					{/* Rejection Reason Input */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat-medium">
							Rejection Reason <span className="text-red-500">*</span>
						</label>
						<textarea
							value={rejectionReason}
							onChange={(e) => {
								setRejectionReason(e.target.value);
								setError('');
							}}
							placeholder="Enter the reason for rejecting this loan request..."
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-2 text-gray-900 bg-white placeholder-gray-500 ${
								error ? 'border-red-500' : 'border-gray-300'
							}`}
							rows={4}
							disabled={isLoading}
						/>
						{error && (
							<p className="text-sm text-red-600 font-montserrat-regular">{error}</p>
						)}
						<p className="text-xs text-gray-500 font-montserrat-regular mt-1">
							Minimum 10 characters required
						</p>
					</div>

					{/* Actions */}
					<div className="flex justify-end space-x-3">
						<button
							onClick={handleClose}
							disabled={isLoading}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium"
						>
							Cancel
						</button>
						<button
							onClick={handleConfirm}
							disabled={isLoading || !rejectionReason.trim()}
							className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium"
						>
							{isLoading ? (
								<span className="flex items-center">
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Rejecting...
								</span>
							) : (
								'Reject Loan'
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

