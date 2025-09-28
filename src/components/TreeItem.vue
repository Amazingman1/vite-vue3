<template>
  <div
    class="li-wrapper"
    :style="{ marginLeft: (level * 24) + 'px' }"
  >
    <div class="node-wrapper">
      <span v-if="isFolder" class="toggle-btn" @click="$emit('toggle')">
        <el-icon color="#4e5969">
          <component :is="expandedMap[item._key] ? ArrowDownBold : ArrowRightBold" />
        </el-icon>
      </span>
      <!-- ...其它内容同原来... -->
      <el-input v-model="item.labelEn"></el-input>
      <!-- ... -->
      <el-button type="primary" :icon="Plus" circle size="small" @click="$emit('addSibling')"></el-button>
      <el-button type="primary" :icon="Minus" circle size="small" @click="$emit('delete')"></el-button>
      <el-button type="primary" size="small" @click="$emit('addChild')">子级+</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownBold, ArrowRightBold, Minus, Plus } from "@element-plus/icons-vue"
const props = defineProps({
  item: { type: Object, required: true },
  level: { type: Number, default: 0 },
  expandedMap: { type: Object, required: true }
})
const isFolder = props.item.children && props.item.children.length > 0
</script>

<style lang="scss" scoped>
.li-wrapper {
  display: flex;
  align-items: center;
  height: 44px;
}
.node-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.toggle-btn {
  cursor: pointer;
  margin-right: 8px;
  font-weight: bold;
  user-select: none;
}
</style>