import { trpc } from '../lib/trpc-client';
import { useState } from 'react';

export function LoanManager() {
  const [newUser, setNewUser] = useState({ email: '', name: '', role: 'USER' as const });
  const [newLoan, setNewLoan] = useState({ amount: '', userId: '' });

  const { data: users, refetch: refetchUsers } = trpc.getUsers.useQuery();
  const { data: loans, refetch: refetchLoans } = trpc.getLoans.useQuery();
  
  const createUser = trpc.createUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      setNewUser({ email: '', name: '', role: 'USER' });
    },
  });

  const createLoan = trpc.createLoan.useMutation({
    onSuccess: () => {
      refetchLoans();
      setNewLoan({ amount: '', userId: '' });
    },
  });

  const updateLoanStatus = trpc.updateLoanStatus.useMutation({
    onSuccess: () => refetchLoans(),
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(newUser);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    createLoan.mutate({
      amount: parseFloat(newLoan.amount),
      userId: newLoan.userId,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Loan Admin System</h1>
      
      {/* Create User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {createUser.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      {/* Create Loan Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Loan</h2>
        <form onSubmit={handleCreateLoan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={newLoan.amount}
              onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              value={newLoan.userId}
              onChange={(e) => setNewLoan({ ...newLoan, userId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createLoan.isPending}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {createLoan.isPending ? 'Creating...' : 'Create Loan'}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading users...</p>
        )}
      </div>

      {/* Loans List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Loans</h2>
        {loans ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b">
                    <td className="px-4 py-2">{loan.id}</td>
                    <td className="px-4 py-2">${loan.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        loan.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'PAID' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{loan.user.name}</td>
                    <td className="px-4 py-2">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <select
                        value={loan.status}
                        onChange={(e) => updateLoanStatus.mutate({
                          id: loan.id,
                          status: e.target.value as any
                        })}
                        className="p-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading loans...</p>
        )}
      </div>
    </div>
  );
}
