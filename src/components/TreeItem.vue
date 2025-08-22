<template>
  <li class="li-wrapper" :class="[{ leftBorder: isNextBrother }]">
    <div
      class="node-wrapper"
      :class="[{ bold: isFolder }, { hasParent: hasParent }]"
    >
      <!-- 折叠按钮 -->
      <span v-if="isFolder" class="toggle-btn" @click="isOpen = !isOpen">
            <el-button
            type="primary"
      text
      :icon="isOpen ? ArrowDownBold : ArrowRightBold"
    >
             <!-- {{ isOpen ? '－' : '＋' }} -->

    </el-button>
      </span>
      <div>{{ props.item.name }}</div>
    </div>
    <ul v-if="isFolder && isOpen">
      <tree-item
        class="item"
        v-for="(child, index) in props.item.children"
        :key="index"
        :item="child"
        :isNextBrother="!!props.item.children[index + 1]"
        :hasParent="true"
      ></tree-item>
    </ul>
  </li>
</template>
  
<script lang="ts" setup>
import {defineProps, ref, computed} from 'vue'
import {ArrowDownBold, ArrowRightBold} from '@element-plus/icons-vue'
const props = defineProps({
  item: Object,
  hasParent: {
    type: Boolean,
    default: false,
  },
  isNextBrother: {
    type: Boolean,
    default: false,
  },
})
const isOpen = ref(true)
const isFolder = computed(() => props.item.children && props.item.children.length)
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

.leftBorder {
  position: relative;
  &::before {
    content: "";
    width: 1px;
    background: $line-color;
    position: absolute;
    top: -($item-margin);
    bottom: -($item-height / 2 + $item-margin);
    left: -($item-direction-line-width);
  }
}

.leftBorderNotHasNextBrother {
  &::before {
    height: 33px;
    top: -($item-margin);
    left: -($item-direction-line-width);
  }
}

.node-wrapper {
  position: relative;
  border: 1px solid $item-border-color;
  border-radius: 5px;
  padding: 0 10px;
  height: $item-height;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.hasParent {
  &::before {
    content: "";
    height: 1px;
    background: $line-color;
    position: absolute;
    top: 50%;
    left: -($item-direction-line-width + 1);
    width: $item-direction-line-width;
  }
}

.toggle-btn {
  cursor: pointer;
  margin-right: 8px;
  font-weight: bold;
  user-select: none;
}
</style>