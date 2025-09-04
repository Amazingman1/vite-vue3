<template>
  <div class="custom-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue'

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

const props = withDefaults(defineProps<{
  modelValue?: number | (string |number)[] | string
  accordion?: boolean
}>(), {
  modelValue: () => [],
  accordion: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | (string | number)[]| string): void
}>()

const items = ref<Array<CollapseItem>>([])
const activeItems = ref<(string | number)[]>([])

// 处理初始值
if (props.modelValue !== undefined) {
  if (props.accordion && (typeof props.modelValue === 'number' || typeof props.modelValue === 'string')) {
    activeItems.value = [props.modelValue]
  } else if (Array.isArray(props.modelValue)) {
    activeItems.value = [...props.modelValue]
  }
}

// 提供方法给子组件
provide<CollapseProvider>('collapse', {
  registerItem: (item: CollapseItem) => {
    const index = items.value.length
    item.index = index
    items.value.push(item)
    
    // 设置初始状态
    if (activeItems.value.includes(index)) {
      item.toggle(true)
    }
    
    return index
  },
  unregisterItem: (index: number) => {
    items.value = items.value.filter(item => item.index !== index)
  },
  toggleItem: (index: number) => {
    if (props.accordion) {
      // 手风琴模式
      if (activeItems.value[0] === index) {
        activeItems.value = []
        items.value[index].toggle(false)
      } else {
        // 关闭之前打开的项
        if (activeItems.value.length > 0) {
          if (typeof activeItems.value[0] === 'number' && items.value[activeItems.value[0]]) {
            items.value[activeItems.value[0]].toggle(false)
          }
        }
        activeItems.value = [index]
        items.value[index].toggle(true)
      }
    } else {
      // 多开模式
      const itemIndex = activeItems.value.indexOf(index)
      if (itemIndex > -1) {
        activeItems.value.splice(itemIndex, 1)
        items.value[index].toggle(false)
      } else {
        activeItems.value.push(index)
        items.value[index].toggle(true)
      }
    }
    
    // 发射更新事件
    emit('update:modelValue', props.accordion ? 
      (activeItems.value.length > 0 ? activeItems.value[0] : []) : 
      [...activeItems.value])
  },
  isItemActive: (index: number) => activeItems.value.includes(index)
})

// 监听外部modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (props.accordion) {
    const newIndex = (typeof newValue === 'number' || typeof newValue === 'string') ? newValue : -1
    const currentIndex = activeItems.value.length > 0 ? activeItems.value[0] : -1

    if (newIndex !== currentIndex) {
      // 关闭当前项
      if (typeof currentIndex !== 'undefined' && items.value.find(i => i.index === currentIndex)) {
        const idx = items.value.findIndex(i => i.index === currentIndex)
        if (idx !== -1) items.value[idx].toggle(false)
      }
      // 打开新项
      const idx = items.value.findIndex(i => i.index === newIndex)
      if (idx !== -1) {
        items.value[idx].toggle(true)
        activeItems.value = [newIndex]
      } else {
        activeItems.value = []
      }
    }
  } else if (Array.isArray(newValue)) {
    // 多开模式
    const toClose = activeItems.value.filter(index => !newValue.includes(index))
    const toOpen = newValue.filter(index => !activeItems.value.includes(index))

    toClose.forEach((idx: string | number) => {
      const i = items.value.findIndex(item => item.index === idx)
      if (i !== -1) items.value[i].toggle(false)
    })

    toOpen.forEach((idx: string | number) => {
      const i = items.value.findIndex(item => item.index === idx)
      if (i !== -1) items.value[i].toggle(true)
    })

    activeItems.value = [...newValue]
  }
})
</script>

<style scoped>
.custom-collapse {
  border-radius: 6px;
  border: 1px solid #e6e8f0;
  overflow: hidden;
}
</style>