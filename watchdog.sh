#!/bin/bash
cd /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK
while true; do
  if ! ss -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "$(date) - Porta 3000 livre, iniciando servidor..." >> /tmp/watchdog.log
    setsid bash /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK/start-server.sh > /tmp/nextjs.log 2>&1 &
    disown
    sleep 8
  else
    echo "$(date) - Servidor OK na porta 3000" >> /tmp/watchdog.log
  fi
  sleep 15
done
