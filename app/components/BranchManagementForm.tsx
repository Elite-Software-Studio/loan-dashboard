import { useState } from 'react';
import { trpc } from '../lib/trpc-client';

export function BranchManagementForm() {
    const [activeTab, setActiveTab] = useState<'company' | 'branch'>('company');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Default values for dev mode testing
    const getDefaultCompanyForm = () => {
        if (import.meta.env.DEV) {
            return {
                name: 'Acme Corporation',
                code: 'ACME001',
                legalName: 'Acme Corporation Inc.',
                taxId: '12-3456789',
                address: '123 Business Street',
                city: 'New York',
                state: 'NY',
                country: 'USA',
                phone: '+1 (555) 123-4567',
                email: 'contact@acmecorp.com',
                website: 'https://acmecorp.com',
            };
        }
        return {
            name: '',
            code: '',
            legalName: '',
            taxId: '',
            address: '',
            city: '',
            state: '',
            country: 'USA',
            phone: '',
            email: '',
            website: '',
        };
    };

    const getDefaultBranchForm = () => {
        if (import.meta.env.DEV) {
            return {
                code: 'BR001',
                name: 'New York Branch',
                companyId: '',
                address: '456 Main Avenue',
                city: 'New York',
                state: 'NY',
                country: 'USA',
                phone: '+1 (555) 987-6543',
                email: 'ny@acmecorp.com',
            };
        }
        return {
            code: '',
            name: '',
            companyId: '',
            address: '',
            city: '',
            state: '',
            country: 'USA',
            phone: '',
            email: '',
        };
    };

    // Company form state
    const [companyForm, setCompanyForm] = useState(getDefaultCompanyForm());

    // Branch form state
    const [branchForm, setBranchForm] = useState(getDefaultBranchForm());

    // tRPC hooks
    const { data: companies, refetch: refetchCompanies } = trpc.getCompanies.useQuery();
    const createCompany = trpc.createCompany.useMutation({
        onSuccess: () => {
            setSuccessMessage('Company created successfully!');
            setShowSuccess(true);
            setCompanyForm(getDefaultCompanyForm());
            refetchCompanies();
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
            setSuccessMessage(`Error: ${error.message}`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        },
    });

    const createBranch = trpc.createBranch.useMutation({
        onSuccess: () => {
            setSuccessMessage('Branch created successfully!');
            setShowSuccess(true);
            setBranchForm(getDefaultBranchForm());
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
            setSuccessMessage(`Error: ${error.message}`);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        },
    });

    const handleCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCompany.mutate({
            ...companyForm,
            website: companyForm.website || undefined,
        });
    };

    const handleBranchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!branchForm.companyId) {
            setSuccessMessage('Please select a company');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }
        createBranch.mutate({
            ...branchForm,
            email: branchForm.email || undefined,
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            {showSuccess && (
                <div
                    className={`mb-6 p-4 rounded-lg ${successMessage.includes('Error')
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-green-100 text-green-800 border border-green-300'
                        }`}
                >
                    {successMessage}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'company'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Create Company
                    </button>
                    <button
                        onClick={() => setActiveTab('branch')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'branch'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Create Branch
                    </button>
                </nav>
            </div>

            {/* Company Form */}
            {activeTab === 'company' && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat-bold">
                        Create New Company
                    </h2>
                    <form onSubmit={handleCompanySubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.name}
                                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    required
                                />
                            </div>

                            {/* Company Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Company Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.code}
                                    onChange={(e) => setCompanyForm({ ...companyForm, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., COMP001, ACME_CORP"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    required
                                />
                            </div>

                            {/* Legal Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Legal Name
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.legalName}
                                    onChange={(e) => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Tax ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Tax ID / EIN
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.taxId}
                                    onChange={(e) => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.address}
                                    onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.city}
                                    onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.state}
                                    onChange={(e) => setCompanyForm({ ...companyForm, state: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={companyForm.country}
                                    onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={companyForm.phone}
                                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={companyForm.email}
                                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={companyForm.website}
                                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                                    placeholder="https://example.com"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={createCompany.isPending}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-montserrat-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {createCompany.isPending ? 'Creating...' : 'Create Company'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Branch Form */}
            {activeTab === 'branch' && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-montserrat-bold">
                        Create New Branch
                    </h2>
                    <form onSubmit={handleBranchSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Selection */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={branchForm.companyId}
                                    onChange={(e) => setBranchForm({ ...branchForm, companyId: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    required
                                >
                                    <option value="">Select a company</option>
                                    {companies?.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name} ({company.code})
                                        </option>
                                    ))}
                                </select>
                                {!companies || companies.length === 0 && (
                                    <p className="mt-2 text-sm text-amber-600">
                                        No companies found. Please create a company first.
                                    </p>
                                )}
                            </div>

                            {/* Branch Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Branch Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.code}
                                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., BR001, NYC, LAX"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    required
                                />
                            </div>

                            {/* Branch Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Branch Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.name}
                                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                    required
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.address}
                                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.city}
                                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.state}
                                    onChange={(e) => setBranchForm({ ...branchForm, state: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={branchForm.country}
                                    onChange={(e) => setBranchForm({ ...branchForm, country: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={branchForm.phone}
                                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={branchForm.email}
                                    onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={createBranch.isPending || !companies || companies.length === 0}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-montserrat-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {createBranch.isPending ? 'Creating...' : 'Create Branch'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

