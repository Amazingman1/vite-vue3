<template>
  <div class="tree">
    <TreeNode
      v-for="node in treeData"
      :key="node.id"
      :node="node"
      @add-node="handleAddNode"
      @delete-node="handleDeleteNode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TreeNode, { TreeNodeData } from "./TreeNode.vue";

// 初始树形数据
const treeData = ref<TreeNodeData[]>([
  {
    id: 1,
    label: "根节点 1",
    children: [
      { id: 2, label: "子节点 1-1" },
      { id: 3, label: "子节点 1-2" },
    ],
  },
  {
    id: 4,
    label: "根节点 2",
  },
]);

// 递归查找并新增
function handleAddNode(payload: { parentId: number | null; type: "sibling" | "child" }) {
  const newNode: TreeNodeData = {
    id: Date.now(),
    label: "新节点",
  };

  function dfs(nodes: TreeNodeData[], parentId: number | null): boolean {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === parentId) {
        if (payload.type === "child") {
          node.children = node.children || [];
          node.children.push(newNode);
        } else if (payload.type === "sibling") {
          nodes.splice(i + 1, 0, newNode);
        }
        return true;
      }
      if (node.children && dfs(node.children, parentId)) return true;
    }
    return false;
  }

  if (payload.parentId === null) {
    treeData.value.push(newNode);
  } else {
    dfs(treeData.value, payload.parentId);
  }
}

// 递归删除
function handleDeleteNode(nodeId: number) {
  function dfs(nodes: TreeNodeData[]): boolean {
    const idx = nodes.findIndex((n) => n.id === nodeId);
    if (idx !== -1) {
      nodes.splice(idx, 1);
      return true;
    }
    for (let node of nodes) {
      if (node.children && dfs(node.children)) return true;
    }
    return false;
  }
  dfs(treeData.value);
}
</script>

<style scoped>
.tree {
  padding: 10px;
  border: 1px solid #ddd;
  display: inline-block;
}
</style>
