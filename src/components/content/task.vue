<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane :label="langMap['task_mgmt']" name="taskMgmt">
                <task-mgmt></task-mgmt>
            </el-tab-pane>
            <el-tab-pane :label="langMap['task_temp_mgmt']" name="taskTempMgmt">
                <task-temp-mgmt></task-temp-mgmt>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
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
    }
}
</script>

<style lang="less" scoped>

</style>
