import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { toCamelCase, toSnakeCase, arrayToCamelCase } from '@/lib/utils-supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    let query = supabase.from('eventos').select('*')

    if (!showAll) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query.order('event_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(arrayToCamelCase(data || []))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar eventos'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const snake = toSnakeCase(body)

    const { data, error } = await supabase
      .from('eventos')
      .insert(snake)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamelCase(data))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar evento'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
