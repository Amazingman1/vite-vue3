<template>
  <div style="padding: 16px">
    <h3>Demo: Tree</h3>
    <Tree v-model="data" :line="true" :indent="20" :collapsible="true"
      @add="(p) => log('add', p)"
      @remove="(p) => log('remove', p)"
      @toggle="(p) => log('toggle', p)"
      @rename="(p) => log('rename', p)"
    />
    <!-- <pre style="margin-top:16px;background:#0b1020;color:#d1e7ff;padding:12px;border-radius:8px;">
{{ JSON.stringify(data, null, 2) }}
    </pre> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tree, { type TreeNode } from './Tree.vue'

const data = ref<TreeNode[]>([
  {
    id: 'a',
    label: '节点 A',
    expanded: true,
    children: [
      { id: 'a1', label: '节点 A-1' },
      {
        id: 'a2',
        label: '节点 A-2',
        expanded: true,
        children: [
          { id: 'a21', label: '节点 A-2-1' }
        ]
      }
    ]
  },
  { id: 'b', label: '节点 B' }
])

function log(type: string, payload: any) {
  // 这里你可以接入业务埋点/接口
  console.log(`[tree:${type}]`, payload)
}
</script>
