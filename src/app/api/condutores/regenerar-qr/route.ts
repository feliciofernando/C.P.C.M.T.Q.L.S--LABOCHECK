import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import QRCode from 'qrcode';
import sharp from 'sharp';

export async function POST() {
  try {
    const siteUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '') || '';

    if (!siteUrl || siteUrl.includes('localhost')) {
      return NextResponse.json(
        { error: 'NEXTAUTH_URL nao esta configurada com o dominio de producao. Configure no Vercel com o URL do site.' },
        { status: 400 }
      );
    }

    // Buscar todos os condutores
    const { data: condutores, error: fetchError } = await supabase
      .from('condutores')
      .select('id, numero_bi');

    if (fetchError || !condutores) {
      return NextResponse.json({ error: 'Erro ao buscar condutores' }, { status: 500 });
    }

    let updated = 0;
    let errors = 0;

    for (const condutor of condutores) {
      try {
        const bi = condutor.numero_bi || '';
        const qrData = `${siteUrl}/?consulta=${encodeURIComponent(bi)}`;

        const qrCodePng = await QRCode.toDataURL(qrData, {
          type: 'image/png',
          width: 400,
          margin: 2,
          errorCorrectionLevel: 'M',
        });

        const qrBuffer = Buffer.from(qrCodePng.replace(/^data:image\/png;base64,/, ''), 'base64');
        const jpegBuffer = await sharp(qrBuffer)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 92 })
          .toBuffer();

        const qrCodeBase64 = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;

        const { error: updateError } = await supabase
          .from('condutores')
          .update({ qr_code_base64: qrCodeBase64 })
          .eq('id', condutor.id);

        if (!updateError) {
          updated++;
        } else {
          errors++;
        }
      } catch {
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      total: condutores.length,
      updated,
      errors,
      siteUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao regenerar QR Codes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
