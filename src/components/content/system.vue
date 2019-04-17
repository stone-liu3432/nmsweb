<template>
    <el-tabs v-model="activeName" type="card" class="system-mgmt">
        <el-tab-pane label="用户管理" name="userMgmt">
            <user-mgmt></user-mgmt>
        </el-tab-pane>
        <el-tab-pane label="权限管理" name="permissions">
            <permissions></permissions>
        </el-tab-pane>
        <el-tab-pane label="软件库管理" name="software">
            <software></software>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import userMgmt from '@/components/content/systemMgmt/user-mgmt'
import permissions from '@/components/content/systemMgmt/permissions'
import software from '@/components/content/systemMgmt/software'
export default {
    name: "system",
    components: { userMgmt, permissions, software },
    data() {
        return {
            activeName: "userMgmt"
        };
    }
};
</script>

<style lang="less" scoped>
.system-mgmt{
    margin: 20px 0 0 0;
}
</style>
