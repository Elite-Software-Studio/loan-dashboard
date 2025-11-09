import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';
import { DataTable, type Column } from '../components/DataTable';
import { ModalForm } from '../components/ModalForm';
import { FormField, FormInput, FormSelect, FormTextarea, FormCurrencyInput, FormGrid, FormSection } from '../components/FormField';

interface Loan {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  interestRate: number;
  term: number;
  startDate: string;
  nextDueDate: string;
  status: 'ACTIVE' | 'PAID_OFF' | 'DEFAULTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  loanType: 'PERSONAL' | 'BUSINESS' | 'MORTGAGE' | 'AUTO' | 'STUDENT';
  riskScore: number;
  maxRiskScore: number;
  collateral: string;
  notes: string;
}

interface AddLoanForm {
  selectedUserId: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: string;
  interestRate: string;
  term: string;
  startDate: string;
  loanType: string;
  riskScore: string;
  maxRiskScore: string;
  collateral: string;
  notes: string;
}

interface FormErrors {
  selectedUserId: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: string;
  interestRate: string;
  term: string;
  startDate: string;
  loanType: string;
  riskScore: string;
  maxRiskScore: string;
}

// Mock user data for loan creation
const mockUsers = [
  { id: 'user-1', name: 'John Smith', email: 'john.smith@email.com', creditScore: 750, memberType: 'PREMIUM' },
  { id: 'user-2', name: 'Sarah Johnson', email: 'sarah.j@email.com', creditScore: 820, memberType: 'ELITE' },
  { id: 'user-3', name: 'Mike Chen', email: 'mike.chen@email.com', creditScore: 680, memberType: 'REGULAR' },
  { id: 'user-4', name: 'Lisa Rodriguez', email: 'lisa.r@email.com', creditScore: 720, memberType: 'PREMIUM' },
  { id: 'user-5', name: 'David Wilson', email: 'david.w@email.com', creditScore: 790, memberType: 'VIP' }
];

// Mock loan data
const mockLoans: Loan[] = [
  {
    id: 'L001',
    borrowerName: 'John Smith',
    borrowerEmail: 'john.smith@email.com',
    loanAmount: 50000,
    remainingBalance: 45000,
    monthlyPayment: 1200,
    interestRate: 8.5,
    term: 60,
    startDate: '2024-01-15',
    nextDueDate: '2024-12-15',
    status: 'ACTIVE',
    loanType: 'PERSONAL',
    riskScore: 12.5,
    maxRiskScore: 18.0,
    collateral: 'None',
    notes: 'Excellent payment history'
  },
  {
    id: 'L002',
    borrowerName: 'Sarah Johnson',
    borrowerEmail: 'sarah.j@email.com',
    loanAmount: 250000,
    remainingBalance: 200000,
    monthlyPayment: 1800,
    interestRate: 6.2,
    term: 360,
    startDate: '2023-06-01',
    nextDueDate: '2024-12-01',
    status: 'ACTIVE',
    loanType: 'MORTGAGE',
    riskScore: 8.2,
    maxRiskScore: 18.0,
    collateral: 'Residential Property',
    notes: 'First-time homebuyer'
  },
  {
    id: 'L003',
    borrowerName: 'Mike Chen',
    borrowerEmail: 'mike.chen@email.com',
    loanAmount: 75000,
    remainingBalance: 0,
    monthlyPayment: 0,
    interestRate: 9.1,
    term: 48,
    startDate: '2022-03-10',
    nextDueDate: '2024-03-10',
    status: 'PAID_OFF',
    loanType: 'BUSINESS',
    riskScore: 15.8,
    maxRiskScore: 18.0,
    collateral: 'Business Equipment',
    notes: 'Successfully paid off early'
  },
  {
    id: 'L004',
    borrowerName: 'Lisa Rodriguez',
    borrowerEmail: 'lisa.r@email.com',
    loanAmount: 35000,
    remainingBalance: 28000,
    monthlyPayment: 850,
    interestRate: 7.8,
    term: 60,
    startDate: '2024-02-20',
    nextDueDate: '2024-12-20',
    status: 'ACTIVE',
    loanType: 'AUTO',
    riskScore: 11.2,
    maxRiskScore: 18.0,
    collateral: '2023 Honda Civic',
    notes: 'Good credit, low risk'
  },
  {
    id: 'L005',
    borrowerName: 'David Wilson',
    borrowerEmail: 'david.w@email.com',
    loanAmount: 120000,
    remainingBalance: 95000,
    monthlyPayment: 1100,
    interestRate: 5.9,
    term: 120,
    startDate: '2023-09-15',
    nextDueDate: '2024-12-15',
    status: 'ACTIVE',
    loanType: 'STUDENT',
    riskScore: 6.5,
    maxRiskScore: 18.0,
    collateral: 'None',
    notes: 'Graduate student loan'
  }
];

export function meta() {
  return [
    { title: "Loans - Proloans" },
    { name: "description", content: "Manage loan applications and portfolios" },
  ];
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const [addLoanForm, setAddLoanForm] = useState<AddLoanForm>({
    selectedUserId: '',
    borrowerName: '',
    borrowerEmail: '',
    loanAmount: '',
    interestRate: '',
    term: '',
    startDate: '',
    loanType: 'PERSONAL',
    riskScore: '',
    maxRiskScore: '18.0',
    collateral: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    selectedUserId: '',
    borrowerName: '',
    borrowerEmail: '',
    loanAmount: '',
    interestRate: '',
    term: '',
    startDate: '',
    loanType: '',
    riskScore: '',
    maxRiskScore: ''
  });

  const handleInputChange = (field: keyof AddLoanForm, value: string) => {
    setAddLoanForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUserSelection = (userId: string) => {
    const selectedUser = mockUsers.find(user => user.id === userId);
    if (selectedUser) {
      setAddLoanForm(prev => ({
        ...prev,
        selectedUserId: userId,
        borrowerName: selectedUser.name,
        borrowerEmail: selectedUser.email
      }));
      // Clear related errors
      setFormErrors(prev => ({
        ...prev,
        selectedUserId: '',
        borrowerName: '',
        borrowerEmail: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      selectedUserId: '',
      borrowerName: '',
      borrowerEmail: '',
      loanAmount: '',
      interestRate: '',
      term: '',
      startDate: '',
      loanType: '',
      riskScore: '',
      maxRiskScore: ''
    };

    if (!addLoanForm.selectedUserId) errors.selectedUserId = 'Please select a user';
    if (!addLoanForm.borrowerName.trim()) errors.borrowerName = 'Borrower name is required';
    if (!addLoanForm.borrowerEmail.trim()) errors.borrowerEmail = 'Borrower email is required';
    if (!addLoanForm.loanAmount.trim()) errors.loanAmount = 'Loan amount is required';
    if (!addLoanForm.interestRate.trim()) errors.interestRate = 'Interest rate is required';
    if (!addLoanForm.term.trim()) errors.term = 'Loan term is required';
    if (!addLoanForm.startDate.trim()) errors.startDate = 'Start date is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (addLoanForm.borrowerEmail && !emailRegex.test(addLoanForm.borrowerEmail)) {
      errors.borrowerEmail = 'Please enter a valid email address';
    }

    // Loan amount validation
    if (addLoanForm.loanAmount) {
      const amount = parseFloat(addLoanForm.loanAmount);
      if (isNaN(amount) || amount <= 0) {
        errors.loanAmount = 'Loan amount must be greater than 0';
      }
    }

    // Interest rate validation
    if (addLoanForm.interestRate) {
      const rate = parseFloat(addLoanForm.interestRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        errors.interestRate = 'Interest rate must be between 0 and 100';
      }
    }

    // Term validation
    if (addLoanForm.term) {
      const term = parseInt(addLoanForm.term);
      if (isNaN(term) || term <= 0) {
        errors.term = 'Loan term must be greater than 0';
      }
    }

    // Risk score validation
    if (addLoanForm.riskScore) {
      const score = parseFloat(addLoanForm.riskScore);
      if (isNaN(score) || score < 0 || score > 18) {
        errors.riskScore = 'Risk score must be between 0 and 18';
      }
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmitLoan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate monthly payment
      const principal = parseFloat(addLoanForm.loanAmount);
      const rate = parseFloat(addLoanForm.interestRate) / 100 / 12; // Monthly rate
      const term = parseInt(addLoanForm.term);
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);

      // Create new loan object
      const newLoan: Loan = {
        id: `L${String(loans.length + 1).padStart(3, '0')}`,
        borrowerName: addLoanForm.borrowerName.trim(),
        borrowerEmail: addLoanForm.borrowerEmail.trim(),
        loanAmount: principal,
        remainingBalance: principal,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        interestRate: parseFloat(addLoanForm.interestRate),
        term: term,
        startDate: addLoanForm.startDate,
        nextDueDate: addLoanForm.startDate, // Will be calculated based on term
        status: 'PENDING',
        loanType: addLoanForm.loanType as Loan['loanType'],
        riskScore: addLoanForm.riskScore ? parseFloat(addLoanForm.riskScore) : 0,
        maxRiskScore: parseFloat(addLoanForm.maxRiskScore),
        collateral: addLoanForm.collateral.trim(),
        notes: addLoanForm.notes.trim()
      };

      // Add to loans list
      setLoans(prev => [newLoan, ...prev]);

      // Close modal and reset form
      setShowAddLoanModal(false);
      handleResetForm();

      console.log('Loan created successfully:', newLoan);

    } catch (error) {
      console.error('Error creating loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setAddLoanForm({
      selectedUserId: '',
      borrowerName: '',
      borrowerEmail: '',
      loanAmount: '',
      interestRate: '',
      term: '',
      startDate: '',
      loanType: 'PERSONAL',
      riskScore: '',
      maxRiskScore: '18.0',
      collateral: '',
      notes: ''
    });
    setFormErrors({
      selectedUserId: '',
      borrowerName: '',
      borrowerEmail: '',
      loanAmount: '',
      interestRate: '',
      term: '',
      startDate: '',
      loanType: '',
      riskScore: '',
      maxRiskScore: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAID_OFF': return 'bg-blue-100 text-blue-800';
      case 'DEFAULTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-purple-100 text-purple-800';
      case 'REJECTED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERSONAL': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS': return 'bg-green-100 text-green-800';
      case 'MORTGAGE': return 'bg-purple-100 text-purple-800';
      case 'AUTO': return 'bg-orange-100 text-orange-800';
      case 'STUDENT': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number, maxScore: number) => {
    const ratio = score / maxScore;
    if (ratio <= 0.33) return 'text-green-600';
    if (ratio <= 0.66) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Filter loans based on search and filters
  const filteredLoans = loans.filter(loan => {
    const matchesSearch =
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrowerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || loan.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || loan.loanType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Define table columns
  const columns: Column<Loan>[] = useMemo(() => [
    {
      key: 'loanDetails',
      header: 'Loan Details',
      render: (_, loan) => (
        <Link to={`/loan?id=${loan.id}`} className="block" onClick={(e) => e.stopPropagation()}>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">{loan.id}</div>
          <div className="text-sm text-gray-500 font-montserrat-medium">
            {formatDate(loan.startDate)}
          </div>
        </Link>
      ),
    },
    {
      key: 'borrower',
      header: 'Borrower',
      render: (_, loan) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">{loan.borrowerName}</div>
          <div className="text-sm text-gray-500 font-montserrat-medium">{loan.borrowerEmail}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount & Balance',
      render: (_, loan) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">
            {formatCurrency(loan.loanAmount)}
          </div>
          <div className="text-sm text-gray-500 font-montserrat-medium">
            Balance: {formatCurrency(loan.remainingBalance)}
          </div>
        </div>
      ),
    },
    {
      key: 'terms',
      header: 'Terms',
      render: (_, loan) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">
            {loan.term} months
          </div>
          <div className="text-sm text-gray-500 font-montserrat-medium">
            {loan.interestRate}% APR
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status & Type',
      render: (_, loan) => (
        <div className="space-y-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
            {loan.status}
          </span>
          <div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(loan.loanType)}`}>
              {loan.loanType}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'Risk & Next Due',
      render: (_, loan) => (
        <div>
          <div className={`text-sm font-medium font-montserrat-semibold ${getRiskColor(loan.riskScore, loan.maxRiskScore)}`}>
            Risk: {loan.riskScore.toFixed(1)}/{loan.maxRiskScore.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 font-montserrat-medium">
            Due: {formatDate(loan.nextDueDate)}
          </div>
        </div>
      ),
    },
  ], []);

  // Calculate summary statistics
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE').length;
  const totalPortfolio = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const averageRate = loans.length > 0
    ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length
    : 0;

  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold">Loan Management</h1>
            <p className="mt-2 text-gray-600 font-montserrat-regular">Manage loan applications and portfolios</p>
          </div>
          <button
            onClick={() => setShowAddLoanModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-montserrat-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Loan</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{totalLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{activeLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(totalPortfolio)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Avg Rate</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{averageRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                Search Loans
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by borrower, loan ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAID_OFF">Paid Off</option>
                <option value="DEFAULTED">Defaulted</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                Loan Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ALL">All Types</option>
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
                <option value="MORTGAGE">Mortgage</option>
                <option value="AUTO">Auto</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <DataTable
          data={filteredLoans}
          columns={columns}
          isLoading={false}
          emptyMessage="No loans found"
          emptyDescription={searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
            ? 'Try adjusting your filters.'
            : 'Get started by creating a new loan.'}
          keyExtractor={(loan) => loan.id}
          onRowClick={(loan) => {
            window.location.href = `/loan?id=${loan.id}`;
          }}
        />

        {/* Add Loan Modal */}
        <ModalForm
          isOpen={showAddLoanModal}
          onClose={() => {
            setShowAddLoanModal(false);
            handleResetForm();
          }}
          onSubmit={handleSubmitLoan}
          title="Create New Loan"
          description="Add a new loan application"
          submitLabel="Create Loan"
          isLoading={isSubmitting}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* User Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat-semibold mb-4">Select User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelection(user.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${addLoanForm.selectedUserId === user.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${addLoanForm.selectedUserId === user.id ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 font-montserrat-semibold">{user.name}</div>
                        <div className="text-sm text-gray-600 font-montserrat-medium">{user.email}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {user.memberType}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {user.creditScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.selectedUserId && (
                <p className="mt-2 text-sm text-red-600 font-montserrat-medium">{formErrors.selectedUserId}</p>
              )}
            </div>

            {/* Basic Information */}
            <FormSection title="Basic Information">
              <FormGrid>
                <FormField label="Borrower Name" required error={formErrors.borrowerName}>
                  <div className="flex space-x-2">
                    <FormInput
                      type="text"
                      value={addLoanForm.borrowerName}
                      onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                      placeholder="Enter borrower's full name"
                      disabled={!!addLoanForm.selectedUserId}
                      error={!!formErrors.borrowerName}
                      className={addLoanForm.selectedUserId ? 'bg-gray-100 cursor-not-allowed' : ''}
                    />
                    {addLoanForm.selectedUserId && (
                      <button
                        type="button"
                        onClick={() => handleUserSelection('')}
                        className="px-3 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-montserrat-medium whitespace-nowrap"
                      >
                        Change User
                      </button>
                    )}
                  </div>
                </FormField>

                <FormField label="Borrower Email" required error={formErrors.borrowerEmail}>
                  <FormInput
                    type="email"
                    value={addLoanForm.borrowerEmail}
                    onChange={(e) => handleInputChange('borrowerEmail', e.target.value)}
                    placeholder="Enter borrower's email"
                    disabled={!!addLoanForm.selectedUserId}
                    error={!!formErrors.borrowerEmail}
                    className={addLoanForm.selectedUserId ? 'bg-gray-100 cursor-not-allowed' : ''}
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            {/* Loan Details */}
            <FormSection title="Loan Details">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Loan Amount" required error={formErrors.loanAmount}>
                  <FormCurrencyInput
                    value={addLoanForm.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    placeholder="0.00"
                    error={!!formErrors.loanAmount}
                  />
                </FormField>

                <FormField label="Interest Rate (%)" required error={formErrors.interestRate}>
                  <FormInput
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={addLoanForm.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    placeholder="0.00"
                    error={!!formErrors.interestRate}
                  />
                </FormField>

                <FormField label="Term (months)" required error={formErrors.term}>
                  <FormInput
                    type="number"
                    min="1"
                    value={addLoanForm.term}
                    onChange={(e) => handleInputChange('term', e.target.value)}
                    placeholder="12"
                    error={!!formErrors.term}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Additional Details */}
            <FormSection title="Additional Details">
              <FormGrid>
                <FormField label="Start Date" required error={formErrors.startDate}>
                  <FormInput
                    type="date"
                    value={addLoanForm.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    error={!!formErrors.startDate}
                  />
                </FormField>

                <FormField label="Loan Type" required>
                  <FormSelect
                    value={addLoanForm.loanType}
                    onChange={(e) => handleInputChange('loanType', e.target.value)}
                  >
                    <option value="PERSONAL">👤 Personal Loan</option>
                    <option value="BUSINESS">💼 Business Loan</option>
                    <option value="MORTGAGE">🏠 Mortgage</option>
                    <option value="AUTO">🚗 Auto Loan</option>
                    <option value="STUDENT">🎓 Student Loan</option>
                  </FormSelect>
                </FormField>
              </FormGrid>
            </FormSection>

            {/* Risk Assessment */}
            <FormSection title="Risk Assessment">
              <FormGrid>
                <FormField label="Risk Score" error={formErrors.riskScore}>
                  <FormInput
                    type="number"
                    step="0.1"
                    min="0"
                    max="18"
                    value={addLoanForm.riskScore}
                    onChange={(e) => handleInputChange('riskScore', e.target.value)}
                    placeholder="0.0-18.0"
                    error={!!formErrors.riskScore}
                  />
                </FormField>

                <FormField label="Max Risk Score">
                  <FormInput
                    type="number"
                    step="0.1"
                    min="0"
                    max="18"
                    value={addLoanForm.maxRiskScore}
                    onChange={(e) => handleInputChange('maxRiskScore', e.target.value)}
                    placeholder="18.0"
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            {/* Collateral and Notes */}
            <FormSection title="Additional Information">
              <FormGrid>
                <FormField label="Collateral">
                  <FormInput
                    type="text"
                    value={addLoanForm.collateral}
                    onChange={(e) => handleInputChange('collateral', e.target.value)}
                    placeholder="Describe collateral if any"
                  />
                </FormField>

                <FormField label="Notes">
                  <FormTextarea
                    value={addLoanForm.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Add any additional notes about this loan..."
                  />
                </FormField>
              </FormGrid>
            </FormSection>
          </div>
        </ModalForm>
      </div>
    </ProloansLayout>
  );
}
