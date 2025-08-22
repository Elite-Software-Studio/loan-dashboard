import { useState } from 'react';
import { trpc } from '../lib/trpc-client';
import { useAuth } from '../lib/auth';

export function ProloansLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const { data: currentUser } = trpc.getCurrentUser?.useQuery?.() || { data: null };

    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Users', href: '/users', icon: '👥', current: true },
        { name: 'Payments', href: '/payments', icon: '💳' },
        { name: 'Reporting', href: '/reporting', icon: '📈' },
        { name: 'Loans', href: '/loans', icon: '💰' },
        { name: 'Controls', href: '/controls', icon: '⚙️' },
    ];

    const handleLogout = () => {
        logout();
    };

    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Proloans</h1>
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {user?.role?.toLowerCase() || 'admin'}
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg mx-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Search users, loans, payments"
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    <span className="sr-only">View notifications</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                    </svg>
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                                </button>
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                    21
                                </span>
                            </div>

                            {/* User Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {getUserInitials(user?.name || 'User')}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                            <p className="text-xs text-green-600 font-medium capitalize">{user?.role}</p>
                                        </div>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Your Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </a>
                                        <div className="border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-sm transition-all duration-300 ease-in-out`}>
                    <div className="h-full flex flex-col">
                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${item.current
                                        ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {sidebarOpen && <span>{item.name}</span>}
                                    {item.current && sidebarOpen && (
                                        <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                </a>
                            ))}
                        </nav>

                        {/* Bottom Section */}
                        <div className="px-4 py-6 border-t border-gray-200">
                            {/* Add New Button */}
                            <button className="w-full bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {sidebarOpen && <span>Add New</span>}
                            </button>

                            {/* Version */}
                            {sidebarOpen && (
                                <div className="mt-4 text-xs text-gray-500 text-center">
                                    Version 21.1.2
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </div>
    );
}
