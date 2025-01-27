const mqtt = require('mqtt');
const WebSocket = require('ws');

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const wss = new WebSocket.Server({ port: 8080 });

mqttClient.on('connect', () => {
    console.log('Połączono z brokerem MQTT');
    mqttClient.subscribe('orders/status');
});

wss.on('connection', (ws) => {
    console.log('Nowe połączenie WebSocket');

    mqttClient.on('message', (topic, message) => {
        ws.send(`Nowa wiadomość MQTT: ${message.toString()}`);
    });
});
