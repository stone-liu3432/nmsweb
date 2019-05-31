<template>
    <div>
        config management
    </div>
</template>

<script>
export default {
    name: 'configMgmt',
    data(){
        return {}
    },
    created(){
        this.$message('test');
        setTimeout(_ =>{
            this.$message({
                type: 'warning',
                message: 'test options'
            })
        }, 3000)
    },
    methods: {}
}
</script>

<style lang="less" scoped>
</style>
