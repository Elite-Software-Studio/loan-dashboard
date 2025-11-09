import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ProloansLayout } from '../components/ProloansLayout';

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

// Mock loan data - in production, this would come from an API
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
    loanType: 'PERSONAL',
    riskScore: 12.5,
    maxRiskScore: 18.0,
    collateral: 'None',
    notes: 'Excellent payment history'
  },
  'L002': {
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
  'L003': {
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
  'L004': {
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
  'L005': {
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
};

export function meta() {
  return [
    { title: "Loan Details - Proloans" },
    { name: "description", content: "View detailed information about a loan" },
  ];
}

export default function LoanDetails() {
  const [searchParams] = useSearchParams();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loanId = searchParams.get('id');
    if (loanId && mockLoans[loanId]) {
      setLoan(mockLoans[loanId]);
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
              <p className="text-gray-600 font-montserrat-regular">Loading loan details...</p>
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
      month: 'long',
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

  const progressPercentage = ((loan.loanAmount - loan.remainingBalance) / loan.loanAmount) * 100;
  const monthsRemaining = loan.status === 'PAID_OFF' ? 0 : Math.ceil((loan.remainingBalance / loan.monthlyPayment) || 0);

  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/loans" className="text-green-600 hover:text-green-800 font-montserrat-medium mb-2 inline-block">
              ← Back to Loans
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mt-2">Loan Details</h1>
            <p className="mt-2 text-gray-600 font-montserrat-regular">Loan ID: {loan.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(loan.status)}`}>
              {loan.status}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(loan.loanType)}`}>
              {loan.loanType}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Loan Amount</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(loan.loanAmount)}</p>
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
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Remaining Balance</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(loan.remainingBalance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Monthly Payment</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{formatCurrency(loan.monthlyPayment)}</p>
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
                <p className="text-sm font-medium text-gray-600 font-montserrat-medium">Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{loan.interestRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Borrower Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Borrower Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Name</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{loan.borrowerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Email</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{loan.borrowerEmail}</p>
                </div>
              </div>
            </div>

            {/* Loan Terms */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Loan Terms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Loan Type</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{loan.loanType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Term</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{loan.term} months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{formatDate(loan.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Next Due Date</p>
                  <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold mt-1">{formatDate(loan.nextDueDate)}</p>
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Payment Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 font-montserrat-medium mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-500 font-montserrat-medium">Paid</p>
                    <p className="text-lg font-semibold text-green-600 font-montserrat-semibold">
                      {formatCurrency(loan.loanAmount - loan.remainingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-montserrat-medium">Remaining</p>
                    <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold">
                      {formatCurrency(loan.remainingBalance)}
                    </p>
                  </div>
                </div>
                {loan.status === 'ACTIVE' && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500 font-montserrat-medium">Estimated months remaining</p>
                    <p className="text-lg font-semibold text-gray-900 font-montserrat-semibold">{monthsRemaining} months</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {loan.notes && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Notes</h2>
                <p className="text-gray-700 font-montserrat-regular whitespace-pre-wrap">{loan.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Risk Assessment</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-500 font-montserrat-medium">Risk Score</p>
                    <p className={`text-lg font-bold font-montserrat-bold ${getRiskColor(loan.riskScore, loan.maxRiskScore)}`}>
                      {loan.riskScore.toFixed(1)}/{loan.maxRiskScore.toFixed(1)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        loan.riskScore / loan.maxRiskScore <= 0.33 ? 'bg-green-600' :
                        loan.riskScore / loan.maxRiskScore <= 0.66 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${(loan.riskScore / loan.maxRiskScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-montserrat-medium mb-1">Risk Level</p>
                  <p className={`text-lg font-semibold font-montserrat-semibold ${
                    loan.riskScore / loan.maxRiskScore <= 0.33 ? 'text-green-600' :
                    loan.riskScore / loan.maxRiskScore <= 0.66 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {loan.riskScore / loan.maxRiskScore <= 0.33 ? 'LOW' :
                     loan.riskScore / loan.maxRiskScore <= 0.66 ? 'MEDIUM' : 'HIGH'}
                  </p>
                </div>
              </div>
            </div>

            {/* Collateral */}
            {loan.collateral && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Collateral</h2>
                <p className="text-gray-700 font-montserrat-regular">{loan.collateral}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 font-montserrat-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to={`/payments?loanId=${loan.id}`}
                  className="block w-full px-4 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-montserrat-medium"
                >
                  Record Payment
                </Link>
                <button className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-montserrat-medium">
                  View Payment History
                </button>
                <button className="block w-full px-4 py-3 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700 transition-colors font-montserrat-medium">
                  Edit Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProloansLayout>
  );
}

