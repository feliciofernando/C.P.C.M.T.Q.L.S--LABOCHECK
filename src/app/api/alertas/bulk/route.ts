import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { logActivity } from '@/lib/audit-log';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { acao, ids } = body;

    if (!acao) {
      return NextResponse.json({ error: 'Accao nao especificada' }, { status: 400 });
    }

    let count = 0;

    switch (acao) {
      case 'MARCAR_TODAS_LIDAS': {
        const { data } = await supabase
          .from('alertas')
          .update({ estado: 'LIDA', data_leitura: new Date().toISOString() })
          .eq('estado', 'PENDENTE')
          .select('id');
        count = data?.length || 0;
        break;
      }
      case 'RESOLVER_SELECIONADAS': {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          return NextResponse.json({ error: 'IDs nao especificados' }, { status: 400 });
        }
        const { data } = await supabase
          .from('alertas')
          .update({ estado: 'RESOLVIDA', data_resolucao: new Date().toISOString() })
          .in('id', ids)
          .select('id');
        count = data?.length || 0;
        break;
      }
      case 'ELIMINAR_RESOLVIDAS': {
        const { data } = await supabase
          .from('alertas')
          .delete()
          .eq('estado', 'RESOLVIDA')
          .select('id');
        count = data?.length || 0;
        break;
      }
      case 'ELIMINAR_SELECIONADAS': {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          return NextResponse.json({ error: 'IDs nao especificados' }, { status: 400 });
        }
        const { data } = await supabase
          .from('alertas')
          .delete()
          .in('id', ids)
          .select('id');
        count = data?.length || 0;
        break;
      }
      default:
        return NextResponse.json({ error: 'Accao invalida' }, { status: 400 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'OPERACAO_EM_MASSA', categoria: 'ALERTAS', detalhes: `Operacao em massa: ${acao} - ${count} registos afectados` }).catch(() => {});

    return NextResponse.json({
      message: `${count} alerta(s) processada(s) com sucesso`,
      count,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao processar accao em massa';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
