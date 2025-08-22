import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accountNumber: string;
    creditScore?: number;
    internalRiskScore?: number;
    maxRiskScore?: number;
    averageRate?: number;
    totalBorrowed: number;
    totalRepaid: number;
    memberType?: string;
    loans?: any[];
}

interface Loan {
    id: string;
    loanNumber: string;
    type: string;
    amount: number;
    rate: number;
    startDate: string;
    status: string;
    description: string;
}

// Mock data for the user details
const mockUserData: { [key: string]: User } = {
    '1': {
        id: '1',
        email: 'admin@proloans.com',
        name: 'Admin User',
        role: 'ADMIN',
        accountNumber: 'ACC001',
        creditScore: 820,
        internalRiskScore: 16.66,
        maxRiskScore: 18.0,
        averageRate: 12.21,
        totalBorrowed: 500000.0,
        totalRepaid: 100000.0,
        memberType: 'ELITE',
        loans: []
    },
    '2': {
        id: '2',
        email: 'kiran.nair@example.com',
        name: 'Kiran Nair',
        role: 'MANAGER',
        accountNumber: '7388333939',
        creditScore: 780,
        internalRiskScore: 16.66,
        maxRiskScore: 18.0,
        averageRate: 12.21,
        totalBorrowed: 901122.11,
        totalRepaid: 213428.71,
        memberType: 'ELITE',
        loans: [
            {
                id: '1',
                loanNumber: 'HML9932828823',
                type: 'Home Loan',
                amount: 450000,
                rate: 9.12,
                startDate: '21/12/2020',
                status: 'ACTIVE',
                description: 'Home purchase loan'
            },
            {
                id: '2',
                loanNumber: 'CRL9932828823',
                type: 'Car Loan',
                amount: 35000,
                rate: 12.22,
                startDate: '21/12/2020',
                status: 'ACTIVE',
                description: 'Vehicle financing'
            },
            {
                id: '3',
                loanNumber: 'BSL9932828823',
                type: 'Business Loan',
                amount: 200000,
                rate: 11.12,
                startDate: '21/12/2020',
                status: 'ACTIVE',
                description: 'Business expansion'
            }
        ]
    },
    '3': {
        id: '3',
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        role: 'USER',
        accountNumber: 'ACC003',
        creditScore: 720,
        internalRiskScore: 14.5,
        maxRiskScore: 18.0,
        averageRate: 13.5,
        totalBorrowed: 250000.0,
        totalRepaid: 75000.0,
        memberType: 'REGULAR',
        loans: []
    },
    '4': {
        id: '4',
        email: 'lisa.chen@example.com',
        name: 'Lisa Chen',
        role: 'USER',
        accountNumber: 'ACC004',
        creditScore: 750,
        internalRiskScore: 13.8,
        maxRiskScore: 18.0,
        averageRate: 12.8,
        totalBorrowed: 180000.0,
        totalRepaid: 45000.0,
        memberType: 'REGULAR',
        loans: []
    },
    '5': {
        id: '5',
        email: 'sarah.wilson@example.com',
        name: 'Sarah Wilson',
        role: 'USER',
        accountNumber: 'ACC005',
        creditScore: 795,
        internalRiskScore: 15.2,
        maxRiskScore: 18.0,
        averageRate: 11.85,
        totalBorrowed: 650000.0,
        totalRepaid: 180000.0,
        memberType: 'PREMIUM',
        loans: []
    }
};

const tabs = [
    { id: 'summary', name: 'Summary', icon: '📊' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'activity', name: 'Activity', icon: '📈' },
    { id: 'collateral', name: 'Collateral', icon: '🏠' }
];

export default function UserDetails() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('summary');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userId = searchParams.get('id');
        if (userId && mockUserData[userId]) {
            setUser(mockUserData[userId]);
        }
    }, [searchParams]);

    if (!user) {
        return (
            <ProloansLayout>
                <div className="px-6 py-8">
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg font-medium">User not found</div>
                        <Link to="/users" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                            ← Back to Users
                        </Link>
                    </div>
                </div>
            </ProloansLayout>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getCreditScoreLabel = (score: number) => {
        if (score >= 750) return 'EXCELLENT';
        if (score >= 700) return 'GOOD';
        if (score >= 650) return 'FAIR';
        return 'POOR';
    };

    const getCreditScoreColor = (score: number) => {
        if (score >= 750) return 'text-green-600';
        if (score >= 700) return 'text-yellow-600';
        if (score >= 650) return 'text-orange-600';
        return 'text-red-600';
    };

    const renderSummaryTab = () => (
        <div className="space-y-6">
            {/* User Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - User Profile */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ⭐ ELITE MEMBER
                                </span>
                            </div>
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
                            <p className="text-sm text-gray-600">ID: {user.accountNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Financial Overview */}
                <div className="lg:col-span-2 space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Borrowed</h4>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalBorrowed)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Repaid</h4>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.totalRepaid)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                Internal Risk Score
                                <span className="ml-1 text-gray-400 cursor-help">ℹ️</span>
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">
                                {user.internalRiskScore?.toFixed(2)} / {user.maxRiskScore?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Average Rate</h4>
                            <p className="text-2xl font-bold text-green-600">{user.averageRate?.toFixed(2)}%</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Credit Score</h4>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-2xl font-bold ${getCreditScoreColor(user.creditScore || 0)}`}>
                                        {getCreditScoreLabel(user.creditScore || 0)}
                                    </p>
                                    <p className="text-xs text-gray-500">Last checked 3 days ago</p>
                                </div>
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                                        <div className="text-sm font-bold text-gray-900">{user.creditScore}</div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Loans Section */}
            {user.loans && user.loans.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Active Loans ({user.loans.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {user.loans.map((loan: Loan) => (
                            <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                                    <span className="text-4xl">
                                        {loan.type === 'Home Loan' ? '🏠' :
                                            loan.type === 'Car Loan' ? '🚗' : '🏢'}
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-2">{loan.type}</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>ID: {loan.loanNumber}</p>
                                    <p>Rate: {loan.rate.toFixed(2)}%</p>
                                    <p>Start Date: {loan.startDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderDocumentsTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
            <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📄</div>
                <p>No documents uploaded yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Upload Document
                </button>
            </div>
        </div>
    );

    const renderPaymentsTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
            <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">💳</div>
                <p>No payment history available</p>
            </div>
        </div>
    );

    const renderActivityTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h3>
            <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📈</div>
                <p>No recent activity</p>
            </div>
        </div>
    );

    const renderCollateralTab = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Collateral</h3>
            <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🏠</div>
                <p>No collateral information</p>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'summary':
                return renderSummaryTab();
            case 'documents':
                return renderDocumentsTab();
            case 'payments':
                return renderPaymentsTab();
            case 'activity':
                return renderActivityTab();
            case 'collateral':
                return renderCollateralTab();
            default:
                return renderSummaryTab();
        }
    };

    return (
        <ProloansLayout>
            <div className="px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <nav className="flex mt-2" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                                    <li><Link to="/users" className="hover:text-gray-700">All Accounts</Link></li>
                                    <li className="flex items-center">
                                        <span className="mx-2">/</span>
                                        <span>Account {user.accountNumber}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mx-2">/</span>
                                        <span>Beneficiary</span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mx-2">/</span>
                                        <span className="text-gray-900">{user.name}</span>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Modify Details
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Update Loan
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </ProloansLayout>
    );
}
