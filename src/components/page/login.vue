<template>
    <div id="login">
        <div>
            <h1 style="margin: 10px;">login</h1>
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
                <FormItem prop="uname">
                    <Input type="text" prefix="ios-contact" v-model="formCustom.uname" placeholder="user name"></Input>
                </FormItem>
                <FormItem prop="passwd">
                    <Input type="password" prefix="ios-lock-outline" v-model="formCustom.passwd" placeholder="password"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formCustom')" long>login</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data(){
        const validateUserName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('user name cannot be empty'));
            }
            if(!/^\w{4,16}$/.test(value)){
                return callback(new Error('User name length is 4-16 character'));
            }
            callback();
        };
        const validatePass = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('Please enter your password'));
            }
            if(value.length < 4 || value.length > 32){
                return callback(new Error('Password length is 4-32 character'));
            }
            callback();
        };
        return {
             formCustom: {
                passwd: '',
                passwdCheck: '',
                uname: ''
            },
            ruleCustom: {
                passwd: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                uname: [
                    { validator: validateUserName, trigger: 'blur' }
                ]
            }
        }
    },
    created(){},
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.$Message.success('Success!');
                    //  用户验证  to do 
                    this.$router.push('main');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
#login{
    height: 100%;
    min-width: 1280px;
    min-height: 768px;
    >div{
        width: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -100%);
    }
}
</style>
