import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/admin/logs - Listar logs de actividade
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const categoria = searchParams.get('categoria') || '';
    const acao = searchParams.get('acao') || '';
    const admin = searchParams.get('admin') || '';
    const dataInicio = searchParams.get('dataInicio') || '';
    const dataFim = searchParams.get('dataFim') || '';

    let query = supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (categoria) query = query.eq('categoria', categoria);
    if (acao) query = query.eq('acao', acao);
    if (admin) query = query.or(`admin_username.ilike.%${admin}%,admin_nome.ilike.%${admin}%`);
    if (dataInicio) query = query.gte('created_at', dataInicio);
    if (dataFim) query = query.lte('created_at', dataFim + 'T23:59:59');

    const { data, error, count } = await query;

    if (error) {
      // Table might not exist yet
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          setup: false,
          message: 'Tabela de auditoria nao encontrada. Execute audit-setup.sql no Supabase Dashboard.',
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      setup: true,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao carregar logs' }, { status: 500 });
  }
}

// POST /api/admin/logs - Registar uma actividade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, adminUsername, adminNome, acao, categoria, detalhes, ipAddress } = body;

    if (!acao || !categoria) {
      return NextResponse.json({ error: 'acao e categoria sao obrigatorios' }, { status: 400 });
    }

    const { error } = await supabase.from('admin_activity_log').insert({
      admin_id: adminId || null,
      admin_username: adminUsername || 'sistema',
      admin_nome: adminNome || 'Sistema',
      acao,
      categoria,
      detalhes: detalhes || '',
      ip_address: ipAddress || '',
    });

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ logged: false, setup: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logged: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao registar actividade' }, { status: 500 });
  }
}
