import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase, toSnakeCase } from '@/lib/utils-supabase';
import { logActivity } from '@/lib/audit-log';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const snakeData = toSnakeCase(data);
    snakeData.data_atualizacao = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('condutores')
      .update(snakeData)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'EDITAR_FICHA', categoria: 'CONDUTORES', detalhes: `Ficha do condutor ${id} actualizada` }).catch(() => {});
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
    const { id } = await params;
    const { error } = await supabase
      .from('condutores')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'ELIMINAR_FICHA', categoria: 'CONDUTORES', detalhes: `Ficha do condutor ${id} eliminada` }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
