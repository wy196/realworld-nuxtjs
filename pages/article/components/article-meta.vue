<template>
    <div class="article-meta">
        <nuxt-link :to="{
            name: 'profile',
            params: {
                username: article.author.username
            }
        }">
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link class="author" :to="{
                name: 'profile',
                params: {
                    username: article.author.username
                }
            }">
                {{article.author.username}}
            </nuxt-link>
            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>
        <template v-if="isSelf">
            <button class="btn btn-sm btn-outline-secondary" @click="onEditArticle">
                <i class="ion-edit"></i>
                Edit Article
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="onDeleteArticle">
                <i class="ion-trash-a"></i>
                Delete Article
            </button>
        </template>
        <template v-else>
            <button 
                class="btn btn-sm btn-outline-secondary"
                :class="{
                    active: article.author.following
                }"
                @click="onFollowStatus"
            >
                <i class="ion-plus-round"></i>
                {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
            </button>
            &nbsp;&nbsp;
            <button 
                class="btn btn-sm btn-outline-primary"
                :class="{
                    active: article.favorited
                }"
                @click="onFavoriteStatus"
            >
                <i class="ion-heart"></i>
                {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article
                <span class="counter">({{ article.favoritesCount }})</span>
            </button>
        </template>
    </div>

</template>

<script>
import { addFavorite, deleteFavorite, deleteArticle } from '@/api/article';
import { follow, unfollow } from '@/api/user';
import { mapState } from "vuex"
export default {
    name: "ArticleMeta",
    props: ["article"],
    computed: {
        ...mapState(["user"]),
        isSelf() { // 判断是不是本人
            return this.user && this.user.username === this.article.author.username
        }
    },
    methods: {
        // 编辑文章
        onEditArticle() {
            this.$router.push({
                name: "editor",
                params: {
                    slug: this.article.slug
                }
            })
        },
        // 删除文章
        async onDeleteArticle() {
            await deleteArticle(this.article.slug)
            // 跳转到主页
            this.$router.push('/')
        },
         // 切换关注状态
        async onFollowStatus() {
            // 如果还未登录，跳转到登录页
            if (!this.user) {
                this.$router.push('/login')
                return
            }
            const { username, following } = this.article.author
            console.log(following)
            const opt = following ? unfollow : follow
            const {
                data: { profile },
            } = await opt(username)
            console.log(profile)
            this.$emit('update-article', {...this.article,author: profile})
        },
        // 切换喜欢状态
        async onFavoriteStatus() {
            // 如果还未登录，跳转到登录页
            if (!this.user) {
                this.$router.push('/login')
                return
            }
            const { slug, favorited } = this.article
            const fn = favorited ? deleteFavorite : addFavorite
            const {
                data: { article },
            } = await fn(slug)
            this.$emit('update-article', article)
        },
    }
}
</script>

<style>

</style>