import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Check if password matches the hard-coded value
    if (password !== env.PASSWORD) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate JWT token with a more complete payload
    const payload = {
      sub: "admin",
      user: "admin",
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Use the consistent JWT_SECRET
    const token = jwt.sign(
      payload,
      env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Set auth cookie with JWT token
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token", 
      value: token, 
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // Add secure: true in production
      maxAge: 60 * 60 * 24, // 24 hours in seconds
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Delete auth_token cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}