import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { logActivity } from '@/lib/audit-log';

// GET /api/cards - Fetch all active cards + cards_section settings
export async function GET() {
  try {
    // Fetch cards_section settings
    const { data: sectionData, error: sectionError } = await supabase
      .from('cards_section')
      .select('*')
      .limit(1)
      .single();

    // Fetch active cards
    const { data: cardsData, error: cardsError } = await supabase
      .from('cards')
      .select('*')
      .eq('activo', true)
      .order('ordem', { ascending: true });

    if (cardsError) {
      return NextResponse.json({ error: cardsError.message }, { status: 500 });
    }

    const section = sectionData
      ? {
          titulo: sectionData.titulo || '',
          subtitulo: sectionData.subtitulo || '',
          imagem_fundo_base64: sectionData.imagem_fundo_base64 || '',
          imagem_fundo_tipo: sectionData.imagem_fundo_tipo || '',
        }
      : {
          titulo: 'Explore Nosso Conselho',
          subtitulo: '',
          imagem_fundo_base64: '',
          imagem_fundo_tipo: '',
        };

    return NextResponse.json({
      cards: cardsData || [],
      section,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar cards';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/cards - Update cards section settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, subtitulo, imagem_fundo_base64, imagem_fundo_tipo } = body;

    const updateData: Record<string, unknown> = {};
    if (titulo !== undefined) updateData.titulo = titulo.trim();
    if (subtitulo !== undefined) updateData.subtitulo = (subtitulo || '').trim();
    if (imagem_fundo_base64 !== undefined) updateData.imagem_fundo_base64 = imagem_fundo_base64;
    if (imagem_fundo_tipo !== undefined) updateData.imagem_fundo_tipo = imagem_fundo_tipo;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }

    // Check if section record exists
    const { data: existing } = await supabase
      .from('cards_section')
      .select('id')
      .limit(1)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('cards_section')
        .update(updateData)
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    } else {
      // Insert with defaults if no record exists
      const insertData = {
        titulo: updateData.titulo || 'Explore Nosso Conselho',
        subtitulo: updateData.subtitulo || '',
        imagem_fundo_base64: updateData.imagem_fundo_base64 || '',
        imagem_fundo_tipo: updateData.imagem_fundo_tipo || '',
      };
      const { data, error } = await supabase
        .from('cards_section')
        .insert(insertData)
        .select('*')
        .single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      result = data;
    }

    logActivity({ adminUsername: 'admin', adminNome: 'Administrador', acao: 'ALTERAR_SECCAO', categoria: 'CARDS', detalhes: 'Seccao de cards actualizada' }).catch(() => {});

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar seccao de cards';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
