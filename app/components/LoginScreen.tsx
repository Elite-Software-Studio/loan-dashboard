import { useState } from 'react';

interface LoginScreenProps {
    onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Test accounts that match seeded database users (all use password: password123)
    const testAccounts = [
        {
            email: 'admin@proloans.com',
            password: 'password123',
            role: 'ADMIN',
            name: 'Jeff D.',
            description: 'Full admin access to all features',
            icon: '👑',
            color: 'from-purple-500 to-purple-600'
        },
        {
            email: 'manager@proloans.com',
            password: 'password123',
            role: 'MANAGER',
            name: 'Sarah Manager',
            description: 'Manager access with reporting capabilities',
            icon: '📊',
            color: 'from-blue-500 to-blue-600'
        },
        {
            email: 'kiran.nair@example.com',
            password: 'password123',
            role: 'USER',
            name: 'Kiran Nair',
            description: 'Regular user account',
            icon: '👤',
            color: 'from-green-500 to-green-600'
        },
        {
            email: 'user1@example.com',
            password: 'password123',
            role: 'USER',
            name: 'Mike Johnson',
            description: 'Regular user account',
            icon: '👤',
            color: 'from-gray-500 to-gray-600'
        },
        {
            email: 'user2@example.com',
            password: 'password123',
            role: 'USER',
            name: 'Lisa Chen',
            description: 'Regular user account',
            icon: '👤',
            color: 'from-gray-500 to-gray-600'
        },
        {
            email: 'user3@example.com',
            password: 'password123',
            role: 'USER',
            name: 'David Kim',
            description: 'Regular user account',
            icon: '👤',
            color: 'from-gray-500 to-gray-600'
        },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Call the real API for authentication
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'signin',
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid email or password. Please try again.');
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            const { user, token } = data;

            // Store user and token in localStorage
            localStorage.setItem('proloans-user', JSON.stringify(user));
            localStorage.setItem('auth_token', token);

            // Call the onLogin callback
            onLogin(user);
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to connect to server. Please try again.');
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
                        <span className="text-3xl font-bold text-white font-montserrat-bold">P</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2 font-montserrat-bold">Proloans</h2>
                    <p className="text-lg text-gray-600 font-montserrat-regular">Loan Administration Portal</p>
                    <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 font-montserrat-medium">
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat-medium">
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
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm font-montserrat-regular"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat-medium">
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
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm font-montserrat-regular"
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
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 font-montserrat-medium">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500 font-montserrat-medium">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-montserrat-semibold"
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
                                <span className="px-3 bg-white text-gray-600 font-montserrat-semibold">Quick Access (Demo)</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                            {testAccounts.map((account, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTestAccount(account)}
                                    className="w-full text-left p-3 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all duration-200 group bg-white"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${account.color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-200`}>
                                                {account.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold text-gray-900 font-montserrat-semibold text-sm">
                                                        {account.name}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${account.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                        account.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        } font-montserrat-medium`}>
                                                        {account.role}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-xs text-gray-600 font-montserrat-regular truncate">
                                                    {account.email}
                                                </div>
                                                <div className="mt-1 text-xs text-gray-500 font-montserrat-regular">
                                                    {account.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-2">
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <div className="flex items-center text-xs text-gray-400 font-montserrat-regular">
                                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Password: password123
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-xs text-gray-500 font-montserrat-regular">
                                All demo accounts use the same password: <span className="font-semibold text-gray-700">password123</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-montserrat-regular">
                        © 2024 Proloans. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-montserrat-regular">
                        Version 21.1.2 • Secure Admin Portal
                    </p>
                </div>
            </div>
        </div>
    );
}
