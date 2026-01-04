import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';
import { AlertModal } from '../components/AlertModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { RejectLoanModal } from '../components/RejectLoanModal';

interface LoanRequest {
	id: string;
	loanNumber: string;
	type: string;
	amount: number;
	rate: number;
	status: string;
	startDate: string;
	endDate?: string;
	description?: string;
	requestSource?: string;
	adminNotes?: string;
	reviewedAt?: string;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		name: string;
		email: string;
		accountNumber: string;
		creditScore?: number;
	};
	branch: {
		id: string;
		name: string;
		company: {
			name: string;
		};
	};
}

export default function LoanRequestDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loan, setLoan] = useState<LoanRequest | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
	const [moreInfoNotes, setMoreInfoNotes] = useState('');
	const [moreInfoError, setMoreInfoError] = useState('');

	useEffect(() => {
		if (id) {
			fetchLoanDetails();
		}
	}, [id]);

	const fetchLoanDetails = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('auth_token');
			const response = await fetch(`/api/loans?loanId=${id}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				if (response.status === 403) {
					setError('Access denied. Admin privileges required.');
				} else {
					setError('Failed to fetch loan details');
				}
				return;
			}

			const data = await response.json();
			setLoan(data);
		} catch (err) {
			console.error('Error fetching loan details:', err);
			setError('Failed to fetch loan details');
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async () => {
		if (!loan) return;

		setActionLoading(true);
		try {
			const token = localStorage.getItem('auth_token');
			const response = await fetch('/api/loans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					action: 'approve',
					loanId: loan.id,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to approve loan');
			}

			const updatedLoan = await response.json();
			// Optimistic update: immediately update the loan state
			setLoan(updatedLoan);
			setShowApproveModal(false);
			setAlertMessage('Loan approved successfully');
			setAlertType('success');
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to approve loan');
			setAlertType('error');
			setShowAlert(true);
		} finally {
			setActionLoading(false);
		}
	};

	const handleRequestMoreInfo = async () => {
		if (!loan) return;

		// Validate message
		if (!moreInfoNotes.trim()) {
			setMoreInfoError('Please provide the information you need from the borrower');
			return;
		}

		if (moreInfoNotes.trim().length < 10) {
			setMoreInfoError('Message must be at least 10 characters');
			return;
		}

		setMoreInfoError('');
		setActionLoading(true);
		try {
			const token = localStorage.getItem('auth_token');
			const response = await fetch('/api/loans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					action: 'requestMoreInfo',
					loanId: loan.id,
					adminNotes: moreInfoNotes.trim(),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to request more information');
			}

			const updatedLoan = await response.json();
			// Optimistic update: immediately update the loan state
			setLoan(updatedLoan);
			setShowMoreInfoModal(false);
			setMoreInfoNotes('');
			setMoreInfoError('');
			setAlertMessage('Request for more information sent successfully');
			setAlertType('success');
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to request more information');
			setAlertType('error');
			setShowAlert(true);
		} finally {
			setActionLoading(false);
		}
	};

	const handleReject = async (rejectionReason: string) => {
		if (!loan) return;

		setActionLoading(true);
		try {
			const token = localStorage.getItem('auth_token');
			const response = await fetch('/api/loans', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					action: 'reject',
					loanId: loan.id,
					adminNotes: rejectionReason,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to reject loan');
			}

			const updatedLoan = await response.json();
			// Optimistic update: immediately update the loan state
			setLoan(updatedLoan);
			setShowRejectModal(false);
			setAlertMessage('Loan rejected successfully');
			setAlertType('success');
			setShowAlert(true);

			// Refresh the loan list in the background (if user navigates back)
			// This ensures data consistency across views
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to reject loan');
			setAlertType('error');
			setShowAlert(true);
		} finally {
			setActionLoading(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const statusColors: Record<string, string> = {
			PENDING: 'bg-yellow-100 text-yellow-800',
			APPROVED: 'bg-green-100 text-green-800',
			REJECTED: 'bg-red-100 text-red-800',
			NEEDS_MORE_INFO: 'bg-blue-100 text-blue-800',
			ACTIVE: 'bg-purple-100 text-purple-800',
			PAID: 'bg-gray-100 text-gray-800',
			DEFAULTED: 'bg-red-100 text-red-800',
		};

		return (
			<span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
				{status.replace('_', ' ')}
			</span>
		);
	};

	if (loading) {
		return (
			<ProloansLayout>
				<div className="text-center py-12">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<p className="mt-2 text-gray-600">Loading loan details...</p>
				</div>
			</ProloansLayout>
		);
	}

	if (error || !loan) {
		return (
			<ProloansLayout>
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error || 'Loan not found'}
				</div>
				<div className="mt-4">
					<Link to="/loan-requests" className="text-blue-600 hover:text-blue-800">
						← Back to Loan Requests
					</Link>
				</div>
			</ProloansLayout>
		);
	}

	return (
		<ProloansLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<Link to="/loan-requests" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
							← Back to Loan Requests
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Loan Request Details</h1>
						<p className="mt-2 text-sm text-gray-600">Loan Number: {loan.loanNumber}</p>
					</div>
					<div className="flex items-center gap-4">
						{getStatusBadge(loan.status)}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Loan Information */}
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Loan Information</h2>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-gray-500">Loan Type</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.type.replace('_', ' ')}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Amount</dt>
								<dd className="mt-1 text-sm text-gray-900">${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.rate}%</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Start Date</dt>
								<dd className="mt-1 text-sm text-gray-900">{new Date(loan.startDate).toLocaleDateString()}</dd>
							</div>
							{loan.endDate && (
								<div>
									<dt className="text-sm font-medium text-gray-500">End Date</dt>
									<dd className="mt-1 text-sm text-gray-900">{new Date(loan.endDate).toLocaleDateString()}</dd>
								</div>
							)}
							{loan.description && (
								<div>
									<dt className="text-sm font-medium text-gray-500">Description</dt>
									<dd className="mt-1 text-sm text-gray-900">{loan.description}</dd>
								</div>
							)}
							<div>
								<dt className="text-sm font-medium text-gray-500">Request Source</dt>
								<dd className="mt-1 text-sm text-gray-900 capitalize">{loan.requestSource || 'Web'}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Requested On</dt>
								<dd className="mt-1 text-sm text-gray-900">{new Date(loan.createdAt).toLocaleString()}</dd>
							</div>
						</dl>
					</div>

					{/* Borrower Information */}
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Borrower Information</h2>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-gray-500">Name</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.user.name}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Email</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.user.email}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Account Number</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.user.accountNumber}</dd>
							</div>
							{loan.user.creditScore && (
								<div>
									<dt className="text-sm font-medium text-gray-500">Credit Score</dt>
									<dd className="mt-1 text-sm text-gray-900">{loan.user.creditScore}</dd>
								</div>
							)}
							<div>
								<dt className="text-sm font-medium text-gray-500">Branch</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.branch.name}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Company</dt>
								<dd className="mt-1 text-sm text-gray-900">{loan.branch.company.name}</dd>
							</div>
						</dl>
					</div>
				</div>

				{/* Admin Notes */}
				{loan.adminNotes && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Admin Notes</h2>
						<p className="text-sm text-gray-700 whitespace-pre-wrap">{loan.adminNotes}</p>
						{loan.reviewedAt && (
							<p className="mt-2 text-xs text-gray-500">
								Reviewed on: {new Date(loan.reviewedAt).toLocaleString()}
							</p>
						)}
					</div>
				)}

				{/* Actions */}
				{loan.status === 'PENDING' ? (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Actions</h2>
						<p className="text-sm text-gray-600 mb-4">
							Review this loan request and take an action. Once an action is taken, the loan status will be updated.
						</p>
						<div className="flex flex-wrap gap-4">
							<button
								onClick={() => setShowApproveModal(true)}
								disabled={actionLoading}
								className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								Approve Loan
							</button>
							<button
								onClick={() => {
									setShowMoreInfoModal(true);
									setMoreInfoError('');
								}}
								disabled={actionLoading}
								className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								Request More Info
							</button>
							<button
								onClick={() => setShowRejectModal(true)}
								disabled={actionLoading}
								className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								Reject Loan
							</button>
						</div>
					</div>
				) : loan.status === 'NEEDS_MORE_INFO' ? (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Actions</h2>
						<p className="text-sm text-gray-600 mb-4">
							This loan is waiting for more information from the borrower. You can approve or reject it once the information is received.
						</p>
						<div className="flex flex-wrap gap-4">
							<button
								onClick={() => setShowApproveModal(true)}
								disabled={actionLoading}
								className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								Approve Loan
							</button>
							<button
								onClick={() => setShowRejectModal(true)}
								disabled={actionLoading}
								className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
							>
								Reject Loan
							</button>
						</div>
					</div>
				) : (
					<div className="bg-gray-50 rounded-lg p-6">
						<p className="text-sm text-gray-600">
							This loan has been {loan.status.toLowerCase().replace('_', ' ')}. No further actions available.
						</p>
						{loan.reviewedAt && (
							<p className="text-xs text-gray-500 mt-2">
								Reviewed on: {new Date(loan.reviewedAt).toLocaleString()}
							</p>
						)}
					</div>
				)}

				{/* Approve Confirmation Modal */}
				<ConfirmModal
					isOpen={showApproveModal}
					onClose={() => setShowApproveModal(false)}
					onConfirm={handleApprove}
					title="Approve Loan Request"
					message={
						<div>
							<p className="mb-2">Are you sure you want to approve this loan request?</p>
							{loan && (
								<div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
									<p className="text-sm font-medium text-green-900">Loan Details:</p>
									<ul className="text-sm text-green-800 mt-1 space-y-1">
										<li>Loan Number: {loan.loanNumber}</li>
										<li>Amount: ${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
										<li>Borrower: {loan.user.name}</li>
									</ul>
								</div>
							)}
						</div>
					}
					confirmLabel="Approve Loan"
					cancelLabel="Cancel"
					confirmColor="green"
					isLoading={actionLoading}
				/>

				{/* Reject Modal */}
				<RejectLoanModal
					isOpen={showRejectModal}
					onClose={() => setShowRejectModal(false)}
					onConfirm={handleReject}
					loanNumber={loan?.loanNumber}
					isLoading={actionLoading}
				/>

				{/* Request More Info Modal */}
				{showMoreInfoModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-300">
							<div className="p-6">
								<h3 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-2">
									Request More Information
								</h3>
								{loan && (
									<p className="text-sm text-gray-600 font-montserrat-regular mb-4">
										Loan Number: <span className="font-medium">{loan.loanNumber}</span>
									</p>
								)}
								<p className="text-gray-700 font-montserrat-regular mb-4">
									Please specify what information you need from the borrower. This message will be shared with them.
								</p>
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2 font-montserrat-medium">
										Message <span className="text-red-500">*</span>
									</label>
									<textarea
										value={moreInfoNotes}
										onChange={(e) => {
											setMoreInfoNotes(e.target.value);
											setMoreInfoError('');
										}}
										placeholder="Enter the information you need from the borrower..."
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${moreInfoError ? 'border-red-500' : 'border-gray-300'
											}`}
										rows={5}
										disabled={actionLoading}
									/>
									{moreInfoError && (
										<p className="text-sm text-red-600 font-montserrat-regular mt-1">{moreInfoError}</p>
									)}
									<p className="text-xs text-gray-500 font-montserrat-regular mt-1">
										Minimum 10 characters required
									</p>
								</div>
								<div className="flex justify-end gap-3">
									<button
										onClick={() => {
											setShowMoreInfoModal(false);
											setMoreInfoNotes('');
											setMoreInfoError('');
										}}
										disabled={actionLoading}
										className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium"
									>
										Cancel
									</button>
									<button
										onClick={handleRequestMoreInfo}
										disabled={actionLoading || !moreInfoNotes.trim()}
										className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-montserrat-medium"
									>
										{actionLoading ? (
											<span className="flex items-center">
												<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Sending...
											</span>
										) : (
											'Send Request'
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				<AlertModal
					isOpen={showAlert}
					onClose={() => setShowAlert(false)}
					type={alertType}
					title={alertType === 'success' ? 'Success' : alertType === 'error' ? 'Error' : 'Notification'}
					message={alertMessage}
				/>
			</div>
		</ProloansLayout>
	);
}

