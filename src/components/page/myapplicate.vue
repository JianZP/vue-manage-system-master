<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 离休干部经费申请审核</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                :data="query"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="applicater" label="申请人"></el-table-column>
                <el-table-column prop="apptime" label="申请时间"></el-table-column>
                <el-table-column prop="expendituretype" label="经费类型" align="center"></el-table-column>
                <el-table-column prop="appnum" label="金额（元）"></el-table-column>
                <el-table-column prop="appdetail" label="申请内容"></el-table-column>
                <el-table-column prop="issuccess" label="是否下发" align="center"></el-table-column>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="tpage.pageIndex"
                    :page-size="tpage.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-link type="danger" disabled><h3>Tips:已下发的经费，请凭个人信息到相关部门领取！</h3></el-link>
    </div>
</template>
<script>
    export default {
        name: 'tabs',
        data() {
            
            return {
               tpage: {
                    pageIndex: 1,
                    pageSize: 5
                },
                query:[],
                pageTotal:0,
            }
        },
        created() {
            this.fetchData();
            this.findCount();

        },
        methods: {
            fetchData(){
            this.$axios({      
                    method: 'post',
                    url: 'http://localhost:8080/selSelf',
                    params:{
                        id:localStorage.getItem('id'),
                        currPage:this.tpage.pageIndex,
                        pageSize:this.tpage.pageSize
                    },
                    }).then((result) => {
                        this.query=result.data;
                    })
           
        },
        //获取初始数量
        findCount(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/selSelfCount',
                      params:{
                        id:localStorage.getItem('id'),
                      }
                    }).then((result) => {
                        this.pageTotal=result.data;
                    })
        },
         // 分页导航
        handlePageChange(val) {
            this.$set(this.tpage, 'pageIndex', val);
            this.fetchData();
        },
            handleRead(index) {
                const item = this.unread.splice(index, 1);
                console.log(item);
                this.read = item.concat(this.read);
            },
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            }
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
</style>

