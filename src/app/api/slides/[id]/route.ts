import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

// GET /api/slides/[id] - Buscar slide por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Slide nao encontrado' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar slide';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/slides/[id] - Actualizar slide
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar se slide existe
    const { data: existing, error: findError } = await supabase
      .from('slides')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Slide nao encontrado' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.titulo !== undefined) updateData.titulo = body.titulo.trim();
    if (body.subtitulo !== undefined) updateData.subtitulo = body.subtitulo;
    if (body.descricao !== undefined) updateData.descricao = body.descricao;
    if (body.textoBotao !== undefined) updateData.texto_botao = body.textoBotao;
    if (body.linkBotao !== undefined) updateData.link_botao = body.linkBotao;
    if (body.imagemBase64 !== undefined) updateData.imagem_base64 = body.imagemBase64;
    if (body.imagemTipo !== undefined) updateData.imagem_tipo = body.imagemTipo;
    if (body.activo !== undefined) updateData.activo = body.activo;
    if (body.ordem !== undefined) updateData.ordem = body.ordem;
    if (body.tempoTransicao !== undefined) updateData.tempo_transicao = body.tempoTransicao;

    const { data, error } = await supabase
      .from('slides')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar slide';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/slides/[id] - Eliminar slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from('slides').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Slide eliminado com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar slide';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
