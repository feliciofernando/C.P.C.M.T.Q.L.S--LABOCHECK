import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

// GET /api/noticias - Listar noticias (publico: so activas, admin: todas)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    let query = supabase
      .from('noticias')
      .select('*', { count: 'exact' });

    // Se nao for admin (all=true), so mostra activas
    if (!all) {
      query = query.eq('activo', true);
    }

    query = query.order('ordem', { ascending: true });
    query = query.order('data_publicacao', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;
    const camelData = (data || []).map((item: Record<string, unknown>) => toCamelCase(item));

    return NextResponse.json({
      data: camelData,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar noticias';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/noticias - Criar nova noticia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, resumo, conteudo, imagemBase64, imagemTipo, activo, destaque, ordem } = body;

    if (!titulo || !titulo.trim()) {
      return NextResponse.json({ error: 'Titulo e obrigatorio' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      titulo: titulo.trim(),
      resumo: resumo || '',
      conteudo: conteudo || '',
      imagem_base64: imagemBase64 || '',
      imagem_tipo: imagemTipo || 'image/jpeg',
      activo: activo !== false,
      destaque: destaque || false,
      ordem: ordem || 0,
    };

    const { data, error } = await supabase
      .from('noticias')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(toCamelCase(data), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar noticia';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
