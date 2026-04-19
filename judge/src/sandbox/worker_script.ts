export const WORKER_CODE = `
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
  tick(ms) {
    this.currentTime += ms;
    const toExecute = [];
    for (const [id, timer] of this.timers.entries()) {
      if (timer.executeAt <= this.currentTime) {
        toExecute.push({ id, ...timer });
      }
    }
    toExecute.sort((a, b) => a.executeAt - b.executeAt);
    for (const timer of toExecute) {
      this.timers.delete(timer.id);
      timer.cb(...timer.args);
    }
  }
}

function arrayToList(arr) {
  if (!arr || arr.length === 0) return null;
  const head = { val: arr[0], next: null };
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null };
    current = current.next;
  }
  return head;
}

function listToArray(head) {
  const arr = [];
  let current = head;
  while (current) {
    arr.push(current.val);
    current = current.next;
  }
  return arr;
}

function arrayToTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      node.left = { val: arr[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = { val: arr[i], left: null, right: null };
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

// Secure Node.js specific globals in worker_threads
if (typeof globalThis !== 'undefined') {
  globalThis.process = undefined;
  globalThis.require = undefined;
  globalThis.module = undefined;
  globalThis.__dirname = undefined;
  globalThis.__filename = undefined;
}

function sendResult(result) {
  try {
    if (parentPort) {
      parentPort.postMessage(result);
    } else {
      self.postMessage(result);
    }
  } catch (err) {
    // Handle cloning errors (e.g. if returning globalThis or process)
    const errResult = { success: false, error: "Result could not be cloned: " + err.message, meta: result.meta };
    if (parentPort) parentPort.postMessage(errResult);
    else self.postMessage(errResult);
  }
}

async function runTest(e) {
  const { contract, testCase, fnCode } = e.data ? e.data : e;
  
  try {
    if (contract.context && contract.context.disableNative) {
      for (const path of contract.context.disableNative) {
        const parts = path.split('.');
        let curr = globalThis;
        for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
        curr[parts[parts.length - 1]] = undefined;
      }
    }

    let actual;
    let meta = {};

    if (contract.runner === 'method-call') {
      const target = eval(testCase.input.target);
      target[contract.entry.name] = eval(fnCode);
      const args = (testCase.input.args || []).map(a => eval(a));
      actual = target[contract.entry.name](...args);
    } 
    else if (contract.runner === 'function-call') {
      const fn = eval(fnCode);
      const helpers = contract.context && contract.context.helpers ? contract.context.helpers : [];
      
      let rawInput = eval(testCase.input.target);
      let input = rawInput;
      if (helpers.includes('arrayToList')) input = arrayToList(rawInput);
      if (helpers.includes('arrayToTree')) input = arrayToTree(rawInput);

      const args = (testCase.input.args || []).map(a => {
        let v = eval(a);
        if (helpers.includes('arrayToList')) return arrayToList(v);
        if (helpers.includes('arrayToTree')) return arrayToTree(v);
        return v;
      });

      actual = fn(input, ...args);

      if (helpers.includes('listToArray')) actual = listToArray(actual);
      if (helpers.includes('treeToArray')) actual = treeToArray(actual);
    }
    else if (contract.runner === 'behavioral') {
      const fn = eval(fnCode);
      const mock_fn = createMockFn();
      const clock = new VirtualClock();
      
      let max_concurrent = 0;
      const tracking_mock = function(...args) {
        mock_fn.apply(this, args);
      };
      Object.defineProperty(tracking_mock, 'callCount', { get: () => mock_fn.callCount });

      clock.install();
      try {
        const delay = testCase.input.target ? parseInt(testCase.input.target, 10) : undefined;
        const wrapped = fn(tracking_mock, delay);

        for (const step of testCase.input.steps || []) {
          if (step.type === 'call') {
            wrapped(...(step.args || []));
          } else if (step.type === 'tick') {
            clock.tick(step.ms);
          } else if (step.type === 'await') {
            await new Promise(r => globalThis.setTimeout ? globalThis.setTimeout(r, 0) : setTimeout(r, 0));
          } else if (step.type === 'assert') {
            const actualAssert = eval(step.check);
            if (JSON.stringify(actualAssert) !== JSON.stringify(step.expected)) {
              throw new Error('Assertion failed: ' + step.check);
            }
          }
        }
        meta.callCount = mock_fn.callCount;
        actual = { callCount: mock_fn.callCount, maxConcurrent: max_concurrent };
      } finally {
        clock.uninstall();
      }
    }
    else if (contract.runner === 'async') {
      const userImpl = eval(fnCode);
      
      // Execute the test target in a scope where userImpl is available
      const OriginalPromise = globalThis.Promise;
      if (contract.entry.name === 'MyPromise' || contract.problemId === 'promise') {
         globalThis.Promise = userImpl;
      }
      
      actual = await (function() {
        const MyPromise = (contract.entry.name === 'MyPromise' || contract.problemId === 'promise') ? userImpl : OriginalPromise;
        const promiseAll = userImpl;
        const promiseRace = userImpl;
        return eval(testCase.input.target);
      })();
      
      if (contract.entry.name === 'MyPromise' || contract.problemId === 'promise') {
         globalThis.Promise = OriginalPromise;
      }
    }

    sendResult({ success: true, actual, meta });
  } catch (err) {
    sendResult({ success: false, error: err.message || String(err), meta: {} });
  }
}

if (parentPort) {
  parentPort.on('message', runTest);
} else {
  self.onmessage = runTest;
}

`
