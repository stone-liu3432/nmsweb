<template>
    <div class="layout">
        <Header>
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <MenuItem name="1">
                        首页
                    </MenuItem>
                    <Submenu name="2">
                        <template slot="title">
                            设备管理
                        </template>
                        <MenuItem name="2-1">topo</MenuItem>
                        <MenuItem name="2-2">设备列表</MenuItem>
                        <MenuItem name="2-3">onu列表</MenuItem>
                    </Submenu>
                    <MenuItem name="3">事件告警</MenuItem>
                    <MenuItem name="4">
                        系统管理
                    </MenuItem>
                    <MenuItem name="5">
                        任务管理
                    </MenuItem>
                </div>
            </Menu>
        </Header>
    </div>
</template>

<script>
export default {
    name: 'navHeader'
}
</script>

<style lang="less" scoped>
.layout{
    border: 1px solid #d7dde4;
    border-top: none;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    margin: 0 auto;
    margin-right: 20px;
    float: right;
}
</style>
