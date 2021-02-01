<template>
  <div class="model">
    <Card class="model-card">
      <div slot="card-content">
        <div class="first-row">
          <div class="first-row-input">
            <v-group title="地址:">
              <v-select :data-key="formData.url"></v-select>
            </v-group>
            <v-group title="屏幕宽度：">
              <v-select :data-key="formData.width"></v-select>
            </v-group>
            <v-group title="屏幕高度：">
              <v-select :data-key="formData.height"></v-select>
            </v-group>
            <v-group title="密度比：">
              <v-select :data-key="formData.devicePixelRatio"></v-select>
            </v-group>
            <v-group title="fontSize：">
              <v-select :data-key="formData.fontSize"></v-select>
            </v-group>
            <v-group title="平台：">
              <v-select :data-key="formData.platform"></v-select>
            </v-group>
            <v-group title="浏览器厂商：">
              <v-select :data-key="formData.vendor"></v-select>
            </v-group>
            <v-group title="agentId：">
              <v-select :data-key="formData.agentId"></v-select>
            </v-group>
            <v-group title="用户IP：">
              <v-select :data-key="formData.ip"></v-select>
            </v-group>
          </div>
          <div class="first-row-btn">
            <v-button title="重置" css="btn-normal" :callback="resetForm"></v-button>
            <button class="logo-btn" @click="search">
              <i class="iconfont icon-sousuo"></i>
              <span>搜索</span>
            </button>
          </div>
        </div>
        <div class="second-row">
          <v-group title="DOMContentLoaded小于：">
            <v-input :data-key="formData.DOMContentLoaded"></v-input>
          </v-group>
          <v-group title="readyState=complete小于：">
            <v-input :data-key="formData.domReady"></v-input>
          </v-group>
          <v-group title="load时间小于：">
            <v-input :data-key="formData.loaded"></v-input>
          </v-group>
          <v-group title="css文件数小于：">
            <v-input :data-key="formData.link"></v-input>
          </v-group>
          <v-group title="js文件数小于：">
            <v-input :data-key="formData.script"></v-input>
          </v-group>
          <v-group title="图片文件数小于：">
            <v-input :data-key="formData.img"></v-input>
          </v-group>
          <v-group title="总请求数小于：">
            <v-input :data-key="formData.total"></v-input>
          </v-group>
          <v-group title="收集时间:" css="time-group">
            <DateTimePicker :name="formData.timeSeg.name" v-model="formData.timeSeg.val"></DateTimePicker>
          </v-group>
        </div>
        <div class="model-graphic">
          <button class="logo-btn" @click="showGraphicalDialog">
            <i class="iconfont icon-tuxing"></i>
            <span>图形化</span>
          </button>
        </div>

        <div class="platform-table">
          <Table width="100%" :columns="columns1" :data="data1" :loading="tableLoading" border :row-class-name="rowClassName">
            <template slot-scope="{ index, row }" slot="action">
              <Poptip
                confirm
                placement="right"
                title="Are you sure to delete?"
                @on-ok="deleteItem(row.Id)"
                ok-text="yes"
                cancel-text="no"
              >
                <button class="logo-btn delete" style="margin-right: 5px">
                  删除
                </button>
              </Poptip>
              <v-button
                css="btn-normal"
                title="详细"
                :callback="
                  () => {
                    showDetailDialog(index);
                  }
                "
              ></v-button>
            </template>
          </Table>
          <div class="table-page">
            <div>
              <Page
                :page-size="formObj.pageSize"
                :total="tableObj.totalCount"
                :current="tableObj.pageNo"
                @on-change="changePage"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <v-dialog :dialog="graphicalDialog">
      <div ref="graphical" style="height: 350px"></div>
    </v-dialog>
    <v-dialog :dialog="detailDialog">
      <ul class="detailList">
        <li class="detailList-item" v-for="(item, index) in detailDialog.data" :key="index">
          <span class="detailList-item-title">
            {{ index + ":" }}
          </span>
          <p class="detailList-item-content" :class="{markByred: index === 'errorContent' && item != '[]'}">
            {{ item }}
          </p>
        </li>
      </ul>
    </v-dialog>
  </div>
</template>

<script>
import Card from "../../components/card.vue";
import DateTimePicker from "../../components/datetimepicker.vue";
import { createOptions, conversionTimestamp, toSelectArr } from "../../common/js/common";
let echarts = require("echarts");
export default {
  name: "model",
  components: {
    Card,
    DateTimePicker
  },
  mounted() {
    this.getFormData();
    this.getTableData(this.formObj);
  },
  data() {
    return {
      tableObj: {},
      tableLoading: true,
      formObj: {
        pageNo: 1,
        pageSize: 10
      }, //获取表格数据所需参数
      formData: {
        url: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        width: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        height: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        devicePixelRatio: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        fontSize: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        platform: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        vendor: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        agentId: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        ip: {
          val: "",
          sortArray: [
            {
              title: "无",
              value: "none"
            }
          ]
        },
        DOMContentLoaded: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        domReady: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        loaded: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        link: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        script: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        img: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        total: {
          placeholder: "请输入",
          required: false,
          maxlength: 18,
          valid: {
            type: "num"
          }
        },
        timeSeg: {
          val: [],
          error: false
        }
      },
      columns1: [
        {
          title: "序号",
          key: "number",
          width: 50,
          align: "center",
          fixed: "left",
          render: (h, obj) => {
            return h("span", obj.index + 1);
          }
        },
        {
          title: "地址",
          key: "url",
          align: "center",
          width: 200,
          ellipsis: true
        },
        {
          title: "屏幕宽度",
          key: "width",
          align: "center",
          width: 90
        },
        {
          title: "屏幕高度",
          key: "height",
          align: "center",
          width: 70
        },
        {
          title: "密度比",
          key: "devicePixelRatio",
          align: "center",
          width: 50
        },
        {
          title: "fontSize",
          key: "fontSize",
          align: "center",
          width: 60
        },
        {
          title: "平台",
          key: "platform",
          align: "center",
          width: 60
        },
        {
          title: "浏览器厂商",
          key: "vendor",
          align: "center",
          width: 100
        },
        {
          title: "userAgent",
          key: "userAgent",
          align: "center",
          width: 320,
          ellipsis: true
        },

        {
          title: "重定向",
          key: "redirect",
          align: "center",
          width: 50
        },
        {
          title: "DNS解析",
          key: "dns",
          align: "center",
          width: 70
        },
        {
          title: "TCP完成握手",
          key: "tcp",
          align: "center",
          width: 90
        },
        {
          title: "TTFB首字节",
          key: "ttfb",
          align: "center",
          width: 80
        },
        {
          title: "HTTP响应接收完成",
          key: "responseTime",
          align: "center",
          width: 120
        },
        {
          title: "解析DOM",
          key: "domInteractive",
          align: "center",
          width: 80
        },
        {
          title: "脚本运行",
          key: "domContentLoadedEvent",
          align: "center",
          width: 70
        },
        {
          title: "DOMContentLoaded",
          key: "DOMContentLoaded",
          align: "center",
          width: 140
        },
        {
          title: "readyState等于complete",
          key: "domReady",
          align: "center",
          width: 160
        },
        {
          title: "load",
          key: "loaded",
          align: "center",
          width: 60
        },
        {
          title: "CSS文件数量",
          key: "link",
          align: "center",
          width: 100
        },
        {
          title: "JS文件数量",
          key: "script",
          align: "center",
          width: 100
        },
        {
          title: "图片数量",
          key: "img",
          align: "center",
          width: 80
        },
        {
          title: "CSS中资源数量",
          key: "css",
          align: "center",
          width: 110
        },
        {
          title: "AJAX",
          key: "xmlhttprequest",
          align: "center",
          width: 60
        },
        {
          title: "FETCH",
          key: "fetch",
          align: "center",
          width: 60
        },
        {
          title: "框架嵌入数量",
          key: "iframe",
          align: "center",
          width: 100
        },
        {
          title: "总请求数",
          key: "total",
          align: "center",
          width: 70
        },
        {
          title: "agentId",
          key: "agentId",
          align: "center",
          width: 140
        },
        {
          title: "用户IP",
          key: "ip",
          align: "center",
          width: 120
        },
        {
          title: "收集时间",
          key: "createTime",
          align: "center",
          width: 140,
          render: (h, obj) => {
            const vm = this,
              time = Number(vm.data1[obj.index].createTime);
            return h("span", conversionTimestamp(time));
          }
        },
        {
          width: 120,
          title: "Action",
          key: "action",
          align: "center",
          slot: "action",
          fixed: "right"
        }
      ],
      data1: [],
      graphicalDialog: {
        title: "图表信息",
        show: false,
        hasOK: false,
        hasCancel: false,
        outside: true,
        autoHide: true,
        css: "graphical-dialog"
      },
      detailDialog: {
        title: "详细信息",
        show: false,
        hasOK: false,
        hasCancel: false,
        outside: true,
        autoHide: true,
        css: "detail-dialog",
        data: []
      }
    };
  },
  methods: {
    deleteItem(id) {
      this.$api.deleteFormData(id).then((res) => {
        if (res.data.err_code === 0) {
          this.getTableData(this.formObj);
          this.$Message.success({
            content: res.data.message
          });
        }
        else {
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    showGraphicalDialog() {
      let myGraphicalChart,
        graphicalOption = createOptions(this.data1);

      this.graphicalDialog.show = true;
      this.$nextTick(() => {
        if (!myGraphicalChart) {
          myGraphicalChart = echarts.init(this.$refs.graphical);
          window.addEventListener("resize", function() {
            myGraphicalChart.resize();
          });
        }
        myGraphicalChart.setOption(graphicalOption);
      });
    },
    getTableData(obj) {
      this.tableLoading = true;
      this.$api.getTableData(obj).then((res) => {
        if (res.data.err_code === 0) {
          this.tableObj = res.data;
          this.data1 = this.tableObj.dataList;
          this.tableLoading = false;
        } else {
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    changePage(val) {
      this.formObj.pageNo = val;
      this.getTableData(this.formObj);
    },
    getFormData() {
      this.$api.getFormData().then((res) => {
        if (!res) return;
        const { data } = res,
          { formData } = this;
        if (data.err_code == 0) {
          formData.url.sortArray = formData.url.sortArray.concat(toSelectArr(data.urlArr));
          formData.width.sortArray = formData.width.sortArray.concat(toSelectArr(data.widthArr));
          formData.height.sortArray = formData.height.sortArray.concat(toSelectArr(data.heightArr));
          formData.devicePixelRatio.sortArray = formData.devicePixelRatio.sortArray.concat(
            toSelectArr(data.devicePixelRatioArr)
          );
          formData.fontSize.sortArray = formData.fontSize.sortArray.concat(toSelectArr(data.fontSizeArr));
          formData.platform.sortArray = formData.platform.sortArray.concat(toSelectArr(data.platformArr));
          formData.vendor.sortArray = formData.vendor.sortArray.concat(toSelectArr(data.vendorArr));
          formData.agentId.sortArray = formData.agentId.sortArray.concat(toSelectArr(data.agentIdArr));
          formData.ip.sortArray = formData.ip.sortArray.concat(toSelectArr(data.ipArr));
        }
      });
    },
    resetForm() {
      const { formData } = this,
        keyArr = Object.keys(formData);

      keyArr.forEach((item) => {
        formData[item].val = formData[item].hasOwnProperty("sortArray") ? "none" : "";
      });
    },
    search() {
      const { formData } = this,
        keyArr = Object.keys(formData),
        { formObj } = this,
        str1 = "createTime[0]",
        str2 = "createTime[1]";

      formObj.pageNo = 1;
      keyArr.forEach((item) => {
        if (item === "timeSeg") {
          formObj[str1] = formData[item].val[0] || "";
          formObj[str2] = formData[item].val[1] || "";
        } else if (formData[item].val === "none" || !formData[item].val) {
          formObj[item] = "";
        } else {
          formObj[item] = formData[item].val;
        }
      });
      this.getTableData(formObj);
    },

    showDetailDialog(index) {
      const { detailDialog, data1 } = this;
      detailDialog.data = this.data1[index];
      detailDialog.data.createTime = conversionTimestamp(Number(detailDialog.data.createTime));
      this.detailDialog.show = true;

    },
    //为报错的table列表mark红色
    rowClassName(row, index) {
      if(row.errorTotal) {
        return "ivu-table-row-error";
      }
    }
  }
};
</script>

<style lang="scss">
.main-content .graphical-dialog {
  width: 80%;
  max-width: 840px;
  min-width: 300px;
  .content {
    margin: 20px !important;
  }
}
.main-content .detail-dialog {
  z-index: 9;
  width: 80%;
  max-width: 740px;
  text-align: left;
  min-width: 480px;
  .dialog-title {
    text-align: center;
    height: 40px;
    padding: 10px 0;
  }
  .content {
    margin: 2px 20px !important;
    .detailList {
      padding-bottom: 6px;
    }
    .detailList-item {
      font-size: 12px;
      height: auto;
      line-height: 20px;
      overflow: hidden;
      .detailList-item-title {
        display: block;
        width: 30%;
        text-align: right;
        float: left;
      }
      .detailList-item-content {
        padding-left: 8px;
        word-break:break-all;
        white-space: normal;
        display: block;
        width: 70%;
        text-align: left;
        float: left;
      }
    }
    .detailList-item:nth-of-type(2n + 1) {
      background: rgb(243, 243, 243);
    }
  }
}
.model {
  padding: 12px;
  width: 100%;
  .model-card {
    width: 100%;
    .form-card-content {
      // height: 1168px;
      .first-row {
        width: 100%;
        &::after {
          display: block;
          clear: both;
          content: "";
        }
        .first-row-input {
          width: 84%;
          float: left;
          .form-group {
            width: 190px;
            .form-title {
              width: 50%;
            }
            .form-content {
              width: 50%;
            }
          }
        }
        .first-row-btn {
          text-align: center;
          width: 16%;
          float: left;
          .logo-btn {
            margin-left: 12px;
          }
        }
      }
      .second-row {
        width: 100%;
        .form-group {
          width: 340px;
          .form-title {
            width: 50%;
          }
          .form-content {
            width: 50%;
          }
        }
        .time-group {
          width: 660px;
          position: relative;
          .form-title {
            width: 170px;
          }
          .form-content {
            width: 490px;
          }
        }
      }
    }
  }
}
.markByred {
  color: red;
}
</style>
