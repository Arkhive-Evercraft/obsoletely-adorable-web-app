import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { env } from "@repo/env/admin"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Optional: Add user restrictions here
      // const allowedUsers = ["your-github-username", "admin@yourcompany.com"];
      // return allowedUsers.includes(user.email || "") || allowedUsers.includes(user.name || "");
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user, account }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
}