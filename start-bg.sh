#!/bin/bash
cd /home/z/cloned-project
export NODE_OPTIONS="--max-old-space-size=4096"
exec bun x next dev -p 3000
