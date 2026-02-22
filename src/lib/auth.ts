import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

// Shared credential check: find user and validate password. Returns user or null.
async function findUserByCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  })
  if (!user || !user.password) return null
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return null
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // User only: credentials (email/password), role must be "user" (admin logs in at /admin/login)
    CredentialsProvider({
      id: "credentials-user",
      name: "credentials-user",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await findUserByCredentials(credentials.email, credentials.password)
        if (!user || user.role !== "user") return null
        return user
      },
    }),
    // User: Google sign-in/sign-up
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // OAuth (Google): find or create user in DB, set id and role
      if (account?.provider === "google" && user?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              role: "user",
              // password left null for Google-only users
            },
          })
        }
        token.sub = dbUser.id
        token.role = dbUser.role
        token.picture = dbUser.image ?? user.image
        return token
      }
      // Credentials: pass through role from authorize
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        if (token.picture) session.user.image = token.picture as string
      }
      return session
    },
    // Redirect: admin login -> dashboard, user login -> home
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
  },
}
