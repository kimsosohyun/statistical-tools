<template>
  <div class="index">
    <div class="left-menu">
      <div class="logo">
        <img src="../common/img/tenda-logo.png" alt />
      </div>
      <div class="main-meau">
        <div class="first-menu">
          <div v-for="(item,index) in routes" :key="index" :class="{menuActive:path.includes(item.path)}">
            <router-link :to="item.path" :class="{active:path.includes(item.path)}">
              <i :class="item.meta.icon"></i>
              <span>{{item.title}}</span>
              <div class="right-arrow" v-if="item.children">
                <i class="iconfont icon-jiantouxia"></i>
              </div>
            </router-link>
            <div class="second-menu">
              <div v-for="(item1,index) in item.children" :key="index">
                <router-link :to="item1.path" :class="{active:path===item1.path}">
                  <i :class="item1.meta.icon"></i>
                  <span>{{item1.title}}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="top-bar">
        <div class="navigation-bar">{{$route.meta.pathInfo}}</div>
        <div class="logout">
          <img src="../common/img/person.png" alt="">
          <i class="iconfont icon-jiantouxia"></i>
          <div class="hidden-logout">
            <span>退出登录</span>
          </div>
        </div>
      </div>
      <div class="main-content" ref="mainContent">
        <router-view></router-view>
        <div class="returnTop" v-if="showReturn" @click="returnToTop">
          <i class="iconfont icon-jiantoushang1"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      showLogout: false,
      showReturn: false
    };
  },
  mounted() {
    const mainContent = this.$refs.mainContent;
    this.mainContent = mainContent;
    mainContent.addEventListener("scroll",(el)=>{
      let ev = el || window.event,
      h = ev.target.children[0].offsetHeight - el.target.offsetHeight,
      sh = ev.target.scrollTop;
      this.speed = h/12;
      if(sh > h/3){
        this.showReturn = true;
      }
      else{
         this.showReturn = false;
      }
    },false)
  },
  computed: {
    routes() {
      return this.$router.options.routes[0].children;
    },
    path() {
      return this.$route.path;
    },
  },
  methods: {
    returnToTop() {
      let timer = setInterval(()=>{
        let top = this.mainContent.scrollTop;
          top -= this.speed;
          if(top <= 0){
            top = 0;
            clearInterval(timer);
          }
        this.mainContent.scrollTop = top;
      },20);
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  background: #f2f2f2;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  // min-width: 1360px;
  .left-menu {
    float: left;
    width: 256px;
    height: 100vh;
    position: relative;
    background: #001529;
    .logo {
      width: 100%;
      height: 64px;
      overflow: hidden;
      img {
        display: block;
        margin: 14px auto;
        width: 162px;
        height: 36px;
      }
    }
    .first-menu {
      width: 100%;
      i{
        padding-right: 8px;
      }
      a {
        position: relative;
        display: block;
        font-size: 14px;
        width: 100%;
        height: 50px;
        padding-left: 30px;
        color: rgba(255, 255, 255, 0.65);
        line-height: 50px;
      }
      a:hover,.active{
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .right-arrow {
        transition: all .2s ease-in-out;
        font-weight: normal;
        transform-origin:center;
        position: absolute;
        right: 20px;
        top: 0;
        i{
          font-size: 12px;  
          padding-right: 0;
        }
      }
    }
    .second-menu {
      width: 100%;
      visibility: hidden;
      a {
        height: 0;
        transition: all .2s ease-in-out;
        // transform:translateY(-100%);
        display: block;
        font-size: 14px;
        width: 100%;
        padding-left: 50px;
        color: rgba(255, 255, 255, 0.65);
        line-height: 50px;
      }
      .active {
        font-weight: bold;
        background: $main-active-color;
        color: rgba(255, 255, 255, 1);
      }
    }
    .menuActive {
      .right-arrow{
        transform:rotate(180deg);
        -ms-transform:rotate(180deg); 	/* IE 9 */
        -moz-transform:rotate(180deg); 	/* Firefox */
        -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
        -o-transform:rotate(180deg); 
      }
      .second-menu{
        visibility:visible;
        a{
          height: 50px;
          // transform:translateY(0%);
        }
      }
    }
  }
  .content {
    float: left;
    width: calc(100% - 256px);
    height: 100vh;
    .top-bar {
      height: 64px;
      background: white;
      -webkit-box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
      box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
      border-bottom: 1px solid #f0f0f0;
      position: relative;
      .navigation-bar {
        float: left;
        line-height: 64px;
        padding-left: 20px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .logout {
        position: relative;
        z-index: 1;
        float: right;
        cursor: pointer;
        width: 56px;
        height: 63px;
        background: white;
        margin-right: 30px;
        line-height: 32px;
        img{
          margin-top: 16px;
          width: 32px;
          height: 32px;
        }
        i{
          position: absolute;
          top: 16px;
          right: 0px;
          font-size: 12px;
        }
        .hidden-logout {
          transition: all .2s ease-in-out;
          visibility: hidden;
          position: absolute;
          z-index: -1;
          bottom: -34px;
          left: -4px;
          opacity: 0;
          box-sizing: border-box;
          border-radius: 4px;
          -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
          box-shadow: 0 1px 6px rgba(0,0,0,.2);
          background: white;
          width: 64px;
          height: 38px;
          color: #515a6e;
          font-size: 12px;
          text-align: center;
          span{
            margin-top: 4px;
            display: block;
            height: 30px;
            width: 100%;       
          }
        }
        .hidden-logout:hover{
           span{
             background: #f3f3f3;
           }
        }
      }
      .logout:hover{
        .hidden-logout{
          visibility:visible;
          opacity: 1;
          bottom:-40px;
        }
      }
    }
    .main-content{
      width: 100%;
      height: calc(100% - 64px);
      position: relative;
      // background: red;
      overflow: auto;
      .returnTop {
        position: fixed;
        bottom: 88px;
        right: 46px;
        width: 48px;
        height: 40px;
        background:rgba(0,0,0,0.5);
        line-height: 40px;
        text-align: center;
        z-index: 999;
        i{
          color: white;
          font-size: 20px;
        }
      }
      .returnTop:hover {
         background:rgba(0,0,0,0.7);
      }
    }
  }
}
</style>