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
function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 !== null ? list1 : list2;

  return dummy.next;
}

/**
 * @description 使用递归方式合并两个升序链表。函数需要在每一层递归中比较两个头节点，把较小节点作为当前结果头节点，再把剩余部分继续递归合并。实现时同样要处理任意一条链表为空、两边长度不同，以及递归终止后直接返回剩余链表的情况。
 * @approach
 * 1. 递归出口是其中一条链表为空，此时直接返回另一条链表。
 * 2. 比较两个头节点的值，较小节点作为当前层返回结果的头节点。
 * 3. 较小节点的 next 指向“剩余节点继续合并”的递归结果。
 * @params
 * list1：第一条升序链表的头节点。
 * list2：第二条升序链表的头节点。
 * @return
 * 返回合并后的链表头节点。
 */
function mergeTwoListsRecursive(list1, list2) {
  if (!list1) {
    return list2;
  }

  if (!list2) {
    return list1;
  }

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  }

  list2.next = mergeTwoListsRecursive(list1, list2.next);
  return list2;
}
