import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';

interface UserProfileProps {
    userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [userLoans, setUserLoans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const [userRes, loansRes] = await Promise.all([
                    fetch(`/api/users?id=${userId}`),
                    fetch(`/api/users/${userId}/loans`).catch(() => null),
                ]);

                if (userRes && userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }

                if (loansRes && loansRes.ok) {
                    const loansData = await loansRes.json();
                    setUserLoans(loansData);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
                    <p className="text-gray-500">The requested user profile could not be found.</p>
                    <div className="mt-6">
                        <a
                            href="/users"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            View All Users
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const getCreditScoreColor = (score: number) => {
        if (score >= 750) return 'text-green-600';
        if (score >= 700) return 'text-blue-600';
        if (score >= 650) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCreditScoreLabel = (score: number) => {
        if (score >= 750) return 'EXCELLENT';
        if (score >= 700) return 'GOOD';
        if (score >= 650) return 'FAIR';
        return 'POOR';
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* User Header and Actions */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <div className="flex items-center">
                                    <a href="/users" className="text-gray-500 hover:text-gray-700">
                                        All Accounts
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <a href="#" className="ml-4 text-gray-500 hover:text-gray-700">
                                        Account {user.accountNumber}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4 text-gray-500">Beneficiary</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4 text-gray-900 font-medium">{user.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Modify Details
                    </button>
                    <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Update Loan
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {['Summary', 'Documents', 'Payments', 'Disbursements', 'Activity', 'Collaterals', 'Dependents', 'Due Diligence'].map((tab) => (
                        <a
                            key={tab}
                            href="#"
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${tab === 'Summary'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 relative overflow-hidden">
                        {/* Elite Member Banner */}
                        <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center py-2 text-sm font-medium">
                            # {user.memberType || 'REGULAR'} MEMBER #
                        </div>

                        <div className="mt-8 text-center">
                            {/* Profile Picture */}
                            <div className="mx-auto w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-gray-600">
                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                            <p className="text-sm text-gray-600">ID: {user.accountNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Borrowed</h4>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalBorrowed || 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Repaid</h4>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalRepaid || 0)}</p>
                        </div>
                    </div>

                    {/* Risk and Credit Scores */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-500">Internal Risk Score</h4>
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {user.internalRiskScore?.toFixed(2) || '0.00'} / {user.maxRiskScore?.toFixed(2) || '18.00'}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Average Rate</h4>
                            <p className="text-2xl font-bold text-gray-900">{user.averageRate?.toFixed(2) || '0.00'}%</p>
                        </div>
                    </div>

                    {/* Credit Score Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Credit Score</h4>
                                <p className={`text-lg font-bold ${getCreditScoreColor(user.creditScore || 0)}`}>
                                    {getCreditScoreLabel(user.creditScore || 0)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Last Checked {user.creditScoreLastChecked ? formatDate(user.creditScoreLastChecked) : 'N/A'}
                                </p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        {/* Credit Score Gauge */}
                        <div className="relative">
                            <div className="w-full h-32 bg-gray-200 rounded-full relative overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                    style={{
                                        clipPath: `polygon(0 100%, ${Math.min((user.creditScore || 0) / 850 * 100, 100)}% 100%, ${Math.min((user.creditScore || 0) / 850 * 100, 100)}% 0, 0 0)`
                                    }}
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">{user.creditScore || 0}</div>
                                    <div className="text-sm text-gray-500">850</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Loans Section */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Loans ({userLoans?.length || 0})</h3>
                {userLoans && userLoans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userLoans.map((loan) => (
                            <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Loan Image Placeholder */}
                                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <div className="text-4xl">
                                        {loan.type === 'HOME_LOAN' && '🏠'}
                                        {loan.type === 'CAR_LOAN' && '🚗'}
                                        {loan.type === 'BUSINESS_LOAN' && '🏢'}
                                        {loan.type === 'PERSONAL_LOAN' && '💼'}
                                        {loan.type === 'EDUCATION_LOAN' && '🎓'}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        {loan.type.replace('_', ' ')}
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-2">ID: {loan.loanNumber}</p>
                                    <p className="text-sm text-gray-500 mb-2">Rate: {loan.rate}%</p>
                                    <p className="text-sm text-gray-500">Start Date: {formatDate(loan.startDate)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="mx-auto h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Loans</h3>
                        <p className="text-gray-500">This user doesn't have any active loans at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
