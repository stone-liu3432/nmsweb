// login
const login = () => import(/* webpackChunkName: "login-page" */  '@/components/page/login')

//  main page
const main = () => import(/* webpackChunkName: "main-page" */ '@/components/page/nmsMain')
const home = () => import(/* webpackChunkName: "main-page" */ '@/components/content/home')

//  sub page
const alert = () => import(/* webpackChunkName: "alert" */ '@/components/content/alert')
const system = () => import(/* webpackChunkName: "system" */ '@/components/content/system')
const task = () => import(/* webpackChunkName: "task" */ '@/components/content/task')
const performance = () => import(/* webpackChunkName: "perf" */ '@/components/content/perf')

const topo = () => import(/* webpackChunkName: "device" */ '@/components/content/topo')
const device = () => import(/* webpackChunkName: "device" */ '@/components/content/device')
const onulist = () => import(/* webpackChunkName: "device" */ '@/components/content/onulist')

const routes = [
    {
    	path: "/",
    	component: login,
    },
    {
    	path: "/login",
    	component: login,
    },
    {
    	path: "/main",
    	meta: {
    		requireAuth: true
    	},
        component: main,
        children: [
            {
                path: "/main",
                meta: {
                    requireAuth: true
                },
                component: home,
            },
            {
                path: "/home",
                meta: {
                    requireAuth: true
                },
                component: home,
            },
            {
                path: "/alert",
                meta: {
                    requireAuth: true
                },
                component: alert,
            },
            {
                path: "/device",
                meta: {
                    requireAuth: true
                },
                component: device,
            },
            {
                path: "/onulist",
                meta: {
                    requireAuth: true
                },
                component: onulist,
            },
            {
                path: "/system",
                meta: {
                    requireAuth: true
                },
                component: system,
            },
            {
                path: "/task",
                meta: {
                    requireAuth: true
                },
                component: task,
            },
            {
                path: "/topo",
                meta: {
                    requireAuth: true
                },
                component: topo,
            },
            {
                path: '/performance',
                meta: {
                    requireAuth: true
                },
                component: performance
            }
        ]
    }
]

export default routes