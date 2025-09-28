<template>
  <RecycleScroller
    :items="flatTree"
    :item-size="itemHeight"
    key-field="_key"
    class="demo"
  >
    <template #default="{ item }">
      <tree-item
        :item="item"
        :level="item._level"
        :expandedMap="expandedMap"
        @toggle="toggleExpand(item._key)"
        @addSibling="addSibling(item._key)"
        @delete="deleteNode(item._key)"
        @addChild="addChild(item._key)"
      />
    </template>
  </RecycleScroller>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { RecycleScroller } from 'vue-virtual-scroller'
import treeItem from "./TreeItem.vue"
import { TreeType } from "@/types/tree";

const props = defineProps({
  treeData: {
    type: Array,
    default: () => []
  }
})
const treeData = ref(props.treeData)
const itemHeight = 44

// 记录展开状态
const expandedMap = ref<Record<string, boolean>>({})
function flattenTree(tree: TreeType[], expandedMap: Record<string, boolean>, level = 0, parentKey = '') {
  const result: any[] = []
  tree.forEach((node, idx) => {
    const key = parentKey + '-' + idx
    result.push({ ...node, _key: key, _level: level, _parentKey: parentKey })
    if (expandedMap[key] && node.children && node.children.length) {
      result.push(...flattenTree(node.children, expandedMap, level + 1, key))
    }
  })
  return result
}
// 扁平化树
const flatTree = computed(() => flattenTree(treeData.value, expandedMap.value))

function toggleExpand(key: string) {
  expandedMap.value[key] = !expandedMap.value[key]
}

// 通过key找到节点的父数组和索引
function findNodeByKey(tree: TreeType[], key: string): { arr: TreeType[], idx: number } | null {
  const keys = key.split('-').slice(1).map(Number)
  let arr = tree
  let node = null
  for (let i = 0; i < keys.length; i++) {
    node = arr[keys[i]]
    if (i === keys.length - 1) return { arr, idx: keys[i] }
    arr = node.children || []
  }
  return null
}

function deleteNode(key: string) {
  const found = findNodeByKey(treeData.value, key)
  if (found) found.arr.splice(found.idx, 1)
}

function addSibling(key: string) {
  const found = findNodeByKey(treeData.value, key)
  if (found) found.arr.splice(found.idx + 1, 0, { labelEn: '', labelZn: "", dataType: "", isRequired: '', children: [] })
}

function addChild(key: string) {
  const found = findNodeByKey(treeData.value, key)
  if (found) {
    const node = found.arr[found.idx]
    if (!node.children) node.children = []
    node.children.push({ labelEn: '', labelZn: "", dataType: "", isRequired: '', children: [] })
    expandedMap.value[key] = true
  }
}
</script>

<style lang="scss" scoped>
.demo {
  height: 45vh;
  overflow: auto;
}
</style>
