<template>
    <div>
        <form @submit.prevent="onPublish" class="card comment-form">
            <div class="card-block">
                <textarea ref="comment_body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
                <img :src="user.image" class="comment-author-img"/>
                <button class="btn btn-sm btn-primary" :disabled="loading">
                    发送评论
                </button>
            </div>
        </form>

        <div
            class="card"
            v-for="comment in comments"
            :key="comment.id"
        >
            <div class="card-block">
                <p class="card-text">{{ comment.body }}</p>
            </div>
            <div class="card-footer">
                <nuxt-link class="comment-author" :to="{
                    name: 'profile',
                    params: {
                        username: comment.author.username
                    }
                }">
                    <img :src="comment.author.image" class="comment-author-img" />
                </nuxt-link>
                &nbsp;
                <nuxt-link class="comment-author" :to="{
                    name: 'profile',
                    params: {
                        username: comment.author.username
                    }
                }">
                    {{ comment.author.username }}
                </nuxt-link>
                <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
                <span class="mod-options" v-if="user && user.username === comment.author.username">
                    <i class="ion-trash-a" @click="onDelete(comment)"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { getComments, publishComment, deleteComment } from '@/api/article'
import { mapState } from "vuex"
export default {
    name: "ArticleComments",
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(["user"])
    },
    data () {
        return {
            comments: [], // 文章列表
            loading: false
        }
    },
    mounted () {
        this.getComments()
    },
    methods: {
        async getComments() {
            const { data } = await getComments(this.article.slug)
            this.comments = data.comments
        },
        async onPublish() {
            if (this.$refs.comment_body.value == '') return
            this.loading = true
            await publishComment(this.article.slug, { "body": this.$refs.comment_body.value})
            // 成功后重新获取评论
            this.loading = false
            await this.getComments()
            this.$refs.comment_body.value = ''
        },

        async onDelete(comment) {
            await deleteComment(this.article.slug, comment.id)
            // 成功后重新获取评论
            await this.getComments()
        },
    }
}
</script>

<style>

</style>