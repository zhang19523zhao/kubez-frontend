<template>
<!--    路由占位符-->
    <router-view></router-view>
</template>


<style>
    /* 屏幕浏览器最大的宽和高*/
    html, body {
        width: 100vw;
        height: 100vh;
        /*最小宽度*/
        min-width: 1425px;
        overflow-y: hidden;
    }
    #nprogress .bar {
    /*    自定义进度条颜色*/
        background: #2186c0 !important;
    }
</style>
