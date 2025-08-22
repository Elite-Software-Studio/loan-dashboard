import type { Route } from "./+types/users";
import { ProloansLayout } from "../components/ProloansLayout";
import { trpc } from "../lib/trpc-client";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Users - Proloans" },
        { name: "description", content: "Manage users and accounts" },
    ];
}

export default function Users() {
    const { data: users, isLoading } = trpc.getUsers.useQuery();

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
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all user accounts and their loan information
                    </p>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">All Users</h2>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Add New User
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Account
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Credit Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Borrowed
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Active Loans
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Risk Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users?.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.accountNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMemberTypeColor(user.memberType || 'REGULAR')}`}>
                                                {user.memberType || 'REGULAR'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${getCreditScoreColor(user.creditScore || 0)}`}>
                                                {user.creditScore || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(user.totalBorrowed)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.loans?.filter(loan => loan.status === 'ACTIVE').length || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.internalRiskScore ? `${user.internalRiskScore.toFixed(2)} / ${user.maxRiskScore?.toFixed(2) || '18.00'}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Stats */}
                {users && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Elite Members</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.memberType === 'ELITE').length}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Total Loans</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.reduce((acc, user) => acc + (user.loans?.length || 0), 0)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Total Borrowed</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(users.reduce((acc, user) => acc + user.totalBorrowed, 0))}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ProloansLayout>
    );
}
