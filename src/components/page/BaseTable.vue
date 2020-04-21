<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 经费标准设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.isnowstandrad" placeholder="是否标准" class="handle-select mr10">
                    <el-option key="1" label="是当前标准" value="是"></el-option>
                    <el-option key="2" label="不是当前标准" value="否"></el-option>
                    <el-option key="3" label="所有" value=""></el-option>
                </el-select>
                <el-input v-model="query.title" placeholder="经费标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addAllSelection"
                >经费标准录入</el-button>
            </div>
            <el-table
                :data="customers"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="经费标题"></el-table-column>
                <el-table-column prop="detail" label="经费内容"></el-table-column>
                <el-table-column prop="addpeople" label="录入人员" align="center">
                </el-table-column>
                <el-table-column prop="addtime" label="录入时间"></el-table-column>
                <el-table-column prop="editpeople" label="修改人" align="center">
                </el-table-column>

                <el-table-column prop="edittime" label="修改时间"></el-table-column>
                <el-table-column prop="isnowstandrad" label="是否当前经费标准"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-setting"
                            @click="setNow(scope.$index, scope.row)"
                        >设置为当前标准</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="detail">
                    <el-input v-model="form.detail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shutEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 录入经费标准弹出框 -->
        <el-dialog title="录入经费标准" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules" >
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="detail">
                    <el-input v-model="form.detail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shutAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            customers:[],
            query: {
                isnowstandrad:"",
                title:"",
                detail:"",
                pageIndex: 1,
                pageSize: 5
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            array:[],
            form: {
                title:'',
                detail:'',
                addpeople:localStorage.getItem('ms_username')
            },
            editpeople:localStorage.getItem('ms_username'),
            idx: -1,
            id: -1,
            rules: {
                title: [
                    { required: true, message: '经费标题不能为空', trigger: 'blur' },
                ],
                detail: [
                    { required: true, message: '经费标准内容不能为空', trigger: 'blur' }
                ]
        }
        };
    },
    created() {
        this.fetchData();
        this.findCount();
    },
    methods: {
        //标准经费录入
        addAllSelection(){
            this.addVisible = true;
        },
        saveAdd(){
            this.$refs.form.validate(valid => {
            if (valid) {
            this.$axios({        
                method: 'post',
                url: 'http://localhost:8080/addPaymentstandard',
                params:{
                    title:this.form.title,
                    detail:this.form.detail,
                    addpeople:this.form.addpeople
                    },
                    }).then((result) => {
                        if(result.data==201){
                        this.addVisible = false;
                        this.fetchData();
                        this.findCount();
                        this.$message.success(`录入成功!`);
                        this.form.title="";
                        this.form.detail="";
                        }else{
                            this.editVisible = false;
                            this.$message.success(`录入失败!`);
                        }
                    });
                    }else {
                    this.$message.error('请输入经费标准和内容');
                    console.log('error submit!!');
                    return false;
                    }
            });
                    
        },
        shutAdd(){
            this.addVisible = false;
            this.form.title="";
            this.form.detail="";
        },
        // 获取 easy-mock 的模拟数据
        fetchData(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/findPaymentstandard',
                    params:{
                        title:this.query.title,
                        isnowstandrad:this.query.isnowstandrad,
                        currPage:this.query.pageIndex,
                        pageSize:this.query.pageSize
                    },
                    }).then((result) => {
                        this.customers=result.data;
                        this.findCount();
                    })
           
        },
        //获取初始数量
        findCount(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/findTotal',
                    params:{
                        title:this.query.title,
                        isnowstandrad:this.query.isnowstandrad
                    },
                    }).then((result) => {
                        this.pageTotal=result.data;
                    })
        },
        // 触发搜索按钮
        handleSearch() {
            this.fetchData();
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/delPaymentstandard',
                    params:{
                        id:row.id
                    },
                    }).then((result) => {
                        if(result.data==203);
                        this.$message.success('删除成功');
                        this.fetchData();
                        this.findCount();
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            const array = [];
            for(var i=0;i<val.length;i++){
                array.push(val[i].id);
            }
            this.array=array;
            this.multipleSelection = val;
        },
        delAllSelection() {
            var ids=this.array.join(";");
             this.$axios({   
                    method: 'post',
                    url: 'http://localhost:8080/delSelect',
                    params:{
                        ids:ids
                    },
                    }).then((result) => {
                        if(result.data==200){
                            this.$message.error(`删除成功！`);
                            this.fetchData();
                            this.findCount();
                        }
                    })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {  
            this.$refs.form.validate(valid => {
            if (valid) {
            this.$axios({  
                method: 'post',
                url: 'http://localhost:8080/updPaymentstandard',
                params:{
                    id:this.form.id,
                    title:this.form.title,
                    detail:this.form.detail,
                    editpeople:this.editpeople
                    },
                    }).then((result) => {
                        if(result.data==202){
                        this.editVisible = false;
                        this.fetchData();
                        this.findCount();
                        this.$message.success(`修改成功!`);
                        this.form.title="";
                        this.form.detail="";
                        }else{
                            this.editVisible = false;
                            this.$message.success(`修改失败!`);
                        }
                    })
                    }else {
                    this.$message.error('请输入经费标准和内容');
                    console.log('error submit!!');
                    return false;
                    }
            });
        },
         shutEdit(){
            this.editVisible = false;
            this.fetchData();
            this.form.title="";
            this.form.detail="";
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.fetchData();
        },
        setNow(index, row) {
            this.$confirm('确定要设为当前标准吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/setPaymentstandard',
                    params:{
                        id:row.id
                    },
                    }).then((result) => {
                        if(result.data==204);
                        this.$message.success('设置标准成功');
                        this.fetchData();
                        this.findCount();
                    })
                })
                .catch(() => {});
        },
    }
    
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
