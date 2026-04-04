import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status sao obrigatorios' }, { status: 400 });
    }

    if (!['ATIVA', 'INATIVA'].includes(status)) {
      return NextResponse.json({ error: 'Status invalido. Use ATIVA ou INATIVA' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('condutores')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
