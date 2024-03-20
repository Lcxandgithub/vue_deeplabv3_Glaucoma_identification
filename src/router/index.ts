import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import( '../views/dashboard.vue'),
            },

            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '图片上传',
                    permiss: '5',
                },
                component: () => import('../views/upload.vue'),
            },
            {
                path: '/detect',
                name: 'detect',
                meta: {
                    title: '视杯视盘识别',
                    permiss: '6',
                },
                component: () => import( '../views/detect.vue'),
            },
            {
                path: '/Preventive',
                name: 'Preventive',
                meta: {
                    title: '青光眼的预防',
                    permiss: '8',
                },
                component: () => import('../views/Preventive.vue'),
            },
            {
                path: '/Health',
                name: 'Health',
                meta: {
                    title: '健康普及',
                    permiss: '9',
                },
                component: () => import('../views/Health.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import('../views/login.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done()
})

export default router;
