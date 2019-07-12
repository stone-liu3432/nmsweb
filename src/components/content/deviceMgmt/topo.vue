<template>
    <div>
        <el-button type="priamry" @click="test">test</el-button>
        <canvas width="1200px" height="600px" id="topo"></canvas>
    </div>
</template>

<script>
import '../../../../static/jtopo-0.4.8-min';
export default {
    name: 'topo',
    data(){
        return {
            stage: null,
            scene: null
        }
    },
    created(){},
    mounted(){
        let canvas = document.getElementById('topo');
        this.stage = new JTopo.Stage(canvas);
        // this.stage.frames = -24;
        this.scene = new JTopo.Scene(this.stage);
    },
    methods: {
        test(){
            if(this.stage && this.scene)
            {
                this.scene.clear();
                this.stage.paint();
            }

            let data = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16'];

            const CVS_WIDTH = 1200;
            const CVS_HEIGHT = 600;
            const ROW_STEP = 100;
            let row = 1;
            let col = 1;
            //  每行的节点个数上限
            let row_count = 8;
            //  行内节点下标
            let row_idx = 0;

            let nodeFrom = new JTopo.Node("from");
            let size = nodeFrom.getSize();
            let pwidth = size.width;
            nodeFrom.setLocation((CVS_WIDTH - pwidth) / 2, row * ROW_STEP);
            nodeFrom.textPosition = 'Top_Center';
            nodeFrom.text = "parent";
            nodeFrom.fontColor = '0,0,0';
            this.scene.add(nodeFrom);
            
            row++;
            data.forEach((item, index) =>{
                if(index % row_count === 0 && index !== 0){
                    row++;
                    col = 1;
                    row_idx = 0;
                }
                let c = new JTopo.Node(item);
                let pwidth = c.getSize().width;
                let node_width = CVS_WIDTH / row_count;
                let cstart = (node_width - pwidth) / 2 + row_idx * node_width;
                c.setLocation(cstart, row * ROW_STEP);
                c.text = item;
                c.fontColor = 'blue';
                this.scene.add(c);

                let link = new JTopo.Link(nodeFrom, c);
                //link.text = `link ${item}`;
                link.lineWidth = 1;
                link.strokeColor = '128, 151, 189';
                link.fontColor = '125,1,23';
                this.scene.add(link);

                row_idx++;
            })
            
        }
    }
}
</script>

<style lang="less" scoped>
</style>
