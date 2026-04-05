import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT /api/cards/[id] - Update card item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    const allowedFields = ['titulo', 'descricao', 'conteudo', 'icone', 'link', 'ordem', 'activo'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cards')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Card nao encontrado' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar card';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/cards/[id] - Delete card item (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase.from('cards').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Card eliminado com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar card';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/cards/[id] - Create new card item (admin only)
export async function POST(
  request: NextRequest,
  _params: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, descricao, conteudo, icone, link, ordem } = body;

    if (!titulo) {
      return NextResponse.json(
        { error: 'Campo obrigatorio: titulo' },
        { status: 400 }
      );
    }

    const insertData: Record<string, unknown> = {
      titulo: titulo.trim(),
      descricao: (descricao || '').trim(),
      conteudo: (conteudo || '').trim(),
      icone: (icone || '').trim(),
      link: (link || '').trim(),
      ordem: ordem !== undefined ? ordem : 0,
      activo: true,
    };

    const { data, error } = await supabase
      .from('cards')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar card';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
