import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/auth";
import InterviewUploadClient from "./interview-upload-client";

export default async function InterviewUploadPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/login");

  return (
    <InterviewUploadClient
      user={{ id: user.id, email: user.email, name: user.name }}
    />
  );
}
