<template>
  <div>
    <v-container>
      <v-subheader>Signup</v-subheader>
      <v-card>
        <v-container>
          <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
            <v-text-field
              v-model= "email"
              label="email"
              type="email"
              :rules= "emailRules"
              required
            />
            <v-text-field
              v-model= "password"
              label="password"
              type="password"
              :rules= "passwordRules"
              required
            />
            <v-text-field
              v-model="passwordcheck"
              label="passwordcheck"
              type="password"
              :rules= "passwordcheckRules"
              required
            />
            <v-text-field
              v-model="nickname"
              label="nickname"
              type="nickname"
              :rules= "nicknameRules"
              required
            />
            <v-checkbox
              v-model="terms"
              required
              :rules= "[v=> !!v || 'You have to agree with terms']"
              label="I agree with all above info."
            />
            <v-btn color="green" type="submit">submit</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      passwordcheck: "",
      nickname: "",
      terms:  "",
      emailRules: [
        v => !!v || "email is required",
        v => /.+@.+/.test(v) || "email is not valid"
      ],
      nicknameRules: [
        v => !!v || "nickname is required",
      ],
      passwordRules: [
        v => !!v || "password is required",
      ],
      passwordcheckRules: [
        v => !!v || "password check is required",
        v => v === this.password || "password does not match",
      ],
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    }
  },
  watch: {
    me(value) {
      if(value) {
        this.$router.push({
          path: '/',
        });
      }
    }
  },
  methods: {
    async onSubmitForm() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('users/signUp', {
            email: this.email,
            nickname: this.nickname,
            password: this.password
          })
          .then(()=> {
            this.$router.push({
              path: '/'
            });
          })
          .catch(() => {
            alert("request failed")
          });
      }
    }
  },
  head: {
    title: 'signup'
  },
  middleware: 'anonymous',
}
</script>

<style>

</style>