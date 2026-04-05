import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { logActivity, getLoggedInAdmin } from '@/lib/audit-log';

// GET /api/slides - Listar slides (publico: so activas, admin: todas)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    let query = supabase
      .from('slides')
      .select('*');

    // Se nao for admin (all=true), so mostra activas
    if (!all) {
      query = query.eq('activo', true);
    }

    query = query.order('ordem', { ascending: true });
    query = query.order('data_criacao', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const camelData = (data || []).map((item: Record<string, unknown>) => toCamelCase(item));

    return NextResponse.json({ data: camelData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar slides';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/slides - Criar novo slide
export async function POST(request: NextRequest) {
  try {
    const admin = await getLoggedInAdmin();
    const body = await request.json();
    const { titulo, subtitulo, descricao, textoBotao, linkBotao, imagemBase64, imagemTipo, activo, ordem, tempoTransicao } = body;

    if (!titulo || !titulo.trim()) {
      return NextResponse.json({ error: 'Titulo e obrigatorio' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      titulo: titulo.trim(),
      subtitulo: subtitulo || '',
      descricao: descricao || '',
      texto_botao: textoBotao || 'Saber Mais',
      link_botao: linkBotao || '#',
      imagem_base64: imagemBase64 || '',
      imagem_tipo: imagemTipo || 'image/jpeg',
      activo: activo !== false,
      ordem: ordem || 0,
      tempo_transicao: tempoTransicao || 5000,
    };

    const { data, error } = await supabase
      .from('slides')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: admin.username, adminNome: admin.nome, adminId: admin.id, acao: 'CRIAR_SLIDE', categoria: 'SLIDES', detalhes: `Slide criado: ${body.titulo || 'N/A'}` }).catch(() => {});

    return NextResponse.json(toCamelCase(data), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar slide';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
