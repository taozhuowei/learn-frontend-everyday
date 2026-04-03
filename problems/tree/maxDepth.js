/**
 * @description 使用递归方式计算二叉树的最大深度。这里的深度定义为从根节点到最远叶子节点经过的节点层数，因此空树深度为 0，只有根节点的树深度为 1。实现时需要分别考虑左右子树的深度，并返回其中较大的那一侧再加上当前根节点这一层。
 * @approach
 * 1. 空节点深度为 0，作为递归出口。
 * 2. 分别递归计算左子树和右子树的最大深度。
 * 3. 当前节点的深度等于两侧较大值再加 1。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回二叉树的最大深度。
 */
function maxDepth(root) {
  if (!root) {
    return 0;
  }

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
}

/**
 * @description 使用层序遍历计算二叉树最大深度。函数需要按层从上到下遍历整棵树，每处理完一整层就把深度加一，直到所有节点都遍历完成。实现时要处理空树，并保证每一层的节点都只被统计一次。
 * @approach
 * 1. 队列中始终保存当前层的所有节点。
 * 2. 每轮循环先记录当前层节点数，确保只处理这一层。
 * 3. 本层处理结束后，把下一层节点收集起来，并把 depth 加一。
 * @params
 * root：二叉树根节点，空树时传入 null。
 * @return
 * 返回二叉树的最大深度。
 */
function maxDepthBFS(root) {
  if (!root) {
    return 0;
  }

  let depth = 0;
  let queue = [root];

  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    const nextQueue = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue[i];
      if (node.left) {
        nextQueue.push(node.left);
      }
      if (node.right) {
        nextQueue.push(node.right);
      }
    }

    queue = nextQueue;
  }

  return depth;
}
