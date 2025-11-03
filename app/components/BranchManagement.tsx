import { useState, useEffect } from 'react';
import { ModalForm } from './ModalForm';
import { FormField, FormInput, FormSelect, FormGrid, FormSection } from './FormField';

interface Branch {
    id: string;
    code: string;
    name: string;
    companyId: string;
    company?: {
        id: string;
        name: string;
        code: string;
    };
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country: string;
    phone?: string | null;
    email?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface AddBranchForm {
    code: string;
    name: string;
    companyId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
}

export function BranchManagement() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Default values for dev mode testing
    const getDefaultFormValues = (): AddBranchForm => {
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

    const [branchForm, setBranchForm] = useState<AddBranchForm>(getDefaultFormValues());
    const [branches, setBranches] = useState<Branch[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch branches and companies
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [branchesRes, companiesRes] = await Promise.all([
                    fetch('/api/branches'),
                    fetch('/api/companies'),
                ]);

                if (!branchesRes.ok || !companiesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                // Check content types before parsing
                const branchesContentType = branchesRes.headers.get('content-type');
                const companiesContentType = companiesRes.headers.get('content-type');
                
                if (!branchesContentType || !branchesContentType.includes('application/json')) {
                    const text = await branchesRes.text();
                    throw new Error(`Branches API returned non-JSON: ${text.substring(0, 100)}`);
                }
                
                if (!companiesContentType || !companiesContentType.includes('application/json')) {
                    const text = await companiesRes.text();
                    throw new Error(`Companies API returned non-JSON: ${text.substring(0, 100)}`);
                }

                const branchesData = await branchesRes.json();
                const companiesData = await companiesRes.json();
                setBranches(branchesData);
                setCompanies(companiesData);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branchForm.companyId) {
            console.error('Please select a company');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    ...branchForm,
                }),
            });

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create branch');
            }

            const newBranch = await response.json();
            setBranches(prev => [newBranch, ...prev]);
            setShowAddModal(false);
            setBranchForm(getDefaultFormValues());
        } catch (error: any) {
            console.error('Error creating branch:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof AddBranchForm, value: string) => {
        setBranchForm(prev => ({ ...prev, [field]: value }));
    };

    // Filter branches based on search
    const filteredBranches = branches?.filter(branch => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            branch.name.toLowerCase().includes(query) ||
            branch.code.toLowerCase().includes(query) ||
            branch.city?.toLowerCase().includes(query) ||
            branch.state?.toLowerCase().includes(query) ||
            branch.company?.name.toLowerCase().includes(query)
        );
    }) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-montserrat-regular">Loading branches...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Add Button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">Branches</h2>
                    <p className="mt-1 text-sm text-gray-600 font-montserrat-regular">
                        Manage branches across companies ({filteredBranches.length} {filteredBranches.length === 1 ? 'branch' : 'branches'})
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={!companies || companies.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-montserrat-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Branch</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search branches by name, code, city, or company..."
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

            {/* Warning if no companies */}
            {(!companies || companies.length === 0) && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-amber-800 font-montserrat-medium">No companies found</h3>
                            <p className="mt-1 text-sm text-amber-700 font-montserrat-regular">
                                Please create a company first before adding branches. Switch to the Company tab to create one.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Branches List */}
            {filteredBranches.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat-medium">No branches found</h3>
                    <p className="mt-1 text-sm text-gray-500 font-montserrat-regular">
                        {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new branch.'}
                    </p>
                    {!searchQuery && companies && companies.length > 0 && (
                        <div className="mt-6">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-colors inline-flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Branch</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBranches.map((branch) => (
                        <div
                            key={branch.id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-1">
                                        {branch.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-montserrat-regular">
                                        Code: <span className="font-montserrat-medium text-gray-700">{branch.code}</span>
                                    </p>
                                    {branch.company && (
                                        <p className="text-xs text-gray-400 font-montserrat-regular mt-1">
                                            Company: {branch.company.name}
                                        </p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-montserrat-medium ${branch.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {branch.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {(branch.city || branch.state) && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-montserrat-medium w-20">Location:</span>
                                        <span className="font-montserrat-regular">
                                            {[branch.city, branch.state].filter(Boolean).join(', ')}
                                            {branch.country && `, ${branch.country}`}
                                        </span>
                                    </div>
                                )}
                                {branch.address && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-montserrat-medium w-20">Address:</span>
                                        <span className="font-montserrat-regular">{branch.address}</span>
                                    </div>
                                )}
                                {branch.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-montserrat-medium w-20">Phone:</span>
                                        <span className="font-montserrat-regular">{branch.phone}</span>
                                    </div>
                                )}
                                {branch.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-montserrat-medium w-20">Email:</span>
                                        <span className="font-montserrat-regular">{branch.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-400 font-montserrat-regular">
                                    Created: {new Date(branch.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Branch Modal */}
            <ModalForm
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleSubmit}
                title="Create New Branch"
                description="Add a new branch to a company"
                submitLabel="Create Branch"
                isLoading={isSubmitting}
                submitDisabled={!companies || companies.length === 0}
            >
                <FormSection>
                    <FormGrid>
                        <FormField label="Company" required className="md:col-span-2">
                            <FormSelect
                                value={branchForm.companyId}
                                onChange={(e) => handleInputChange('companyId', e.target.value)}
                                required
                            >
                                <option value="">Select a company</option>
                                {companies?.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} ({company.code})
                                    </option>
                                ))}
                            </FormSelect>
                            {(!companies || companies.length === 0) && (
                                <p className="mt-2 text-sm text-amber-600">
                                    No companies found. Please create a company first.
                                </p>
                            )}
                        </FormField>

                        <FormField label="Branch Code" required>
                            <FormInput
                                type="text"
                                value={branchForm.code}
                                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                placeholder="e.g., BR001, NYC, LAX"
                                required
                            />
                        </FormField>

                        <FormField label="Branch Name" required>
                            <FormInput
                                type="text"
                                value={branchForm.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </FormField>

                        <FormField label="Address">
                            <FormInput
                                type="text"
                                value={branchForm.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                        </FormField>

                        <FormField label="City">
                            <FormInput
                                type="text"
                                value={branchForm.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                            />
                        </FormField>

                        <FormField label="State">
                            <FormInput
                                type="text"
                                value={branchForm.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Country">
                            <FormInput
                                type="text"
                                value={branchForm.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Phone">
                            <FormInput
                                type="tel"
                                value={branchForm.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Email">
                            <FormInput
                                type="email"
                                value={branchForm.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </FormField>
                    </FormGrid>
                </FormSection>
            </ModalForm>
        </div>
    );
}

