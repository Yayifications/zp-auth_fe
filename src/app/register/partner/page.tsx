import { redirect } from "next/navigation";

export default function LegacyPartnerRegisterPage() {
  redirect("/register?tab=partner");
}
