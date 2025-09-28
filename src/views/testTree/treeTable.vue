<template>
  <!-- 文件树 -->
  <Tree
    v-model:data="treeData"
    ref="treeRef"
    :default-expand-all="false"
    :highlight-current="true"
    node-key="id"
    @node-click="handleNodeClick"
    @node-expand="handleNodeExpand"
    @node-collapse="handleNodeCollapse"
    @check-change="handleCheckChange"
    @node-drop="handleNodeDrop"
    @node-context-menu="handleNodeContextMenu"
    @initialize="(data) => console.log('初始化数据:', data)"
  >
    <template #icon="{ node, expanded }">
      <svg v-if="node.type === 'folder'" class="node-icon" viewBox="0 0 24 24">
        <path
          v-if="expanded"
          fill="#ffd700"
          d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"
        />
        <path
          v-else
          fill="#ffb74d"
          d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"
        />
      </svg>
      <svg v-else class="node-icon" viewBox="0 0 24 24">
        <path
          fill="#64b5f6"
          d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
        />
      </svg>
    </template>
  </Tree>
  <el-button @click="console.log(treeData)">Save</el-button>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue"
import Tree from "@/components/Tree/Tree.vue"

// 响应式数据
const treeRef = ref(null)
const selectedNode = ref(null)
const checkedNodes = ref([])

// 控制选项 - 确保响应式
const showCheckbox = ref(true)
const showLine = ref(false)
const filterable = ref(true)
const draggable = ref(false)

// 树形数据
const treeData = reactive([
  {
    id: "1",
    label: "项目根目录",
    type: "folder",
    path: "/",
    children: [
      {
        id: "1-1",
        label: "src",
        type: "folder",
        path: "/src",
        children: [
          {
            id: "1-1-1",
            label: "components",
            type: "folder",
            path: "/src/components",
            children: [
              {
                id: "1-1-1-1",
                label: "Tree.vue",
                type: "file",
                path: "/src/components/Tree.vue"
              },
              {
                id: "1-1-1-2",
                label: "TreeNode.vue",
                type: "file",
                path: "/src/components/TreeNode.vue"
              }
            ]
          },
          {
            id: "1-1-2",
            label: "views",
            type: "folder",
            path: "/src/views",
            children: [
              {
                id: "1-1-2-1",
                label: "Home.vue",
                type: "file",
                path: "/src/views/Home.vue"
              },
              {
                id: "1-1-2-2",
                label: "About.vue",
                type: "file",
                path: "/src/views/About.vue"
              }
            ]
          },
          {
            id: "1-1-3",
            label: "assets",
            type: "folder",
            path: "/src/assets",
            children: [
              {
                id: "1-1-3-1",
                label: "logo.png",
                type: "file",
                path: "/src/assets/logo.png"
              },
              {
                id: "1-1-3-2",
                label: "style.css",
                type: "file",
                path: "/src/assets/style.css"
              }
            ]
          }
        ]
      },
      {
        id: "1-2",
        label: "public",
        type: "folder",
        path: "/public",
        children: [
          {
            id: "1-2-1",
            label: "index.html",
            type: "file",
            path: "/public/index.html"
          },
          {
            id: "1-2-2",
            label: "favicon.ico",
            type: "file",
            path: "/public/favicon.ico"
          }
        ]
      },
      {
        id: "1-3",
        label: "package.json",
        type: "file",
        path: "/package.json"
      },
      {
        id: "1-4",
        label: "README.md",
        type: "file",
        path: "/README.md"
      }
    ]
  }]
)

// 事件处理
const handleNodeClick = (node) => {
  selectedNode.value = node
  console.log("节点点击:", node)
}

const handleNodeExpand = (node) => {
  console.log("节点展开:", node)
}

const handleNodeCollapse = (node) => {
  console.log("节点折叠:", node)
}

const handleCheckChange = (node, checked, checkedKeys) => {
  console.log("选中状态改变:", node, checked, checkedKeys)
  updateCheckedNodes()
}

const handleNodeDrop = (dragNode, dropNode, position) => {
  console.log("节点拖拽:", dragNode, dropNode, position)
}

const handleNodeContextMenu = (node, event) => {
  console.log("右键菜单:", node, event)
}

const handleExpandAll = () => {
  treeRef.value?.expandAllNodes()
}

const handleCollapseAll = () => {
  treeRef.value?.collapseAllNodes()
}

const handleGetCheckedNodes = () => {
  const nodes = treeRef.value?.getCheckedNodes()
  console.log("选中的节点:", nodes)
  alert(`已选中 ${nodes?.length || 0} 个节点，请查看控制台`)
}

const handleClearChecked = () => {
  treeRef.value?.setCheckedKeys([])
  updateCheckedNodes()
}

const updateCheckedNodes = () => {
  checkedNodes.value = treeRef.value?.getCheckedNodes() || []
}

// 监听控制选项变化
watch([showCheckbox, showLine, filterable, draggable], () => {
  console.log("控制选项变化:", {
    showCheckbox: showCheckbox.value,
    showLine: showLine.value,
    filterable: filterable.value,
    draggable: draggable.value
  })
})
</script>

