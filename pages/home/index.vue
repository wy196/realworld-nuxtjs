<template>
<div class="home-page">

    <div class="banner">
        <div class="container">
            <h1 class="logo-font">conduit</h1>
            <!-- <h1 class="logo-font">测试</h1> -->
            <p>A place to share your knowledge.</p>
        </div>
    </div>

    <div class="container page">
        <div class="row">

            <div class="col-md-9">
                <div class="feed-toggle">
                    <ul class="nav nav-pills outline-active">
                        <li v-if="user" class="nav-item">
                            <nuxt-link
                                class="nav-link"
                                :class="{
                                    active: tab === 'your_feed'
                                }"
                                exact
                                :to="{
                                    name: 'home',
                                    query: {
                                        tab: 'your_feed'
                                    }
                                }"
                            >Your Feed</nuxt-link>
                        </li>
                        <li class="nav-item">
                            <nuxt-link
                                class="nav-link"
                                :class="{
                                    active: tab === 'global_feed'
                                }"
                                exact
                                :to="{
                                    name: 'home'
                                }"
                            >Global Feed</nuxt-link>
                        </li>
                        <li v-if="tag" class="nav-item">
                            <nuxt-link
                                class="nav-link"
                                :class="{
                                    active: tab === 'tag'
                                }"
                                exact
                                :to="{
                                    name: 'home',
                                    query: {
                                        tab: 'tag',
                                        tag: tag
                                    }
                                }"
                            ># {{ tag }}</nuxt-link>
                        </li>
                    </ul>
                </div>

                <template v-if="articles.length === 0">
                    <div class="article-preview">No articles are here...</div>
                </template>
                <template v-else>
                    <article-item v-for="article in articles" :key="article.slug" :article="article" />
                    <pagination :page="page" :total="totalPage" />
                </template>

            </div>

            <div class="col-md-3">
                <div class="sidebar">
                    <p>Popular Tags</p>
                    <div class="tag-list">
                        <nuxt-link
                            :to="{
                                name: 'home',
                                query: {
                                    tab: 'tag',
                                    tag: item
                                }
                            }"
                            class="tag-pill tag-default"
                            v-for="item in tags"
                            :key="item"
                        >{{ item }}</nuxt-link>
                    </div>
                </div>
            </div>

        </div>
    </div>

</div>
</template>
<script> 
import { getArticles, getYourFeedArticles} from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from "vuex";
import ArticleItem from '@/components/article-item'
import Pagination from '@/components/pagination'
const limit = 10;

export default { 
    name: 'HomeIndex',
    components: {
        ArticleItem,
        Pagination
    },
    async asyncData({ query, store }) {
        console.log(store)
        const page = Number.parseInt(query.page|| 1)
        const tab = query.tab || 'global_feed'
        const  { tag } = query

        const loadArticles = store.state.user && tab === 'your_feed'
        ? getYourFeedArticles
        : getArticles

        const [ 
            articleRes,
            tagRes
        ] = await Promise.all([
            loadArticles({
                limit,
                offset: (page - 1) * limit, // 数据偏移量
                tag
            }),
            getTags()
        ])
        const { articles, articlesCount } = articleRes.data
        const { tags } = tagRes.data
        console.log(articles, articlesCount)

        if (articlesCount > 0) {
            articles.forEach(article => article.favoriteDisabled = false)
        }
        return {
            articles: articles,
            articlesCount: articlesCount,
            tags: tags,
            limit,
            page,
            tag,
            tab: query.tab || "global_feed"
        }
    },
    watchQuery: ['page', 'tag', 'tab'],
    computed: {
        ...mapState(["user"]),
        totalPage() {
            return Math.ceil(this.articlesCount / this.limit)
        }
    },
    mounted() {
        console.log(this.user)
    }
}
</script> 
<style> </style>