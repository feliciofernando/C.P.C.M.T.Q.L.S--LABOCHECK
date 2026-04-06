import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    if (!search) {
      return NextResponse.json({ error: 'Parâmetro de pesquisa é obrigatório' }, { status: 400 });
    }

    const trimmed = search.trim();

    // Strategy: search by numero_ordem (padded or integer), BI, or name
    // 1. Try as numero_ordem (parse "002" -> 2, "10" -> 10)
    const numSearch = parseInt(trimmed);
    let data = null;
    let error = null;

    if (!isNaN(numSearch)) {
      // Search by numero_ordem as integer
      const res = await supabase
        .from('condutores')
        .select('*')
        .eq('numero_ordem', numSearch)
        .limit(1);
      data = res.data;
      error = res.error;
    }

    // 2. If no result by order number, search by BI or name
    if (!data || data.length === 0) {
      const res = await supabase
        .from('condutores')
        .select('*')
        .or(`numero_bi.ilike.%${trimmed}%,nome_completo.ilike.%${trimmed}%`)
        .limit(1);
      data = res.data;
      error = res.error;
    }

    // 3. If still no result, also try numero_membro (for "000001/C.P.C..." searches)
    if (!data || data.length === 0) {
      const res = await supabase
        .from('condutores')
        .select('*')
        .ilike('numero_membro', `%${trimmed}%`)
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
