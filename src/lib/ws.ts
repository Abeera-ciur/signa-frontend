export type SignalData = {
  type: string;
  price: number;
  chart: Array<{time: number; open: number; high: number; low: number; close: number; volume: number}>;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  entry: number;
  stop_loss: number;
  take_profit: number;
  reasoning: string[];
  disclaimer: string;
};

export type WsHandler = (data: SignalData) => void;

let socket: WebSocket | null = null;
const handlers: WsHandler[] = [];
let reconnectTimer: NodeJS.Timeout | null = null;

export function connectWS(url: string, onMessage: WsHandler): void {
  if (!handlers.includes(onMessage)) {
    handlers.push(onMessage);
  }
  
  if (socket?.readyState === WebSocket.OPEN) return;
  
  // Clear pending reconnect
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  
  console.log(`🔌 Connecting to ${url}`);
  socket = new WebSocket(url);
  
  socket.onopen = () => {
    console.log("✅ WebSocket connected");
    socket?.send(JSON.stringify({ type: "handshake", ts: Date.now() }));
  };
  
  socket.onmessage = (event) => {
    try {
      const data: SignalData = JSON.parse(event.data);
      handlers.forEach(h => h(data));
    } catch (e) {
      console.error("❌ WS parse error:", e);
    }
  };
  
  socket.onclose = () => {
    console.log("🔌 WebSocket closed, reconnecting in 2s...");
    socket = null;
    reconnectTimer = setTimeout(() => connectWS(url, onMessage), 2000);
  };
  
  socket.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
  };
}

export function sendConfig(symbol: string, interval: string): void {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: "config_update",
      config: { symbol, interval }
    }));
  }
}

export function disconnectWS(): void {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (socket) {
    socket.close();
    socket = null;
  }
  handlers.length = 0;
}