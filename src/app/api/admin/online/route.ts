import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/admin/online - Listar admins online
export async function GET() {
  try {
    // Limpar sessoes expiradas (mais de 2 min sem heartbeat)
    await supabase
      .from('admin_online_status')
      .delete()
      .lt('last_heartbeat', new Date(Date.now() - 2 * 60 * 1000).toISOString());

    const { data, error } = await supabase
      .from('admin_online_status')
      .select('admin_id, admin_username, admin_nome, login_at, last_heartbeat')
      .order('login_at', { ascending: true });

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ online: [], setup: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ online: data || [], setup: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao verificar status online' }, { status: 500 });
  }
}

// POST /api/admin/online - Heartbeat (registar/atualizar presenca)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, adminUsername, adminNome, sessaoId, ipAddress } = body;

    if (!adminUsername) {
      return NextResponse.json({ error: 'adminUsername obrigatorio' }, { status: 400 });
    }

    // Verificar se ja existe um registo para este admin
    const { data: existing } = await supabase
      .from('admin_online_status')
      .select('id')
      .eq('admin_username', adminUsername)
      .maybeSingle();

    if (existing) {
      // Actualizar heartbeat
      await supabase
        .from('admin_online_status')
        .update({
          last_heartbeat: new Date().toISOString(),
          admin_nome: adminNome || adminUsername,
          sessao_id: sessaoId || '',
        })
        .eq('id', existing.id);
    } else {
      // Inserir novo registo
      await supabase
        .from('admin_online_status')
        .insert({
          admin_id: adminId || null,
          admin_username: adminUsername,
          admin_nome: adminNome || adminUsername,
          sessao_id: sessaoId || '',
          ip_address: ipAddress || '',
          last_heartbeat: new Date().toISOString(),
          login_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ updated: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar presenca' }, { status: 500 });
  }
}

// DELETE /api/admin/online - Remover presenca (logout)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUsername = searchParams.get('username') || '';

    if (!adminUsername) {
      return NextResponse.json({ error: 'username obrigatorio' }, { status: 400 });
    }

    await supabase
      .from('admin_online_status')
      .delete()
      .eq('admin_username', adminUsername);

    return NextResponse.json({ removed: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover presenca' }, { status: 500 });
  }
}
