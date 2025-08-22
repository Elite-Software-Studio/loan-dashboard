import { useState, useEffect } from 'react';
import { ProloansLayout } from '../components/ProloansLayout';

export function meta() {
    return [
        { title: "Dashboard - Proloans" },
        { name: "description", content: "Financial dashboard and analytics" },
    ];
}

export default function Dashboard() {
    const [selectedDateRange, setSelectedDateRange] = useState('Sept 13-14, 2023');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock data for the dashboard
    const summaryData = {
        allLoanAmount: 40560,
        totalMonthlyPayment: 223.89,
        totalAllLoans: 2
    };

    const treasuryData = {
        currentYield: 3.500,
        change: -0.062,
        isPositive: false
    };

    const ratesData = {
        highest: 3.8210,
        lowest: 3.230,
        open: 3.233,
        close: 3.269
    };

    // Mock chart data points for the treasury analytics
    const chartData = [
        { time: '2 am', value: 3.45 },
        { time: '10 am', value: 3.52 },
        { time: '6 pm', value: 3.48 },
        { time: '10 pm', value: 3.55 },
        { time: '9/14', value: 3.51 },
        { time: '2 am', value: 3.49 },
        { time: '10 am', value: 3.53 },
        { time: '2 pm', value: 3.50 }
    ];

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

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <ProloansLayout>
            <div className="px-6 py-8">
                {/* Header with refresh button */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold">Financial Dashboard</h1>
                        <p className="mt-2 text-gray-600 font-montserrat-regular">
                            Monitor loan performance and market trends • Last updated: {formatTime(currentTime)}
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-montserrat-medium"
                    >
                        {isRefreshing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh Data
                            </>
                        )}
                    </button>
                </div>

                {/* Top Section - Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* All Loan Amount Card */}
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-purple-700 font-montserrat-medium mb-2">All Loan Amount</h3>
                            <span className="text-purple-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-purple-900 font-montserrat-bold">
                            {formatCurrency(summaryData.allLoanAmount)}
                        </p>
                        <p className="text-sm text-purple-600 font-montserrat-medium mt-2">+12.5% from last month</p>
                    </div>

                    {/* Total Monthly Payment Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Total Monthly Payment</h3>
                            <span className="text-green-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 font-montserrat-bold">
                            {formatCurrency(summaryData.totalMonthlyPayment)}
                        </p>
                        <p className="text-sm text-green-600 font-montserrat-medium mt-2">On track for this month</p>
                    </div>

                    {/* Total All Loans Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Total All Loans</h3>
                            <span className="text-blue-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 font-montserrat-bold">
                            {summaryData.totalAllLoans} Loans
                        </p>
                        <p className="text-sm text-blue-600 font-montserrat-medium mt-2">2 new this week</p>
                    </div>
                </div>

                {/* Bottom Section - Analytics and Rates */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Part - Treasury Analytics */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 font-montserrat-semibold">
                                US. 10 Years Treasury Analytics
                            </h2>
                            <select
                                value={selectedDateRange}
                                onChange={(e) => setSelectedDateRange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-montserrat-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="Sept 13-14, 2023">Sept 13-14, 2023</option>
                                <option value="Sept 12-13, 2023">Sept 12-13, 2023</option>
                                <option value="Sept 11-12, 2023">Sept 11-12, 2023</option>
                            </select>
                        </div>

                        {/* Current Yield Display */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-4 mb-2">
                                <span className="text-sm text-gray-600 font-montserrat-medium">Yield 155 PM EDT</span>
                                <span className={`text-sm font-montserrat-medium ${treasuryData.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {treasuryData.isPositive ? '+' : ''}{treasuryData.change}
                                </span>
                            </div>
                            <div className="text-4xl font-bold text-gray-900 font-montserrat-bold">
                                {treasuryData.currentYield} %
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                            {/* Chart Line */}
                            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
                                    </linearGradient>
                                </defs>

                                {/* Chart Line */}
                                <polyline
                                    fill="none"
                                    stroke="#8B5CF6"
                                    strokeWidth="3"
                                    points={chartData.map((point, index) =>
                                        `${(index / (chartData.length - 1)) * 400},${200 - (point.value - 3.2) * 200}`
                                    ).join(' ')}
                                />

                                {/* Chart Area Fill */}
                                <polygon
                                    fill="url(#chartGradient)"
                                    points={`0,200 ${chartData.map((point, index) =>
                                        `${(index / (chartData.length - 1)) * 400},${200 - (point.value - 3.2) * 200}`
                                    ).join(' ')} 400,200`}
                                />

                                {/* Highlighted Point */}
                                <circle
                                    cx="300"
                                    cy="100"
                                    r="6"
                                    fill="#8B5CF6"
                                    stroke="white"
                                    strokeWidth="2"
                                />

                                {/* Tooltip */}
                                <rect
                                    x="310"
                                    y="90"
                                    width="40"
                                    height="20"
                                    fill="black"
                                    rx="4"
                                />
                                <text
                                    x="330"
                                    y="103"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontFamily="Montserrat"
                                    fontWeight="600"
                                >
                                    3.567
                                </text>

                                {/* Dashed Lines */}
                                <line
                                    x1="300"
                                    y1="0"
                                    x2="300"
                                    y2="200"
                                    stroke="#8B5CF6"
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                />
                                <line
                                    x1="0"
                                    y1="100"
                                    x2="400"
                                    y2="100"
                                    stroke="#8B5CF6"
                                    strokeWidth="1"
                                    strokeDasharray="5,5"
                                />
                            </svg>

                            {/* X-axis Labels */}
                            <div className="flex justify-between mt-2 text-xs text-gray-500 font-montserrat-medium">
                                {chartData.map((point, index) => (
                                    <span key={index}>{point.time}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Part - Today's Rates */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-4">Today's Rates</h2>

                        {/* Rate Cards */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Today's Highest Rate</h3>
                            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{ratesData.highest} %</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Today's Lowest Rate</h3>
                            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{ratesData.lowest} %</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Today's Open Rate</h3>
                            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{ratesData.open} %</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Today's Close Rate</h3>
                            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">{ratesData.close} %</p>
                        </div>
                    </div>
                </div>

                {/* Additional Metrics Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Active Loans</h3>
                        <p className="text-2xl font-bold text-green-600 font-montserrat-bold">24</p>
                        <p className="text-xs text-green-600 font-montserrat-medium">+2 from last month</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Pending Applications</h3>
                        <p className="text-2xl font-bold text-yellow-600 font-montserrat-bold">8</p>
                        <p className="text-xs text-yellow-600 font-montserrat-medium">Requires review</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Total Interest</h3>
                        <p className="text-2xl font-bold text-blue-600 font-montserrat-bold">$12,450</p>
                        <p className="text-xs text-blue-600 font-montserrat-medium">This month</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                        <h3 className="text-sm font-medium text-gray-600 font-montserrat-medium mb-2">Risk Score</h3>
                        <p className="text-2xl font-bold text-purple-600 font-montserrat-bold">16.8</p>
                        <p className="text-xs text-purple-600 font-montserrat-medium">/ 18.0</p>
                    </div>
                </div>
            </div>
        </ProloansLayout>
    );
}
