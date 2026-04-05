import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('condutores')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Condutor nao encontrado' }, { status: 404 });
    }

    return NextResponse.json(toCamelCase(data));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar condutor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
