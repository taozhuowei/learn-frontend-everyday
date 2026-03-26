# NodeJS

## NodeJS 事件循环

### 1. timers 阶段

- 核心任务：执行 `setTimeout()`、`setInterval()` 的到期回调函数；
- 注意点：`setTimeout(cb, 0)` 不是立即执行，而是至少等待 1ms（Node.js 底层限制），回调会被放入 timers 队列，等本轮事件循环的 timers 阶段执行；
- 优先级：高于后续的 pending callbacks、poll 等阶段，但低于微任务。

### 2. pending callbacks 阶段

- 核心任务：执行延迟到下一轮循环的 I/O 回调（比如某些系统级错误的回调，如 TCP 连接失败）；
- 开发者很少直接接触这个阶段，属于 libuv 内部的"兜底"处理。

### 3. idle/prepare 阶段

- 核心任务：仅 Node.js 内部使用（比如准备 poll 阶段的轮询），开发者无需关注。

### 4. poll 阶段（最核心）

这是事件循环停留时间最长的阶段，核心做两件事：

- **执行 I/O 回调**：执行已完成的 I/O 操作的回调（如文件读取、网络请求完成的回调）；
- **等待新的 I/O 事件**：如果 poll 队列为空，事件循环会在这里阻塞等待，直到有新的 I/O 事件触发，或到达 check 阶段的触发条件（比如有 `setImmediate` 回调）。

触发离开 poll 阶段的条件：

- poll 队列清空；
- 有 timers 回调到期；
- 有 `setImmediate` 回调需要执行。

### 5. check 阶段

- 核心任务：执行 `setImmediate()` 的回调函数；
- `setImmediate` 的设计目标：在 poll 阶段结束后立即执行回调，优先级低于 timers 但高于 close callbacks。

### 6. close callbacks 阶段

- 核心任务：执行关闭相关的回调（如 `socket.on('close', cb)`、`fs.close()` 的回调）；
- 本轮事件循环的最后一个阶段，执行完后回到 timers 阶段开始下一轮循环。

## Node.js setTimeout 最低延迟 1ms 的底层原因

Node.js 限制 `setTimeout` 最小延迟为 1ms，本质是为了保障事件循环的公平性，避免定时器回调抢占主线程；同时受底层 libuv 库的轮询精度、操作系统时钟粒度限制，最终在源码层面强制将小于 1ms 的延迟修正为 1ms。

## NodeJS 有哪些全局对象

### global

- 定义：`global` 是 Node.js 中的全局命名空间，在 Node.js REPL 环境中，它是全局对象；在模块中，`global` 对象也可以访问，通过它可以访问到所有的全局变量和函数。
- 使用方式：例如，在模块中通过 `global` 访问全局变量 `process`：`const process = global.process;`，不过通常直接使用 `process` 即可，无需通过 `global`。

### process

- 定义：`process` 对象是一个全局对象，提供了有关当前 Node.js 进程的信息并允许控制该进程。它是 `EventEmitter` 的实例。
- 使用方式：
  - 获取环境变量：通过 `process.env` 获取当前进程的环境变量，如 `const myEnvVar = process.env.MY_VARIABLE;`。
  - 退出进程：使用 `process.exit([code])` 方法，`code` 为退出码，0 表示正常退出，非 0 表示异常退出，例如 `process.exit(1);`。
  - 监听事件：`process` 对象可以监听一些事件，如 `process.on('exit', function() { console.log('进程即将退出'); });`。

### console

- 定义：`console` 是用于打印到标准输出和标准错误的全局对象，提供了一系列用于调试和日志记录的方法。
- 使用方式：
  - 打印信息到控制台：`console.log('普通日志信息');`
  - 打印错误信息：`console.error('错误信息');`，这些错误信息通常会输出到标准错误流。
  - 计时功能：`console.time('test');` 开始计时，`console.timeEnd('test');` 结束计时并输出所花费的时间。

### Buffer

- 定义：`Buffer` 类用于处理二进制数据，在 Node.js 中，它是一个全局变量，可以直接使用。`Buffer` 实例类似于整数数组，但对应于 V8 堆外的一块原始内存。
- 使用方式：
  - 创建 `Buffer` 实例：可以通过多种方式创建，如 `const buf = Buffer.from('hello', 'utf8');` 将字符串转换为 `Buffer` 实例。`const buf2 = Buffer.alloc(10);` 创建一个指定长度的 `Buffer` 实例，初始值为 0。
  - 操作 `Buffer` 数据：`buf.write('world', 0);` 在 `Buffer` 指定位置写入数据。`buf.toString('utf8');` 将 `Buffer` 数据转换为字符串。

### \_\_dirname

- 定义：`__dirname` 是一个全局变量，它返回当前执行脚本所在的目录的完整路径。
- 使用方式：例如在一个模块中，要获取当前模块所在目录下某个文件的路径，可以这样写 `const path = require('path'); const filePath = path.join(__dirname, 'test.txt');`。

### \_\_filename

- 定义：`__filename` 是一个全局变量，它返回当前执行脚本的文件名的完整路径。
- 使用方式：在模块中获取当前模块的完整路径名，比如 `console.log(__filename);` 会输出当前模块的绝对路径。

### setTimeout

- 定义：`setTimeout` 函数用于在指定的毫秒数后执行一个函数。它是 JavaScript 在浏览器和 Node.js 中都有的全局函数。
- 使用方式：`const timeoutId = setTimeout(() => { console.log('延迟执行的代码'); }, 1000);`，返回的 `timeoutId` 可用于取消该定时器，如 `clearTimeout(timeoutId);`。

### setInterval

- 定义：`setInterval` 函数用于按照指定的时间间隔（毫秒）重复执行一个函数。
- 使用方式：`const intervalId = setInterval(() => { console.log('每隔1秒执行一次'); }, 1000);`，同样可以通过 `clearInterval(intervalId);` 来取消该定时器。

## process.env 在 Node.js 中有什么作用？

`process.env` 用于获取当前 Node.js 进程的环境变量。环境变量可以用来配置应用程序的不同运行参数，比如数据库连接字符串、服务器端口等。这样可以在不修改代码的情况下，根据不同的运行环境（开发、测试、生产）设置不同的值，提高应用程序的灵活性和可部署性。

## Buffer 和普通数组有什么区别？

- `Buffer` 用于处理二进制数据，它对应于 V8 堆外的一块原始内存，主要用于与网络、文件系统等进行二进制数据交互。
- 普通数组在 V8 堆内分配内存，主要用于存储 JavaScript 对象和基本数据类型。
- `Buffer` 的操作是针对二进制数据的，如读写字节等，而数组主要用于数据的逻辑组织和操作。
- 此外，`Buffer` 的内存分配和管理方式与普通数组不同，`Buffer` 更注重与底层系统的交互。

## \_\_dirname 和 process.cwd() 有什么区别？

- `__dirname` 返回当前执行脚本所在的目录的完整路径，而 `process.cwd()` 返回 Node.js 进程当前工作目录的路径。
- 如果在一个模块中调用 `__dirname`，它始终是该模块文件所在的目录。而 `process.cwd()` 取决于启动 Node.js 进程时所在的目录，例如在项目根目录启动 Node.js 进程，即使在子目录的模块中调用 `process.cwd()`，返回的也是项目根目录。

## NodeJS 调试

### 使用 console.log 调试

通过在代码中合适的位置添加 `console.log` 语句，将变量的值、程序执行状态等信息输出到控制台，以此来观察程序的运行情况，辅助定位问题。

### Node.js 内置调试器

- 启动调试会话：在命令行中使用 `node inspect <script.js>` 来启动对指定脚本的调试，例如 `node inspect test.js`。这会启动调试会话并暂停在脚本的第一行。
- 设置断点：在调试会话中，可以使用 `break <line_number>` 命令在指定行号设置断点，例如 `break 5` 就在第 5 行设置了断点。也可以使用 `setBreakpoint()` 在当前行设置断点。
- 执行程序：使用 `cont` 命令继续执行程序，当程序执行到断点处会暂停。
- 查看信息：程序暂停时，可以使用 `repl` 命令进入交互式 REPL 环境，在其中查看变量的值，如输入变量名就可以看到其当前值。还可以使用 `backtrace` 命令查看调用栈信息。

### 使用 Chrome DevTools 调试

- 启动 Node.js 应用并开启调试模式：在命令行中使用 `node --inspect <script.js>` 启动应用，例如 `node --inspect test.js`。这会启动应用并监听调试端口（默认 `9229`）。
- 打开 Chrome 浏览器并连接调试：在 Chrome 浏览器地址栏输入 `chrome://inspect`，进入调试界面。在"远程目标"下会显示正在运行的 Node.js 进程，点击"打开专用 DevTools for Node"链接，就会打开 Chrome DevTools 界面。
- 调试操作：在 DevTools 的"Sources"面板中，可以找到 Node.js 脚本文件，在代码中设置断点。当程序运行到断点处暂停，就可以像调试前端 JavaScript 代码一样，查看变量值、调用栈，单步执行代码等。

### 使用 VS Code 调试

VS Code 内置了对 Node.js 的调试支持，主要有两种模式：

#### Launch 模式（启动调试）

由 VS Code 直接启动 Node.js 进程并附加调试器。在项目根目录创建 `.vscode/launch.json` 配置文件，配置 `type: "node"`、`request: "launch"`、`program` 等。配置完成后，在代码中需要暂停的行号左侧点击即可设置断点，然后按 `F5` 启动调试。程序会在断点处暂停，左侧面板可以查看变量值、调用栈、监视表达式等。

#### Attach 模式（附加调试）

先以调试模式启动 Node.js 进程，再由 VS Code 附加上去。适用于调试已经在运行的进程或需要特定启动参数的场景。

1. 启动 Node.js 时添加 `--inspect` 参数（如 `node --inspect app.js` 监听 9229 端口，`--inspect-brk` 在第一行暂停）。
2. 配置 `launch.json` 的 Attach 模式（`request: "attach"`、`port: 9229`）。
3. 按 `F5` 附加调试器到运行中的 Node.js 进程。

#### 常用调试操作

- `F5`：继续执行 / 启动调试
- `F10`：单步跳过（Step Over），执行当前行但不进入函数内部
- `F11`：单步进入（Step Into），进入当前行调用的函数
- `Shift + F11`：单步跳出（Step Out），执行完当前函数并返回调用处
- `Ctrl + Shift + F5`：重启调试
- `Shift + F5`：停止调试

## Node.js 多进程模型

### child_process 模块

用于创建独立的子进程，执行外部命令或 Node.js 脚本。

主要 API：

- `spawn()`：启动一个子进程，返回流，适合处理大量数据。
- `exec()`：启动一个 shell，执行命令，缓存输出。
- `execFile()`：直接执行可执行文件，比 `exec()` 更高效。
- `fork()`：专门用于创建 Node.js 子进程，自动建立 IPC 通道，是实现多进程 Node.js 应用的基础。

### cluster 模块

基于 `child_process.fork()` 封装，用于构建共享同一端口的多进程 Node.js 服务。

模型结构：

- **主进程（Master）**：不处理业务逻辑，负责创建和管理工作进程，实现负载均衡（默认采用轮询策略）。
- **工作进程（Worker）**：每个进程都是独立的 Node.js 实例，拥有自己的事件循环，负责处理客户端请求。

优势：无需修改应用代码即可利用多核 CPU，提升服务吞吐量和可靠性。

### 进程间通信（IPC）实现方式

#### 内置 IPC 通道（推荐）

- 适用场景：通过 `child_process.fork()` 或 `cluster` 创建的父子进程之间。
- 实现原理：Node.js 在创建子进程时，会在父进程和子进程之间建立一个匿名的 Unix 域套接字（或 Windows 上的命名管道），用于高效传递消息。
- API 使用：
  - 发送消息：`process.send(message)`（子进程）或 `child.send(message)`（父进程）。
  - 接收消息：监听 `message` 事件：`process.on('message', (msg) => { ... })`。
- 注意：传递的消息会被序列化为 JSON，因此不能直接传递函数、`Buffer` 等特殊类型。

#### 其他 IPC 方案

- **网络套接字**：使用 TCP/UDP 套接字进行通信，适用于跨机器或非父子关系的进程。
- **共享内存**：通过 `mmap` 或第三方库（如 `shared-memory`）实现，但 Node.js 原生支持有限，多用于高性能场景。
- **文件系统**：通过读写文件或目录作为数据交换的中介，适合大数据量或持久化需求，但效率较低。
- **消息队列**：引入 Redis、RabbitMQ 等中间件，实现异步、解耦的进程间通信。
