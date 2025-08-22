import type { Route } from "./+types/home";
import { ProloansLayout } from "../components/ProloansLayout";
import { UserProfile } from "../components/UserProfile";
import { trpc } from "../lib/trpc-client";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Proloans - Loan Administration System" },
    { name: "description", content: "Professional Loan Administration System" },
  ];
}

export default function Home() {
  const { data: users } = trpc.getUsers.useQuery();

  // Show the first user's profile, or a loading state
  if (!users || users.length === 0) {
    return (
      <ProloansLayout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </ProloansLayout>
    );
  }

  // Show the first user's profile
  const firstUser = users[0];

  return (
    <ProloansLayout>
      <UserProfile userId={firstUser.id} />
    </ProloansLayout>
  );
}
