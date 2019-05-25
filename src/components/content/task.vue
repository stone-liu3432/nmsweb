<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="langMap['task_mgmt']" name="taskMgmt">
                <task-mgmt ref="taskMgmt" v-if="activeName === 'taskMgmt'"></task-mgmt>
            </el-tab-pane>
            <el-tab-pane :label="langMap['task_temp_mgmt']" name="taskTempMgmt">
                <task-temp-mgmt v-if="activeName === 'taskTempMgmt'"></task-temp-mgmt>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "Vuex";
import taskMgmt from './taskMgmt/taskMgmt'
import taskTempMgmt from './taskMgmt/taskTempMgmt'
export default {
    name: 'task',
    computed: mapState(["langMap"]),
    components: { taskMgmt, taskTempMgmt },
    data(){
        return {
            activeName: 'taskMgmt'
        }
    },
    methods: {
    },
    watch: {}
}
</script>

<style lang="less" scoped>

</style>
