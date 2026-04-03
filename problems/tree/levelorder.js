/**
 * @description 使用广度优先搜索实现二叉树层序遍历。函数需要从根节点开始，按“从上到下、从左到右”的顺序逐层访问节点，并把每一层节点值收集成一个子数组，最终返回二维数组。实现时要处理空树、只有一层的树，以及不同层宽度不一致的情况。
 * @approach
 * 使用队列维护当前待访问节点；每轮循环先记录当前层节点数，只消费这一层的节点并收集它们的值，同时把下一层的左右子节点按顺序加入队列，从而实现按层输出。
 * @params
 * root：二叉树根节点；如果为 null，表示输入是一棵空树。
 * @return
 * 返回一个二维数组，其中每个子数组表示一层的节点值，层与层之间保持从上到下的顺序。
 */
function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

/**
 * 二叉树层序遍历（分层输出，二维数组）
 * @param {TreeNode} root - 二叉树根节点
 * @returns {Array} 每层节点作为子数组的二维数组
 */
function levelOrderWithLevels(root) {
  if (!root) return [];

  const result = [];
  let queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    const nextQueue = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue[i];
      currentLevel.push(node.val);
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }

    result.push(currentLevel);
    queue = nextQueue;
  }

  return result;
}
