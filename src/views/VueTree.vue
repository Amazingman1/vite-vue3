<template>
  <div>
  <Tree :treeData="treeData"></Tree>
  </div>
</template>
<script lang="ts" setup> 

import Tree from "@/components/Tree.vue";
import { TreeType } from "@/types/tree";
import { ref,watch } from "vue";

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