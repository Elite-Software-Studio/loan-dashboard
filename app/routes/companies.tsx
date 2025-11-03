import { useState, useEffect } from 'react';
import { ProloansLayout } from '../components/ProloansLayout';

interface Company {
    id: string;
    name: string;
    code: string;
    legalName?: string | null;
    taxId?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        branches: number;
    };
}

interface AddCompanyForm {
    name: string;
    code: string;
    legalName: string;
    taxId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    website: string;
}

export function meta() {
    return [
        { title: "Companies - Proloans" },
        { name: "description", content: "Manage companies and organizations" },
    ];
}

export default function Companies() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Default values for dev mode testing
    const getDefaultFormValues = (): AddCompanyForm => {
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

    const [companyForm, setCompanyForm] = useState<AddCompanyForm>(getDefaultFormValues());
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch companies
    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/companies');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    ...companyForm,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create company');
            }

            const newCompany = await response.json();
            setCompanies(prev => [newCompany, ...prev]);
            setShowAddModal(false);
            setCompanyForm(getDefaultFormValues());
        } catch (error: any) {
            console.error('Error creating company:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof AddCompanyForm, value: string) => {
        setCompanyForm(prev => ({ ...prev, [field]: value }));
    };

    // Filter companies based on search
    const filteredCompanies = companies?.filter(company => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            company.name.toLowerCase().includes(query) ||
            company.code.toLowerCase().includes(query) ||
            company.city?.toLowerCase().includes(query) ||
            company.state?.toLowerCase().includes(query) ||
            company.email?.toLowerCase().includes(query)
        );
    }) || [];

    if (isLoading) {
        return (
            <ProloansLayout>
                <div className="px-6 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-montserrat-regular">Loading companies...</p>
                        </div>
                    </div>
                </div>
            </ProloansLayout>
        );
    }

    return (
        <ProloansLayout>
            <div className="px-6 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold">Companies</h1>
                        <p className="mt-2 text-gray-600 font-montserrat-regular">
                            Manage companies and their branches
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Company</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search companies by name, code, city, or email..."
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

                {/* Companies List */}
                {filteredCompanies.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat-medium">No companies found</h3>
                        <p className="mt-1 text-sm text-gray-500 font-montserrat-regular">
                            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new company.'}
                        </p>
                        {!searchQuery && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-colors inline-flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Add Company</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-1">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-montserrat-regular">
                                            Code: <span className="font-montserrat-medium text-gray-700">{company.code}</span>
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-montserrat-medium ${company.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {company.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {company.legalName && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Legal:</span>
                                            <span className="font-montserrat-regular">{company.legalName}</span>
                                        </div>
                                    )}
                                    {company.taxId && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Tax ID:</span>
                                            <span className="font-montserrat-regular">{company.taxId}</span>
                                        </div>
                                    )}
                                    {(company.city || company.state) && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Location:</span>
                                            <span className="font-montserrat-regular">
                                                {[company.city, company.state].filter(Boolean).join(', ')}
                                                {company.country && `, ${company.country}`}
                                            </span>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Phone:</span>
                                            <span className="font-montserrat-regular">{company.phone}</span>
                                        </div>
                                    )}
                                    {company.email && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Email:</span>
                                            <span className="font-montserrat-regular">{company.email}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-montserrat-medium w-20">Website:</span>
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-montserrat-regular text-green-600 hover:text-green-700 underline"
                                            >
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 font-montserrat-regular">
                                            Branches: <span className="font-montserrat-medium text-gray-900">{company._count?.branches || 0}</span>
                                        </span>
                                        <span className="text-xs text-gray-400 font-montserrat-regular">
                                            Created: {new Date(company.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Company Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mt-40">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">
                                    Create New Company
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Company Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                                                    Company Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={companyForm.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
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
                                                    onChange={(e) => handleInputChange('legalName', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('taxId', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('state', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('country', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                                    placeholder="https://example.com"
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddModal(false)}
                                                className="px-6 py-3 border border-gray-300 rounded-xl font-montserrat-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-montserrat-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isSubmitting ? 'Creating...' : 'Create Company'}
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

