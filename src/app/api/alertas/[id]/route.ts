import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { logActivity } from '@/lib/audit-log';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { acao, resolucao } = body;

    if (!acao) {
      return NextResponse.json({ error: 'Accao nao especificada' }, { status: 400 });
    }

    // Verificar se alerta existe
    const { data: alerta, error: findError } = await supabase
      .from('alertas')
      .select('id, condutor_id, mensagem')
      .eq('id', id)
      .single();

    if (findError || !alerta) {
      return NextResponse.json({ error: 'Alerta nao encontrado' }, { status: 404 });
    }

    const resumoAlerta = (alerta.mensagem || '').substring(0, 80) + ((alerta.mensagem || '').length > 80 ? '...' : '');

    let updateData: Record<string, unknown> = {};

    switch (acao) {
      case 'MARCAR_LIDA':
        updateData = { estado: 'LIDA', data_leitura: new Date().toISOString() };
        break;
      case 'MARCAR_RESOLVIDA':
        updateData = { estado: 'RESOLVIDA', data_resolucao: new Date().toISOString(), resolucao: resolucao || '' };
        break;
      case 'REABRIR':
        updateData = { estado: 'PENDENTE', data_leitura: null, data_resolucao: null, resolucao: '' };
        break;
      default:
        return NextResponse.json({ error: 'Accao invalida' }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from('alertas')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const logAcao = acao === 'REABRIR' ? 'REABRIR_ALERTA' : acao;
    const logDetalhes = acao === 'MARCAR_LIDA' ? `Alerta \"${resumoAlerta}\" marcado como lida`
      : acao === 'MARCAR_RESOLVIDA' ? `Alerta \"${resumoAlerta}\" marcado como resolvida`
      : `Alerta \"${resumoAlerta}\" reaberto`;
    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: logAcao, categoria: 'ALERTAS', detalhes: logDetalhes }).catch(() => {});

    // Buscar dados do condutor separadamente (evitar problemas com relações PostgREST)
    let condutorData = null;
    if (updated.condutor_id) {
      const { data } = await supabase
        .from('condutores')
        .select('id, numero_ordem, nome_completo, numero_bi, telefone1, tipo_veiculo, status, validade_licenca')
        .eq('id', updated.condutor_id)
        .single();
      if (data) condutorData = data;
    }

    const result = toCamelCase(updated) as Record<string, unknown>;
    result.condutor = condutorData ? toCamelCase(condutorData) : null;

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar alerta';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar dados do alerta antes de eliminar
    const { data: alertaAntes } = await supabase
      .from('alertas')
      .select('mensagem, tipo')
      .eq('id', id)
      .single();
    const resumoAlerta = (alertaAntes?.mensagem || '').substring(0, 80) + (((alertaAntes?.mensagem || '').length > 80) ? '...' : '');

    const { error } = await supabase.from('alertas').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'ELIMINAR_ALERTA', categoria: 'ALERTAS', detalhes: `Alerta "${resumoAlerta}" eliminado` }).catch(() => {});

    return NextResponse.json({ message: 'Alerta eliminado com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar alerta';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
