<template>
  <div class="p-4">
    <CommentFloor
      v-for="c in comments"
      :key="c.id"
      :comment="c"
      @reply="handleReply"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CommentFloor from "./CommentFloor.vue"

interface Comment {
  id: number
  content: string
  floor: number
  replies: Comment[]
}

const comments = ref<Comment[]>([
  { id: 1, content: "这是 1 楼评论", floor: 1, replies: [] }
])

// 获取最后一层的楼层号
const getMaxFloor = (comment: Comment): number => {
  if (comment.replies.length === 0) return comment.floor
  return getMaxFloor(comment.replies[0])
}

// 递归追加回复（只能盖在最后一层）
const appendReply = (comment: Comment, parentId: number, newReply: Comment): Comment => {
  if (comment.id === parentId) {
    if (comment.replies.length === 0) {
      return { ...comment, replies: [newReply] }
    } else {
      return {
        ...comment,
        replies: [appendReply(comment.replies[0], comment.replies[0].id, newReply)]
      }
    }
  }
  return { ...comment, replies: comment.replies.map(r => appendReply(r, parentId, newReply)) }
}

// 提交回复
const handleReply = (parentId: number, content: string) => {
  comments.value = comments.value.map(c =>
    appendReply(c, parentId, {
      id: Date.now(),
      content,
      floor: getMaxFloor(c) + 1,
      replies: []
    })
  )
}
</script>
