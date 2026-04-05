import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { logActivity } from '@/lib/audit-log';

// GET /api/servicos/[id] - Buscar servico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Servico nao encontrado' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar servico';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/servicos/[id] - Actualizar servico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data: existing, error: findError } = await supabase
      .from('servicos')
      .select('id, titulo')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Servico nao encontrado' }, { status: 404 });
    }
    const tituloServico = existing.titulo || 'Sem titulo';

    const updateData: Record<string, unknown> = {};
    if (body.titulo !== undefined) updateData.titulo = body.titulo.trim();
    if (body.descricao !== undefined) updateData.descricao = body.descricao;
    if (body.icone !== undefined) updateData.icone = body.icone;
    if (body.imagemBase64 !== undefined) updateData.imagem_base64 = body.imagemBase64;
    if (body.imagemTipo !== undefined) updateData.imagem_tipo = body.imagemTipo;
    if (body.ordem !== undefined) updateData.ordem = body.ordem;
    if (body.activo !== undefined) updateData.activo = body.activo;

    const { data, error } = await supabase
      .from('servicos')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'EDITAR_SERVICO', categoria: 'SERVICOS', detalhes: `Servico "${tituloServico}" actualizado` }).catch(() => {});

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar servico';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/servicos/[id] - Eliminar servico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar titulo do servico antes de eliminar
    const { data: servicoAntes } = await supabase
      .from('servicos')
      .select('titulo')
      .eq('id', id)
      .single();
    const tituloServico = servicoAntes?.titulo || 'Sem titulo';

    const { error } = await supabase.from('servicos').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'ELIMINAR_SERVICO', categoria: 'SERVICOS', detalhes: `Servico "${tituloServico}" eliminado` }).catch(() => {});

    return NextResponse.json({ message: 'Servico eliminado com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar servico';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
