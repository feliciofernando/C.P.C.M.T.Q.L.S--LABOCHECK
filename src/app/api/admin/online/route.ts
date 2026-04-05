import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/admin/online - Listar admins online
export async function GET() {
  try {
    // Limpar sessoes expiradas (mais de 45 seg sem heartbeat)
    await supabase
      .from('admin_online_status')
      .delete()
      .lt('last_heartbeat', new Date(Date.now() - 45 * 1000).toISOString());

    const { data, error } = await supabase
      .from('admin_online_status')
      .select('admin_id, admin_username, admin_nome, login_at, last_heartbeat');

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return NextResponse.json({ online: [], setup: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dedup by admin_username - keep most recent heartbeat
    const seen = new Map<string, (typeof data)[0]>();
    for (const row of (data || [])) {
      const key = row.admin_username?.toLowerCase().trim();
      if (!key) continue;
      const existing = seen.get(key);
      if (!existing || new Date(row.last_heartbeat) > new Date(existing.last_heartbeat)) {
        seen.set(key, row);
      }
    }

    // Clean duplicates in DB
    const uniqueUsernames = [...seen.values()].map(r => r.admin_username?.toLowerCase().trim());
    const allUsernames = (data || []).map(r => r.admin_username?.toLowerCase().trim());
    const duplicates = allUsernames.filter((u, i) => allUsernames.indexOf(u) !== i && u);
    if (duplicates.length > 0) {
      for (const dup of [...new Set(duplicates)]) {
        // Get all records with this username, keep only the newest
        const { data: dupRows } = await supabase
          .from('admin_online_status')
          .select('id, last_heartbeat')
          .ilike('admin_username', dup);

        if (dupRows && dupRows.length > 1) {
          const sorted = dupRows.sort((a, b) =>
            new Date(b.last_heartbeat).getTime() - new Date(a.last_heartbeat).getTime()
          );
          const toDelete = sorted.slice(1).map(r => r.id);
          if (toDelete.length > 0) {
            await supabase
              .from('admin_online_status')
              .delete()
              .in('id', toDelete);
          }
        }
      }
    }

    const deduped = [...seen.values()].sort((a, b) =>
      new Date(a.login_at).getTime() - new Date(b.login_at).getTime()
    );

    return NextResponse.json({ online: deduped, setup: true });
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
      return NextResponse.json({ error: 'adminUsername é obrigatório' }, { status: 400 });
    }

    // First: clean any duplicates for this username
    const { data: allExisting } = await supabase
      .from('admin_online_status')
      .select('id, last_heartbeat')
      .ilike('admin_username', adminUsername);

    if (allExisting && allExisting.length > 1) {
      const sorted = allExisting.sort((a, b) =>
        new Date(b.last_heartbeat).getTime() - new Date(a.last_heartbeat).getTime()
      );
      const toDelete = sorted.slice(1).map(r => r.id);
      if (toDelete.length > 0) {
        await supabase
          .from('admin_online_status')
          .delete()
          .in('id', toDelete);
      }
    }

    // Check if exists
    const { data: existing } = await supabase
      .from('admin_online_status')
      .select('id')
      .ilike('admin_username', adminUsername)
      .maybeSingle();

    if (existing) {
      // Update heartbeat
      await supabase
        .from('admin_online_status')
        .update({
          last_heartbeat: new Date().toISOString(),
          admin_nome: adminNome || adminUsername,
          sessao_id: sessaoId || '',
        })
        .eq('id', existing.id);
    } else {
      // Insert new record
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
      return NextResponse.json({ error: 'username é obrigatório' }, { status: 400 });
    }

    await supabase
      .from('admin_online_status')
      .delete()
      .ilike('admin_username', adminUsername);

    return NextResponse.json({ removed: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao remover presenca' }, { status: 500 });
  }
}
