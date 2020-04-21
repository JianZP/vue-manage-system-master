<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/other">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 经费申请
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="申请人">
                    <el-input v-model="form.name" readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="选择经费" prop="id">
                        <el-select v-model="form.id" placeholder="请选择经费" @change="fetchMoney()">
                        <el-option v-for='item in option' :label="item.expenditurename" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请金额">
                    <el-input v-model="money" readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="申请理由" prop="desc">
                        <el-input type="textarea" :rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交申请</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            form: {
                name:localStorage.getItem('name'),
            },
            option:{
                
            },
            money:0,
            expendituretype:'',
            rules: {
                id: [
                    { required: true, message: '请选择经费', trigger: 'blur' },
                ],
                desc: [
                    { required: true, message: '申请理由不能为空', trigger: 'blur' },
                    { min: 100, max: 200, message: '请输入100到200字的申请理由', trigger: 'blur' }
                ]
        }
        };
    },
    created(){
        this.fetchData();
    },
    methods: {
        fetchData(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/selPaymentType',
                    }).then((result) => {
                        this.option=result.data;
                    })
           
        },
        fetchMoney(){
             this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/selMoney',
                    params:{
                        id:this.form.id
                    },
                    }).then((result) => {
                        this.money=result.data[0].canmoney;
                        this.expendituretype=result.data[0].expenditurename;
                    })
        },
        onSubmit(){
            this.$refs.form.validate(valid => {
            if (valid) {
             this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/applicate',
                    params:{
                        appid:localStorage.getItem('id'),
                        applicater:this.form.name,
                        expenditureid:this.form.id,
                        expendituretype:this.expendituretype,
                        appnum:this.money,
                        appdetail:this.form.desc

                    },
                    }).then((result) => {
                      if(result.data==300){
                         this.$message.success(`请等待管理员审核！`);
                      };
                    }) 
                      }else {
                    this.$message.error('请选择经费和输入申请理由');
                    console.log('error submit!!');
                    return false;
                    }
            });
        }
    }
    
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    width: 600px;
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
