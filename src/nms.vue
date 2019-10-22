<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapState, mapMutations } from "Vuex";
import zh from "@/locale/zh-cn";
import en from "@/locale/en";
const lang = {
    zh,
    en
};
export default {
    name: "nms",
    computed: {
        ...mapState(["language", "langMap"]),
        title(){
            var path = this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1);
            (path === 'main') && (path = 'home');
            (path === '') && (path = 'login');
            return this.langMap[path] || 'nmsweb';
        }
    },
    created() {
        this.$i18n.locale = sessionStorage.getItem('lang') || 'en';
        this.changeLangMap(lang[sessionStorage.getItem('lang') || 'en']);
        this.changeLang(this.$i18n.locale);
    },
    data() {
        return {
            
        };
    },
    methods: {
        ...mapMutations({
            changeLang: "changeLang",
            changeLangMap: "changeLangMap"
        })
    },
    watch: {
        language() {
            this.changeLangMap(lang[this.language]);
            this.$i18n.locale = this.language;
            document.title = this.title;
        },
        '$route'(){
            document.title = this.title;
        }
    }
};
</script>

<style>
html {
    height: 100%;
}
body {
    height: 100%;
    margin: 0;
}
#app {
    font-family: Helvetica, Avenir, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    min-width: 1280px;
}
</style>
