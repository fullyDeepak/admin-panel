import User from '@/model/user.model';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { connectToMongoDB } from '@/utils/db';

const handler = NextAuth({
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'Credential',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        await connectToMongoDB();
        const emailPattern = /^\S+@rezy\.in$/i;
        const email = credentials?.email;
        if (email && !emailPattern.test(email)) {
          return null;
        }
        const password = credentials?.password;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email.');
        }
        if (!user.isVerified) {
          throw new Error(
            'Please ask admin to verify your account before login.'
          );
        }
        let isPasswordCorrect;
        if (user && password && user?.password) {
          isPasswordCorrect = await compare(password || '', user?.password);
        }
        if (user && isPasswordCorrect) {
          return user;
        }
        throw new Error("Email or password didn't match.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.name = token.name;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
