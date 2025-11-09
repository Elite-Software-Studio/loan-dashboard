import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';
import { DataTable, type Column } from '../components/DataTable';

interface Payment {
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
}

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
  status: string;
  loanType: string;
}

// Mock loan data
const mockLoans: { [key: string]: Loan } = {
  'L001': {
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
    loanType: 'PERSONAL'
  }
};

// Mock payment data - in production, this would come from an API
const mockPayments: { [key: string]: Payment[] } = {
  'L001': [
    {
      id: 'PAY-001',
      loanNumber: 'L001',
      borrowerName: 'John Smith',
      amount: 1200.00,
      dueDate: '2024-01-15',
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-789456',
      date: '2024-01-14',
      lateFees: 0,
      totalAmount: 1200.00,
      notes: 'Payment received on time'
    },
    {
      id: 'PAY-002',
      loanNumber: 'L001',
      borrowerName: 'John Smith',
      amount: 1200.00,
      dueDate: '2024-02-15',
      status: 'Paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789457',
      date: '2024-02-14',
      lateFees: 0,
      totalAmount: 1200.00,
      notes: 'Automatic payment'
    },
    {
      id: 'PAY-003',
      loanNumber: 'L001',
      borrowerName: 'John Smith',
      amount: 1200.00,
      dueDate: '2024-03-15',
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-789458',
      date: '2024-03-16',
      lateFees: 15.00,
      totalAmount: 1215.00,
      notes: 'Late payment - 1 day overdue'
    },
    {
      id: 'PAY-004',
      loanNumber: 'L001',
      borrowerName: 'John Smith',
      amount: 1200.00,
      dueDate: '2024-04-15',
      status: 'Pending',
      paymentMethod: 'Direct Debit',
      transactionId: 'TXN-789459',
      date: '2024-04-15',
      lateFees: 0,
      totalAmount: 1200.00,
      notes: 'Scheduled payment'
    }
  ]
};

export function meta() {
  return [
    { title: "Payment History - Proloans" },
    { name: "description", content: "View payment history for a loan" },
  ];
}

export default function PaymentHistory() {
  const [searchParams] = useSearchParams();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loanId = searchParams.get('id');
    if (loanId) {
      if (mockLoans[loanId]) {
        setLoan(mockLoans[loanId]);
      }
      if (mockPayments[loanId]) {
        setPayments(mockPayments[loanId]);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <ProloansLayout>
        <div className="px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-montserrat-regular">Loading payment history...</p>
            </div>
          </div>
        </div>
      </ProloansLayout>
    );
  }

  if (!loan) {
    return (
      <ProloansLayout>
        <div className="px-6 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-medium font-montserrat-semibold">Loan not found</div>
            <Link to="/loans" className="text-green-600 hover:text-green-800 mt-2 inline-block font-montserrat-medium">
              ← Back to Loans
            </Link>
          </div>
        </div>
      </ProloansLayout>
    );
  }

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
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter payments based on search
  const filteredPayments = payments.filter(payment => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      payment.transactionId.toLowerCase().includes(query) ||
      payment.paymentMethod.toLowerCase().includes(query) ||
      payment.status.toLowerCase().includes(query) ||
      formatDate(payment.date).toLowerCase().includes(query)
    );
  });

  // Calculate summary statistics
  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalLateFees = payments.reduce((sum, p) => sum + p.lateFees, 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'Scheduled');
  const overduePayments = payments.filter(p => p.status === 'Overdue');

  // Define table columns
  const columns: Column<Payment>[] = [
    {
      key: 'date',
      header: 'Payment Date',
      render: (_, payment) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">
            {formatDate(payment.date)}
          </div>
          <div className="text-xs text-gray-500 font-montserrat-regular">
            Due: {formatDate(payment.dueDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (_, payment) => (
        <div>
          <div className="text-sm font-medium text-gray-900 font-montserrat-semibold">
            {formatCurrency(payment.amount)}
          </div>
          {payment.lateFees > 0 && (
            <div className="text-xs text-red-600 font-montserrat-regular">
              +{formatCurrency(payment.lateFees)} late fee
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (_, payment) => (
        <div className="text-sm font-semibold text-gray-900 font-montserrat-semibold">
          {formatCurrency(payment.totalAmount)}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, payment) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (_, payment) => (
        <div className="text-sm text-gray-900 font-montserrat-medium">
          {payment.paymentMethod}
        </div>
      ),
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: (_, payment) => (
        <div className="text-sm text-gray-600 font-montserrat-regular font-mono">
          {payment.transactionId}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, payment) => (
        <button
          onClick={() => {
            // Show payment details modal or navigate to payment details
            alert(`Payment Details:\n\nTransaction ID: ${payment.transactionId}\nAmount: ${formatCurrency(payment.amount)}\nDate: ${formatDate(payment.date)}\nMethod: ${payment.paymentMethod}\n${payment.notes ? `Notes: ${payment.notes}` : ''}`);
          }}
          className="text-green-600 hover:text-green-800 font-montserrat-medium text-sm"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/loan?id=${loan.id}`} className="text-green-600 hover:text-green-800 font-montserrat-medium mb-2 inline-block">
            ← Back to Loan Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mt-2">Payment History</h1>
          <p className="mt-2 text-gray-600 font-montserrat-regular">
            Loan ID: {loan.id} • {loan.borrowerName}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{pendingPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{overduePayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Late Fees</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(totalLateFees)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by transaction ID, payment method, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Payments Table */}
        <DataTable
          data={filteredPayments}
          columns={columns}
          isLoading={false}
          emptyMessage="No payments found"
          emptyDescription={searchQuery ? 'Try adjusting your search criteria.' : 'No payment history available for this loan.'}
          keyExtractor={(payment) => payment.id}
        />
      </div>
    </ProloansLayout>
  );
}

