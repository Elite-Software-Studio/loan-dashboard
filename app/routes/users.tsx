import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';

interface AddUserForm {
    name: string;
    email: string;
    role: string;
    accountNumber: string;
    creditScore: string;
    internalRiskScore: string;
    maxRiskScore: string;
    averageRate: string;
    totalBorrowed: string;
    totalRepaid: string;
    memberType: string;
    notes: string;
}

interface FormErrors {
    name: string;
    email: string;
    role: string;
    accountNumber: string;
    creditScore: string;
    internalRiskScore: string;
    maxRiskScore: string;
    averageRate: string;
    totalBorrowed: string;
    totalRepaid: string;
    memberType: string;
}

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
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [addUserForm, setAddUserForm] = useState<AddUserForm>({
        name: '',
        email: '',
        role: 'USER',
        accountNumber: '',
        creditScore: '',
        internalRiskScore: '',
        maxRiskScore: '18.0',
        averageRate: '',
        totalBorrowed: '0',
        totalRepaid: '0',
        memberType: 'REGULAR',
        notes: ''
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        name: '',
        email: '',
        role: '',
        accountNumber: '',
        creditScore: '',
        internalRiskScore: '',
        maxRiskScore: '',
        averageRate: '',
        totalBorrowed: '',
        totalRepaid: '',
        memberType: ''
    });

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

    const handleInputChange = (field: keyof AddUserForm, value: string) => {
        setAddUserForm(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {
            name: '',
            email: '',
            role: '',
            accountNumber: '',
            creditScore: '',
            internalRiskScore: '',
            maxRiskScore: '',
            averageRate: '',
            totalBorrowed: '',
            totalRepaid: '',
            memberType: ''
        };

        if (!addUserForm.name.trim()) errors.name = 'Name is required';
        if (!addUserForm.email.trim()) errors.email = 'Email is required';
        if (!addUserForm.accountNumber.trim()) errors.accountNumber = 'Account number is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (addUserForm.email && !emailRegex.test(addUserForm.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Credit score validation
        if (addUserForm.creditScore) {
            const score = parseInt(addUserForm.creditScore);
            if (isNaN(score) || score < 300 || score > 850) {
                errors.creditScore = 'Credit score must be between 300 and 850';
            }
        }

        // Risk score validation
        if (addUserForm.internalRiskScore) {
            const score = parseFloat(addUserForm.internalRiskScore);
            if (isNaN(score) || score < 0 || score > 18) {
                errors.internalRiskScore = 'Internal risk score must be between 0 and 18';
            }
        }

        // Rate validation
        if (addUserForm.averageRate) {
            const rate = parseFloat(addUserForm.averageRate);
            if (isNaN(rate) || rate < 0 || rate > 100) {
                errors.averageRate = 'Average rate must be between 0 and 100';
            }
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    };

    const handleSubmitUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create new user object
            const newUser: User = {
                id: `user-${Date.now()}`, // Generate temporary ID
                name: addUserForm.name.trim(),
                email: addUserForm.email.trim(),
                role: addUserForm.role,
                accountNumber: addUserForm.accountNumber.trim(),
                creditScore: addUserForm.creditScore ? parseInt(addUserForm.creditScore) : undefined,
                internalRiskScore: addUserForm.internalRiskScore ? parseFloat(addUserForm.internalRiskScore) : undefined,
                maxRiskScore: addUserForm.maxRiskScore ? parseFloat(addUserForm.maxRiskScore) : 18.0,
                averageRate: addUserForm.averageRate ? parseFloat(addUserForm.averageRate) : undefined,
                totalBorrowed: parseFloat(addUserForm.totalBorrowed || '0'),
                totalRepaid: parseFloat(addUserForm.totalRepaid || '0'),
                memberType: addUserForm.memberType,
                loans: []
            };

            // Add to users list
            setUsers(prev => [newUser, ...prev]);

            // Close modal and reset form
            setShowAddUserModal(false);
            handleResetForm();

            // Show success message (you could add a toast notification here)
            console.log('User added successfully:', newUser);

        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setAddUserForm({
            name: '',
            email: '',
            role: 'USER',
            accountNumber: '',
            creditScore: '',
            internalRiskScore: '',
            maxRiskScore: '18.0',
            averageRate: '',
            totalBorrowed: '0',
            totalRepaid: '0',
            memberType: 'REGULAR',
            notes: ''
        });
        setFormErrors({
            name: '',
            email: '',
            role: '',
            accountNumber: '',
            creditScore: '',
            internalRiskScore: '',
            maxRiskScore: '',
            averageRate: '',
            totalBorrowed: '',
            totalRepaid: '',
            memberType: ''
        });
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold">Users</h1>
                        <p className="mt-2 text-gray-600 font-montserrat-regular">Manage all users and their accounts</p>
                    </div>
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add User</span>
                    </button>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Account
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Credit Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Risk Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Total Borrowed
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
                                            Total Repaid
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-semibold">
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

                {/* Add User Modal */}
                {showAddUserModal && (
                    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 mt-40">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-white/20">
                            {/* Modal Header - Fixed */}
                            <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">Add New User</h2>
                                        <p className="mt-1 text-gray-600 font-montserrat-medium">Create a new user account</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddUserModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-8">
                                    <form onSubmit={handleSubmitUser} className="space-y-6">
                                        {/* Basic Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={addUserForm.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Enter full name"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.name && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.name}</p>
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={addUserForm.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder="Enter email address"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.email && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.email}</p>
                                                )}
                                            </div>

                                            {/* Role */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Role <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={addUserForm.role}
                                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                                                >
                                                    <option value="USER">👤 User</option>
                                                    <option value="MANAGER">👨‍💼 Manager</option>
                                                    <option value="ADMIN">👑 Admin</option>
                                                </select>
                                            </div>

                                            {/* Account Number */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Account Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={addUserForm.accountNumber}
                                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                                    placeholder="Enter account number"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.accountNumber && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.accountNumber}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Financial Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Credit Score */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Credit Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="300"
                                                    max="850"
                                                    value={addUserForm.creditScore}
                                                    onChange={(e) => handleInputChange('creditScore', e.target.value)}
                                                    placeholder="300-850"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.creditScore ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.creditScore && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.creditScore}</p>
                                                )}
                                            </div>

                                            {/* Internal Risk Score */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Internal Risk Score
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="18"
                                                    value={addUserForm.internalRiskScore}
                                                    onChange={(e) => handleInputChange('internalRiskScore', e.target.value)}
                                                    placeholder="0.0-18.0"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.internalRiskScore ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.internalRiskScore && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.internalRiskScore}</p>
                                                )}
                                            </div>

                                            {/* Average Rate */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Average Rate (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={addUserForm.averageRate}
                                                    onChange={(e) => handleInputChange('averageRate', e.target.value)}
                                                    placeholder="0.00-100.00"
                                                    className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.averageRate ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                                {formErrors.averageRate && (
                                                    <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.averageRate}</p>
                                                )}
                                            </div>

                                            {/* Member Type */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Member Type
                                                </label>
                                                <select
                                                    value={addUserForm.memberType}
                                                    onChange={(e) => handleInputChange('memberType', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                                                >
                                                    <option value="REGULAR">👤 Regular</option>
                                                    <option value="PREMIUM">⭐ Premium</option>
                                                    <option value="ELITE">👑 Elite</option>
                                                    <option value="VIP">💎 VIP</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Financial Totals */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Total Borrowed */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Total Borrowed
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500 font-montserrat-medium">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={addUserForm.totalBorrowed}
                                                        onChange={(e) => handleInputChange('totalBorrowed', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Total Repaid */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Total Repaid
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-gray-500 font-montserrat-medium">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={addUserForm.totalRepaid}
                                                        onChange={(e) => handleInputChange('totalRepaid', e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                Notes (Optional)
                                            </label>
                                            <textarea
                                                value={addUserForm.notes}
                                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                                rows={3}
                                                placeholder="Add any additional notes about this user..."
                                                className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                                            />
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex items-center justify-end space-x-4 pt-6">
                                            <button
                                                type="button"
                                                onClick={handleResetForm}
                                                className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-200 font-montserrat-medium hover:scale-105"
                                            >
                                                Reset Form
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-montserrat-medium flex items-center space-x-2 hover:scale-105 shadow-lg"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Creating User...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Create User</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProloansLayout>
    );
}
