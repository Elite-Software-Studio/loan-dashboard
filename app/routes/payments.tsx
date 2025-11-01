import { useState, useEffect } from 'react';
import { ProloansLayout } from '../components/ProloansLayout';

export function meta() {
  return [
    { title: "Payments - Proloans" },
    { name: "description", content: "Manage loan payments and transactions" },
  ];
}

export default function Payments() {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 days');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for loans (to populate the loan selector)
  const loansData = [
    {
      id: 'LN-2024-001',
      borrowerName: 'John Smith',
      borrowerEmail: 'john.smith@email.com',
      loanAmount: 25000,
      remainingBalance: 18750,
      monthlyPayment: 1250,
      nextDueDate: '2024-02-15',
      status: 'Active'
    },
    {
      id: 'LN-2024-002',
      borrowerName: 'Sarah Johnson',
      borrowerEmail: 'sarah.johnson@email.com',
      loanAmount: 15000,
      remainingBalance: 11250,
      monthlyPayment: 890,
      nextDueDate: '2024-02-20',
      status: 'Active'
    },
    {
      id: 'LN-2024-003',
      borrowerName: 'Michael Brown',
      borrowerEmail: 'michael.brown@email.com',
      loanAmount: 35000,
      remainingBalance: 28000,
      monthlyPayment: 2100,
      nextDueDate: '2024-02-10',
      status: 'Active'
    },
    {
      id: 'LN-2024-004',
      borrowerName: 'Emily Davis',
      borrowerEmail: 'emily.davis@email.com',
      loanAmount: 12000,
      remainingBalance: 9000,
      monthlyPayment: 750,
      nextDueDate: '2024-02-25',
      status: 'Active'
    },
    {
      id: 'LN-2024-005',
      borrowerName: 'David Wilson',
      borrowerEmail: 'david.wilson@email.com',
      loanAmount: 28000,
      remainingBalance: 22400,
      monthlyPayment: 1800,
      nextDueDate: '2024-02-30',
      status: 'Active'
    }
  ];

  // Mock data for payments
  const [paymentsData, setPaymentsData] = useState([
    {
      id: 'PAY-001',
      loanNumber: 'LN-2024-001',
      borrowerName: 'John Smith',
      amount: 1250.00,
      dueDate: '2024-01-15',
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-789456',
      date: '2024-01-14',
      lateFees: 0,
      totalAmount: 1250.00
    },
    {
      id: 'PAY-002',
      loanNumber: 'LN-2024-002',
      borrowerName: 'Sarah Johnson',
      amount: 890.50,
      dueDate: '2024-01-20',
      status: 'Pending',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789457',
      date: '2024-01-18',
      lateFees: 15.00,
      totalAmount: 905.50
    },
    {
      id: 'PAY-003',
      loanNumber: 'LN-2024-003',
      borrowerName: 'Michael Brown',
      amount: 2100.00,
      dueDate: '2024-01-10',
      status: 'Overdue',
      paymentMethod: 'Check',
      transactionId: 'TXN-789458',
      date: '2024-01-25',
      lateFees: 45.00,
      totalAmount: 2145.00
    },
    {
      id: 'PAY-004',
      loanNumber: 'LN-2024-004',
      borrowerName: 'Emily Davis',
      amount: 750.25,
      dueDate: '2024-01-25',
      status: 'Paid',
      paymentMethod: 'Cash',
      transactionId: 'TXN-789459',
      date: '2024-01-24',
      lateFees: 0,
      totalAmount: 750.25
    },
    {
      id: 'PAY-005',
      loanNumber: 'LN-2024-005',
      borrowerName: 'David Wilson',
      amount: 1800.00,
      dueDate: '2024-01-30',
      status: 'Scheduled',
      paymentMethod: 'Direct Debit',
      transactionId: 'TXN-789460',
      date: '2024-01-30',
      lateFees: 0,
      totalAmount: 1800.00
    }
  ]);

  // Add Payment Form State
  const [addPaymentForm, setAddPaymentForm] = useState({
    loanId: '',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    notes: '',
    lateFees: '0',
    isPartialPayment: false
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Summary statistics
  const summaryStats = {
    totalPayments: 6790.75,
    pendingPayments: 905.50,
    overduePayments: 2145.00,
    onTimePayments: 2000.00,
    averagePayment: 1358.15,
    totalTransactions: paymentsData.length
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return '✅';
      case 'Pending':
        return '⏳';
      case 'Overdue':
        return '⚠️';
      case 'Scheduled':
        return '📅';
      default:
        return '❓';
    }
  };

  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = payment.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.loanNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get selected loan details
  const selectedLoan = loansData.find(loan => loan.id === addPaymentForm.loanId);

  // Calculate suggested payment amount
  const suggestedPaymentAmount = selectedLoan ? selectedLoan.monthlyPayment : 0;

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setAddPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!addPaymentForm.loanId) {
      errors.loanId = 'Please select a loan';
    }

    if (!addPaymentForm.paymentAmount || parseFloat(addPaymentForm.paymentAmount) <= 0) {
      errors.paymentAmount = 'Please enter a valid payment amount';
    }

    if (!addPaymentForm.paymentDate) {
      errors.paymentDate = 'Please select a payment date';
    }

    if (!addPaymentForm.paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }

    if (addPaymentForm.transactionId && addPaymentForm.transactionId.length < 3) {
      errors.transactionId = 'Transaction ID must be at least 3 characters';
    }

    if (parseFloat(addPaymentForm.lateFees) < 0) {
      errors.lateFees = 'Late fees cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new payment
      const newPayment = {
        id: `PAY-${String(paymentsData.length + 1).padStart(3, '0')}`,
        loanNumber: addPaymentForm.loanId,
        borrowerName: selectedLoan.borrowerName,
        amount: parseFloat(addPaymentForm.paymentAmount),
        dueDate: selectedLoan.nextDueDate,
        status: 'Paid',
        paymentMethod: addPaymentForm.paymentMethod,
        transactionId: addPaymentForm.transactionId || `TXN-${Date.now()}`,
        date: addPaymentForm.paymentDate,
        lateFees: parseFloat(addPaymentForm.lateFees),
        totalAmount: parseFloat(addPaymentForm.paymentAmount) + parseFloat(addPaymentForm.lateFees),
        notes: addPaymentForm.notes
      };

      // Add to payments list
      setPaymentsData(prev => [newPayment, ...prev]);

      // Reset form and close modal
      setAddPaymentForm({
        loanId: '',
        paymentAmount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        transactionId: '',
        notes: '',
        lateFees: '0',
        isPartialPayment: false
      });
      setFormErrors({});
      setShowAddPaymentModal(false);

      // Show success message (you can implement a toast notification here)
      alert('Payment registered successfully!');
    } catch (error) {
      console.error('Error registering payment:', error);
      alert('Error registering payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setAddPaymentForm({
      loanId: '',
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      transactionId: '',
      notes: '',
      lateFees: '0',
      isPartialPayment: false
    });
    setFormErrors({});
  };

  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold">Payments Management</h1>
            <p className="mt-2 text-gray-600 font-montserrat-regular">
              Monitor and manage loan payments • Last updated: {formatTime(currentTime)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-montserrat-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ New Payment</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-montserrat-medium">
              Export Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Payments */}
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-green-700 font-montserrat-medium mb-2">Total Payments</h3>
              <span className="text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-green-900 font-montserrat-bold">
              {formatCurrency(summaryStats.totalPayments)}
            </p>
            <p className="text-sm text-green-600 font-montserrat-medium mt-2">+8.2% from last month</p>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Pending Payments</h3>
              <span className="text-yellow-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 font-montserrat-bold">
              {formatCurrency(summaryStats.pendingPayments)}
            </p>
            <p className="text-sm text-yellow-600 font-montserrat-medium mt-2">Requires attention</p>
          </div>

          {/* Overdue Payments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Overdue Payments</h3>
              <span className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 font-montserrat-bold">
              {formatCurrency(summaryStats.overduePayments)}
            </p>
            <p className="text-sm text-red-600 font-montserrat-medium mt-2">Immediate action needed</p>
          </div>

          {/* On-Time Payments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">On-Time Payments</h3>
              <span className="text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 font-montserrat-bold">
              {formatCurrency(summaryStats.onTimePayments)}
            </p>
            <p className="text-sm text-blue-600 font-montserrat-medium mt-2">Good performance</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-1">
                  Date Range
                </label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Last 7 days">Last 7 days</option>
                  <option value="Last 30 days">Last 30 days</option>
                  <option value="Last 90 days">Last 90 days</option>
                  <option value="This year">This year</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 lg:max-w-md">
              <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-1">
                Search Payments
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by borrower, loan number, or payment ID..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 font-montserrat-semibold">
              Payment Transactions ({filteredPayments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-montserrat-medium">{payment.id}</div>
                        <div className="text-sm text-gray-500 font-montserrat-regular">{payment.loanNumber}</div>
                        <div className="text-xs text-gray-400 font-montserrat-regular">{payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-montserrat-medium">{payment.borrowerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-montserrat-medium">
                          {formatCurrency(payment.amount)}
                        </div>
                        {payment.lateFees > 0 && (
                          <div className="text-xs text-red-600 font-montserrat-medium">
                            +{formatCurrency(payment.lateFees)} late fees
                          </div>
                        )}
                        <div className="text-xs text-gray-500 font-montserrat-regular">
                          Total: {formatCurrency(payment.totalAmount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-montserrat-medium">{formatDate(payment.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        <span className="mr-1">{getStatusIcon(payment.status)}</span>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-montserrat-medium">{payment.paymentMethod}</div>
                      <div className="text-xs text-gray-500 font-montserrat-regular">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-900 font-montserrat-medium">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 font-montserrat-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 font-montserrat-medium">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 font-montserrat-medium">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
                <span className="font-medium">{filteredPayments.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-montserrat-medium">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md font-montserrat-medium">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-montserrat-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Payment Modal */}
        {showAddPaymentModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 mt-40">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-white/20">
              {/* Modal Header - Fixed */}
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat-bold">Register New Payment</h2>
                    <p className="mt-1 text-gray-600 font-montserrat-medium">Select a loan and enter payment details</p>
                  </div>
                  <button
                    onClick={() => setShowAddPaymentModal(false)}
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
                  {/* Step 1: Loan Selection */}
                  {!addPaymentForm.loanId && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-2">Step 1: Select a Loan</h3>
                        <p className="text-gray-600 font-montserrat-medium">Choose the loan for which you want to register a payment</p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative max-w-md mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search loans by borrower name or loan ID..."
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      {/* Loan Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {loansData
                          .filter(loan =>
                            loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            loan.id.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((loan) => (
                            <div
                              key={loan.id}
                              onClick={() => handleInputChange('loanId', loan.id)}
                              className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-300 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-green-600 font-montserrat-medium bg-green-50 px-2 py-1 rounded-full">
                                  {loan.status}
                                </span>
                                <span className="text-xs text-gray-500 font-montserrat-medium">{loan.id}</span>
                              </div>

                              <h4 className="text-lg font-semibold text-gray-900 font-montserrat-semibold mb-2 group-hover:text-green-600 transition-colors duration-200">
                                {loan.borrowerName}
                              </h4>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-montserrat-medium">Monthly Payment:</span>
                                  <span className="font-semibold text-gray-900 font-montserrat-semibold">{formatCurrency(loan.monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-montserrat-medium">Remaining:</span>
                                  <span className="font-semibold text-gray-900 font-montserrat-semibold">{formatCurrency(loan.remainingBalance)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 font-montserrat-medium">Next Due:</span>
                                  <span className="font-semibold text-gray-900 font-montserrat-semibold">{formatDate(loan.nextDueDate)}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-gray-100">
                                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-montserrat-medium text-sm">
                                  Select This Loan
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment Details Form */}
                  {addPaymentForm.loanId && (
                    <form onSubmit={handleSubmitPayment} className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-2">Step 2: Payment Details</h3>
                        <p className="text-gray-600 font-montserrat-medium">Enter the payment information for {selectedLoan?.borrowerName}</p>
                      </div>

                      {/* Selected Loan Summary */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-green-900 font-montserrat-semibold">Selected Loan</h4>
                          <button
                            type="button"
                            onClick={() => handleInputChange('loanId', '')}
                            className="text-green-600 hover:text-green-800 font-montserrat-medium text-sm underline"
                          >
                            Change Loan
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-green-600 font-montserrat-medium">Borrower:</span>
                            <p className="text-green-900 font-montserrat-semibold">{selectedLoan?.borrowerName}</p>
                          </div>
                          <div>
                            <span className="text-green-600 font-montserrat-medium">Loan ID:</span>
                            <p className="text-green-900 font-montserrat-semibold">{selectedLoan?.id}</p>
                          </div>
                          <div>
                            <span className="text-green-600 font-montserrat-medium">Monthly Payment:</span>
                            <p className="text-green-900 font-montserrat-semibold">{formatCurrency(selectedLoan?.monthlyPayment || 0)}</p>
                          </div>
                          <div>
                            <span className="text-green-600 font-montserrat-medium">Next Due:</span>
                            <p className="text-green-900 font-montserrat-semibold">{formatDate(selectedLoan?.nextDueDate || '')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Form Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Payment Amount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                            Payment Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 font-montserrat-medium">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={addPaymentForm.paymentAmount}
                              onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                              placeholder="0.00"
                              className={`w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.paymentAmount ? 'border-red-500' : 'border-gray-300'}`}
                            />
                          </div>
                          {formErrors.paymentAmount && (
                            <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.paymentAmount}</p>
                          )}
                          {selectedLoan && (
                            <p className="mt-1 text-sm text-green-600 font-montserrat-medium">
                              💡 Suggested: {formatCurrency(suggestedPaymentAmount)}
                            </p>
                          )}
                        </div>

                        {/* Payment Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                            Payment Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={addPaymentForm.paymentDate}
                            onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.paymentDate ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {formErrors.paymentDate && (
                            <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.paymentDate}</p>
                          )}
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                            Payment Method <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={addPaymentForm.paymentMethod}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="Bank Transfer">🏦 Bank Transfer</option>
                            <option value="Credit Card">💳 Credit Card</option>
                            <option value="Check">📝 Check</option>
                            <option value="Cash">💵 Cash</option>
                            <option value="Direct Debit">💸 Direct Debit</option>
                            <option value="Wire Transfer">🌐 Wire Transfer</option>
                          </select>
                          {formErrors.paymentMethod && (
                            <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.paymentMethod}</p>
                          )}
                        </div>

                        {/* Transaction ID */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                            Transaction ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={addPaymentForm.transactionId}
                            onChange={(e) => handleInputChange('transactionId', e.target.value)}
                            placeholder="Enter transaction ID if available"
                            className={`w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.transactionId ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {formErrors.transactionId && (
                            <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.transactionId}</p>
                          )}
                        </div>

                        {/* Late Fees */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                            Late Fees
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500 font-montserrat-medium">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={addPaymentForm.lateFees}
                              onChange={(e) => handleInputChange('lateFees', e.target.value)}
                              placeholder="0.00"
                              className={`w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm ${formErrors.lateFees ? 'border-red-500' : 'border-gray-300'}`}
                            />
                          </div>
                          {formErrors.lateFees && (
                            <p className="mt-1 text-sm text-red-600 font-montserrat-medium">{formErrors.lateFees}</p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={addPaymentForm.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={3}
                          placeholder="Add any additional notes about this payment..."
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                        />
                      </div>

                      {/* Total Amount Display */}
                      {addPaymentForm.paymentAmount && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-green-700 font-montserrat-medium">Total Amount:</span>
                            <span className="text-2xl font-bold text-green-900 font-montserrat-bold">
                              {formatCurrency(
                                parseFloat(addPaymentForm.paymentAmount || '0') +
                                parseFloat(addPaymentForm.lateFees || '0')
                              )}
                            </span>
                          </div>
                        </div>
                      )}

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
                              <span>Processing Payment...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Register Payment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProloansLayout>
  );
}
