<template>
    <div class="nav-button-group ">
      <el-button v-for="(tab, index) in tabs" :key="index" :class="{
        'active': modelValue === tab.name,
        'is-disabled': tab.disabled
      }" @click="!tab.disabled && handleTabClick(tab.name)">
        {{ tab.label }}
      </el-button>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useSlots, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  // 是否启用懒加载
  lazy: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'tab-click', 'tab-close'])

const slots = useSlots()
const tabs = ref<Array<{
  label: string
  name: string | number
  disabled?: boolean
  closable?: boolean
  loaded?: boolean
}>>([])

// 获取所有 TabPane 实例
function updateTabs () {
  if (slots.default) {
    const children = slots.default()
    console.log('children', children)
    tabs.value = children
      .filter(child => child.type && (child.type as any).__name === 'TabPane')
      .map(child => ({
        label: child.props?.label || '',
        name: child.props?.name ?? '',
        disabled: child.props?.disabled || false,
        closable: child.props?.closable || false,
        loaded: !props.lazy // 如果非懒加载模式，默认已经加载
      }))
      console.log('更新标签:', tabs.value)
  }
}

// 计算活动指示条样式
const activeBarStyle = computed(() => {
  const activeIndex = tabs.value.findIndex(tab => tab.name === props.modelValue)
  return {
    width: `${100 / tabs.value.length}%`,
    transform: `translateX(${activeIndex * 100}%)`
  }
})

// 处理标签点击
function handleTabClick (name: string | number) {
  const tab = tabs.value.find(tab => tab.name === name)
  if (tab && !tab.disabled) {
    emit('update:modelValue', name)
    emit('tab-click', name)

    // 懒加载处理
    if (props.lazy && !tab.loaded) {
      tab.loaded = true
    }
  }
}

// 处理标签关闭
function handleTabClose (name: string | number) {
  emit('tab-close', name)
}

// 监听插槽变化
watch(slots, updateTabs, { immediate: true, deep: true })

// 提供上下文给 TabPane
provide('tabs', {
  activeName: computed(() => props.modelValue),
  lazy: computed(() => props.lazy)
})
</script>

<style lang="scss" scoped>
.tabs-content {
  padding: 15px 0;
}
.nav-button-group {
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #dcdfe6;
}

.nav-button-group .el-button {
  border-radius: 0;
  border: none;
  margin: 0;
  background: #fff;
  color: #333;
  transition: all 0.3s;
}

.nav-button-group .el-button:hover {
  color: #409eff;
  background: #f5f7fa;
}

.nav-button-group .el-button.active {
  background: #f5f7fa;
  color: #409eff;
  font-weight: bold;
}
.nav-button-group .el-button.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

/* 移除相邻按钮间的边框 */
.nav-button-group .el-button + .el-button {
  border-left: 1px solid #dcdfe6;
}
</style>