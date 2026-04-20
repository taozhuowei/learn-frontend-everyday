/**
 * @description 使用迭代方式反转单链表。函数需要把链表中每个节点的 next 指针方向逐个翻转，让原来的尾节点变成新的头节点。实现时要正确处理空链表、只有一个节点的链表，以及反转过程中不能丢失后续节点引用的问题。
 * @approach
 * 1. 使用 prev 保存已经反转好的前半段链表头节点。
 * 2. 使用 current 指向当前待处理节点，next 临时保存后继节点。
 * 3. 每轮先保存 next，再把 current.next 指回 prev，最后整体向前推进三个指针。
 * @params
 * head：待反转链表的头节点。
 * @return
 * 返回反转后的链表头节点。
 */
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

/**
 * @description 使用递归方式反转单链表。函数需要先让更靠后的子链表完成反转，再在回溯阶段把当前节点接到已经反转好的链表尾部，最终返回新的头节点。实现时要处理空链表和单节点链表，并在回溯时断开旧的 next 指向，避免形成环。
 * @approach
 * 1. 递归出口是空节点或单节点，此时它本身就是反转后的头节点。
 * 2. 先递归反转 head.next 后面的链表，拿到新的头节点。
 * 3. 回溯时把当前节点挂到原下一个节点的后面，再断开当前节点旧的 next 指向。
 * @params
 * head：待反转链表的头节点。
 * @return
 * 返回反转后的链表头节点。
 */
function reverseListRecursive(head) {
  if (!head || !head.next) {
    return head;
  }

  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}

export default reverseList;
