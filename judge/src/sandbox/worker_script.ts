export const WORKER_CODE = `
"use strict";
// 🛡️ Worker 基础设施隔离 (G2)
const _ReflectApply = Reflect.apply;
const _ArrayMap = Array.prototype.map;
const _ArrayForEach = Array.prototype.forEach;
const _JSONStringify = JSON.stringify;

class ListNode {
  constructor(val, next) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
}

class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

function createMockFn() {
  const mock = function(...args) {
    mock.callCount++;
    mock.calls.push(args);
  };
  mock.callCount = 0;
  mock.calls = [];
  return mock;
}

class VirtualClock {
  constructor() {
    this.currentTime = 0;
    this.timers = new Map();
    this.nextTimerId = 1;
    this.originalSetTimeout = typeof setTimeout !== 'undefined' ? setTimeout : null;
    this.originalClearTimeout = typeof clearTimeout !== 'undefined' ? clearTimeout : null;
    this.originalDateNow = typeof Date !== 'undefined' ? Date.now : null;
  }
  install() {
    const self = this;
    globalThis.setTimeout = function(cb, delay, ...args) {
      const id = self.nextTimerId++;
      self.timers.set(id, { cb, executeAt: self.currentTime + (delay || 0), args });
      return id;
    };
    globalThis.clearTimeout = function(id) {
      self.timers.delete(id);
    };
    globalThis.Date.now = function() {
      return self.currentTime;
    };
  }
  uninstall() {
    if (this.originalSetTimeout) globalThis.setTimeout = this.originalSetTimeout;
    if (this.originalClearTimeout) globalThis.clearTimeout = this.originalClearTimeout;
    if (this.originalDateNow) globalThis.Date.now = this.originalDateNow;
  }
  async tick(ms) {
    const targetTime = this.currentTime + ms;
    while (this.currentTime < targetTime) {
       let nextJump = targetTime;
       for (const timer of this.timers.values()) {
          if (timer.executeAt > this.currentTime && timer.executeAt < nextJump) {
             nextJump = timer.executeAt;
          }
       }
       this.currentTime = nextJump;
       
       const toExecute = [];
       for (const [id, timer] of this.timers.entries()) {
         if (timer.executeAt <= this.currentTime) {
           toExecute.push({ id, ...timer });
         }
       }
       if (toExecute.length > 0) {
         toExecute.sort((a, b) => a.executeAt - b.executeAt);
         _ReflectApply(_ArrayForEach, toExecute, [timer => {
           this.timers.delete(timer.id);
           if (typeof timer.cb === 'function') timer.cb(...timer.args);
         }]);
       }
       await new Promise(r => setTimeout(r, 0));
    }
  }
}

function arrayToList(arr, pos = -1) {
  if (!arr || arr.length === 0) return null;
  const nodes = _ReflectApply(_ArrayMap, arr, [v => new ListNode(v)]);
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }
  return nodes[0];
}

function listToArray(head) {
  const arr = [];
  let current = head;
  const visited = new Set();
  while (current) {
    if (visited.has(current)) break;
    visited.add(current);
    arr.push(current.val);
    current = current.next;
  }
  return arr;
}

function arrayToTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

const parentPort = typeof require !== 'undefined' ? require('worker_threads').parentPort : null;

if (typeof globalThis !== 'undefined') {
  globalThis.process = undefined;
  globalThis.require = undefined;
}

function sendResult(result) {
  try {
    if (parentPort) {
      parentPort.postMessage(result);
    } else {
      self.postMessage(result);
    }
  } catch (err) {
    const replacer = (k, v) => {
       if (typeof v === 'function') return '[Function]';
       if (v instanceof Date) return v.toISOString();
       if (typeof v === 'number' && isNaN(v)) return 'NaN';
       if (v === globalThis) return '[Global]';
       return v;
    };
    try {
      const sanitizedActual = JSON.parse(_ReflectApply(_JSONStringify, JSON, [result.actual, replacer]));
      const sanitizedResult = { ...result, actual: sanitizedActual };
      if (parentPort) parentPort.postMessage(sanitizedResult);
      else self.postMessage(sanitizedResult);
    } catch (e) {
      const errResult = { success: true, actual: "[Result]", error: err.message, meta: result.meta };
      if (parentPort) parentPort.postMessage(errResult);
      else self.postMessage(errResult);
    }
  }
}

const OriginalArrayPrototype = { ...Array.prototype };

function restorePrototypes() {
  const arrayMethods = ['filter', 'map', 'reduce', 'forEach', 'flat', 'push', 'pop', 'shift', 'unshift'];
  _ReflectApply(_ArrayForEach, arrayMethods, [m => {
    if (OriginalArrayPrototype[m]) Array.prototype[m] = OriginalArrayPrototype[m];
  }]);
}

function safeEval(code) {
  if (code === undefined || code === null) return code;
  try {
    const trimmed = code.trim();
    if (trimmed.startsWith('function') || (trimmed.startsWith('(') && trimmed.includes('function'))) {
       return eval('(' + trimmed + ')');
    }
    if (trimmed.startsWith('{') && !trimmed.includes(';')) return eval('(' + trimmed + ')');
    return eval(trimmed);
  } catch (e) {
    throw e;
  }
}

async function runTest(e) {
  const { contract, testCase, fnCode } = e.data ? e.data : e;
  
  try {
    restorePrototypes();

    if (contract.context && contract.context.disableNative) {
      _ReflectApply(_ArrayForEach, contract.context.disableNative, [path => {
        const parts = path.split('.');
        let curr = globalThis;
        for (let i = 0; i < parts.length - 1; i++) {
          if (curr[parts[i]]) curr = curr[parts[i]];
        }
        curr[parts[parts.length - 1]] = undefined;
      }]);
    }

    let actual;
    let meta = {};

    const MyPromise = globalThis.Promise;
    const userImpl = eval(fnCode);
    globalThis.__CF_USER_IMPL__ = userImpl;
    
    const problemContext = {
       MyPromise: (contract.problemId === 'promise' || contract.entry.type === 'class') ? userImpl : MyPromise,
       Scheduler: userImpl,
       TaskQueue: userImpl,
       promiseAll: userImpl,
       promiseRace: userImpl,
       curry: userImpl,
       deepCopy: userImpl,
       deepClone: userImpl
    };

    Object.assign(globalThis, problemContext);

    if (contract.runner === 'method-call') {
      const target = safeEval(testCase.input.target);
      if (contract.entry.type === 'prototype' && contract.entry.host) {
         globalThis[contract.entry.host].prototype[contract.entry.name] = userImpl;
      } else {
         target[contract.entry.name] = userImpl;
      }
      const args = _ReflectApply(_ArrayMap, testCase.input.args || [], [a => safeEval(a)]);
      const thisArg = testCase.input.thisArg ? safeEval(testCase.input.thisArg) : target;
      actual = _ReflectApply(target[contract.entry.name], thisArg, args);
    } 
    else if (contract.runner === 'function-call') {
      const fn = userImpl;
      const helpers = contract.context && contract.context.helpers ? contract.context.helpers : [];
      let rawInput = safeEval(testCase.input.target);
      const originalArgs = testCase.input.args || [];
      const args = _ReflectApply(_ArrayMap, originalArgs, [a => safeEval(a)]);
      
      let input = rawInput;
      if (helpers.includes('arrayToList')) {
        const pos = args.length > 0 && typeof args[0] === 'number' ? args.shift() : -1;
        input = arrayToList(rawInput, pos);
        for (let i = 0; i < args.length; i++) {
          if (Array.isArray(args[i])) args[i] = arrayToList(args[i]);
        }
      } else if (helpers.includes('arrayToTree')) {
        input = arrayToTree(rawInput);
      }
      
      if (contract.entry.type === 'class') {
        actual = new fn(input, ...args);
      } else {
        actual = _ReflectApply(fn, null, [input, ...args]);
      }
      
      if ((contract.problemId === 'curry' || contract.problemId === 'myCurry') && typeof actual === 'function' && args.length > 0) {
         let curried = actual;
         _ReflectApply(_ArrayForEach, args, [arg => { 
           if (typeof curried === 'function') curried = _ReflectApply(curried, null, [arg]); 
         }]);
         actual = curried;
      }
      if (helpers.includes('listToArray')) actual = listToArray(actual);
      if (helpers.includes('treeToArray')) actual = treeToArray(actual);
    }
    else if (contract.runner === 'behavioral') {
      const fn = userImpl;
      const mock_fn = createMockFn();
      const clock = new VirtualClock();
      const tracking_mock = function(...args) { _ReflectApply(mock_fn, this, args); };
      Object.defineProperty(tracking_mock, 'callCount', { get: () => mock_fn.callCount });
      clock.install();
      try {
        const delay = testCase.input.target ? parseInt(testCase.input.target, 10) : undefined;
        const isClass = (contract.entry.type === 'class' || (typeof fn === 'function' && /^\s*class\s+/.test(fn.toString())));
        let wrapped = isClass 
           ? new fn(tracking_mock, delay) 
           : _ReflectApply(fn, null, [tracking_mock, delay]);
        
        for (const step of (testCase.input.steps || [])) {
          if (step.type === 'call') {
            if (typeof wrapped === 'function') _ReflectApply(wrapped, null, step.args || []);
            else if (wrapped && typeof wrapped[contract.entry.name] === 'function') _ReflectApply(wrapped[contract.entry.name], wrapped, step.args || []);
            else if (wrapped && typeof wrapped.add === 'function') _ReflectApply(wrapped.add, wrapped, step.args || []);
          } else if (step.type === 'tick') {
            await clock.tick(step.ms);
          } else if (step.type === 'await') {
            await new Promise(r => setTimeout(r, 100));
          } else if (step.type === 'assert') {
            const actualAssert = safeEval(step.check);
            if (_ReflectApply(_JSONStringify, JSON, [actualAssert]) !== _ReflectApply(_JSONStringify, JSON, [step.expected])) {
               throw new Error('Assertion failed: ' + step.check);
            }
          }
        }
        meta.callCount = mock_fn.callCount;
        actual = { callCount: mock_fn.callCount };
      } finally { clock.uninstall(); }
    }
    else if (contract.runner === 'async') {
      const OriginalPromise = globalThis.Promise;
      if (contract.problemId === 'promise') globalThis.Promise = userImpl;
      actual = await safeEval(testCase.input.target);
      if (contract.problemId === 'promise') globalThis.Promise = OriginalPromise;
    }

    sendResult({ success: true, actual, meta });
  } catch (err) {
    sendResult({ success: false, error: err.message || String(err), meta: {} });
  }
}

if (parentPort) parentPort.on('message', runTest);
else self.onmessage = runTest;
`;
