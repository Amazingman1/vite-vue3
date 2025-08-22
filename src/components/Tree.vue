<template>
  <ul id="demo" class="demo">
    <tree-item 
    v-for="(item,index) in treeData" :key="index" :item="item" :hasParent="treeData.length > 1" :isNextBrother="!!treeData[index + 1]"></tree-item>
  </ul>
</template>
  
  <script setup ts>
import treeItem from "./TreeItem.vue";

const treeData = [{
  name: "节点1",
  children: [
    { name: "节点1-1" },
    { name: "节点1-2" },
    {
      name: "节点1-3",
      children: [
        {
          name: "节点1-3-1",
          children: [{ name: "1-3-1-1" }, { name: "1-3-1-2" }],
        },
        { name: "节点1-3-2" },
        { name: "节点1-3-3" },
        {
          name: "节点1-3-4",
          children: [{ name: "节点1-3-4-1" }, { name: "节点1-3-4-5" }],
        },
      ],
    },
    { name: "节点1-4" },
  ],

},

{  name: "节点2",children: [{ name: "节点1-3-4-1" }, { name: "节点1-3-4-5" }]},
{ name: "节点3" },
{ name: "节点4" },

];

</script>
  
  <style lang="scss" scoped>

//节点高度
$item-height: 36px;
//节点边框颜色
$item-border-color: blue;
//节点之间的连接线颜色
$line-color: red;
//节点上下边距
$item-margin: 14px;
//节点缩进距离
$item-padding-left: 25px;
//横向连接线宽度
$item-direction-line-width: 10px;

ul {
  position: relative;
  list-style: none;
  padding-left: $item-padding-left;
  li {
    margin: $item-margin 0;
  }
}

.li-wrapper {
  position: relative;
}

.bold {
  font-weight: bold;
}
 .demo > .leftBorder:first-child::before {
    content: "";
    width: 1px;
    background: $line-color;
    position: absolute;
    top: 19px;
    bottom: -($item-height / 2 + $item-margin);
    left: -($item-direction-line-width);;
    }

</style>