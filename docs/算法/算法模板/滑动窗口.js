/**
 * 不定长滑动窗口模板 1：
 * 条件越难满足，窗口越长越容易失效。
 * 这类题通常要求“最长”“最大”结果，例如最长子数组、最大窗口长度。
 *
 * 使用方式：
 * 1. 右指针不断向右扩张窗口，并维护窗口内统计信息。
 * 2. 当窗口不再满足条件时，持续移动左指针缩小窗口，直到重新合法。
 * 3. 每次窗口重新合法后，用当前窗口更新答案。
 *
 * @param {Array<unknown>} arr 原始数组或字符串拆分后的字符数组。
 * @returns {number} 满足条件时得到的最长长度或最大结果。
 */
function longestWindowTemplate(arr) {
  let left = 0;
  let answer = 0;

  for (let right = 0; right < arr.length; right++) {
    // 1. 把 arr[right] 纳入窗口，并更新窗口统计信息。

    while (false) {
      // 2. 当窗口不满足条件时，移除 arr[left] 对窗口的影响。
      left++;
    }

    // 3. 当窗口重新满足条件后，用当前窗口更新答案。
    answer = Math.max(answer, right - left + 1);
  }

  return answer;
}

/**
 * 不定长滑动窗口模板 2：
 * 条件越容易满足，窗口越长越容易保持合法。
 * 这类题通常要求“最短”“最小”结果，例如最短子数组、最小窗口长度。
 *
 * 使用方式：
 * 1. 右指针不断向右扩张窗口，并维护窗口内统计信息。
 * 2. 当窗口已经满足条件时，尽量移动左指针继续缩小窗口。
 * 3. 在每次窗口仍然满足条件时，用当前窗口更新最小答案。
 *
 * @param {Array<unknown>} arr 原始数组或字符串拆分后的字符数组。
 * @returns {number} 满足条件时得到的最短长度或最小结果；没有合法答案时返回 0。
 */
function shortestWindowTemplate(arr) {
  let left = 0;
  let minLength = Infinity;

  for (let right = 0; right < arr.length; right++) {
    // 1. 把 arr[right] 纳入窗口，并更新窗口统计信息。

    while (false) {
      minLength = Math.min(minLength, right - left + 1);

      // 2. 当窗口仍然满足条件时，移除 arr[left] 对窗口的影响。
      left++;
    }
  }

  return Number.isFinite(minLength) ? minLength : 0;
}
