<template>
  <v-container>
    <v-card>
      <v-img />
      <v-card-text>
        <div>
          <h3>{{ post.user.nickname }}</h3>
          <div>{{ post.content }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="orange"><v-icon>mdi-twitter-retweet</v-icon></v-btn>
        <v-btn text color="orange"><v-icon>mdi-heart-outline</v-icon></v-btn>
        <v-btn text color="orange"><v-icon>mdi-comment-outline</v-icon></v-btn>
        <v-menu offset-y open-on-hover>
          <template v-slot:activator="{ on }">
            <v-btn text color="orange" v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <div style="background: white">
            <v-btn dark color="red" @click="onRemovePost">delete</v-btn>
            <v-btn text color="orange" @click="onEditPost">Edit</v-btn>
          </div>
        </v-menu>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    onRemovePost() {
      this.$store.dispatch('posts/remove', {
        id: this.post.id,
      })
    },
    onEditPost() {

    }
  },
}
</script>
<style>

</style>