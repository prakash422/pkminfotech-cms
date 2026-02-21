import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in | PKMinfotech",
  description: "Sign in to your PKMinfotech account.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
