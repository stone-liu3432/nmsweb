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
    },
    setWsState(state, data){
        state.wsState = data;
        sessionStorage.setItem('ws', data);
    },
    updatePortName(state, data){
        state.port_name = data;
    },
    updateDevIP(state, data){
        state.dev_ip = data;
    },
    updateBasicInfo(state, data){
        state.basicInfo = data;
    },
    updateTimestamp(state, data){
        state.timestamp = data;
    },
    updateDevList(state, data){
        state.oltList = data;
    },
    updateOnuList(state, data){
        state.onuList = data;
    }
}

export default mutations