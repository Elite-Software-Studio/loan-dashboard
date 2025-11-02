import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '../lib/trpc-client';
import { ModalForm } from './ModalForm';
import { FormField, FormInput, FormSelect, FormTextarea, FormCurrencyInput, FormGrid, FormSection } from './FormField';

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

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Default values for dev mode testing
    const getDefaultFormValues = (): AddUserForm => {
        if (import.meta.env.DEV) {
            return {
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'USER',
                accountNumber: 'ACC' + Date.now().toString().slice(-6),
                creditScore: '750',
                internalRiskScore: '15.0',
                maxRiskScore: '18.0',
                averageRate: '12.5',
                totalBorrowed: '100000',
                totalRepaid: '25000',
                memberType: 'PREMIUM',
                notes: 'Test user created in dev mode'
            };
        }
        return {
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
        };
    };

    const [addUserForm, setAddUserForm] = useState<AddUserForm>(getDefaultFormValues());

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

    // Try to use tRPC, fallback to API
    const { data: tRPCUsers, isLoading: tRPCLoading } = trpc.getUsers.useQuery(undefined, {
        enabled: false, // We'll use the manual fetch for now
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.log('API failed:', err);
                setError('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleInputChange = (field: keyof AddUserForm, value: string) => {
        setAddUserForm(prev => ({ ...prev, [field]: value }));
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (addUserForm.email && !emailRegex.test(addUserForm.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (addUserForm.creditScore) {
            const score = parseInt(addUserForm.creditScore);
            if (isNaN(score) || score < 300 || score > 850) {
                errors.creditScore = 'Credit score must be between 300 and 850';
            }
        }

        if (addUserForm.internalRiskScore) {
            const score = parseFloat(addUserForm.internalRiskScore);
            if (isNaN(score) || score < 0 || score > 18) {
                errors.internalRiskScore = 'Internal risk score must be between 0 and 18';
            }
        }

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
            const newUser: User = {
                id: `user-${Date.now()}`,
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

            setUsers(prev => [newUser, ...prev]);
            setShowAddUserModal(false);
            setAddUserForm(getDefaultFormValues());
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

        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.accountNumber.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            (user.memberType?.toLowerCase().includes(query) || false)
        );
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-montserrat-regular">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Add Button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">Users</h2>
                    <p className="mt-1 text-sm text-gray-600 font-montserrat-regular">
                        Manage all users and their accounts ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
                    </p>
                </div>
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-montserrat-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add User</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users by name, email, account number, role, or member type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                    <svg
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Users Table */}
            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-montserrat-medium">{error}</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat-medium">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500 font-montserrat-regular">
                        {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new user.'}
                    </p>
                    {!searchQuery && (
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAddUserModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-colors inline-flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add User</span>
                            </button>
                        </div>
                    )}
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
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
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
                                                <span className="text-sm font-medium text-gray-900">{user.creditScore || 'N/A'}</span>
                                                {user.creditScore && (
                                                    <span className={`ml-2 text-xs ${(user.creditScore || 0) >= 750 ? 'text-green-600' :
                                                        (user.creditScore || 0) >= 700 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                        {(user.creditScore || 0) >= 750 ? 'EXCELLENT' :
                                                            (user.creditScore || 0) >= 700 ? 'GOOD' : 'FAIR'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.internalRiskScore?.toFixed(2) || 'N/A'} / {user.maxRiskScore?.toFixed(2) || '18.0'}
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
                                                {user.memberType || 'REGULAR'}
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
            <ModalForm
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                onSubmit={handleSubmitUser}
                title="Add New User"
                description="Create a new user account"
                submitLabel="Create User"
                isLoading={isSubmitting}
            >
                <div className="space-y-6">
                    <FormSection title="Basic Information">
                        <FormGrid>
                            <FormField label="Full Name" required error={formErrors.name}>
                                <FormInput
                                    type="text"
                                    value={addUserForm.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    error={!!formErrors.name}
                                />
                            </FormField>

                            <FormField label="Email" required error={formErrors.email}>
                                <FormInput
                                    type="email"
                                    value={addUserForm.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={!!formErrors.email}
                                />
                            </FormField>

                            <FormField label="Role" required>
                                <FormSelect
                                    value={addUserForm.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                >
                                    <option value="USER">👤 User</option>
                                    <option value="MANAGER">👨‍💼 Manager</option>
                                    <option value="ADMIN">👑 Admin</option>
                                </FormSelect>
                            </FormField>

                            <FormField label="Account Number" required error={formErrors.accountNumber}>
                                <FormInput
                                    type="text"
                                    value={addUserForm.accountNumber}
                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                    error={!!formErrors.accountNumber}
                                />
                            </FormField>
                        </FormGrid>
                    </FormSection>

                    <FormSection title="Financial Information">
                        <FormGrid>
                            <FormField label="Credit Score" error={formErrors.creditScore}>
                                <FormInput
                                    type="number"
                                    min="300"
                                    max="850"
                                    value={addUserForm.creditScore}
                                    onChange={(e) => handleInputChange('creditScore', e.target.value)}
                                    error={!!formErrors.creditScore}
                                />
                            </FormField>

                            <FormField label="Internal Risk Score" error={formErrors.internalRiskScore}>
                                <FormInput
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="18"
                                    value={addUserForm.internalRiskScore}
                                    onChange={(e) => handleInputChange('internalRiskScore', e.target.value)}
                                    error={!!formErrors.internalRiskScore}
                                />
                            </FormField>

                            <FormField label="Average Rate (%)" error={formErrors.averageRate}>
                                <FormInput
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={addUserForm.averageRate}
                                    onChange={(e) => handleInputChange('averageRate', e.target.value)}
                                    error={!!formErrors.averageRate}
                                />
                            </FormField>

                            <FormField label="Member Type">
                                <FormSelect
                                    value={addUserForm.memberType}
                                    onChange={(e) => handleInputChange('memberType', e.target.value)}
                                >
                                    <option value="REGULAR">👤 Regular</option>
                                    <option value="PREMIUM">⭐ Premium</option>
                                    <option value="ELITE">👑 Elite</option>
                                    <option value="VIP">💎 VIP</option>
                                </FormSelect>
                            </FormField>

                            <FormField label="Total Borrowed">
                                <FormCurrencyInput
                                    min="0"
                                    step="0.01"
                                    value={addUserForm.totalBorrowed}
                                    onChange={(e) => handleInputChange('totalBorrowed', e.target.value)}
                                />
                            </FormField>

                            <FormField label="Total Repaid">
                                <FormCurrencyInput
                                    min="0"
                                    step="0.01"
                                    value={addUserForm.totalRepaid}
                                    onChange={(e) => handleInputChange('totalRepaid', e.target.value)}
                                />
                            </FormField>
                        </FormGrid>
                    </FormSection>

                    <FormField label="Notes (Optional)">
                        <FormTextarea
                            value={addUserForm.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={3}
                            placeholder="Add any additional notes about this user..."
                        />
                    </FormField>
                </div>
            </ModalForm>
        </div>
    );
}

