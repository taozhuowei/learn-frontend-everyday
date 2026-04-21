/**
 * @description 反转链表
 * @approach 双指针迭代
 * @params head 头节点
 * @return 反转后的头节点
 */
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
export default reverseList;
