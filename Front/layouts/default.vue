<template>
  <v-app>
    <div>
      <v-toolbar color="yellowgreen">
        <v-toolbar-title>
          <nuxt-link to="/">Simple</nuxt-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-text-field label="search" hide-details prepend-icon="mdi-magnify" :style="{ display: 'flex', alignItems: 'center' }" />
          <v-btn text nuxt to="/profile">
            <div>Profile</div>
          </v-btn>
          <v-btn text nuxt to="/signup">
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
  components: {
    LoginForm,
  },
  computed: {
    name() {
      return this.$store.state.posts.name;
    }
  },
  methods: {

  }
}
</script>

<style>

</style>