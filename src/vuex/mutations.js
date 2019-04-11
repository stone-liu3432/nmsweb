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
    }
}

export default mutations