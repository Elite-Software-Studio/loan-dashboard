import { useState } from 'react';
import { trpc } from '../lib/trpc-client';

interface LoginScreenProps {
    onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Test accounts for demo purposes
    const testAccounts = [
        { email: 'admin@proloans.com', password: 'admin123', role: 'ADMIN' },
        { email: 'manager@proloans.com', password: 'manager123', role: 'MANAGER' },
        { email: 'user@proloans.com', password: 'user123', role: 'USER' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if credentials match test accounts
        const testAccount = testAccounts.find(
            account => account.email === email && account.password === password
        );

        if (testAccount) {
            // Create a mock user object
            const user = {
                id: 'test-user-id',
                email: testAccount.email,
                name: testAccount.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                role: testAccount.role,
                accountNumber: 'TEST001',
                creditScore: 800,
                internalRiskScore: 16.66,
                maxRiskScore: 18.0,
                averageRate: 12.21,
                totalBorrowed: 500000.0,
                totalRepaid: 100000.0,
                memberType: 'ELITE' as const,
            };

            // Store user in localStorage for persistence
            localStorage.setItem('proloans-user', JSON.stringify(user));

            // Call the onLogin callback
            onLogin(user);
        } else {
            setError('Invalid email or password. Please try again.');
        }

        setIsLoading(false);
    };

    const handleTestAccount = (testAccount: typeof testAccounts[0]) => {
        setEmail(testAccount.email);
        setPassword(testAccount.password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Brand */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-white">P</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Proloans</h2>
                    <p className="text-lg text-gray-600">Loan Administration Portal</p>
                    <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Admin Access Required
                        </span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-200">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in to Portal'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Test Account Quick Access */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Quick Access (Demo)</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {testAccounts.map((account, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTestAccount(account)}
                                    className="w-full text-left p-3 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="font-medium text-gray-900">{account.role}</div>
                                    <div className="text-gray-500 text-xs">{account.email}</div>
                                    <div className="text-gray-400 text-xs">Click to fill credentials</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        © 2024 Proloans. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Version 21.1.2 • Secure Admin Portal
                    </p>
                </div>
            </div>
        </div>
    );
}
