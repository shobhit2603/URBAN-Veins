import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import dbConnect from "@/lib/dbConnection";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // Use JWT for sessions (works best with Credentials + OAuth)
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Connect to DB (Mongoose)
        await dbConnect();

        // 2. Find user
        const user = await User.findOne({ email: credentials.email }).select("+password");
        
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 3. If user signed up via OAuth (no password), block credentials login
        if (!user.password) {
          throw new Error("Please login with your social account");
        }

        // 4. Verify Password
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // 5. Return user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect here if auth fails
  },
});