export class ListNode {
  val: number
  next: ListNode | null

  constructor(val: number, next?: ListNode | null) {
    this.val = val
    this.next = next ?? null
  }
}

export class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null

  constructor(val: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val
    this.left = left ?? null
    this.right = right ?? null
  }
}

// [1,2,3] -> linked list 1->2->3
export function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) {
    return null
  }

  const dummy = new ListNode(0)
  let current = dummy

  for (const val of arr) {
    current.next = new ListNode(val)
    current = current.next
  }

  return dummy.next
}

// linked list 1->2->3 -> [1,2,3]
export function listToArray(head: ListNode | null): number[] {
  const result: number[] = []
  let current = head

  while (current !== null) {
    result.push(current.val)
    current = current.next
  }

  return result
}

// [1,2,null,3,4] (level-order BFS) -> TreeNode
export function arrayToTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) {
    return null
  }

  const root = new TreeNode(arr[0])
  const queue: TreeNode[] = [root]
  let i = 1

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!

    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number)
      queue.push(node.left)
    }
    i++

    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number)
      queue.push(node.right)
    }
    i++
  }

  return root
}

// TreeNode -> [1,2,null,3,4] (level-order BFS)
export function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) {
    return []
  }

  const result: (number | null)[] = []
  const queue: (TreeNode | null)[] = [root]

  while (queue.length > 0) {
    const node = queue.shift()
    if (node === null) {
      result.push(null)
    } else if (node !== undefined) {
      result.push(node.val)
      queue.push(node.left)
      queue.push(node.right)
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop()
  }

  return result
}
