"use client";
import { useEffect, useRef, memo } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from "lightweight-charts";
// This is already correct if you use the formatChartData helper above
seriesRef.current?.setData(data);
import { Time, CandlestickData } from "lightweight-charts"; // ← Ensure Time is imported

interface ChartProps {
  data: CandlestickData[]; // ← Use library type directly
  currentPrice: number;
  signal: "BUY" | "SELL" | "HOLD";
  levels?: { entry: number; stop_loss: number; take_profit: number };
}

const TradingChart = memo(function TradingChart({ data, currentPrice, signal, levels }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      layout: {
        background: { type: "solid", color: "#0a0a0f" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update candle data
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data);
      // Fit content to view
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  // Update price line
  useEffect(() => {
    if (!seriesRef.current || !currentPrice) return;
    
    // Remove existing price lines
    seriesRef.current.priceLines().forEach(pl => seriesRef.current?.removePriceLine(pl));
    
    const color = signal === "BUY" ? "#22c55e" : signal === "SELL" ? "#ef4444" : "#fbbf24";
    seriesRef.current.createPriceLine({
      price: currentPrice,
      color,
      lineWidth: 2,
      lineStyle: 2, // dashed
      title: `${signal} ${currentPrice.toFixed(2)}`,
      axisLabelVisible: true,
    });

    // Add SL/TP lines if available
    if (levels) {
      if (levels.stop_loss) {
        seriesRef.current.createPriceLine({
          price: levels.stop_loss,
          color: "#ef4444",
          lineWidth: 1,
          title: `SL ${levels.stop_loss.toFixed(2)}`,
          axisLabelVisible: false,
        });
      }
      if (levels.take_profit) {
        seriesRef.current.createPriceLine({
          price: levels.take_profit,
          color: "#22c55e",
          lineWidth: 1,
          title: `TP ${levels.take_profit.toFixed(2)}`,
          axisLabelVisible: false,
        });
      }
    }
  }, [currentPrice, signal, levels]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-xl overflow-hidden border border-border neon-g"
    />
  );
});

export default TradingChart;
