import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { getServerSession } from "next-auth/next";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
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
  secret: process.env.NEXTAUTH_SECRET || '',
}

export async function isLoggedIn() {
  try {
    const session = await getServerSession(authOptions);
    return !!session;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
