<template>
<div class="profile-page">

    <div class="user-info">
        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-md-10 offset-md-1">
                    <img :src="profile.image" class="user-img" />
                    <h4>{{ profile.username }}</h4>
                    <p>{{ profile.bio }}</p>
                    <button
                        class="btn btn-sm btn-outline-secondary action-btn"
                        @click="$router.push('/settings')"
                        v-if="isSelf"
                    >
                        <i class="ion-gear-a"></i>
                        Edit Profile Settings
                    </button>
                    <button
                        v-else
                        class="btn btn-sm action-btn"
                        :class="{
                            'btn-outline-secondary': !profile.following,
                            'btn-secondary': profile.following,
                        }"
                        @click="onFollowStatus"
                    >
                        <i class="ion-plus-round"></i>
                        {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
                    </button>
                </div>

            </div>
        </div>
    </div>

    <div class="container">
        <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">
                <div class="articles-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li class="nav-item">
                            <nuxt-link
                                class="nav-link"
                                :class="{
                                    active: tab === 'my_articles',
                                }"
                                exact
                                :to="{ name: 'profile'}"
                            >
                                My Articles
                            </nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link
                                class="nav-link"
                                :class="{
                                    active: tab === 'favorited_articles',
                                }"
                                exact
                                :to="{
                                    name: 'profile',
                                        query: {
                                        tab: 'favorited_articles',
                                    },
                                }"
                            >
                                Favorited Articles
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <template v-if="articles.length === 0">
                    <div class="article-preview">No articles are here...</div>
                </template>
                <template v-else>
                    <article-item v-for="article in articles" :key="article.slug" :article="article" />
                    <pagination :page="page" :total="total" />
                </template>
            </div>

        </div>
    </div>

</div>
</template>
<script>
import { mapState } from 'vuex'
import { getArticles } from '@/api/article'
import { follow, unfollow, getProfile } from '@/api/user'
import ArticleItem from '@/components/article-item'
import Pagination from '@/components/pagination'
const limit = 10;
export default {
    components: { ArticleItem, Pagination },
    middleware: "authenticated",
    name: 'UserProfile',
    computed: {
        ...mapState(['user']),
        isSelf() {
            // 判断是否是已登录用户本人的主页
            return this.user && this.user.username === this.$route.params.username
        }
    },
    watchQuery: ['page', 'tab'], // 监听 query 变化调用asyncData
    async asyncData({ params, query }) {
        console.log(params)
        const {
            data: { profile },
        } = await getProfile(params.username)
        const page = Number.parseInt(query.page || 1)
        const tab = query.tab || 'my_articles'
        const {
            data: { articles, articlesCount },
        } = await getArticles(
            Object.assign(
                {
                    limit,
                    offset: (page - 1) * limit,
                },
                tab === 'my_articles' ? { author: profile.username } : { favorited: profile.username }
            )
        )
        const total = Math.ceil(articlesCount / limit)
        articles.forEach(article => article.favoriteDisabled = false)
        return {
            total, // 总页数
            page, // 页号
            articles, // 文章列表
            profile, // 用户信息
            tab, // 选项卡
        }
    },
    methods: {
        async onFollowStatus() {
            if (!this.user) {
                this.$router.push('/login')
                return
            }
            const { username, following } = this.profile
            console.log(following)
            const opt = following ? unfollow : follow
            const {
                data: { profile }
            } = await opt(username)
            this.profile = profile
        }
    }
}
</script>