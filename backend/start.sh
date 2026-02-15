#!/usr/bin/env sh
set -e
npm run build
exec node dist/index.js
