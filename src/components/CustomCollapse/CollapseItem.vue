<template>
  <div class="collapse-item" :class="{ 'is-active': isActive }">
    <div class="item-header" @click="handleClick">
      <div class="item-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="item-icon" :class="{ active: isActive }">❯</div>
    </div>
    <div class="item-content" ref="contentRef">
      <div class="content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject} from 'vue'

interface CollapseItem {
  toggle: (expanded: boolean) => void
  index: number
}

interface CollapseProvider {
  registerItem: (item: CollapseItem) => number
  unregisterItem: (index: number) => void
  toggleItem: (index: number) => void
  isItemActive: (index: number) => boolean
}

withDefaults(defineProps<{
  title?: string
  name?: string | number
}>(), {
  title: '',
  name: ''
})

const contentRef = ref<HTMLElement | null>(null)
const isActive = ref(false)
const index = ref(-1)

const collapse = inject<CollapseProvider>('collapse')

if (collapse) {
  index.value = collapse.registerItem({
    toggle: (expanded: boolean) => {
      isActive.value = expanded
      if (contentRef.value) {
        contentRef.value.style.height = expanded 
          ? `${contentRef.value.scrollHeight}px` 
          : '0px'
      }
    },
    index: index.value
  })
  
  isActive.value = collapse.isItemActive(index.value)
}

const handleClick = () => {
  if (collapse) {
    collapse.toggleItem(index.value)
  }
}

onMounted(() => {
  if (contentRef.value) {
    contentRef.value.style.height = isActive.value 
      ? `${contentRef.value.scrollHeight}px` 
      : '0px'
  }
})

onUnmounted(() => {
  if (collapse && index.value >= 0) {
    collapse.unregisterItem(index.value)
  }
})
</script>

<style scoped>
.collapse-item {
  border-bottom: 1px solid #e6e8f0;
}

.collapse-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #f9fafc;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
}

.item-header:hover {
  background: #f0f3f9;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.item-icon {
  transition: transform 0.3s;
  color: #909399;
}

.item-icon.active {
  transform: rotate(90deg);
}

.item-content {
  overflow: hidden;
  transition: height 0.3s;
  background: white;
  height: 0;
}

.content-inner {
  padding: 20px;
  color: #606266;
  line-height: 1.7;
}
</style>