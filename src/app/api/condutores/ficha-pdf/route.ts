import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import { generateFichaPDF } from '@/lib/ficha-pdf';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
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

    const condutor = toCamelCase(data) as Record<string, unknown>;
    const pdfBuffer = generateFichaPDF(condutor);

    const nome = String(condutor.nomeCompleto || 'condutor').replace(/\s+/g, '_');
    const numero = String(condutor.numeroOrdem || 0).padStart(3, '0');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Ficha_Registo_${numero}_${nome}.pdf"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
