<template>
  <v-form ref="form" v-model="valid" style="position: relative" @submit.prevent="onSubmitForm">
    <v-textarea
      v-model="content"
      filled
      auto-grow
      lable="add comment"
      :hide-detail="hideDetails"
      :success="success"
      :success-messages="successMessages"
      @input="onChangeTextArea"
    />
  <v-btn color="green" dark absolute top right type="submit">comment</v-btn>
  </v-form>
</template>

<script>
  export default {
    props: {
      postId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        valid: false,
        content: '',
        success: false,
        successMessages: '',
        hideDetails: true
      }
    },
    computed: {
      me() {
        return this.$store.state.users.me;
      }
    },
    methods: {
      onChangeTextArea(value) {
        if (value.length) {
          this.hideDetails = true;
          this.success = false;
          this.successMessages = '';
        }
      },
      onSubmitForm() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('posts/addComment', {
            postId: this.postId,
            content: this.content,
          })
          .then(()=> {
            this.content = '';
            this.success = true;
            this.successMessages = "Comment is posted";
            this.hideDetails = false;
          })
          .catch((err)=> {
            console.log(err);
          })
        }
      }
    }
  }
</script>

<style>

</style>