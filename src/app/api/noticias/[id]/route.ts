import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { logActivity } from '@/lib/audit-log';

// GET /api/noticias/[id] - Buscar noticia por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Noticia nao encontrada' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar noticia';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/noticias/[id] - Actualizar noticia
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar se noticia existe
    const { data: existing, error: findError } = await supabase
      .from('noticias')
      .select('id, titulo')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Noticia nao encontrada' }, { status: 404 });
    }
    const tituloNoticia = existing.titulo || 'Sem titulo';

    const updateData: Record<string, unknown> = {};
    if (body.titulo !== undefined) updateData.titulo = body.titulo.trim();
    if (body.resumo !== undefined) updateData.resumo = body.resumo;
    if (body.conteudo !== undefined) updateData.conteudo = body.conteudo;
    if (body.imagemBase64 !== undefined) updateData.imagem_base64 = body.imagemBase64;
    if (body.imagemTipo !== undefined) updateData.imagem_tipo = body.imagemTipo;
    if (body.activo !== undefined) updateData.activo = body.activo;
    if (body.destaque !== undefined) updateData.destaque = body.destaque;
    if (body.ordem !== undefined) updateData.ordem = body.ordem;

    const { data, error } = await supabase
      .from('noticias')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'EDITAR_NOTICIA', categoria: 'NOTICIAS', detalhes: `Noticia "${tituloNoticia}" actualizada` }).catch(() => {});

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar noticia';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/noticias/[id] - Eliminar noticia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar titulo da noticia antes de eliminar
    const { data: noticiaAntes } = await supabase
      .from('noticias')
      .select('titulo')
      .eq('id', id)
      .single();
    const tituloNoticia = noticiaAntes?.titulo || 'Sem titulo';

    const { error } = await supabase.from('noticias').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'ELIMINAR_NOTICIA', categoria: 'NOTICIAS', detalhes: `Noticia "${tituloNoticia}" eliminada` }).catch(() => {});

    return NextResponse.json({ message: 'Noticia eliminada com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar noticia';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
