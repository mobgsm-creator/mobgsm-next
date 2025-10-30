import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import CredentialsProvider from "next-auth/providers/credentials";
// import FacebookProvider from "next-auth/providers/facebook";
// import TwitterProvider from "next-auth/providers/twitter";
// import InstagramProvider from "next-auth/providers/instagram";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
// Initialize Supabase Client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Azure Storage Configuration
//const EXISTING_CONTAINER_NAME = "ESO-mentors"; // Change this to your actual container name

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
    
         return null;
        }


        const { data: userRecord } = await supabase
          .from("ESO")
          .select("email, username, password_hash")
          .eq("username", credentials.username)
          .single();

        if (!userRecord) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userRecord.password_hash
        );

        if (!passwordMatch) return null;

        return {
          id: userRecord.email,
          email: userRecord.email,
          name: userRecord.username || "Manual User",
        };
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, // important for HTTPS behind proxy
      },
    },
  },
  useSecureCookies: true,
 
   
  callbacks: {
    async signIn({ user }) {
      if ( user?.email) {
        try {
          const reqHeaders = headers();
          const country =
            reqHeaders?.get("x-geo-country") ||
            reqHeaders?.get("cf-ipcountry") ||
            "unknown";
            //console.log("Country:",country)
          // 🔹 Initialize mindmap usage record for new users
          const { data: existingUsage } = await supabase
            .from("Users")
            .select("email")
            .eq("email", user.email)
            .single();

          if (!existingUsage) {
            const { error: insertError } = await supabase
              .from("Users")
              .insert([{ email: user.email, username: user.email.split("@")[0], country: country }]); // Use email prefix as username
            if (insertError) throw insertError;
            console.log(`✅ New record created: ${user.email}`);
          } else {
            console.log(`ℹ️ User already has record: ${user.email}`);
          }

        
        } catch (error) {
          console.error("🔥 Error in sign-in process:", error);
          return false; // Fail sign-in if something goes wrong
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub || "", // ✅ Ensure 'id' is always set
          },
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for production
};
