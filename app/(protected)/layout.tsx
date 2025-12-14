import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth/sign-in");
  }

  return <div>{children}</div>;
}
