<template>
  <div class="home">
    <div class="container top-module">
      <div class="row">
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left blue">
              <i class="iconfont iconfont icon-tianjia"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.newToday }}</h3>
              <span>今日新增</span>
            </div>
          </div>
        </Card>
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left green">
              <i class="iconfont iconfont icon-leijichakan"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.totalCount }}</h3>
              <span>累计agentId</span>
            </div>
          </div>
        </Card>
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left orange">
              <i class="iconfont iconfont icon-pingjun"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.domReadyTime | mathRound }}</h3>
              <span>平均domReady </span>
            </div>
          </div>
        </Card>
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left red">
              <i class="iconfont iconfont icon-pingjun"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.loadedTime | mathRound }}</h3>
              <span>平均loaded</span>
            </div>
          </div>
        </Card>
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left pink">
              <i class="iconfont iconfont icon-xiaolian"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.minLoadedTime }}</h3>
              <span>最快加载</span>
            </div>
          </div>
        </Card>
        <Card class="col-xs-6 card-item col-sm-4 col-md-2">
          <div slot="card-content">
            <div class="card-item-left purple">
              <i class="iconfont iconfont icon-kulian"></i>
            </div>
            <div class="card-item-right">
              <h3>{{ homeData.maxLoadedTime }}</h3>
              <span>最慢加载</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div class="container center-module">
      <div class="row">
        <Card class="card-center-item col-xs-12 col-sm-12 col-md-4">
          <div slot="card-content" ref="device" style="height:410px;"></div>
        </Card>
        <Card class="card-center-item col-xs-12 col-sm-12 col-md-4">
          <div slot="card-content">
            <Tabs :tabKey="['加载速度最快', '加载速度最慢']" :tabValue="['value1', 'value2']">
              <div slot="value1">
                <v-table :tableOptions="fastTableData"></v-table>
              </div>
              <div slot="value2">
                <v-table :tableOptions="slowTableData"></v-table>
              </div>
            </Tabs>
          </div>
        </Card>
        <Card class="card-center-item col-xs-12 col-sm-12 col-md-4">
          <div slot="card-content">
            <Tabs :tabKey="['请求数最少', '请求数最多']" :tabValue="['value1', 'value2']">
              <div slot="value1">
                <v-table :tableOptions="requestLessData"></v-table>
              </div>
              <div slot="value2">
                <v-table :tableOptions="requestMoreData"></v-table>
              </div>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
    <div class="container bottom-module">
      <div class="row">
        <Card class="card-bottom col-xs-12 col-sm-12 col-md-12">
          <div slot="card-content" ref="column" style="height:350px;"></div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../../components/card";
import Tabs from "../../components/tabs";
import { createOptions } from "../../common/js/common";

let echarts = require("echarts");
export default {
  name: "home",
  components: {
    Card,
    Tabs
  },
  data() {
    return {
      homeData: {},
      pieName: [],
      fastTableData: {
        key: "fastestLoading",
        css: "home-table",
        // pagePer:5,
        maxTableRow: 10,
        columns: [
          {
            title: "Top10",
            field: "url",
            width: "80%",
            parseHtml: true,
            format(data) {
              return `<a href='${data}' target="_blank">${data}</a>`;
            }
          },
          {
            title: "时间",
            field: "loaded",
            width: "20%"
          }
        ],
        originData: []
      },
      slowTableData: {
        key: "lastestLoading",
        css: "home-table",
        // pagePer:5,
        maxTableRow: 10,
        columns: [
          {
            title: "Top10",
            field: "url",
            width: "80%",
            parseHtml: true,
            format(data) {
              return `<a href='${data}' target="_blank">${data}</a>`;
            }
          },
          {
            title: "时间",
            field: "loaded",
            width: "20%"
          }
        ],
        originData: []
      },
      requestMoreData: {
        key: "requestMore",
        css: "home-table",
        // pagePer:5,
        maxTableRow: 10,
        columns: [
          {
            title: "Top10",
            field: "url",
            width: "80%",
            parseHtml: true,
            format(data) {
              return `<a href='${data}' target="_blank">${data}</a>`;
            }
          },
          {
            title: "时间",
            field: "total",
            width: "20%"
          }
        ],
        originData: []
      },
      requestLessData: {
        key: "requestLess",
        css: "home-table",
        // pagePer:5,
        maxTableRow: 10,
        columns: [
          {
            title: "Top10",
            field: "url",
            width: "80%",
            parseHtml: true,
            format(data) {
              return `<a href='${data}' target="_blank">${data}</a>`;
            }
          },
          {
            title: "时间",
            field: "total",
            width: "20%"
          }
        ],
        originData: []
      }
    };
  },
  filters: {
    mathRound(value) {
      return Math.round(value);
    }
  },
  mounted() {
    this.$api.getHomeData().then((res) => {
      this.homeData = res.data;
      this.initPage();
    });
  },
  methods: {
    initPage() {
      this.fastTableData.originData = this.homeData.quickTop10;
      this.slowTableData.originData = this.homeData.slowTop10;
      this.requestLessData.originData = this.homeData.requestTop10;
      this.requestMoreData.originData = this.homeData.request2Top10;

      this.homeData.deviceData.forEach((item) => {
        this.pieName.push(item.name);
      });
      let myPieChart = echarts.init(this.$refs.device);
      let pieOption = {
        title: {
          text: "用户设备占比",
          textStyle: {
            fontSize: 16,
            lineHeight: 28
          },
          left: 0
        },
        tooltip: {
          //鼠标移入提示信息
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          left: "center",
          bottom: "3%",
          data: this.pieName
        },
        series: [
          {
            name: "设备占比",
            type: "pie",
            radius: "55%",
            center: ["50%", "45%"],
            data: this.homeData.deviceData,
            color: [
              "rgb(254, 67, 101)",
              "rgb(252, 157, 154)",
              "rgb(249, 205, 173)",
              "rgb(200, 200, 169)",
              "rgb(131, 175, 155)",
              "rgb(69, 39, 39)",
              "rgb(110, 112, 73)",
              "rgb(117, 27, 19)",
              "rgb(222, 211, 140)"
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myPieChart.setOption(pieOption);

      let myColumnChart = echarts.init(this.$refs.column),
        columnOption = createOptions(this.homeData.group);
      myColumnChart.setOption(columnOption);
      window.addEventListener("resize", function() {
        myPieChart.resize();
        myColumnChart.resize();
      });
    }
  }
};
</script>

<style lang="scss">
.blue {
  background: #6ebbff;
}
.green {
  background: #ace06f;
}
.orange {
  background: #ffa557;
}
.red {
  background: #ff7348;
}
.pink {
  background: #7ee6f2;
}
.purple {
  background: #b792f7;
}
.home {
  padding: 12px;
  .card-item {
    .form-card-content {
      padding: 0;
      height: 110px;
    }
    .card-item-left {
      float: left;
      width: 30%;
      height: 110px;
      line-height: 110px;
      text-align: center;
      i {
        font-size: 40px;
      }
    }
    .card-item-right {
      float: left;
      width: 70%;
      text-align: center;
      h3 {
        padding-top: 20px;
        font-size: 25px;
        line-height: 50px;
      }
    }
  }
  .card-center-item {
    .form-card-content {
      height: 442px;
    }
  }
  .tab .home-table {
    margin: 0;
    a {
      color: $main-active-color;
      font-weight: bold;
      font-size: 12px;
    }
    tr {
      height: 30px;
      line-height: 30px;
    }
    .table-body tr:hover {
      background: #fdf5e6 !important;
    }
    .table-body tr:nth-of-type(2n) {
      background-color: #fafafa;
    }
    th,
    td {
      text-align: left;
      text-indent: 3%;
      padding-right: 5%;
    }
    .simple-table-footer {
      display: none;
    }
  }
  .card-bottom {
    .form-card-content {
      height: 382px;
    }
  }
}
</style>
