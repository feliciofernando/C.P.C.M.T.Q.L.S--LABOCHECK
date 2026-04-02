import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    if (!search) {
      return NextResponse.json({ error: 'Parametro de pesquisa e obrigatorio' }, { status: 400 });
    }

    const numSearch = parseInt(search);
    let data = null;
    let error = null;

    if (!isNaN(numSearch) && String(numSearch) === search.trim()) {
      // Pure number: search ONLY by exact numero_ordem
      const res = await supabase
        .from('condutores')
        .select('*')
        .eq('numero_ordem', numSearch)
        .limit(1);
      data = res.data;
      error = res.error;
    } else {
      // Text: search by BI or name
      const res = await supabase
        .from('condutores')
        .select('*')
        .or(`numero_bi.ilike.%${search}%,nome_completo.ilike.%${search}%`)
        .limit(1);
      data = res.data;
      error = res.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Nenhum registo encontrado' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(data[0]));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro na consulta';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
