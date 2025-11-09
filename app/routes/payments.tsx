import { useState, useEffect, useMemo } from 'react';
import { ProloansLayout } from '../components/ProloansLayout';
import { DataTable, type Column } from '../components/DataTable';
import { AddPaymentModal } from '../components/AddPaymentModal';
import { AlertModal } from '../components/AlertModal';

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Payment type for TypeScript
  type Payment = typeof paymentsData[0];

  // Define table columns
  const columns: Column<Payment>[] = useMemo(() => [
    {
      key: 'paymentDetails',
      header: 'Payment Details',
      render: (_, payment) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-medium">{payment.id}</div>
          <div className="text-sm text-gray-500 font-montserrat-regular">{payment.loanNumber}</div>
          <div className="text-xs text-gray-400 font-montserrat-regular">{payment.transactionId}</div>
        </div>
      ),
    },
    {
      key: 'borrowerName',
      header: 'Borrower',
      render: (_, payment) => (
        <div className="text-sm font-medium text-gray-900 font-montserrat-medium">{payment.borrowerName}</div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (_, payment) => (
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
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (_, payment) => (
        <div className="text-sm text-gray-900 font-montserrat-medium">{formatDate(payment.dueDate)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, payment) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          <span className="mr-1">{getStatusIcon(payment.status)}</span>
          {payment.status}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (_, payment) => (
        <div>
          <div className="text-sm text-gray-900 font-montserrat-medium">{payment.paymentMethod}</div>
          <div className="text-xs text-gray-500 font-montserrat-regular">{formatDate(payment.date)}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, payment) => (
        <div className="flex items-center space-x-2">
          <button
            className="text-green-600 hover:text-green-900 font-montserrat-medium"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view action
            }}
          >
            View
          </button>
          <button
            className="text-blue-600 hover:text-blue-900 font-montserrat-medium"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit action
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 font-montserrat-medium"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete action
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ], []);

  // Handle payment submission from modal
  const handlePaymentSubmit = (newPayment: {
    id: string;
    loanNumber: string;
    borrowerName: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Scheduled';
    paymentMethod: string;
    transactionId: string;
    date: string;
    lateFees: number;
    totalAmount: number;
    notes?: string;
  }) => {
    setPaymentsData(prev => [newPayment, ...prev]);
    setShowAddPaymentModal(false);
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(newPayment.amount);
    setSuccessMessage(
      `Payment of ${formattedAmount} has been successfully recorded for loan ${newPayment.loanNumber} (${newPayment.borrowerName}). Transaction ID: ${newPayment.transactionId}`
    );
    setShowSuccessAlert(true);
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

        {/* Payments Table Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 font-montserrat-semibold">
            Payment Transactions ({filteredPayments.length})
          </h2>
        </div>

        {/* Payments Table */}
        <DataTable
          data={filteredPayments}
          columns={columns}
          isLoading={false}
          emptyMessage="No payments found"
          emptyDescription={searchQuery || selectedStatus !== 'All'
            ? 'Try adjusting your search or filters.'
            : 'Get started by registering a new payment.'}
          keyExtractor={(payment) => payment.id}
        />

        {/* Add Payment Modal */}
        <AddPaymentModal
          isOpen={showAddPaymentModal}
          onClose={() => setShowAddPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
          loans={loansData}
        />

        {/* Success Alert Modal */}
        <AlertModal
          isOpen={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          type="success"
          title="Payment Recorded Successfully!"
          message={successMessage}
          confirmLabel="OK"
        />
      </div>
    </ProloansLayout>
  );
}
