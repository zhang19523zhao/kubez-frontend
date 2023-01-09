<template>
    <a-layout>
<!--        固钉，以及hearder-->
        <a-affix>
<!--              布局头部-->
              <a-layout-header>
<!--                  平台信息-->
<!--                float:left居左的同时，会把其他的元素也放在同一行-->
                  <div style="float:left">
                    <img :src="kubeLogo" style="height: 40px;margin-bottom: 10px">
                    <span style="font-size: 25px;padding: 0 50px 0 20px;font-weight: bold;color: aliceblue">KubeZ</span>
                  </div>
<!--                  集群信息-->
                  <a-menu
                      style="float: left;width: 250px;line-height: 64px"
                      v-model:selected-keys="selectedKeys1"
                      theme="dark"
                      mode="horizontal">

                      <a-menu-item v-for="item in clusterList" :key="item"  >
                          {{item}}
                      </a-menu-item>

                  </a-menu>
<!--                  用户信息-->
                  <div style="float: right">
                    <img :src="userLogo" style="height: 40px;border-radius: 50%;margin-right: 10px">
                    <a-dropdown :overlayStyle="{paddingTop: '20px'}">
                        <a @click.prevent="">
                            Admin
                            <down-outlined></down-outlined>
                        </a>
                        <template #overlay>
                              <a-menu>
<!--                                退出登录-->
                                    <a-menu-item>
                                      <a @click="logout()">退出登录</a>
                                    </a-menu-item>
                        <!--                   修改密码           -->
                                <a-menu-item>
                                  <a >修改密码</a>
                                </a-menu-item>
                              </a-menu>
                        </template>
                    </a-dropdown>
                  </div>
              </a-layout-header>
        </a-affix>
<!--      中部, 高度永远是窗口最大高度减去68px， 因为68是hearder的高度-->
        <a-layout style="height: calc(100vh - 68px)">



<!--              侧边栏， 核心, collapsible伸缩功能-->
              <a-layout-sider width="240px" v-model:collapsed="collapsed" collapsible>

<!--              selectedKeys表示点击选中的栏目，用于a-menu-item-->
<!--              openKeys表示展开的栏目，用于a-sub-menu-->
<!--              openChange事件监听 SubMenu展开/关闭的回调-->
<!--              mode="inline" 纵向-->
<!--              routerChange()处理跳转和点击-->
              <a-menu
                  :selectedKeys="selectedKeys2"
                  :openKeys="openKeys"
                  :openChange="openChange"
                  mode="inline"
                  :style="{ height: '100%', borderRight: 0}">
<!--            routers是router/index.js的路由信息-->
                <template v-for="menu in routers" :key="menu">
<!--                      处理无子路由的情况-->
                    <a-menu-item
                        v-if="menu.children && menu.children.length == 1"
                        :index="menu.children[0].path"
                        :key="menu.children[0].path"
                        @click="routerChange('item', menu.children[0].path)">
<!--                      动态图标-->
                      <template #icon>
                         <component :is="menu.children[0].icon"></component>
                      </template>
                      <span>{{menu.children[0].name}}</span>
                    </a-menu-item>
                  <!--                      处理有子路由的情况-->
<!--                  a-sub-menu 只用于打开不用于跳转-->
                  <a-sub-menu
                    v-else-if="menu.children && menu.children.length > 1"
                    :index="menu.path"
                    :key="menu.path">
                    <template #icon>
                        <component :is="menu.icon"></component>
                    </template>

                   <template #title>
                        <span>
                              <span :class="[collapsed ? 'is-collapse' : '']">{{ menu.name}}</span>
                        </span>
                   </template>

<!--                    子路由，子栏目-->
                   <a-menu-item
                      v-for="child in menu.children"
                      :key="child.path"
                      :index="child.path"
                      @click="routerChange('sub', child.path)">
                      <span>
                            {{child.name}}
                      </span>
                   </a-menu-item>
                 </a-sub-menu>
                </template>
              </a-menu>
              </a-layout-sider>
              <a-layout style="padding: 0 24px" >
<!--                main的部分-->
                <a-layout-content
                    :style="{
                        background: 'rgb(31, 30, 30)',
                        padding: '24px',
                        margin: 0,
                        minHeight: '280px',
                        overflowY: 'auto' }">
<!--                  overflowY 表示默认高度超出后，显示滚轴-->
<!--                      路由占位符-->
                        <router-view></router-view>
                </a-layout-content>

<!--              footer部分-->
                <a-layout-footer style="text-align: center;padding: 0px" >
                      @2022 create kubeZ by zhanghao Devops
                </a-layout-footer>
              </a-layout>
        </a-layout>


    </a-layout>
</template>

<script>
import { ref, onMounted } from "vue";
import kubeLogo from '@/assets/img.png'
import userLogo from '@/assets/go.jpg'
import { useRouter } from 'vue-router'


export default ({
  setup() {
    const collapsed = ref(false)
    const selectedKeys1 = ref([])
    const clusterList = ref([
          'Kube1',
          'Kube2'
    ])
    // 侧边栏的属性
    // 路由信息
    const routers = ref([])
    const selectedKeys2 = ref([])
    const openKeys = ref([])
    // 通过useRouter方法获取路由配置以及当前页面的路由信息
    const router = useRouter()
    //
    onMounted(() => {
      routers.value = router.options.routes
      console.log(routers.value)
    })

    // 判断点击是否为sub下面的栏目（也就是单独item）如果不是，则关闭其他父栏目
    function routerChange(type,path){
          if(type !== 'sub') {
              openKeys.value = []
          }
          // 选中当前path对应的栏目，单独item或者子item
          selectedKeys2.value = [path]
          // 页面跳转
          // router.currentRoute.value.path 用于获取当前的页面路径
          if (router.currentRoute.value.path !== path) {
              router.push(path)
          }
    }
    //专门用于sub的打开
   function openChange(val){
        //匹配这个val（path）是否已经打开，如果没有，则打开他，关闭他
        const latestOpenKey = val.find(key => openKeys.value.indexOf(key) == -1)
        openKeys.value = latestOpenKey? [latestOpenKey]:[]
    }

    return {
      collapsed,
      kubeLogo,
      selectedKeys1,
      clusterList,
      userLogo,
      routers,
      selectedKeys2,
      router,
      openKeys,
      routerChange,
      openChange
    }
  }
})
</script>

<style>
  .ant-layout-header {
      padding: 0 30px !important;
  }

  .ant-layout-footer {
    padding: 5px 50px !important;
    color: rgb(239, 239, 239);
  }

  .is-collapse {
    display: none;
  }
</style>