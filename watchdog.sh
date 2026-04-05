#!/bin/bash
cd /home/z/cloned-project
> /tmp/watchdog.log

while true; do
  # Check if port 3000 is already listening
  if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
    sleep 10
    continue
  fi
  
  echo "[$(date)] Server not running, starting..." >> /tmp/watchdog.log
  
  # Kill any leftover processes
  pkill -f "next dev" 2>/dev/null
  sleep 2
  
  # Start server
  bun x next dev -p 3000 >> /home/z/cloned-project/dev.log 2>&1 &
  SRV_PID=$!
  echo "[$(date)] Started PID $SRV_PID" >> /tmp/watchdog.log
  
  # Wait for it to start (up to 30s)
  for i in $(seq 1 30); do
    if ! kill -0 $SRV_PID 2>/dev/null; then
      echo "[$(date)] Process $SRV_PID died immediately" >> /tmp/watchdog.log
      break
    fi
    if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
      echo "[$(date)] Server ready on port 3000" >> /tmp/watchdog.log
      break
    fi
    sleep 1
  done
  
  # Monitor while running
  while kill -0 $SRV_PID 2>/dev/null; do
    sleep 10
  done
  
  echo "[$(date)] Server process died, restarting in 5s..." >> /tmp/watchdog.log
  sleep 5
done
