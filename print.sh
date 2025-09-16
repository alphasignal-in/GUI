#!/bin/bash

# Start a WebSocket server on port 8080
# and send the current time every second
while true; do

ASSETS=("EURUSD" "GBPUSD" "AUDUSD" "USDJPY" "USDCHF" "XAUUSD" "BTCUSD" "ETHUSD" )
for ASSET in "${ASSETS[@]}"; do
echo " "
echo " "
echo "$(date)-------------$ASSET------------------"
docker logs $ASSET|tail -6
docker exec -it $ASSET cat LIVE.json |grep winrate
docker exec -it $ASSET cat LIVE.json |grep balance
echo "--------------------------------------------"
echo " "
echo " "
done
# say finished pushing images
  sleep 1
done | websocat -t  ws-l:0.0.0.0:8080 - --exit-on-eof