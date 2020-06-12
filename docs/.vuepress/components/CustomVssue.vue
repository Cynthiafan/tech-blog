<template lang="pug">
  Vssue(:title="title")
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
.vssue {
  margin-top: 60px;
  /deep/ &-new-comment-input {
    background-color: #fff !important;
    &:focus {
      border-color: #007f80 !important;
      box-shadow: none !important;
    }
  }
  /deep/ &-pagination-select {
    border: 1px solid gray !important;
    border-radius: 6px;
    padding: 2px 18px 2px 6px !important;
    &:focus {
      box-shadow: none !important;
    }
  }
  /deep/ &-comment-edit-mode .vssue-comment-main {
    border-color: #007f80 !important;
    box-shadow: none !important;
  }
}
</style>