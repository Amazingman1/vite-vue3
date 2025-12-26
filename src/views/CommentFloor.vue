<template>
  <div class="border-l-2 pl-3 mt-2">
    <div class="flex items-center gap-2">
      <span class="text-blue-600 font-bold">{{ comment.floor }} 楼</span>
      <span>{{ comment.content }}</span>
      <button
        class="ml-2 text-sm text-gray-500 hover:text-blue-500"
        @click="toggleReply"
      >
        回复
      </button>
    </div>

    <!-- 回复输入框 -->
    <div v-if="showInput" class="ml-6 mt-2">
      <input
        v-model="replyContent"
        type="text"
        placeholder="输入回复内容..."
        class="border rounded px-2 py-1 text-sm w-64"
      />
      <button
        class="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="submitReply"
      >
        提交
      </button>
      <button
        class="ml-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
        @click="toggleReply"
      >
        取消
      </button>
    </div>

    <!-- 子评论（只有一条，盖楼式） -->
    <CommentFloor
      v-if="comment.replies.length > 0"
      :comment="comment.replies[0]"
      @reply="$emit('reply', $event.parentId, $event.content)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Comment {
  id: number
  content: string
  floor: number
  replies: Comment[]
}

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  (e: "reply", parentId: number, content: string): void
}>()

const showInput = ref(false)
const replyContent = ref("")

const toggleReply = () => {
  showInput.value = !showInput.value
  if (!showInput.value) replyContent.value = ""
}

const submitReply = () => {
  if (!replyContent.value.trim()) return
  emit("reply", props.comment.id, replyContent.value.trim())
  replyContent.value = ""
  showInput.value = false
}
</script>
