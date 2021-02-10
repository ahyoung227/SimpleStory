<template>
  <v-app>
    <div>
      <v-toolbar color="yellowgreen">
        <v-toolbar-title>
          <nuxt-link to="/">Simple</nuxt-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-form @submit.prevent="onSearchHashTag">
            <div :style="{ display:'flex', height: '100%', alignItem: 'center' }">
              <v-text-field
                lable="search"
                v-model="hashtag"
                hide-details
                prepend-icon="mdi-magnify"
                :style="{ display: 'flex', alignItems: 'center' }"/>
            </div>
          </v-form>
          <v-btn text nuxt to="/profile" >
            <div>Profile</div>
          </v-btn>
          <v-btn v-if="me" text @click="onLogOut">
            <div>logout</div>
          </v-btn>
          <v-btn v-else text nuxt to="/signup">
            <div>Signup</div>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
    <v-row no-gutters>
      <v-col cols="12" xs="12" md ="4">
        <login-form/>
      </v-col>
      <v-col cols="12" xs="12" md ="8">
        <nuxt />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import LoginForm from '~/components/LoginForm';
export default {
  data() {
    return {
      hashtag: "",
    }
  },
  components: {
    LoginForm,
  },
  computed: {
    name() {
      return this.$store.state.posts.name;
    },
    me() {
      return this.$store.state.users.me;
    }
  },
  methods: {
    onSearchHashTag() {
      this.$router.push({
        path: `/hashtag/${this.hashtag}`
      })
      this.hashtag = '';
    },
    onLogOut() {
      this.$store.dispatch('users/logOut');
    }
  }
}
</script>

<style>

</style>