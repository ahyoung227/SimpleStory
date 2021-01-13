<template>
  <v-list>
    <v-col v-for="f in follow" :key="f.id" cols="12" md="4" style="display: inline-block">
      <v-list-item>
        <v-list-item-avatar color="indigo">
          <span class="white--text headline">{{ f.nickname[0] }}</span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ f.nickname }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon @click="remove(f.id)">mdi-minus-circle-outline</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-col>
  </v-list>
</template>

<script>

export default {
  props: {
    follow: {
      type: Array,
      required: true
    },
    remove: {
      type: Function,
      required: true
    },
  },
};

</script>

<style>
</style>