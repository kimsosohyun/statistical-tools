<template>
    <div>
        <div ref="test" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>
    let echarts = require('echarts');
    export default {
        name: "testEcharts",
        mounted() {
         
            let myChart = echarts.init(this.$refs.test);
           
            myChart.setOption({
                // title: {
                //     text: '某站点用户访问来源',
                //     subtext: '纯属虚构',
                //     left: 'center'
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['股东姓名一', '股东姓名二', '股东姓名三', '股东姓名四', '股东姓名五']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 0.4, name: '股东姓名一'},
                            {value: 0.21, name: '股东姓名二'},
                            {value: 0.17, name: '股东姓名三'},
                            {value: 0.11, name: '股东姓名四'},
                            {value: 0.09,name: '股东姓名五'}
                        ],
                        color: ['blue','green','pink','orange','red'],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });

        }
    }
</script>

<style scoped>

</style>