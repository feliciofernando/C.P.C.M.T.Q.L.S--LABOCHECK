import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

// GET /api/site-settings - Buscar todas as configuracoes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('chave');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Converter para formato chave-valor simples
    const settings: Record<string, string> = {};
    for (const row of data || []) {
      settings[row.chave] = row.valor;
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao carregar configuracoes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/site-settings - Actualizar configuracoes (upsert)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    // Upsert cada configuracao (insert se nao existir, update se existir)
    for (const [chave, valor] of Object.entries(body)) {
      if (chave.startsWith('_')) continue;

      await supabase
        .from('site_settings')
        .upsert(
          {
            chave,
            valor: String(valor || ''),
            descricao: `Configuracao: ${chave}`,
          },
          { onConflict: 'chave' }
        );
    }

    return NextResponse.json({ message: 'Configuracoes actualizadas com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar configuracoes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
