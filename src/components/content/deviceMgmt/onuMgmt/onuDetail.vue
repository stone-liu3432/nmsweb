<template>
    <div>{{ onuInfo }}</div>
</template>

<script>
export default {
    name: "onuDetail",
    props: ["onuInfo"],
    data() {
        return {
            onu: {}
        };
    },
    methods: {
        getData() {
            this.$http
                .get("/api/device/epononu", {
                    params: {
                        devid: this.onuInfo.devid,
                        termid: this.onuInfo.termid
                    }
                })
                .then(res => {
                    this.onu = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.onu = res.data.data;
                        }
                    }
                })
                .catch(err => {});
        }
    },
    watch: {}
};
</script>

<style lang="less" scoped>
</style>
