#!/bin/bash
set -e

DIR="/home/omicron/Documentos/finalsena/docs/screenshots"
BRAIN="/home/omicron/.gemini/antigravity/brain/e5285e73-ccd1-42d8-b39e-431564c3a69e"
mkdir -p "$DIR" "$BRAIN"

take_shot() {
    NAME=$1
    URL=$2
    echo "Capturing $NAME from $URL..."
    google-chrome --headless --no-sandbox --window-size=1440,900 --virtual-time-budget=2000 --screenshot="$DIR/$NAME" "$URL"
    cp "$DIR/$NAME" "$BRAIN/$NAME"
}

take_shot "01_dashboard.png" "http://localhost:3000/#dashboard"
take_shot "02_products.png" "http://localhost:3000/#prestamos"
take_shot "03_transactions.png" "http://localhost:3000/#transacciones"
take_shot "04_reports.png" "http://localhost:3000/#analitica"
take_shot "05_messages.png" "http://localhost:3000/#mensajes"
take_shot "06_team_performance.png" "http://localhost:3000/#rendimiento"
take_shot "07_campaigns.png" "http://localhost:3000/#campanas"
take_shot "08_customer_list.png" "http://localhost:3000/#clientes"
take_shot "09_channels.png" "http://localhost:3000/#rutas"
take_shot "10_order_management.png" "http://localhost:3000/#planillas"
take_shot "11_roles_permissions.png" "http://localhost:3000/#roles"
take_shot "12_billing_subscription.png" "http://localhost:3000/#cierre"
take_shot "13_integrations.png" "http://localhost:3000/#integraciones"
take_shot "14_settings.png" "http://localhost:3000/#configuracion"
take_shot "15_tarjeton_modal.png" "http://localhost:3000/?tarjeton=1#dashboard"

echo "All module screenshots captured successfully!"
