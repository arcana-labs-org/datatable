#!/usr/bin/env bash
# Servidor estático isolado para o companion do sidebar do Playground.
# Não interfere no build da lib nem na docs atual — é só um protótipo visual.
set -e
PORT="${1:-4324}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "▶ Companion · Sidebar do Playground — Arcana DataTable"
echo "  http://localhost:${PORT}"
echo "  (Ctrl+C para parar)"
cd "$DIR"
python3 -m http.server "$PORT"
