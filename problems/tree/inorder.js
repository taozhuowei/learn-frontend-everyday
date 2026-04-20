/**
 * @description 使用递归方式实现二叉树中序遍历。函数需要接收根节点，按照“左子树 -> 根节点 -> 右子树”的顺序访问整棵树，并把访问结果按顺序收集到数组中返回。实现时要处理空树、只有单个节点的树，以及左右子树深度不同的情况。
 * @approach
 * 1. 递归版本直接按照中序规则访问左右子树和当前节点，代码最直观。
 * 2. 递归过程中把访问到的节点值依次推入结果数组。
 * 3. 同时提供迭代版本，使用栈来模拟递归调用栈，方便理解非递归写法。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按中序遍历顺序组成的数组。
 */
function inorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) {
      return;
    }

    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

/**
 * @description 使用显式栈实现二叉树中序遍历。目标仍然是按“左子树 -> 根节点 -> 右子树”的顺序返回节点值，但这一版不能依赖函数递归调用，而是要手动维护遍历路径。实现时要处理空树，并保证输出顺序与递归版本完全一致。
 * @approach
 * 1. 先一路向左，把沿途节点全部压栈。
 * 2. 弹出栈顶节点时，说明它的左子树已经处理完，可以记录当前值。
 * 3. 然后转向该节点的右子树，重复同样过程。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按中序遍历顺序组成的数组。
 */
function inorderTraversalIterative(root) {
  if (!root) {
    return [];
  }

  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }

    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }

  return result;
}

export default inorderTraversal;
