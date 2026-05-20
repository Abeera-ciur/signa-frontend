"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface SignalPanelProps {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  entry: number;
  stop_loss: number;
  take_profit: number;
  reasoning: string[];
  disclaimer: string;
}

export default function SignalPanel({ 
  signal, confidence, entry, stop_loss, take_profit, reasoning, disclaimer 
}: SignalPanelProps) {
  const isBuy = signal === "BUY";
  const isSell = signal === "SELL";
  
  const signalColor = isBuy ? "text-neonG border-neonG/40 bg-neonG/10 neon-g" 
    : isSell ? "text-neonR border-neonR/40 bg-neonR/10 neon-r" 
    : "text-neonY border-neonY/40 bg-neonY/10";
  
  const SignalIcon = isBuy ? CheckCircle : isSell ? XCircle : AlertTriangle;

  return (
    <aside className="w-80 glass flex flex-col p-5 border-l border-border">
      {/* Main Signal Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-4 rounded-xl border-2 ${signalColor} mb-4`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <SignalIcon size={20} />
          <span className="text-2xl font-bold tracking-wide">{signal} SIGNAL</span>
        </div>
        <div className="text-sm text-muted">Confidence: <span className="text-white font-semibold">{confidence}%</span></div>
      </motion.div>

      {/* Price Levels */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="bg-panel rounded p-2 text-center border border-border">
          <div className="text-muted">Entry</div>
          <div className="font-mono font-semibold">${entry?.toFixed(2)}</div>
        </div>
        <div className="bg-panel rounded p-2 text-center border border-border">
          <div className="text-muted text-neonR">Stop Loss</div>
          <div className="font-mono font-semibold text-neonR">${stop_loss?.toFixed(2)}</div>
        </div>
        <div className="bg-panel rounded p-2 text-center border border-border">
          <div className="text-muted text-neonG">Take Profit</div>
          <div className="font-mono font-semibold text-neonG">${take_profit?.toFixed(2)}</div>
        </div>
      </div>

      {/* Risk/Reward */}
      {entry && stop_loss && take_profit && (
        <div className="bg-panel rounded p-3 mb-4 border border-border">
          <div className="text-xs text-muted mb-1">Risk/Reward Ratio</div>
          <div className="text-lg font-bold">
            1:{((take_profit - entry) / (entry - stop_loss)).toFixed(1)}
          </div>
        </div>
      )}

      {/* AI Reasoning */}
      <div className="flex-1 bg-panel/50 rounded-lg p-4 border border-border overflow-hidden">
        <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
          🤖 AI Reasoning
        </div>
        <AnimatePresence mode="wait">
          <motion.ul 
            key={reasoning.join("|")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-400 space-y-1.5"
          >
            {reasoning.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-neonG">•</span>
                <span>{point}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      {/* Disclaimer Footer */}
      <div className="mt-4 pt-3 border-t border-border text-[10px] text-center text-gray-600">
        {disclaimer}
      </div>
    </aside>
  );
}