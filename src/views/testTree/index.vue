<script setup lang="ts">
import { ref } from "vue"
import VirtualTree from "@/components/CustomCollapse/VirtualTree.vue"

import type { TreeNode } from "@/hook/useTree"
const addNode = (base: number = 100) => {
  let list = []
  for (let i = 0; i < 100; i++) {
    const newNode: TreeNode = {
      id: i + base,
      label: "New Node" + i
    }
    list.push({ ...newNode })
  }
  // treeData.value.push(newNode)

  return list
}

let idCounter = 1800
// 工具方法：递归找到节点
const findNodeById = (list: TreeNode[], id: number | string): TreeNode | null => {
  for (const n of list) {
    if (n.id === id) return n
    if (n.children) {
      const found = findNodeById(n.children, id)
      if (found) return found
    }
  }
  return null
}

const handleAdd = (parent: TreeNode) => {
  const target = findNodeById(treeData.value, parent.id)
  if (!target) return

  if (!target.children) {
    target.children = [] // 确保 children 响应式
  }

  target.children.push({
    id: ++idCounter,
    label: `New Node ${idCounter}`
  })

  // 自动展开父节点
  target.expanded = true
}

const handleRemove = (node: TreeNode) => {
  const removeRecursively = (list: TreeNode[]) => {
    const idx = list.findIndex(n => n.id === node.id)
    if (idx !== -1) {
      list.splice(idx, 1)
      return true
    }
    for (const n of list) {
      if (n.children && removeRecursively(n.children)) return true
    }
    return false
  }
  removeRecursively(treeData.value)
}
const treeData = ref<TreeNode[]>([
  {
    id: 1,
    label: "Root",
    expanded: true,
    children: [
      { id: 2, label: "Child 1" },
      {
        id: 3,
        label: "Child 2",
        children: [
          { id: 4, label: "Sub Child 1" },
          {
            id: 5,
            label: "Sub Child 23",
            children: [{ id: 6, label: "Sub Child 1" }, { id: 7, label: "Sub Child 2" }]
          }
        ]
      }
    ]
  }
])
</script>

<template>
  <VirtualTree :data="treeData" :item-size="38" @add="handleAdd" @remove="handleRemove">
    <!-- <template #default="{ node }">
      <div>
        <div><el-input v-model="node.label"></el-input></div>
      </div>
    </template> -->
  </VirtualTree>

  <div>{{ treeData }}</div>
</template>
