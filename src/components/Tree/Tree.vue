<template>
  <div class="tree" :class="{ 'tree--mobile': isMobile }">

    <div class="tree__nodes">
      <TreeNode
        v-for="(node, index) in visibleNodes"
        :key="node[nodeKey]"
        v-model:node="visibleNodes[index]"
        :tree="treeState"
        :level="0"
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
        @node-check="handleNodeCheck"
        @node-drag="handleNodeDrag"
        @node-drop="handleNodeDrop"
        @node-context-menu="handleNodeContextMenu"
      >
        <template #icon="{ node, expanded }">
          <slot name="icon" :node="node" :expanded="expanded"></slot>
        </template>
        <template #default="{ node }">
          <slot name="default" :node="node"></slot>
        </template>
      </TreeNode>
    </div>
  </div>

  <!-- 上下文菜单 -->
  <div v-if="contextMenuVisible" class="tree__context-menu" :style="contextMenuStyle" ref="contextMenuRef">
    <slot name="context-menu" :node="contextMenuNode">
      <div class="tree__context-menu-item" @click="handleContextMenuAction('expand')">展开</div>
      <div class="tree__context-menu-item" @click="handleContextMenuAction('collapse')">折叠</div>
      <div class="tree__context-menu-item" @click="handleContextMenuAction('delete')">删除</div>
    </slot>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from "vue"
import TreeNode from "./TreeNode.vue"

const props = defineProps({
  // 树形数据
  data: {
    type: Array,
    default: () => []
  },
  // 节点唯一标识
  nodeKey: {
    type: String,
    default: "id"
  },
  // 是否显示复选框
  showCheckbox: {
    type: Boolean,
    default: false
  },
  // 是否显示连接线
  showLine: {
    type: Boolean,
    default: false
  },
  // 是否可拖拽
  draggable: {
    type: Boolean,
    default: false
  },
  // 是否可过滤
  filterable: {
    type: Boolean,
    default: false
  },
  // 过滤占位符
  filterPlaceholder: {
    type: String,
    default: "请输入关键字进行过滤"
  },
  // 空数据文本
  emptyText: {
    type: String,
    default: "暂无数据"
  },
  // 默认展开的节点
  defaultExpandedKeys: {
    type: Array,
    default: () => []
  },
  // 默认选中的节点
  defaultSelectedKeys: {
    type: Array,
    default: () => []
  },
  // 默认勾选的节点
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  },
  // 是否默认展开所有节点
  defaultExpandAll: {
    type: Boolean,
    default: false
  },
  // 是否高亮当前选中节点
  highlightCurrent: {
    type: Boolean,
    default: false
  },
  // 展开时是否只保持一个子菜单的展开
  accordion: {
    type: Boolean,
    default: false
  },
  // 是否严格的遵循父子不互相关联的做法
  checkStrictly: {
    type: Boolean,
    default: false
  },
  // 懒加载
  lazy: {
    type: Boolean,
    default: false
  },
  // 懒加载方法
  load: {
    type: Function,
    default: null
  },
  // 过滤方法
  filterNodeMethod: {
    type: Function,
    default: null
  }
})

const emit = defineEmits([
  "node-click",
  "node-expand",
  "node-collapse",
  "check-change",
  "current-change",
  "node-drag-start",
  "node-drag-enter",
  "node-drag-leave",
  "node-drag-over",
  "node-drag-end",
  "node-drop",
  "node-context-menu",
  "update:data",
  "initialize"
])

// 响应式状态
const filterText = ref("")
const contextMenuVisible = ref(false)
const contextMenuNode = ref(null)
const contextMenuStyle = ref({})
const treeContentRef = ref(null)
const contextMenuRef = ref(null)
const isMobile = ref(false)

// 树状态 - 使用响应式对象，确保props变化时能正确更新
const treeState = reactive({
  nodeKey: computed(() => props.nodeKey),
  showCheckbox: computed(() => props.showCheckbox),
  showLine: computed(() => props.showLine),
  draggable: computed(() => props.draggable),
  selectedKeys: [...props.defaultSelectedKeys],
  checkedKeys: [...props.defaultCheckedKeys],
  indeterminateKeys: [],
  expandedKeys: [...props.defaultExpandedKeys]
})

// 处理后的树数据
const processedData = ref([])
const flattenNodes = ref(new Map())

// 计算属性
const isEmpty = computed(() => {
  return processedData.value.length === 0
})

const visibleNodes = computed(() => {
  if (!filterText.value) {
    return processedData.value
  }

  return filterNodes(processedData.value, filterText.value)
})

const curreyData = computed({
  get() {
    return props.data
  },
  set(value) {
    emit("update:data", value)
  }
})
// 初始化数据
const initializeData = () => {
  processedData.value = processTreeData(curreyData.value)
  emit("initialize", processedData.value)
  buildFlattenNodes(processedData.value)

  if (props.defaultExpandAll) {
    expandAllNodes()
  }

  updateCheckedState()
}

// 处理树数据
const processTreeData = (data, parent = null) => {
  return data.map((item) => {
    const node = {
      ...item,
      parent,
      expanded: props.defaultExpandAll || props.defaultExpandedKeys.includes(item[props.nodeKey]),
      loading: false,
      visible: true
    }

    if (item.children && item.children.length > 0) {
      node.children = processTreeData(item.children, node)
    } else if (props.lazy && !item.isLeaf) {
      node.children = []
    }

    return node
  })
}

// 构建扁平化节点映射
const buildFlattenNodes = (nodes) => {
  flattenNodes.value.clear()

  const traverse = (nodes) => {
    nodes.forEach((node) => {
      flattenNodes.value.set(node[props.nodeKey], node)
      if (node.children) {
        traverse(node.children)
      }
    })
  }

  traverse(nodes)
}

// 过滤节点
const filterNodes = (nodes, text) => {
  const result = []

  for (const node of nodes) {
    const matched = props.filterNodeMethod ? props.filterNodeMethod(text, node) : node.label.includes(text)

    if (matched) {
      result.push({ ...node, visible: true })
    } else if (node.children) {
      const filteredChildren = filterNodes(node.children, text)
      if (filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren,
          expanded: true,
          visible: true
        })
      }
    }
  }

  return result
}

// 展开所有节点
const expandAllNodes = () => {
  const traverse = (nodes) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        treeState.expandedKeys.push(node[props.nodeKey])
        node.expanded = true
        traverse(node.children)
      }
    })
  }

  traverse(processedData.value)
}

// 折叠所有节点
const collapseAllNodes = () => {
  treeState.expandedKeys = []

  const traverse = (nodes) => {
    nodes.forEach((node) => {
      node.expanded = false
      if (node.children) {
        traverse(node.children)
      }
    })
  }

  traverse(processedData.value)
}

// 更新选中状态
const updateCheckedState = () => {
  if (!props.showCheckbox) return

  const indeterminate = []

  const updateParentCheckedState = (node) => {
    if (!node.parent) return

    const siblings = node.parent.children
    const checkedSiblings = siblings.filter((sibling) => treeState.checkedKeys.includes(sibling[props.nodeKey]))

    const parentKey = node.parent[props.nodeKey]

    if (checkedSiblings.length === siblings.length) {
      // 所有子节点都选中，父节点选中
      if (!treeState.checkedKeys.includes(parentKey)) {
        treeState.checkedKeys.push(parentKey)
      }
      const index = indeterminate.indexOf(parentKey)
      if (index > -1) {
        indeterminate.splice(index, 1)
      }
    } else if (checkedSiblings.length > 0) {
      // 部分子节点选中，父节点半选
      const checkedIndex = treeState.checkedKeys.indexOf(parentKey)
      if (checkedIndex > -1) {
        treeState.checkedKeys.splice(checkedIndex, 1)
      }
      if (!indeterminate.includes(parentKey)) {
        indeterminate.push(parentKey)
      }
    } else {
      // 没有子节点选中，父节点不选中
      const checkedIndex = treeState.checkedKeys.indexOf(parentKey)
      if (checkedIndex > -1) {
        treeState.checkedKeys.splice(checkedIndex, 1)
      }
      const indeterminateIndex = indeterminate.indexOf(parentKey)
      if (indeterminateIndex > -1) {
        indeterminate.splice(indeterminateIndex, 1)
      }
    }

    updateParentCheckedState(node.parent)
  }

  // 更新所有父节点状态
  flattenNodes.value.forEach((node) => {
    if (treeState.checkedKeys.includes(node[props.nodeKey])) {
      updateParentCheckedState(node)
    }
  })

  treeState.indeterminateKeys = indeterminate
}

// 事件处理
const handleNodeClick = ({ node, event }) => {
  if (props.highlightCurrent) {
    treeState.selectedKeys = [node[props.nodeKey]]
  }

  emit("node-click", node, event)
  emit("current-change", node, node)
}

const handleNodeExpand = async (node) => {
  const key = node[props.nodeKey]

  if (props.accordion) {
    // 手风琴模式：收起同级其他节点
    if (node.parent) {
      node.parent.children.forEach((sibling) => {
        if (sibling !== node && sibling.expanded) {
          sibling.expanded = false
          const siblingKey = sibling[props.nodeKey]
          const index = treeState.expandedKeys.indexOf(siblingKey)
          if (index > -1) {
            treeState.expandedKeys.splice(index, 1)
          }
        }
      })
    }
  }

  // 懒加载
  if (props.lazy && props.load && (!node.children || node.children.length === 0)) {
    node.loading = true
    try {
      const children = await props.load(node)
      if (children && children.length > 0) {
        node.children = processTreeData(children, node)
        buildFlattenNodes(processedData.value)
      }
    } catch (error) {
      console.error("Lazy load error:", error)
    } finally {
      node.loading = false
    }
  }

  node.expanded = true
  if (!treeState.expandedKeys.includes(key)) {
    treeState.expandedKeys.push(key)
  }

  emit("node-expand", node)
}

const handleNodeCollapse = (node) => {
  const key = node[props.nodeKey]
  node.expanded = false

  const index = treeState.expandedKeys.indexOf(key)
  if (index > -1) {
    treeState.expandedKeys.splice(index, 1)
  }

  emit("node-collapse", node)
}

const handleNodeCheck = ({ node, checked }) => {
  const key = node[props.nodeKey]

  if (checked) {
    if (!treeState.checkedKeys.includes(key)) {
      treeState.checkedKeys.push(key)
    }
  } else {
    const index = treeState.checkedKeys.indexOf(key)
    if (index > -1) {
      treeState.checkedKeys.splice(index, 1)
    }
  }

  // 级联选择
  if (!props.checkStrictly) {
    if (checked) {
      // 选中所有子节点
      const checkChildren = (children) => {
        if (!children) return
        children.forEach((child) => {
          const childKey = child[props.nodeKey]
          if (!treeState.checkedKeys.includes(childKey)) {
            treeState.checkedKeys.push(childKey)
          }
          checkChildren(child.children)
        })
      }
      checkChildren(node.children)
    } else {
      // 取消选中所有子节点
      const uncheckChildren = (children) => {
        if (!children) return
        children.forEach((child) => {
          const childKey = child[props.nodeKey]
          const index = treeState.checkedKeys.indexOf(childKey)
          if (index > -1) {
            treeState.checkedKeys.splice(index, 1)
          }
          uncheckChildren(child.children)
        })
      }
      uncheckChildren(node.children)
    }

    updateCheckedState()
  }

  emit("check-change", node, checked, treeState.checkedKeys)
}

const handleNodeDrag = ({ node, event }) => {
  emit("node-drag-start", node, event)
}

const handleNodeDrop = ({ dragNode, dropNode, position, event }) => {
  emit("node-drop", dragNode, dropNode, position, event)
}

const handleNodeContextMenu = ({ node, event }) => {
  contextMenuNode.value = node
  contextMenuVisible.value = true

  nextTick(() => {
    const rect = treeContentRef.value.getBoundingClientRect()
    contextMenuStyle.value = {
      position: "fixed",
      left: `${event.clientX}px`,
      top: `${event.clientY}px`,
      zIndex: 1000
    }
  })

  emit("node-context-menu", node, event)
}

const handleContextMenuAction = (action) => {
  const node = contextMenuNode.value
  if (!node) return

  switch (action) {
    case "expand":
      if (!node.expanded) {
        handleNodeExpand(node)
      }
      break
    case "collapse":
      if (node.expanded) {
        handleNodeCollapse(node)
      }
      break
    case "delete":
      // 删除节点逻辑
      break
  }

  contextMenuVisible.value = false
}

const handleFilterChange = () => {
  // 过滤变化时的处理逻辑
}

// 公共方法
const getNode = (key) => {
  return flattenNodes.value.get(key)
}

const getCheckedNodes = (leafOnly = false) => {
  const result = []
  treeState.checkedKeys.forEach((key) => {
    const node = flattenNodes.value.get(key)
    if (node && (!leafOnly || !node.children || node.children.length === 0)) {
      result.push(node)
    }
  })
  return result
}

const setCheckedKeys = (keys) => {
  treeState.checkedKeys = [...keys]
  updateCheckedState()
}

const setCurrentNode = (node) => {
  if (node) {
    treeState.selectedKeys = [node[props.nodeKey]]
  } else {
    treeState.selectedKeys = []
  }
}

const expandNode = (node) => {
  handleNodeExpand(node)
}

const collapseNode = (node) => {
  handleNodeCollapse(node)
}

// 检测设备类型
const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

// 点击外部关闭上下文菜单
const handleClickOutside = (event) => {
  if (contextMenuVisible.value && contextMenuRef.value && !contextMenuRef.value.contains(event.target)) {
    contextMenuVisible.value = false
  }
}

// 生命周期
onMounted(() => {
  initializeData()
  checkDevice()
  window.addEventListener("resize", checkDevice)
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener("resize", checkDevice)
  document.removeEventListener("click", handleClickOutside)
})

// 监听数据变化{}
watch(
  () => props.data,
  () => {
    initializeData()
  },
  { deep: true }
)

// 监听props变化，确保响应式更新
watch(
  () => props.showCheckbox,
  (newVal) => {
    console.log("showCheckbox changed:", newVal)
  }
)

watch(
  () => props.showLine,
  (newVal) => {
    console.log("showLine changed:", newVal)
  }
)

watch(
  () => props.filterable,
  (newVal) => {
    console.log("filterable changed:", newVal)
  }
)

watch(
  () => props.draggable,
  (newVal) => {
    console.log("draggable changed:", newVal)
  }
)

// 暴露方法
defineExpose({
  getNode,
  getCheckedNodes,
  setCheckedKeys,
  setCurrentNode,
  expandNode,
  collapseNode,
  expandAllNodes,
  collapseAllNodes
})
</script>

<style scoped>
.tree {
  font-size: 16px;
  color: #606266;
  width: 100%;
}

.tree--mobile {
  font-size: 18px;
}

.tree__search {
  position: relative;
  margin-bottom: 20px;
}

.tree__search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.tree__search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.tree__search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #c0c4cc;
  pointer-events: none;
}

.tree__content {
  position: relative;
  /* min-height: 200px; */
}

.tree__empty {
  padding: 60px 0;
  text-align: center;
}

.tree__empty-text {
  color: #909399;
  font-size: 16px;
}

.tree__nodes {
  /* 节点容器样式 */
}

.tree__context-menu {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 140px;
}

.tree__context-menu-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.tree__context-menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tree__search-input {
    padding: 16px 44px 16px 20px;
    font-size: 18px;
  }

  .tree__search-icon {
    width: 24px;
    height: 24px;
    right: 16px;
  }

  .tree__empty-text {
    font-size: 18px;
  }

  .tree__context-menu-item {
    padding: 16px 24px;
    font-size: 18px;
  }
}
</style>
