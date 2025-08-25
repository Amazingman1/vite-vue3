<template>
  <li class="li-wrapper" :class="[{ leftBorder: isNextBrother }]">
    <div class="node-wrapper" :class="[{ hasParent: hasParent }]">
      <span class="toggle-btn" @click="isOpen = !isOpen">
        <div :class="[{ 'bg-[#E3ECFF]': isFolder }]" class="icon-box">
          <el-icon color="#4e5969">
            <component v-if="isFolder" :is="isOpen ? ArrowDownBold : ArrowRightBold" />
          </el-icon>
        </div>
      </span>
      <div class="flex items-center w-full gap-10">
        <div class="p-1 w-[120px] shrink-0">
          <el-input v-model="itemObj.labelEn"></el-input>
        </div>
        <div class="flex-1 flex justify-end gap-2 items-center">
          <el-select v-model="itemObj.dataType" class="!w-[138px]">
            <el-option label="新增同级" value="sibling"></el-option>
            <el-option label="新增子节点" value="child"></el-option>
            <el-option label="删除节点" value="delete"></el-option>
            <el-option label="字符串" value="String"></el-option>
          </el-select>
          <el-checkbox v-model="itemObj.isRequired" :label="'1'" size="large">必须</el-checkbox>
          <!-- 节点名称 -->
          <el-input v-model="itemObj.labelZn" placeholder="请输入中文名称" class="!w-[138px]"></el-input>
          <el-input v-model="itemObj.remark" placeholder="请输入描述" class="!w-[180px]"></el-input>
          <!-- 新增同级 -->
            <el-dropdown trigger="click">
              <el-button type="primary" :icon="Plus" circle size="small" ></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addSibling">添加相邻节点</el-dropdown-item>
                  <el-dropdown-item v-if="itemObj.dataType !== 'String'" @click="addChild">添加子节点</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          <!-- 删除节点 -->
          <el-button type="primary" :icon="Minus" circle size="small" @click="deleteNode"></el-button>
        </div>
      </div>
    </div>
    <ul v-if="isFolder && isOpen" class="tree-list">
      <tree-item
        v-for="(child, index) in itemObj.children"
        :key="index"
        v-model:item="itemObj.children[index]"
        :isNextBrother="!!itemObj.children[index + 1]"
        :hasParent="true"
        @addSibling="addSiblingChild(index)"
        @delete="deleteChild(index)"
        @addChild="addChildChild(index)"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, defineEmits } from "vue"
import { ArrowDownBold, ArrowRightBold, Minus, Plus } from "@element-plus/icons-vue"
const props = defineProps({
  item: { type: Object, required: true },
  hasParent: { type: Boolean, default: false },
  isNextBrother: { type: Boolean, default: false }
})
const emit = defineEmits(["update:item", "delete", "addSibling", "addChild"])

const isOpen = ref(true)
const isFolder = computed(() => itemObj.value.children && itemObj.value.children.length)

const itemObj = computed({
  get() {
    return props.item
  },
  set(val) {
    emit("update:item", val)
  }
})

// 根节点操作由 Tree.vue 处理
function addSibling() {
  emit("addSibling")
}
function deleteNode() {
  emit("delete")
}
function addChild() {
  if (!itemObj.value.children) itemObj.value.children = []
  itemObj.value.children.push({ labelEn: "", dataType: "", labelZn: "", isRequired: '' })
  emit("update:item", { ...itemObj.value })
}

// 子节点操作，递归向上传递
function addSiblingChild(index: number) {
  if (!itemObj.value.children) return
  itemObj.value.children.splice(index + 1, 0, { labelEn: "新同级节点", dataType: "", labelZn: "", isRequired: '' })
}
function deleteChild(index: number) {
  if (!itemObj.value.children) return
  itemObj.value.children.splice(index, 1)
}
function addChildChild(index: number) {
  if (!itemObj.value.children) return
  if (!itemObj.value.children[index].children) itemObj.value.children[index].children = []
  itemObj.value.children[index].children.push({ labelEn: "新子节点", dataType: "", labelZn: "", isRequired: '' })
}
</script>

<style lang="scss" scoped>
//节点高度
$item-height: 36px;
//节点边框颜色
$item-border-color: blue;
//节点之间的连接线颜色
$line-color: #dddfe6;
//节点上下边距
$item-margin: 14px;
//节点缩进距离
$item-padding-left: 70px;
//横向连接线宽度
$item-direction-line-width: 20px;
.tree-list {
  position: relative;
  list-style: none;
  padding-left: $item-padding-left;
}

.li-wrapper {
  position: relative;
  margin: $item-margin 0;
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
  //  border: 1px solid $item-border-color;
  border-radius: 5px;
  // padding: 0 10px;
  height: $item-height;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.hasParent {
  // margin-left: 40px;
  &::before {
    content: "";
    height: 1px;
    background: $line-color;
    position: absolute;
    top: 50%;
    left: -($item-direction-line-width);
    width: $item-direction-line-width;
  }
}
.icon-box {
  padding: 3px;
  display: flex;
  align-items: center;
  border-radius: 3.2px;
}

.toggle-btn {
  cursor: pointer;
  margin-right: 8px;
  font-weight: bold;
  user-select: none;
}
</style>
