"use client";
import { useState, useEffect } from "react";
import { connectWS, SignalData } from "@/lib/ws";
import Sidebar from "@/components/Sidebar";
import TradingChart from "@/components/Chart";
import SignalPanel from "@/components/SignalPanel";
import { Time } from "lightweight-charts"; // ← ADD THIS IMPORT

export default function Home() {
  const [wsData, setWsData] = useState<SignalData | null>(null);
  const [symbol, setSymbol] = useState("btcusdt");
  const [interval, setInterval] = useState("15m");

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:7860/ws";
    connectWS(wsUrl, (data: SignalData) => {
      setWsData(data);
    });
    return () => {};
  }, []);

  // Helper: Convert backend candle format to lightweight-charts format
  const formatChartData = (chart: any[]) => {
    return chart.map(c => ({
      time: c.time as Time, // ← CAST TO Time TYPE
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close
    }));
  };

  return (
    <main className="h-screen flex bg-bg overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        currentSymbol={symbol} 
        currentInterval={interval}
        onConfig={(s: string, i: string) => {
          setSymbol(s);
          setInterval(i);
        }}
      />

      {/* Center: Chart Area */}
      <section className="flex-1 flex flex-col p-3 gap-3">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-2 py-1">
          <div className="text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neonG animate-pulse" />
            <span>Live: Binance • {symbol.toUpperCase()} • {interval}</span>
          </div>
          <div className="text-xs text-muted">
            🤖 NVIDIA NIM • Tavily Sentiment
          </div>
        </header>

        {/* Main Chart */}
        <div className="flex-1 bg-panel/30 rounded-xl p-1 border border-border neon-g">
          {wsData?.chart && wsData.chart.length > 0 ? (
            <TradingChart 
              data={formatChartData(wsData.chart)} // ← USE FORMATTED DATA
              currentPrice={wsData.price}
              signal={wsData.signal}
              levels={{
                entry: wsData.entry,
                stop_loss: wsData.stop_loss,
                take_profit: wsData.take_profit
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              Connecting to market data...
            </div>
          )}
        </div>
      </section>

      {/* Right: Signal Panel */}
      {wsData ? (
        <SignalPanel 
          signal={wsData.signal}
          confidence={wsData.confidence}
          entry={wsData.entry}
          stop_loss={wsData.stop_loss}
          take_profit={wsData.take_profit}
          reasoning={wsData.reasoning}
          disclaimer={wsData.disclaimer}
        />
      ) : (
        <aside className="w-80 glass flex items-center justify-center border-l border-border">
          <div className="text-center text-muted text-sm">
            <div className="animate-pulse mb-2">🔄</div>
            Waiting for AI analysis...
          </div>
        </aside>
      )}
    </main>
  );
}
