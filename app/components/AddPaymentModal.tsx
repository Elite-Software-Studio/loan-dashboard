import { useState } from 'react';

interface Loan {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  loanAmount: number;
  remainingBalance: number;
  monthlyPayment: number;
  nextDueDate: string;
  status: string;
}

interface PaymentFormData {
  loanId: string;
  paymentAmount: string;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  notes: string;
  lateFees: string;
  isPartialPayment: boolean;
}

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: {
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
  }) => void;
  loans: Loan[];
}

export function AddPaymentModal({ isOpen, onClose, onSubmit, loans }: AddPaymentModalProps) {
  const [addPaymentForm, setAddPaymentForm] = useState<PaymentFormData>({
    loanId: '',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    notes: '',
    lateFees: '0',
    isPartialPayment: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanSearchQuery, setLoanSearchQuery] = useState('');

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

  // Get selected loan details
  const selectedLoan = loans.find(loan => loan.id === addPaymentForm.loanId);

  // Calculate suggested payment amount
  const suggestedPaymentAmount = selectedLoan ? selectedLoan.monthlyPayment : 0;

  // Handle form input changes
  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
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
    const errors: Record<string, string> = {};

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

    if (!selectedLoan) {
      setFormErrors({ loanId: 'Please select a loan' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new payment
      const newPayment = {
        id: `PAY-${String(Date.now()).slice(-6)}`,
        loanNumber: addPaymentForm.loanId,
        borrowerName: selectedLoan.borrowerName,
        amount: parseFloat(addPaymentForm.paymentAmount),
        dueDate: selectedLoan.nextDueDate,
        status: 'Paid' as const,
        paymentMethod: addPaymentForm.paymentMethod,
        transactionId: addPaymentForm.transactionId || `TXN-${Date.now()}`,
        date: addPaymentForm.paymentDate,
        lateFees: parseFloat(addPaymentForm.lateFees),
        totalAmount: parseFloat(addPaymentForm.paymentAmount) + parseFloat(addPaymentForm.lateFees),
        notes: addPaymentForm.notes || ''
      };

      onSubmit(newPayment);

      // Reset form and close modal
      handleResetForm();
      onClose();
    } catch (error) {
      console.error('Error registering payment:', error);
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
    setLoanSearchQuery('');
  };

  if (!isOpen) return null;

  return (
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
              onClick={() => {
                handleResetForm();
                onClose();
              }}
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
                    value={loanSearchQuery}
                    onChange={(e) => setLoanSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm font-montserrat-medium text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Loan Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {loans
                    .filter(loan =>
                      loan.borrowerName.toLowerCase().includes(loanSearchQuery.toLowerCase()) ||
                      loan.id.toLowerCase().includes(loanSearchQuery.toLowerCase())
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
                {formErrors.loanId && (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-montserrat-medium">{formErrors.loanId}</p>
                  </div>
                )}
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
                    onClick={() => {
                      handleResetForm();
                      onClose();
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-200 font-montserrat-medium hover:scale-105"
                  >
                    Cancel
                  </button>
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
  );
}

