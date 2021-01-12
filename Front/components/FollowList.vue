<template>
  <v-list>
    <v-list-item v-for="f in follow" :key="f.id">
      <span>{{ f.name }}</span>
      <v-icon @click="remove(f.id)">mdi-minus-circle-outline</v-icon>
    </v-list-item>
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