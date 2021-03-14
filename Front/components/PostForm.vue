<template>
  <v-card>
    <v-container>
      <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
        <v-textarea
          outlined
          auto-grow
          clearable
          v-model="content"
          label="What happened today?"
          :hide-details="hideDetails"
          :success-messages="successMessages"
          :success="success"
          :rules="[v => !!v || 'Enter the contents']"
          @input="onChangeTextArea"
        />
        <v-btn type="submit" color="green" absolute right>Post</v-btn>
        <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
        <v-btn @click="onClickImageUpload" type="button">image upload</v-btn>
          <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block">
            <img :src="p" alt="p" style="width: 200px;">
            <div>
              <button @click="onRemoveImage(i)" type="button">remove</button>
            </div>
          </div>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            valid: false,
            hideDetails: false,
            successMessages: '',
            success: false,
            content : ""
        }
    },
    computed: {
      ...mapState('users', ['me']),
      ...mapState('posts', ['imagePaths'])
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
                this.$store.dispatch('posts/add', {
                  content: this.content,
                })
              .then(() => {
                this.content = "";
                this.hideDetails = false;
                this.success = true;
                this.successMessages = 'It is successfully posted'
              })
              .catch(()=> {

              });
            }
          },
        onClickImageUpload() {
          this.$refs.imageInput.click();
        },
        onChangeImages(e) {
          console.log(e.target.files);
          const imageFormData = new FormData();
          [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f)
          });
          this.$store.dispatch('posts/uploadImages', imageFormData);
      },
      onRemoveImage(index) {
          this.$store.commit('posts/removeImagePath', index)
      }
    },
};
</script>

<style>

</style>