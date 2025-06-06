// import jwt from "jsonwebtoken";
// import { env } from "@repo/env/admin"
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

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
