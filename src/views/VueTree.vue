<template>
  <div>
    <el-button @click="change">{{ status ? "编辑" : "预览"}}</el-button>
    <div>
      <Tree v-if="status" :treeData="treeData"></Tree>
      <div v-else>
        <div v-for="value in treeData">{{ value.labelZn }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup> 

import Tree from "@/components/Tree.vue";
import { TreeType } from "@/types/tree";
import { ref,watch } from "vue";
const status = ref(false)
const change = () => {
  status.value = !status.value
}
const treeData =ref<TreeType[]>( [
  {
    labelZn: "节点1",
    dataType: "",
    isRequired: '0',
    labelEn: 'key3',
    children: [
      { labelZn: "节点1-1", dataType: "", isRequired: '0',labelEn: 'key1' },
      { labelZn: "节点1-2" , dataType: "", isRequired: '1', labelEn: 'key2'},
    ]
  },
])
watch(() => treeData.value,() => console.log(treeData.value, "treeData最终结果"), { deep: true })
</script>