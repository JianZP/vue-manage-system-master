<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 查询统计/经费录入
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="addAllSelection"
                >经费录入</el-button>
            </div>
            <el-table
                :data="customers"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="expenditurename" label="经费名称"></el-table-column>
                <el-table-column prop="expendituretype" label="经费类型"></el-table-column>
                <el-table-column prop="usecase" label="使用详情" align="center"></el-table-column>
                <el-table-column prop="addtime" label="录入时间"></el-table-column>
                <el-table-column prop="canmoney" label="可申请金额（元）" align="center"></el-table-column>
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
                <el-form-item label="名称" prop="expenditurename">
                    <el-input v-model="form.expenditurename"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="expendituretype">
                    <el-input v-model="form.expendituretype"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="canmoney">
                    <el-input v-model.number="form.canmoney"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shutEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 录入经费标准弹出框 -->
        <el-dialog title="录入经费" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                <el-form-item label="名称" prop="expenditurename">
                    <el-input v-model="form.expenditurename"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="expendituretype">
                    <el-input v-model="form.expendituretype"></el-input>
                </el-form-item>
                 <el-form-item label="金额" prop="canmoney">
                    <el-input v-model.number="form.canmoney"></el-input>
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
        var checkMoney = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('可申请金额不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('金额必须大于0'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
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
                expenditurename:"",
                expendituretype:"",
                canmoney:''
            },
            editpeople:localStorage.getItem('ms_username'),
            idx: -1,
            id: -1,
            rules: {
                expenditurename: [
                    { required: true, message: '经费名称不能为空', trigger: 'blur' },
                ],
                expendituretype: [
                    { required: true, message: '经费类型不能为空', trigger: 'blur' }
                ],
                canmoney: [
                    { validator: checkMoney, trigger: 'blur' },
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
                url: 'http://localhost:8080/insPayment',
                params:{
                    expenditurename:this.form.expenditurename,
                    expendituretype:this.form.expendituretype,
                    canmoney:this.form.canmoney
                    },
                    }).then((result) => {
                        if(result.data==200){
                        this.addVisible = false;
                        this.fetchData();
                        this.findCount();
                        this.$message.success(`录入成功!`);
                        this.form.expenditurename="";
                        this.form.expendituretype="";
                        this.form.canmoney="";
                        }else{
                            this.editVisible = false;
                            this.$message.success(`录入失败!`);
                        }
                    })
                         }else {
                    this.$message.error('请输入正确经费名称、类型和金额');
                    console.log('error submit!!');
                    return false;
                    }
            });
        },
        shutAdd(){
            this.addVisible = false;
            this.form.expenditurename="";
            this.form.expendituretype="";
             this.form.canmoney="";
        },
        // 获取 easy-mock 的模拟数据
        fetchData(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/selPayment',
                    params:{
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
                    url: 'http://localhost:8080/selPaymentTotal',
                    }).then((result) => {
                        this.pageTotal=result.data;
                    })
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/delPayments',
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
                url: 'http://localhost:8080/updPayments',
                params:{
                    id:this.form.id,
                    expenditurename:this.form.expenditurename,
                    expendituretype:this.form.expendituretype,
                    canmoney:this.form.canmoney
                    },
                    }).then((result) => {
                        if(result.data==202){
                        this.editVisible = false;
                        this.fetchData();
                        this.findCount();
                        this.$message.success(`修改成功!`);
                       this.form.expenditurename="";
                        this.form.expendituretype="";
                        this.form.canmoney="";
                        }else{
                            this.editVisible = false;
                            this.$message.success(`修改失败!`);
                        }
                    })
                    }else {
                    this.$message.error('请输入正确经费名称、类型和金额');
                    console.log('error submit!!');
                    return false;
                    }
            });
        },
         shutEdit(){
            this.editVisible = false;
            this.fetchData();
            this.form.expenditurename="";
            this.form.expendituretype="";
            this.form.canmoney="";
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.fetchData();
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
