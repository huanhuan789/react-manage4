import React, { useMemo } from 'react';
import echarts from "echarts/lib/echarts";
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
function VisitorPie(props) {
    const initDate = () => {
        const myChart = echarts.init(document.getElementById('visitorpie'));
        const option = {
            title: {
                text: '用户分布',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['北京', '上海', '深圳', '杭州', '其他']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        { value: props.pieData.beijing, name: '北京' },
                        { value: props.pieData.shanghai, name: '上海' },
                        { value: props.pieData.shenzhen, name: '深圳' },
                        { value: props.pieData.hangzhou, name: '杭州' },
                        { value: props.pieData.qita, name: '其他' }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    };
    // 数据变化执行函数
    useMemo(() => {
        if (document.getElementById("visitorpie")) {
            initDate();
            console.log(props)
        }
    },[props]);
    return (
        <div className="visitorpie" >
            <div id="visitorpie" className="" style={{ width: '90%', height: 450 }}></div>

        </div>
    )
}
export default VisitorPie