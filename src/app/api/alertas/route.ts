import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado') || '';
    const tipo = searchParams.get('tipo') || '';
    const prioridade = searchParams.get('prioridade') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filters
    const filters: string[] = [];
    if (estado && estado !== 'TODOS') filters.push(`estado.eq.${estado}`);
    if (tipo && tipo !== 'TODOS') filters.push(`tipo.eq.${tipo}`);
    if (prioridade && prioridade !== 'TODOS') filters.push(`prioridade.eq.${prioridade}`);

    let query = supabase
      .from('alertas')
      .select('*', { count: 'exact' });

    if (filters.length > 0) {
      query = query.and(filters.join(','));
    }

    if (search) {
      query = query.or(`mensagem.ilike.%${search}%`);
    }

    query = query.order('data_criacao', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: alertas, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count || 0;

    // Buscar contagens
    const [pendentesRes, lidasRes, resolvidasRes] = await Promise.all([
      supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('estado', 'PENDENTE'),
      supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('estado', 'LIDA'),
      supabase.from('alertas').select('*', { count: 'exact', head: true }).eq('estado', 'RESOLVIDA'),
    ]);

    const contagem = {
      total,
      PENDENTE: pendentesRes.count || 0,
      LIDA: lidasRes.count || 0,
      RESOLVIDA: resolvidasRes.count || 0,
    };

    // Buscar dados dos condutores referenciados
    const condutorIds = [...new Set((alertas || []).map((a: Record<string, unknown>) => a.condutor_id as string).filter(Boolean))];

    let condutoresMap: Record<string, Record<string, unknown>> = {};
    if (condutorIds.length > 0) {
      const { data: condutores } = await supabase
        .from('condutores')
        .select('id, numero_ordem, nome_completo, numero_bi, telefone1, tipo_veiculo, status, validade_licenca')
        .in('id', condutorIds);

      for (const c of condutores || []) {
        condutoresMap[c.id] = c;
      }
    }

    // Montar resultado com dados do condutor embutido
    const camelAlertas = (alertas || []).map((a: Record<string, unknown>) => {
      const converted = toCamelCase(a) as Record<string, unknown>;
      const condutorData = condutoresMap[a.condutor_id as string];
      converted.condutor = condutorData ? toCamelCase(condutorData) : null;
      return converted;
    });

    return NextResponse.json({
      data: camelAlertas,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      contagem,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar alertas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
