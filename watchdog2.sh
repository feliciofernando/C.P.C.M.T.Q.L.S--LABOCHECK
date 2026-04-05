#!/bin/bash
cd /home/z/cloned-project
while true; do
  # Check if port 3000 is listening
  if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
    sleep 5
    continue
  fi
  
  # Start server
  echo "[$(date)] Starting server..." >> /tmp/watchdog.log
  bun x next dev -p 3000 >> /tmp/labodev.log 2>&1 &
  SERVER_PID=$!
  
  # Wait for it to start or fail
  for i in $(seq 1 30); do
    if ! kill -0 $SERVER_PID 2>/dev/null; then
      echo "[$(date)] Server died after $i seconds" >> /tmp/watchdog.log
      break
    fi
    if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
      echo "[$(date)] Server ready on port 3000" >> /tmp/watchdog.log
      break
    fi
    sleep 1
  done
  
  # Wait for server to die
  wait $SERVER_PID 2>/dev/null
  echo "[$(date)] Server exited, restarting in 5s..." >> /tmp/watchdog.log
  sleep 5
done
