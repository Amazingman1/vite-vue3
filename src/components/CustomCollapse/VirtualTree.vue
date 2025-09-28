<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import { useTree, TreeNode } from '@/hook/useTree'

const props = defineProps<{
  data: TreeNode[]
  itemSize?: number
}>()

const emit = defineEmits<{
  (e: 'add', parent: TreeNode): void
  (e: 'remove', node: TreeNode): void
}>()

const { flatData, toggleExpand } = useTree(() => props.data)

const handleAdd = (node: TreeNode) => {
  emit('add', node)
}

const handleRemove = (node: TreeNode) => {
  emit('remove', node)
}
</script>

<template>
  <RecycleScroller
    :items="flatData"
    :item-size="itemSize || 28"
    key-field="id"
    class="tree-scroller"
  >
    <template #default="{ item }">
      <div
        class="tree-node"
        :class="{ 'is-last': item.isLast }"
        :style="{ paddingLeft: (item.level! * 20) + 'px' }"
      >
        <!-- 展开按钮 -->
        <span v-if="item.children" class="expand-icon" @click="toggleExpand(item)">
          {{ item.expanded ? '-' : '+' }}
        </span>
        <span v-else class="expand-icon" />
        <el-input  v-model="item.label" placeholder="请输入内容"></el-input>
        
        <!-- 节点内容插槽 -->
        <!-- <slot name="default" :node="item">
          {{ item.label }}
        </slot> -->

        <!-- 操作按钮 -->
        <div class="actions">
          <button class="btn" @click.stop="handleAdd(item)">➕</button>
          <button class="btn" @click.stop="handleRemove(item)">🗑️</button>
        </div>
      </div>
    </template>
  </RecycleScroller>
</template>

<style scoped>
.tree-scroller {
  height: 400px;
  overflow: auto;
  border: 1px solid #ddd;
}
.tree-node {
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
}

/* 层级线 */
.tree-node::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  border-left: 1px solid #ccc;
}
.tree-node::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 50%;
  width: 12px;
  border-top: 1px solid #ccc;
}
.tree-node.is-last::before {
  bottom: 50%;
}

/* 展开图标 */
.expand-icon {
  display: inline-block;
  width: 16px;
  text-align: center;
  cursor: pointer;
}

/* 按钮区域 */
.actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}
.btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
}
.btn:hover {
  color: red;
}
</style>
