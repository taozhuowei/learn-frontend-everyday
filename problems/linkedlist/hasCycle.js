/**
 * @description 判断单链表中是否存在环。输入是链表头节点，如果链表中的某个节点 next 最终会重新指回前面已经访问过的节点，就说明该链表带环；如果指针最终会走到 null，则说明无环。实现时需要同时兼顾空链表、只有一个节点的链表，以及环可能从任意位置开始的情况。
 * @approach
 * 使用快慢指针同时从头节点出发；慢指针每次走一步，快指针每次走两步，只要链表里存在环，快指针最终一定会在环内追上慢指针，否则快指针会先走到链表末尾。
 * @params
 * head：待检测链表的头节点；可能为 null，也可能是一条普通链表或带环链表。
 * @return
 * 如果链表中存在环则返回 true；如果不存在环则返回 false。
 */
function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
}

export default hasCycle;
