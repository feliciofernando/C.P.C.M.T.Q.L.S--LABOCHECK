import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { logActivity } from '@/lib/audit-log';

// GET /api/servicos - Listar servicos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    let query = supabase
      .from('servicos')
      .select('*', { count: 'exact' });

    if (!all) {
      query = query.eq('activo', true);
    }

    query = query.order('ordem', { ascending: true });

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;
    const camelData = (data || []).map((item: Record<string, unknown>) => toCamelCase(item));

    return NextResponse.json({ data: camelData, total });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar servicos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/servicos - Criar novo servico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descricao, icone, imagemBase64, imagemTipo, ordem, activo } = body;

    if (!titulo || !titulo.trim()) {
      return NextResponse.json({ error: 'Titulo e obrigatorio' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      titulo: titulo.trim(),
      descricao: descricao || '',
      icone: icone || '',
      imagem_base64: imagemBase64 || '',
      imagem_tipo: imagemTipo || 'image/jpeg',
      ordem: ordem || 0,
      activo: activo !== false,
    };

    const { data, error } = await supabase
      .from('servicos')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'CRIAR_SERVICO', categoria: 'SERVICOS', detalhes: `Servico criado: ${body.titulo || 'N/A'}` }).catch(() => {});

    return NextResponse.json(toCamelCase(data), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar servico';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
