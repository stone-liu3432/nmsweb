<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import zh from "@/locale/zh-cn";
import en from "@/locale/en";
const lang = {
    zh,
    en
};
export default {
    name: "nms",
    computed: mapState(["language", "lanMap"]),
    created() {
        this.changeLang("zh");
    },
    components: {},
    data() {
        return {
            
        };
    },
    mounted() {},
    methods: {
        ...mapMutations({
            changeLang: "changeLang",
            changeLangMap: "changeLangMap"
        })
    },
    watch: {
        language() {
            this.changeLangMap(lang[this.language]);
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
