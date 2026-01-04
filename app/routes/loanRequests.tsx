import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';
import { DataTable, type Column } from '../components/DataTable';
import { AlertModal } from '../components/AlertModal';

interface LoanRequest {
	id: string;
	loanNumber: string;
	type: string;
	amount: number;
	rate: number;
	status: string;
	startDate: string;
	description?: string;
	requestSource?: string;
	adminNotes?: string;
	reviewedAt?: string;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
		accountNumber: string;
	};
	branch: {
		id: string;
		name: string;
		company: {
			name: string;
		};
	};
}

export default function LoanRequests() {
	const [loans, setLoans] = useState<LoanRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState({
		status: '',
		requestSource: 'mobile',
		startDate: '',
		endDate: '',
		userId: '',
	});
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		fetchLoanRequests();
	}, [filters]);

	// Refresh when returning to this page (e.g., after taking action on a loan)
	useEffect(() => {
		const handleFocus = () => {
			fetchLoanRequests();
		};
		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, []);

	const fetchLoanRequests = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('auth_token');
			if (!token) {
				setError('Not authenticated. Please log in again.');
				setLoading(false);
				return;
			}

			const params = new URLSearchParams({
				adminView: 'true',
				requestSource: filters.requestSource || 'mobile',
			});

			if (filters.status) params.append('status', filters.status);
			if (filters.startDate) params.append('startDate', filters.startDate);
			if (filters.endDate) params.append('endDate', filters.endDate);
			if (filters.userId) params.append('userId', filters.userId);

			const response = await fetch(`/api/loans?${params.toString()}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				if (response.status === 401 || response.status === 403) {
					setError('Access denied. Admin privileges required. Please log in as an admin user.');
					// Clear invalid token
					localStorage.removeItem('auth_token');
					localStorage.removeItem('proloans-user');
				} else {
					const errorData = await response.json().catch(() => ({ error: 'Failed to fetch loan requests' }));
					setError(errorData.error || 'Failed to fetch loan requests');
				}
				return;
			}

			const data = await response.json();
			setLoans(data);
		} catch (err) {
			console.error('Error fetching loan requests:', err);
			setError('Failed to fetch loan requests. Please check your connection.');
		} finally {
			setLoading(false);
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
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
				{status.replace('_', ' ')}
			</span>
		);
	};

	const columns: Column<LoanRequest>[] = [
		{
			key: 'loanNumber',
			header: 'Loan Number',
			render: (value, loan) => (
				<Link
					to={`/loan-request/${loan.id}`}
					className="text-blue-600 hover:text-blue-800 font-medium"
				>
					{loan.loanNumber}
				</Link>
			),
		},
		{
			key: 'user',
			header: 'Borrower',
			render: (value, loan) => (
				<div>
					<div className="font-medium text-gray-900">{loan.user.name}</div>
					<div className="text-sm text-gray-500">{loan.user.email}</div>
				</div>
			),
		},
		{
			key: 'type',
			header: 'Type',
			render: (value, loan) => (
				<span className="text-gray-900">{loan.type.replace('_', ' ')}</span>
			),
		},
		{
			key: 'amount',
			header: 'Amount',
			render: (value, loan) => (
				<span className="text-gray-900 font-medium">
					${loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</span>
			),
		},
		{
			key: 'rate',
			header: 'Rate',
			render: (value, loan) => (
				<span className="text-gray-900">{loan.rate}%</span>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: (value, loan) => getStatusBadge(loan.status),
		},
		{
			key: 'createdAt',
			header: 'Requested',
			render: (value, loan) => (
				<span className="text-gray-900">{new Date(loan.createdAt).toLocaleDateString()}</span>
			),
		},
		{
			key: 'branch',
			header: 'Branch',
			render: (value, loan) => (
				<span className="text-gray-900">{loan.branch.name}</span>
			),
		},
	];

	return (
		<ProloansLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Loan Requests</h1>
						<p className="mt-2 text-sm text-gray-600">
							Review and manage loan requests from mobile app users
						</p>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white p-4 rounded-lg shadow">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<select
								value={filters.status}
								onChange={(e) => setFilters({ ...filters, status: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
							>
								<option value="">All Statuses</option>
								<option value="PENDING">Pending</option>
								<option value="APPROVED">Approved</option>
								<option value="REJECTED">Rejected</option>
								<option value="NEEDS_MORE_INFO">Needs More Info</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Start Date
							</label>
							<input
								type="date"
								value={filters.startDate}
								onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								End Date
							</label>
							<input
								type="date"
								value={filters.endDate}
								onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								User ID
							</label>
							<input
								type="text"
								value={filters.userId}
								onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
								placeholder="Filter by user ID"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
							/>
						</div>
					</div>
					<div className="mt-4">
						<button
							onClick={() => setFilters({
								status: '',
								requestSource: 'mobile',
								startDate: '',
								endDate: '',
								userId: '',
							})}
							className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						>
							Clear Filters
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				{loading ? (
					<div className="text-center py-12">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-2 text-gray-600">Loading loan requests...</p>
					</div>
				) : (
					<DataTable
						data={loans}
						columns={columns}
						emptyMessage="No loan requests found"
						keyExtractor={(loan) => loan.id}
					/>
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

