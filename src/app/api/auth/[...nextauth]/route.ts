import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        username: { label: "Utilizador", type: "text" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Validar credenciais contra a tabela admin_users no Supabase
        const { data, error } = await supabase
          .from("admin_users")
          .select("id, username, nome, role, activo")
          .eq("username", credentials.username)
          .eq("password", credentials.password)
          .eq("activo", true)
          .single();

        if (error || !data) {
          return null;
        }

        // Actualizar ultimo acesso
        await supabase
          .from("admin_users")
          .update({ data_ultimo_acesso: new Date().toISOString() })
          .eq("id", data.id);

        return {
          id: data.id,
          name: data.nome,
          role: data.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "cpcmtqls-secret-key-lunda-sul-2025",
  session: {
    strategy: "jwt" as const,
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
