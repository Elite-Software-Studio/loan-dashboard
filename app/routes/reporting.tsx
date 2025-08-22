import { ProloansLayout } from '../components/ProloansLayout';

export function meta() {
  return [
    { title: "Reporting - Proloans" },
    { name: "description", content: "Financial reports and analytics" },
  ];
}

export default function Reporting() {
  return (
    <ProloansLayout>
      <div className="px-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat-bold mb-4">Reporting & Analytics</h1>
          <p className="text-gray-600 font-montserrat-regular">
            Advanced reporting features coming soon...
          </p>
        </div>
      </div>
    </ProloansLayout>
  );
}
