import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function POST() {
  try {
    // Buscar todos os condutores activos com data de validade
    const { data: condutores, error } = await supabase
      .from('condutores')
      .select('id, numero_ordem, nome_completo, numero_bi, telefone1, validade_licenca')
      .eq('status', 'ATIVA')
      .neq('validade_licenca', '');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const alertasCriados: number[] = [];

    for (const condutor of condutores || []) {
      const partes = String(condutor.validade_licenca).split('-');
      if (partes.length !== 3) continue;

      const dia = parseInt(partes[0]);
      const mes = parseInt(partes[1]);
      const ano = parseInt(partes[2]);
      if (isNaN(dia) || isNaN(mes) || isNaN(ano)) continue;

      const dataValidade = new Date(ano, mes - 1, dia);
      dataValidade.setHours(0, 0, 0, 0);

      const diffDias = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

      let tipo = '';
      let prioridade = '';
      let mensagem = '';

      if (diffDias < 0) {
        const diasExpirada = Math.abs(diffDias);
        tipo = 'EXPIRADA';
        prioridade = diasExpirada > 90 ? 'ALTA' : 'MEDIA';
        mensagem = `A Licenca Profissional de Condutor de ${condutor.nome_completo} (Nº ${"00" + condutor.numero_ordem}) expirou ha ${diasExpirada} dia${diasExpirada !== 1 ? 's' : ''}. Data de validade: ${condutor.validade_licenca}. Contacto: ${condutor.telefone1}.`;
      } else if (diffDias <= 30) {
        tipo = 'EXPIRANDO_1MES';
        prioridade = diffDias <= 7 ? 'ALTA' : 'MEDIA';
        mensagem = `A Licenca Profissional de Condutor de ${condutor.nome_completo} (Nº ${"00" + condutor.numero_ordem}) expira em ${diffDias} dia${diffDias !== 1 ? 's' : ''}. Data de validade: ${condutor.validade_licenca}. Contacto: ${condutor.telefone1}.`;
      } else {
        continue;
      }

      // Verificar alerta existente PENDENTE ou LIDA
      const { data: existente } = await supabase
        .from('alertas')
        .select('id')
        .eq('condutor_id', condutor.id)
        .eq('tipo', tipo)
        .in('estado', ['PENDENTE', 'LIDA'])
        .limit(1);

      if (existente && existente.length > 0) {
        await supabase
          .from('alertas')
          .update({ mensagem, prioridade, data_validade: condutor.validade_licenca })
          .eq('id', existente[0].id);
      } else {
        await supabase.from('alertas').insert({
          condutor_id: condutor.id,
          tipo,
          data_validade: condutor.validade_licenca,
          mensagem,
          prioridade,
          estado: 'PENDENTE',
        });
      }

      alertasCriados.push(condutor.numero_ordem);
    }

    return NextResponse.json({
      message: `Verificacao concluida. ${alertasCriados.length} alerta(s) processado(s).`,
      alertasProcessados: alertasCriados.length,
      numerosOrdem: alertasCriados,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar alertas';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
