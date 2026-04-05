import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Categorias de accoes
export const CATEGORIAS = {
  AUTENTICACAO: 'AUTENTICACAO',
  CONDUTORES: 'CONDUTORES',
  NOTICIAS: 'NOTICIAS',
  SERVICOS: 'SERVICOS',
  ALERTAS: 'ALERTAS',
  SLIDES: 'SLIDES',
  CARDS: 'CARDS',
  CONFIGURACAO: 'CONFIGURACAO',
  SISTEMA: 'SISTEMA',
} as const;

export type CategoriaType = (typeof CATEGORIAS)[keyof typeof CATEGORIAS];

// Accoes possiveis
export const ACCOES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CRIAR_FICHA: 'CRIAR_FICHA',
  EDITAR_FICHA: 'EDITAR_FICHA',
  ELIMINAR_FICHA: 'ELIMINAR_FICHA',
  ALTERAR_STATUS: 'ALTERAR_STATUS',
  CRIAR_NOTICIA: 'CRIAR_NOTICIA',
  EDITAR_NOTICIA: 'EDITAR_NOTICIA',
  ELIMINAR_NOTICIA: 'ELIMINAR_NOTICIA',
  CRIAR_SERVICO: 'CRIAR_SERVICO',
  EDITAR_SERVICO: 'EDITAR_SERVICO',
  ELIMINAR_SERVICO: 'ELIMINAR_SERVICO',
  VERIFICAR_VALIDADES: 'VERIFICAR_VALIDADES',
  MARCAR_LIDA: 'MARCAR_LIDA',
  MARCAR_RESOLVIDA: 'MARCAR_RESOLVIDA',
  REABRIR_ALERTA: 'REABRIR_ALERTA',
  ELIMINAR_ALERTA: 'ELIMINAR_ALERTA',
  OPERACAO_EM_MASSA: 'OPERACAO_EM_MASSA',
  CRIAR_SLIDE: 'CRIAR_SLIDE',
  EDITAR_SLIDE: 'EDITAR_SLIDE',
  ELIMINAR_SLIDE: 'ELIMINAR_SLIDE',
  CRIAR_CARD: 'CRIAR_CARD',
  EDITAR_CARD: 'EDITAR_CARD',
  ELIMINAR_CARD: 'ELIMINAR_CARD',
  ALTERAR_SECCAO: 'ALTERAR_SECCAO',
  ALTERAR_CONFIGURACAO: 'ALTERAR_CONFIGURACAO',
} as const;

export type AccaoType = (typeof ACCOES)[keyof typeof ACCOES];

interface LogEntry {
  adminId?: string;
  adminUsername: string;
  adminNome: string;
  acao: string;
  categoria: string;
  detalhes?: string;
  ipAddress?: string;
}

/**
 * Regista uma actividade no log de auditoria (server-side)
 * Uso: await logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: ACCOES.LOGIN, categoria: CATEGORIAS.AUTENTICACAO })
 */
export async function logActivity(entry: LogEntry): Promise<void> {
  try {
    await supabase.from('admin_activity_log').insert({
      admin_id: entry.adminId || null,
      admin_username: entry.adminUsername || 'sistema',
      admin_nome: entry.adminNome || 'Sistema',
      acao: entry.acao,
      categoria: entry.categoria,
      detalhes: entry.detalhes || '',
      ip_address: entry.ipAddress || '',
    });
  } catch {
    // Silently fail - audit log should never break the main flow
  }
}

/**
 * Obtem o username e nome do admin a partir da sessao NextAuth
 */
export function getAdminFromSession(session: { user?: { name?: string; email?: string } } | null): { username: string; nome: string; id?: string } {
  if (!session?.user?.name) return { username: 'desconhecido', nome: 'Desconhecido' };
  return { username: session.user.name, nome: session.user.name };
}

/**
 * Labels legiveis para categorias e accoes
 */
export const LABELS_CATEGORIAS: Record<string, string> = {
  AUTENTICACAO: 'Autenticacao',
  CONDUTORES: 'Condutores',
  NOTICIAS: 'Noticias',
  SERVICOS: 'Servicos',
  ALERTAS: 'Alertas',
  SLIDES: 'Slides',
  CARDS: 'Cards',
  CONFIGURACAO: 'Configuracao',
  SISTEMA: 'Sistema',
};

export const LABELS_ACCOES: Record<string, string> = {
  LOGIN: 'Inicio de Sessao',
  LOGOUT: 'Fim de Sessao',
  CRIAR_FICHA: 'Ficha Criada',
  EDITAR_FICHA: 'Ficha Editada',
  ELIMINAR_FICHA: 'Ficha Eliminada',
  ALTERAR_STATUS: 'Status Alterado',
  CRIAR_NOTICIA: 'Noticia Criada',
  EDITAR_NOTICIA: 'Noticia Editada',
  ELIMINAR_NOTICIA: 'Noticia Eliminada',
  CRIAR_SERVICO: 'Servico Criado',
  EDITAR_SERVICO: 'Servico Editado',
  ELIMINAR_SERVICO: 'Servico Eliminado',
  VERIFICAR_VALIDADES: 'Verificacao de Validades',
  MARCAR_LIDA: 'Alerta Marcado como Lida',
  MARCAR_RESOLVIDA: 'Alerta Resolvido',
  REABRIR_ALERTA: 'Alerta Reaberto',
  ELIMINAR_ALERTA: 'Alerta Eliminado',
  OPERACAO_EM_MASSA: 'Operacao em Massa',
  CRIAR_SLIDE: 'Slide Criado',
  EDITAR_SLIDE: 'Slide Editado',
  ELIMINAR_SLIDE: 'Slide Eliminado',
  CRIAR_CARD: 'Card Criado',
  EDITAR_CARD: 'Card Editado',
  ELIMINAR_CARD: 'Card Eliminado',
  ALTERAR_SECCAO: 'Seccao de Cards Alterada',
  ALTERAR_CONFIGURACAO: 'Configuracao Alterada',
};
