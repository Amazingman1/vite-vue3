<template>
  <div class="button-group">
    <el-button
      v-for="(button, index) in buttons"
      :key="index"
      type="primary"
      :icon="button.icon"
      :disabled="button.disabled"
      @click="button.onClick"
    >
      {{ button.label }}
    </el-button>
    <div v-if="showEditingTip">
      <el-tag>正在编辑：{{ editingUser }}</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: "ButtonGroup",
  props: {
    buttons: {
      type: Array,
      default: () => [],
    },
    showEditingTip: {
      type: Boolean,
      default: false,
    },
    editingUser: {
      type: String,
      default: '',
    }
  },
};
</script>

<style lang="scss" scoped>
.button-group {
  display: inline-flex;
  vertical-align: middle;
}
</style>