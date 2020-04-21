import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '管理员' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '经费标准设置' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '经费申请审核' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '经费录入' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '导出年度报表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                // {
                //     path: '/404',
                //     component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                //     meta: { title: '404' }
                // },
                // {
                //     path: '/403',
                //     component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                //     meta: { title: '403' }
                // },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },

        {
            path: '/other',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/HomeOther.vue'),
            meta: { title: '离休干部' },
            children: [
                {
                    path: '/standrad',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/OtherLogin.vue'),
                    meta: { title: '经费标准' }
                },
                {
                    path: '/applicated',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/OtherApplicate.vue'),
                    meta: { title: '经费申请' }
                },
                {
                    path: '/myapplicated',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/myapplicate.vue'),
                    meta: { title: '我的申请' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '个人信息' }
                },
            ]
        },


        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            component: () => import(/* webpackChunkName: "register" */ '../components/page/Register.vue'),
            meta: { title: '注册' }
        },
        // {
        //     path: '*',
        //     redirect: '/404'
        // },
        // {
        //     path: '/other',
        //     component: () => import(/* webpackChunkName: "login" */ '../components/page/OtherLogin.vue'),
        //     meta: { title: '离休干部登录' }
        // },
        
    ]
});
