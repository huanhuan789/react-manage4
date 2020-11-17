import React, { useMemo } from "react";
// 引入ECharts主模块
import echarts from "echarts/lib/echarts";
//引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/tooltip";
//
const TedEncy = (props) => {
  const initData = () => {
    const myChart = echarts.init(document.getElementById("line1"));
    const colors = ["#5793f3", "#675bba", "#d14a61"];
    const option = {
      color: colors,
      title: {
        text: "走势图",
        subtext: "",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["新注册用户", "新增订单", "新增管理员"],
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          dataView: { readOnly: false },
          magicType: { type: ["bar", "line"] },
          restore: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: props.sevenDay,
      },
      yAxis: [
        {
          type: "value",
          name: "用户",
          min: 0,
          max: 200,
          position: "left",
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            formatter: "{value}",
          },
        },
        {
          type: "value",
          name: "订单",
          min: 0,
          max: 200,
          position: "right",
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],
      series: [
        {
          name: "新注册用户",
          type: "line",
          data: props.sevenDate[0],
          yAxisIndex: 1,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" },
            ],
          },
        },
        {
          name: "新增订单",
          type: "line",
          data: props.sevenDate[1],
          yAxisIndex: 1,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" },
            ],
          },
        },
        {
          name: "新增管理员",
          type: "line",
          data: props.sevenDate[2],
          yAxisIndex: 1,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" },
            ],
          },
        },
      ],
    };
    myChart.setOption(option);
  };
  // 数据变化 执行函数
  useMemo(() => {
    if (document.getElementById("line1")) {
      initData();
    }
  }, [props]);

  return (
    <div className="line1">
      <div id="line1" style={{ width: "90%", height: 450 }}>
        {/* <ReactEcharts option={getOption()} /> */}
      </div>
    </div>
  );
};

export default TedEncy;
