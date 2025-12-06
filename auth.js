// auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/dbConnect";
import User from "@/models/User";

// MAIN AUTH CONFIG
export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Apple({
      clientId: process.env.APPLE_CLIENT_ID ?? "unset",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "unset",
    }),

    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials;

        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("User not found");

        if (!user.password) throw new Error("Use Google/Apple login instead");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Wrong Password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
