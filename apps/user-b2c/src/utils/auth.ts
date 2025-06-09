import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { env } from "@repo/env/web"
import { getServerSession } from "next-auth/next";
import { getCustomerByEmail, createCustomer } from "@repo/db/functions";

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
      // Auto-create customer in database when user signs in for the first time
      if (user.email && user.name) {
        try {
          // Check if customer already exists
          const existingCustomer = await getCustomerByEmail(user.email);
          
          if (!existingCustomer) {
            // Create new customer if they don't exist
            await createCustomer({
              name: user.name,
              email: user.email,
              phone: undefined, // Will be set when user updates their profile
              address: undefined, // Will be set when user updates their profile
            }).then((newCustomer) => {
              if (newCustomer) {
                console.log(`Created new customer: ${newCustomer.email}`);
              }
            }).catch((error) => {
              console.error(`Failed to create customer for ${user.email}:`, error);
            });
          }
        } catch (error) {
          console.error('Error during customer operations in sign in:', error);
          // Don't block authentication even if database operations fail
        }
      }
      
      // Always return true to allow sign in to proceed
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
  // Add debug logging in development
  debug: process.env.NODE_ENV === 'development',
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
