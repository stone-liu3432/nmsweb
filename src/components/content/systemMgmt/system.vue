<template>
    <el-tabs v-model="activeName" type="card" class="system-mgmt">
        <el-tab-pane :label="langMap['user_mgmt']" name="userMgmt">
            <user-mgmt v-if="activeName === 'userMgmt'"></user-mgmt>
        </el-tab-pane>
        <el-tab-pane :label="langMap['auth_mgmt']" name="permissions">
            <permissions v-if="activeName === 'permissions'"></permissions>
        </el-tab-pane>
        <el-tab-pane :label="langMap['sw_lib_mgmt']" name="software">
            <software v-if="activeName === 'software'"></software>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { mapState } from "Vuex";
import userMgmt from '@/components/content/systemMgmt/user-mgmt'
import permissions from '@/components/content/systemMgmt/permissions'
import software from '@/components/content/systemMgmt/software'
export default {
    name: "system",
    components: { userMgmt, permissions, software },
    computed: mapState(["langMap"]),
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
