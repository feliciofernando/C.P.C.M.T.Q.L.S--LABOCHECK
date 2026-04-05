#!/bin/bash
# Keepalive script - reinicia o servidor automaticamente se cair
while true; do
  cd /home/z/cloned-project
  echo "[$(date)] Iniciando servidor..." >> /tmp/keepalive.log
  bun x next dev -p 3000 >> /tmp/labodev.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Servidor caiu (exit code: $EXIT_CODE), reiniciando em 3s..." >> /tmp/keepalive.log
  sleep 3
done
