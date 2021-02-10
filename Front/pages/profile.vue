<template>
  <div>
    <v-container>
      <v-card style="margin-bottom: 20px">
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
          <v-subheader>follower</v-subheader>
          <follow-list :follow="followers" :remove="deleteFollowers"/>
          <v-btn dark v-if="hasMoreFollowers" @click="loadMoreFollowers">More</v-btn>
        </v-container>
      </v-card>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>following</v-subheader>
          <follow-list :follow="followings" :remove="deleteFollowings"/>
          <v-btn dark v-if="hasMoreFollowings" @click="loadMoreFollowings">More</v-btn>
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
      return this.$store.state.users.followerList;
    },
    followings() {
      return this.$store.state.users.followingList;
    },
    hasMoreFollowers() {
      return this.$store.state.users.hasMoreFollowers;
    },
    hasMoreFollowings() {
      return this.$store.state.users.hasMoreFollowings;
    }
  },
  fetch( { store } ) {
    return store.dispatch('users/loadFollowers', { offset:0 });
    return store.dispatch('users/loadFollowings', { offset:0 })
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
    deleteFollowers(userId) {
      this.$store.dispatch('users/removeFollower', {
         userId
      })
    },
    addFollowings() {
      this.$store.dispatch('users/addFollowings', {

      })
    },
    deleteFollowings(userId) {
      this.$store.dispatch('users/unfollow', {
        userId
      })
    },
    loadMoreFollowers() {
      this.$store.dispatch('users/loadFollowers')
    },
    loadMoreFollowings() {
      this.$store.dispatch('users/loadFollowings')
    }
  },
  head() {
    return {
      title: 'Profile',
    };
  },
  middleware: "authenticated"
};
</script>

<style>
</style>