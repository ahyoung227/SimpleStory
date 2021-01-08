<template>
  <v-container v-if="!me">
    <v-card>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmitForm">
        <v-container>
          <v-text-field label="email" type="email" :rules= "emailRules" required />
          <v-text-field label="password" type="password" :rules= "passwordRules" required />
          <v-btn color="green" type="submit" :disabled="!valid">login</v-btn>
          <v-btn nuxt to="/signup">signup</v-btn>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-card>
      {{me.nickname}}, you are logged in
      <v-btn @click="onlogOut">Logout</v-btn>
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
          nickname: "ahyoung",
        })
      }
    },
    onlogOut() {
      this.$store.dispatch('users/logOut');
    }
  }
}
</script>
<style scoped>

</style>