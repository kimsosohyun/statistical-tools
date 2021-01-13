<template>
  <div class="classify">
    <Card class="classify-card">
      <div slot="card-content">
        <div class="content-row">
          <div class="content-row-input">
            <v-group title="agentId:">
              <v-input :data-key="formData.agentId"></v-input>
            </v-group>
             <v-group title="agentId:">
              <v-input :data-key="formData.agentId"></v-input>
            </v-group>
             <v-group title="agentId:">
              <v-input :data-key="formData.agentId"></v-input>
            </v-group>
          </div>
          <div class="content-row-btn">
            <v-button title="重置" css="btn-normal"></v-button>
            <button class="logo-btn">
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
          <Table width="100%" :columns="columns1" :data="data1">
            <template slot="action" slot-scope="{index}">
              <v-button :callback="()=>{handleData(1,index)}" css="btn-normal" isshow style="margin-right: 5px;" title="编辑"></v-button>
              <Poptip
                confirm
                placement=left
                title="Are you sure to delete?"
                ok-text="yes"
                cancel-text="no"
              >
              <button class="logo-btn delete">删除</button>
            </Poptip>
            </template>
          </Table>
          <div class=table-page>
            <div>
              <Page :total="100" :current="7"></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>    

    <v-dialog :dialog="classifyDialog">
        <div>
          <v-group title="agentId:">
            <span>ua20200602155805</span>
          </v-group>
            <v-group title="csser:">
            <v-input :data-key="formData.agentId"></v-input>
          </v-group>
            <v-group title="JAVA开发:">
            <v-input :data-key="formData.agentId"></v-input>
          </v-group>
        </div>
    </v-dialog>

  </div>
</template>

<script>
import Card from "../../components/card"
export default {
  components:{
    Card
  },
  data(){
    return {
      formData:{
        agentId:{
          placeholder: "请输入",
          type: "text",
          maxlength: 18,
        }
      },
      columns1: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 80
        },
        {
          title: "agentId",
          key: "id",
          align: "center"
        },
        {
          title: "csser",
          key: "csser",
          align: "center"
        },
        {
          title: "JAVA开发",
          key: "java",
          align: "center"
        },
        {
          title: "生成时间",
          key: "time",
          align: "center"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          slot: "action",
        },
      ],
      data1: [
        {
          order:"1",
          id:"ua20200602155805",
          csser:"kimso",
          java:"wxp",
          time:"2020-06-02 15:58:18"
        },
         {
          order:"1",
          id:"ua20200602155805",
          csser:"kimso",
          java:"wxp",
          time:"2020-06-02 15:58:18"
        },
         {
          order:"1",
          id:"ua20200602155805",
          csser:"kimso",
          java:"wxp",
          time:"2020-06-02 15:58:18"
        },
      ],
      classifyDialog:{
        // title: "告警信息",
        show: false,
        hasOK: true,
        hasCancel: true,
        outside: true,
        autoHide: true,
        css:"classify-dialog",
      }
    }
  },
  methods:{
    /**
    *  处理表格数据
    *   @param {number} type -处理数据类型 0：新增 1：编辑 
  *            {number} index -行号（编辑时可用）
    */
    handleData(type,index){
      const {classifyDialog} = this,
      title = type === 0 ? "新增" : "编辑";
      classifyDialog.show = true;
      classifyDialog.title = title;
    }
  }

}
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
        .content-row-input{
          width: 84%;
          float: left;
          .form-group {
            width: 250px;
            .form-title {
              width: 90px;
            }
            .form-content{
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
    .form-content{
      width: 220px;
    }
  }
}
</style>