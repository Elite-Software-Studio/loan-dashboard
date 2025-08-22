import { useState, useEffect, useRef } from 'react';
import { trpc } from '../lib/trpc-client';
import { useAuth } from '../lib/auth';
import { useLocation, Link } from 'react-router';

export function ProloansLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Users', href: '/users', icon: '👥' },
        { name: 'Payments', href: '/payments', icon: '💳' },
        { name: 'Reporting', href: '/reporting', icon: '📈' },
        { name: 'Loans', href: '/loans', icon: '💰' },
        { name: 'Controls', href: '/controls', icon: '⚙️' },
    ];

    // Function to check if a navigation item is active
    const isActiveRoute = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    // Handle click outside user menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
    };

    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 mr-2 transition-all duration-200 hover:scale-105"
                            >
                                <svg className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <h1 className="text-2xl font-bold text-gray-900 font-montserrat-bold transition-all duration-200 hover:text-green-600 hover:scale-105">Proloans</h1>
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 font-montserrat-medium transition-all duration-200 hover:bg-green-200 hover:scale-105">
                                {user?.role?.toLowerCase() || 'admin'}
                            </span>
                            {/* Current Page Indicator */}
                            <div className="hidden lg:flex ml-4 items-center">
                                <span className="text-sm text-gray-500 font-montserrat-medium">Current:</span>
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full font-montserrat-medium transition-all duration-200 hover:bg-blue-200 hover:scale-105">
                                    {navigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
                                </span>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-lg mx-8">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 hover:border-gray-400 focus:scale-105"
                                    placeholder="Search users, loans, payments"
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105">
                                    <span className="sr-only">View notifications</span>
                                    <svg className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                    </svg>
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white animate-pulse"></span>
                                </button>
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-bounce">
                                    21
                                </span>
                            </div>

                            {/* User Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                                        <span className="text-sm font-medium text-white">
                                            {getUserInitials(user?.name || 'User')}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 transition-colors duration-200">{user?.name || 'User'}</span>
                                    <svg className="h-4 w-4 text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div ref={userMenuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 font-montserrat-semibold">{user?.name}</p>
                                            <p className="text-xs text-gray-500 font-montserrat-regular">{user?.email}</p>
                                            <p className="text-xs text-green-600 font-medium capitalize font-montserrat-medium">{user?.role}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-montserrat-medium transition-all duration-200 hover:bg-red-50 hover:text-red-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Fixed Breadcrumb Navigation */}
            <div className="fixed top-16 left-0 right-0 z-40 hidden lg:block bg-white border-b border-gray-200 px-4 py-2">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-gray-500 font-montserrat-medium transition-colors duration-200 hover:scale-105">
                                    <svg className="h-4 w-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </Link>
                            </li>
                            {location.pathname !== '/' && (
                                <>
                                    <li>
                                        <svg className="h-4 w-4 text-gray-300 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </li>
                                    <li>
                                        <span className="text-sm text-gray-600 font-montserrat-medium transition-colors duration-200">
                                            {navigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
                                        </span>
                                    </li>
                                </>
                            )}
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="flex pt-16">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden animate-in fade-in duration-300"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Fixed Sidebar */}
                <div className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'} fixed top-16 left-0 bottom-0 z-30 bg-white shadow-sm border-r border-gray-200 transition-all duration-700 ease-in-out overflow-hidden transform lg:transform-none ${sidebarOpen ? 'animate-in slide-in-from-left duration-500' : ''} ${!sidebarOpen && 'lg:shadow-lg'}`}>
                    <div className="p-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-105 group"
                            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            <svg className="h-5 w-5 transition-all duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                            <span className={`ml-2 text-xs text-gray-400 font-montserrat-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden whitespace-nowrap`}>
                                Collapse
                            </span>
                        </button>
                        {!sidebarOpen && (
                            <div className="mt-2 text-center">
                                <div className="w-1 h-1 bg-gray-300 rounded-full mx-auto animate-pulse transition-all duration-300"></div>
                                <div className="mt-1 text-xs text-gray-400 font-montserrat-medium opacity-0 animate-pulse">...</div>
                            </div>
                        )}
                    </div>

                    <nav className="mt-4">
                        {navigation.map((item, index) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 font-montserrat-medium mx-2 relative ${isActiveRoute(item.href)
                                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                                    }`}
                                title={!sidebarOpen ? item.name : undefined}
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <span className="mr-3 text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0 group-hover:text-green-600">{item.icon}</span>
                                <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'} group-hover:translate-x-1 overflow-hidden whitespace-nowrap flex-shrink-0`}>{item.name}</span>
                                {isActiveRoute(item.href) && (
                                    <div className={`ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} group-hover:scale-125 flex-shrink-0 group-hover:animate-bounce`}></div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform scale-95 group-hover:scale-100">
                                        {item.name}
                                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className={`flex-1 min-w-0 transition-all duration-700 ease-in-out overflow-visible relative z-10 ${sidebarOpen ? 'ml-64 lg:ml-64' : 'ml-0 lg:ml-16'}`}>
                    <div className="pt-20 lg:pt-24 px-4 lg:px-8 overflow-visible">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}