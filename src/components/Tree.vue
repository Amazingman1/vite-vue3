<template>
  <ul id="demo" class="demo">
    <tree-item
      v-for="(item, index) in treeData"
      :key="index"
      v-model:item="treeData[index]"
      :hasParent="treeData.length > 1"
      :isNextBrother="!!treeData[index + 1]"
      :isLast="index === treeData.length - 1"
      @delete="deleteNode(index)"
      @addSibling="addSibling(index)"
      @addChild="addChild(index)"
    />
  </ul>
</template>

<script setup lang="ts">
import treeItem from "./TreeItem.vue"
import { ref, type PropType } from "vue"
import { TreeType } from "@/types/tree";

const props = defineProps({
  treeData: {
    type: Array as PropType<TreeType[]>,
    default: () => []
  }
})
const treeData = ref(props.treeData)
// 删除当前节点
function deleteNode(index: number) {
  treeData.value.splice(index, 1)
}

// 添加同级节点
function addSibling(index: number) {
  treeData.value.splice(index + 1, 0, { labelEn: '',labelZn: "", dataType: "",isRequired: '' })
}

// 添加子节点（已在 TreeItem 内部处理，无需在此处理）
function addChild(index: number) {
  // 可选：如需在根节点添加子节点，可在此处理
}
</script>

<style lang="scss" scoped>
//节点高度
$item-height: 36px;
//节点边框颜色
//节点之间的连接线颜色
$line-color: #dddfe6;
//节点上下边距
$item-margin: 14px;
//横向连接线宽度
$item-direction-line-width: 20px;

.li-wrapper {
  position: relative;
}
.demo > .leftBorder:first-child::before {
  content: "";
  width: 1px;
  background: $line-color;
  position: absolute;
  top: 19px;
  bottom: -($item-height / 2 + $item-margin);
  left: -($item-direction-line-width);
}
</style>
