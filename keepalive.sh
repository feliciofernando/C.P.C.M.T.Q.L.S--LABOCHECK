#!/bin/bash
cd /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK
while true; do
  echo "[$(date)] Iniciando servidor..." >> /tmp/keepalive.log
  npx next dev -p 3000 2>> /tmp/keepalive.log
  echo "[$(date)] Servidor caiu, reiniciando em 3s..." >> /tmp/keepalive.log
  sleep 3
done
