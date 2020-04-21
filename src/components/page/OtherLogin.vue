<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/other">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 经费标准
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
            <span>{{this.query.title}}</span>
            </div>
                <div class="text item">
                        {{this.query.detail }}
                </div>
                <span>标准生效时间：{{this.validtime}}</span>
        </el-card>
    </div>

</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query:{
            },
            validtime:''
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/findStandrad',
                    params:{
                    },
                    }).then((result) => {
                        this.query=result.data[0];
                        if (result.data[0].edittime==null) {
                            this.validtime=result.data[0].addtime;
                        } else {
                             this.validtime=result.data[0].edittime;
                        }
                    })
        }
    }
    
};
</script>

<style scoped>
.text {
    font-size: 20px;
  }

  .item {
    margin-bottom: 30px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 900px;
  }
</style>
