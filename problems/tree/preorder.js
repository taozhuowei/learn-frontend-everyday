/**
 * @description 使用递归方式实现二叉树前序遍历。函数需要从根节点开始，按照“根节点 -> 左子树 -> 右子树”的顺序访问所有节点，并把节点值依次收集到数组中返回。实现时要兼容空树、单节点树和左右子树不平衡的情况。
 * @approach
 * 1. 先访问当前节点并记录节点值。
 * 2. 然后递归遍历左子树。
 * 3. 最后递归遍历右子树。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按前序遍历顺序组成的数组。
 */
function preorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) {
      return;
    }

    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

/**
 * @description 使用显式栈实现二叉树前序遍历。目标仍然是按“根节点 -> 左子树 -> 右子树”的顺序返回节点值，但通过手动维护栈来替代递归。实现时要处理空树，并通过正确的入栈顺序保证左子树先于右子树被访问。
 * @approach
 * 1. 栈先放入根节点，每轮弹出一个节点并记录其值。
 * 2. 因为栈是后进先出，所以需要先压入右子节点，再压入左子节点。
 * 3. 这样下一轮弹出时会先处理左子树，顺序与递归前序遍历一致。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按前序遍历顺序组成的数组。
 */
function preorderTraversalIterative(root) {
  if (!root) {
    return [];
  }

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }

  return result;
}
