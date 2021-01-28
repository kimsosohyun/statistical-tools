import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Index from "../pages/index.vue";
import Home  from '../pages/home/home.vue'
import Platform  from '../pages/platform/platform.vue'
import Classify  from '../pages/platform/classify.vue'
import Model  from '../pages/platform/model.vue'
import Login from '../pages/login/login.vue'

export default new Router({
  routes: [
    {
      path: '/',   
      component:Index,
      redirect:"/home",
      children:[
        {
          path:"/home",
          component:Home,
          title:"首页",
          meta:{
            // ignoreLogin: true,
            pathInfo:"首页",
            icon:"iconfont icon-shouye"
          }
        },
        {
          path:"/platform",
          component:Platform,
          redirect:"/platform/model",
          title:"统计",
          meta:{
            icon:"iconfont icon-tongji"
          },
          children:[
            {
              path:"/platform/model",
              component:Model,
              title:"统计列表",
              meta:{
                pathInfo:"统计 / 统计列表",
                icon:"iconfont icon-liebiao"
              }
            },
            {
              path:"/platform/classify",
              component:Classify,
              loginIgnore: true,
              title:"id管理",
              meta:{
                pathInfo:"统计 / id管理",
                icon:"iconfont icon-guanli"
              }
            }
        ]
        },
      ]
    },
    {
      path: '/login',   
      component: Login
    }
  ]
})
