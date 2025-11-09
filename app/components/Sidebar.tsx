import { Link, useLocation } from "react-router";
import { NAVIGATION_ITEMS } from "../lib/constants";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

/**
 * Fixed sidebar component for navigation
 * Provides collapsible navigation menu with active route highlighting
 */
export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const location = useLocation();
    const navigation = NAVIGATION_ITEMS;

    // Function to check if a navigation item is active
    const isActiveRoute = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Fixed Sidebar */}
            <div className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'} fixed top-16 left-0 bottom-0 z-30 bg-white shadow-sm border-r border-gray-200 transition-all duration-700 ease-in-out overflow-hidden transform lg:transform-none ${sidebarOpen ? 'animate-in slide-in-from-left duration-500' : ''} ${!sidebarOpen && 'lg:shadow-lg'}`}>
                <div className="pt-12">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center 
                        flex-row-reverse p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-105 group"
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <svg className="h-5 w-5 transition-all duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                        <span className={`mt-1 ml-2 text-xs text-gray-400 font-montserrat-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden whitespace-nowrap`}>
                            Collapse
                        </span>
                    </button>

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
        </>
    );
}

