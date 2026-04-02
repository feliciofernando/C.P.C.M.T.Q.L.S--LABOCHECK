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
    let query = supabase
      .from('condutores')
      .select('*');

    if (!isNaN(numSearch)) {
      query = query.or(`numero_bi.ilike.%${search}%,numero_ordem.eq.${numSearch},nome_completo.ilike.%${search}%`);
    } else {
      query = query.or(`numero_bi.ilike.%${search}%,nome_completo.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(1);

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
