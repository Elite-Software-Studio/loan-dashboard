import { ProloansLayout } from '../components/ProloansLayout';

export function meta() {
  return [
    { title: "Loans - Proloans" },
    { name: "description", content: "Manage loan applications and portfolios" },
  ];
}

export default function Loans() {
  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mb-4">Loans Management</h1>
          <p className="text-gray-600 font-montserrat-regular">
            Loan management features coming soon...
          </p>
        </div>
      </div>
    </ProloansLayout>
  );
}
