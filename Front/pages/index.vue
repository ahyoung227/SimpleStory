<template>
  <div>
    <post-form v-if="me"/>
    <post-card v-for = "p in mainPosts" :key="p.id" :post="p" />
  </div>
</template>

<script>
import PostCard from '~/components/PostCard'
import PostForm from '~/components/PostForm'

export default {
  components: {
    PostCard,
    PostForm,
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
    mainPosts() {
      return this.$store.state.posts.mainPosts;
    }
  },
  data() {
    return {
      name: 'nuxt.js'
    }
  },
  head: {
    title: 'main'
  }
}
</script>

<style>

</style>