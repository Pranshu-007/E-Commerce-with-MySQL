// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user found");
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password!);
        if (!isPasswordValid) throw new Error("Wrong password");

        return user;
      },
    }),
  ],
};
