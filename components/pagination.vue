<template>
	<!-- 分页列表 -->
    <nav>
        <ul class="pagination">
            <li
                class="page-item"
                :class="{
                    active: item === page
                }"
                v-for="item in total"
                :key="item"
            >
                <nuxt-link
                    class="page-link"
                    :to="{
                        name: 'home',
                        query: {
                            page: item,
                            tag: $route.query.tag,
                            tab: $route.query.tab
                        }
                    }"
                >{{ item }}</nuxt-link>
            </li>
        </ul>
    </nav>
    <!-- /分页列表 -->
</template>

<script>
export default {
  name: "Pagination",
  props: {
    page: {
      type: Number,
      required: true,
    },
    total: {
        type: Number,
        required: true,
    }
  },
  mounted() {
      console.log(this.$route)
  }
};
</script>
