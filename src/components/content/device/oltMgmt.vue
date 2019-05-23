<template>
    <div>{{ oltInfo }}</div>
</template>

<script>
export default {
    name: "oltMgmt",
    props: ["oltInfo"],
    data() {
        return {
            olt: {}
        };
    },
    methods: {
        getData() {
            this.$http
                .get("/api/device/olt", {
                    params: { devid: this.oltInfo.devid }
                })
                .then(res => {
                    this.olt = {};
                    if (res.data.code === 1) {
                        if (res.data.data) {
                            this.olt = res.data.data;
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
