import { ref, computed } from 'vue'

export interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  expanded?: boolean
  level?: number
  parentId?: string | number | null
  isLast?: boolean
}

function flattenTree(
  tree: TreeNode[],
  expandedKeys: Set<string | number>,
  level = 0,
  parentId: string | number | null = null
): TreeNode[] {
  const res: TreeNode[] = []
  tree.forEach((node, index) => {
    const isLast = index === tree.length - 1
    const newNode = { ...node, level, parentId, isLast }
    res.push(newNode)
    if (node.children && expandedKeys.has(node.id)) {
      res.push(...flattenTree(node.children, expandedKeys, level + 1, node.id))
    }
  })
  return res
}

export function useTree(data: () => TreeNode[]) {
  const expandedKeys = ref<Set<string | number>>(new Set())

  const flatData = computed(() =>
    flattenTree(data(), expandedKeys.value)
  )

  const toggleExpand = (node: TreeNode) => {
    if (expandedKeys.value.has(node.id)) {
      expandedKeys.value.delete(node.id)
    } else {
      expandedKeys.value.add(node.id)
    }
  }

  return {
    flatData,
    expandedKeys,
    toggleExpand,
  }
}
