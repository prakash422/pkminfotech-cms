import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign up | PKMinfotech",
  description: "Create your free account to save progress and access more features.",
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
