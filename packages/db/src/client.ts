import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  // Only create Prisma client on the server side
  if (typeof window === "undefined") {
    const prisma = new PrismaClient();
    console.log("Connected to database");

    global.prisma = prisma;
    return prisma;
  }

  throw new Error(
    "Database client cannot be accessed on the client side. Use server components or server actions to access the database."
  );
};

export const client = {
  get db() {
    return createClient();
  },
};
