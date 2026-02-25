import { redirect } from "next/navigation";

export default function LegacyUserRegisterPage() {
  redirect("/register?tab=user");
}
