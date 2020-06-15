<template lang="pug">
  div.tags-block
    span.tag(v-for="tag in tags" :key="tag") {{ tag }}
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      default: [],
    },
  },
};
</script>
<style lang="scss" scoped>
$main-color: #007f80;

* {
  box-sizing: border-box;
}
.tags-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .tag {
    background: rgba($main-color, 0.08);
    color: $main-color;
    border: 1px solid $main-color;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
    margin-top: 2px;
    margin-bottom: 2px;
  }
  & > .tag:not(:last-child) {
    margin-right: 5px;
  }
}
</style>