<template>
    <v-card>
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea 
                    outlined
                    auto-grow
                    clearable
                    label="What happened today?"
                    v-model="content"
                    :hide-details="hideDetails"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="[v => !!v || 'Enter the contents']"
                    @input="onChangeTextArea"
                />
                <v-btn type="submit" color="green" absolute right>Post</v-btn>
                <v-btn>image upload</v-btn>
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
      ...mapState('users', ['me'])
    },
    methods: {
        onChangeTextArea() {
            this.hideDetails = true;
            this.success = false;
            this.successMessages = '';
        },
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('posts/add', {
                  content: this.content,
                  user: {
                    nickname: this.me.nickname,
                  },
                  comments: [],
                  images: [],
                  id: Date.now(),
                  createdAt: Date.now(),
                })
              .then(() => {
                this.content = "";
                this.hideDetails = false;
                this.success = true;
                this.successMessages = 'It is successfully posted'
              })
              .catch(()=> {

              })
            }
        },
    }
}
</script>

<style>

</style>