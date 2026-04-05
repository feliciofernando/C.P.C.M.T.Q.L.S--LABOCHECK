import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('condutores')
      .select('qr_code_base64, nome_completo, numero_ordem')
      .eq('id', id)
      .single();

    if (error || !data || !data.qr_code_base64) {
      return NextResponse.json({ error: 'QR Code nao encontrado' }, { status: 404 });
    }

    const base64Data = data.qr_code_base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="QR_Code_${data.numero_ordem}_${String(data.nome_completo).replace(/\s+/g, '_')}.jpg"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao descarregar QR Code';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
