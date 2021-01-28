<template>
  <div class="classify">
    <Card class="classify-card">
      <div slot="card-content">
        <div class="content-row">
          <div class="content-row-input">
            <v-group title="agentId:">
              <v-input :data-key="formData.agentId"></v-input>
            </v-group>
            <v-group title="csser:">
              <v-input :data-key="formData.csser"></v-input>
            </v-group>
            <v-group title="JAVA开发:">
              <v-input :data-key="formData.developer"></v-input>
            </v-group>
          </div>
          <div class="content-row-btn">
            <v-button title="重置" css="btn-normal" :callback="resetForm"></v-button>
            <button class="logo-btn" @click="search">
              <i class="iconfont icon-sousuo"></i>
              <span>查找</span>
            </button>
          </div>
        </div>
        <div class="model-graphic">
          <button class="logo-btn" @click="handleData(0)">
            新增
          </button>
        </div>
        <div class="platform-table">
          <Table width="100%" :columns="columns1" :data="data1" :loading="tableLoading">
            <template slot="action" slot-scope="{ index, row }">
              <v-button
                :callback="
                  () => {
                    handleData(1, index);
                  }
                "
                css="btn-normal"
                isshow
                style="margin-right: 5px;"
                title="编辑"
              ></v-button>
              <Poptip
                confirm
                placement="left"
                title="Are you sure to delete?"
                ok-text="yes"
                cancel-text="no"
                @on-ok="deleteItem(row.Id)"
              >
                <button class="logo-btn delete">删除</button>
              </Poptip>
            </template>
          </Table>
          <div class="table-page">
            <div>
              <Page
                :total="tableObj.totalCount"
                :current="formObj.pageNo"
                :page-size="formObj.pageSize"
                @on-change="changePage"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <v-dialog :dialog="classifyDialog">
      <div>
        <v-group title="agentId:">
          <span>{{ classifyDialog.agentId }}</span>
        </v-group>
        <v-group title="csser:">
          <v-input :data-key="dialogFormData.csser"></v-input>
        </v-group>
        <v-group title="JAVA开发:">
          <v-input :data-key="dialogFormData.developer"></v-input>
        </v-group>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import Card from "../../components/card";
import { timeStampToNumber, conversionTimestamp } from "../../common/js/common";
export default {
  components: {
    Card
  },
  data() {
    return {
      tableObj: {},
      tableLoading: true,
      formObj: {
        pageNo: 1,
        pageSize: 10
      },
      formData: {
        agentId: {
          placeholder: "请输入",
          type: "text",
          maxlength: 18,
          required: false,
          valid: {
            type: "num"
          }
        },
        csser: {
          placeholder: "请输入",
          type: "text",
          maxlength: 18,
          required: false
        },
        developer: {
          placeholder: "请输入",
          type: "text",
          maxlength: 18,
          required: false
        }
      },
      columns1: [
        {
          title: "序号",
          key: "Id",
          align: "center",
          width: 80,
          render: (h, obj) => {
            return h("span", obj.index + 1);
          }
        },
        {
          title: "agentId",
          key: "agentId",
          align: "center"
        },
        {
          title: "csser",
          key: "csser",
          align: "center"
        },
        {
          title: "JAVA开发",
          key: "developer",
          align: "center"
        },
        {
          title: "生成时间",
          key: "createTime",
          align: "center",
          render: (h, obj) => {
            const time = Number(obj.row.createTime);
            return h("span", conversionTimestamp(time));
          }
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          slot: "action"
        }
      ],
      data1: [],
      classifyDialog: {
        // title: "告警信息",
        show: false,
        hasOK: true,
        hasCancel: true,
        outside: true,
        autoHide: true,
        css: "classify-dialog",
        changeType: 0,
        agentId: "",
        Id: "",
        okCallBack: this.changeTableData
      },
      dialogFormData: {
        csser: {
          placeholder: "请输入",
          type: "text",
          maxlength: 18
        },
        developer: {
          placeholder: "请输入",
          type: "text",
          maxlength: 18
        }
      }
    };
  },
  mounted() {
    this.getTableData(this.formObj);
  },
  methods: {
    /**
     *  处理表格数据
     *   @param {number} type -处理数据类型 0：新增 1：编辑
     *   @param {number} index -行号（编辑时可用）
     */
    handleData(type, index) {
      const { classifyDialog, data1, dialogFormData } = this,
        title = type === 0 ? "新增" : "编辑";

      classifyDialog.show = true;
      classifyDialog.title = title;
      classifyDialog.changeType = type;
      classifyDialog.agentId = type === 0 ? "ua" + timeStampToNumber(Date.now()) : data1[index].agentId;

      if (type === 1) {
        const data = data1[index];
        dialogFormData.csser.val = data.csser;
        dialogFormData.developer.val = data.developer;
        classifyDialog.Id = data.Id;
      } else {
        dialogFormData.csser.val = "";
        dialogFormData.developer.val = "";
        classifyDialog.Id = "";
      }
    },
    getTableData(obj) {
      this.tableLoading = true;
      this.$api.getAgntIdList(obj).then((res) => {
        if (res.data.err_code === 0) {
          this.tableObj = res.data;
          this.data1 = res.data.dataList;
          this.tableLoading = false;
        } else {
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    },
    resetForm() {
      const { formData } = this,
        keyArr = Object.keys(formData);

      keyArr.forEach((item) => {
        formData[item].val = "";
      });
    },
    search() {
      const { formData, formObj } = this,
        keyArr = Object.keys(formData);

      formObj.pageNo = 1;
      keyArr.forEach((item) => {
        if (!formData[item].val) {
          formObj[item] = "";
        } else {
          formObj[item] = formData[item].val;
        }
      });
      this.getTableData(formObj);
    },
    changeTableData() {
      const { classifyDialog, dialogFormData } = this;

      if (!this.$checkAll(dialogFormData)) {
        return false;
      }
      if (classifyDialog.changeType === 0) {
        //新增
        const obj = {
          agentId: classifyDialog.agentId,
          csser: dialogFormData.csser.val,
          developer: dialogFormData.developer.val
        };

        this.$api.insertAgentId(obj).then((res) => {
          if (res.data.err_code === 0) {
            this.getTableData(this.formObj);
            this.$Message.success({
              content: res.data.message
            });
          } else {
            this.$Message.error({
              background: true,
              content: res.data.message
            });
          }
        });
      } else {
        //编辑
        const obj = {
          Id: classifyDialog.Id,
          csser: dialogFormData.csser.val,
          developer: dialogFormData.developer.val
        };

        this.$api.updateAgengId(obj).then((res) => {
          if (res.data.err_code === 0) {
            this.getTableData(this.formObj);
            this.$Message.success({
              content: res.data.message
            });
          } else {
            this.$Message.error({
              background: true,
              content: res.data.message
            });
          }
        });
      }
    },
    changePage(val) {
      this.formObj.pageNo = val;
      this.getTableData(this.formObj);
    },
    deleteItem(Id) {
      const obj = {
        Id,
        isDel: 1
      }
      this.$api.updateAgengId(obj).then((res) => {
        if (res.data.err_code === 0) {
          this.getTableData(this.formObj);
          this.$Message.success({
            content: res.data.message
          });
        } else {
          this.$Message.error({
            background: true,
            content: res.data.message
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.classify {
  padding: 12px;
  width: 100%;
  .classify-card {
    width: 100%;
    .content-row {
      width: 100%;
      &::after {
        display: block;
        clear: both;
        content: "";
      }
      .content-row-input {
        width: 84%;
        float: left;
        .form-group {
          width: 250px;
          .form-title {
            width: 90px;
          }
          .form-content {
            width: 160px;
          }
        }
      }
      .content-row-btn {
        width: 16%;
        float: right;
        .logo-btn {
          margin-left: 12px;
        }
      }
    }
  }
}
.main-content .classify-dialog {
  width: 520px;
  .content {
    margin: 26px 0 0 !important;
  }
  .form-group {
    width: 300px;
    .form-title {
      width: 80px;
    }
    .form-content {
      width: 220px;
    }
  }
}
</style>
