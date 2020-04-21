<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">离休干部注册</div>
            <div style="margin: 20px;"></div>
            <div style="margin-right: 20px;">
            <el-form :label-position="labelPosition" label-width="80px" ref="form" :model="form" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" @blur="check()"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                 <el-form-item label="确认密码" prop="surepassword">
                    <el-input v-model="form.surepassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择">
                         <el-option  label="男" value="男"></el-option>
                         <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="form.age"></el-input>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactway">
                    <el-input v-model="form.contactway"></el-input>
                </el-form-item>
                <el-form-item label="所属单位" prop="id">
                        <el-select v-model="form.id" placeholder="请选择单位">
                        <el-option v-for='item in option' :label="item.partname" :value="item.id"></el-option>
                        </el-select>
                </el-form-item>
                 <div class="login-btn" style="margin-left: 20px">
                <el-button type="success" @click="register()">注册</el-button>
                 </div>
            </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
        return {
            param: {
            },
            form:{},
            option:{},
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                surepassword: [
                    { required: true, message: '请确认密码', trigger: 'blur' }
                ],
                 name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                 sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                age: [
                    { validator: checkAge,trigger: 'blur'},
                ],
                address: [
                    { required: true, message: '住址不能为空', trigger: 'blur' }
                ],
                contactway: [
                    { required: true, message: '联系方式不能为空', trigger: 'blur' }
                ],
                id: [
                    { required: true, message: '请选择所属单位', trigger: 'blur' }
                ]
        }
        };
    },
    created(){
        this.fetchDepart();
    },
    methods: {
        register() {
              this.$refs.form.validate(valid => {
                 
                if (valid) {  
                    if(this.form.password==this.form.surepassword){
                this.$axios({        
                        method: 'post',
                        url: 'http://localhost:8080/register',
                        params:{
                            username:this.form.username,
                            password:this.form.password,
                            name:this.form.name,
                            sex:this.form.sex,
                            age:this.form.age,
                            address:this.form.address,
                            contactway:this.form.contactway,
                            belongpartyid:this.form.id,
                        },
                        }).then((result) => {
                        if(result.data==300){
                            this.$message.success(`注册成功！`);
                            this.$router.push('/login');
                        };
                        }) 
                }else{
                    this.$message.error(`前后输入密码不一致`);
                };
                 } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
            
                
        },
        check(){
            this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/check',
                    params:{
                        username:this.form.username
                    },
                    }).then((result) => {
                      if(result.data[0].username!=null&&result.data[0].username!=""){
                         this.$message.error(`用户名已存在,请重新输入用户名！`);
                         this.form.username="";
                      };
                    }) 
        },
        fetchDepart(){
             this.$axios({        
                    method: 'post',
                    url: 'http://localhost:8080/findDepart',
                    }).then((result) => {
                       this.option=result.data;
                    }) 
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    color: rgb(8, 2, 2);
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -300px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>