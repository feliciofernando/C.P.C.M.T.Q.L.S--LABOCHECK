import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { toCamelCase, toSnakeCase } from '@/lib/utils-supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('director_messages')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json(toCamelCase(data[0]))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar mensagem do director'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const snake = toSnakeCase(body)

    const { data, error } = await supabase
      .from('director_messages')
      .insert(snake)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamelCase(data))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar mensagem do director'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...rest } = body

    if (!id) {
      return NextResponse.json({ error: 'ID e obrigatorio' }, { status: 400 })
    }

    const snake = toSnakeCase(rest)

    const { data, error } = await supabase
      .from('director_messages')
      .update(snake)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamelCase(data))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar mensagem do director'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
