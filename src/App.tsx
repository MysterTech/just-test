import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  CrosshairMode
  // ChartOptions
} from "lightweight-charts";

const chartSettings = {
  width: 600,
  height: 300,
  layout: {
    backgroundColor: "#000000",
    textColor: "rgba(255, 255, 255, 0.9)"
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)"
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)"
    }
  },
  crosshair: {
    mode: CrosshairMode.Normal
  },
  priceScale: {
    borderColor: "rgba(197, 203, 206, 0.8)"
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
    barSpacing: 15
    // fixLeftEdge: true,
  }
};

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartContainer2Ref = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi>();
  const chart2 = useRef<IChartApi>();

  useEffect(() => {
    if (!chartContainerRef.current || !chartContainer2Ref.current) {
      return;
    }
    chart.current = createChart(chartContainerRef.current, chartSettings);
    chart2.current = createChart(chartContainer2Ref.current, chartSettings);

    const lineSeries = chart.current.addLineSeries();
    lineSeries.setData([
      { time: "2019-04-11", value: 80.01 },
      { time: "2019-04-12", value: 96.63 },
      { time: "2019-04-13", value: 76.64 },
      { time: "2019-04-14", value: 81.89 },
      { time: "2019-04-15", value: 74.43 },
      { time: "2019-04-16", value: 80.01 },
      { time: "2019-04-17", value: 96.63 },
      { time: "2019-04-18", value: 76.64 },
      { time: "2019-04-19", value: 81.89 },
      { time: "2019-04-20", value: 74.43 }
    ]);
    const lineSeries2 = chart2.current.addLineSeries();
    lineSeries2.setData([
      { time: "2019-04-11", value: 180.01 },
      { time: "2019-04-12", value: 196.63 },
      { time: "2019-04-13", value: 176.64 },
      { time: "2019-04-14", value: 181.89 },
      { time: "2019-04-15", value: 174.43 },
      { time: "2019-04-16", value: 180.01 },
      { time: "2019-04-17", value: 196.63 },
      { time: "2019-04-18", value: 176.64 },
      { time: "2019-04-19", value: 181.89 },
      { time: "2019-04-20", value: 174.43 }
    ]);
  }, []);

  const getSubsHandler = (c: "c1" | "c2") => () => {
    if (!chart.current || !chart2.current) {
      return;
    }

    // NOTE: the hacky part, not public chart api, but the bar
    // distances is available to get from here
    const barSpacingC1 =
      (chart.current as any)?.TM?.Da?.hl ||
      (chart.current as any)?.TM?.Da?.tl?.ws ||
      chartSettings.timeScale.barSpacing;
    const barSpacingC2 =
      (chart2.current as any)?.TM?.Da?.hl ||
      (chart2.current as any)?.TM?.Da?.tl?.ws ||
      chartSettings.timeScale.barSpacing;
    const rightOffsetC1 = (chart.current as any)?.TM?.Da?.sl;
    const rightOffsetC2 = (chart2.current as any)?.TM?.Da?.sl;
    if (barSpacingC1 !== barSpacingC2 || rightOffsetC1 !== rightOffsetC2) {
      if (c === "c1") {
        chart2.current.timeScale().applyOptions({
          rightOffset: rightOffsetC1,
          barSpacing: barSpacingC1
        });
      } else {
        chart.current.timeScale().applyOptions({
          rightOffset: rightOffsetC2,
          barSpacing: barSpacingC2
        });
      }
    }
  };
  const subsHandler = getSubsHandler("c1");
  const subsHandler2 = getSubsHandler("c2");
  const onMouseEnter = () => {
    chart.current?.timeScale().subscribeVisibleLogicalRangeChange(subsHandler);
  };
  const onMouseLeave = () => {
    chart.current
      ?.timeScale()
      .unsubscribeVisibleLogicalRangeChange(subsHandler);
  };

  const onMouseEnter2 = () => {
    chart2.current
      ?.timeScale()
      .subscribeVisibleLogicalRangeChange(subsHandler2);
  };
  const onMouseLeave2 = () => {
    chart2.current
      ?.timeScale()
      .unsubscribeVisibleLogicalRangeChange(subsHandler2);
  };

  return (
    <div className="App">
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={chartContainerRef}
        id="tt1"
        key="tt1"
        style={{ borderBottom: "1px solid transparent" }}
      />
      <div
        onMouseEnter={onMouseEnter2}
        onMouseLeave={onMouseLeave2}
        ref={chartContainer2Ref}
        id="tt2"
        key="tt2"
      />
    </div>
  );
}

export default App;
