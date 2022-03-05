<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">

                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>
                    <ul class="error-messages">
                        <template v-for="(messages, field) in errors">
                        <li
                            v-for="(message, index) in messages"
                            :key="index"
                        >{{ field }} {{ message }}</li>
                        </template>
                    </ul>
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="userInfo.image" class="form-control" type="text" placeholder="URL of profile picture">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userInfo.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                            </fieldset>
                            <fieldset class="form-group">
                                <!--   -->
                                <textarea v-model="userInfo.bio" class="form-control form-control-lg" rows="8"
                                        placeholder="Short bio about you"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userInfo.email" class="form-control form-control-lg" type="text" placeholder="Email">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="userInfo.password" minlength="6" class="form-control form-control-lg" type="password" placeholder="new Password">
                            </fieldset>
                            <button type="submit" :disabled="isLoading" class="btn btn-lg btn-primary pull-xs-right">
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                    <hr />
                    <button class="btn btn-outline-danger" @click="logout">
                        Or click here to logout.
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex"
const Cookie = process.client ? require('js-cookie') : undefined
import { updateUser } from "@/api/user";

export default {
    middleware: "authenticated",
    name: "SettingsIndex",
    computed: {
        ...mapState(["user"])
    },
    data() {
        return{
            userInfo: {
                image: "",
                username: "",
                bio: "",
                email: "",
                password: ""
            },
            isLoading: false, // 是否处于提交状态
            errors: {}
        }
    },
    mounted() {
        const { image, username, email } = this.user;
        this.userInfo = {
            image,
            username,
            email,
            bio: this.user.bio && this.user.bio !=null ? this.user.bio: '',
            password: ""
        }
    },
    methods: {
        // 退出登录
        logout() {
            this.$store.commit('setUser', null)
            Cookie.remove('user')
            this.$router.push('/')
        },
        // 提交
        async onSubmit() {
            this.isLoading = true;
            try {
                const { data } = await updateUser({
                    user: this.userInfo
                })
                this.isLoading = false;
                this.$store.commit('setUser', data.user)
                // 把登录状态存储到cookie中，为了防止刷新页面数据丢失，我们需要把数据持久化
                Cookie.set('user', data.user)
                // 回到个人中心页
                this.$router.push({
                    name: 'profile',
                    params: {
                        username: data.user.username
                    }
                })
            } catch (error) {
                console.log(error)
                this.isLoading = false
                this.errors = error.response.data.errors
            }
        }
    }
}
</script>
<style scoped>

</style>