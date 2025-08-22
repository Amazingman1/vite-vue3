<template>
  <div class="tree-node">
    <div class="node-content">
      <span>{{ node.label }}</span>
      <button @click="addSibling">+ 同级</button>
      <button @click="addChild">+ 子级</button>
      <button @click="deleteNode">- 删除</button>
    </div>
    <div class="children" v-if="node.children && node.children.length">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @add-node="$emit('add-node', $event)"
        @delete-node="$emit('delete-node', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

export interface TreeNodeData {
  id: number;
  label: string;
  children?: TreeNodeData[];
}

const props = defineProps<{
  node: TreeNodeData;
}>();

const emit = defineEmits<{
  (e: "add-node", payload: { parentId: number; type: "sibling" | "child" }): void;
  (e: "delete-node", nodeId: number): void;
}>();

function addSibling() {
  emit("add-node", { parentId: props.node.id, type: "sibling" });
}

function addChild() {
  emit("add-node", { parentId: props.node.id, type: "child" });
}

function deleteNode() {
  emit("delete-node", props.node.id);
}
</script>

<style scoped>
.tree-node {
  padding:20px;
  /* border: 1px solid #aaa; */
  margin-left: 20px;
  position: relative;
}

.tree-node::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 10px;
  height: 100%;
  border-left: 1px solid #aaa;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 6px;
  /* margin: 4px 0; */
}
.children {
  margin-left: 20px;
}
</style>
