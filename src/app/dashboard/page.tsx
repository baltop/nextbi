import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/auth";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/login");

  return <DashboardClient user={{ id: user.id, email: user.email, name: user.name }} />;
}
