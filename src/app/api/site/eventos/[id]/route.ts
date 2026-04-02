import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { toCamelCase, toSnakeCase } from '@/lib/utils-supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const snake = toSnakeCase(body)

    const { data, error } = await supabase
      .from('eventos')
      .update(snake)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamelCase(data))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao actualizar evento'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase.from('eventos').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao eliminar evento'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
