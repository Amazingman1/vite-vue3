<template>
  <div
    class="tree-node"
    :class="{
      'tree-node--expanded': isExpanded,
      'tree-node--selected': isSelected,
      'tree-node--disabled': node.disabled,
      'tree-node--dragging': isDragging,
      'tree-node--drop-inner': dropPosition === 'inner',
      'tree-node--drop-before': dropPosition === 'before',
      'tree-node--drop-after': dropPosition === 'after'
    }"
    :style="{ paddingLeft: `${level * 24}px` }"
    @click="handleNodeClick"
    @contextmenu="handleContextMenu"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragleave="handleDragLeave"
    :draggable="tree.draggable && !node.disabled"
  >
    <!-- 展开/折叠图标 -->
    <span
      v-if="hasChildren"
      class="tree-node__expand"
      :class="{ 'tree-node__expand--expanded': isExpanded }"
      @click.stop="handleExpandClick"
    >
      <svg class="tree-node__expand-icon" viewBox="0 0 24 24">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      </svg>
    </span>
    <span v-else class="tree-node__expand tree-node__expand--leaf"></span>

    <!-- 复选框 -->
    <span
      v-if="tree.showCheckbox"
      class="tree-node__checkbox"
      :class="{
        'tree-node__checkbox--checked': isChecked,
        'tree-node__checkbox--indeterminate': isIndeterminate
      }"
      @click.stop="handleCheckboxClick"
    >
      <svg v-if="isIndeterminate" class="tree-node__checkbox-icon" viewBox="0 0 24 24">
        <path d="M19 13H5v-2h14v2z"/>
      </svg>
      <svg v-else-if="isChecked" class="tree-node__checkbox-icon" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </span>

    <!-- 连接线
    <div v-if="tree.showLine" class="tree-node__line">
      <div class="tree-node__line-vertical"></div>
      <div class="tree-node__line-horizontal"></div>
    </div> -->

    <!-- 图标 -->
    <span class="tree-node__icon">
      <slot name="icon" :node="node" :expanded="isExpanded">
        <svg v-if="hasChildren" class="tree-node__default-icon" viewBox="0 0 24 24">
          <path v-if="isExpanded" fill="#ffd700" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
          <path v-else fill="#ffb74d" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
        </svg>
        <svg v-else class="tree-node__default-icon" viewBox="0 0 24 24">
          <path fill="#64b5f6" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </slot>
    </span>

    <!-- 节点内容 -->
    <span class="tree-node__label">
      <slot name="default" :node="curreyNode">
        <div>
          <el-input v-model="curreyNode.label" />
        </div>
        <!-- {{ node.label }} -->
      </slot>
    </span>

    <!-- 加载状态 -->
    <span v-if="node.loading" class="tree-node__loading">
      <svg class="tree-node__loading-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    </span>
  </div>

  <!-- 子节点 -->
  <div
    v-if="hasChildren && isExpanded"
    class="tree-node__children"
    :class="{ 'tree-node__children--show-line': tree.showLine }"
  >
    <TreeNode
      v-for="(child, index) in curreyNode.children"
      :key="child[tree.nodeKey]"
      v-model:node="curreyNode.children[index]"
      :tree="tree"
      :level="level + 1"
      @node-click="$emit('node-click', $event)"
      @node-expand="$emit('node-expand', $event)"
      @node-collapse="$emit('node-collapse', $event)"
      @node-check="$emit('node-check', $event)"
      @node-drag="$emit('node-drag', $event)"
      @node-drop="$emit('node-drop', $event)"
      @node-context-menu="$emit('node-context-menu', $event)"
    >
      <template #icon="{ node, expanded }">
        <slot name="icon" :node="node" :expanded="expanded"></slot>
      </template>
      <template #default="{ node }">
        <slot name="default" :node="node"></slot>
      </template>
    </TreeNode>
  </div>
</template>

<script setup>
import { computed, ref, inject } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  tree: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'node-click',
  'node-expand', 
  'node-collapse',
  'node-check',
  'node-drag',
  'node-drop',
  'node-context-menu',
  'update:node'

])
const curreyNode = computed({
  get() {
    return props.node
  },
  set(val) {
    emit('update:node', val)
  }
})

const isDragging = ref(false)
const dropPosition = ref(null)

// 计算属性
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

const isExpanded = computed(() => {
  return props.node.expanded
})

const isSelected = computed(() => {
  return props.tree.selectedKeys.includes(props.node[props.tree.nodeKey])
})

const isChecked = computed(() => {
  return props.tree.checkedKeys.includes(props.node[props.tree.nodeKey])
})

const isIndeterminate = computed(() => {
  return props.tree.indeterminateKeys.includes(props.node[props.tree.nodeKey])
})

// 事件处理
const handleNodeClick = (event) => {
  if (props.node.disabled) return
  emit('node-click', { node: props.node, event })
}

const handleExpandClick = () => {
  if (props.node.disabled) return
  
  if (isExpanded.value) {
    emit('node-collapse', props.node)
  } else {
    emit('node-expand', props.node)
  }
}

const handleCheckboxClick = () => {
  if (props.node.disabled) return
  emit('node-check', { node: props.node, checked: !isChecked.value })
}

const handleContextMenu = (event) => {
  event.preventDefault()
  emit('node-context-menu', { node: props.node, event })
}

// 拖拽处理
const handleDragStart = (event) => {
  if (props.node.disabled) return
  isDragging.value = true
  event.dataTransfer.setData('text/plain', props.node[props.tree.nodeKey])
  emit('node-drag', { node: props.node, event })
}

const handleDragOver = (event) => {
  event.preventDefault()
  const rect = event.currentTarget.getBoundingClientRect()
  const y = event.clientY - rect.top
  const height = rect.height
  
  if (y < height * 0.25) {
    dropPosition.value = 'before'
  } else if (y > height * 0.75) {
    dropPosition.value = 'after'
  } else {
    dropPosition.value = 'inner'
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  const dragKey = event.dataTransfer.getData('text/plain')
  emit('node-drop', {
    dragNode: dragKey,
    dropNode: props.node,
    position: dropPosition.value,
    event
  })
  dropPosition.value = null
}

const handleDragLeave = () => {
  dropPosition.value = null
}
</script>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 2px 0;
  min-height: 44px;
}

.tree-node:hover {
  background-color: #f5f7fa;
}

.tree-node--selected {
  background-color: #409eff;
  color: white;
}

.tree-node--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tree-node--dragging {
  opacity: 0.5;
}

.tree-node--drop-inner {
  background-color: #e1f3d8;
}

.tree-node--drop-before::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #409eff;
}

.tree-node--drop-after::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #409eff;
}

.tree-node__expand {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tree-node__expand:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.tree-node__expand--expanded {
  transform: rotate(90deg);
}

.tree-node__expand--leaf {
  cursor: default;
}

.tree-node__expand-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.tree-node__checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tree-node__checkbox--checked {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.tree-node__checkbox--indeterminate {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
}

.tree-node__checkbox-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.tree-node__line {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
}

.tree-node__line-vertical {
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #dcdfe6;
}

.tree-node__line-horizontal {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 12px;
  height: 1px;
  background-color: #dcdfe6;
}

.tree-node__icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-node__default-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  opacity: 0.8;
}

.tree-node__label {
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  word-break: break-all;
  font-weight: 500;
}

.tree-node__loading {
  width: 20px;
  height: 20px;
  margin-left: 12px;
}

.tree-node__loading-icon {
  width: 20px;
  height: 20px;
  color: #409eff;
}

.tree-node__children {
  position: relative;
}

.tree-node__children--show-line::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #dcdfe6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tree-node {
    padding: 12px 16px;
    margin: 3px 0;
    min-height: 56px;
  }
  
  .tree-node__expand {
    width: 28px;
    height: 28px;
    margin-right: 12px;
  }
  
  .tree-node__expand-icon {
    width: 18px;
    height: 18px;
  }
  
  .tree-node__checkbox {
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
  
  .tree-node__checkbox-icon {
    width: 16px;
    height: 16px;
  }
  
  .tree-node__icon {
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
  
  .tree-node__default-icon {
    width: 24px;
    height: 24px;
  }
  
  .tree-node__label {
    font-size: 18px;
  }
  
  .tree-node__loading {
    width: 24px;
    height: 24px;
  }
  
  .tree-node__loading-icon {
    width: 24px;
    height: 24px;
  }
}
</style>