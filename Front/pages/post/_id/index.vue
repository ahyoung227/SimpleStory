<template>
  <v-container v-if="post">
    <post-card :post="post" />
  </v-container>
  <div v-else>
    Post does not exist.
  </div>
</template>

<script>
import PostCard from '~/components/PostCard';
export default {
  components: {
    PostCard,
  },
  computed: {
    post() {
      return this.$store.state.posts.mainPosts.find(v => v.id === parseInt(this.$route.params.id, 10));
    },
  },
  fetch({ store, params }) {
    return store.dispatch('posts/loadPost', params.id);
  },
  head() {
    return {
      title: `${this.post.User.nickname}'s post`,
      meta: [{
        hid: 'desc', name: 'description', content: this.post.content,
      }, {
        hid: 'ogtitle', property: 'og:title', content: `${this.post.User.nickname}'s post`,
      }, {
        hid: 'ogdesc', property: 'og:description', content: this.post.content,
      }, {
        hid: 'ogimage', property: 'og:image', content: this.post.Images[0] ? this.post.Images[0].src : '',
      }, {
        hid: 'ogurl', property: 'og:url', content: ``,
      }],
    }
  }
};
</script>

<style>
</style>