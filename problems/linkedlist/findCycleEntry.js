/**
 * @description 找出单链表中环的入口节点。如果链表带环，需要返回第一次进入这个环的位置；如果链表无环，则返回 null。实现时要处理空链表、单节点链表，以及入口节点可能恰好是头节点或位于链表中间的情况。
 * @approach
 * 先使用快慢指针判断链表是否存在环并找到第一次相遇点；一旦相遇，让其中一个指针回到头节点，两个指针再以相同速度前进，它们下一次相遇的节点就是环的入口。
 * @params
 * head：待查找的链表头节点，可能是空链表，也可能是一条带环链表。
 * @return
 * 如果链表存在环则返回环入口节点；如果不存在环则返回 null。
 */
function detectCycle(head) {
  if (!head || !head.next) return null;

  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      let ptr1 = head;
      let ptr2 = slow;

      while (ptr1 !== ptr2) {
        ptr1 = ptr1.next;
        ptr2 = ptr2.next;
      }

      return ptr1;
    }
  }

  return null;
}

export default detectCycle;
