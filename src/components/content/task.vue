<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="任务管理" name="taskMgmt">
                <task-mgmt></task-mgmt>
            </el-tab-pane>
            <el-tab-pane label="任务模板管理" name="taskTempMgmt">
                <task-temp-mgmt></task-temp-mgmt>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import taskMgmt from './taskMgmt/taskMgmt'
import taskTempMgmt from './taskMgmt/taskTempMgmt'
export default {
    name: 'task',
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
