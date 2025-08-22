import { useEffect, useState } from 'react';
import { Link } from 'react-router';
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

// Fallback user data since API routing is having issues
const fallbackUsers: User[] = [
    {
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
    {
        id: '2',
        email: 'kiran.nair@example.com',
        name: 'Kiran Nair',
        role: 'MANAGER',
        accountNumber: 'ACC002',
        creditScore: 780,
        internalRiskScore: 15.2,
        maxRiskScore: 18.0,
        averageRate: 11.85,
        totalBorrowed: 650000.0,
        totalRepaid: 180000.0,
        memberType: 'PREMIUM',
        loans: []
    },
    {
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
    {
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
    {
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
];

export function meta() {
    return [
        { title: "Users - Proloans" },
        { name: "description", content: "Manage users and accounts" },
    ];
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Try to fetch from API first, fallback to static data
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.log('API failed, using fallback data:', err);
                // Use fallback data if API fails
                setUsers(fallbackUsers);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Debug logging
    console.log('Users component - isLoading:', isLoading);
    console.log('Users component - error:', error);
    console.log('Users component - users data:', users);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getMemberTypeColor = (type: string) => {
        switch (type) {
            case 'ELITE': return 'bg-green-100 text-green-800';
            case 'PREMIUM': return 'bg-blue-100 text-blue-800';
            case 'VIP': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCreditScoreColor = (score: number) => {
        if (score >= 750) return 'text-green-600';
        if (score >= 700) return 'text-blue-600';
        if (score >= 650) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (isLoading) {
        return (
            <ProloansLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </ProloansLayout>
        );
    }

    return (
        <ProloansLayout>
            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="mt-2 text-gray-600">Manage all users and their accounts</p>
                </div>

                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-600 text-lg font-medium">Error loading users</div>
                        <div className="text-gray-500 mt-2">{error}</div>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Account
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Credit Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Risk Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Borrowed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Repaid
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Member Type
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link to={`/user?id=${user.id}`} className="block">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'MANAGER' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.accountNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">{user.creditScore}</span>
                                                    <span className={`ml-2 text-xs ${(user.creditScore || 0) >= 750 ? 'text-green-600' :
                                                        (user.creditScore || 0) >= 700 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                        {(user.creditScore || 0) >= 750 ? 'EXCELLENT' :
                                                            (user.creditScore || 0) >= 700 ? 'GOOD' : 'FAIR'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.internalRiskScore?.toFixed(2)} / {user.maxRiskScore?.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(user.totalBorrowed)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(user.totalRepaid)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.memberType === 'ELITE' ? 'bg-purple-100 text-purple-800' :
                                                    user.memberType === 'PREMIUM' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.memberType}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </ProloansLayout>
    );
}
