<template>
  <div>
    <PermissionButtonGroup
      :user-status="userStatus"
      :data-status="dataStatus"
      :editing-user="editingUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PermissionButtonGroup } from '@/hook/useButton';

const userStatus = ref<'editable' | 'non-editable'>('non-editable');
const dataStatus = ref<'official' | 'draft' | 'gray'>('draft');
const editingUser = ref('张三');
</script>