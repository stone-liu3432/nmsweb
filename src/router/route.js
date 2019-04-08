// login
const login = () => import(/* webpackChunkName: "main-page" */  '@/components/page/login')
const main = () => import(/* webpackChunkName: "main-page" */ '@/components/page/nmsMain')

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
                component: main,
            }
        ]
    }
]

export default routes