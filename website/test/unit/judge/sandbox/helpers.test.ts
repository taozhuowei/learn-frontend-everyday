import { describe, it, expect } from 'vitest'
import {
  ListNode,
  TreeNode,
  arrayToList,
  listToArray,
  arrayToTree,
  treeToArray
} from '@judge/sandbox/helpers'

describe('ListNode', () => {
  it('constructor with val, next defaults to null', () => {
    const node = new ListNode(42)
    expect(node.val).toBe(42)
    expect(node.next).toBeNull()
  })

  it('constructor accepts custom next', () => {
    const next_node = new ListNode(2)
    const node = new ListNode(1, next_node)
    expect(node.val).toBe(1)
    expect(node.next).toBe(next_node)
  })
})

describe('TreeNode', () => {
  it('constructor with val, left/right default to null', () => {
    const node = new TreeNode(42)
    expect(node.val).toBe(42)
    expect(node.left).toBeNull()
    expect(node.right).toBeNull()
  })

  it('constructor accepts custom left and right', () => {
    const left_node = new TreeNode(2)
    const right_node = new TreeNode(3)
    const node = new TreeNode(1, left_node, right_node)
    expect(node.val).toBe(1)
    expect(node.left).toBe(left_node)
    expect(node.right).toBe(right_node)
  })
})

describe('arrayToList', () => {
  it('creates linked list from array [1,2,3]', () => {
    const list = arrayToList([1, 2, 3])
    expect(list).not.toBeNull()
    expect(list!.val).toBe(1)
    expect(list!.next!.val).toBe(2)
    expect(list!.next!.next!.val).toBe(3)
    expect(list!.next!.next!.next).toBeNull()
  })

  it('returns null for empty array', () => {
    const list = arrayToList([])
    expect(list).toBeNull()
  })
})

describe('listToArray', () => {
  it('converts linked list to array [1,2,3]', () => {
    const list = arrayToList([1, 2, 3])
    const result = listToArray(list)
    expect(result).toEqual([1, 2, 3])
  })

  it('returns empty array for null', () => {
    const result = listToArray(null)
    expect(result).toEqual([])
  })
})

describe('arrayToTree', () => {
  it('creates correct tree structure from [1,null,2,3]', () => {
    const tree = arrayToTree([1, null, 2, 3])
    expect(tree).not.toBeNull()
    expect(tree!.val).toBe(1)
    expect(tree!.left).toBeNull()
    expect(tree!.right).not.toBeNull()
    expect(tree!.right!.val).toBe(2)
    expect(tree!.right!.left).not.toBeNull()
    expect(tree!.right!.left!.val).toBe(3)
  })

  it('returns null for empty array', () => {
    const tree = arrayToTree([])
    expect(tree).toBeNull()
  })

  it('returns null for [null]', () => {
    const tree = arrayToTree([null])
    expect(tree).toBeNull()
  })
})

describe('treeToArray', () => {
  it('returns level-order array without trailing nulls', () => {
    const tree = arrayToTree([1, null, 2, 3])
    const result = treeToArray(tree)
    expect(result).toEqual([1, null, 2, 3])
  })

  it('returns empty array for null', () => {
    const result = treeToArray(null)
    expect(result).toEqual([])
  })

  it('trims trailing nulls from result', () => {
    const tree = new TreeNode(1)
    tree.left = new TreeNode(2)
    const result = treeToArray(tree)
    expect(result).toEqual([1, 2])
  })
})

describe('Round-trip conversions', () => {
  it('arrayToList then listToArray returns original array', () => {
    const original = [1, 2, 3, 4, 5]
    const list = arrayToList(original)
    const result = listToArray(list)
    expect(result).toEqual(original)
  })

  it('arrayToTree then treeToArray returns original array (trimmed)', () => {
    const original = [1, null, 2, 3]
    const tree = arrayToTree(original)
    const result = treeToArray(tree)
    expect(result).toEqual(original)
  })
})
