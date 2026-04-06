import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase, toSnakeCase, arrayToCamelCase } from '@/lib/utils-supabase';
import QRCode from 'qrcode';
import { logActivity, getLoggedInAdmin } from '@/lib/audit-log';

export async function POST(request: NextRequest) {
  try {
    const admin = await getLoggedInAdmin();
    const data = await request.json();
    const snakeData = toSnakeCase(data);

    // Obter proximo numero_ordem
    const { data: lastCondutor, error: maxError } = await supabase
      .from('condutores')
      .select('numero_ordem')
      .order('numero_ordem', { ascending: false })
      .limit(1);

    const nextNumeroOrdem = (lastCondutor?.[0]?.numero_ordem || 0) + 1;

    // Gerar numero_membro
    const numeroMembro = `${String(nextNumeroOrdem).padStart(6, '0')}/C.P.C.M.T.Q.L.S/${String(new Date().getFullYear()).slice(2)}`;

    // Gerar QR Code com URL completo do site
    const siteUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '') || '';
    const qrData = `${siteUrl}/?consulta=${encodeURIComponent(data.numeroBI)}`;
    const qrCodePng = await QRCode.toDataURL(qrData, {
      type: 'image/png',
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
    const sharp = (await import('sharp')).default;
    const qrBuffer = Buffer.from(qrCodePng.replace(/^data:image\/png;base64,/, ''), 'base64');
    const jpegBuffer = await sharp(qrBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 92 })
      .toBuffer();
    const qrCodeBase64 = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;

    // Calcular datas da licenca
    const now = new Date();
    const dataEmissaoLicenca = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const nextYear = new Date(now);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const validadeLicenca = `${String(nextYear.getDate()).padStart(2, '0')}-${String(nextYear.getMonth() + 1).padStart(2, '0')}-${nextYear.getFullYear()}`;

    // Inserir no Supabase
    const insertData = {
      ...snakeData,
      numero_ordem: nextNumeroOrdem,
      numero_membro: numeroMembro,
      data_emissao_licenca: dataEmissaoLicenca,
      validade_licenca: validadeLicenca,
      qr_code_base64: qrCodeBase64,
      status: 'ATIVA',
    };

    const { data: condutor, error } = await supabase
      .from('condutores')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Audit log
    logActivity({
      adminUsername: admin.username,
      adminNome: admin.nome,
      adminId: admin.id,
      acao: 'CRIAR_FICHA',
      categoria: 'CONDUTORES',
      detalhes: `Ficha criada para ${data.nomeCompleto || 'N/A'} - No ${nextNumeroOrdem} - BI: ${data.numeroBI || 'N/A'}`,
    }).catch(() => {});

    return NextResponse.json(toCamelCase(condutor), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar registo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('condutores')
      .select('id, numero_ordem, nome_completo, numero_bi, sexo, tipo_veiculo, municipio, status, data_registo, data_emissao_licenca, validade_licenca, numero_membro', { count: 'exact' });

    // Filtro de status
    if (status && status !== 'TODOS') {
      query = query.eq('status', status);
    }

    // Pesquisa
    if (search) {
      const numSearch = parseInt(search);
      if (!isNaN(numSearch)) {
        query = query.or(`nome_completo.ilike.%${search}%,numero_bi.ilike.%${search}%,numero_ordem.eq.${numSearch}`);
      } else {
        query = query.or(`nome_completo.ilike.%${search}%,numero_bi.ilike.%${search}%`);
      }
    }

    // Ordenacao
    query = query.order('numero_ordem', { ascending: false });

    // Paginacao (Supabase range e 0-indexed, inclusive)
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: condutores, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;

    return NextResponse.json({
      data: arrayToCamelCase(condutores || []),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar condutores';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
