<template>

  <el-dialog v-model="visibleShow" :show-close="false" :width="width">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
        <el-button  link @click="close">
          <el-icon class="el-icon--left"><Close /></el-icon>
        </el-button>
      </div>
    </template>
    <div class="pl-[16px] pr-[16px]">
      <slot ></slot>
    </div>
    <el-divider />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="emit('confirm')">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Custom Dialog'
  },
  visible: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '50%'
  }
})
const emit = defineEmits(['update:visible', 'confirm'])
const visibleShow = computed({
  get: () => props.visible,
  set: (val: boolean) => {
    emit('update:visible', val)
  }
})
const closeDialog = () => {
  visibleShow.value = false
}

</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  background-color: #ebebeb;
  padding: 16px;
}
.dialog-footer{
  padding:0 16px 16px 16px;
}

</style>
