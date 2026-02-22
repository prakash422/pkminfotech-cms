import NextAuth from "next-auth"
import { authOptionsAdmin } from "@/lib/auth-admin"

const handler = NextAuth({
  ...authOptionsAdmin,
  basePath: "/api/auth/admin",
})

export { handler as GET, handler as POST }
