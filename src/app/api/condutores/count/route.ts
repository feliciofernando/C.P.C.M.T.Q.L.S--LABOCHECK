import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { count: total } = await supabase
      .from('condutores')
      .select('*', { count: 'exact', head: true });

    const { count: ativas } = await supabase
      .from('condutores')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ATIVA');

    const { count: inativas } = await supabase
      .from('condutores')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'INATIVA');

    return NextResponse.json({
      total: total || 0,
      ativas: ativas || 0,
      inativas: inativas || 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao contar condutores';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
