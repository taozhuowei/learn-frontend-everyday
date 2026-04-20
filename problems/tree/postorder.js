/**
 * @description 使用递归方式实现二叉树后序遍历。函数需要按照“左子树 -> 右子树 -> 根节点”的顺序访问整棵树，并把节点值依次收集到数组中返回。实现时要处理空树、单节点树，以及左右子树层级不一致的情况。
 * @approach
 * 1. 先递归遍历左子树。
 * 2. 再递归遍历右子树。
 * 3. 最后记录当前节点值，保证根节点最后被访问。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按后序遍历顺序组成的数组。
 */
function postorderTraversal(root) {
  const result = [];

  function traverse(node) {
    if (!node) {
      return;
    }

    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }

  traverse(root);
  return result;
}

/**
 * @description 使用迭代方式实现二叉树后序遍历。它通过先生成“根 -> 右 -> 左”的访问序列，再整体反转结果，得到真正的“左 -> 右 -> 根”顺序。实现时要处理空树，并确保手动栈版本的输出与递归版保持一致。
 * @approach
 * 1. 先按“根 -> 左 -> 右”的镜像顺序把节点值压入结果数组。
 * 2. 为了得到这个镜像顺序，栈中要先压左子节点，再压右子节点。
 * 3. 最终把结果数组整体反转，就能得到标准后序遍历顺序。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回按后序遍历顺序组成的数组。
 */
function postorderTraversalIterative(root) {
  if (!root) {
    return [];
  }

  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    if (node.left) {
      stack.push(node.left);
    }
    if (node.right) {
      stack.push(node.right);
    }
  }

  return result.reverse();
}

export default postorderTraversal;
