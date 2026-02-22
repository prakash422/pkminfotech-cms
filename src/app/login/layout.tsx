import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in | pkminfotech",
  description: "Sign in to your pkminfotech account.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
