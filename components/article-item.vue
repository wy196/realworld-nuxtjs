<template>
	<div class="article-preview">
		<div class="article-meta">
			<nuxt-link
				:to="{
					name: 'profile',
					params: {
						username: article.author.username,
					},
				}"
			>
				<img :src="article.author.image"/>
			</nuxt-link>
			<div class="info">
				<nuxt-link
					class="author"
					:to="{
						name: 'profile',
						params: {
						username: article.author.username,
						},
					}"
				>
					{{ article.author.username }}
				</nuxt-link>
				<span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
			</div>
			<button
				class="btn btn-outline-primary btn-sm pull-xs-right"
				:class="{
					active: article.favorited,
				}"
				@click="onFavorite(article)"
				:disabled="article.favoriteDisabled"
			>
				<i class="ion-heart"></i> {{ article.favoritesCount }}
			</button>
		</div>
		<nuxt-link
			:to="{
				name: 'article',
				params: {
					slug: article.slug,
				},
			}"
			class="preview-link"
		>
			<h1>{{ article.title }}</h1>
			<p>{{ article.description }}</p>
			<span>Read more...</span>
		</nuxt-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addFavorite, deleteFavorite } from "@/api/article";

export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    // 切换喜欢状态
	async onFavorite (article) {
		if (!this.user) {
			this.$router.push("/login");
			return;
		}
		const { slug, favorited } = article;
		article.favoriteDisabled = true
		if (favorited) {
			// 取消点赞
			await deleteFavorite(slug)
			article.favorited = false
            article.favoritesCount += -1
		} else {
			// 添加点赞
			await addFavorite(slug)
			article.favorited = true
            article.favoritesCount += 1
		}
		article.favoriteDisabled = false
	},

    // async onSwitchFavoriteStatus() {
    //   // 如果还未登录，跳转到登录页
    //   if (!this.user) {
    //     this.$router.push("/login");
    //     return;
    //   }
    //   const { slug, favorited } = this.article;
    //   const opt = favorited ? deleteFavorite : addFavorite;
    //   const {
    //     data: { article },
    //   } = await opt(slug);
    //   this.article = article;
    // },
  },
};
</script>
