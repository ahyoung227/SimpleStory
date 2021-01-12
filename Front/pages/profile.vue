<template>
  <div>
    <v-container>
      <v-card style="margin-bottom: 20px" >
        <v-container>
          <v-subheader>My profile</v-subheader>
          <v-form v-model="valid" @submit.prevent="onChangeNickname">
            <v-text-field
              v-model="nickname"
              label="nickname"
              :rules="nicknameRules"
              required
            />
            <v-btn color="blue" type="submit">edit</v-btn>
          </v-form>
        </v-container>
      </v-card>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>following</v-subheader>
          <follow-list :follow="followers" :remove="deleteFollowers"/>
        </v-container>
      </v-card>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>follower</v-subheader>
          <follow-list :follow="followings" :remove="deleteFollowings"/>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>
ouy]
<script>
import FollowList from '~/components/FollowList';

export default {
  components: {
    FollowList,
  },
  data() {
    return {
      valid: false,
      nickname: '',
      nicknameRules: [
        v => !!v || 'Enter your nickname.',
      ],
    };
  },
  computed: {
    followers() {
      return this.$store.state.users.followers
    },
    followings() {
      return this.$store.state.users.followings
    }
  },
  methods: {
    onChangeNickname() {
      this.$store.dispatch('users/changeNickname', {
        nickname: this.nickname,
      })
    },
    addFollowers() {
      this.$store.dispatch('users/addFollowers', {
      })
    },
    deleteFollowers(id) {
      this.$store.dispatch('users/deleteFollowers', {
        userId: id
      })
    },
    addFollowings() {
      this.$store.dispatch('users/addFollowings', {

      })
    },
    deleteFollowings(id) {
      this.$store.dispatch('users/deleteFollowings', {
        userId: id
      })
    }
  },
  head() {
    return {
      title: 'Profile',
    };
  },
};
</script>

<style>
</style>