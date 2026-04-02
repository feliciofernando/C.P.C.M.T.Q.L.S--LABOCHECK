import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

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
      .select('id, condutor_id')
      .eq('id', id)
      .single();

    if (findError || !alerta) {
      return NextResponse.json({ error: 'Alerta nao encontrado' }, { status: 404 });
    }

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

    const { error } = await supabase.from('alertas').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alerta eliminado com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar alerta';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
