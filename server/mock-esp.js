const WebSocket = require('ws');

// Kết nối tới server local của bạn
const ws = new WebSocket('ws://localhost:3000');

let pumpStatus = false;
let autoMode = true;

ws.on('open', () => {
  console.log('🔌 Fake ESP đã kết nối với Server!');
  
  // Khởi tạo định danh là ESP
  ws.send(JSON.stringify({ type: 'init-esp' }));

  // Gửi dữ liệu giả lập mỗi 3 giây
  setInterval(() => {
    const mockData = {
      temperature: parseFloat((25 + Math.random() * 10).toFixed(1)), // 25°C - 35°C
      humidity: parseFloat((50 + Math.random() * 30).toFixed(1)),    // 50% - 80%
      soilMoisture: Math.floor(Math.random() * 100),
      soilMoistureRaw: Math.floor(Math.random() * 4095),
      lightLevel: Math.floor(Math.random() * 100),
      lightLevelRaw: Math.floor(Math.random() * 4095),
      rainDrop: Math.floor(Math.random() * 100),
      rainDropRaw: Math.floor(Math.random() * 4095),
      pumpStatus: pumpStatus,
      autoMode: autoMode,
      irrigationScore: Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
      espConnected: true
    };
    
    ws.send(JSON.stringify(mockData));
    console.log('📤 Đã gửi data giả lên server:', mockData.temperature + '°C');
  }, 3000);
});

// Lắng nghe lệnh từ Frontend (qua Server)
ws.on('message', (data) => {
  const parsedMessage = JSON.parse(data);
  console.log('📩 Nhận lệnh từ Frontend:', parsedMessage);
  
  if (parsedMessage.command === 'pump-on') pumpStatus = true;
  if (parsedMessage.command === 'pump-off') pumpStatus = false;
  if (parsedMessage.command === 'auto-on') autoMode = true;
  if (parsedMessage.command === 'auto-off') autoMode = false;
});

ws.on('close', () => console.log('❌ Fake ESP ngắt kết nối'));
ws.on('error', (err) => console.error('Lỗi:', err));