<template>
  <div>
    <v-container>
      <v-card>
        <div v-if="post.RetweetId && post.Retweet">
          <v-subheader>{{post.User.nickname}} retweet this post. </v-subheader>
          <v-card style="margin: 0 20px">
            <post-content :post="post.Retweet" />
          </v-card>
        </div>
        <post-content v-else :post="post" />
        <v-card-actions>
          <v-btn text color="orange" @click="onRetweet"><v-icon>mdi-twitter-retweet</v-icon></v-btn>
          <v-btn text color="orange" @click="onClickHeart"><v-icon>{{heartIcon}}</v-icon></v-btn>
          <v-btn text color="orange" @click="onToggleComment"><v-icon>mdi-comment-outline</v-icon></v-btn>
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
      <template v-if="commentOpened">
        <comment-form :post-id="String(post.id)" />
          <v-list>
            <v-list-item v-for="c in post.Comments" :key="c.id">
              <v-list-item-avatar color="teal">
                <span>{{c.User.nickname[0]}}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{c.User.nickname}}</v-list-item-title>
                <v-list-item-subtitle>{{c.content}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </template>
    </v-container>
  </div>
</template>

<script>
import CommentForm from "~/components/CommentForm";
import PostContent from "@/components/PostContent";

export default {
  components: {
    CommentForm, PostContent
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      commentOpened: false
    }
  },
  computed: {
    me() {
      return this.$store.state.users.me
    },
    liked() {
      const me = this.$store.state.users.me;
      return !!(this.post.Likers || []).find(v=> v.id === (me && me.id))
    },
    heartIcon() {
      return this.liked ? "mdi-heart": "mdi-heart-outline"
    }
  },
  methods: {
    onRemovePost() {
      this.$store.dispatch('posts/remove', {
        postId: this.post.id,
      })
    },
    onEditPost() {

    },
    onToggleComment() {
      if(!this.commentOpened) {
        this.$store.dispatch('posts/loadComments', {
          postId: this.post.id,
        });
      }
      this.commentOpened= !this.commentOpened;
    },
    onRetweet() {
      if (!this.me) {
        return alert('Login is required.');
      }
      this.$store.dispatch('posts/retweet', {
        postId: this.post.id,
      })
    },
    onClickHeart() {
      if(!this.me) {
        return alert("You need to login");
      }
      if(this.liked) {
        return this.$store.dispatch('posts/unlikePost', {
          postId: this.post.id,
        });
      }
      return this.$store.dispatch('posts/likePost', {
        postId: this.post.id,
      })
    }
  },
}
</script>
<style scoped>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>