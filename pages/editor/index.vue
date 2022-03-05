<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.title" required type="text" class="form-control form-control-lg" placeholder="Article Title">
                            </fieldset>
                            <fieldset class="form-group">
                                <input v-model="article.description" required type="text" class="form-control" placeholder="What's this article about?">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea v-model="article.body" required class="form-control" rows="8"
                                        placeholder="Write your article (in markdown)"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input  @keydown.enter.prevent="addTag" type="text" class="form-control" placeholder="Enter tags">
                                <div class="tag-list">
                                    <span v-for="(tag, idx) in article.tagList"
                                        :key="tag"
                                        class="tag-default tag-pill"
                                    >
                                        <i class="ion-close-round" @click="removeTag(idx)"></i>
                                        {{ tag }}
                                    </span>
                                </div>
                            </fieldset>
                            <button :disabled="loading" class="btn btn-lg pull-xs-right btn-primary">
                                Publish Article
                            </button>
                        </fieldset>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { getArticle, publishArticle, updateArticle } from '@/api/article'

export default {
    // 在路由匹配组件渲染之前会先执行中间件处理
    middleware: "authenticated", // 一个可以写成字符串形式，多个写成数组形式
    name: "Editor",
    data() {
        return {
            loading: false
        }
        
    },

    // 已有文章，则进行编辑操作先获取数据
    async asyncData({ params }) {
        console.log(params)
        if (params.slug) {
            // 已有文章
            const { data } = await getArticle(params.slug)
            console.log(data)
            return { article: data.article }
        }
        // 新文章
        return {
            article: {
                title: '',
                description: '',
                body: '',
                tagList: [],
            },
        }
    },
    methods: {
        // 添加标签
        addTag($event) {
            const tag = $event.target.value
            if (this.article.tagList.indexOf(tag) > -1) return
            this.article.tagList.push(tag)
            $event.target.value = ''
        },
        // 移除标签
        removeTag(idx) {
            this.article.tagList.splice(idx, 1)
        },
        async onSubmit() {
            this.loading = true
            const { data } = this.$route.params.slug ? 
                await updateArticle(this.$route.params.slug, {article: this.article}): // 更新已有文章
                await publishArticle({article: this.article}) // 发布新文章 
            this.loading = false
            // 跳转到文章详情页
            const { slug } = data.article
            this.$router.push(`/article/${slug}`)
        },
    }
}
</script>
<style scoped>

</style>