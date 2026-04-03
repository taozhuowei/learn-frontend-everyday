/**
 * @description 使用中序遍历规则验证一棵二叉树是否是合法的二叉搜索树。合法 BST 需要满足：任意节点左子树中的值都严格小于当前节点，右子树中的值都严格大于当前节点，因此整棵树的中序遍历结果应该是严格递增的。实现时要处理空树、只有一个节点的树、以及某个深层节点破坏 BST 条件的情况。
 * @approach
 * 1. 对 BST 来说，中序遍历得到的节点值序列必须严格递增。
 * 2. 使用 prev 记录上一个访问过的节点值。
 * 3. 遍历过程中一旦发现当前值小于等于 prev，就可以提前判定整棵树非法。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 如果是有效 BST 返回 true，否则返回 false。
 */
function isValidBST(root) {
  let prev = null;
  let isValid = true;

  function inorder(node) {
    if (!node || !isValid) {
      return;
    }

    inorder(node.left);

    if (prev !== null && node.val <= prev) {
      isValid = false;
      return;
    }
    prev = node.val;

    inorder(node.right);
  }

  inorder(root);
  return isValid;
}

/**
 * @description 使用上下界递归约束验证一棵二叉树是否满足 BST 条件。函数需要在遍历过程中持续记录当前节点允许落入的最小值和最大值，只要某个节点越过了这个合法区间，就说明整棵树不是二叉搜索树。实现时要正确处理空树，以及非法节点可能出现在任意深层位置的情况。
 * @approach
 * 1. 递归时为每个节点携带最小值和最大值边界。
 * 2. 当前节点必须严格大于最小边界，且严格小于最大边界。
 * 3. 左子树继承上界为当前节点值，右子树继承下界为当前节点值。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 如果是有效 BST 返回 true，否则返回 false。
 */
function isValidBSTRecursive(root) {
  function validate(node, min, max) {
    if (!node) {
      return true;
    }

    if (
      (min !== null && node.val <= min) ||
      (max !== null && node.val >= max)
    ) {
      return false;
    }

    return (
      validate(node.left, min, node.val) && validate(node.right, node.val, max)
    );
  }

  return validate(root, null, null);
}
