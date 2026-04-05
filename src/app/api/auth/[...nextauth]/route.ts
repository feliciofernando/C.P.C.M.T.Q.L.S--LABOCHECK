import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/audit-log";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Detectar URL automaticamente para funcionar em localhost e Vercel
const getAuthUrl = () => {
  // Se NEXTAUTH_URL esta definido e nao e localhost, usar directamente
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost')) {
    return process.env.NEXTAUTH_URL;
  }
  // Em producao, inferir a partir de VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback para localhost
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

const authOptions = {
  // URL detectada automaticamente para funcionar em localhost e Vercel
  __experimental: {},

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credenciais",
      credentials: {
        username: { label: "Utilizador", type: "text" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        console.log('[AUTH] authorize called with username:', credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        try {
          // Validar credenciais contra a tabela admin_users no Supabase
          const { data, error } = await supabase
            .from("admin_users")
            .select("id, username, nome, role, activo")
            .eq("username", credentials.username)
            .eq("password", credentials.password)
            .eq("activo", true)
            .single();

          console.log('[AUTH] Supabase result - error:', error ? error.message : 'none', 'data:', data ? 'found' : 'null');

          if (error || !data) {
            return null;
          }

          // Actualizar ultimo acesso
          try {
            await supabase
              .from("admin_users")
              .update({ data_ultimo_acesso: new Date().toISOString() })
              .eq("id", data.id);
          } catch {
            // nao bloquear login se falhar actualizacao
          }

          console.log('[AUTH] Login successful for:', data.username);
          
          // Registar login no log de auditoria
          logActivity({
            adminId: data.id,
            adminUsername: data.username,
            adminNome: data.nome,
            acao: 'LOGIN',
            categoria: 'AUTENTICACAO',
            detalhes: 'Inicio de sessao no painel administrativo',
          }).catch(() => {});
          
          return {
            id: data.id,
            name: data.nome,
            role: data.role,
          };
        } catch (err) {
          console.error('[AUTH] Exception in authorize:', err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "cpcmtqls-secret-key-lunda-sul-2025",
  // URL detectada automaticamente - VERCEL_URL e usado em producao
  url: getAuthUrl(),
  trustHost: true,
  session: {
    strategy: "jwt" as const,
    maxAge: 1 * 60 * 60,
    updateAge: 15 * 60,
  },
  pages: {
    signIn: "/admin",
    newUser: "/admin",
  },
  // Em producao (Vercel/HTTPS), NextAuth usa cookies __Secure- automaticamente
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "admin";
        token.loginTime = Date.now();
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
