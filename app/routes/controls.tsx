import { useState } from 'react';
import { ProloansLayout } from '../components/ProloansLayout';
import { CompanyManagement } from '../components/CompanyManagement';
import { BranchManagement } from '../components/BranchManagement';
import { UserManagement } from '../components/UserManagement';

export function meta() {
  return [
    { title: "Controls - Proloans" },
    { name: "description", content: "System controls and settings" },
  ];
}

export default function Controls() {
  const [activeTab, setActiveTab] = useState<'company' | 'branch' | 'users'>('company');

  const tabs = [
    { id: 'company' as const, name: 'Company', icon: '🏢' },
    { id: 'branch' as const, name: 'Branch', icon: '📍' },
    { id: 'users' as const, name: 'Users', icon: '👥' },
  ];

  return (
    <ProloansLayout>
      <div className="px-1 py-1">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mb-2">
            System Controls
          </h1>
          <p className="text-gray-600 font-montserrat-regular">
            Manage companies and branches for your organization
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'company' && <CompanyManagement />}
          {activeTab === 'branch' && <BranchManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </ProloansLayout>
  );
}
