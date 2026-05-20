"use client";
import { RefreshCw, Settings } from "lucide-react";
import { sendConfig } from "@/lib/ws";

interface SidebarProps {
  currentSymbol: string;
  currentInterval: string;
}

export default function Sidebar({ currentSymbol, currentInterval }: SidebarProps) {
  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const symbol = (form.elements.namedItem("symbol") as HTMLSelectElement).value;
    const interval = (form.elements.namedItem("interval") as HTMLSelectElement).value;
    sendConfig(symbol.toLowerCase(), interval);
  };

  return (
    <aside className="w-64 glass flex flex-col p-4 border-r border-border">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
        <div className="w-8 h-8 rounded bg-neonG/20 flex items-center justify-center neon-g">
          <span className="text-neonG font-bold text-sm">S</span>
        </div>
        <h1 className="font-bold tracking-wide">SIGNA<span className="text-neonG">.AI</span></h1>
      </div>

      <form onSubmit={handleApply} className="space-y-4 flex-1">
        <div>
          <label className="block text-xs text-muted mb-1">Trading Pair</label>
          <select 
            name="symbol" 
            defaultValue={currentSymbol.toUpperCase()}
            className="w-full bg-panel border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-neonG"
          >
            <option value="btcusdt">BTC/USDT</option>
            <option value="ethusdt">ETH/USDT</option>
            <option value="solusdt">SOL/USDT</option>
            <option value="bnbusdt">BNB/USDT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Timeframe</label>
          <select 
            name="interval"
            defaultValue={currentInterval}
            className="w-full bg-panel border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-neonG"
          >
            <option value="5m">5 minutes</option>
            <option value="15m">15 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
          </select>
        </div>

        <button 
          type="submit"
          className="w-full mt-2 bg-neonG/10 hover:bg-neonG/20 text-neonG border border-neonG/30 rounded py-2 px-3 text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <RefreshCw size={14} /> Apply & Refresh
        </button>
      </form>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-[10px] text-muted leading-relaxed">
          <p className="font-semibold text-neonG mb-1">⚠️ DISCLAIMER</p>
          Educational & research purposes only. Not financial advice. AI predictions may be inaccurate. Trade at your own risk.
        </div>
      </div>
    </aside>
  );
}