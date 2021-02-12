<template>
  <v-container v-if="!me">
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
        <v-container>
          <v-text-field v-model="email" label="email" type="email" :rules= "emailRules" required />
          <v-text-field v-model="password" label="password" type="password" :rules= "passwordRules" required />
          <v-btn color="green" type="submit" :disabled="!valid">login</v-btn>
          <v-btn nuxt to="/signup">signup</v-btn>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-card>
      <v-container>
        {{me.nickname}}, you are logged in
        <v-btn @click="onLogOut">Logout</v-btn>
        <v-row>
          <v-col col="4">{{me.Followings.length}} Following</v-col>
          <v-col col="4">{{me.Followers.length}} Follower</v-col>
        </v-row>
        <v-row>
          <v-col col="4">{{me.Posts.length}} Post</v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      emailRules: [
        v => !!v || "email is required",
        v => /.+@.+/.test(v) || "email is not valid"
      ],
      passwordRules: [
        v => !!v || "password is required",
      ],
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  methods : {
    onSubmitForm() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('users/logIn', {
          email: this.email,
          password: this.password,
        });
        this.email="",
        this.password=""
      }
    },
    onLogOut() {
      this.$store.dispatch('users/logOut');
    }
  }
}
</script>
<style scoped>

</style>