<template>
    <div id="footer">
        <span>{{ langMap['sys_time'] + ': ' + date }}</span>
        <span class="lang">
            {{ langMap['language'] }}
            <span :style="{ 'color': language === 'zh' ? '#409EFF' : '' }" @click="changeLang('zh')">简体中文</span>
            <span :style="{ 'color': language === 'en' ? '#409EFF' : '' }" @click="changeLang('en')">English</span>
        </span>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import { formatDate } from '@/utils/common';
export default {
    name: 'commonFooter',
    computed: mapState(["language", "langMap"]),
    data(){
        return {
            date: formatDate(Date.now())
        }
    },
    created(){
    },
    methods: {
        ...mapMutations({
            changeLang: "changeLang"
        }),
    },
}
</script>

<style lang="less" scoped>
#footer{
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 30px;
    line-height: 30px;
    width: 100%;
    text-align: center;
}
.lang{
    margin: 0 0 0 30px;
    >span{
        margin: 0 0 0 6px;
        cursor: pointer;
    }
}
</style>
