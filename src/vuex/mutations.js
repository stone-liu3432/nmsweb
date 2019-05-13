const mutations = {
    changeLoadingState(state, data){
        state.isLoading = data;
    },
    chnageTheme(state, data){
        state.theme = data;
    },
    updateCharts(state, data){
        state.charts.push(data);
    },
    updateBreadcrumb(state, data){
        state.breadcrumb = data;
    },
    changeLang(state, data){
        state.language = data;
        sessionStorage.setItem('lang', data);
    },
    changeLangMap(state, data){
        state.langMap = data;
    }
}

export default mutations