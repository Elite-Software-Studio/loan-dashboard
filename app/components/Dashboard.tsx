export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 font-montserrat-medium mb-2">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 font-montserrat-medium mb-2">Total Loans</h3>
            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 font-montserrat-medium mb-2">Active Payments</h3>
            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 font-montserrat-medium mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 font-montserrat-bold">-</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 font-montserrat-semibold mb-4">Welcome to Proloans</h2>
          <p className="text-gray-600 font-montserrat-regular">
            Your loan administration system dashboard. Use the navigation menu to access different sections.
          </p>
        </div>
      </div>
    </div>
  );
}

