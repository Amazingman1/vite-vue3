<template>
  <div v-show="shouldRender" class="custom-tab-pane">
    <slot v-if="shouldMount"></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  name: {
    type: [String, Number],
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  // 强制提前加载（覆盖 lazy 设置）
  forceRender: {
    type: Boolean,
    default: false
  }
})

const tabsContext = inject('tabs', {
  activeName: computed(() => ''),
  lazy: computed(() => false)
})

const isActive = computed(() => tabsContext.activeName.value === props.name)
const shouldRender = computed(() => isActive.value || props.forceRender)
const shouldMount = computed(() => {
  // 如果强制渲染或非懒加载模式，直接渲染
  if (props.forceRender || !tabsContext.lazy.value) return true
  // 懒加载模式下，只有激活时才渲染
  return isActive.value
})
</script>

<style scoped>
.custom-tab-pane {
  width: 100%;
}
</style>