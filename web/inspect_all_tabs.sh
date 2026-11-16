#!/bin/bash
TABS=("dashboard" "prestamos" "transacciones" "analitica" "mensajes" "rendimiento" "campanas" "clientes" "rutas" "planillas" "roles" "cierre" "integraciones" "configuracion")

for tab in "${TABS[@]}"; do
    echo "Capturing tab: $tab"
    google-chrome --headless --no-sandbox --window-size=1440,900 --virtual-time-budget=1500 \
        "http://localhost:3000/#$tab" --screenshot="docs/screenshots/tab_${tab}.png" >/dev/null 2>&1
done

# Modals
google-chrome --headless --no-sandbox --window-size=1440,900 --virtual-time-budget=1500 \
    "http://localhost:3000/?cobro=1#planillas" --screenshot="docs/screenshots/modal_cobro.png" >/dev/null 2>&1

google-chrome --headless --no-sandbox --window-size=1440,900 --virtual-time-budget=1500 \
    "http://localhost:3000/?tarjeton=1#planillas" --screenshot="docs/screenshots/modal_tarjeton.png" >/dev/null 2>&1

google-chrome --headless --no-sandbox --window-size=1440,900 --virtual-time-budget=1500 \
    "http://localhost:3000/?auth=1#dashboard" --screenshot="docs/screenshots/modal_auth.png" >/dev/null 2>&1

echo "Done capturing all tabs and modals."
