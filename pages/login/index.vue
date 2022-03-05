<template>
    <div class="auth-page">
    <div class="container page">
        <div class="row">

            <div class="col-md-6 offset-md-3 col-xs-12">
                <h1 class="text-xs-center">{{isLogin ? 'Sign in': 'Sign up'}}</h1>
                <p class="text-xs-center">
                    <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
                    <nuxt-link v-else to="/login">Have an account?</nuxt-link>
                </p>

                <ul class="error-messages">
                    <template v-for="(messages, field) in errors">
                    <li
                        v-for="(message, index) in messages"
                        :key="index"
                    >{{ field }} {{ message }}</li>
                    </template>
                </ul>
                <form @submit.prevent="onSubmit">
                    <fieldset class="form-group" v-if="!isLogin">
                        <input required v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                    </fieldset>
                    <fieldset class="form-group">
                        <input required type="email" v-model="user.email" class="form-control form-control-lg" placeholder="Email">
                    </fieldset>
                    <fieldset class="form-group">
                        <input required v-model="user.password" minlength="6" class="form-control form-control-lg" type="password" placeholder="Password">
                    </fieldset>
                    <button :disabled="loading" class="btn btn-lg btn-primary pull-xs-right">
                        {{isLogin ? 'Sign in': 'Sign up'}}
                    </button>
                </form>
            </div>

        </div>
    </div>
</div>
</template>
<script>
import { login, register } from "@/api/user";
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined
export default {
    middleware: "notAuthenticated",
    name: 'LoginIndex',
    computed: {
        isLogin() {
            return this.$route.name === "login"
        }
    },
    data () {
        return {
            user: {
                username: "",
                email: "",
                password: ""
            },
            errors: {},
            loading: false
        }
    },
    methods: {
        async onSubmit () {
            this.loading = true
            try {
                // 提交表单请求登录
                const { data } = this.isLogin
                ? await login({
                    user: this.user
                    })
                : await register({
                    user: this.user
                })
                this.loading = false
                console.log(data)
                // TODO: 保存用户的登录状态
                this.$store.commit('setUser', data.user)

                // 把登录状态存储到cookie中，为了防止刷新页面数据丢失，我们需要把数据持久化
                Cookie.set('user', data.user)
                this.$router.push('/')
               
            } catch (err) {
                this.loading = false
                console.log('请求失败', err)
                this.errors = err.response.data.errors
            }
            
        }
    }
}
</script>