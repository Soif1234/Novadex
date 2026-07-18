const WebSocket = require('ws');
const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@trade');
ws.on('open', () => {
    console.log('opened');
});
ws.on('message', (data) => {
  console.log(JSON.parse(data));
  process.exit(0);
});
ws.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
