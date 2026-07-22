#!/usr/bin/env bash
# Servidor estático isolado para o companion de layouts da documentação.
# Não interfere no build da lib nem na docs atual — é só um protótipo visual.
set -e
PORT="${1:-4322}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "▶ Companion · Layouts da Documentação — Arcana DataTable"
echo "  http://localhost:${PORT}"
echo "  (Ctrl+C para parar)"
cd "$DIR"
python3 -m http.server "$PORT"
