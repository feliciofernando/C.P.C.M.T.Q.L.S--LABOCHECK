import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { logActivity } from '@/lib/audit-log';

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status sao obrigatorios' }, { status: 400 });
    }

    if (!['ATIVA', 'INATIVA'].includes(status)) {
      return NextResponse.json({ error: 'Status invalido. Use ATIVA ou INATIVA' }, { status: 400 });
    }

    // Buscar nome do condutor antes de alterar
    const { data: condutor } = await supabase
      .from('condutores')
      .select('nome_completo, numero_ordem')
      .eq('id', id)
      .single();
    const nomeCondutor = condutor?.nome_completo || 'Desconhecido';
    const numeroOrdem = condutor?.numero_ordem || '?';

    const { data, error } = await supabase
      .from('condutores')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const statusLegivel = status === 'ATIVA' ? 'Activa' : 'Inactiva';

    // Audit log
    logActivity({
      adminUsername: 'admin',
      adminNome: 'Administrador',
      acao: 'ALTERAR_STATUS',
      categoria: 'CONDUTORES',
      detalhes: `Status do(a) condutor(a) ${nomeCondutor} (N.º ${numeroOrdem}) alterado para ${statusLegivel}`,
    }).catch(() => {});

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
