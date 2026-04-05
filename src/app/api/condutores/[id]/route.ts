import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase, toSnakeCase } from '@/lib/utils-supabase';
import { logActivity, getLoggedInAdmin } from '@/lib/audit-log';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getLoggedInAdmin();
    const { id } = await params;
    const data = await request.json();
    const snakeData = toSnakeCase(data);
    snakeData.data_atualizacao = new Date().toISOString();

    // Buscar nome do condutor antes de actualizar
    const { data: condutorAntes } = await supabase
      .from('condutores')
      .select('nome_completo, numero_ordem')
      .eq('id', id)
      .single();
    const nomeCondutor = condutorAntes?.nome_completo || 'Desconhecido';
    const numeroOrdem = condutorAntes?.numero_ordem || '?';

    const { data: updated, error } = await supabase
      .from('condutores')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    logActivity({ adminUsername: admin.username, adminNome: admin.nome, adminId: admin.id, acao: 'EDITAR_FICHA', categoria: 'CONDUTORES', detalhes: `Ficha do(a) condutor(a) ${nomeCondutor} (N.º ${numeroOrdem}) actualizada` }).catch(() => {});
    return NextResponse.json(toCamelCase(updated));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getLoggedInAdmin();
    const { id } = await params;

    // Buscar nome do condutor antes de eliminar
    const { data: condutorAntes } = await supabase
      .from('condutores')
      .select('nome_completo, numero_ordem')
      .eq('id', id)
      .single();
    const nomeCondutor = condutorAntes?.nome_completo || 'Desconhecido';
    const numeroOrdem = condutorAntes?.numero_ordem || '?';

    const { error } = await supabase
      .from('condutores')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    logActivity({ adminUsername: admin.username, adminNome: admin.nome, adminId: admin.id, acao: 'ELIMINAR_FICHA', categoria: 'CONDUTORES', detalhes: `Ficha do(a) condutor(a) ${nomeCondutor} (N.º ${numeroOrdem}) eliminada` }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
