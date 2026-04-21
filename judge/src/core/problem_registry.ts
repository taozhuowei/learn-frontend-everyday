import type { ProblemContract } from "./types";

const contracts = new Map<string, ProblemContract>();

export function getContract(problemId: string): ProblemContract | undefined {
  return contracts.get(problemId);
}

export function registerContract(
  problemId: string,
  contract: ProblemContract,
): void {
  contracts.set(problemId, contract);
}

// Register Array polyfills
registerContract("filter", {
  entry: { type: "prototype", name: "myFilter", host: "Array" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Array.prototype.filter"] },
});

registerContract("map", {
  entry: { type: "prototype", name: "myMap", host: "Array" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Array.prototype.map"] },
});

registerContract("reduce", {
  entry: { type: "prototype", name: "myReduce", host: "Array" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Array.prototype.reduce"] },
});

registerContract("forEach", {
  entry: { type: "prototype", name: "myForEach", host: "Array" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Array.prototype.forEach"] },
});

registerContract("flat", {
  entry: { type: "prototype", name: "myFlat", host: "Array" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Array.prototype.flat"] },
});

// Register Function polyfills
registerContract("call", {
  entry: { type: "prototype", name: "myCall", host: "Function" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Function.prototype.call"] },
});

registerContract("apply", {
  entry: { type: "prototype", name: "myApply", host: "Function" },
  runner: "method-call",
  validator: "deep-equal",
  context: { disableNative: ["Function.prototype.apply"] },
});

registerContract("bind", {
  entry: { type: "prototype", name: "myBind", host: "Function" },
  runner: "async",
  validator: "deep-equal",
  context: { disableNative: ["Function.prototype.bind"] },
});

// Register Object problems
registerContract("new", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

registerContract("instanceof", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

registerContract("deep_copy", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

registerContract("extends", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

// Register Utility functions
registerContract("curry", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

registerContract("flatten", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

registerContract("deepClone", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
});

// Register Behavioral utilities
registerContract("debounce", {
  entry: { type: "export", name: "default" },
  runner: "behavioral",
  validator: "behavioral",
  context: { virtualClock: true },
});

registerContract("throttle", {
  entry: { type: "export", name: "default" },
  runner: "behavioral",
  validator: "behavioral",
  context: { virtualClock: true },
});

registerContract("scheduler", {
  entry: { type: "export", name: "default" },
  runner: "behavioral",
  validator: "behavioral",
  context: { virtualClock: true },
});

registerContract("task_queue_runner", {
  entry: { type: "export", name: "default" },
  runner: "behavioral",
  validator: "behavioral",
  context: { virtualClock: true },
});

// Register Linked List problems
registerContract("reverseList", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToList", "listToArray"] },
});

registerContract("mergeTwoLists", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToList", "listToArray"] },
});

registerContract("hasCycle", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToList"] },
});

registerContract("findCycleEntry", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToList"] },
});

// Register Tree problems
registerContract("preorder", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

registerContract("inorder", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

registerContract("postorder", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

registerContract("levelorder", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

registerContract("maxDepth", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

registerContract("isValidBST", {
  entry: { type: "export", name: "default" },
  runner: "function-call",
  validator: "deep-equal",
  context: { helpers: ["arrayToTree"] },
});

// Register Promise problems
registerContract("promise", {
  entry: { type: "class", name: "default" },
  runner: "async",
  validator: "deep-equal",
});

registerContract("promise_all", {
  entry: { type: "export", name: "default" },
  runner: "async",
  validator: "deep-equal",
});

registerContract("promise_race", {
  entry: { type: "export", name: "default" },
  runner: "async",
  validator: "deep-equal",
});
