import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { count: pendentes } = await supabase
      .from('alertas')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'PENDENTE');

    const { count: lidas } = await supabase
      .from('alertas')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'LIDA');

    const { count: resolvidas } = await supabase
      .from('alertas')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'RESOLVIDA');

    const total = (pendentes?.count || 0) + (lidas?.count || 0) + (resolvidas?.count || 0);

    return NextResponse.json({
      total,
      PENDENTE: pendentes?.count || 0,
      LIDA: lidas?.count || 0,
      RESOLVIDA: resolvidas?.count || 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao contar alertas';
    console.error('[ALERTAS COUNT ERROR]', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
