import Vue from 'vue';
import Router from 'vue-router';
import store from "../vuex/store";
import routes from './route'

Vue.use(Router)

const router = new Router({
    routes,
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

router.beforeEach((to, from, next)=>{
	store.commit("changeLoadingState", true);
	// 判断该路由是否需要登录权限
	if (to.meta.requireAuth) {
		if (process.env.NODE_ENV == 'development'){
			next();
		}else if(process.env.NODE_ENV == 'production'){
			if (sessionStorage.getItem("x-token")){
				next();
			}else{
				sessionStorage.removeItem('user');
				next({ path: "/login" });
			}
		}
	}else{
		if(!sessionStorage.getItem("x-token")){
			next();
		}else{
			next("/main");
		}
	}
});

router.afterEach((to, from)=>{
	store.commit("changeLoadingState", false);
});

export default router;
