import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';
import { AlertModal } from '../components/AlertModal';

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
	const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
	const [moreInfoNotes, setMoreInfoNotes] = useState('');

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
			setLoan(updatedLoan);
			setAlertMessage('Loan approved successfully');
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to approve loan');
			setShowAlert(true);
		} finally {
			setActionLoading(false);
		}
	};

	const handleRequestMoreInfo = async () => {
		if (!loan || !moreInfoNotes.trim()) {
			setAlertMessage('Please provide notes when requesting more information');
			setShowAlert(true);
			return;
		}

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
					adminNotes: moreInfoNotes,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to request more information');
			}

			const updatedLoan = await response.json();
			setLoan(updatedLoan);
			setShowMoreInfoModal(false);
			setMoreInfoNotes('');
			setAlertMessage('Request for more information sent successfully');
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to request more information');
			setShowAlert(true);
		} finally {
			setActionLoading(false);
		}
	};

	const handleReject = async () => {
		if (!loan) return;

		if (!confirm('Are you sure you want to reject this loan request?')) {
			return;
		}

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
					adminNotes: 'Loan rejected by admin',
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to reject loan');
			}

			const updatedLoan = await response.json();
			setLoan(updatedLoan);
			setAlertMessage('Loan rejected successfully');
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || 'Failed to reject loan');
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
				{loan.status === 'PENDING' || loan.status === 'NEEDS_MORE_INFO' ? (
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">Actions</h2>
						<div className="flex flex-wrap gap-4">
							<button
								onClick={handleApprove}
								disabled={actionLoading}
								className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{actionLoading ? 'Processing...' : 'Approve Loan'}
							</button>
							<button
								onClick={() => setShowMoreInfoModal(true)}
								disabled={actionLoading}
								className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Request More Info
							</button>
							<button
								onClick={handleReject}
								disabled={actionLoading}
								className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
					</div>
				)}

				{/* Request More Info Modal */}
				{showMoreInfoModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
							<h3 className="text-lg font-semibold mb-4">Request More Information</h3>
							<textarea
								value={moreInfoNotes}
								onChange={(e) => setMoreInfoNotes(e.target.value)}
								placeholder="Enter the information you need from the borrower..."
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-900 bg-white placeholder-gray-500"
								rows={5}
							/>
							<div className="flex justify-end gap-4">
								<button
									onClick={() => {
										setShowMoreInfoModal(false);
										setMoreInfoNotes('');
									}}
									className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
								>
									Cancel
								</button>
								<button
									onClick={handleRequestMoreInfo}
									disabled={actionLoading || !moreInfoNotes.trim()}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{actionLoading ? 'Sending...' : 'Send Request'}
								</button>
							</div>
						</div>
					</div>
				)}

				<AlertModal
					isOpen={showAlert}
					onClose={() => setShowAlert(false)}
					type="info"
					title="Notification"
					message={alertMessage}
				/>
			</div>
		</ProloansLayout>
	);
}

