import AuthForm from "../auth/AuthForm";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return <AuthForm nextPath={params.next} linkExpired={params.error === "expired"} />;
}
