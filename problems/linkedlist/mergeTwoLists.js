/**
 * @description 使用迭代方式合并两个已经按升序排列的链表。函数需要同时读取 list1 和 list2 的当前节点，把较小值对应的节点依次接到结果链表尾部，最终得到一条新的升序链表。实现时要正确处理其中一条链表为空、两条链表长度不同、以及某一方先遍历完毕后直接拼接剩余节点的情况。
 * @approach
 * 1. 创建哑节点统一处理头节点拼接逻辑，避免第一步需要单独分支。
 * 2. 用 tail 始终指向新链表末尾，每次把较小节点接到 tail 后面。
 * 3. 当任意一条链表遍历结束时，直接把另一条链表剩余部分整体接上。
 * @params
 * list1：第一条升序链表的头节点。
 * list2：第二条升序链表的头节点。
 * @return
 * 返回合并后的链表头节点。
 */
function mergeTwoLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}

export default mergeTwoLists;
