import type { KnowledgeArticle } from '../types/content'

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    "slug": "001-前端ai_agent",
    "title": "前端AI Agent",
    "category": "AI",
    "sourcePath": "docs/AI/前端AI_Agent.md",
    "markdown": "# 前端AI Agent\n\n## SSE和WebSocket\n\n- **SSE（Server-Sent Events）：** 单向通信（服务器→客户端），基于HTTP/1.1的`text/event-stream`，浏览器内置自动重连，仅支持纯文本（UTF-8）。\n- **WebSocket：** 全双工双向通信，独立协议`ws://`/`wss://`通过HTTP升级握手建立，需手动实现重连，支持文本和二进制数据。\n\n**AI流式输出为何常用SSE：**\n\n- 大模型逐token生成，天然是服务端单向推送场景，无需客户端向服务端发流式数据。\n- SSE基于HTTP，无需额外协议支持，兼容性好，易于穿透代理/CDN。\n- 使用`EventSource` API即可接入，实现简单。\n\n## Prompt Engineering和Prompt封装\n\n**Prompt Engineering** 是通过设计和优化输入提示词，引导大模型产出更准确、可控的结果。\n\n- **系统提示（System Prompt）：** 设定模型角色、行为约束和输出格式，如\"你是一个前端技术专家，用中文回答\"。\n- **用户提示（User Prompt）：** 用户的实际问题或指令。\n- **Few-shot 示例：** 在提示中提供输入-输出示例，让模型学习期望的回答模式。\n- **思维链（Chain of Thought）：** 引导模型分步推理，提高复杂问题的准确率。\n\n**Prompt封装** 是前端工程化实践：\n\n- **模板化：** 将Prompt拆分为固定模板 + 动态变量，如`` `请将以下内容翻译为${targetLang}：${text}` ``。\n- **变量注入：** 将用户输入、上下文信息、历史消息等动态注入模板中。\n- **版本管理：** 对Prompt模板进行版本控制，支持A/B测试和迭代优化。\n\n## AI Agent基本架构\n\nAI Agent是一种能自主感知环境、推理决策并执行行动的智能系统，核心是**感知-推理-行动**循环。\n\n- **感知（Perception）：** 接收用户输入、环境信息、工具返回结果等作为上下文。\n- **推理（Reasoning）：** 大模型根据上下文进行推理，决定下一步行动（如直接回复、调用工具、请求更多信息）。\n- **行动（Action）：** 执行推理结果，如调用API、搜索数据库、生成代码等。\n- **工具调用（Tool Use / Function Calling）：** Agent通过结构化格式调用外部工具（搜索、计算、数据库查询等），扩展自身能力。\n- **记忆系统（Memory）：** 短期记忆（当前对话上下文）和长期记忆（向量数据库存储的历史知识）。\n- **RAG（Retrieval-Augmented Generation）：** 检索增强生成，在推理前从知识库中检索相关文档，注入Prompt作为上下文，减少幻觉。\n\n典型执行流程：用户提问 → 检索相关知识 → 构建Prompt → 模型推理 → 判断是否需要工具调用 → 执行工具 → 整合结果 → 返回用户。\n\n## AI消息长列表渲染优化\n\nAI对话场景中消息可能非常长且包含复杂内容（Markdown、代码块），需要专门的渲染优化策略。\n\n- **虚拟滚动（Virtual Scrolling）：** 只渲染可视区域内的消息DOM节点，超出视口的消息用占位元素代替，大幅减少DOM数量。可使用`react-virtuoso`、`react-window`等库。\n- **增量渲染：** 对话加载时先渲染最近的消息，历史消息在用户上滑时懒加载（分页加载或无限滚动）。\n- **流式追加（Streaming Append）：** 模型流式输出时，将token逐步追加到最后一条消息的DOM上，避免每次token到达都重新渲染整个消息列表。\n- **Markdown解析缓存：** 对已完成的消息缓存其Markdown渲染结果，避免重复解析。\n- **`React.memo` / `useMemo`：** 对历史消息组件做记忆化，确保只有正在流式输出的最新消息会重渲染。\n\n## WebWorker在AI应用中的使用场景\n\nWeb Worker在独立线程中运行JavaScript，不阻塞主线程UI渲染，适用于AI应用中的计算密集型任务。\n\n- **Markdown/LaTeX解析：** AI回复通常含大量Markdown和数学公式，解析渲染（如`marked`、`KaTeX`）可能耗时较长，放入Worker避免界面卡顿。\n- **代码高亮：** 对AI生成的代码块进行语法高亮（如`highlight.js`、`Prism`）是CPU密集操作，适合在Worker中处理。\n- **数据后处理：** 对模型返回的大量结构化数据进行过滤、排序、聚合等计算。\n- **本地模型推理：** 在浏览器端运行小型模型（如`Transformers.js`）时，推理计算放在Worker中执行。\n- **流式数据处理：** 对SSE流式响应数据的解析、分词、格式化等预处理工作。\n\n## 如何解决AI接口响应时间长导致超时或用户焦虑\n\n- **流式输出（Streaming）：** 使用SSE或`fetch` + `ReadableStream`逐token展示，让用户立即看到响应开始，大幅降低感知等待时间。\n- **骨架屏 / 打字动画：** 在等待首个token期间展示思考动画或骨架屏占位，给予用户即时反馈。\n- **超时重试策略：** 设置合理的超时时间（如30-60秒），超时后自动重试或提示用户重试，使用指数退避避免服务端过载。\n- **取消请求：** 提供\"停止生成\"按钮，通过`AbortController`取消正在进行的`fetch`请求，释放资源并让用户重新提问。\n- **乐观UI更新：** 用户发送消息后立即在界面展示用户消息，不必等待服务端确认。\n- **进度提示：** 对于耗时任务，展示预估剩余时间或已处理步骤。\n\n## React Fiber架构对AI应用渲染复杂UI的帮助\n\nReact Fiber是React 16+引入的协调引擎，将渲染工作拆分为可中断的小单元，对AI应用有以下帮助：\n\n- **可中断渲染（Time Slicing）：** Fiber将reconciliation过程拆分为多个小任务，每帧执行一部分，避免长时间占用主线程。AI流式输出时，大量DOM更新不会阻塞用户的滚动、点击等交互。\n- **优先级调度：** Fiber为不同更新分配优先级。用户输入（如打字）是高优先级，AI消息的流式追加是低优先级，确保用户交互始终流畅。可通过`startTransition`将AI内容更新标记为非紧急。\n- **并发特性（Concurrent Features）：** `useDeferredValue`可延迟更新AI消息的Markdown渲染，`Suspense`可在数据加载时展示fallback UI。\n- **增量渲染：** 流式输出的每个token触发的state更新可以被Fiber批处理和合并，减少不必要的重渲染次数。\n\n## 如何处理大模型对话中的上下文管理\n\n大模型有token上限（如GPT-4 Turbo为128K），对话过长会超出限制或增加成本，需要前端配合后端进行上下文管理。\n\n- **Token计数：** 前端使用`tiktoken`等库估算当前对话的token数量，接近上限时触发裁剪策略。\n- **滑动窗口：** 保留系统提示 + 最近N轮对话，丢弃最早的历史消息，保证上下文在token限制内。\n- **摘要压缩：** 当对话过长时，调用模型将历史消息压缩为一段摘要，替代原始历史放入上下文，保留关键信息同时节省token。\n- **RAG（检索增强生成）：** 将历史对话和文档存入向量数据库，每次提问时检索最相关的片段注入上下文，而非带入全部历史。\n- **分层管理：** 系统提示（固定）+ 长期记忆（摘要/RAG）+ 短期记忆（最近几轮原始对话）组合构建上下文。\n\n## 前端实现多模态输入的预处理\n\n多模态AI模型支持文本、图片、音频等多种输入，前端需在上传前进行预处理以减少传输体积和确保格式兼容。\n\n- **图片压缩与Resize：** 使用`Canvas` API将图片缩放至模型支持的最大分辨率（如2048×2048），通过`canvas.toBlob()`压缩质量（JPEG 0.8），减小体积。\n- **音频转换：** 使用`MediaRecorder` API录音，或通过`AudioContext`将音频转换为模型支持的格式（如WAV 16kHz 16bit单声道）。\n- **文件类型校验：** 前端通过`File.type`和文件头魔数（magic number）双重验证文件类型，防止伪造扩展名。\n- **Base64编码：** 对小文件使用`FileReader.readAsDataURL()`转为Base64，直接嵌入API请求JSON中；大文件优先使用`multipart/form-data`上传。\n- **大小限制与裁剪：** 校验文件大小，超限时提示用户或自动裁剪（如截取音频前60秒、图片降低分辨率）。\n\n## 设计一个企业级AI聊天助手的前端架构，你会考虑哪些模块\n\n- **消息管理模块：** 消息的存储、分页加载、本地缓存（IndexedDB）、消息状态（发送中/成功/失败）管理。\n- **流式渲染引擎：** SSE/fetch stream接入层 + 增量DOM更新 + Markdown/代码块/LaTeX实时渲染。\n- **对话管理：** 多会话切换、会话列表、历史记录搜索、上下文token管理。\n- **插件/工具系统：** 支持Agent工具调用结果的可视化渲染（如图表、表格、卡片），具备插件注册机制以扩展能力。\n- **权限与认证：** 用户身份认证（OAuth/SSO）、基于角色的功能权限控制、API Key管理。\n- **审计与合规：** 对话日志记录、敏感内容过滤（前端初筛 + 后端审核）、数据脱敏展示。\n- **多模态输入：** 图片/文件/音频上传预处理、剪贴板粘贴、拖拽上传。\n- **性能优化：** 虚拟滚动、WebWorker解析、懒加载、CDN静态资源。\n- **可观测性：** 前端埋点（TTFT、TPS、错误率）、用户行为分析、性能监控。\n\n## 评估AI前端产品的性能与用户体验，有哪些关键指标\n\n**性能指标：**\n\n- **TTFT（Time To First Token）：** 从用户发送消息到收到模型第一个token的时间，直接影响用户对响应速度的感知。\n- **TPS（Tokens Per Second）：** 模型每秒输出的token数，决定流式输出的流畅度。\n- **交互延迟（Input Latency）：** 用户在AI输出过程中的交互响应延迟（如滚动、点击按钮），应保持在100ms以内。\n- **渲染帧率（FPS）：** 流式输出期间的页面帧率，低于30FPS用户会感知到卡顿。\n- **内存占用：** 长对话场景下前端内存增长情况，避免内存泄漏。\n\n**用户体验指标：**\n\n- **任务完成率：** 用户通过AI成功完成目标任务的比例。\n- **对话轮次：** 完成任务所需的平均对话轮次，越少说明效率越高。\n- **用户满意度（CSAT）：** 用户对回答质量的评分（如点赞/点踩）。\n- **留存率 / 活跃度：** 用户持续使用AI产品的频率。\n\n## NodeJS对处理AI密集任务的优劣势\n\n**优势：**\n\n- **事件驱动 + 非阻塞IO：** Node.js天然适合IO密集型任务，AI应用中大量场景是调用外部大模型API并等待响应，Node.js可高效处理大量并发请求。\n- **流式处理：** Node.js的`Stream` API天然支持SSE流式转发，作为AI接口的中间层（BFF）非常合适。\n- **前后端统一语言：** TypeScript全栈开发，Prompt模板、类型定义等可前后端复用。\n- **生态丰富：** `langchain.js`、`openai` SDK等AI相关npm包生态完善。\n\n**劣势：**\n\n- **不适合CPU密集型：** 单线程模型下，本地模型推理、大规模数据处理等CPU密集任务会阻塞事件循环。\n- **解决方案：** 使用`Worker Threads`将CPU密集任务分配到独立线程；或使用`child_process`调用Python等语言处理计算密集型任务。\n- **内存限制：** V8默认堆内存有上限（约1.5GB），处理超大上下文或批量推理时可能不足，需通过`--max-old-space-size`调整。\n\n## WebAssembly在浏览器端运行小模型\n\nWebAssembly（Wasm）允许在浏览器中以接近原生的速度运行编译后的代码，使端侧AI推理成为可能。\n\n- **ONNX Runtime Web：** 微软开源的推理引擎，支持将ONNX格式的模型通过Wasm或WebGL/WebGPU后端在浏览器中运行，适用于分类、NLP等轻量模型。\n- **TensorFlow.js：** Google的浏览器端ML框架，支持Wasm后端（`@tensorflow/tfjs-backend-wasm`），可运行TensorFlow/TFLite模型。\n- **Transformers.js：** Hugging Face推出的库，将`transformers` Python库移植到JavaScript，使用ONNX Runtime Web后端，支持文本生成、翻译、情感分析、图像分类等任务，模型从Hugging Face Hub加载。\n\n**典型应用场景：**\n\n- 离线文本分类/情感分析（无需请求服务端）。\n- 隐私敏感场景（数据不离开浏览器）。\n- 输入预处理（如本地OCR、语音转文字预处理）。\n\n**限制：** 模型体积受网络带宽限制（通常需<100MB），推理速度相比GPU服务端仍有差距，适合轻量级任务。\n",
    "headings": [
      {
        "depth": 1,
        "text": "前端AI Agent",
        "slug": "前端ai-agent"
      },
      {
        "depth": 2,
        "text": "SSE和WebSocket",
        "slug": "sse和websocket"
      },
      {
        "depth": 2,
        "text": "Prompt Engineering和Prompt封装",
        "slug": "prompt-engineering和prompt封装"
      },
      {
        "depth": 2,
        "text": "AI Agent基本架构",
        "slug": "ai-agent基本架构"
      },
      {
        "depth": 2,
        "text": "AI消息长列表渲染优化",
        "slug": "ai消息长列表渲染优化"
      },
      {
        "depth": 2,
        "text": "WebWorker在AI应用中的使用场景",
        "slug": "webworker在ai应用中的使用场景"
      },
      {
        "depth": 2,
        "text": "如何解决AI接口响应时间长导致超时或用户焦虑",
        "slug": "如何解决ai接口响应时间长导致超时或用户焦虑"
      },
      {
        "depth": 2,
        "text": "React Fiber架构对AI应用渲染复杂UI的帮助",
        "slug": "react-fiber架构对ai应用渲染复杂ui的帮助"
      },
      {
        "depth": 2,
        "text": "如何处理大模型对话中的上下文管理",
        "slug": "如何处理大模型对话中的上下文管理"
      },
      {
        "depth": 2,
        "text": "前端实现多模态输入的预处理",
        "slug": "前端实现多模态输入的预处理"
      },
      {
        "depth": 2,
        "text": "设计一个企业级AI聊天助手的前端架构，你会考虑哪些模块",
        "slug": "设计一个企业级ai聊天助手的前端架构你会考虑哪些模块"
      },
      {
        "depth": 2,
        "text": "评估AI前端产品的性能与用户体验，有哪些关键指标",
        "slug": "评估ai前端产品的性能与用户体验有哪些关键指标"
      },
      {
        "depth": 2,
        "text": "NodeJS对处理AI密集任务的优劣势",
        "slug": "nodejs对处理ai密集任务的优劣势"
      },
      {
        "depth": 2,
        "text": "WebAssembly在浏览器端运行小模型",
        "slug": "webassembly在浏览器端运行小模型"
      }
    ],
    "searchText": "前端ai agent ai 前端ai agent sse和websocket sse（server sent events）： 单向通信（服务器→客户端），基于http/1.1的text/event stream，浏览器内置自动重连，仅支持纯文本（utf 8）。 websocket： 全双工双向通信，独立协议ws:///wss://通过http升级握手建立，需手动实现重连，支持文本和二进制数据。 ai流式输出为何常用sse： 大模型逐token生成，天然是服务端单向推送场景，无需客户端向服务端发流式数据。 sse基于http，无需额外协议支持，兼容性好，易于穿透代理/cdn。 使用eventsource api即可接入，实现简单。 prompt engineering和prompt封装 prompt engineering 是通过设计和优化输入提示词，引导大模型产出更准确、可控的结果。 系统提示（system prompt）： 设定模型角色、行为约束和输出格式，如\"你是一个前端技术专家，用中文回答\"。 用户提示（user prompt）： 用户的实际问题或指令。 few shot 示例： 在提示中提供输入 输出示例，让模型学习期望的回答模式。 思维链（chain of thought）： 引导模型分步推理，提高复杂问题的准确率。 prompt封装 是前端工程化实践： 模板化： 将prompt拆分为固定模板 + 动态变量，如` 请将以下内容翻译为${targetlang}：${text} 。 变量注入： 将用户输入、上下文信息、历史消息等动态注入模板中。 版本管理： 对prompt模板进行版本控制，支持a/b测试和迭代优化。 ai agent基本架构 ai agent是一种能自主感知环境、推理决策并执行行动的智能系统，核心是 感知 推理 行动 循环。 感知（perception）： 接收用户输入、环境信息、工具返回结果等作为上下文。 推理（reasoning）： 大模型根据上下文进行推理，决定下一步行动（如直接回复、调用工具、请求更多信息）。 行动（action）： 执行推理结果，如调用api、搜索数据库、生成代码等。 工具调用（tool use / function calling）： agent通过结构化格式调用外部工具（搜索、计算、数据库查询等），扩展自身能力。 记忆系统（memory）： 短期记忆（当前对话上下文）和长期记忆（向量数据库存储的历史知识）。 rag（retrieval augmented generation）： 检索增强生成，在推理前从知识库中检索相关文档，注入prompt作为上下文，减少幻觉。 典型执行流程：用户提问 → 检索相关知识 → 构建prompt → 模型推理 → 判断是否需要工具调用 → 执行工具 → 整合结果 → 返回用户。 ai消息长列表渲染优化 ai对话场景中消息可能非常长且包含复杂内容（markdown、代码块），需要专门的渲染优化策略。 虚拟滚动（virtual scrolling）： 只渲染可视区域内的消息dom节点，超出视口的消息用占位元素代替，大幅减少dom数量。可使用react virtuoso、react window等库。 增量渲染： 对话加载时先渲染最近的消息，历史消息在用户上滑时懒加载（分页加载或无限滚动）。 流式追加（streaming append）： 模型流式输出时，将token逐步追加到最后一条消息的dom上，避免每次token到达都重新渲染整个消息列表。 markdown解析缓存： 对已完成的消息缓存其markdown渲染结果，避免重复解析。 react.memo / usememo： 对历史消息组件做记忆化，确保只有正在流式输出的最新消息会重渲染。 webworker在ai应用中的使用场景 web worker在独立线程中运行javascript，不阻塞主线程ui渲染，适用于ai应用中的计算密集型任务。 markdown/latex解析： ai回复通常含大量markdown和数学公式，解析渲染（如marked、katex）可能耗时较长，放入worker避免界面卡顿。 代码高亮： 对ai生成的代码块进行语法高亮（如highlight.js、prism）是cpu密集操作，适合在worker中处理。 数据后处理： 对模型返回的大量结构化数据进行过滤、排序、聚合等计算。 本地模型推理： 在浏览器端运行小型模型（如transformers.js）时，推理计算放在worker中执行。 流式数据处理： 对sse流式响应数据的解析、分词、格式化等预处理工作。 如何解决ai接口响应时间长导致超时或用户焦虑 流式输出（streaming）： 使用sse或fetch + readablestream逐token展示，让用户立即看到响应开始，大幅降低感知等待时间。 骨架屏 / 打字动画： 在等待首个token期间展示思考动画或骨架屏占位，给予用户即时反馈。 超时重试策略： 设置合理的超时时间（如30 60秒），超时后自动重试或提示用户重试，使用指数退避避免服务端过载。 取消请求： 提供\"停止生成\"按钮，通过abortcontroller取消正在进行的fetch请求，释放资源并让用户重新提问。 乐观ui更新： 用户发送消息后立即在界面展示用户消息，不必等待服务端确认。 进度提示： 对于耗时任务，展示预估剩余时间或已处理步骤。 react fiber架构对ai应用渲染复杂ui的帮助 react fiber是react 16+引入的协调引擎，将渲染工作拆分为可中断的小单元，对ai应用有以下帮助： 可中断渲染（time slicing）： fiber将reconciliation过程拆分为多个小任务，每帧执行一部分，避免长时间占用主线程。ai流式输出时，大量dom更新不会阻塞用户的滚动、点击等交互。 优先级调度： fiber为不同更新分配优先级。用户输入（如打字）是高优先级，ai消息的流式追加是低优先级，确保用户交互始终流畅。可通过starttransition将ai内容更新标记为非紧急。 并发特性（concurrent features）： usedeferredvalue可延迟更新ai消息的markdown渲染，suspense可在数据加载时展示fallback ui。 增量渲染： 流式输出的每个token触发的state更新可以被fiber批处理和合并，减少不必要的重渲染次数。 如何处理大模型对话中的上下文管理 大模型有token上限（如gpt 4 turbo为128k），对话过长会超出限制或增加成本，需要前端配合后端进行上下文管理。 token计数： 前端使用tiktoken等库估算当前对话的token数量，接近上限时触发裁剪策略。 滑动窗口： 保留系统提示 + 最近n轮对话，丢弃最早的历史消息，保证上下文在token限制内。 摘要压缩： 当对话过长时，调用模型将历史消息压缩为一段摘要，替代原始历史放入上下文，保留关键信息同时节省token。 rag（检索增强生成）： 将历史对话和文档存入向量数据库，每次提问时检索最相关的片段注入上下文，而非带入全部历史。 分层管理： 系统提示（固定）+ 长期记忆（摘要/rag）+ 短期记忆（最近几轮原始对话）组合构建上下文。 前端实现多模态输入的预处理 多模态ai模型支持文本、图片、音频等多种输入，前端需在上传前进行预处理以减少传输体积和确保格式兼容。 图片压缩与resize： 使用canvas api将图片缩放至模型支持的最大分辨率（如2048×2048），通过canvas.toblob()压缩质量（jpeg 0.8），减小体积。 音频转换： 使用mediarecorder api录音，或通过audiocontext将音频转换为模型支持的格式（如wav 16khz 16bit单声道）。 文件类型校验： 前端通过file.type和文件头魔数（magic number）双重验证文件类型，防止伪造扩展名。 base64编码： 对小文件使用filereader.readasdataurl()转为base64，直接嵌入api请求json中；大文件优先使用multipart/form data上传。 大小限制与裁剪： 校验文件大小，超限时提示用户或自动裁剪（如截取音频前60秒、图片降低分辨率）。 设计一个企业级ai聊天助手的前端架构，你会考虑哪些模块 消息管理模块： 消息的存储、分页加载、本地缓存（indexeddb）、消息状态（发送中/成功/失败）管理。 流式渲染引擎： sse/fetch stream接入层 + 增量dom更新 + markdown/代码块/latex实时渲染。 对话管理： 多会话切换、会话列表、历史记录搜索、上下文token管理。 插件/工具系统： 支持agent工具调用结果的可视化渲染（如图表、表格、卡片），具备插件注册机制以扩展能力。 权限与认证： 用户身份认证（oauth/sso）、基于角色的功能权限控制、api key管理。 审计与合规： 对话日志记录、敏感内容过滤（前端初筛 + 后端审核）、数据脱敏展示。 多模态输入： 图片/文件/音频上传预处理、剪贴板粘贴、拖拽上传。 性能优化： 虚拟滚动、webworker解析、懒加载、cdn静态资源。 可观测性： 前端埋点（ttft、tps、错误率）、用户行为分析、性能监控。 评估ai前端产品的性能与用户体验，有哪些关键指标 性能指标： ttft（time to first token）： 从用户发送消息到收到模型第一个token的时间，直接影响用户对响应速度的感知。 tps（tokens per second）： 模型每秒输出的token数，决定流式输出的流畅度。 交互延迟（input latency）： 用户在ai输出过程中的交互响应延迟（如滚动、点击按钮），应保持在100ms以内。 渲染帧率（fps）： 流式输出期间的页面帧率，低于30fps用户会感知到卡顿。 内存占用： 长对话场景下前端内存增长情况，避免内存泄漏。 用户体验指标： 任务完成率： 用户通过ai成功完成目标任务的比例。 对话轮次： 完成任务所需的平均对话轮次，越少说明效率越高。 用户满意度（csat）： 用户对回答质量的评分（如点赞/点踩）。 留存率 / 活跃度： 用户持续使用ai产品的频率。 nodejs对处理ai密集任务的优劣势 优势： 事件驱动 + 非阻塞io： node.js天然适合io密集型任务，ai应用中大量场景是调用外部大模型api并等待响应，node.js可高效处理大量并发请求。 流式处理： node.js的stream api天然支持sse流式转发，作为ai接口的中间层（bff）非常合适。 前后端统一语言： typescript全栈开发，prompt模板、类型定义等可前后端复用。 生态丰富： langchain.js、openai sdk等ai相关npm包生态完善。 劣势： 不适合cpu密集型： 单线程模型下，本地模型推理、大规模数据处理等cpu密集任务会阻塞事件循环。 解决方案： 使用worker threads将cpu密集任务分配到独立线程；或使用child process调用python等语言处理计算密集型任务。 内存限制： v8默认堆内存有上限（约1.5gb），处理超大上下文或批量推理时可能不足，需通过 max old space size调整。 webassembly在浏览器端运行小模型 webassembly（wasm）允许在浏览器中以接近原生的速度运行编译后的代码，使端侧ai推理成为可能。 onnx runtime web： 微软开源的推理引擎，支持将onnx格式的模型通过wasm或webgl/webgpu后端在浏览器中运行，适用于分类、nlp等轻量模型。 tensorflow.js： google的浏览器端ml框架，支持wasm后端（@tensorflow/tfjs backend wasm），可运行tensorflow/tflite模型。 transformers.js： hugging face推出的库，将transformers` python库移植到javascript，使用onnx runtime web后端，支持文本生成、翻译、情感分析、图像分类等任务，模型从hugging face hub加载。 典型应用场景： 离线文本分类/情感分析（无需请求服务端）。 隐私敏感场景（数据不离开浏览器）。 输入预处理（如本地ocr、语音转文字预处理）。 限制： 模型体积受网络带宽限制（通常需<100mb），推理速度相比gpu服务端仍有差距，适合轻量级任务。"
  },
  {
    "slug": "002-readme",
    "title": "Docs",
    "category": "README.md",
    "sourcePath": "docs/README.md",
    "markdown": "# Docs\n\nKnowledge-base markdown articles. Scanned by `website/scripts/build-content.ts` at build time and served as the \"Theory\" section of the website.\n\n## Directory Structure\n\n```\ndocs/\n├── AI/             AI-related articles\n├── 前端基础/       HTML, CSS, JavaScript fundamentals\n├── 前端框架/       React, Vue framework concepts\n├── 工程化/         Build tools, bundlers, CI/CD\n├── 算法/           Algorithm and data structure theory\n├── 网络/           HTTP, TCP, browser networking\n├── 运行时/         Browser runtime, event loop, V8\n├── 面试准备/       Interview preparation materials\n├── 其他语言/       Non-JavaScript language references\n└── 实践/           Practice-related docs + component launchers\n    ├── with_react/launcher/   React local dev environment\n    └── with_vue/launcher/     Vue local dev environment\n```\n\n## Article Format\n\nStandard Markdown. The first `# Heading` becomes the article title. All headings build the table of contents.\n\nNo special frontmatter or metadata required — the build script extracts everything it needs from the Markdown content.\n\n## Build Integration\n\n- `website/scripts/build-content.ts` scans `docs/**/*.md` (excluding `node_modules`, `dist`, `launcher`).\n- Output: `website/src/generated/knowledge.ts` — array of `KnowledgeArticle` objects with markdown content, headings, and search text.\n- The build caches docs input state; unchanged docs skip regeneration.\n\n## Relationship to Other Modules\n\n- Problem source code and test cases are in [problems/](../problems/README.md), not here.\n- Component launchers (`实践/with_react/launcher`, `实践/with_vue/launcher`) are standalone Vite projects for local development of React/Vue component problems.\n",
    "headings": [
      {
        "depth": 1,
        "text": "Docs",
        "slug": "docs"
      },
      {
        "depth": 2,
        "text": "Directory Structure",
        "slug": "directory-structure"
      },
      {
        "depth": 2,
        "text": "Article Format",
        "slug": "article-format"
      },
      {
        "depth": 2,
        "text": "Build Integration",
        "slug": "build-integration"
      },
      {
        "depth": 2,
        "text": "Relationship to Other Modules",
        "slug": "relationship-to-other-modules"
      }
    ],
    "searchText": "docs readme.md docs knowledge base markdown articles. scanned by website/scripts/build content.ts at build time and served as the \"theory\" section of the website. directory structure article format standard markdown. the first heading becomes the article title. all headings build the table of contents. no special frontmatter or metadata required — the build script extracts everything it needs from the markdown content. build integration website/scripts/build content.ts scans docs/ / .md (excluding node modules, dist, launcher). output: website/src/generated/knowledge.ts — array of knowledgearticle objects with markdown content, headings, and search text. the build caches docs input state; unchanged docs skip regeneration. relationship to other modules problem source code and test cases are in $1, not here. component launchers (实践/with react/launcher, 实践/with vue/launcher) are standalone vite projects for local development of react/vue component problems."
  },
  {
    "slug": "003-cpp",
    "title": "C++",
    "category": "其他语言",
    "sourcePath": "docs/其他语言/CPP.md",
    "markdown": "# C++\n\n## C++特性\n\n**封装：**\n将数据和操作数据的函数封装在一起，形成类。通过访问修饰符（如`public`、`private`、`protected`）控制类成员的访问权限，隐藏内部实现细节，只对外提供接口，提高代码的安全性和可维护性。\n\n**继承：**\n一个类可以继承另一个类的属性和方法。通过继承，子类可以复用父类的代码，同时可以添加自己特有的属性和方法，实现代码的重用和扩展。\n\n**多态：**\n分为编译时多态和运行时多态。\n\n- 编译时多态通过函数重载和模板实现，在编译阶段根据函数参数的不同来确定调用哪个函数。\n- 运行时多态通过虚函数和指针或引用实现，在运行阶段根据对象的实际类型来确定调用哪个虚函数。\n\n## 指针和引用的区别\n\n- **是否可空：** 指针可以为`nullptr`，引用必须在声明时绑定到一个合法对象，不能为空。\n- **是否可重绑定：** 指针可以在生命周期内指向不同的对象，引用一旦绑定就不能再引用其他对象。\n- **是否占内存：** 指针本身是一个变量，占用固定大小的内存（32位系统4字节，64位系统8字节）；引用在语义上是别名，编译器通常用指针实现，但标准未规定其是否占内存。\n- **语法区别：** 指针通过`*`和`->`访问对象，引用直接使用变量名访问，语法上更简洁。\n- **多级关系：** 指针可以有多级（`int**`），引用没有多级引用的概念。\n\n## 数组与指针的区别与联系，函数指针，指针函数，指针数组，数组指针\n\n**数组与指针的区别与联系：** 数组名在大多数表达式中会退化为指向首元素的指针，但`sizeof`数组返回整个数组大小，而`sizeof`指针返回指针本身大小。数组不可赋值，指针可以重新指向。\n\n- **函数指针：** 指向函数的指针，可用于回调。声明方式：`int (*pFunc)(int, int);`\n- **指针函数：** 返回值为指针的函数。声明方式：`int* func(int, int);`\n- **指针数组：** 元素为指针的数组。声明方式：`int *arr[10];`（10个`int*`元素）\n- **数组指针：** 指向数组的指针。声明方式：`int (*pArr)[10];`（指向含10个`int`的数组）\n\n## 常用的智能指针\n\n智能指针可以自动管理内存，通过RAII（Resource Acquisition Is Initialization，资源获取即初始化）机制，将资源的获取和释放与对象的生命周期绑定，从而避免内存泄漏。智能指针也会在释放时主动失效，避免悬空指针。\n\n常用的智能指针有`std::unique_ptr`、`std::shared_ptr`和`std::weak_ptr`。\n\n1. **`std::unique_ptr`**\n   - 对所指对象有唯一所有权，避免资源重复释放。\n   - 不支持复制，仅支持`std::move`转移所有权。\n   - 当其离开作用域，会立即释放。\n2. **`std::shared_ptr`**\n   - 允许多个指针共享同一个对象的所有权。\n   - 通过引用计数管理生命周期。复制或赋值时增加计数，析构时减少计数。\n   - 支持复制。\n3. **`std::weak_ptr`**\n   - 不拥有对象所有权，是`shared_ptr`的弱引用。\n   - 不增加引用计数。\n   - 用于解决`shared_ptr`循环引用问题。\n   - 通过`lock`方法检查所指对象是否存在。\n\n## 什么是野指针\n\n野指针是指向无效内存地址的指针，对其解引用会导致未定义行为（如段错误）。\n\n**产生原因：**\n\n- **未初始化：** 指针声明后未赋值，指向随机地址。\n- **释放后未置空：** `delete`/`free`后指针仍保存原地址（悬空指针）。\n- **越界访问：** 指针运算超出数组合法范围。\n\n**如何避免：**\n\n- 指针声明时初始化为`nullptr`。\n- `delete`/`free`后立即置为`nullptr`。\n- 优先使用智能指针（`std::unique_ptr`、`std::shared_ptr`）自动管理生命周期。\n- 注意数组边界，避免越界访问。\n\n## const的用法\n\n- **修饰变量：** 声明常量，其值在初始化后不能被修改。\n- **修饰指针：** 如常量指针和指针常量的情况，限制指针或所指向对象的可修改性。\n- **修饰函数参数：** 防止函数内部修改传入的参数值。\n- **修饰成员函数：** 表示该成员函数不会修改对象的成员变量，常称为常量成员函数。\n\n## STL容器有哪些，常用的方法有哪些\n\n### std::vector的作用\n\n- **动态数组：** `std::vector`是C++标准库中的动态数组容器。它能够自动管理内存，根据需要动态调整大小。\n- **方便的操作接口：** 提供了如`push_back`（在末尾添加元素）、`pop_back`（删除末尾元素）、`size`（获取元素个数）、`at`（通过索引访问元素并进行边界检查）等丰富的操作函数，方便对数组进行各种操作。\n- **内存管理：** 相比于普通数组，`std::vector`在内存管理上更安全和高效，它会在需要时自动分配和释放内存，避免手动内存管理带来的内存泄漏等问题。\n\n## std::vector和数组有什么区别？\n\n`std::vector`是动态数组，能自动管理内存，根据需要动态调整大小，提供了丰富的操作接口如`push_back`等。数组大小固定，一旦声明不能改变，内存需要手动管理，操作相对简单。\n\n### std::move的作用\n\n**转移语义：**\n`std::move`用于将对象的资源所有权转移给另一个对象，而不是进行深拷贝。它通过将左值转换为右值引用，允许编译器进行优化，避免不必要的复制操作，提高效率。\n\n**资源管理：**\n在对象包含动态分配的资源（如指针指向的内存）时，使用`std::move`可以安全地将资源转移给其他对象，确保资源的正确释放和管理，避免资源泄漏。\n\n## 什么是左值和右值\n\n**左值：**\n\n- 表示数据的表达式（变量、常量、函数等）\n- 有持久的状态\n- 在内存中有对应的地址\n- 可以出现在赋值语句的左边（虽然不是所有左值都能被赋值，如`const`修饰的左值不能被赋值，但仍属于左值范畴）\n\n**右值：**\n\n- 临时的表达式\n- 不具有持久的状态\n- 要么是字面量（如`10`、`\"hello\"`等），要么是表达式求值的结果（如`a + b`的结果）\n- 没有固定的内存地址（或者说它的地址是临时的），只能出现在赋值语句的右边\n\n## namespace\n\n在大型项目中，不同模块可能会定义相同名称的变量、函数或类。`namespace`提供了一种将代码划分到不同命名空间的方式，避免命名冲突。可以将相关的代码放在同一个命名空间中，使代码结构更清晰。例如将某个库的所有函数和类放在一个命名空间下，便于管理和使用。\n\n## C++中堆和栈的区别\n\n- **栈（Stack）：** 编译器自动分配和释放，随作用域结束自动销毁。分配速度快（只需移动栈指针），大小较小（通常1-8MB），无碎片（LIFO顺序），向低地址增长。\n- **堆（Heap）：** 程序员手动分配（`new`/`malloc`）和释放（`delete`/`free`），生命周期直到手动释放或程序结束。分配较慢（需查找可用内存块），大小较大（受限于虚拟内存），频繁分配释放会产生碎片，向高地址增长。\n\n## 什么是虚函数\n\n通过`virtual`声明的函数称为虚函数，用于声明一个不包含具体实现的函数声明。当派生类继承声明了虚函数的类时，需要通过`override`来重写虚函数，并提供函数的具体实现。虚函数是C++实现多态的重要机制。\n\n## 虚函数和纯虚函数有什么区别？\n\n虚函数在基类中定义，有具体的函数实现，子类可以重写也可以不重写。纯虚函数在基类中只声明，没有函数体，必须在子类中实现，包含纯虚函数的类称为抽象类，不能实例化对象。\n\n## 虚函数表\n\n虚函数表（vtable）是C++实现运行时多态的核心机制。\n\n- 每个含有虚函数的类在编译期会生成一张虚函数表，表中存储该类所有虚函数的函数指针。\n- 每个该类的对象内部包含一个隐藏的虚函数表指针（`vptr`），指向所属类的vtable。\n- 当通过基类指针/引用调用虚函数时，运行时通过`vptr`查找vtable中对应的函数地址，从而调用正确的派生类实现。\n- 派生类重写虚函数后，其vtable中对应条目会替换为派生类的函数地址。\n\n## Static的用法\n\n- **修饰局部变量：** 变量生命周期延长至程序结束，但作用域不变。仅在第一次执行到声明时初始化，后续调用保留上次的值。\n- **修饰全局变量/函数：** 将其链接属性限制为内部链接（仅当前编译单元可见），避免跨文件的命名冲突。\n- **修饰类的成员变量：** 该变量属于类本身而非某个对象，所有对象共享同一份数据，需要在类外定义初始化。\n- **修饰类的成员函数：** 该函数不依赖于具体对象，没有`this`指针，只能访问静态成员变量和其他静态成员函数。\n\n## 什么是模板\n\n模板是C++中一种强大的泛型编程机制，它允许编写与类型无关的代码。通过模板，可以创建通用的函数、类等代码结构，在编译时根据实际使用的类型生成具体的实例。\n\n## 什么是宏定义\n\n宏定义是C/C++预处理器指令，使用`#define`在编译前进行文本替换。\n\n- 宏在预处理阶段展开，是纯文本替换，不进行类型检查。\n- 可定义常量（`#define PI 3.14159`）或带参数的宏（`#define MAX(a,b) ((a)>(b)?(a):(b))`）。\n- 带参数的宏要注意加括号，防止运算符优先级导致的替换错误。\n- 宏没有作用域限制，从定义处到文件末尾（或`#undef`）均有效。\n- 现代C++中推荐使用`const`/`constexpr`替代常量宏，使用`inline`函数或模板替代函数宏。\n\n## 内联函数有什么优点？内联函数和宏定义的区别。\n\n**内联函数优点：**\n\n- 在调用处展开函数体，减少函数调用开销（压栈、跳转、返回）。\n- 保留函数的类型检查、作用域规则和调试信息。\n\n**与宏定义的区别：**\n\n- **处理阶段：** 内联函数在编译期处理，宏在预处理期文本替换。\n- **类型安全：** 内联函数有类型检查，宏没有。\n- **调试：** 内联函数可单步调试，宏不可。\n- **作用域：** 内联函数遵循C++作用域规则，宏无作用域限制。\n- **参数求值：** 内联函数参数只求值一次，宏参数可能被多次求值（产生副作用）。\n- **编译器控制：** 编译器可拒绝内联（如递归、过大函数），宏是强制文本替换。\n\n## malloc/free和new/delete区别\n\n- **来源：** `malloc`/`free`是C标准库函数，`new`/`delete`是C++运算符。\n- **构造/析构：** `malloc`/`free`不调用构造和析构函数，`new`/`delete`自动调用。\n- **返回类型：** `malloc`返回`void*`需手动强转，`new`返回对应类型指针。\n- **失败处理：** `malloc`失败返回`NULL`，`new`失败抛出`std::bad_alloc`异常。\n- **可否重载：** `malloc`/`free`不可重载，`new`/`delete`可重载。\n- **内存大小：** `malloc`需手动计算`sizeof`，`new`由编译器自动计算。\n\n## extern \"C\"的作用\n\n`extern \"C\"`告诉C++编译器按照C语言的方式进行符号命名和链接，防止C++的名称修饰（name mangling）。\n\n- C++为了支持函数重载，会对函数名进行修饰（如`func(int)`可能变为`_Z4funci`），而C语言不做修饰。\n- 当C++代码需要调用C语言编写的库，或者C++库需要提供给C代码调用时，必须使用`extern \"C\"`。\n- 常用写法配合条件编译，使头文件同时兼容C和C++。\n\n## C++常见的错误类型\n\n- **编译错误（Compile Error）：** 语法错误、类型不匹配、未声明标识符等，编译器在编译阶段报错。\n- **链接错误（Link Error）：** 符号未定义（如声明了函数但未实现）、重复定义等，在链接阶段报错。\n- **运行时错误（Runtime Error）：**\n  - **段错误（Segmentation Fault）：** 访问非法内存地址，如解引用空指针或野指针。\n  - **内存泄漏（Memory Leak）：** 动态分配的内存未释放，长期运行导致内存耗尽。\n  - **数组越界（Buffer Overflow）：** 访问数组合法范围之外的内存。\n  - **栈溢出（Stack Overflow）：** 通常由无限递归或局部变量过大导致。\n  - **未定义行为（Undefined Behavior）：** 如有符号整数溢出、使用未初始化变量等。\n\n## 构造函数是否可以抛出异常\n\n可以。构造函数抛出异常是C++标准允许的行为，且是通知构造失败的推荐方式。\n\n- 构造函数没有返回值，抛异常是指示构造失败的唯一规范手段。\n- 如果构造函数抛出异常，对象被视为未完成构造，析构函数**不会**被调用。\n- 因此，在异常抛出前已获取的资源（如`new`的内存、打开的文件）会泄漏。\n- **解决方案：** 使用RAII，将资源用智能指针等RAII对象管理，即使构造函数中途抛异常，已构造完成的成员子对象会被自动析构释放。\n\n## 是否可以在析构函数抛出异常\n\n**强烈不建议。** C++11起析构函数默认为`noexcept`，抛出异常会直接调用`std::terminate`终止程序。\n\n- 如果在栈展开（stack unwinding）过程中析构函数抛出异常，会出现同时存在两个活跃异常的情况，C++标准规定此时调用`std::terminate`。\n- 析构函数中可能抛异常的操作应在内部`try-catch`捕获并处理，不让异常逃逸。\n- 可以提供一个显式的`close()`或`release()`方法让调用者在析构前主动处理可能失败的清理操作。\n\n## volatile的作用\n\n`volatile`关键字告诉编译器该变量的值可能在程序控制流之外被改变，禁止编译器对其进行优化（如缓存到寄存器、消除重复读取等）。\n\n- 每次访问`volatile`变量都会从内存中重新读取，每次修改都会立即写回内存。\n- **典型使用场景：**\n  - 内存映射的硬件寄存器（嵌入式开发中读写外设状态）。\n  - 信号处理函数中修改的全局变量（`sig_atomic_t`）。\n  - 多线程中被其他线程修改的标志位（但`volatile`不提供原子性和内存序保证，多线程同步应使用`std::atomic`）。\n\n## C++内存泄露及检测工具\n\n内存泄漏是指动态分配的内存在不再使用后未被释放，导致可用内存逐渐减少。\n\n**常用检测工具：**\n\n- **Valgrind（Memcheck）：** Linux下最常用的内存检测工具，能检测内存泄漏、越界访问、使用未初始化内存等，无需重新编译（但建议开启`-g`调试信息）。\n- **AddressSanitizer（ASan）：** GCC/Clang内置的内存错误检测器，编译时加`-fsanitize=address`启用，运行时开销较小，可检测越界、use-after-free等。\n- **LeakSanitizer（LSan）：** 专门检测内存泄漏，通常随ASan一起启用，也可独立使用`-fsanitize=leak`。\n- **Visual Leak Detector（VLD）：** Windows/MSVC环境下的开源内存泄漏检测工具，只需包含头文件即可使用。\n- **Dr. Memory：** 跨平台（Windows/Linux）的内存检测工具，功能类似Valgrind。\n\n## Mojo\n\nMojo是Chromium团队开发的跨平台进程间通信（IPC）框架，用于实现Chromium进程内或进程间的通信。通过`.mojom`文件定义接口，并编写Host端和Receiver端的接口代码，即可实现跨进程通信。\n\nMojo的核心机制是Message Pipes（消息管道），它是双向通信管道，可在两个或多个进程之间传递消息。消息能自动序列化/反序列化，发送方和接收方无需手动处理数据结构，降低了出错风险。\n\n## 在多线程编程中，如何避免死锁？\n\n- 按顺序加锁，所有线程以相同顺序获取锁；\n- 使用超时机制，在获取锁时设置超时时间，避免无限等待；\n- 使用`std::lock`函数同时获取多个锁，它能保证要么所有锁都获取成功，要么都失败，不会出现部分获取锁的情况。\n\n## GN构建\n\nGN是Google开发的用于生成Ninja构建文件的元构建系统。它使用一种简洁的基于文件的语法来描述构建规则和依赖关系。生成的Ninja构建文件执行速度快，适合大型项目。语法简洁，易于理解和编写，并且与Google的开发流程和工具链集成度高。\n\n## CMake构建\n\nCMake是一个跨平台的开源构建系统，用于管理软件的构建过程。它使用`CMakeLists.txt`文件来描述项目的构建规则和依赖关系。\n",
    "headings": [
      {
        "depth": 1,
        "text": "C++",
        "slug": "c"
      },
      {
        "depth": 2,
        "text": "C++特性",
        "slug": "c特性"
      },
      {
        "depth": 2,
        "text": "指针和引用的区别",
        "slug": "指针和引用的区别"
      },
      {
        "depth": 2,
        "text": "数组与指针的区别与联系，函数指针，指针函数，指针数组，数组指针",
        "slug": "数组与指针的区别与联系函数指针指针函数指针数组数组指针"
      },
      {
        "depth": 2,
        "text": "常用的智能指针",
        "slug": "常用的智能指针"
      },
      {
        "depth": 2,
        "text": "什么是野指针",
        "slug": "什么是野指针"
      },
      {
        "depth": 2,
        "text": "const的用法",
        "slug": "const的用法"
      },
      {
        "depth": 2,
        "text": "STL容器有哪些，常用的方法有哪些",
        "slug": "stl容器有哪些常用的方法有哪些"
      },
      {
        "depth": 3,
        "text": "std::vector的作用",
        "slug": "stdvector的作用"
      },
      {
        "depth": 2,
        "text": "std::vector和数组有什么区别？",
        "slug": "stdvector和数组有什么区别"
      },
      {
        "depth": 3,
        "text": "std::move的作用",
        "slug": "stdmove的作用"
      },
      {
        "depth": 2,
        "text": "什么是左值和右值",
        "slug": "什么是左值和右值"
      },
      {
        "depth": 2,
        "text": "namespace",
        "slug": "namespace"
      },
      {
        "depth": 2,
        "text": "C++中堆和栈的区别",
        "slug": "c中堆和栈的区别"
      },
      {
        "depth": 2,
        "text": "什么是虚函数",
        "slug": "什么是虚函数"
      },
      {
        "depth": 2,
        "text": "虚函数和纯虚函数有什么区别？",
        "slug": "虚函数和纯虚函数有什么区别"
      },
      {
        "depth": 2,
        "text": "虚函数表",
        "slug": "虚函数表"
      },
      {
        "depth": 2,
        "text": "Static的用法",
        "slug": "static的用法"
      },
      {
        "depth": 2,
        "text": "什么是模板",
        "slug": "什么是模板"
      },
      {
        "depth": 2,
        "text": "什么是宏定义",
        "slug": "什么是宏定义"
      },
      {
        "depth": 2,
        "text": "内联函数有什么优点？内联函数和宏定义的区别。",
        "slug": "内联函数有什么优点内联函数和宏定义的区别"
      },
      {
        "depth": 2,
        "text": "malloc/free和new/delete区别",
        "slug": "mallocfree和newdelete区别"
      },
      {
        "depth": 2,
        "text": "extern \"C\"的作用",
        "slug": "extern-c的作用"
      },
      {
        "depth": 2,
        "text": "C++常见的错误类型",
        "slug": "c常见的错误类型"
      },
      {
        "depth": 2,
        "text": "构造函数是否可以抛出异常",
        "slug": "构造函数是否可以抛出异常"
      },
      {
        "depth": 2,
        "text": "是否可以在析构函数抛出异常",
        "slug": "是否可以在析构函数抛出异常"
      },
      {
        "depth": 2,
        "text": "volatile的作用",
        "slug": "volatile的作用"
      },
      {
        "depth": 2,
        "text": "C++内存泄露及检测工具",
        "slug": "c内存泄露及检测工具"
      },
      {
        "depth": 2,
        "text": "Mojo",
        "slug": "mojo"
      },
      {
        "depth": 2,
        "text": "在多线程编程中，如何避免死锁？",
        "slug": "在多线程编程中如何避免死锁"
      },
      {
        "depth": 2,
        "text": "GN构建",
        "slug": "gn构建"
      },
      {
        "depth": 2,
        "text": "CMake构建",
        "slug": "cmake构建"
      }
    ],
    "searchText": "c++ 其他语言 c++ c++特性 封装： 将数据和操作数据的函数封装在一起，形成类。通过访问修饰符（如public、private、protected）控制类成员的访问权限，隐藏内部实现细节，只对外提供接口，提高代码的安全性和可维护性。 继承： 一个类可以继承另一个类的属性和方法。通过继承，子类可以复用父类的代码，同时可以添加自己特有的属性和方法，实现代码的重用和扩展。 多态： 分为编译时多态和运行时多态。 编译时多态通过函数重载和模板实现，在编译阶段根据函数参数的不同来确定调用哪个函数。 运行时多态通过虚函数和指针或引用实现，在运行阶段根据对象的实际类型来确定调用哪个虚函数。 指针和引用的区别 是否可空： 指针可以为nullptr，引用必须在声明时绑定到一个合法对象，不能为空。 是否可重绑定： 指针可以在生命周期内指向不同的对象，引用一旦绑定就不能再引用其他对象。 是否占内存： 指针本身是一个变量，占用固定大小的内存（32位系统4字节，64位系统8字节）；引用在语义上是别名，编译器通常用指针实现，但标准未规定其是否占内存。 语法区别： 指针通过 和 访问对象，引用直接使用变量名访问，语法上更简洁。 多级关系： 指针可以有多级（int ），引用没有多级引用的概念。 数组与指针的区别与联系，函数指针，指针函数，指针数组，数组指针 数组与指针的区别与联系： 数组名在大多数表达式中会退化为指向首元素的指针，但sizeof数组返回整个数组大小，而sizeof指针返回指针本身大小。数组不可赋值，指针可以重新指向。 函数指针： 指向函数的指针，可用于回调。声明方式：int ( pfunc)(int, int); 指针函数： 返回值为指针的函数。声明方式：int func(int, int); 指针数组： 元素为指针的数组。声明方式：int arr[10];（10个int 元素） 数组指针： 指向数组的指针。声明方式：int ( parr)[10];（指向含10个int的数组） 常用的智能指针 智能指针可以自动管理内存，通过raii（resource acquisition is initialization，资源获取即初始化）机制，将资源的获取和释放与对象的生命周期绑定，从而避免内存泄漏。智能指针也会在释放时主动失效，避免悬空指针。 常用的智能指针有std::unique ptr、std::shared ptr和std::weak ptr。 1. std::unique ptr 对所指对象有唯一所有权，避免资源重复释放。 不支持复制，仅支持std::move转移所有权。 当其离开作用域，会立即释放。 2. std::shared ptr 允许多个指针共享同一个对象的所有权。 通过引用计数管理生命周期。复制或赋值时增加计数，析构时减少计数。 支持复制。 3. std::weak ptr 不拥有对象所有权，是shared ptr的弱引用。 不增加引用计数。 用于解决shared ptr循环引用问题。 通过lock方法检查所指对象是否存在。 什么是野指针 野指针是指向无效内存地址的指针，对其解引用会导致未定义行为（如段错误）。 产生原因： 未初始化： 指针声明后未赋值，指向随机地址。 释放后未置空： delete/free后指针仍保存原地址（悬空指针）。 越界访问： 指针运算超出数组合法范围。 如何避免： 指针声明时初始化为nullptr。 delete/free后立即置为nullptr。 优先使用智能指针（std::unique ptr、std::shared ptr）自动管理生命周期。 注意数组边界，避免越界访问。 const的用法 修饰变量： 声明常量，其值在初始化后不能被修改。 修饰指针： 如常量指针和指针常量的情况，限制指针或所指向对象的可修改性。 修饰函数参数： 防止函数内部修改传入的参数值。 修饰成员函数： 表示该成员函数不会修改对象的成员变量，常称为常量成员函数。 stl容器有哪些，常用的方法有哪些 std::vector的作用 动态数组： std::vector是c++标准库中的动态数组容器。它能够自动管理内存，根据需要动态调整大小。 方便的操作接口： 提供了如push back（在末尾添加元素）、pop back（删除末尾元素）、size（获取元素个数）、at（通过索引访问元素并进行边界检查）等丰富的操作函数，方便对数组进行各种操作。 内存管理： 相比于普通数组，std::vector在内存管理上更安全和高效，它会在需要时自动分配和释放内存，避免手动内存管理带来的内存泄漏等问题。 std::vector和数组有什么区别？ std::vector是动态数组，能自动管理内存，根据需要动态调整大小，提供了丰富的操作接口如push back等。数组大小固定，一旦声明不能改变，内存需要手动管理，操作相对简单。 std::move的作用 转移语义： std::move用于将对象的资源所有权转移给另一个对象，而不是进行深拷贝。它通过将左值转换为右值引用，允许编译器进行优化，避免不必要的复制操作，提高效率。 资源管理： 在对象包含动态分配的资源（如指针指向的内存）时，使用std::move可以安全地将资源转移给其他对象，确保资源的正确释放和管理，避免资源泄漏。 什么是左值和右值 左值： 表示数据的表达式（变量、常量、函数等） 有持久的状态 在内存中有对应的地址 可以出现在赋值语句的左边（虽然不是所有左值都能被赋值，如const修饰的左值不能被赋值，但仍属于左值范畴） 右值： 临时的表达式 不具有持久的状态 要么是字面量（如10、\"hello\"等），要么是表达式求值的结果（如a + b的结果） 没有固定的内存地址（或者说它的地址是临时的），只能出现在赋值语句的右边 namespace 在大型项目中，不同模块可能会定义相同名称的变量、函数或类。namespace提供了一种将代码划分到不同命名空间的方式，避免命名冲突。可以将相关的代码放在同一个命名空间中，使代码结构更清晰。例如将某个库的所有函数和类放在一个命名空间下，便于管理和使用。 c++中堆和栈的区别 栈（stack）： 编译器自动分配和释放，随作用域结束自动销毁。分配速度快（只需移动栈指针），大小较小（通常1 8mb），无碎片（lifo顺序），向低地址增长。 堆（heap）： 程序员手动分配（new/malloc）和释放（delete/free），生命周期直到手动释放或程序结束。分配较慢（需查找可用内存块），大小较大（受限于虚拟内存），频繁分配释放会产生碎片，向高地址增长。 什么是虚函数 通过virtual声明的函数称为虚函数，用于声明一个不包含具体实现的函数声明。当派生类继承声明了虚函数的类时，需要通过override来重写虚函数，并提供函数的具体实现。虚函数是c++实现多态的重要机制。 虚函数和纯虚函数有什么区别？ 虚函数在基类中定义，有具体的函数实现，子类可以重写也可以不重写。纯虚函数在基类中只声明，没有函数体，必须在子类中实现，包含纯虚函数的类称为抽象类，不能实例化对象。 虚函数表 虚函数表（vtable）是c++实现运行时多态的核心机制。 每个含有虚函数的类在编译期会生成一张虚函数表，表中存储该类所有虚函数的函数指针。 每个该类的对象内部包含一个隐藏的虚函数表指针（vptr），指向所属类的vtable。 当通过基类指针/引用调用虚函数时，运行时通过vptr查找vtable中对应的函数地址，从而调用正确的派生类实现。 派生类重写虚函数后，其vtable中对应条目会替换为派生类的函数地址。 static的用法 修饰局部变量： 变量生命周期延长至程序结束，但作用域不变。仅在第一次执行到声明时初始化，后续调用保留上次的值。 修饰全局变量/函数： 将其链接属性限制为内部链接（仅当前编译单元可见），避免跨文件的命名冲突。 修饰类的成员变量： 该变量属于类本身而非某个对象，所有对象共享同一份数据，需要在类外定义初始化。 修饰类的成员函数： 该函数不依赖于具体对象，没有this指针，只能访问静态成员变量和其他静态成员函数。 什么是模板 模板是c++中一种强大的泛型编程机制，它允许编写与类型无关的代码。通过模板，可以创建通用的函数、类等代码结构，在编译时根据实际使用的类型生成具体的实例。 什么是宏定义 宏定义是c/c++预处理器指令，使用 define在编译前进行文本替换。 宏在预处理阶段展开，是纯文本替换，不进行类型检查。 可定义常量（ define pi 3.14159）或带参数的宏（ define max(a,b) ((a) (b)?(a):(b))）。 带参数的宏要注意加括号，防止运算符优先级导致的替换错误。 宏没有作用域限制，从定义处到文件末尾（或 undef）均有效。 现代c++中推荐使用const/constexpr替代常量宏，使用inline函数或模板替代函数宏。 内联函数有什么优点？内联函数和宏定义的区别。 内联函数优点： 在调用处展开函数体，减少函数调用开销（压栈、跳转、返回）。 保留函数的类型检查、作用域规则和调试信息。 与宏定义的区别： 处理阶段： 内联函数在编译期处理，宏在预处理期文本替换。 类型安全： 内联函数有类型检查，宏没有。 调试： 内联函数可单步调试，宏不可。 作用域： 内联函数遵循c++作用域规则，宏无作用域限制。 参数求值： 内联函数参数只求值一次，宏参数可能被多次求值（产生副作用）。 编译器控制： 编译器可拒绝内联（如递归、过大函数），宏是强制文本替换。 malloc/free和new/delete区别 来源： malloc/free是c标准库函数，new/delete是c++运算符。 构造/析构： malloc/free不调用构造和析构函数，new/delete自动调用。 返回类型： malloc返回void 需手动强转，new返回对应类型指针。 失败处理： malloc失败返回null，new失败抛出std::bad alloc异常。 可否重载： malloc/free不可重载，new/delete可重载。 内存大小： malloc需手动计算sizeof，new由编译器自动计算。 extern \"c\"的作用 extern \"c\"告诉c++编译器按照c语言的方式进行符号命名和链接，防止c++的名称修饰（name mangling）。 c++为了支持函数重载，会对函数名进行修饰（如func(int)可能变为 z4funci），而c语言不做修饰。 当c++代码需要调用c语言编写的库，或者c++库需要提供给c代码调用时，必须使用extern \"c\"。 常用写法配合条件编译，使头文件同时兼容c和c++。 c++常见的错误类型 编译错误（compile error）： 语法错误、类型不匹配、未声明标识符等，编译器在编译阶段报错。 链接错误（link error）： 符号未定义（如声明了函数但未实现）、重复定义等，在链接阶段报错。 运行时错误（runtime error）： 段错误（segmentation fault）： 访问非法内存地址，如解引用空指针或野指针。 内存泄漏（memory leak）： 动态分配的内存未释放，长期运行导致内存耗尽。 数组越界（buffer overflow）： 访问数组合法范围之外的内存。 栈溢出（stack overflow）： 通常由无限递归或局部变量过大导致。 未定义行为（undefined behavior）： 如有符号整数溢出、使用未初始化变量等。 构造函数是否可以抛出异常 可以。构造函数抛出异常是c++标准允许的行为，且是通知构造失败的推荐方式。 构造函数没有返回值，抛异常是指示构造失败的唯一规范手段。 如果构造函数抛出异常，对象被视为未完成构造，析构函数 不会 被调用。 因此，在异常抛出前已获取的资源（如new的内存、打开的文件）会泄漏。 解决方案： 使用raii，将资源用智能指针等raii对象管理，即使构造函数中途抛异常，已构造完成的成员子对象会被自动析构释放。 是否可以在析构函数抛出异常 强烈不建议。 c++11起析构函数默认为noexcept，抛出异常会直接调用std::terminate终止程序。 如果在栈展开（stack unwinding）过程中析构函数抛出异常，会出现同时存在两个活跃异常的情况，c++标准规定此时调用std::terminate。 析构函数中可能抛异常的操作应在内部try catch捕获并处理，不让异常逃逸。 可以提供一个显式的close()或release()方法让调用者在析构前主动处理可能失败的清理操作。 volatile的作用 volatile关键字告诉编译器该变量的值可能在程序控制流之外被改变，禁止编译器对其进行优化（如缓存到寄存器、消除重复读取等）。 每次访问volatile变量都会从内存中重新读取，每次修改都会立即写回内存。 典型使用场景： 内存映射的硬件寄存器（嵌入式开发中读写外设状态）。 信号处理函数中修改的全局变量（sig atomic t）。 多线程中被其他线程修改的标志位（但volatile不提供原子性和内存序保证，多线程同步应使用std::atomic）。 c++内存泄露及检测工具 内存泄漏是指动态分配的内存在不再使用后未被释放，导致可用内存逐渐减少。 常用检测工具： valgrind（memcheck）： linux下最常用的内存检测工具，能检测内存泄漏、越界访问、使用未初始化内存等，无需重新编译（但建议开启 g调试信息）。 addresssanitizer（asan）： gcc/clang内置的内存错误检测器，编译时加 fsanitize=address启用，运行时开销较小，可检测越界、use after free等。 leaksanitizer（lsan）： 专门检测内存泄漏，通常随asan一起启用，也可独立使用 fsanitize=leak。 visual leak detector（vld）： windows/msvc环境下的开源内存泄漏检测工具，只需包含头文件即可使用。 dr. memory： 跨平台（windows/linux）的内存检测工具，功能类似valgrind。 mojo mojo是chromium团队开发的跨平台进程间通信（ipc）框架，用于实现chromium进程内或进程间的通信。通过.mojom文件定义接口，并编写host端和receiver端的接口代码，即可实现跨进程通信。 mojo的核心机制是message pipes（消息管道），它是双向通信管道，可在两个或多个进程之间传递消息。消息能自动序列化/反序列化，发送方和接收方无需手动处理数据结构，降低了出错风险。 在多线程编程中，如何避免死锁？ 按顺序加锁，所有线程以相同顺序获取锁； 使用超时机制，在获取锁时设置超时时间，避免无限等待； 使用std::lock函数同时获取多个锁，它能保证要么所有锁都获取成功，要么都失败，不会出现部分获取锁的情况。 gn构建 gn是google开发的用于生成ninja构建文件的元构建系统。它使用一种简洁的基于文件的语法来描述构建规则和依赖关系。生成的ninja构建文件执行速度快，适合大型项目。语法简洁，易于理解和编写，并且与google的开发流程和工具链集成度高。 cmake构建 cmake是一个跨平台的开源构建系统，用于管理软件的构建过程。它使用cmakelists.txt文件来描述项目的构建规则和依赖关系。"
  },
  {
    "slug": "004-harmonyos_arkts",
    "title": "HarmonyOS ArkTS 开发知识库",
    "category": "其他语言",
    "sourcePath": "docs/其他语言/HarmonyOS_ArkTs.md",
    "markdown": "# HarmonyOS ArkTS 开发知识库\n\n---\n\n## 一、ArkTS 语言基础\n\n### ArkTS 中声明式编程范式与命令式编程范式有何不同？\n\n声明式编程范式关注\"是什么\"，通过简洁代码描述最终结果，如在 ArkTS 中用声明式语法构建 UI，只需描述 UI 结构。而命令式编程范式关注\"怎么做\"，通过一系列语句按顺序执行来实现目标，强调执行步骤。例如，声明式构建 UI 用 `Column { /* 子组件 */ }` 描述布局，命令式则需逐步操作每个 UI 元素的创建与排列。\n\n### 如何在 ArkTS 中创建自定义组件？\n\n使用 `@Component` 装饰器定义组件，在组件内部可以定义属性、状态和方法。\n\n### @State 和 @Link 装饰器的作用\n\n- `@State` 用于标记响应式状态变量，当该变量值改变时，依赖它的 UI 会自动更新，实现数据与 UI 的响应式绑定。\n- `@Link` 用于建立父子组件间状态变量的双向绑定关系，子组件可读取并修改父组件传递的状态变量，修改后父组件状态会同步更新，反之父组件状态变更也会同步到子组件。`@Link` 需搭配父组件的 `@State`/`@Provide` 等装饰器变量使用，不能单独定义。\n\n### ArkTS 与 TypeScript 的区别\n\n#### 设计定位与应用场景\n\n- **TypeScript**：微软推出的 JavaScript 超集，核心用于 Web 前端、Node.js 后端开发，无原生跨设备/分布式能力，需依赖框架适配多端。\n- **ArkTS**：华为基于 TypeScript 扩展的鸿蒙专属语言，专为鸿蒙全场景开发设计，原生支持多设备适配、分布式能力、鸿蒙 UI 组件开发，仅用于鸿蒙应用/服务开发。\n\n#### 语法扩展差异\n\n- ArkTS 在 TypeScript 基础上新增鸿蒙专属语法：如 UI 装饰器（`@Entry`/`@Component`/`@State`）、构建函数（`build()`）、布局描述（`Column`/`Row`/`Flex`）、状态管理语法（`@Link`/`@Provide`/`@Consume`），直接支持 UI 开发。\n- TypeScript 仅提供类型校验、接口、泛型等基础语法，无 UI 相关原生语法，需结合 React/Vue 等框架实现 UI 开发。\n\n#### 运行环境与编译机制\n\n- TypeScript 需编译为 JavaScript，运行在浏览器/Node.js 引擎，依赖虚拟机（如 V8）执行。\n- ArkTS 通过方舟编译器直接编译为鸿蒙设备可执行的机器码，无虚拟机开销，支持鸿蒙多内核（Linux/微内核/RTOS）适配，运行效率更高。\n\n#### 核心能力支持\n\n- ArkTS 原生集成鸿蒙分布式能力（如分布式数据管理、设备虚拟化）、鸿蒙 API 调用（如文件系统、权限管理）、多设备布局适配（如媒体查询、条件编译）。\n- TypeScript 无分布式能力，调用原生设备能力需依赖 Electron/Cordova 等中间层，多设备适配需手动编写适配逻辑。\n\n#### 生态与工具链\n\n- TypeScript 拥有全球庞大的 Web 生态，兼容所有 JavaScript 库，开发工具支持 VS Code 等全平台。\n- ArkTS 生态聚焦鸿蒙场景，仅兼容鸿蒙官方库，开发需使用 DevEco Studio，工具链深度适配鸿蒙编译、调试、多设备预览能力。\n\n#### 类型系统与语法约束\n\n- 二者均为强类型语言，但 ArkTS 针对鸿蒙开发新增语法约束：如 UI 组件必须在 `build()` 函数内声明、状态变量需通过装饰器标记、函数不能返回 UI 组件等。\n- TypeScript 无 UI 相关语法约束，类型校验仅聚焦代码逻辑层面。\n\n### ArkTS 与 Native（C++）的性能区别\n\n#### 执行机制\n\n- **ArkTS**：基于 ArkVM 虚拟机运行，代码需先编译为字节码，再通过解释执行或 AOT 编译转为机器码，存在中间层执行开销。\n- **Native C++**：直接编译为目标硬件的原生机器码，由 CPU 直接执行，无任何中间层开销。\n\n#### 启动性能\n\n- **ArkTS**：冷启动有字节码加载、AOT 编译的额外开销，启动速度慢；二次启动因缓存 AOT 结果速度提升，但仍不及 C++。\n- **Native C++**：无额外编译/加载开销，冷/热启动速度均为最优。\n\n#### 计算密集型性能\n\n- **ArkTS**：处理复杂计算（如图像处理、加密、大规模数据运算）时，因虚拟机调度开销，性能比 C++ 低 20%–50%。\n- **Native C++**：无中间层损耗，指令执行效率最高，计算密集型场景性能远超 ArkTS。\n\n#### 内存开销\n\n- **ArkTS**：需占用 ArkVM 的额外内存（虚拟机栈、GC 堆），垃圾回收（GC）时会出现短暂内存停顿。\n- **Native C++**：内存完全手动管理，无虚拟机额外占用，内存利用率更高，仅需手动规避内存泄漏。\n\n#### UI 渲染性能\n\n- **ArkTS**：声明式 UI 框架对普通渲染、简单动效优化充分，性能足够；但高频动画（如 60/120fps 游戏 UI）、复杂实时渲染易掉帧。\n- **Native C++**：可直接对接底层渲染接口，能稳定保障高频/复杂渲染的流畅度。\n\n#### 跨设备适配开销\n\n- **ArkTS**：依托 ArkVM 屏蔽硬件架构（arm32/arm64/x86）差异，跨设备适配无额外性能损耗。\n- **Native C++**：需针对不同架构编译不同二进制包，适配不当会导致性能下降。\n\n#### 并发性能\n\n- **ArkTS**：多线程依赖 `Worker` 线程，共享数据需通过 `Atomics` + `SharedArrayBuffer` 实现原子操作，存在框架层调度开销。\n- **Native C++**：可直接调用系统原生多线程接口，线程调度和内存共享更贴近底层，并发性能更高。\n\n### PX、VP、FP 单位的区别\n\n- **PX（Pixel，像素）**：屏幕硬件上的最小显示单元，是屏幕的物理属性。\n- **VP（Viewport Pixel，虚拟像素）**：鸿蒙的核心布局适配单位，也叫\"视口像素\"。鸿蒙将任意设备的屏幕宽度固定为 1000VP（无论屏幕物理尺寸/分辨率如何），1VP 就是屏幕宽度的 1/1000。\n- **FP（Font Pixel，字体像素）**：专为文字设计的适配单位，基于 VP 但额外响应系统字体缩放设置。和 VP 的核心区别是——如果用户在系统设置中调大/调小字体（比如调大 20%），10FP 的文字会同步放大 20%，而 10VP 的文字不会变化。\n\n### 如何实现自适应布局？\n\n可以使用弹性布局（如 `Column`、`Row` 等容器），通过设置 `flexDirection`、`justifyContent`、`alignItems` 等属性实现不同方向和对齐方式的布局。还可利用百分比布局，使组件大小和位置根据父容器动态调整。\n\n同时，借助媒体查询（如 `@media`），根据设备屏幕尺寸、分辨率等条件应用不同样式和布局，以适配多种设备形态。\n\n---\n\n## 二、HarmonyOS 应用架构\n\n### HarmonyOS 的分层架构\n\nHarmonyOS 应用分层架构包括**产品定制层**、**基础特性层**和**公共能力层**，构建了清晰、高效、可扩展的设计架构。\n\n#### 产品定制层\n\n产品定制层专注于满足不同设备或使用场景的个性化需求，包括 UI 设计、资源和配置，以及特定场景的交互逻辑和功能特性。\n\n- 产品定制层的功能模块独立运作，依赖基础特性层和公共能力层实现具体功能。\n- 产品定制层作为应用的入口，是用户直接互动的界面。为了满足特定需求，产品定制层可以灵活调整和扩展，以适应各种使用场景。\n\n#### 基础特性层\n\n基础特性层位于公共能力层之上，用于存放相对独立的功能 UI 和业务逻辑实现。每个功能模块都具备高内聚、低耦合、可定制的特点，支持产品的灵活部署。\n\n- 基础特性层为产品定制层提供稳健且丰富的基础功能支持，包括 UI 组件和基础服务。公共能力层为其提供通用功能和服务。\n- 为了增强系统的可扩展性和维护性，基础特性层对功能进行了模块化处理。例如，应用底部导航栏的每个选项都是一个独立的业务模块。\n\n#### 公共能力层\n\n公共能力层存放公共基础能力，包括公共 UI 组件、数据管理、外部交互和工具库等共享功能。应用可调用这些公共能力。公共能力层提供稳定可靠的功能支持，确保应用的稳定性和可维护性。\n\n公共能力层包含以下组成部分：\n\n- **公共 UI 组件**：设计为通用且高度可复用，确保在不同应用程序模块间保持一致的用户体验。这些组件提供标准化、友好的界面，帮助开发者快速实现常见的用户交互需求，如提示、警告和加载状态显示，从而提高开发效率和用户满意度。\n- **数据管理**：负责应用程序中数据的存储和访问，包括应用数据、系统数据等，提供了统一的数据管理接口，简化数据的读写操作。通过集中式的数据管理方式不仅使得数据的维护更为简单，而且能够保证数据的一致性和安全性。\n- **外部交互**：负责应用程序与外部系统的交互，包括网络请求、文件 I/O、设备 I/O 等，提供统一的外部接口，简化应用程序与外部系统的交互。开发者可以方便地实现网络通信、数据存储和硬件接入，从而加速开发流程并保证程序的稳定性和性能。\n- **工具库**：提供一系列常用工具函数和类，如字符串处理、日期时间处理、加密解密、数据压缩解压等，帮助开发者提高效率和代码质量。\n\n### 鸿蒙核心架构与 Android 的区别\n\n- **核心差异**：Android 是单设备移动 OS，架构绑定 Linux 内核、依赖虚拟机；鸿蒙是分布式全场景 OS，架构解耦、支持多内核、原生分布式能力。\n- **关键能力**：鸿蒙的分布式软总线、原子化服务、多设备资源共享是 Android 不具备的核心优势。\n- **开发层面**：鸿蒙支持\"一次开发多端部署\"，Android 需为不同设备单独适配，开发效率和多设备体验差距显著。\n\n---\n\n## 三、应用模型（FA 模型与 Stage 模型）\n\n### FA 模型与 Stage 模型\n\n- **FA 模型**是早期的应用模型，为应用程序提供必备的组件与运行机制。在该模型中每个应用组件独享一个 ArkTS 引擎实例，适用于简单应用的开发。\n- **Stage 模型**是当前系统主推的应用模型，为应用程序提供必备的组件与运行机制。该模型提供了 `AbilityStage` 组件管理器和 `WindowStage` 窗口管理器，分别作为应用组件与窗口的\"舞台\"，故得名\"Stage 模型\"。Stage 模型支持多个应用组件共享同一个 ArkTS 引擎实例，以及应用组件间的状态共享与对象调用，可以降低内存开销、提升开发效率，适用于复杂应用的开发。\n\n### Stage 模型核心概念\n\n#### AbilityStage\n\n每个 Entry 类型或者 Feature 类型的 HAP 在运行期都有一个 `AbilityStage` 实例，当 HAP 中的代码首次被加载到进程中的时候，系统会先创建 `AbilityStage` 实例。\n\n一个 HAP 包中可以包含一个或多个 `UIAbility`/`ExtensionAbility` 组件，这些组件在运行时共用同一个 `AbilityStage` 实例。当 HAP 中的代码（无论是 `UIAbility` 组件还是 `ExtensionAbility` 组件）首次被加载到进程中的时候，系统会先创建对应的 `AbilityStage` 实例。\n\n#### UIAbility 组件\n\n`UIAbility` 组件是一种包含 UI 的应用组件，主要用于和用户交互。例如，图库类应用可以在 `UIAbility` 组件中展示图片瀑布流，在用户选择某个图片后，在新的页面中展示图片的详细内容。同时用户可以通过返回键返回到瀑布流页面。`UIAbility` 组件的生命周期只包含创建、销毁、前台、后台等状态，与显示相关的状态通过 `WindowStage` 的事件暴露给开发者。\n\n每一个 `UIAbility` 组件实例都会在最近任务列表中显示一个对应的任务。对于开发者而言，可以根据具体场景选择单个还是多个 `UIAbility`，划分建议如下：\n\n- 如果开发者希望在任务视图中看到一个任务，建议使用\"一个 `UIAbility` + 多个页面\"的方式，可以避免不必要的资源加载。\n- 如果开发者希望在任务视图中看到多个任务，或者需要同时开启多个窗口，建议使用多个 `UIAbility` 实现不同的功能。\n\n例如，即时通讯类应用中的消息列表与音视频通话采用不同的 `UIAbility` 进行开发，既可以方便地切换任务窗口，又可以实现应用的两个任务窗口在一个屏幕上分屏显示。\n\n为使应用能够正常使用 `UIAbility`，需要在 `module.json5` 配置文件的 `abilities` 标签中声明 `UIAbility` 的名称、入口、标签等相关信息。\n\n#### ExtensionAbility 组件\n\n`ExtensionAbility` 组件是一种面向特定场景的应用组件。开发者并不直接从 `ExtensionAbility` 派生，而是需要使用 `ExtensionAbility` 的派生类。目前 `ExtensionAbility` 有用于卡片场景的 `FormExtensionAbility`，用于输入法场景的 `InputMethodExtensionAbility`，用于闲时任务场景的 `WorkSchedulerExtensionAbility` 等多种派生类，这些派生类都是基于特定场景提供的。\n\n#### WindowStage\n\n每个 `UIAbility` 类实例都会与一个 `WindowStage` 类实例绑定，该类提供了应用进程内窗口管理器的作用。它包含一个主窗口。也就是说 `UIAbility` 通过 `WindowStage` 持有了一个主窗口，该主窗口为 ArkUI 提供了绘制区域。\n\n#### Context\n\n在 Stage 模型上，`Context` 及其派生类向开发者提供在运行期可以调用的各种资源和能力。`UIAbility` 组件和各种 `ExtensionAbility` 派生类都有各自不同的 `Context` 类，他们都继承自基类 `Context`，但是各自又根据所属组件，提供不同的能力。\n\n`Context` 是应用中对象的上下文，其提供了应用的一些基础信息，例如 `resourceManager`（资源管理）、`applicationInfo`（当前应用信息）、`area`（文件分区）等。\n\n`Context` 的用法：\n\n- 获取基本信息（例如资源管理对象、应用程序信息等）\n- 获取应用文件路径\n- 获取和修改加密分区\n- 监听应用前后台变化\n- 监听 `UIAbility` 生命周期变化\n\n##### ApplicationContext\n\n应用的全局上下文，提供应用级别的信息和能力。通过 `getApplicationContext` 获取。\n\n`ApplicationContext` 在基类 `Context` 的基础上提供了监听应用内应用组件的生命周期的变化、监听系统内存变化、监听应用内系统环境变化、设置应用语言、设置应用颜色模式、清除应用自身数据的同时撤销应用向用户申请的权限等能力，在 `UIAbility`、`ExtensionAbility`、`AbilityStage` 中均可以获取。\n\n##### AbilityStageContext\n\n模块级别的上下文，提供模块级别的信息和能力。可以直接通过 `AbilityStage` 实例获取当前 `AbilityStage` 的 `Context`。可以通过 `createModuleContext` 方法获取同一应用中其他 Module 的 `Context`。\n\n`AbilityStageContext` 和基类 `Context` 相比，额外提供 `HapModuleInfo`、`Configuration` 等信息。\n\n##### UIAbilityContext\n\n`UIAbility` 组件对应的上下文，提供 `UIAbility` 对外的信息和能力。\n\n`UIAbilityContext` 和基类 `Context` 相比，额外提供 `abilityInfo`、`currentHapModuleInfo` 等属性。通过 `UIAbilityContext` 可以获取 `UIAbility` 的相关配置信息，如包代码路径、Bundle 名称、Ability 名称和应用程序需要的环境状态等属性信息，也可以获取操作 `UIAbility` 实例的方法（如 `startAbility()`、`connectServiceExtensionAbility()`、`terminateSelf()` 等）。\n\n##### ExtensionContext\n\n`ExtensionAbility` 组件对应的上下文，每种类型的 `ExtensionContext` 提供不同的信息和能力。\n\n以 `FormExtensionContext` 为例，表示卡片服务的上下文环境，继承自 `ExtensionContext`，提供卡片服务相关的接口能力。\n\n##### UIContext\n\nArkUI 的 UI 实例上下文，提供 UI 操作相关的能力。与上述其他类型的 `Context` 无直接关系。在 UI 组件内获取 `UIContext`，直接使用组件内置的 `getUIContext` 方法。\n\n#### Application 与 Bundle\n\n- **Application** 是应用在设备上的运行实例，作为一个完整的软件实体与用户交互。在 Stage 模型中，它由一个或多个 HAP 作为功能模块构成，这些 HAP 可以共享一个或多个 HSP 中的代码与资源。\n- **Bundle** 是应用在安装部署阶段的静态文件，包含了所有 HAP、HSP 及相关资源；当其被安装并启动后，便形成了在运行期的动态实例 `Application`。\n\n---\n\n## 四、UIAbility 与生命周期\n\n### UIAbility 的生命周期方法\n\n`UIAbility` 组件的核心生命周期回调包括 `onCreate`、`onForeground`、`onBackground`、`onDestroy`。作为一种包含 UI 的应用组件，`UIAbility` 的生命周期不可避免地与 `WindowStage` 的生命周期存在关联关系。\n\n#### UIAbility 启动到前台\n\n- 当用户启动一个 `UIAbility` 时，系统会依次触发 `onCreate()` → `onWindowStageCreate()` → `onForeground()` 生命周期回调。\n- 当用户跳转到其他应用（当前 `UIAbility` 切换到后台）时，系统会触发 `onBackground()` 生命周期回调。\n- 当用户再次将 `UIAbility` 切换到前台时，系统会依次触发 `onNewWant()` → `onForeground()` 生命周期回调。\n\n#### UIAbility 启动到后台\n\n- 当用户通过 `UIAbilityContext.startAbilityByCall()` 接口启动一个 `UIAbility` 到后台时，系统会依次触发 `onCreate()` → `onBackground()`（不会执行 `onWindowStageCreate()` 生命周期回调）。\n- 当用户将 `UIAbility` 拉到前台，系统会依次触发 `onNewWant()` → `onWindowStageCreate()` → `onForeground()` 生命周期回调。\n\n#### 生命周期回调详解\n\n- **`onCreate()`**：在首次创建 `UIAbility` 实例时，系统触发 `onCreate()` 回调。开发者可以在该回调中执行 `UIAbility` 整个生命周期中仅发生一次的启动逻辑。\n- **`onWindowStageCreate()`**：`UIAbility` 实例创建完成之后，在进入前台之前，系统会创建一个 `WindowStage`。`WindowStage` 创建完成后会进入 `onWindowStageCreate()` 回调，开发者可以在该回调中进行 UI 加载、`WindowStage` 的事件订阅。在 `onWindowStageCreate()` 回调中通过 `loadContent()` 方法设置应用要加载的页面，并根据需要调用 `on('windowStageEvent')` 方法订阅 `WindowStage` 的事件（获焦/失焦、切到前台/切到后台、前台可交互/前台不可交互）。\n- **`onForeground()`**：在 `UIAbility` 切换至前台时且 `UIAbility` 的 UI 可见之前，系统触发 `onForeground` 回调。开发者可以在该回调中申请系统需要的资源，或者重新申请在 `onBackground()` 中释放的资源。系统回调该方法后，`UIAbility` 实例进入前台状态，即 `UIAbility` 实例可以与用户交互的状态。`UIAbility` 实例会一直处于这个状态，直到被某些动作打断（例如屏幕关闭、用户跳转到其他 `UIAbility`）。例如，应用已获得地理位置权限。在 UI 显示之前，开发者可以在 `onForeground()` 回调中开启定位功能，从而获取到当前的位置信息。\n- **`onBackground()`**：在 `UIAbility` 的 UI 完全不可见之后，系统触发 `onBackground` 回调，将 `UIAbility` 实例切换至后台状态。开发者可以在该回调中释放 UI 不可见时的无用资源，例如停止定位功能，以节省系统的资源消耗。`onBackground()` 执行时间较短，无法提供足够的时间做一些耗时动作。请勿在该方法中执行保存用户数据或执行数据库事务等耗时操作。\n- **`onWindowStageWillDestroy()`**：在 `UIAbility` 实例销毁之前，系统触发 `onWindowStageWillDestroy()` 回调。该回调在 `WindowStage` 销毁前执行，此时 `WindowStage` 可以使用。开发者可以在该回调中释放通过 `WindowStage` 获取的资源、注销 `WindowStage` 事件订阅等。\n- **`onWindowStageDestroy()`**：在 `UIAbility` 实例销毁之前，系统触发 `onWindowStageDestroy()` 回调，开发者可以在该回调中释放 UI 资源。该回调在 `WindowStage` 销毁后执行，此时 `WindowStage` 不可以使用。\n- **`onDestroy()`**：在 `UIAbility` 实例销毁之前，系统触发 `onDestroy` 回调。该回调是 `UIAbility` 接收到的最后一个生命周期回调，开发者可以在 `onDestroy()` 回调中进行系统资源的释放、数据的保存等操作。例如，开发者调用 `terminateSelf()` 方法通知系统停止当前 `UIAbility` 实例时，系统会触发 `onDestroy()` 回调。\n- **`onNewWant()`**：当应用的 `UIAbility` 实例已创建，再次调用方法启动该 `UIAbility` 实例时，系统触发该 `UIAbility` 的 `onNewWant()` 回调。开发者可以在该回调中更新要加载的资源和数据等，用于后续的 UI 展示。\n\n### UIAbility 启动方式\n\n通过配置 `module.json5` 配置文件中的 `launchType` 字段，可以修改 `UIAbility` 的启动方式。共有三种取值：\n\n#### singleton（单实例模式）\n\n`singleton` 启动模式为单实例模式，也是默认情况下的启动模式。每次调用 `startAbility()` 方法时，如果应用进程中该类型的 `UIAbility` 实例已经存在，则复用系统中的 `UIAbility` 实例。系统中只存在唯一一个该 `UIAbility` 实例，即在最近任务列表中只存在一个该类型的 `UIAbility` 实例。\n\n#### multiton（多实例模式）\n\n`multiton` 启动模式为多实例模式，每次调用 `startAbility()` 方法时，都会在应用进程中创建一个新的该类型 `UIAbility` 实例。即在最近任务列表中可以看到有多个该类型的 `UIAbility` 实例。这种情况下可以将 `UIAbility` 配置为 `multiton`（多实例模式）。\n\n#### specified（指定实例模式）\n\n`specified` 启动模式为指定实例模式，针对一些特殊场景使用（例如文档应用中每次新建文档希望都能新建一个文档实例，重复打开一个已保存的文档希望打开的都是同一个文档实例）。\n\n假设应用有两个 `UIAbility` 实例，即 `EntryAbility` 和 `SpecifiedAbility`。`EntryAbility` 以 `specified` 模式启动 `SpecifiedAbility`。基本原理如下：\n\n1. `EntryAbility` 调用 `startAbility()` 方法，并在 `Want` 的 `parameters` 字段中设置唯一的 Key 值，用于标识 `SpecifiedAbility`。\n2. 系统在拉起 `SpecifiedAbility` 之前，会先进入对应的 `AbilityStage` 的 `onAcceptWant()` 生命周期回调，获取用于标识目标 `UIAbility` 的 Key 值。\n3. 系统会根据获取的 Key 值来匹配 `UIAbility`：\n   - 如果匹配到对应的 `UIAbility`，则会启动该 `UIAbility` 实例，并进入 `onNewWant()` 生命周期回调。\n   - 如果无法匹配对应的 `UIAbility`，则会创建一个新的 `UIAbility` 实例，并进入该 `UIAbility` 实例的 `onCreate()` 生命周期回调和 `onWindowStageCreate()` 生命周期回调。\n\n### AbilityStage 生命周期\n\n- **`onCreate()` 生命周期回调**：在开始加载对应 Module 的第一个应用组件（如 `UIAbility` 组件或具体扩展能力的 `ExtensionAbility` 组件）实例之前会先创建 `AbilityStage`，并在 `AbilityStage` 创建完成之后执行其 `onCreate()` 生命周期回调。`AbilityStage` 模块提供在 Module 加载的时候，通知开发者，可以在此进行该 Module 的初始化（如资源预加载、线程创建等）。通过 `EnvironmentCallback` 来监听系统环境变化，例如系统语言、深浅色模式、屏幕方向、字体大小缩放比例、字体粗细缩放比例等信息。当系统环境变量发生变更时，会触发 `EnvironmentCallback` 中的 `onConfigurationUpdated()` 回调，并打印相关信息。\n- **`onAcceptWant()` 事件回调**：`UIAbility` 指定实例模式（`specified`）启动时触发的事件回调。\n- **`onConfigurationUpdate()` 事件回调**：当系统环境变量（例如系统语言、深浅色等）发生变更时触发的事件回调，配置项均定义在 `Configuration` 类中。\n- **`onMemoryLevel()` 事件回调**：当系统调整内存时触发的事件回调。应用被切换到后台时，系统会将在后台的应用保留在缓存中。即使应用处于缓存中，也会影响系统整体性能。当系统资源不足时，系统会通过多种方式从应用中回收内存，必要时会完全停止应用，从而释放内存用于执行关键任务。为了进一步保持系统内存的平衡，避免系统停止用户的应用进程，可以在 `AbilityStage` 中的 `onMemoryLevel()` 生命周期回调中订阅系统内存的变化情况，释放不必要的资源。\n- **`onNewProcessRequest()` 事件回调**：`UIAbility` 启动时触发的事件回调。通过该回调，开发者可以指定每个 `UIAbility` 启动时是否在独立的进程中创建。该回调返回一个开发者自定义字符串标识，如果返回的字符串标识为开发者曾创建的，则复用该标识所对应的进程，否则创建新的进程。需要注意该回调需要配合在 `module.json5` 中声明 `isolationProcess` 字段为 `true`。\n- **`onPrepareTermination()` 事件回调**：当应用被用户关闭时调用，可用于询问用户选择立即执行操作还是取消操作。开发者通过在回调中返回 `AbilityConstant.PrepareTermination` 中定义的枚举类型通知系统是否继续执行关闭动作。\n- **`onDestroy()` 生命周期回调**：当对应 Module 的最后一个 Ability 实例退出后触发。此方法仅在应用正常销毁时触发。当应用程序异常退出或被终止时，将不会调用此方法。\n\n### @Component 的生命周期\n\n#### 通用生命周期回调（所有 @Component 组件）\n\n这是所有自定义组件都具备的基础生命周期，聚焦组件自身的渲染与销毁：\n\n1. **`aboutToAppear`**\n   - **触发时机**：组件即将执行 `build()` 方法渲染 UI 时触发，首次显示仅执行 1 次（组件销毁重建会重新触发）。\n   - **核心作用**：做轻量初始化，比如设置组件初始状态、绑定简单数据源（如本地缓存数据）。\n   - **注意点**：不能执行耗时操作（如网络请求、大文件解析），否则会阻塞 UI 渲染导致页面卡顿。\n\n2. **`aboutToDisappear`**\n   - **触发时机**：组件即将从渲染树中移除、销毁时触发。\n   - **核心作用**：释放组件内的临时资源，比如关闭定时器、移除事件监听、清空临时变量，这是避免内存泄漏的关键。\n   - **开发实践**：和 `aboutToAppear` 配对使用（比如前者开定时器，后者关定时器）。\n\n#### 根组件特有回调（仅 @Entry 装饰的组件）\n\n`@Entry` 组件是页面的根组件，会关联 Page 页面的前台/后台状态，因此多了 3 个特有回调：\n\n1. **`onPageShow`**\n   - **触发时机**：页面进入前台显示时（包括首次打开页面、从后台切回应用）。\n   - **核心作用**：恢复页面级的业务逻辑，比如刷新列表数据、重启音频/视频播放、恢复用户操作状态。\n\n2. **`onPageHide`**\n   - **触发时机**：页面进入后台隐藏时（比如跳转到其他页面、切到手机桌面）。\n   - **核心作用**：暂停非必要的前台逻辑，比如暂停播放、保存表单临时输入内容、停止高频轮询。\n\n3. **`onBackPress`**\n   - **触发时机**：用户点击系统返回键时。\n   - **核心作用**：自定义返回逻辑（面试高频考点）：返回 `true` 表示拦截默认返回行为（比如弹出\"确认退出\"对话框），返回 `false` 表示执行系统默认返回逻辑（返回上一页）。\n\n#### 核心执行顺序\n\n1. **首次打开**：`Page.onCreate()` → 根组件 `aboutToAppear()` → 子组件 `aboutToAppear()` → `Page.onActive()` → 根组件 `onPageShow()`\n2. **切到后台**：`Page.onInactive()` → 根组件 `onPageHide()` → `Page.onBackground()`\n3. **切回前台**：`Page.onForeground()` → `Page.onActive()` → 根组件 `onPageShow()`\n4. **点击返回键销毁**：根组件 `onBackPress()` → 根组件 `onPageHide()` → `Page.onInactive()` → `Page.onBackground()` → 子组件 `aboutToDisappear()` → 根组件 `aboutToDisappear()` → `Page.onDestroy()`\n\n### Want\n\n`Want` 是一种对象，用于在应用组件之间传递信息。其中，一种常见的使用场景是作为 `startAbility()` 方法的参数。例如，当 `UIAbilityA` 需要启动 `UIAbilityB` 并向 `UIAbilityB` 传递一些数据时，可以使用 `Want` 作为一个载体，将数据传递给 `UIAbilityB`。\n\n#### Want 的类型\n\n- **显式 Want**：在启动目标应用组件时，调用方传入的 `want` 参数中指定了 `abilityName` 和 `bundleName`，称为显式 `Want`。显式 `Want` 通常用于应用内组件启动，通过在 `Want` 对象内指定本应用 Bundle 名称信息（`bundleName`）和 `abilityName` 来启动应用内目标组件。当有明确处理请求的对象时，显式 `Want` 是一种简单有效的启动目标应用组件的方式。\n- **隐式 Want**：在启动目标应用组件时，调用方传入的 `want` 参数中未指定 `abilityName`，称为隐式 `Want`。当需要处理的对象不明确时，可以使用隐式 `Want`，在当前应用中使用其他应用提供的某个能力，而不关心提供该能力的具体应用。隐式 `Want` 使用 `skills` 标签来定义需要使用的能力，并由系统匹配声明支持该请求的所有应用来处理请求。例如，需要打开一个链接的请求，系统将匹配所有声明支持该请求的应用，然后让用户选择使用哪个应用打开链接。\n\n### UIAbility 间的数据传递方式\n\n- **使用 `EventHub` 进行数据通信**：在基类 `Context` 中提供了 `EventHub` 对象，可以通过发布订阅方式来实现事件的传递。在事件传递前，订阅者需要先进行订阅，当发布者发布事件时，订阅者将接收到事件并进行相应处理。\n  1. 获取 `EventHub` 对象\n  2. 通过 `eventHub.on` 注册事件监听\n  3. 通过 `eventHub.emit` 触发事件\n- **使用 `AppStorage`/`LocalStorage` 进行数据同步**：ArkUI 提供了 `AppStorage` 和 `LocalStorage` 两种应用级别的状态管理方案，可用于实现应用级别和 `UIAbility` 级别的数据同步。\n  - `AppStorage` 是一个全局的状态管理器，适用于多个 `UIAbility` 共享同一状态数据的情况。\n  - `LocalStorage` 则是一个局部的状态管理器，适用于单个 `UIAbility` 内部使用的状态数据。\n\n---\n\n## 五、状态管理\n\n### 状态管理原理\n\n#### 收集依赖\n\n收集依赖是指建立状态变量与组件之间的数据绑定关系。在 UI 渲染时，状态管理框架会\"观察\"哪些状态变量被读取了，并记录下这个\"依赖关系\"。一个 UI 界面上可能使用了多个状态变量，在修改状态变量时，仅与该状态变量相关的组件进行 UI 刷新，其他不相关的组件不会刷新。因此，UI 刷新时需要明确哪些组件使用了被修改的状态变量，以能够实现这些组件的精准刷新。\n\n#### 触发更新\n\n当状态变量发生改变时，状态管理框架会通知所有依赖于它的 UI 组件，重新计算并刷新，这个过程称为触发更新。触发更新大致可以分为三个步骤：\n\n1. 计算状态变量发生改变后的新值。\n2. 修改状态变量的值，并将与其绑定的组件标脏。\n3. 刷新所有的脏节点，更新 UI 的同时重新收集依赖。\n\n#### 状态管理在渲染管线中的流程\n\n事件触发状态变量发生改变，执行状态变量的 set 方法，将自定义组件和系统组件标脏，并请求一个刷新信号。\n\n1. **刷新脏节点**：刷新标脏的自定义组件和系统组件。\n2. **布局**：根据标脏局部刷新组件树，触发子树上节点的尺寸测量和位置确认。\n\n状态管理循环执行两大步骤：收集依赖和触发更新。收集状态变量与组件之间的依赖关系。当状态变量发生变化时，执行标脏，刷新对应的 UI，同时更新依赖关系。\n\n相比状态管理 V1，状态管理 V2 在状态变量变化时，会异步标脏组件。\n\n### 状态管理 V1 和 V2 更新机制差异\n\n- **状态管理 V1** 使用代理观察数据，创建状态变量时，会同时创建一个数据代理观察者。该观察者可以感知代理变化，但无法精准观测到实际数据变化，V1 状态管理存在以下限制：\n  - 状态变量不能独立于 UI 存在，同一个数据被多个视图代理时，其中一个视图的更改不会通知其他视图更新。\n  - 只能感知对象属性第一层的变化，无法做到深度观测和深度监听。\n  - 在更改对象中属性场景下存在冗余更新的问题。\n  - 装饰器间配合使用限制多，不易用。组件中没有明确状态变量的输入与输出，不利于组件化。\n\n- **状态管理 V2** 增强了数据的观察能力，使数据本身可观察。更改数据时，会触发相应视图的更新。相较于状态管理 V1，状态管理 V2 有如下优点：\n  - 状态变量独立于 UI，更改数据会触发相应视图的更新。\n  - 支持对象的深度观测和深度监听，且深度观测机制不影响观测性能。\n  - 支持对象中属性级精准更新。\n  - 装饰器易用性高、拓展性强，在组件中明确输入与输出，有利于组件化。\n\n### 鸿蒙常见的装饰器\n\n#### 一、组件/UI 核心装饰器\n\n1. `@Entry`：标记自定义组件为页面根组件，唯一且绑定 Page 生命周期，一个页面仅能有一个。\n2. `@Component`：标记普通自定义组件，是构建 UI 的基础单元，可嵌套使用。\n3. `@Builder`：封装可复用的 UI 片段，实现 UI 逻辑抽离与复用。\n4. `@BuilderParam`：将 `@Builder` 装饰的 UI 片段作为参数传入组件，提升组件灵活性。\n5. `@Extend`：扩展已有系统组件的属性/方法，无需继承即可新增 UI 能力。\n6. `@CustomDialog`：标记自定义弹窗组件，用于创建个性化弹窗。\n\n#### 二、状态管理装饰器\n\n1. `@State`：组件内私有状态，值变化触发组件重新渲染。\n2. `@Prop`：单向同步父组件状态，父组件值变化子组件更新，子组件修改不反向影响父组件。\n3. `@Link`：双向同步父组件状态，父子组件状态互相同步。\n4. `@Provide`/`@Consume`：跨多层组件的状态共享，无需逐层传递，通过相同 key 关联。\n5. `@Observed`/`@ObjectLink`：针对自定义对象的深度状态监听，对象属性变化触发渲染。\n6. `@Watch`：监听状态变量变化，触发指定回调函数，用于状态变更后的逻辑处理。\n\n#### 三、并发/线程相关装饰器\n\n1. `@Concurrent`：标记函数可在 `TaskPool` 中并发执行，是 `TaskPool` 使用的核心标记。\n2. `@WorkerThread`：标记函数需在 `Worker` 线程执行，约束线程执行范围。\n\n#### 四、其他核心装饰器\n\n1. `@Preview`：预览自定义组件，无需运行应用即可在 IDE 中查看 UI 效果。\n2. `@EntryAbility`：标记应用入口 Ability，关联应用全局生命周期。\n3. `@Require`：声明组件属性为必传项，增强组件使用的健壮性。\n\n### @Observed 装饰器和 @ObjectLink 装饰器的作用\n\n`@State`、`@Prop`、`@Link`、`@Provide` 和 `@Consume` 装饰器仅能观察到第一层的变化，但是在实际应用开发中，应用会根据开发需要，封装自己的数据模型。对于多层嵌套的情况，比如二维数组、对象数组、嵌套类场景，无法观察到第二层的属性变化。因此，为了实现对嵌套数据结构中深层属性变化的观察，引入了 `@Observed` 和 `@ObjectLink` 装饰器。\n\n- `@ObjectLink` 和 `@Observed` 类装饰器配合使用，可实现嵌套对象或数组的双向数据同步，使用方式如下：\n  - 将数组项或类属性声明为 `@Observed` 装饰的类型。\n  - 在子组件中使用 `@ObjectLink` 装饰的状态变量，用于接收父组件 `@Observed` 装饰的类实例，从而建立双向数据绑定。\n- API version 19 之前，`@ObjectLink` 只能接收 `@Observed` 装饰的类实例；API version 19 及以后，`@ObjectLink` 也可以接收复杂类型，无 `@Observed` 装饰的限制。但需注意，如需观察嵌套类型场景，需要其接收 `@Observed` 装饰的类实例或 `makeV1Observed` 的返回值。示例请参考二维数组。\n\n### @Watch 装饰器的作用\n\n`@Watch` 应用于对状态变量的监听。如果开发者需要关注某个状态变量的值是否改变，可以使用 `@Watch` 为状态变量设置回调函数。`@Watch` 提供了状态变量的监听能力，`@Watch` 仅能监听到可以观察到的变化。\n\n#### 如何避免 @Watch 的循环\n\n循环可能是因为在 `@Watch` 的回调方法里直接或者间接地修改了同一个状态变量引起的。为了避免循环的产生，建议不要在 `@Watch` 的回调方法里修改当前装饰的状态变量。\n\n### 如何实现应用级的、或者多个页面的状态数据共享\n\n- **`LocalStorage`**：页面级 UI 状态存储，通常用于 `UIAbility` 内、页面间的状态共享。\n- **`AppStorage`**：特殊的单例 `LocalStorage` 对象，由 UI 框架在应用程序启动时创建，为应用程序 UI 状态属性提供中央存储。\n- **`PersistentStorage`**：持久化存储 UI 状态，通常和 `AppStorage` 配合使用，选择 `AppStorage` 存储的数据写入磁盘，以确保这些属性在应用程序重新启动时的值与应用程序关闭时的值相同。\n- **`Environment`**：应用程序运行的设备的环境参数，环境参数会同步到 `AppStorage` 中，可以和 `AppStorage` 搭配使用。\n\n### 状态管理（V2）提供了哪些能力\n\n#### 管理组件拥有的状态\n\n- `@Local` 装饰器：组件内部状态\n- `@Param`：组件外部输入\n- `@Once`：初始化同步一次\n- `@Event` 装饰器：规范组件输出\n- `@Provider` 装饰器和 `@Consumer` 装饰器：跨组件层级双向同步\n\n#### 管理数据对象的状态\n\n- `@ObservedV2` 装饰器和 `@Trace` 装饰器：类属性变化观测\n- `@Monitor` 装饰器：状态变量修改监听\n- `@Computed` 装饰器：计算属性\n- `@Type` 装饰器：标记类属性的类型\n\n#### 管理应用拥有的状态\n\n- `AppStorageV2`：应用全局 UI 状态存储\n- `PersistenceV2`：持久化存储 UI 状态\n\n### @Monitor 与 @Watch 对比\n\n- `@Watch` 仅能在 `@Component` 装饰的组件中监听单个状态变量，无法获取变化前值；`@Watch` 是同步监听的。\n- `@Monitor` 可在 `@ComponentV2` 或 `@ObservedV2` 装饰的类中同时监听多个状态变量或 `@Trace` 装饰的属性，并能获取变化前值，监听能力也更深层。`@Monitor` 是异步监听的。\n\n### LazyForEach 和 Repeat 对比\n\n`Repeat` 是 ArkUI 在 API version 12 中新引入的循环渲染组件，相比 `LazyForEach` 具有更简洁的 API、更丰富的功能以及更强的性能优化能力。\n\n- `Repeat` 直接监听状态变量的变化，而 `LazyForEach` 需要开发者实现 `IDataSource` 接口，手动管理子组件内容/索引的修改。\n- `Repeat` 还增强了节点复用能力，提高了长列表滑动和数据更新的渲染性能。\n- `Repeat` 增加了渲染模板（template）的能力，在同一个数组中，根据开发者自定义的模板类型（template type）渲染不同的子组件。\n\n### 如何解决 LazyForEach 数据源变更后界面闪烁的问题\n\n#### 1. 确保 key 值唯一且稳定\n\n`LazyForEach` 的第三个参数 `keyGenerator` 是组件复用的唯一依据，key 不稳定会直接导致组件销毁重建：\n\n- **禁止用数组索引（index）作为 key**：数据源增删时索引会整体变化，所有后续组件的 key 失效，触发全量重建。\n- **必须用数据源项的唯一标识**（如 id、uuid、业务唯一字段）作为 key：仅变更项的 key 变化，其余组件可正常复用。\n- 核心要点：key 值需与数据项强绑定，且在生命周期内不重复、不随意变更。\n\n#### 2. 精准更新数据源（避免全量替换触发重渲染）\n\n直接替换整个数据源数组（如 `this.list = newList`）会触发 `LazyForEach` 全量重渲染，需改为\"局部精准更新\"：\n\n- **增删数据项**：使用数组的 `splice`/`push`/`pop`/`unshift`（仅尾部操作）等方法，而非重新赋值数组（如 `this.list.splice(1, 1, newItem)` 仅更新指定项）。\n- **修改数据项属性**：直接修改数组中指定项的属性（配合 `@Observed`/`@ObjectLink` 实现对象深度监听），而非替换整个项（如 `this.list[0].name = '新名称'`，而非 `this.list[0] = newItem`）。\n- **禁止\"清空后重新赋值\"**：避免 `this.list = []; this.list = newList` 这类操作，会触发两次全量渲染。\n\n#### 3. 优化子组件渲染逻辑（减少无效重渲染）\n\n子组件的非必要重渲染会加剧闪烁，需通过\"按需渲染\"优化：\n\n- 子组件添加 `@Memo` 装饰：仅当入参（props）变化时才重渲染，避免父组件刷新时子组件无脑重建。\n- 避免在 `build` 方法中创建新对象/函数：每次 `build` 都会生成新引用（如 `build() { const obj = {a:1}; return Child({data: obj}) }`），触发子组件重渲染，需将对象/函数抽离到组件外部或状态变量中。\n- 耗时操作异步化：图片加载、数据计算等逻辑放在 `aboutToAppear` 中，而非 `build` 方法，避免阻塞渲染导致的视觉闪烁。\n\n#### 4. 控制数据更新时机（应对高频变更场景）\n\n高频数据源变更（如实时刷新、搜索联想）会触发多次渲染，需\"降频\"处理：\n\n- **防抖/节流**：对高频更新的数据源做防抖（如延迟 50ms 再更新），合并多次小更新为一次大更新，减少渲染次数。\n- **批量更新**：将多次数据变更合并为一次操作（如先收集变更项，再统一调用 `splice`），避免频繁触发 `LazyForEach` 渲染。\n\n### 兄弟组件如何通信\n\n1. 公共父组件传递\n2. 全局状态管理（`AppStorage` 或 `LocalStorage`）\n3. 本地文件读写\n\n---\n\n## 六、导航与路由\n\n### 路由模式（Router）\n\n`Router` 模块提供了两种跳转模式，分别是 `pushUrl` 和 `replaceUrl`。这两种模式决定了目标页面是否会替换当前页：\n\n- **`pushUrl`**：目标页面不会替换当前页，而是压入页面栈。这样可以保留当前页的状态，并且可以通过返回键或者调用 `back` 方法返回到当前页。\n- **`replaceUrl`**：目标页面会替换当前页，并销毁当前页。这样可以释放当前页的资源，并且无法返回到当前页。\n\n`Router` 模块提供了两种实例模式，分别是 `Standard` 和 `Single`。这两种模式决定了目标 url 是否会对应多个实例：\n\n- **Standard（多实例模式）**：也是默认情况下的跳转模式。目标页面会被添加到页面栈顶，无论栈中是否存在相同 url 的页面。\n- **Single（单实例模式）**：如果目标页面的 url 已经存在于页面栈中，则会将离栈顶最近的同 url 页面移动到栈顶，该页面成为新建页。如果目标页面的 url 在页面栈中不存在同 url 页面，则按照默认的多实例模式进行跳转。\n\n### Navigation 组件与 Router 跳转的区别\n\n组件导航（`Navigation`）主要用于实现 `Navigation` 页面（`NavDestination`）间的跳转，支持在不同 `Navigation` 页面间传递参数，提供灵活的跳转栈操作，从而更便捷地实现对不同页面的访问和复用。\n\n`Navigation` 是路由导航的根视图容器，一般作为页面（`@Entry`）的根容器，包括单栏（Stack）、分栏（Split）和自适应（Auto）三种显示模式。`Navigation` 组件适用于模块内和跨模块的路由切换，通过组件级路由能力实现更加自然流畅的转场体验，并提供多种标题栏样式来呈现更好的标题和内容联动效果。一次开发，多端部署场景下，`Navigation` 组件能够自动适配窗口显示大小，在窗口较大的场景下自动切换分栏展示效果。\n\n`Navigation` 组件主要包含导航页和子页。导航页由标题栏（包含菜单栏）、内容区和工具栏组成，可以通过 `hideNavBar` 属性进行隐藏，导航页不存在路由栈中，与子页以及子页之间可以通过路由操作进行切换。\n\n`Navigation` 路由相关的操作都是基于导航控制器 `NavPathStack` 提供的方法进行，每个 `Navigation` 都需要创建并传入一个 `NavPathStack` 对象，用于管理页面。主要涉及页面跳转、页面返回、页面替换、页面删除、参数获取、路由拦截等功能。\n\n因此，组件导航（`Navigation`）支持更丰富的动效、一次开发多端部署能力和更灵活的栈操作。而 `Router` 模块仅是通过不同的 url 地址，可以方便地进行页面路由，访问不同的页面。\n\n### Navigation 组件显示模式\n\n`Navigation` 组件通过 `mode` 属性设置页面的显示模式：\n\n- **自适应模式**：`Navigation` 组件默认为自适应模式，此时 `mode` 属性为 `NavigationMode.Auto`。自适应模式下，当页面宽度大于等于一定阈值（API version 9 及以前：520vp，API version 10 及以后：600vp）时，`Navigation` 组件采用分栏模式，反之采用单栏模式。\n- **单栏模式**：将 `mode` 属性设置为 `NavigationMode.Stack` 开启单栏模式。适用于窄屏设备，发生路由跳转时，整个页面都会被替换。\n- **分栏模式**：将 `mode` 属性设置为 `NavigationMode.Split` 开启分栏模式。适用于宽屏设备，分为左右两部分，发生路由跳转时，只有右边子页会被替换。\n\n### Navigation 组件的组成部分\n\n标题栏（左上）、菜单栏（右上）、内容区（中心）和工具栏（底部）。\n\n#### 标题栏模式\n\n`Navigation` 组件通过 `titleMode` 属性设置标题栏模式：\n\n- **Mini 模式**：普通标题栏，用于一级页面不需要突出标题的场景。\n- **Full 模式**：强调型标题栏，用于一级页面需要突出标题的场景。\n\n#### 菜单栏参数类型\n\n`menus` 支持 `Array<NavigationMenuItem>` 和 `CustomBuilder` 两种参数类型。使用 `Array<NavigationMenuItem>` 类型时，竖屏最多支持显示 3 个图标，横屏最多支持显示 5 个图标，多余的图标会被放入自动生成的更多图标。\n\n### Navigation 路由操作（NavPathStack）\n\n#### 页面跳转\n\n- `pushPath`\n- `pushPathByName`\n- `pushDestination`\n- `pushDestinationByName`\n\n#### 页面返回\n\n- `pop`\n- `popToName`\n- `popToIndex`\n- `clear`\n\n#### 页面替换\n\n- `replacePath`\n- `replacePathByName`\n- `replaceDestination`\n\n#### 页面删除\n\n- `removeByName`\n- `removeByIndex`\n- `removeByDestinationId`\n\n#### 移动页面到栈顶\n\n- `moveToTop`\n- `moveIndexToTop`\n\n### NavDestination 子页面模式\n\n- **标准类型**：`NavDestination` 组件默认为标准类型，此时 `mode` 属性为 `NavDestinationMode.STANDARD`。标准类型的 `NavDestination` 的生命周期跟随其在 `NavPathStack` 路由栈中的位置变化而改变。\n- **弹窗类型**：`NavDestination` 设置 `mode` 为 `NavDestinationMode.DIALOG` 弹窗类型，此时整个 `NavDestination` 默认透明显示。弹窗类型的 `NavDestination` 显示和消失时不会影响下层标准类型的 `NavDestination` 的显示和生命周期，两者可以同时显示。\n\n### 跨包路由的实现方式\n\n#### 系统路由表\n\n系统路由表相对自定义路由表，使用更简单，只需要添加对应页面跳转配置项，即可实现页面跳转。跳转前无需 import 页面文件，页面按需动态加载。可扩展性一般，易用性更强，系统自动维护路由表。\n\n在 `resources/base/profile` 中创建 `route_map.json` 并配置，再在 `module.json5` 配置文件的 `module` 标签中定义 `routerMap` 字段，指向定义的路由表配置文件，即可使用系统路由表。\n\n#### 自定义路由表\n\n自定义路由表使用起来更复杂，但是可以根据应用业务进行定制处理。跳转前需要 import 页面文件。可扩展性更强，易用性一般，需要开发者自行维护路由表。\n\n调用 `@Builder` 修饰的 `pageMap` 即可使用自定义路由表。\n\n---\n\n## 七、项目结构与模块\n\n### HAP、HSP、HAR 的区别\n\n#### HAP（HarmonyOS Ability Package）—— 应用运行的\"最终载体\"\n\nHAP（Harmony Ability Package）是应用安装和运行的基本单元。HAP 包是由代码、资源、第三方库、配置文件等打包生成的模块包，其主要分为两种类型：`entry` 和 `feature`。\n\n- **entry**：应用的主模块，作为应用的入口，提供了应用的基础功能。\n- **feature**：应用的动态特性模块，作为应用能力的扩展，可以根据用户的需求和设备类型进行选择性安装。\n\n应用程序包可以只包含一个基础的 entry 包，也可以包含一个基础的 entry 包和多个功能性的 feature 包。\n\n- **单 HAP 场景**：如果只包含 `UIAbility` 组件，无需使用 `ExtensionAbility` 组件，优先采用单 HAP（即一个 entry 包）来实现应用开发。虽然一个 HAP 中可以包含一个或多个 `UIAbility` 组件，为了避免不必要的资源加载，推荐采用\"一个 `UIAbility` + 多个页面\"的方式。\n- **多 HAP 场景**：如果应用的功能比较复杂，需要使用 `ExtensionAbility` 组件，可以采用多 HAP（即一个 entry 包 + 多个 feature 包）来实现应用开发，每个 HAP 中包含一个 `UIAbility` 组件或者一个 `ExtensionAbility` 组件。在这种场景下，多个 HAP 引用相同的库文件，可能导致重复打包的问题。\n\n#### HSP（HarmonyOS Shared Package）—— 运行时的\"共享模块\"\n\nHSP（Harmony Shared Package）是动态共享包，包含代码、C++ 库、资源和配置文件，通过 HSP 可以实现代码和资源的共享。HSP 不支持独立发布上架，而是跟随宿主应用的 APP 包一起发布，与宿主应用同进程，具有相同的包名和生命周期。\n\n#### HAR（HarmonyOS Archive）—— 编译时的\"静态工具包\"\n\nHAR（Harmony Archive）是静态共享包，可以包含代码、C++ 库、资源和配置文件。通过 HAR 可以实现多个模块或多个工程共享 ArkUI 组件、资源等相关代码。\n\n- 支持应用内共享，也可以作为二方库（SDK）、三方库（SDK）发布后供其他应用使用。\n- 作为二方库（SDK），发布到 OHPM 私仓，供公司内部其他应用使用。\n- 作为三方库（SDK），发布到 OHPM 中心仓，供其他应用使用。\n\n### 鸿蒙应用的配置文件\n\n- **`app.json5`**：应用级全局配置文件，定义应用包名（`bundleName`，推荐反域名方式）、版本、图标、名称、支持设备类型等全局基础信息，配置全局网络策略与权限，关联主模块配置。\n- **`module.json5`**：模块级核心配置文件，声明模块类型、应用入口 `UIAbility`、页面路由规则，配置模块所需权限、组件启动条件，是模块功能的核心定义文件。\n- **`resources` 下的资源配置文件**：统一管理字符串、颜色、尺寸、图片等资源，支撑应用多语言、多设备适配，规范资源引用与映射。\n  - `element.json`：管理字符串、颜色、尺寸、布尔值等基础元素类资源，定义资源名称与对应值的映射关系，是实现多语言、多尺寸适配的核心配置文件。\n  - `media.json`：负责管理图片、音频、视频等媒体类资源，建立资源名称与实际媒体文件的关联映射，规范媒体资源的统一引用方式。\n  - `profile.json`：主要管理布局、动画等配置类资源，定义布局样式、动画效果等相关配置规则，支撑 UI 布局与动效的标准化管理。\n- **`oh-package.json5`**：项目依赖管理配置文件，管理第三方依赖包、开发依赖与项目脚本，控制依赖版本与项目依赖关系。\n- **`hvigorfile.ts`**：项目构建配置文件，配置鸿蒙应用编译、打包规则，自定义构建流程、打包类型与编译模式。\n- **`tsconfig.json` 与 `.eslintrc.js`**：分别为 ArkTS 编译配置和代码规范配置，定义代码编译规则、类型检查标准与代码校验规范，保障代码质量。\n\n### ohpm 和 npm 的区别\n\n- **核心差异**：npm 是通用型包管理工具（面向 Web/Node.js），ohpm 是鸿蒙专属工具（适配鸿蒙技术栈与工程结构）。\n- **关键价值**：ohpm 解决了 npm 包无法直接在鸿蒙应用中使用的问题，提供鸿蒙生态的包校验与多设备适配。\n- **使用场景**：开发鸿蒙应用优先用 ohpm，通用前端/Node.js 项目用 npm。\n\n### 如何在 build-profile.json5 中定义 phone、wearable、car 三个 product\n\n#### 基础配置结构\n\n- 在 `build-profile.json5` 的 `app` 节点下新增 `products` 数组，数组内分别定义 phone、wearable、car 三个 product 对象，每个对象包含 `name`（产品名称）、`deviceType`（设备类型）、`modules`（模块配置）核心字段。\n- 确保 `deviceType` 与鸿蒙设备类型规范一致：phone 对应 `phone`，wearable 对应 `wearable`，car 对应 `car`，系统会根据该字段适配编译规则。\n\n#### 各 product 核心配置项\n\n- `name`：命名需唯一且语义化，如 `phone_product`、`wearable_product`、`car_product`。\n- `deviceType`：明确指定设备类型，phone 设为 `[\"phone\"]`，wearable 设为 `[\"wearable\"]`，car 设为 `[\"car\"]`（数组格式支持多设备兼容）。\n- `modules`：配置对应模块的编译参数，核心包含 `name`（模块名，如 entry）、`srcPath`（模块路径，如 `\"./entry\"`）、`target`（编译目标，设为 `ohos`），可按需添加 `compileSdkVersion`（编译 SDK 版本）、`runtimeOS`（运行时系统）等参数。\n\n#### 差异化配置（可选）\n\n- 针对不同设备的特性，在对应 product 的 `modules` 中添加差异化参数，如 wearable 设置更小的 `minAPIVersion`（适配手表低版本系统），car 设置 `orientation`（横屏）等布局参数。\n- 若需区分资源编译，可在 `modules` 中配置 `resourceProfile`，指定不同设备的资源目录（如 phone 用 phone 目录、wearable 用 wearable 目录）。\n\n### 应用文件加密分区\n\n- **EL1**：对于私有文件，如闹铃、壁纸等，应用可以将这些文件放到设备级加密分区（EL1）中，以保证在用户输入密码前就可以被访问。\n- **EL2**：对于更敏感的文件，如个人隐私信息等，应用可以将这些文件放到更高级别的加密分区（EL2）中，以保证更高的安全性。\n- **EL3**：对于应用中的记录步数、文件下载、音乐播放，需要在锁屏时读写和创建新文件，放在（EL3）的加密分区比较合适。\n- **EL4**：对于用户安全信息相关的文件，锁屏时不需要读写文件、也不能创建文件，放在（EL4）的加密分区更合适。\n- **EL5**：对于用户隐私敏感数据文件，锁屏后默认不可读写，如果锁屏后需要读写文件，则锁屏前可以调用 `acquireAccess` 接口申请继续读写文件，或者锁屏后也需要创建新文件且可读写，放在（EL5）的应用级加密分区更合适。\n\n---\n\n## 八、权限管理\n\n### 鸿蒙权限分级机制\n\n#### 核心分级框架\n\n鸿蒙权限分级以风险等级和用户隐私/系统安全影响程度为核心依据，采用\"权限自身等级 + 应用 APL 等级 + 授权方式\"三维管控体系，权限自身分为 `normal`、`system_basic`、`system_core` 三级，应用 APL 等级与权限等级严格匹配，授权方式分为系统授权（`system_grant`）和用户授权（`user_grant`），核心遵循\"最小权限\"与\"用户知情同意\"原则。\n\n#### 具体分级与规则\n\n- **`normal` 级权限**为普通权限，风险极低，不涉及敏感隐私，采用系统授权，应用安装时自动授予，普通应用可自由申请，典型如网络访问、获取网络状态。\n- **`system_basic` 级权限**为基础系统权限，风险中等，涉及基础系统服务或有限隐私，部分为系统授权，部分需用户动态授权，普通应用仅可申请特定项，典型如用户身份认证、管理域账号。\n- **`system_core` 级权限**为核心系统权限，风险极高，涉及操作系统核心能力，仅系统应用可申请，采用严格审批与系统授权，普通应用禁止配置，典型如修改系统核心设置、安装应用。\n\n#### 核心机制\n\n- 敏感权限（如分布式数据同步、相机、位置）均属于需用户授权的权限，无论静态声明与否，必须运行时动态申请，静态声明仅为前置注册条件。\n- 应用 APL 等级决定权限申请范围，普通应用默认 `normal` 级，无法申请 `system_core` 级权限，`system_basic` 级权限需符合特定场景并经审核。\n- 鸿蒙 Next 进一步优化分级，新增 AI 敏感权限等分类，强化高敏感权限管控，要求应用上架前完成权限合规性检查。\n\n### 敏感权限列表\n\n#### 个人数据访问类\n\n- `ohos.permission.READ_CONTACTS`（读取联系人）\n- `WRITE_CONTACTS`（写入联系人）\n- `READ_CALENDAR`（读取日历）\n- `WRITE_CALENDAR`（写入日历）\n- `READ_HEALTH_DATA`（读取健康数据）\n- `READ_IMAGEVIDEO`（读取图片视频）\n- `WRITE_IMAGEVIDEO`（写入图片视频）\n\n#### 设备功能使用类\n\n- `ohos.permission.CAMERA`（相机）\n- `MICROPHONE`（麦克风）\n- `LOCATION`（位置）\n- `LOCATION_IN_BACKGROUND`（后台位置）\n\n#### 通信与网络类\n\n- `ohos.permission.READ_SMS`（读取短信）\n- `SEND_SMS`（发送短信）\n- `CALL_PHONE`（拨打电话）\n- `READ_PHONE_STATE`（读取电话状态）\n\n#### 分布式能力类\n\n- `ohos.permission.DISTRIBUTED_DATASYNC`（分布式数据同步）\n- `DISCOVER`（设备发现）\n- `DISTRIBUTED_DEVICE_MANAGE`（分布式设备管理）\n\n### 在 module.json5 中声明权限后为何仍需动态授权\n\n在 `module.json5` 中同时声明 `ohos.permission.DISTRIBUTED_DATASYNC` 与 `DISCOVER` 权限时，仍需动态授权的原因：\n\n- **鸿蒙权限分级机制**：`ohos.permission.DISTRIBUTED_DATASYNC`（分布式数据同步）与 `DISCOVER`（设备发现）均属于敏感/危险权限等级，该等级权限要求仅静态声明无法生效，必须通过动态授权让用户明确知晓并确认授予，静态声明仅为权限申请的前置条件。\n- **静态声明的作用边界**：`module.json5` 中声明权限仅用于告知系统应用需使用该权限，完成安装时的权限注册，并不会让应用实际获得权限使用能力，动态授权是运行时获取权限使用权限的必要环节。\n- **隐私与安全规范要求**：这类权限涉及设备互联、数据跨设备同步，直接关联用户隐私和设备安全，鸿蒙系统强制要求运行时动态授权，确保用户可自主决定是否授予，避免应用在用户不知情的情况下获取敏感权限。\n\n---\n\n## 九、跨设备开发\n\n### 鸿蒙如何实现一次开发多端部署\n\n#### 整体架构\n\n- **底层**：通过\"分布式软总线 + 多内核适配\"，让不同设备的系统能力互通，应用无需关注设备底层差异。\n- **中层**：通过\"统一的应用框架（Stage 模型）+ 方舟编译器\"，屏蔽不同设备的运行环境差异。\n- **上层**：通过\"设备形态配置 + 自适应 UI + 动态布局\"，让一套 UI 适配不同屏幕尺寸、交互方式（触屏/语音/按键）。\n\n#### 1. 统一的开发语言与框架（基础前提）\n\n- **核心语言**：ArkTS（鸿蒙主推），基于 TypeScript 扩展，内置\"跨设备适配语法\"，无需为不同设备编写差异化语言代码。\n- **统一框架**：Stage 模型（推荐）作为应用核心框架，将应用拆分为\"Ability/Page/Component\"三层，层与层之间解耦，组件可跨设备复用。\n\n#### 2. 设备形态配置（核心适配手段）\n\n鸿蒙通过\"配置文件 + 条件编译\"，让一套代码根据设备类型加载差异化配置：\n\n- **设备配置文件**：在 `main_pages.json`/`module.json5` 中声明设备类型（phone/tablet/watch/car），指定不同设备的入口页面、窗口尺寸、权限。\n- **条件编译（`@ohos:systemcapability`）**：在代码中通过系统能力判断设备类型，执行差异化逻辑（如手表隐藏复杂图表、车机放大字体）；示例逻辑：`if (deviceType === 'watch') { 渲染极简UI } else { 渲染完整UI }`。\n- **资源分级适配**：在 `resources` 目录下按设备类型（`phone`/`tablet`/`watch`）、屏幕尺寸、分辨率存放差异化资源（图片、字体、布局参数），系统自动加载适配资源。\n\n#### 3. 自适应 UI 组件与布局（视觉适配核心）\n\n鸿蒙提供\"自适应能力\"的原生组件和布局方式，无需为不同设备单独写布局：\n\n- **弹性布局（Flex/Grid）**：替代固定尺寸布局，组件根据屏幕尺寸自动伸缩（如 Grid 布局在手机端显示 2 列、平板端显示 4 列）。\n- **响应式组件**：鸿蒙原生组件（`Text`/`Image`/`List` 等）内置自适应能力，如 `Text` 自动换行、`Image` 根据容器尺寸缩放，支持 `matchParent`/`wrapContent`/百分比尺寸。\n- **媒体查询（MediaQuery）**：监听屏幕尺寸、方向变化，动态调整 UI 布局（如横屏时切换为左右布局，竖屏时切换为上下布局）。\n- **`LazyForEach` 高性能渲染**：统一的列表渲染组件，自动适配不同设备的滚动性能（如手表端自动减少渲染项数）。\n\n#### 4. 元能力与分布式部署（跨设备运行核心）\n\n鸿蒙将应用拆分为\"元能力（Ability）\"，支持跨设备按需部署：\n\n- **元能力拆分**：将应用的核心功能（如视频播放、数据计算）拆分为独立元能力，不同设备可加载不同元能力（如手表仅加载\"控制元能力\"，手机加载\"播放元能力\"）。\n- **分布式任务调度**：系统自动将元能力分发到适配的设备运行（如将耗时计算任务分发到平板/车机，手机仅负责交互）。\n- **原子化服务**：无需安装，元能力可作为原子化服务跨设备免安装运行（如手表端直接调用手机端的支付元能力）。\n\n#### 5. 开发工具链支持（落地保障）\n\nDevEco Studio 提供一站式多端适配工具，降低开发成本：\n\n- **设备预览器**：在 IDE 中直接切换手机/平板/手表等设备形态，实时预览 UI 适配效果。\n- **适配校验工具**：自动检测代码中不兼容不同设备的语法/组件，提示适配建议。\n- **一键打包**：一套代码可打包为适配不同设备的安装包，无需单独编译。\n\n### 鸿蒙分布式能力的关键技术原理\n\n#### 分布式软总线（核心通信底座）\n\n本质是统一的分布式通信框架，屏蔽 Wi-Fi、P2P、蓝牙等物理链路差异。\n\n- **原理**：设备发现、连接、传输全自动化，提供高带宽、低时延、高稳定的虚拟总线。\n- **作用**：让设备之间像在同一台机器内通信一样简单，应用无需关心底层网络。\n\n#### 分布式设备虚拟化（硬件能力共享）\n\n把跨设备的摄像头、麦克风、屏幕、传感器等抽象成统一虚拟外设。\n\n- **原理**：通过统一驱动抽象层，实现硬件能力的发现、调用、映射、反控。\n- **作用**：A 设备可以直接使用 B 设备的硬件，实现多设备能力融合。\n\n#### 分布式数据管理（数据跨设备一致）\n\n提供跨设备统一数据视图，应用只操作一份数据。\n\n- **原理**：基于分布式软总线，实现数据的自动同步、冲突解决、可靠性保障。\n- **作用**：多设备间数据无缝互通，不用手动同步、不用写复杂网络逻辑。\n\n#### 分布式任务调度（应用跨端流转）\n\n实现应用/组件在多设备间的启动、迁移、协同。\n\n- **原理**：基于元能力（Ability）拆分，系统根据设备能力、算力、场景动态调度。\n- **作用**：支持页面接续、任务迁移、分布式协作，实现\"应用在超级终端里流动\"。\n\n---\n\n## 十、线程通信与并发\n\n### TaskPool 和 Worker\n\n`TaskPool` 和 `Worker` 均支持多线程并发能力。`TaskPool` 的工作线程会绑定系统的调度优先级，并支持负载均衡（自动扩缩容），相比之下，`Worker` 需要开发者自行创建和销毁，存在一定的创建和管理成本。因此，在大多数场景下，推荐优先使用 `TaskPool`。\n\n- `Worker` 适用于需要长时间占据线程，并由开发者主动管理线程生命周期的场景。\n- `TaskPool` 适用于执行相对独立任务的场景，任务在线程中执行时无需关注线程生命周期。\n\n#### 建议使用 Worker 的场景\n\n以下场景中，任务通常需要长时间运行或依赖线程上下文，适合使用 `Worker`：\n\n- **运行时间超过 3 分钟的任务**（此处所说的 3 分钟不包括 Promise 和 async/await 异步调用的耗时，如网络下载、文件读写等 I/O 任务的耗时）：例如后台进行 1 小时的预测算法训练等 CPU 密集型任务，适合使用 `Worker`。\n- **有强关联的一系列同步任务**：例如在需要创建并使用句柄的场景中，每次创建的句柄都不同，且必须持续保存该句柄，以确保后续操作正确执行，此类场景适合使用 `Worker`。\n\n#### 建议使用 TaskPool 的场景\n\n以下场景中，任务通常相对独立，对调度、取消或管理能力有更高要求，适合使用 `TaskPool`：\n\n- **需要设置任务优先级的任务**：在 API version 18 之前，`Worker` 不支持设置调度优先级，需要使用 `TaskPool`；从 API version 18 开始，`Worker` 支持设置调度优先级，开发者可以根据使用场景和任务特性选择使用 `TaskPool` 或 `Worker`。例如图像直方图绘制场景，后台计算的直方图数据会用于前台界面的显示，影响用户体验，且任务相对独立，推荐使用 `TaskPool`。\n- **需要频繁取消的任务**：如图库大图浏览场景。为提升体验，系统会同时缓存当前图片左右各两张图片。当往一侧滑动跳到下一张图片时，需取消另一侧的缓存任务，此时适合使用 `TaskPool`。\n- **大量或调度点分散的任务**：例如大型应用中的多个模块包含多个耗时任务，不建议使用 `Worker` 进行负载管理，推荐使用 `TaskPool`。\n\n### 鸿蒙线程间通信\n\n#### 线程间通信的原因\n\n在多线程并发场景中，例如通过 `TaskPool` 或 `Worker` 创建后台线程，不同线程间需要进行数据交互。由于线程间内存隔离，线程间通信对象必须通过序列化实现值拷贝或内存共享。\n\n#### 线程间通信的限制\n\n- 单次序列化传输的数据量大小限制为 16MB。\n- 序列化不支持使用 `@State` 装饰器、`@Prop` 装饰器、`@Link` 装饰器等装饰器修饰的复杂类型。\n\n#### ArkTS 支持的线程间通信对象（总结）\n\n1. 可以直接通过拷贝传递除 `Symbol` 之外的基础类型、`Date`、`String`、`RegExp`、`Array`、`Map`、`Set`、`Object`、`ArrayBuffer`、`TypedArray`。其中 `Object` 只能通过对象字面量（`{}`）或 `new` 创建，并无法传递原型和方法。\n2. 对于大段连续的二进制内存数据，如图片、视频，可以传递 `ArrayBuffer` 对象。`ArrayBuffer` 对象包含 JS 对象壳和 Native 内存两部分。JS 对象壳需要通过序列化和反序列化拷贝传递，而 Native 内存区域则有两种传递方式：使用默认的拷贝方式，两个线程可以独立访问数据，需要重建 JS 壳并拷贝 Native 内存，因此效率低；而使用转移方式，只需要重建 JS 壳，效率高，但原线程无法访问数据了。\n3. 可以使用 `SharedArrayBuffer`，也就是共享内存，但需要配置 `Atomics` 类来设置异步锁控制并发，防止冲突。\n4. 对于文件描述符、图形资源等可以使用 `Transferable` 对象来转移对象的所有权给另一个线程。这种方式会使两个线程复用同一个 C++ 对象，而其 JS 壳会放在 LocalHeap 中。`Transferable` 对象有两种转移模式：对于能确保线程安全的对象，例如 `ApplicationContext`、`WindowContext` 等，使用共享模式，在新线程中重新创建 JS 壳指向同一个 C++ 对象即可；而对于线程不安全的对象，例如 `PixelMap` 对象，则需要使用转移模式，移除原先的 JS 壳对 C++ 对象的引用，在新线程中重新绑定新的 JS 壳。\n5. 最后，还有 `Sendable` 对象。通过 `@Sendable` 装饰器装饰，可以使类、属性、方法通过引用的方式在线程间传递。同样需要配置异步锁来防止数据竞争，或通过 `freeze` 来暂时冻结避免线程冲突。\n\n#### 普通对象（详细）\n\n普通对象跨线程时通过拷贝（序列化，深拷贝）形式传递，两个线程的对象内容一致，但指向各自线程的隔离内存区间，被分配在各自线程的虚拟机本地堆（LocalHeap）。\n\n序列化支持类型包括：除 `Symbol` 之外的基础类型、`Date`、`String`、`RegExp`、`Array`、`Map`、`Set`、`Object`（仅限简单对象，比如通过 `{}` 或者 `new Object` 创建，普通对象仅支持传递属性，不支持传递其原型及方法）、`ArrayBuffer`、`TypedArray`。\n\n普通类实例对象跨线程通过拷贝形式传递，只能传递数据，类方法会丢失。使用 `@Sendable` 装饰器标识为 Sendable 类后，类实例对象跨线程传递后，可携带类方法。\n\n#### ArrayBuffer 对象（详细）\n\n用于二进制数据的高效传递，适用于大段连续内存数据（如图片、音频原始数据）。\n\n`ArrayBuffer` 包含两部分：底层存储数据的 Native 内存区域，以及封装操作的 JS 对象壳。JS 对象壳分配在虚拟机的本地堆（LocalHeap）中。跨线程传递时，JS 对象壳需要序列化和反序列化拷贝传递，而 Native 内存区域可以通过拷贝或转移的方式传递。\n\nNative 内存有两种传输方式：\n\n- **拷贝方式**（递归遍历）传输时，传输后两个线程可以独立访问 `ArrayBuffer`。此方式需要重建 JS 壳和拷贝 Native 内存，传输效率较低。\n- **转移方式**传输时，传输后原线程将无法使用此 `ArrayBuffer` 对象。跨线程时只需重建 JS 壳，Native 内存无需拷贝，从而提高效率。\n\n在 ArkTS 中，`TaskPool` 传递 `ArrayBuffer` 数据时，默认采用转移方式。通过调用 `setTransferList()` 接口，可以指定部分数据的传递方式为转移方式，其他部分数据可以切换为拷贝方式。\n\n#### SharedArrayBuffer 对象（详细）\n\n支持多线程共享内存，允许线程间直接访问同一块内存区域，提升数据传递效率。\n\n`SharedArrayBuffer` 内部包含一块 Native 内存，其 JS 对象壳被分配在虚拟机本地堆（LocalHeap）。支持跨并发实例间共享 Native 内存，但是对共享 Native 内存的访问及修改需要采用 `Atomics` 类，防止数据竞争。`SharedArrayBuffer` 可用于多个并发实例间的状态或数据共享。\n\n#### Transferable 对象（详细）\n\n支持跨线程转移对象所有权（如文件描述符、图形资源等），转移后原线程不再拥有访问权限。\n\n`Transferable` 对象，也称为 NativeBinding 对象，是指绑定 C++ 对象的 JS 对象，其主要功能由 C++ 提供，JS 对象壳则分配在虚拟机的本地堆（LocalHeap）中。跨线程传输时复用同一个 C++ 对象，相比 JS 对象的拷贝模式，传输效率更高。因此，可共享或转移的 NativeBinding 对象被称为 `Transferable` 对象。\n\n`Transferable` 对象有两种通信模式：\n\n- **共享模式**：如果 C++ 实现能够确保线程安全性，则 NativeBinding 对象的 C++ 部分支持跨线程共享。NativeBinding 对象跨线程传输后，只需重新创建 JS 壳即可桥接到同一个 C++ 对象上，实现 C++ 对象的共享。常见的共享模式 NativeBinding 对象包括：应用上下文（`ApplicationContext`）、窗口上下文（`WindowContext`）、组件上下文（`AbilityContext` 或 `ComponentContext`）等 Context 类型对象。这些上下文对象封装了应用程序组件的上下文信息，提供了访问系统服务和资源的能力，使得应用程序组件可以与系统进行交互。\n- **转移模式**：如果 C++ 实现包含数据且无法保证线程安全性，则 NativeBinding 对象的 C++ 部分需要采用转移方式传输。NativeBinding 对象跨线程传输后，重新创建 JS 壳可桥接到 C++ 对象上，但需移除原 JS 壳与 C++ 对象的绑定关系。常见的转移模式 NativeBinding 对象包括 `PixelMap` 对象，它可以读取或写入图像数据，获取图像信息，常用于显示图片。\n\n#### Sendable 对象（详细）\n\n符合 ArkTS 语言规范的可共享对象，需通过 `@Sendable` 装饰器标记，并且满足 Sendable 约束。\n\n`Sendable` 对象可共享，跨线程前后指向同一个 JS 对象。如果 `Sendable` 对象通过调用 Napi 接口与一个 Native 对象绑定，当共享传递 `Sendable` 对象时，其绑定的 Native 对象也会一并共享传递。\n\n与其它 ArkTS 数据对象不同，符合 Sendable 协议的数据对象在运行时应为类型固定的对象。\n\n当多个并发实例尝试同时更新 `Sendable` 数据时，会发生数据竞争，例如 ArkTS 共享容器的多线程操作。因此，ArkTS 提供异步锁机制来避免不同并发实例间的数据竞争，并提供了异步等待机制来控制多线程处理数据的时序。同时，还可以通过对象冻结接口将对象冻结为只读，从而避免数据竞争。\n\n`Sendable` 对象提供了并发实例间高效的通信能力，即引用传递，适用于开发者自定义大对象需要线程间通信的场景，例如子线程读取数据库数据并返回给宿主线程。\n\n### 传递 ArrayBuffer 时，拷贝方式和转移方式有什么区别\n\n`ArrayBuffer` 可以用来表示图片等资源，在应用开发中，处理图片（如调整亮度、饱和度、大小等）会比较耗时，为了避免长时间阻塞 UI 主线程，可以将图片传递到子线程中进行处理。采用转移方式传递 `ArrayBuffer` 可提高传输性能，但原线程将无法再访问该 `ArrayBuffer` 对象。如果两个线程都需要访问该对象，只能采用拷贝方式。反之，建议采用转移方式以提升性能。\n\n### Atomics 类\n\n#### 定义\n\n针对多线程场景设计的静态工具类，核心解决多线程并发修改共享数据时的竞态问题：\n\n- \"原子操作\"指不可中断的操作：要么完全执行，要么完全不执行，中间不会被其他线程打断。\n- 普通的变量操作（如 `count++`）本质是\"读取→修改→写入\"三步操作，多线程下可能被打断，导致数据不一致（比如两个线程同时 `++`，最终结果少 1）。\n- `Atomics` 类提供的所有方法都是原子操作，能保证共享数据修改的唯一性和一致性，无需额外加锁（如互斥锁），性能更优。\n\n#### 常见方法\n\n**基础读写与增减操作：**\n\n- `load`：原子化读取共享数组指定索引的值，确保读取过程不被中断。\n- `store`：原子化向共享数组指定索引写入值，保证写入操作完整执行。\n- `add`：原子化给共享数组指定索引的值累加指定数值，返回操作前原值。\n- `sub`：原子化给共享数组指定索引的值减去指定数值，返回操作前原值。\n\n**比较并交换操作：**\n\n- `compareExchange`：核心无锁操作，原子化校验共享数组指定索引值是否等于预期值，相等则替换为新值，不等则不修改，无论是否替换均返回操作前原值，可实现无锁并发逻辑。\n\n**线程同步操作：**\n\n- `wait`：使当前线程进入等待状态，仅当共享数组指定索引值等于目标值时才触发等待，支持设置超时时间避免无限等待。\n- `notify`：唤醒在共享数组指定索引上等待的线程，可指定唤醒的线程数量。\n\n**其他实用操作：**\n\n- `exchange`：原子化替换共享数组指定索引的值为目标值，返回操作前原值（无条件替换，区别于比较并交换的条件替换）。\n- `isLockFree`：判断指定大小的数值类型是否支持无锁原子操作，辅助优化并发性能。\n\n#### 常见使用场景\n\n- **多线程共享计数器**：主线程与 `Worker` 线程、多个 `Worker` 线程并发修改计数类数据时，通过原子化增减操作避免计数遗漏、重复等数据不一致问题，保证计数结果准确。\n- **无锁并发逻辑实现**：借助 `compareExchange` 方法实现自旋锁等无锁并发逻辑，减少传统加锁带来的线程阻塞开销，提升并发场景下的性能。\n- **多线程执行顺序协调**：利用 `wait` 和 `notify` 方法协调不同线程的执行顺序，例如让线程等待共享数据更新后再执行，避免轮询共享数据造成的资源消耗。\n- **共享内存数据安全操作**：配合 `SharedArrayBuffer` 共享内存使用，保障不同线程对共享内存中数值型数据读写、修改操作的原子性，解决多线程竞态问题。\n\n### @Sendable 详解\n\n#### 支持的数据类型\n\n- ArkTS 基本数据类型：`boolean`、`number`、`string`、`bigint`、`null`、`undefined`。\n- ArkTS 数据类型：`const enum`（常量枚举）。\n- ArkTS 语言标准库中定义的容器类型数据（须显式引入 `@arkts.collections`）。\n- ArkTS 语言标准库中定义的异步锁（`AsyncLock`）对象（须显式引入 `@arkts.utils`）。\n- ArkTS 语言标准库中定义的异步等待对象（须显式引入 `@arkts.utils`）。\n- ArkTS 语言标准库中定义的 `SendableLruCache` 对象（须显式引入 `@arkts.utils`）。\n- 继承了 `ISendable` 的 interface。\n- 标注了 `@Sendable` 装饰器的 class。\n- 标注了 `@Sendable` 装饰器的 function。\n- 接入 Sendable 的系统对象：\n  - 共享用户首选项\n  - 可共享的色彩管理\n  - 基于 Sendable 对象的图片处理\n  - 资源管理\n  - `SendableContext` 对象管理\n- 元素均为 Sendable 类型的 union type 数据。\n- 开发者自定义的 Native Sendable 对象。\n\n#### 实现原理（SharedHeap 与 LocalHeap 的区别）\n\n为了实现 `Sendable` 数据在不同并发实例间的引用传递，Sendable 共享对象分配在共享堆中，实现跨并发实例的内存共享。\n\n- **共享堆（SharedHeap）** 是进程级别的堆空间，与虚拟机本地堆（LocalHeap）不同，LocalHeap 仅限单个并发实例访问，而 SharedHeap 可被所有线程访问。\n- `Sendable` 对象的跨线程行为为引用传递，因此，一个 `Sendable` 对象可能被多个并发实例引用。判断该 `Sendable` 对象是否存活，取决于所有并发实例是否存在对此 `Sendable` 对象的引用。\n- 各个并发实例的 LocalHeap 是隔离的。SharedHeap 是进程级别的堆，可以被所有并发实例共享，但 SharedHeap 不能引用 LocalHeap 中的对象。\n\n#### 使用约束\n\n1. **继承约束**：Sendable 类仅能继承自 Sendable 类；非 Sendable 类仅能继承自非 Sendable 类，二者禁止互相继承，且 Sendable 类不能继承自变量。\n2. **接口实现约束**：非 Sendable 类禁止实现任何继承自 Sendable 接口的接口。\n3. **类/接口成员变量约束**：成员变量必须为 Sendable 支持的数据类型；不支持使用 `!` 断言修饰成员变量；不支持使用计算属性名定义成员变量。\n4. **泛型使用约束**：泛型类中的 Sendable 类、`SendableLruCache` 及 `collections` 下的 `Array`、`Map`、`Set`，其模板类型必须为 Sendable 类型。\n5. **上下文访问约束**：Sendable 类内部禁止使用当前模块内上下文环境定义的变量。\n6. **装饰器使用约束**：`@Sendable` 装饰器仅支持修饰类和函数；Sendable 类和 Sendable 函数禁止搭配 `@Sendable` 以外的其他装饰器；支持在 Sendable class 上叠加自定义装饰器（通过在工程级 `build-profile.json5` 文件的 `buildOption` 字段下的 `strictMode` 中增加 `disableSendableCheckRules` 字段，配置该能力）。\n7. **初始化约束**：禁止使用对象字面量或数组字面量初始化 Sendable 对象，必须通过 Sendable 类型的 `new` 表达式创建。\n8. **类型转换约束**：除 `Object` 类型外，禁止将非 Sendable 类型强制转换为 Sendable 类型；Sendable 类型可在不违反规则的前提下强转为非 Sendable 类型。\n9. **函数使用约束**：箭头函数不支持标记 `@Sendable` 装饰器，属于非 Sendable 函数且不支持共享。\n10. **与 TS/JS 交互约束**：Sendable 对象传入 TS/JS 接口、设置到 TS/JS 对象或放入 TS/JS 容器后，禁止对其对象布局进行增删属性、改变属性类型的操作，Sendable 类对象类型间的改变除外。\n11. **与 NAPI 交互约束**：禁止对 Sendable 对象执行删除、新增属性及修改属性类型的操作；不支持使用任何 `Symbol` 相关的 NAPI 接口和类型。\n12. **与 UI 交互约束**：Sendable 数据需要与 `makeObserved` 联用，才能实现对其数据变化的观察。\n13. **HAR 包使用约束**：在 HAR 包中使用 Sendable 时，需要启用编译生成 TS 文件的相关配置。\n\n#### Sendable 对象的序列化/反序列化\n\n`ASON` 工具与 JS 提供的 `JSON` 工具类似，`JSON` 用于进行 JS 对象的序列化（`stringify`）、反序列化（`parse`）。`ASON` 则提供了 Sendable 对象的序列化、反序列化能力。使用 `ASON.stringify` 方法可将对象转换为字符串，使用 `ASON.parse` 方法可将字符串转换为 Sendable 对象，从而实现对象在并发任务间的高性能引用传递。\n\n`ASON.stringify` 方法还支持将 `Map` 和 `Set` 对象转换为字符串，可转换的 `Map` 和 `Set` 类型包括：`Map`、`Set`、`collections.Map`、`collections.Set`、`HashMap`、`HashSet`。\n\n#### @Sendable 使用场景\n\n`Sendable` 对象在不同并发实例间默认采用引用传递，这种方式比序列化更高效，且不会丢失类成员方法。因此，Sendable 能够解决两个关键场景的问题：\n\n- **跨并发实例传输大数据**（例如达到 100KB 以上的数据）：由于跨并发实例序列化的开销随数据量线性增长，因此当传输数据量较大时（100KB 的数据传输耗时约为 1ms），跨并发实例的拷贝开销会影响应用性能。使用引用传递方式传输对象可提升性能。\n- **跨并发实例传递带方法的 class 实例对象**：在序列化传输实例对象时，会丢失方法。因此，若需调用实例方法，应使用引用传递。处理数据时，若需解析数据，可使用 `ASON` 工具。\n\n### 异步锁\n\n为了解决多线程并发实例间的数据竞争问题，ArkTS 引入了异步锁能力。异步锁可能会被类对象持有，因此为了更方便地在并发实例间获取同一个异步锁对象，`AsyncLock` 对象支持跨线程引用传递。\n\n由于 ArkTS 语言支持异步操作，阻塞锁容易产生死锁问题，因此在 ArkTS 中仅支持异步锁（非阻塞式锁）。同时，异步锁还可以用于保证单线程内的异步任务时序一致性，防止异步任务时序不确定导致的同步问题。\n\n### 异步等待\n\nArkTS 引入了异步任务的等待和被唤醒能力，以解决多线程任务时序控制问题。通过 `ConditionVariable` 对象控制异步任务的唤醒通知或超时等待，将继续执行。`ConditionVariable` 对象支持跨线程引用传递。\n\n### 共享容器\n\nArkTS 共享容器（`@arkts.collections`（ArkTS 容器集））是一种在并发实例间共享传输的容器类，用于并发场景下的高性能数据传递。\n\n- ArkTS 共享容器在多个并发实例间传递时，默认采用引用传递，允许多个并发实例操作同一容器实例。此外，还支持拷贝传递，即每个并发实例拥有独立的 ArkTS 容器实例。\n- ArkTS 共享容器不是线程安全的，内部使用了 fail-fast（快速失败）机制，即当检测到多个并发实例同时对容器进行结构性修改时，会触发异常。因此，在多线程场景下修改容器内属性时，开发者需要使用 ArkTS 提供的异步锁机制保证 ArkTS 容器的安全访问。\n\nArkTS 共享容器包含如下几种：`Array`、`Map`、`Set`、`TypedArray`（`Int8Array`、`Uint8Array`、`Int16Array`、`Uint16Array`、`Int32Array`、`Uint32Array`、`Uint8ClampedArray`、`Float32Array`）、`ArrayBuffer`、`BitVector`、`ConcatArray`。\n\n#### 共享容器和原生容器的转换\n\n- 原生容器 `Array` → ArkTS `Array` 容器：通过 `collections.Array.from` 方法转换。\n- ArkTS `Array` 容器 → 原生容器 `Array`：通过原生容器 `Array` 的 `from` 方法转换。\n\n### \"use shared\" 的作用（共享模块）\n\n使用 `\"use shared\"` 这一指令来标记一个模块是否为共享模块，共享模块是进程内只会加载一次的模块。非共享模块在同一线程内只加载一次，而在不同线程中会多次加载，每个线程都会生成新的模块对象。因此，目前只能使用共享模块实现进程单例。\n\n#### 共享模块的使用约束\n\n1. **指令书写约束**：`use shared` 指令需写在 ArkTS 文件顶层，位置在 import 语句之后、其他所有语句之前，书写规则与 `use strict` 一致。\n2. **文件类型约束**：共享模块仅支持 ets 文件类型，不支持其他文件。\n3. **共享属性特性**：共享属性不具备传递性，引入共享模块的非共享模块，不会因此变为共享模块。\n4. **导入约束**：模块内禁止使用副作用导入（side-effects-import），该类导入因不涉及导出变量无法被加载，也不受支持。\n5. **依赖加载规则**：共享模块加载时，其导入的非共享模块不会立即加载；在共享模块内访问该非共享模块的导出变量时，当前线程会对其进行懒加载，且非共享模块在线程间相互隔离，不同线程访问会各自触发一次懒加载。\n6. **导出对象约束**：导出的所有变量必须为可共享对象，可共享对象需参考 Sendable 支持的数据类型。\n7. **导出方式约束**：不允许直接导出模块，可通过指定对象名的方式导出模块中的对象合集。\n8. **模块引用规则**：共享模块可引用其他共享模块或非共享模块，引用与被引用的场景无任何限制。\n9. **加载方式约束**：仅支持静态加载、`napi_load_module` 或 `napi_load_module_with_info` 三种方式加载共享模块，使用其他方式会触发运行时报错。\n\n### 线程间通信场景\n\n#### 使用 TaskPool 执行独立的耗时任务\n\n对于独立运行的耗时任务，任务完成后将结果返回给宿主线程。\n\n#### 使用 TaskPool 执行多个耗时任务\n\n如果宿主线程需要所有任务执行完毕的数据，可以通过 `TaskGroup` 的方式实现。\n\n#### TaskPool 任务与宿主线程通信\n\n场景：不仅需要返回最终执行结果，还需定时通知宿主线程状态和数据变化，或分段返回大量数据（如从数据库读取大量数据）。\n\n步骤：\n\n1. 实现接收 Task 消息的方法\n2. 在需要执行的 Task 中，添加 `sendData()` 接口将消息发送给宿主线程\n3. 在宿主线程通过 `onReceiveData()` 接口接收消息\n\n#### Worker 和宿主线程的即时消息通信\n\n调用 `postMessage` 方法向 `Worker` 线程发送消息，`Worker` 线程将通过注册的 `onmessage` 回调处理宿主线程发送的消息。\n\n#### Worker 同步调用宿主线程的接口\n\n通过 `callGlobalCallObjectMethod` 接口实现。\n\n#### 多级 Worker 间高性能消息通信\n\n通过父 `Worker` 创建子 `Worker` 的机制形成层级线程关系。\n\n由于 `Worker` 线程生命周期由用户自行管理，因此需要注意多级 `Worker` 生命周期的正确管理，建议开发者确保销毁父 `Worker` 前先销毁所有子 `Worker`。\n\n高性能消息通信的关键在于 `Sendable` 对象，结合 `postMessageWithSharedSendable` 接口，可以实现线程间高性能的对象传递。\n\n### 进程间通信\n\n进程间通信方式分为 IPC 和 RPC：\n\n- **IPC** 是用于设备内进程间通信，使用 Binder 驱动。\n- **RPC** 用于设备间跨进程通信，使用软总线驱动。\n\nIPC 和 RPC 采用客户端-服务端（Client-Server）模型。在使用时，Client 进程可以获取 Server 进程的代理（Proxy），通过 Proxy 读写数据和发起请求，Stub 处理请求并应答结果，实现进程间通信。Proxy 和 Stub 提供了一组由服务/业务自定义的接口，Proxy 实现每一个具体的请求方法，Stub 实现对应的每一个具体请求的处理方法以及应答数据的内容。\n\n#### 步骤\n\n1. **创建变量 `want` 和 `connect`**\n   - 创建变量 `want`，指定要连接的 Ability 所在应用的包名（`bundleName`）、组件名（`abilityName`）。在跨设备的场景下，还需要连接目标设备的 NetworkId（组网场景下对应设备的标识符，可以使用 `distributedDeviceManager` 获取目标设备的 NetworkId）。\n   - 创建变量 `connect`，指定连接成功、连接失败和断开连接时的回调函数。\n\n2. **连接服务**\n   - Stage 模型使用 `common.UIAbilityContext` 的 `connectServiceExtensionAbility` 接口连接 Ability。\n\n3. **客户端发送信息给服务端**\n   - 通过 `onConnect` 回调函数（上一步 `connect` 对象中设置的回调）获取服务端的代理对象 Proxy。\n   - 使用该 Proxy 对象调用 `sendMessageRequest` 方法发起请求。\n   - 当服务端处理请求并返回数据时，在 Promise 中接收结果。\n\n4. **服务端处理客户端请求**\n   - 实现 `ServiceExtension` 类继承 `ServiceExtensionAbility`，使用单例模式，在 `onConnect` 方法中获取 Stub 对象。\n   - 服务端实现 Stub 对象，继承自 `rpc.RemoteObject`，实现 `onRemoteMessageRequest` 方法，处理客户端的请求。\n\n5. **断开连接**\n   - 使用 `common.UIAbilityContext` 提供的 `disconnectServiceExtensionAbility` 接口断开连接，传入 `connectId`（`connectServiceExtensionAbility` 函数的返回值）。\n\n#### 案例：批量数据写数据库场景\n\n参考链接：https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/batch-database-operations-guide\n\n---\n\n## 十一、其他\n\n### 设计一个鸿蒙应用的崩溃监控和恢复方案\n\n#### 崩溃全场景监控\n\n- **监控类型**：覆盖应用层崩溃（JS/ArkTS 空指针、数组越界）、Native 层崩溃（C/C++ 代码异常）、ANR（主线程阻塞超 5s）、启动崩溃（应用初始化失败）、页面渲染崩溃。\n- **监控手段**：应用层通过注册 `uncaughtException` 全局异常捕获器、监听 Ability/Page 的 `onError` 生命周期捕获崩溃；Native 层集成 Breakpad 生成 minidump 文件解析堆栈；ANR 通过 `@ohos.resourceSchedule` 监听主线程阻塞状态。\n- **上下文采集**：崩溃时同步采集设备信息（型号/系统版本/API 版本）、应用信息（版本/包名）、用户操作路径、内存占用、网络状态，生成唯一 traceId 关联全量信息。\n\n#### 崩溃信息存储与上报\n\n- **本地存储**：崩溃数据（JSON 格式）和 Native 崩溃文件本地持久化，按\"类型 + 时间戳\"命名，无网络时最多存储 10 条，超出按 FIFO 清理。\n- **上报策略**：WiFi 下崩溃恢复后实时上传全量信息，移动网络仅上传核心堆栈；离线记录网络恢复后批量加密（HTTPS）上传，采用指数退避重试（最多 3 次），失败则保留至下次启动。\n- **数据脱敏**：对用户 ID、设备唯一标识等敏感信息脱敏，仅保留问题定位必要字段，符合隐私合规。\n\n#### 分级自动恢复策略\n\n- **页面级恢复**：页面崩溃触发 `onError` 时，自动销毁当前页返回上一页或重启页面，核心页面提前备份操作状态（如表单内容），恢复后自动还原。\n- **应用级恢复**：应用整体崩溃通过 `AbilityStage` 监听，自动重启入口 Ability，还原崩溃前页面栈；连续启动崩溃（≥3 次）触发安全模式，禁用非核心功能仅加载基础页面。\n- **ANR 恢复**：检测到 ANR 后强制终止阻塞任务（如耗时计算/未超时请求），重启当前页面，记录阻塞线程栈用于分析。\n\n#### 崩溃问题定位与闭环\n\n- **堆栈解析**：服务端关联 `mapping.txt` 还原源码行号，自动归类崩溃类型（如空指针、OOM、Native 异常）。\n- **智能告警**：设置阈值（版本崩溃率 > 1% / 单次崩溃影响超 100 用户），触发钉钉/邮件告警，附带崩溃详情、设备分布。\n- **可视化监控**：搭建崩溃大盘，展示崩溃率、TOP 崩溃类型、版本/设备分布，跟踪修复进度；灰度发布验证修复效果，确认后全量上线。\n\n#### 前置防护（减少崩溃发生）\n\n- **代码层**：全局 try-catch 兜底、空值/边界校验、异步任务（`Worker`/`TaskPool`）异常捕获，避免未处理异常导致崩溃。\n- **资源层**：监控内存占用，接近阈值时释放图片缓存、关闭无用页面，减少 OOM 崩溃。\n- **兼容性层**：针对不同鸿蒙 API 版本/设备型号做适配，封装兼容层接口，避免系统接口差异引发崩溃。\n\n#### 用户体验优化\n\n- **崩溃提示**：恢复后轻量弹窗告知\"应用已自动恢复\"，避免用户恐慌。\n- **重复崩溃防护**：检测到同一用户触发相同崩溃，临时禁用对应功能，引导更新版本。\n- **操作防丢**：核心操作（支付/表单提交）崩溃后自动校验状态，避免重复提交或数据丢失。\n\n### 鸿蒙如何后台保活\n\n#### PC 端保活\n\nHarmonyOS PC 上不允许后台私自运行程序，提出了托盘方案，可以让应用进程在 PC 后台持续保活运行。如持续开启后台服务、U 盾等场景可采用此方案实现。\n\n#### 手机端保活\n\n应用退至后台后，在后台需要长时间运行用户可感知的任务，如播放音乐、导航等。为防止应用进程被挂起，导致对应功能异常，可以申请长时任务，使应用在后台长时间运行。在长时任务中，支持同时申请多种类型的任务，也可以对任务类型进行更新。应用退至后台执行业务时，系统会做一致性校验，确保应用在执行相应的长时任务。应用在申请长时任务成功后，通知栏会显示与长时任务相关联的消息，用户删除通知栏消息时，系统会自动停止长时任务。\n\n### 鸿蒙键鼠连接监控\n\n`@ohos.multimodalInput.inputDevice` 提供输入设备管理能力，包括监听输入设备的连接和断开状态，查询设备名称等输入设备信息。\n\n常用方法：\n\n- `getDeviceInfo`：获取指定输入设备（DeviceId）的信息。\n- `on`：注册监听输入设备的热插拔事件，使用时需连接鼠标、键盘、触摸屏等外部设备。\n- `off`：取消监听输入设备的热插拔事件。在应用退出前调用，取消监听。\n\n### 鸿蒙本地数据库（关系型数据库 RDB）\n\n基于关系模型来管理数据的数据库，基于 SQLite 组件提供了完整的对本地数据库进行管理的机制（增、删、改、查）。\n\n- 可以直接运行用户输入的 SQL 语句来满足复杂的场景需要。\n- 支持通过 `ResultSet.getSendableRow` 方法获取 Sendable 数据，进行跨线程传递。\n- 为保证插入并读取数据成功，建议一条数据不超过 2MB。如果数据超过 2MB，插入操作将成功，读取操作将失败。\n\n大数据量场景下查询数据可能会导致耗时长甚至应用卡死，建议：\n\n- 单次查询数据量不超过 5000 条。\n- 在 `TaskPool` 中查询。\n- 拼接 SQL 语句尽量简洁。\n- 合理地分批次查询。\n\n#### RDB 常用功能\n\n- **`RdbPredicates`**：数据库中用来代表数据实体的性质、特征或者数据实体之间关系的词项，主要用来定义数据库的操作条件。用于条件评估、逻辑组合等操作，例如判断字段是否等于指定值。\n- **`RdbStore`**：提供管理关系数据库（RDB）方法的接口。\n- **`ResultSet`**：提供用户调用关系型数据库查询接口之后返回的结果集合。\n- **`Transaction`**：提供管理事务对象的接口。\n",
    "headings": [
      {
        "depth": 1,
        "text": "HarmonyOS ArkTS 开发知识库",
        "slug": "harmonyos-arkts-开发知识库"
      },
      {
        "depth": 2,
        "text": "一、ArkTS 语言基础",
        "slug": "一arkts-语言基础"
      },
      {
        "depth": 3,
        "text": "ArkTS 中声明式编程范式与命令式编程范式有何不同？",
        "slug": "arkts-中声明式编程范式与命令式编程范式有何不同"
      },
      {
        "depth": 3,
        "text": "如何在 ArkTS 中创建自定义组件？",
        "slug": "如何在-arkts-中创建自定义组件"
      },
      {
        "depth": 3,
        "text": "@State 和 @Link 装饰器的作用",
        "slug": "state-和-link-装饰器的作用"
      },
      {
        "depth": 3,
        "text": "ArkTS 与 TypeScript 的区别",
        "slug": "arkts-与-typescript-的区别"
      },
      {
        "depth": 4,
        "text": "设计定位与应用场景",
        "slug": "设计定位与应用场景"
      },
      {
        "depth": 4,
        "text": "语法扩展差异",
        "slug": "语法扩展差异"
      },
      {
        "depth": 4,
        "text": "运行环境与编译机制",
        "slug": "运行环境与编译机制"
      },
      {
        "depth": 4,
        "text": "核心能力支持",
        "slug": "核心能力支持"
      },
      {
        "depth": 4,
        "text": "生态与工具链",
        "slug": "生态与工具链"
      },
      {
        "depth": 4,
        "text": "类型系统与语法约束",
        "slug": "类型系统与语法约束"
      },
      {
        "depth": 3,
        "text": "ArkTS 与 Native（C++）的性能区别",
        "slug": "arkts-与-nativec的性能区别"
      },
      {
        "depth": 4,
        "text": "执行机制",
        "slug": "执行机制"
      },
      {
        "depth": 4,
        "text": "启动性能",
        "slug": "启动性能"
      },
      {
        "depth": 4,
        "text": "计算密集型性能",
        "slug": "计算密集型性能"
      },
      {
        "depth": 4,
        "text": "内存开销",
        "slug": "内存开销"
      },
      {
        "depth": 4,
        "text": "UI 渲染性能",
        "slug": "ui-渲染性能"
      },
      {
        "depth": 4,
        "text": "跨设备适配开销",
        "slug": "跨设备适配开销"
      },
      {
        "depth": 4,
        "text": "并发性能",
        "slug": "并发性能"
      },
      {
        "depth": 3,
        "text": "PX、VP、FP 单位的区别",
        "slug": "pxvpfp-单位的区别"
      },
      {
        "depth": 3,
        "text": "如何实现自适应布局？",
        "slug": "如何实现自适应布局"
      },
      {
        "depth": 2,
        "text": "二、HarmonyOS 应用架构",
        "slug": "二harmonyos-应用架构"
      },
      {
        "depth": 3,
        "text": "HarmonyOS 的分层架构",
        "slug": "harmonyos-的分层架构"
      },
      {
        "depth": 4,
        "text": "产品定制层",
        "slug": "产品定制层"
      },
      {
        "depth": 4,
        "text": "基础特性层",
        "slug": "基础特性层"
      },
      {
        "depth": 4,
        "text": "公共能力层",
        "slug": "公共能力层"
      },
      {
        "depth": 3,
        "text": "鸿蒙核心架构与 Android 的区别",
        "slug": "鸿蒙核心架构与-android-的区别"
      },
      {
        "depth": 2,
        "text": "三、应用模型（FA 模型与 Stage 模型）",
        "slug": "三应用模型fa-模型与-stage-模型"
      },
      {
        "depth": 3,
        "text": "FA 模型与 Stage 模型",
        "slug": "fa-模型与-stage-模型"
      },
      {
        "depth": 3,
        "text": "Stage 模型核心概念",
        "slug": "stage-模型核心概念"
      },
      {
        "depth": 4,
        "text": "AbilityStage",
        "slug": "abilitystage"
      },
      {
        "depth": 4,
        "text": "UIAbility 组件",
        "slug": "uiability-组件"
      },
      {
        "depth": 4,
        "text": "ExtensionAbility 组件",
        "slug": "extensionability-组件"
      },
      {
        "depth": 4,
        "text": "WindowStage",
        "slug": "windowstage"
      },
      {
        "depth": 4,
        "text": "Context",
        "slug": "context"
      },
      {
        "depth": 5,
        "text": "ApplicationContext",
        "slug": "applicationcontext"
      },
      {
        "depth": 5,
        "text": "AbilityStageContext",
        "slug": "abilitystagecontext"
      },
      {
        "depth": 5,
        "text": "UIAbilityContext",
        "slug": "uiabilitycontext"
      },
      {
        "depth": 5,
        "text": "ExtensionContext",
        "slug": "extensioncontext"
      },
      {
        "depth": 5,
        "text": "UIContext",
        "slug": "uicontext"
      },
      {
        "depth": 4,
        "text": "Application 与 Bundle",
        "slug": "application-与-bundle"
      },
      {
        "depth": 2,
        "text": "四、UIAbility 与生命周期",
        "slug": "四uiability-与生命周期"
      },
      {
        "depth": 3,
        "text": "UIAbility 的生命周期方法",
        "slug": "uiability-的生命周期方法"
      },
      {
        "depth": 4,
        "text": "UIAbility 启动到前台",
        "slug": "uiability-启动到前台"
      },
      {
        "depth": 4,
        "text": "UIAbility 启动到后台",
        "slug": "uiability-启动到后台"
      },
      {
        "depth": 4,
        "text": "生命周期回调详解",
        "slug": "生命周期回调详解"
      },
      {
        "depth": 3,
        "text": "UIAbility 启动方式",
        "slug": "uiability-启动方式"
      },
      {
        "depth": 4,
        "text": "singleton（单实例模式）",
        "slug": "singleton单实例模式"
      },
      {
        "depth": 4,
        "text": "multiton（多实例模式）",
        "slug": "multiton多实例模式"
      },
      {
        "depth": 4,
        "text": "specified（指定实例模式）",
        "slug": "specified指定实例模式"
      },
      {
        "depth": 3,
        "text": "AbilityStage 生命周期",
        "slug": "abilitystage-生命周期"
      },
      {
        "depth": 3,
        "text": "@Component 的生命周期",
        "slug": "component-的生命周期"
      },
      {
        "depth": 4,
        "text": "通用生命周期回调（所有 @Component 组件）",
        "slug": "通用生命周期回调所有-component-组件"
      },
      {
        "depth": 4,
        "text": "根组件特有回调（仅 @Entry 装饰的组件）",
        "slug": "根组件特有回调仅-entry-装饰的组件"
      },
      {
        "depth": 4,
        "text": "核心执行顺序",
        "slug": "核心执行顺序"
      },
      {
        "depth": 3,
        "text": "Want",
        "slug": "want"
      },
      {
        "depth": 4,
        "text": "Want 的类型",
        "slug": "want-的类型"
      },
      {
        "depth": 3,
        "text": "UIAbility 间的数据传递方式",
        "slug": "uiability-间的数据传递方式"
      },
      {
        "depth": 2,
        "text": "五、状态管理",
        "slug": "五状态管理"
      },
      {
        "depth": 3,
        "text": "状态管理原理",
        "slug": "状态管理原理"
      },
      {
        "depth": 4,
        "text": "收集依赖",
        "slug": "收集依赖"
      },
      {
        "depth": 4,
        "text": "触发更新",
        "slug": "触发更新"
      },
      {
        "depth": 4,
        "text": "状态管理在渲染管线中的流程",
        "slug": "状态管理在渲染管线中的流程"
      },
      {
        "depth": 3,
        "text": "状态管理 V1 和 V2 更新机制差异",
        "slug": "状态管理-v1-和-v2-更新机制差异"
      },
      {
        "depth": 3,
        "text": "鸿蒙常见的装饰器",
        "slug": "鸿蒙常见的装饰器"
      },
      {
        "depth": 4,
        "text": "一、组件/UI 核心装饰器",
        "slug": "一组件ui-核心装饰器"
      },
      {
        "depth": 4,
        "text": "二、状态管理装饰器",
        "slug": "二状态管理装饰器"
      },
      {
        "depth": 4,
        "text": "三、并发/线程相关装饰器",
        "slug": "三并发线程相关装饰器"
      },
      {
        "depth": 4,
        "text": "四、其他核心装饰器",
        "slug": "四其他核心装饰器"
      },
      {
        "depth": 3,
        "text": "@Observed 装饰器和 @ObjectLink 装饰器的作用",
        "slug": "observed-装饰器和-objectlink-装饰器的作用"
      },
      {
        "depth": 3,
        "text": "@Watch 装饰器的作用",
        "slug": "watch-装饰器的作用"
      },
      {
        "depth": 4,
        "text": "如何避免 @Watch 的循环",
        "slug": "如何避免-watch-的循环"
      },
      {
        "depth": 3,
        "text": "如何实现应用级的、或者多个页面的状态数据共享",
        "slug": "如何实现应用级的或者多个页面的状态数据共享"
      },
      {
        "depth": 3,
        "text": "状态管理（V2）提供了哪些能力",
        "slug": "状态管理v2提供了哪些能力"
      },
      {
        "depth": 4,
        "text": "管理组件拥有的状态",
        "slug": "管理组件拥有的状态"
      },
      {
        "depth": 4,
        "text": "管理数据对象的状态",
        "slug": "管理数据对象的状态"
      },
      {
        "depth": 4,
        "text": "管理应用拥有的状态",
        "slug": "管理应用拥有的状态"
      },
      {
        "depth": 3,
        "text": "@Monitor 与 @Watch 对比",
        "slug": "monitor-与-watch-对比"
      },
      {
        "depth": 3,
        "text": "LazyForEach 和 Repeat 对比",
        "slug": "lazyforeach-和-repeat-对比"
      },
      {
        "depth": 3,
        "text": "如何解决 LazyForEach 数据源变更后界面闪烁的问题",
        "slug": "如何解决-lazyforeach-数据源变更后界面闪烁的问题"
      },
      {
        "depth": 4,
        "text": "1. 确保 key 值唯一且稳定",
        "slug": "1-确保-key-值唯一且稳定"
      },
      {
        "depth": 4,
        "text": "2. 精准更新数据源（避免全量替换触发重渲染）",
        "slug": "2-精准更新数据源避免全量替换触发重渲染"
      },
      {
        "depth": 4,
        "text": "3. 优化子组件渲染逻辑（减少无效重渲染）",
        "slug": "3-优化子组件渲染逻辑减少无效重渲染"
      },
      {
        "depth": 4,
        "text": "4. 控制数据更新时机（应对高频变更场景）",
        "slug": "4-控制数据更新时机应对高频变更场景"
      },
      {
        "depth": 3,
        "text": "兄弟组件如何通信",
        "slug": "兄弟组件如何通信"
      },
      {
        "depth": 2,
        "text": "六、导航与路由",
        "slug": "六导航与路由"
      },
      {
        "depth": 3,
        "text": "路由模式（Router）",
        "slug": "路由模式router"
      },
      {
        "depth": 3,
        "text": "Navigation 组件与 Router 跳转的区别",
        "slug": "navigation-组件与-router-跳转的区别"
      },
      {
        "depth": 3,
        "text": "Navigation 组件显示模式",
        "slug": "navigation-组件显示模式"
      },
      {
        "depth": 3,
        "text": "Navigation 组件的组成部分",
        "slug": "navigation-组件的组成部分"
      },
      {
        "depth": 4,
        "text": "标题栏模式",
        "slug": "标题栏模式"
      },
      {
        "depth": 4,
        "text": "菜单栏参数类型",
        "slug": "菜单栏参数类型"
      },
      {
        "depth": 3,
        "text": "Navigation 路由操作（NavPathStack）",
        "slug": "navigation-路由操作navpathstack"
      },
      {
        "depth": 4,
        "text": "页面跳转",
        "slug": "页面跳转"
      },
      {
        "depth": 4,
        "text": "页面返回",
        "slug": "页面返回"
      },
      {
        "depth": 4,
        "text": "页面替换",
        "slug": "页面替换"
      },
      {
        "depth": 4,
        "text": "页面删除",
        "slug": "页面删除"
      },
      {
        "depth": 4,
        "text": "移动页面到栈顶",
        "slug": "移动页面到栈顶"
      },
      {
        "depth": 3,
        "text": "NavDestination 子页面模式",
        "slug": "navdestination-子页面模式"
      },
      {
        "depth": 3,
        "text": "跨包路由的实现方式",
        "slug": "跨包路由的实现方式"
      },
      {
        "depth": 4,
        "text": "系统路由表",
        "slug": "系统路由表"
      },
      {
        "depth": 4,
        "text": "自定义路由表",
        "slug": "自定义路由表"
      },
      {
        "depth": 2,
        "text": "七、项目结构与模块",
        "slug": "七项目结构与模块"
      },
      {
        "depth": 3,
        "text": "HAP、HSP、HAR 的区别",
        "slug": "haphsphar-的区别"
      },
      {
        "depth": 4,
        "text": "HAP（HarmonyOS Ability Package）—— 应用运行的\"最终载体\"",
        "slug": "hapharmonyos-ability-package-应用运行的最终载体"
      },
      {
        "depth": 4,
        "text": "HSP（HarmonyOS Shared Package）—— 运行时的\"共享模块\"",
        "slug": "hspharmonyos-shared-package-运行时的共享模块"
      },
      {
        "depth": 4,
        "text": "HAR（HarmonyOS Archive）—— 编译时的\"静态工具包\"",
        "slug": "harharmonyos-archive-编译时的静态工具包"
      },
      {
        "depth": 3,
        "text": "鸿蒙应用的配置文件",
        "slug": "鸿蒙应用的配置文件"
      },
      {
        "depth": 3,
        "text": "ohpm 和 npm 的区别",
        "slug": "ohpm-和-npm-的区别"
      },
      {
        "depth": 3,
        "text": "如何在 build-profile.json5 中定义 phone、wearable、car 三个 product",
        "slug": "如何在-build-profilejson5-中定义-phonewearablecar-三个-product"
      },
      {
        "depth": 4,
        "text": "基础配置结构",
        "slug": "基础配置结构"
      },
      {
        "depth": 4,
        "text": "各 product 核心配置项",
        "slug": "各-product-核心配置项"
      },
      {
        "depth": 4,
        "text": "差异化配置（可选）",
        "slug": "差异化配置可选"
      },
      {
        "depth": 3,
        "text": "应用文件加密分区",
        "slug": "应用文件加密分区"
      },
      {
        "depth": 2,
        "text": "八、权限管理",
        "slug": "八权限管理"
      },
      {
        "depth": 3,
        "text": "鸿蒙权限分级机制",
        "slug": "鸿蒙权限分级机制"
      },
      {
        "depth": 4,
        "text": "核心分级框架",
        "slug": "核心分级框架"
      },
      {
        "depth": 4,
        "text": "具体分级与规则",
        "slug": "具体分级与规则"
      },
      {
        "depth": 4,
        "text": "核心机制",
        "slug": "核心机制"
      },
      {
        "depth": 3,
        "text": "敏感权限列表",
        "slug": "敏感权限列表"
      },
      {
        "depth": 4,
        "text": "个人数据访问类",
        "slug": "个人数据访问类"
      },
      {
        "depth": 4,
        "text": "设备功能使用类",
        "slug": "设备功能使用类"
      },
      {
        "depth": 4,
        "text": "通信与网络类",
        "slug": "通信与网络类"
      },
      {
        "depth": 4,
        "text": "分布式能力类",
        "slug": "分布式能力类"
      },
      {
        "depth": 3,
        "text": "在 module.json5 中声明权限后为何仍需动态授权",
        "slug": "在-modulejson5-中声明权限后为何仍需动态授权"
      },
      {
        "depth": 2,
        "text": "九、跨设备开发",
        "slug": "九跨设备开发"
      },
      {
        "depth": 3,
        "text": "鸿蒙如何实现一次开发多端部署",
        "slug": "鸿蒙如何实现一次开发多端部署"
      },
      {
        "depth": 4,
        "text": "整体架构",
        "slug": "整体架构"
      },
      {
        "depth": 4,
        "text": "1. 统一的开发语言与框架（基础前提）",
        "slug": "1-统一的开发语言与框架基础前提"
      },
      {
        "depth": 4,
        "text": "2. 设备形态配置（核心适配手段）",
        "slug": "2-设备形态配置核心适配手段"
      },
      {
        "depth": 4,
        "text": "3. 自适应 UI 组件与布局（视觉适配核心）",
        "slug": "3-自适应-ui-组件与布局视觉适配核心"
      },
      {
        "depth": 4,
        "text": "4. 元能力与分布式部署（跨设备运行核心）",
        "slug": "4-元能力与分布式部署跨设备运行核心"
      },
      {
        "depth": 4,
        "text": "5. 开发工具链支持（落地保障）",
        "slug": "5-开发工具链支持落地保障"
      },
      {
        "depth": 3,
        "text": "鸿蒙分布式能力的关键技术原理",
        "slug": "鸿蒙分布式能力的关键技术原理"
      },
      {
        "depth": 4,
        "text": "分布式软总线（核心通信底座）",
        "slug": "分布式软总线核心通信底座"
      },
      {
        "depth": 4,
        "text": "分布式设备虚拟化（硬件能力共享）",
        "slug": "分布式设备虚拟化硬件能力共享"
      },
      {
        "depth": 4,
        "text": "分布式数据管理（数据跨设备一致）",
        "slug": "分布式数据管理数据跨设备一致"
      },
      {
        "depth": 4,
        "text": "分布式任务调度（应用跨端流转）",
        "slug": "分布式任务调度应用跨端流转"
      },
      {
        "depth": 2,
        "text": "十、线程通信与并发",
        "slug": "十线程通信与并发"
      },
      {
        "depth": 3,
        "text": "TaskPool 和 Worker",
        "slug": "taskpool-和-worker"
      },
      {
        "depth": 4,
        "text": "建议使用 Worker 的场景",
        "slug": "建议使用-worker-的场景"
      },
      {
        "depth": 4,
        "text": "建议使用 TaskPool 的场景",
        "slug": "建议使用-taskpool-的场景"
      },
      {
        "depth": 3,
        "text": "鸿蒙线程间通信",
        "slug": "鸿蒙线程间通信"
      },
      {
        "depth": 4,
        "text": "线程间通信的原因",
        "slug": "线程间通信的原因"
      },
      {
        "depth": 4,
        "text": "线程间通信的限制",
        "slug": "线程间通信的限制"
      },
      {
        "depth": 4,
        "text": "ArkTS 支持的线程间通信对象（总结）",
        "slug": "arkts-支持的线程间通信对象总结"
      },
      {
        "depth": 4,
        "text": "普通对象（详细）",
        "slug": "普通对象详细"
      },
      {
        "depth": 4,
        "text": "ArrayBuffer 对象（详细）",
        "slug": "arraybuffer-对象详细"
      },
      {
        "depth": 4,
        "text": "SharedArrayBuffer 对象（详细）",
        "slug": "sharedarraybuffer-对象详细"
      },
      {
        "depth": 4,
        "text": "Transferable 对象（详细）",
        "slug": "transferable-对象详细"
      },
      {
        "depth": 4,
        "text": "Sendable 对象（详细）",
        "slug": "sendable-对象详细"
      },
      {
        "depth": 3,
        "text": "传递 ArrayBuffer 时，拷贝方式和转移方式有什么区别",
        "slug": "传递-arraybuffer-时拷贝方式和转移方式有什么区别"
      },
      {
        "depth": 3,
        "text": "Atomics 类",
        "slug": "atomics-类"
      },
      {
        "depth": 4,
        "text": "定义",
        "slug": "定义"
      },
      {
        "depth": 4,
        "text": "常见方法",
        "slug": "常见方法"
      },
      {
        "depth": 4,
        "text": "常见使用场景",
        "slug": "常见使用场景"
      },
      {
        "depth": 3,
        "text": "@Sendable 详解",
        "slug": "sendable-详解"
      },
      {
        "depth": 4,
        "text": "支持的数据类型",
        "slug": "支持的数据类型"
      },
      {
        "depth": 4,
        "text": "实现原理（SharedHeap 与 LocalHeap 的区别）",
        "slug": "实现原理sharedheap-与-localheap-的区别"
      },
      {
        "depth": 4,
        "text": "使用约束",
        "slug": "使用约束"
      },
      {
        "depth": 4,
        "text": "Sendable 对象的序列化/反序列化",
        "slug": "sendable-对象的序列化反序列化"
      },
      {
        "depth": 4,
        "text": "@Sendable 使用场景",
        "slug": "sendable-使用场景"
      },
      {
        "depth": 3,
        "text": "异步锁",
        "slug": "异步锁"
      },
      {
        "depth": 3,
        "text": "异步等待",
        "slug": "异步等待"
      },
      {
        "depth": 3,
        "text": "共享容器",
        "slug": "共享容器"
      },
      {
        "depth": 4,
        "text": "共享容器和原生容器的转换",
        "slug": "共享容器和原生容器的转换"
      },
      {
        "depth": 3,
        "text": "\"use shared\" 的作用（共享模块）",
        "slug": "use-shared-的作用共享模块"
      },
      {
        "depth": 4,
        "text": "共享模块的使用约束",
        "slug": "共享模块的使用约束"
      },
      {
        "depth": 3,
        "text": "线程间通信场景",
        "slug": "线程间通信场景"
      },
      {
        "depth": 4,
        "text": "使用 TaskPool 执行独立的耗时任务",
        "slug": "使用-taskpool-执行独立的耗时任务"
      },
      {
        "depth": 4,
        "text": "使用 TaskPool 执行多个耗时任务",
        "slug": "使用-taskpool-执行多个耗时任务"
      },
      {
        "depth": 4,
        "text": "TaskPool 任务与宿主线程通信",
        "slug": "taskpool-任务与宿主线程通信"
      },
      {
        "depth": 4,
        "text": "Worker 和宿主线程的即时消息通信",
        "slug": "worker-和宿主线程的即时消息通信"
      },
      {
        "depth": 4,
        "text": "Worker 同步调用宿主线程的接口",
        "slug": "worker-同步调用宿主线程的接口"
      },
      {
        "depth": 4,
        "text": "多级 Worker 间高性能消息通信",
        "slug": "多级-worker-间高性能消息通信"
      },
      {
        "depth": 3,
        "text": "进程间通信",
        "slug": "进程间通信"
      },
      {
        "depth": 4,
        "text": "步骤",
        "slug": "步骤"
      },
      {
        "depth": 4,
        "text": "案例：批量数据写数据库场景",
        "slug": "案例批量数据写数据库场景"
      },
      {
        "depth": 2,
        "text": "十一、其他",
        "slug": "十一其他"
      },
      {
        "depth": 3,
        "text": "设计一个鸿蒙应用的崩溃监控和恢复方案",
        "slug": "设计一个鸿蒙应用的崩溃监控和恢复方案"
      },
      {
        "depth": 4,
        "text": "崩溃全场景监控",
        "slug": "崩溃全场景监控"
      },
      {
        "depth": 4,
        "text": "崩溃信息存储与上报",
        "slug": "崩溃信息存储与上报"
      },
      {
        "depth": 4,
        "text": "分级自动恢复策略",
        "slug": "分级自动恢复策略"
      },
      {
        "depth": 4,
        "text": "崩溃问题定位与闭环",
        "slug": "崩溃问题定位与闭环"
      },
      {
        "depth": 4,
        "text": "前置防护（减少崩溃发生）",
        "slug": "前置防护减少崩溃发生"
      },
      {
        "depth": 4,
        "text": "用户体验优化",
        "slug": "用户体验优化"
      },
      {
        "depth": 3,
        "text": "鸿蒙如何后台保活",
        "slug": "鸿蒙如何后台保活"
      },
      {
        "depth": 4,
        "text": "PC 端保活",
        "slug": "pc-端保活"
      },
      {
        "depth": 4,
        "text": "手机端保活",
        "slug": "手机端保活"
      },
      {
        "depth": 3,
        "text": "鸿蒙键鼠连接监控",
        "slug": "鸿蒙键鼠连接监控"
      },
      {
        "depth": 3,
        "text": "鸿蒙本地数据库（关系型数据库 RDB）",
        "slug": "鸿蒙本地数据库关系型数据库-rdb"
      },
      {
        "depth": 4,
        "text": "RDB 常用功能",
        "slug": "rdb-常用功能"
      }
    ],
    "searchText": "harmonyos arkts 开发知识库 其他语言 harmonyos arkts 开发知识库 一、arkts 语言基础 arkts 中声明式编程范式与命令式编程范式有何不同？ 声明式编程范式关注\"是什么\"，通过简洁代码描述最终结果，如在 arkts 中用声明式语法构建 ui，只需描述 ui 结构。而命令式编程范式关注\"怎么做\"，通过一系列语句按顺序执行来实现目标，强调执行步骤。例如，声明式构建 ui 用 column { / 子组件 / } 描述布局，命令式则需逐步操作每个 ui 元素的创建与排列。 如何在 arkts 中创建自定义组件？ 使用 @component 装饰器定义组件，在组件内部可以定义属性、状态和方法。 @state 和 @link 装饰器的作用 @state 用于标记响应式状态变量，当该变量值改变时，依赖它的 ui 会自动更新，实现数据与 ui 的响应式绑定。 @link 用于建立父子组件间状态变量的双向绑定关系，子组件可读取并修改父组件传递的状态变量，修改后父组件状态会同步更新，反之父组件状态变更也会同步到子组件。@link 需搭配父组件的 @state/@provide 等装饰器变量使用，不能单独定义。 arkts 与 typescript 的区别 设计定位与应用场景 typescript ：微软推出的 javascript 超集，核心用于 web 前端、node.js 后端开发，无原生跨设备/分布式能力，需依赖框架适配多端。 arkts ：华为基于 typescript 扩展的鸿蒙专属语言，专为鸿蒙全场景开发设计，原生支持多设备适配、分布式能力、鸿蒙 ui 组件开发，仅用于鸿蒙应用/服务开发。 语法扩展差异 arkts 在 typescript 基础上新增鸿蒙专属语法：如 ui 装饰器（@entry/@component/@state）、构建函数（build()）、布局描述（column/row/flex）、状态管理语法（@link/@provide/@consume），直接支持 ui 开发。 typescript 仅提供类型校验、接口、泛型等基础语法，无 ui 相关原生语法，需结合 react/vue 等框架实现 ui 开发。 运行环境与编译机制 typescript 需编译为 javascript，运行在浏览器/node.js 引擎，依赖虚拟机（如 v8）执行。 arkts 通过方舟编译器直接编译为鸿蒙设备可执行的机器码，无虚拟机开销，支持鸿蒙多内核（linux/微内核/rtos）适配，运行效率更高。 核心能力支持 arkts 原生集成鸿蒙分布式能力（如分布式数据管理、设备虚拟化）、鸿蒙 api 调用（如文件系统、权限管理）、多设备布局适配（如媒体查询、条件编译）。 typescript 无分布式能力，调用原生设备能力需依赖 electron/cordova 等中间层，多设备适配需手动编写适配逻辑。 生态与工具链 typescript 拥有全球庞大的 web 生态，兼容所有 javascript 库，开发工具支持 vs code 等全平台。 arkts 生态聚焦鸿蒙场景，仅兼容鸿蒙官方库，开发需使用 deveco studio，工具链深度适配鸿蒙编译、调试、多设备预览能力。 类型系统与语法约束 二者均为强类型语言，但 arkts 针对鸿蒙开发新增语法约束：如 ui 组件必须在 build() 函数内声明、状态变量需通过装饰器标记、函数不能返回 ui 组件等。 typescript 无 ui 相关语法约束，类型校验仅聚焦代码逻辑层面。 arkts 与 native（c++）的性能区别 执行机制 arkts ：基于 arkvm 虚拟机运行，代码需先编译为字节码，再通过解释执行或 aot 编译转为机器码，存在中间层执行开销。 native c++ ：直接编译为目标硬件的原生机器码，由 cpu 直接执行，无任何中间层开销。 启动性能 arkts ：冷启动有字节码加载、aot 编译的额外开销，启动速度慢；二次启动因缓存 aot 结果速度提升，但仍不及 c++。 native c++ ：无额外编译/加载开销，冷/热启动速度均为最优。 计算密集型性能 arkts ：处理复杂计算（如图像处理、加密、大规模数据运算）时，因虚拟机调度开销，性能比 c++ 低 20%–50%。 native c++ ：无中间层损耗，指令执行效率最高，计算密集型场景性能远超 arkts。 内存开销 arkts ：需占用 arkvm 的额外内存（虚拟机栈、gc 堆），垃圾回收（gc）时会出现短暂内存停顿。 native c++ ：内存完全手动管理，无虚拟机额外占用，内存利用率更高，仅需手动规避内存泄漏。 ui 渲染性能 arkts ：声明式 ui 框架对普通渲染、简单动效优化充分，性能足够；但高频动画（如 60/120fps 游戏 ui）、复杂实时渲染易掉帧。 native c++ ：可直接对接底层渲染接口，能稳定保障高频/复杂渲染的流畅度。 跨设备适配开销 arkts ：依托 arkvm 屏蔽硬件架构（arm32/arm64/x86）差异，跨设备适配无额外性能损耗。 native c++ ：需针对不同架构编译不同二进制包，适配不当会导致性能下降。 并发性能 arkts ：多线程依赖 worker 线程，共享数据需通过 atomics + sharedarraybuffer 实现原子操作，存在框架层调度开销。 native c++ ：可直接调用系统原生多线程接口，线程调度和内存共享更贴近底层，并发性能更高。 px、vp、fp 单位的区别 px（pixel，像素） ：屏幕硬件上的最小显示单元，是屏幕的物理属性。 vp（viewport pixel，虚拟像素） ：鸿蒙的核心布局适配单位，也叫\"视口像素\"。鸿蒙将任意设备的屏幕宽度固定为 1000vp（无论屏幕物理尺寸/分辨率如何），1vp 就是屏幕宽度的 1/1000。 fp（font pixel，字体像素） ：专为文字设计的适配单位，基于 vp 但额外响应系统字体缩放设置。和 vp 的核心区别是——如果用户在系统设置中调大/调小字体（比如调大 20%），10fp 的文字会同步放大 20%，而 10vp 的文字不会变化。 如何实现自适应布局？ 可以使用弹性布局（如 column、row 等容器），通过设置 flexdirection、justifycontent、alignitems 等属性实现不同方向和对齐方式的布局。还可利用百分比布局，使组件大小和位置根据父容器动态调整。 同时，借助媒体查询（如 @media），根据设备屏幕尺寸、分辨率等条件应用不同样式和布局，以适配多种设备形态。 二、harmonyos 应用架构 harmonyos 的分层架构 harmonyos 应用分层架构包括 产品定制层 、 基础特性层 和 公共能力层 ，构建了清晰、高效、可扩展的设计架构。 产品定制层 产品定制层专注于满足不同设备或使用场景的个性化需求，包括 ui 设计、资源和配置，以及特定场景的交互逻辑和功能特性。 产品定制层的功能模块独立运作，依赖基础特性层和公共能力层实现具体功能。 产品定制层作为应用的入口，是用户直接互动的界面。为了满足特定需求，产品定制层可以灵活调整和扩展，以适应各种使用场景。 基础特性层 基础特性层位于公共能力层之上，用于存放相对独立的功能 ui 和业务逻辑实现。每个功能模块都具备高内聚、低耦合、可定制的特点，支持产品的灵活部署。 基础特性层为产品定制层提供稳健且丰富的基础功能支持，包括 ui 组件和基础服务。公共能力层为其提供通用功能和服务。 为了增强系统的可扩展性和维护性，基础特性层对功能进行了模块化处理。例如，应用底部导航栏的每个选项都是一个独立的业务模块。 公共能力层 公共能力层存放公共基础能力，包括公共 ui 组件、数据管理、外部交互和工具库等共享功能。应用可调用这些公共能力。公共能力层提供稳定可靠的功能支持，确保应用的稳定性和可维护性。 公共能力层包含以下组成部分： 公共 ui 组件 ：设计为通用且高度可复用，确保在不同应用程序模块间保持一致的用户体验。这些组件提供标准化、友好的界面，帮助开发者快速实现常见的用户交互需求，如提示、警告和加载状态显示，从而提高开发效率和用户满意度。 数据管理 ：负责应用程序中数据的存储和访问，包括应用数据、系统数据等，提供了统一的数据管理接口，简化数据的读写操作。通过集中式的数据管理方式不仅使得数据的维护更为简单，而且能够保证数据的一致性和安全性。 外部交互 ：负责应用程序与外部系统的交互，包括网络请求、文件 i/o、设备 i/o 等，提供统一的外部接口，简化应用程序与外部系统的交互。开发者可以方便地实现网络通信、数据存储和硬件接入，从而加速开发流程并保证程序的稳定性和性能。 工具库 ：提供一系列常用工具函数和类，如字符串处理、日期时间处理、加密解密、数据压缩解压等，帮助开发者提高效率和代码质量。 鸿蒙核心架构与 android 的区别 核心差异 ：android 是单设备移动 os，架构绑定 linux 内核、依赖虚拟机；鸿蒙是分布式全场景 os，架构解耦、支持多内核、原生分布式能力。 关键能力 ：鸿蒙的分布式软总线、原子化服务、多设备资源共享是 android 不具备的核心优势。 开发层面 ：鸿蒙支持\"一次开发多端部署\"，android 需为不同设备单独适配，开发效率和多设备体验差距显著。 三、应用模型（fa 模型与 stage 模型） fa 模型与 stage 模型 fa 模型 是早期的应用模型，为应用程序提供必备的组件与运行机制。在该模型中每个应用组件独享一个 arkts 引擎实例，适用于简单应用的开发。 stage 模型 是当前系统主推的应用模型，为应用程序提供必备的组件与运行机制。该模型提供了 abilitystage 组件管理器和 windowstage 窗口管理器，分别作为应用组件与窗口的\"舞台\"，故得名\"stage 模型\"。stage 模型支持多个应用组件共享同一个 arkts 引擎实例，以及应用组件间的状态共享与对象调用，可以降低内存开销、提升开发效率，适用于复杂应用的开发。 stage 模型核心概念 abilitystage 每个 entry 类型或者 feature 类型的 hap 在运行期都有一个 abilitystage 实例，当 hap 中的代码首次被加载到进程中的时候，系统会先创建 abilitystage 实例。 一个 hap 包中可以包含一个或多个 uiability/extensionability 组件，这些组件在运行时共用同一个 abilitystage 实例。当 hap 中的代码（无论是 uiability 组件还是 extensionability 组件）首次被加载到进程中的时候，系统会先创建对应的 abilitystage 实例。 uiability 组件 uiability 组件是一种包含 ui 的应用组件，主要用于和用户交互。例如，图库类应用可以在 uiability 组件中展示图片瀑布流，在用户选择某个图片后，在新的页面中展示图片的详细内容。同时用户可以通过返回键返回到瀑布流页面。uiability 组件的生命周期只包含创建、销毁、前台、后台等状态，与显示相关的状态通过 windowstage 的事件暴露给开发者。 每一个 uiability 组件实例都会在最近任务列表中显示一个对应的任务。对于开发者而言，可以根据具体场景选择单个还是多个 uiability，划分建议如下： 如果开发者希望在任务视图中看到一个任务，建议使用\"一个 uiability + 多个页面\"的方式，可以避免不必要的资源加载。 如果开发者希望在任务视图中看到多个任务，或者需要同时开启多个窗口，建议使用多个 uiability 实现不同的功能。 例如，即时通讯类应用中的消息列表与音视频通话采用不同的 uiability 进行开发，既可以方便地切换任务窗口，又可以实现应用的两个任务窗口在一个屏幕上分屏显示。 为使应用能够正常使用 uiability，需要在 module.json5 配置文件的 abilities 标签中声明 uiability 的名称、入口、标签等相关信息。 extensionability 组件 extensionability 组件是一种面向特定场景的应用组件。开发者并不直接从 extensionability 派生，而是需要使用 extensionability 的派生类。目前 extensionability 有用于卡片场景的 formextensionability，用于输入法场景的 inputmethodextensionability，用于闲时任务场景的 workschedulerextensionability 等多种派生类，这些派生类都是基于特定场景提供的。 windowstage 每个 uiability 类实例都会与一个 windowstage 类实例绑定，该类提供了应用进程内窗口管理器的作用。它包含一个主窗口。也就是说 uiability 通过 windowstage 持有了一个主窗口，该主窗口为 arkui 提供了绘制区域。 context 在 stage 模型上，context 及其派生类向开发者提供在运行期可以调用的各种资源和能力。uiability 组件和各种 extensionability 派生类都有各自不同的 context 类，他们都继承自基类 context，但是各自又根据所属组件，提供不同的能力。 context 是应用中对象的上下文，其提供了应用的一些基础信息，例如 resourcemanager（资源管理）、applicationinfo（当前应用信息）、area（文件分区）等。 context 的用法： 获取基本信息（例如资源管理对象、应用程序信息等） 获取应用文件路径 获取和修改加密分区 监听应用前后台变化 监听 uiability 生命周期变化 applicationcontext 应用的全局上下文，提供应用级别的信息和能力。通过 getapplicationcontext 获取。 applicationcontext 在基类 context 的基础上提供了监听应用内应用组件的生命周期的变化、监听系统内存变化、监听应用内系统环境变化、设置应用语言、设置应用颜色模式、清除应用自身数据的同时撤销应用向用户申请的权限等能力，在 uiability、extensionability、abilitystage 中均可以获取。 abilitystagecontext 模块级别的上下文，提供模块级别的信息和能力。可以直接通过 abilitystage 实例获取当前 abilitystage 的 context。可以通过 createmodulecontext 方法获取同一应用中其他 module 的 context。 abilitystagecontext 和基类 context 相比，额外提供 hapmoduleinfo、configuration 等信息。 uiabilitycontext uiability 组件对应的上下文，提供 uiability 对外的信息和能力。 uiabilitycontext 和基类 context 相比，额外提供 abilityinfo、currenthapmoduleinfo 等属性。通过 uiabilitycontext 可以获取 uiability 的相关配置信息，如包代码路径、bundle 名称、ability 名称和应用程序需要的环境状态等属性信息，也可以获取操作 uiability 实例的方法（如 startability()、connectserviceextensionability()、terminateself() 等）。 extensioncontext extensionability 组件对应的上下文，每种类型的 extensioncontext 提供不同的信息和能力。 以 formextensioncontext 为例，表示卡片服务的上下文环境，继承自 extensioncontext，提供卡片服务相关的接口能力。 uicontext arkui 的 ui 实例上下文，提供 ui 操作相关的能力。与上述其他类型的 context 无直接关系。在 ui 组件内获取 uicontext，直接使用组件内置的 getuicontext 方法。 application 与 bundle application 是应用在设备上的运行实例，作为一个完整的软件实体与用户交互。在 stage 模型中，它由一个或多个 hap 作为功能模块构成，这些 hap 可以共享一个或多个 hsp 中的代码与资源。 bundle 是应用在安装部署阶段的静态文件，包含了所有 hap、hsp 及相关资源；当其被安装并启动后，便形成了在运行期的动态实例 application。 四、uiability 与生命周期 uiability 的生命周期方法 uiability 组件的核心生命周期回调包括 oncreate、onforeground、onbackground、ondestroy。作为一种包含 ui 的应用组件，uiability 的生命周期不可避免地与 windowstage 的生命周期存在关联关系。 uiability 启动到前台 当用户启动一个 uiability 时，系统会依次触发 oncreate() → onwindowstagecreate() → onforeground() 生命周期回调。 当用户跳转到其他应用（当前 uiability 切换到后台）时，系统会触发 onbackground() 生命周期回调。 当用户再次将 uiability 切换到前台时，系统会依次触发 onnewwant() → onforeground() 生命周期回调。 uiability 启动到后台 当用户通过 uiabilitycontext.startabilitybycall() 接口启动一个 uiability 到后台时，系统会依次触发 oncreate() → onbackground()（不会执行 onwindowstagecreate() 生命周期回调）。 当用户将 uiability 拉到前台，系统会依次触发 onnewwant() → onwindowstagecreate() → onforeground() 生命周期回调。 生命周期回调详解 oncreate() ：在首次创建 uiability 实例时，系统触发 oncreate() 回调。开发者可以在该回调中执行 uiability 整个生命周期中仅发生一次的启动逻辑。 onwindowstagecreate() ：uiability 实例创建完成之后，在进入前台之前，系统会创建一个 windowstage。windowstage 创建完成后会进入 onwindowstagecreate() 回调，开发者可以在该回调中进行 ui 加载、windowstage 的事件订阅。在 onwindowstagecreate() 回调中通过 loadcontent() 方法设置应用要加载的页面，并根据需要调用 on('windowstageevent') 方法订阅 windowstage 的事件（获焦/失焦、切到前台/切到后台、前台可交互/前台不可交互）。 onforeground() ：在 uiability 切换至前台时且 uiability 的 ui 可见之前，系统触发 onforeground 回调。开发者可以在该回调中申请系统需要的资源，或者重新申请在 onbackground() 中释放的资源。系统回调该方法后，uiability 实例进入前台状态，即 uiability 实例可以与用户交互的状态。uiability 实例会一直处于这个状态，直到被某些动作打断（例如屏幕关闭、用户跳转到其他 uiability）。例如，应用已获得地理位置权限。在 ui 显示之前，开发者可以在 onforeground() 回调中开启定位功能，从而获取到当前的位置信息。 onbackground() ：在 uiability 的 ui 完全不可见之后，系统触发 onbackground 回调，将 uiability 实例切换至后台状态。开发者可以在该回调中释放 ui 不可见时的无用资源，例如停止定位功能，以节省系统的资源消耗。onbackground() 执行时间较短，无法提供足够的时间做一些耗时动作。请勿在该方法中执行保存用户数据或执行数据库事务等耗时操作。 onwindowstagewilldestroy() ：在 uiability 实例销毁之前，系统触发 onwindowstagewilldestroy() 回调。该回调在 windowstage 销毁前执行，此时 windowstage 可以使用。开发者可以在该回调中释放通过 windowstage 获取的资源、注销 windowstage 事件订阅等。 onwindowstagedestroy() ：在 uiability 实例销毁之前，系统触发 onwindowstagedestroy() 回调，开发者可以在该回调中释放 ui 资源。该回调在 windowstage 销毁后执行，此时 windowstage 不可以使用。 ondestroy() ：在 uiability 实例销毁之前，系统触发 ondestroy 回调。该回调是 uiability 接收到的最后一个生命周期回调，开发者可以在 ondestroy() 回调中进行系统资源的释放、数据的保存等操作。例如，开发者调用 terminateself() 方法通知系统停止当前 uiability 实例时，系统会触发 ondestroy() 回调。 onnewwant() ：当应用的 uiability 实例已创建，再次调用方法启动该 uiability 实例时，系统触发该 uiability 的 onnewwant() 回调。开发者可以在该回调中更新要加载的资源和数据等，用于后续的 ui 展示。 uiability 启动方式 通过配置 module.json5 配置文件中的 launchtype 字段，可以修改 uiability 的启动方式。共有三种取值： singleton（单实例模式） singleton 启动模式为单实例模式，也是默认情况下的启动模式。每次调用 startability() 方法时，如果应用进程中该类型的 uiability 实例已经存在，则复用系统中的 uiability 实例。系统中只存在唯一一个该 uiability 实例，即在最近任务列表中只存在一个该类型的 uiability 实例。 multiton（多实例模式） multiton 启动模式为多实例模式，每次调用 startability() 方法时，都会在应用进程中创建一个新的该类型 uiability 实例。即在最近任务列表中可以看到有多个该类型的 uiability 实例。这种情况下可以将 uiability 配置为 multiton（多实例模式）。 specified（指定实例模式） specified 启动模式为指定实例模式，针对一些特殊场景使用（例如文档应用中每次新建文档希望都能新建一个文档实例，重复打开一个已保存的文档希望打开的都是同一个文档实例）。 假设应用有两个 uiability 实例，即 entryability 和 specifiedability。entryability 以 specified 模式启动 specifiedability。基本原理如下： 1. entryability 调用 startability() 方法，并在 want 的 parameters 字段中设置唯一的 key 值，用于标识 specifiedability。 2. 系统在拉起 specifiedability 之前，会先进入对应的 abilitystage 的 onacceptwant() 生命周期回调，获取用于标识目标 uiability 的 key 值。 3. 系统会根据获取的 key 值来匹配 uiability： 如果匹配到对应的 uiability，则会启动该 uiability 实例，并进入 onnewwant() 生命周期回调。 如果无法匹配对应的 uiability，则会创建一个新的 uiability 实例，并进入该 uiability 实例的 oncreate() 生命周期回调和 onwindowstagecreate() 生命周期回调。 abilitystage 生命周期 oncreate() 生命周期回调 ：在开始加载对应 module 的第一个应用组件（如 uiability 组件或具体扩展能力的 extensionability 组件）实例之前会先创建 abilitystage，并在 abilitystage 创建完成之后执行其 oncreate() 生命周期回调。abilitystage 模块提供在 module 加载的时候，通知开发者，可以在此进行该 module 的初始化（如资源预加载、线程创建等）。通过 environmentcallback 来监听系统环境变化，例如系统语言、深浅色模式、屏幕方向、字体大小缩放比例、字体粗细缩放比例等信息。当系统环境变量发生变更时，会触发 environmentcallback 中的 onconfigurationupdated() 回调，并打印相关信息。 onacceptwant() 事件回调 ：uiability 指定实例模式（specified）启动时触发的事件回调。 onconfigurationupdate() 事件回调 ：当系统环境变量（例如系统语言、深浅色等）发生变更时触发的事件回调，配置项均定义在 configuration 类中。 onmemorylevel() 事件回调 ：当系统调整内存时触发的事件回调。应用被切换到后台时，系统会将在后台的应用保留在缓存中。即使应用处于缓存中，也会影响系统整体性能。当系统资源不足时，系统会通过多种方式从应用中回收内存，必要时会完全停止应用，从而释放内存用于执行关键任务。为了进一步保持系统内存的平衡，避免系统停止用户的应用进程，可以在 abilitystage 中的 onmemorylevel() 生命周期回调中订阅系统内存的变化情况，释放不必要的资源。 onnewprocessrequest() 事件回调 ：uiability 启动时触发的事件回调。通过该回调，开发者可以指定每个 uiability 启动时是否在独立的进程中创建。该回调返回一个开发者自定义字符串标识，如果返回的字符串标识为开发者曾创建的，则复用该标识所对应的进程，否则创建新的进程。需要注意该回调需要配合在 module.json5 中声明 isolationprocess 字段为 true。 onpreparetermination() 事件回调 ：当应用被用户关闭时调用，可用于询问用户选择立即执行操作还是取消操作。开发者通过在回调中返回 abilityconstant.preparetermination 中定义的枚举类型通知系统是否继续执行关闭动作。 ondestroy() 生命周期回调 ：当对应 module 的最后一个 ability 实例退出后触发。此方法仅在应用正常销毁时触发。当应用程序异常退出或被终止时，将不会调用此方法。 @component 的生命周期 通用生命周期回调（所有 @component 组件） 这是所有自定义组件都具备的基础生命周期，聚焦组件自身的渲染与销毁： 1. abouttoappear 触发时机 ：组件即将执行 build() 方法渲染 ui 时触发，首次显示仅执行 1 次（组件销毁重建会重新触发）。 核心作用 ：做轻量初始化，比如设置组件初始状态、绑定简单数据源（如本地缓存数据）。 注意点 ：不能执行耗时操作（如网络请求、大文件解析），否则会阻塞 ui 渲染导致页面卡顿。 2. abouttodisappear 触发时机 ：组件即将从渲染树中移除、销毁时触发。 核心作用 ：释放组件内的临时资源，比如关闭定时器、移除事件监听、清空临时变量，这是避免内存泄漏的关键。 开发实践 ：和 abouttoappear 配对使用（比如前者开定时器，后者关定时器）。 根组件特有回调（仅 @entry 装饰的组件） @entry 组件是页面的根组件，会关联 page 页面的前台/后台状态，因此多了 3 个特有回调： 1. onpageshow 触发时机 ：页面进入前台显示时（包括首次打开页面、从后台切回应用）。 核心作用 ：恢复页面级的业务逻辑，比如刷新列表数据、重启音频/视频播放、恢复用户操作状态。 2. onpagehide 触发时机 ：页面进入后台隐藏时（比如跳转到其他页面、切到手机桌面）。 核心作用 ：暂停非必要的前台逻辑，比如暂停播放、保存表单临时输入内容、停止高频轮询。 3. onbackpress 触发时机 ：用户点击系统返回键时。 核心作用 ：自定义返回逻辑（面试高频考点）：返回 true 表示拦截默认返回行为（比如弹出\"确认退出\"对话框），返回 false 表示执行系统默认返回逻辑（返回上一页）。 核心执行顺序 1. 首次打开 ：page.oncreate() → 根组件 abouttoappear() → 子组件 abouttoappear() → page.onactive() → 根组件 onpageshow() 2. 切到后台 ：page.oninactive() → 根组件 onpagehide() → page.onbackground() 3. 切回前台 ：page.onforeground() → page.onactive() → 根组件 onpageshow() 4. 点击返回键销毁 ：根组件 onbackpress() → 根组件 onpagehide() → page.oninactive() → page.onbackground() → 子组件 abouttodisappear() → 根组件 abouttodisappear() → page.ondestroy() want want 是一种对象，用于在应用组件之间传递信息。其中，一种常见的使用场景是作为 startability() 方法的参数。例如，当 uiabilitya 需要启动 uiabilityb 并向 uiabilityb 传递一些数据时，可以使用 want 作为一个载体，将数据传递给 uiabilityb。 want 的类型 显式 want ：在启动目标应用组件时，调用方传入的 want 参数中指定了 abilityname 和 bundlename，称为显式 want。显式 want 通常用于应用内组件启动，通过在 want 对象内指定本应用 bundle 名称信息（bundlename）和 abilityname 来启动应用内目标组件。当有明确处理请求的对象时，显式 want 是一种简单有效的启动目标应用组件的方式。 隐式 want ：在启动目标应用组件时，调用方传入的 want 参数中未指定 abilityname，称为隐式 want。当需要处理的对象不明确时，可以使用隐式 want，在当前应用中使用其他应用提供的某个能力，而不关心提供该能力的具体应用。隐式 want 使用 skills 标签来定义需要使用的能力，并由系统匹配声明支持该请求的所有应用来处理请求。例如，需要打开一个链接的请求，系统将匹配所有声明支持该请求的应用，然后让用户选择使用哪个应用打开链接。 uiability 间的数据传递方式 使用 eventhub 进行数据通信 ：在基类 context 中提供了 eventhub 对象，可以通过发布订阅方式来实现事件的传递。在事件传递前，订阅者需要先进行订阅，当发布者发布事件时，订阅者将接收到事件并进行相应处理。 1. 获取 eventhub 对象 2. 通过 eventhub.on 注册事件监听 3. 通过 eventhub.emit 触发事件 使用 appstorage/localstorage 进行数据同步 ：arkui 提供了 appstorage 和 localstorage 两种应用级别的状态管理方案，可用于实现应用级别和 uiability 级别的数据同步。 appstorage 是一个全局的状态管理器，适用于多个 uiability 共享同一状态数据的情况。 localstorage 则是一个局部的状态管理器，适用于单个 uiability 内部使用的状态数据。 五、状态管理 状态管理原理 收集依赖 收集依赖是指建立状态变量与组件之间的数据绑定关系。在 ui 渲染时，状态管理框架会\"观察\"哪些状态变量被读取了，并记录下这个\"依赖关系\"。一个 ui 界面上可能使用了多个状态变量，在修改状态变量时，仅与该状态变量相关的组件进行 ui 刷新，其他不相关的组件不会刷新。因此，ui 刷新时需要明确哪些组件使用了被修改的状态变量，以能够实现这些组件的精准刷新。 触发更新 当状态变量发生改变时，状态管理框架会通知所有依赖于它的 ui 组件，重新计算并刷新，这个过程称为触发更新。触发更新大致可以分为三个步骤： 1. 计算状态变量发生改变后的新值。 2. 修改状态变量的值，并将与其绑定的组件标脏。 3. 刷新所有的脏节点，更新 ui 的同时重新收集依赖。 状态管理在渲染管线中的流程 事件触发状态变量发生改变，执行状态变量的 set 方法，将自定义组件和系统组件标脏，并请求一个刷新信号。 1. 刷新脏节点 ：刷新标脏的自定义组件和系统组件。 2. 布局 ：根据标脏局部刷新组件树，触发子树上节点的尺寸测量和位置确认。 状态管理循环执行两大步骤：收集依赖和触发更新。收集状态变量与组件之间的依赖关系。当状态变量发生变化时，执行标脏，刷新对应的 ui，同时更新依赖关系。 相比状态管理 v1，状态管理 v2 在状态变量变化时，会异步标脏组件。 状态管理 v1 和 v2 更新机制差异 状态管理 v1 使用代理观察数据，创建状态变量时，会同时创建一个数据代理观察者。该观察者可以感知代理变化，但无法精准观测到实际数据变化，v1 状态管理存在以下限制： 状态变量不能独立于 ui 存在，同一个数据被多个视图代理时，其中一个视图的更改不会通知其他视图更新。 只能感知对象属性第一层的变化，无法做到深度观测和深度监听。 在更改对象中属性场景下存在冗余更新的问题。 装饰器间配合使用限制多，不易用。组件中没有明确状态变量的输入与输出，不利于组件化。 状态管理 v2 增强了数据的观察能力，使数据本身可观察。更改数据时，会触发相应视图的更新。相较于状态管理 v1，状态管理 v2 有如下优点： 状态变量独立于 ui，更改数据会触发相应视图的更新。 支持对象的深度观测和深度监听，且深度观测机制不影响观测性能。 支持对象中属性级精准更新。 装饰器易用性高、拓展性强，在组件中明确输入与输出，有利于组件化。 鸿蒙常见的装饰器 一、组件/ui 核心装饰器 1. @entry：标记自定义组件为页面根组件，唯一且绑定 page 生命周期，一个页面仅能有一个。 2. @component：标记普通自定义组件，是构建 ui 的基础单元，可嵌套使用。 3. @builder：封装可复用的 ui 片段，实现 ui 逻辑抽离与复用。 4. @builderparam：将 @builder 装饰的 ui 片段作为参数传入组件，提升组件灵活性。 5. @extend：扩展已有系统组件的属性/方法，无需继承即可新增 ui 能力。 6. @customdialog：标记自定义弹窗组件，用于创建个性化弹窗。 二、状态管理装饰器 1. @state：组件内私有状态，值变化触发组件重新渲染。 2. @prop：单向同步父组件状态，父组件值变化子组件更新，子组件修改不反向影响父组件。 3. @link：双向同步父组件状态，父子组件状态互相同步。 4. @provide/@consume：跨多层组件的状态共享，无需逐层传递，通过相同 key 关联。 5. @observed/@objectlink：针对自定义对象的深度状态监听，对象属性变化触发渲染。 6. @watch：监听状态变量变化，触发指定回调函数，用于状态变更后的逻辑处理。 三、并发/线程相关装饰器 1. @concurrent：标记函数可在 taskpool 中并发执行，是 taskpool 使用的核心标记。 2. @workerthread：标记函数需在 worker 线程执行，约束线程执行范围。 四、其他核心装饰器 1. @preview：预览自定义组件，无需运行应用即可在 ide 中查看 ui 效果。 2. @entryability：标记应用入口 ability，关联应用全局生命周期。 3. @require：声明组件属性为必传项，增强组件使用的健壮性。 @observed 装饰器和 @objectlink 装饰器的作用 @state、@prop、@link、@provide 和 @consume 装饰器仅能观察到第一层的变化，但是在实际应用开发中，应用会根据开发需要，封装自己的数据模型。对于多层嵌套的情况，比如二维数组、对象数组、嵌套类场景，无法观察到第二层的属性变化。因此，为了实现对嵌套数据结构中深层属性变化的观察，引入了 @observed 和 @objectlink 装饰器。 @objectlink 和 @observed 类装饰器配合使用，可实现嵌套对象或数组的双向数据同步，使用方式如下： 将数组项或类属性声明为 @observed 装饰的类型。 在子组件中使用 @objectlink 装饰的状态变量，用于接收父组件 @observed 装饰的类实例，从而建立双向数据绑定。 api version 19 之前，@objectlink 只能接收 @observed 装饰的类实例；api version 19 及以后，@objectlink 也可以接收复杂类型，无 @observed 装饰的限制。但需注意，如需观察嵌套类型场景，需要其接收 @observed 装饰的类实例或 makev1observed 的返回值。示例请参考二维数组。 @watch 装饰器的作用 @watch 应用于对状态变量的监听。如果开发者需要关注某个状态变量的值是否改变，可以使用 @watch 为状态变量设置回调函数。@watch 提供了状态变量的监听能力，@watch 仅能监听到可以观察到的变化。 如何避免 @watch 的循环 循环可能是因为在 @watch 的回调方法里直接或者间接地修改了同一个状态变量引起的。为了避免循环的产生，建议不要在 @watch 的回调方法里修改当前装饰的状态变量。 如何实现应用级的、或者多个页面的状态数据共享 localstorage ：页面级 ui 状态存储，通常用于 uiability 内、页面间的状态共享。 appstorage ：特殊的单例 localstorage 对象，由 ui 框架在应用程序启动时创建，为应用程序 ui 状态属性提供中央存储。 persistentstorage ：持久化存储 ui 状态，通常和 appstorage 配合使用，选择 appstorage 存储的数据写入磁盘，以确保这些属性在应用程序重新启动时的值与应用程序关闭时的值相同。 environment ：应用程序运行的设备的环境参数，环境参数会同步到 appstorage 中，可以和 appstorage 搭配使用。 状态管理（v2）提供了哪些能力 管理组件拥有的状态 @local 装饰器：组件内部状态 @param：组件外部输入 @once：初始化同步一次 @event 装饰器：规范组件输出 @provider 装饰器和 @consumer 装饰器：跨组件层级双向同步 管理数据对象的状态 @observedv2 装饰器和 @trace 装饰器：类属性变化观测 @monitor 装饰器：状态变量修改监听 @computed 装饰器：计算属性 @type 装饰器：标记类属性的类型 管理应用拥有的状态 appstoragev2：应用全局 ui 状态存储 persistencev2：持久化存储 ui 状态 @monitor 与 @watch 对比 @watch 仅能在 @component 装饰的组件中监听单个状态变量，无法获取变化前值；@watch 是同步监听的。 @monitor 可在 @componentv2 或 @observedv2 装饰的类中同时监听多个状态变量或 @trace 装饰的属性，并能获取变化前值，监听能力也更深层。@monitor 是异步监听的。 lazyforeach 和 repeat 对比 repeat 是 arkui 在 api version 12 中新引入的循环渲染组件，相比 lazyforeach 具有更简洁的 api、更丰富的功能以及更强的性能优化能力。 repeat 直接监听状态变量的变化，而 lazyforeach 需要开发者实现 idatasource 接口，手动管理子组件内容/索引的修改。 repeat 还增强了节点复用能力，提高了长列表滑动和数据更新的渲染性能。 repeat 增加了渲染模板（template）的能力，在同一个数组中，根据开发者自定义的模板类型（template type）渲染不同的子组件。 如何解决 lazyforeach 数据源变更后界面闪烁的问题 1. 确保 key 值唯一且稳定 lazyforeach 的第三个参数 keygenerator 是组件复用的唯一依据，key 不稳定会直接导致组件销毁重建： 禁止用数组索引（index）作为 key ：数据源增删时索引会整体变化，所有后续组件的 key 失效，触发全量重建。 必须用数据源项的唯一标识 （如 id、uuid、业务唯一字段）作为 key：仅变更项的 key 变化，其余组件可正常复用。 核心要点：key 值需与数据项强绑定，且在生命周期内不重复、不随意变更。 2. 精准更新数据源（避免全量替换触发重渲染） 直接替换整个数据源数组（如 this.list = newlist）会触发 lazyforeach 全量重渲染，需改为\"局部精准更新\"： 增删数据项 ：使用数组的 splice/push/pop/unshift（仅尾部操作）等方法，而非重新赋值数组（如 this.list.splice(1, 1, newitem) 仅更新指定项）。 修改数据项属性 ：直接修改数组中指定项的属性（配合 @observed/@objectlink 实现对象深度监听），而非替换整个项（如 this.list[0].name = '新名称'，而非 this.list[0] = newitem）。 禁止\"清空后重新赋值\" ：避免 this.list = []; this.list = newlist 这类操作，会触发两次全量渲染。 3. 优化子组件渲染逻辑（减少无效重渲染） 子组件的非必要重渲染会加剧闪烁，需通过\"按需渲染\"优化： 子组件添加 @memo 装饰：仅当入参（props）变化时才重渲染，避免父组件刷新时子组件无脑重建。 避免在 build 方法中创建新对象/函数：每次 build 都会生成新引用（如 build() { const obj = {a:1}; return child({data: obj}) }），触发子组件重渲染，需将对象/函数抽离到组件外部或状态变量中。 耗时操作异步化：图片加载、数据计算等逻辑放在 abouttoappear 中，而非 build 方法，避免阻塞渲染导致的视觉闪烁。 4. 控制数据更新时机（应对高频变更场景） 高频数据源变更（如实时刷新、搜索联想）会触发多次渲染，需\"降频\"处理： 防抖/节流 ：对高频更新的数据源做防抖（如延迟 50ms 再更新），合并多次小更新为一次大更新，减少渲染次数。 批量更新 ：将多次数据变更合并为一次操作（如先收集变更项，再统一调用 splice），避免频繁触发 lazyforeach 渲染。 兄弟组件如何通信 1. 公共父组件传递 2. 全局状态管理（appstorage 或 localstorage） 3. 本地文件读写 六、导航与路由 路由模式（router） router 模块提供了两种跳转模式，分别是 pushurl 和 replaceurl。这两种模式决定了目标页面是否会替换当前页： pushurl ：目标页面不会替换当前页，而是压入页面栈。这样可以保留当前页的状态，并且可以通过返回键或者调用 back 方法返回到当前页。 replaceurl ：目标页面会替换当前页，并销毁当前页。这样可以释放当前页的资源，并且无法返回到当前页。 router 模块提供了两种实例模式，分别是 standard 和 single。这两种模式决定了目标 url 是否会对应多个实例： standard（多实例模式） ：也是默认情况下的跳转模式。目标页面会被添加到页面栈顶，无论栈中是否存在相同 url 的页面。 single（单实例模式） ：如果目标页面的 url 已经存在于页面栈中，则会将离栈顶最近的同 url 页面移动到栈顶，该页面成为新建页。如果目标页面的 url 在页面栈中不存在同 url 页面，则按照默认的多实例模式进行跳转。 navigation 组件与 router 跳转的区别 组件导航（navigation）主要用于实现 navigation 页面（navdestination）间的跳转，支持在不同 navigation 页面间传递参数，提供灵活的跳转栈操作，从而更便捷地实现对不同页面的访问和复用。 navigation 是路由导航的根视图容器，一般作为页面（@entry）的根容器，包括单栏（stack）、分栏（split）和自适应（auto）三种显示模式。navigation 组件适用于模块内和跨模块的路由切换，通过组件级路由能力实现更加自然流畅的转场体验，并提供多种标题栏样式来呈现更好的标题和内容联动效果。一次开发，多端部署场景下，navigation 组件能够自动适配窗口显示大小，在窗口较大的场景下自动切换分栏展示效果。 navigation 组件主要包含导航页和子页。导航页由标题栏（包含菜单栏）、内容区和工具栏组成，可以通过 hidenavbar 属性进行隐藏，导航页不存在路由栈中，与子页以及子页之间可以通过路由操作进行切换。 navigation 路由相关的操作都是基于导航控制器 navpathstack 提供的方法进行，每个 navigation 都需要创建并传入一个 navpathstack 对象，用于管理页面。主要涉及页面跳转、页面返回、页面替换、页面删除、参数获取、路由拦截等功能。 因此，组件导航（navigation）支持更丰富的动效、一次开发多端部署能力和更灵活的栈操作。而 router 模块仅是通过不同的 url 地址，可以方便地进行页面路由，访问不同的页面。 navigation 组件显示模式 navigation 组件通过 mode 属性设置页面的显示模式： 自适应模式 ：navigation 组件默认为自适应模式，此时 mode 属性为 navigationmode.auto。自适应模式下，当页面宽度大于等于一定阈值（api version 9 及以前：520vp，api version 10 及以后：600vp）时，navigation 组件采用分栏模式，反之采用单栏模式。 单栏模式 ：将 mode 属性设置为 navigationmode.stack 开启单栏模式。适用于窄屏设备，发生路由跳转时，整个页面都会被替换。 分栏模式 ：将 mode 属性设置为 navigationmode.split 开启分栏模式。适用于宽屏设备，分为左右两部分，发生路由跳转时，只有右边子页会被替换。 navigation 组件的组成部分 标题栏（左上）、菜单栏（右上）、内容区（中心）和工具栏（底部）。 标题栏模式 navigation 组件通过 titlemode 属性设置标题栏模式： mini 模式 ：普通标题栏，用于一级页面不需要突出标题的场景。 full 模式 ：强调型标题栏，用于一级页面需要突出标题的场景。 菜单栏参数类型 menus 支持 array<navigationmenuitem 和 custombuilder 两种参数类型。使用 array<navigationmenuitem 类型时，竖屏最多支持显示 3 个图标，横屏最多支持显示 5 个图标，多余的图标会被放入自动生成的更多图标。 navigation 路由操作（navpathstack） 页面跳转 pushpath pushpathbyname pushdestination pushdestinationbyname 页面返回 pop poptoname poptoindex clear 页面替换 replacepath replacepathbyname replacedestination 页面删除 removebyname removebyindex removebydestinationid 移动页面到栈顶 movetotop moveindextotop navdestination 子页面模式 标准类型 ：navdestination 组件默认为标准类型，此时 mode 属性为 navdestinationmode.standard。标准类型的 navdestination 的生命周期跟随其在 navpathstack 路由栈中的位置变化而改变。 弹窗类型 ：navdestination 设置 mode 为 navdestinationmode.dialog 弹窗类型，此时整个 navdestination 默认透明显示。弹窗类型的 navdestination 显示和消失时不会影响下层标准类型的 navdestination 的显示和生命周期，两者可以同时显示。 跨包路由的实现方式 系统路由表 系统路由表相对自定义路由表，使用更简单，只需要添加对应页面跳转配置项，即可实现页面跳转。跳转前无需 import 页面文件，页面按需动态加载。可扩展性一般，易用性更强，系统自动维护路由表。 在 resources/base/profile 中创建 route map.json 并配置，再在 module.json5 配置文件的 module 标签中定义 routermap 字段，指向定义的路由表配置文件，即可使用系统路由表。 自定义路由表 自定义路由表使用起来更复杂，但是可以根据应用业务进行定制处理。跳转前需要 import 页面文件。可扩展性更强，易用性一般，需要开发者自行维护路由表。 调用 @builder 修饰的 pagemap 即可使用自定义路由表。 七、项目结构与模块 hap、hsp、har 的区别 hap（harmonyos ability package）—— 应用运行的\"最终载体\" hap（harmony ability package）是应用安装和运行的基本单元。hap 包是由代码、资源、第三方库、配置文件等打包生成的模块包，其主要分为两种类型：entry 和 feature。 entry ：应用的主模块，作为应用的入口，提供了应用的基础功能。 feature ：应用的动态特性模块，作为应用能力的扩展，可以根据用户的需求和设备类型进行选择性安装。 应用程序包可以只包含一个基础的 entry 包，也可以包含一个基础的 entry 包和多个功能性的 feature 包。 单 hap 场景 ：如果只包含 uiability 组件，无需使用 extensionability 组件，优先采用单 hap（即一个 entry 包）来实现应用开发。虽然一个 hap 中可以包含一个或多个 uiability 组件，为了避免不必要的资源加载，推荐采用\"一个 uiability + 多个页面\"的方式。 多 hap 场景 ：如果应用的功能比较复杂，需要使用 extensionability 组件，可以采用多 hap（即一个 entry 包 + 多个 feature 包）来实现应用开发，每个 hap 中包含一个 uiability 组件或者一个 extensionability 组件。在这种场景下，多个 hap 引用相同的库文件，可能导致重复打包的问题。 hsp（harmonyos shared package）—— 运行时的\"共享模块\" hsp（harmony shared package）是动态共享包，包含代码、c++ 库、资源和配置文件，通过 hsp 可以实现代码和资源的共享。hsp 不支持独立发布上架，而是跟随宿主应用的 app 包一起发布，与宿主应用同进程，具有相同的包名和生命周期。 har（harmonyos archive）—— 编译时的\"静态工具包\" har（harmony archive）是静态共享包，可以包含代码、c++ 库、资源和配置文件。通过 har 可以实现多个模块或多个工程共享 arkui 组件、资源等相关代码。 支持应用内共享，也可以作为二方库（sdk）、三方库（sdk）发布后供其他应用使用。 作为二方库（sdk），发布到 ohpm 私仓，供公司内部其他应用使用。 作为三方库（sdk），发布到 ohpm 中心仓，供其他应用使用。 鸿蒙应用的配置文件 app.json5 ：应用级全局配置文件，定义应用包名（bundlename，推荐反域名方式）、版本、图标、名称、支持设备类型等全局基础信息，配置全局网络策略与权限，关联主模块配置。 module.json5 ：模块级核心配置文件，声明模块类型、应用入口 uiability、页面路由规则，配置模块所需权限、组件启动条件，是模块功能的核心定义文件。 resources 下的资源配置文件 ：统一管理字符串、颜色、尺寸、图片等资源，支撑应用多语言、多设备适配，规范资源引用与映射。 element.json：管理字符串、颜色、尺寸、布尔值等基础元素类资源，定义资源名称与对应值的映射关系，是实现多语言、多尺寸适配的核心配置文件。 media.json：负责管理图片、音频、视频等媒体类资源，建立资源名称与实际媒体文件的关联映射，规范媒体资源的统一引用方式。 profile.json：主要管理布局、动画等配置类资源，定义布局样式、动画效果等相关配置规则，支撑 ui 布局与动效的标准化管理。 oh package.json5 ：项目依赖管理配置文件，管理第三方依赖包、开发依赖与项目脚本，控制依赖版本与项目依赖关系。 hvigorfile.ts ：项目构建配置文件，配置鸿蒙应用编译、打包规则，自定义构建流程、打包类型与编译模式。 tsconfig.json 与 .eslintrc.js ：分别为 arkts 编译配置和代码规范配置，定义代码编译规则、类型检查标准与代码校验规范，保障代码质量。 ohpm 和 npm 的区别 核心差异 ：npm 是通用型包管理工具（面向 web/node.js），ohpm 是鸿蒙专属工具（适配鸿蒙技术栈与工程结构）。 关键价值 ：ohpm 解决了 npm 包无法直接在鸿蒙应用中使用的问题，提供鸿蒙生态的包校验与多设备适配。 使用场景 ：开发鸿蒙应用优先用 ohpm，通用前端/node.js 项目用 npm。 如何在 build profile.json5 中定义 phone、wearable、car 三个 product 基础配置结构 在 build profile.json5 的 app 节点下新增 products 数组，数组内分别定义 phone、wearable、car 三个 product 对象，每个对象包含 name（产品名称）、devicetype（设备类型）、modules（模块配置）核心字段。 确保 devicetype 与鸿蒙设备类型规范一致：phone 对应 phone，wearable 对应 wearable，car 对应 car，系统会根据该字段适配编译规则。 各 product 核心配置项 name：命名需唯一且语义化，如 phone product、wearable product、car product。 devicetype：明确指定设备类型，phone 设为 [\"phone\"]，wearable 设为 [\"wearable\"]，car 设为 [\"car\"]（数组格式支持多设备兼容）。 modules：配置对应模块的编译参数，核心包含 name（模块名，如 entry）、srcpath（模块路径，如 \"./entry\"）、target（编译目标，设为 ohos），可按需添加 compilesdkversion（编译 sdk 版本）、runtimeos（运行时系统）等参数。 差异化配置（可选） 针对不同设备的特性，在对应 product 的 modules 中添加差异化参数，如 wearable 设置更小的 minapiversion（适配手表低版本系统），car 设置 orientation（横屏）等布局参数。 若需区分资源编译，可在 modules 中配置 resourceprofile，指定不同设备的资源目录（如 phone 用 phone 目录、wearable 用 wearable 目录）。 应用文件加密分区 el1 ：对于私有文件，如闹铃、壁纸等，应用可以将这些文件放到设备级加密分区（el1）中，以保证在用户输入密码前就可以被访问。 el2 ：对于更敏感的文件，如个人隐私信息等，应用可以将这些文件放到更高级别的加密分区（el2）中，以保证更高的安全性。 el3 ：对于应用中的记录步数、文件下载、音乐播放，需要在锁屏时读写和创建新文件，放在（el3）的加密分区比较合适。 el4 ：对于用户安全信息相关的文件，锁屏时不需要读写文件、也不能创建文件，放在（el4）的加密分区更合适。 el5 ：对于用户隐私敏感数据文件，锁屏后默认不可读写，如果锁屏后需要读写文件，则锁屏前可以调用 acquireaccess 接口申请继续读写文件，或者锁屏后也需要创建新文件且可读写，放在（el5）的应用级加密分区更合适。 八、权限管理 鸿蒙权限分级机制 核心分级框架 鸿蒙权限分级以风险等级和用户隐私/系统安全影响程度为核心依据，采用\"权限自身等级 + 应用 apl 等级 + 授权方式\"三维管控体系，权限自身分为 normal、system basic、system core 三级，应用 apl 等级与权限等级严格匹配，授权方式分为系统授权（system grant）和用户授权（user grant），核心遵循\"最小权限\"与\"用户知情同意\"原则。 具体分级与规则 normal 级权限 为普通权限，风险极低，不涉及敏感隐私，采用系统授权，应用安装时自动授予，普通应用可自由申请，典型如网络访问、获取网络状态。 system basic 级权限 为基础系统权限，风险中等，涉及基础系统服务或有限隐私，部分为系统授权，部分需用户动态授权，普通应用仅可申请特定项，典型如用户身份认证、管理域账号。 system core 级权限 为核心系统权限，风险极高，涉及操作系统核心能力，仅系统应用可申请，采用严格审批与系统授权，普通应用禁止配置，典型如修改系统核心设置、安装应用。 核心机制 敏感权限（如分布式数据同步、相机、位置）均属于需用户授权的权限，无论静态声明与否，必须运行时动态申请，静态声明仅为前置注册条件。 应用 apl 等级决定权限申请范围，普通应用默认 normal 级，无法申请 system core 级权限，system basic 级权限需符合特定场景并经审核。 鸿蒙 next 进一步优化分级，新增 ai 敏感权限等分类，强化高敏感权限管控，要求应用上架前完成权限合规性检查。 敏感权限列表 个人数据访问类 ohos.permission.read contacts（读取联系人） write contacts（写入联系人） read calendar（读取日历） write calendar（写入日历） read health data（读取健康数据） read imagevideo（读取图片视频） write imagevideo（写入图片视频） 设备功能使用类 ohos.permission.camera（相机） microphone（麦克风） location（位置） location in background（后台位置） 通信与网络类 ohos.permission.read sms（读取短信） send sms（发送短信） call phone（拨打电话） read phone state（读取电话状态） 分布式能力类 ohos.permission.distributed datasync（分布式数据同步） discover（设备发现） distributed device manage（分布式设备管理） 在 module.json5 中声明权限后为何仍需动态授权 在 module.json5 中同时声明 ohos.permission.distributed datasync 与 discover 权限时，仍需动态授权的原因： 鸿蒙权限分级机制 ：ohos.permission.distributed datasync（分布式数据同步）与 discover（设备发现）均属于敏感/危险权限等级，该等级权限要求仅静态声明无法生效，必须通过动态授权让用户明确知晓并确认授予，静态声明仅为权限申请的前置条件。 静态声明的作用边界 ：module.json5 中声明权限仅用于告知系统应用需使用该权限，完成安装时的权限注册，并不会让应用实际获得权限使用能力，动态授权是运行时获取权限使用权限的必要环节。 隐私与安全规范要求 ：这类权限涉及设备互联、数据跨设备同步，直接关联用户隐私和设备安全，鸿蒙系统强制要求运行时动态授权，确保用户可自主决定是否授予，避免应用在用户不知情的情况下获取敏感权限。 九、跨设备开发 鸿蒙如何实现一次开发多端部署 整体架构 底层 ：通过\"分布式软总线 + 多内核适配\"，让不同设备的系统能力互通，应用无需关注设备底层差异。 中层 ：通过\"统一的应用框架（stage 模型）+ 方舟编译器\"，屏蔽不同设备的运行环境差异。 上层 ：通过\"设备形态配置 + 自适应 ui + 动态布局\"，让一套 ui 适配不同屏幕尺寸、交互方式（触屏/语音/按键）。 1. 统一的开发语言与框架（基础前提） 核心语言 ：arkts（鸿蒙主推），基于 typescript 扩展，内置\"跨设备适配语法\"，无需为不同设备编写差异化语言代码。 统一框架 ：stage 模型（推荐）作为应用核心框架，将应用拆分为\"ability/page/component\"三层，层与层之间解耦，组件可跨设备复用。 2. 设备形态配置（核心适配手段） 鸿蒙通过\"配置文件 + 条件编译\"，让一套代码根据设备类型加载差异化配置： 设备配置文件 ：在 main pages.json/module.json5 中声明设备类型（phone/tablet/watch/car），指定不同设备的入口页面、窗口尺寸、权限。 条件编译（@ohos:systemcapability） ：在代码中通过系统能力判断设备类型，执行差异化逻辑（如手表隐藏复杂图表、车机放大字体）；示例逻辑：if (devicetype === 'watch') { 渲染极简ui } else { 渲染完整ui }。 资源分级适配 ：在 resources 目录下按设备类型（phone/tablet/watch）、屏幕尺寸、分辨率存放差异化资源（图片、字体、布局参数），系统自动加载适配资源。 3. 自适应 ui 组件与布局（视觉适配核心） 鸿蒙提供\"自适应能力\"的原生组件和布局方式，无需为不同设备单独写布局： 弹性布局（flex/grid） ：替代固定尺寸布局，组件根据屏幕尺寸自动伸缩（如 grid 布局在手机端显示 2 列、平板端显示 4 列）。 响应式组件 ：鸿蒙原生组件（text/image/list 等）内置自适应能力，如 text 自动换行、image 根据容器尺寸缩放，支持 matchparent/wrapcontent/百分比尺寸。 媒体查询（mediaquery） ：监听屏幕尺寸、方向变化，动态调整 ui 布局（如横屏时切换为左右布局，竖屏时切换为上下布局）。 lazyforeach 高性能渲染 ：统一的列表渲染组件，自动适配不同设备的滚动性能（如手表端自动减少渲染项数）。 4. 元能力与分布式部署（跨设备运行核心） 鸿蒙将应用拆分为\"元能力（ability）\"，支持跨设备按需部署： 元能力拆分 ：将应用的核心功能（如视频播放、数据计算）拆分为独立元能力，不同设备可加载不同元能力（如手表仅加载\"控制元能力\"，手机加载\"播放元能力\"）。 分布式任务调度 ：系统自动将元能力分发到适配的设备运行（如将耗时计算任务分发到平板/车机，手机仅负责交互）。 原子化服务 ：无需安装，元能力可作为原子化服务跨设备免安装运行（如手表端直接调用手机端的支付元能力）。 5. 开发工具链支持（落地保障） deveco studio 提供一站式多端适配工具，降低开发成本： 设备预览器 ：在 ide 中直接切换手机/平板/手表等设备形态，实时预览 ui 适配效果。 适配校验工具 ：自动检测代码中不兼容不同设备的语法/组件，提示适配建议。 一键打包 ：一套代码可打包为适配不同设备的安装包，无需单独编译。 鸿蒙分布式能力的关键技术原理 分布式软总线（核心通信底座） 本质是统一的分布式通信框架，屏蔽 wi fi、p2p、蓝牙等物理链路差异。 原理 ：设备发现、连接、传输全自动化，提供高带宽、低时延、高稳定的虚拟总线。 作用 ：让设备之间像在同一台机器内通信一样简单，应用无需关心底层网络。 分布式设备虚拟化（硬件能力共享） 把跨设备的摄像头、麦克风、屏幕、传感器等抽象成统一虚拟外设。 原理 ：通过统一驱动抽象层，实现硬件能力的发现、调用、映射、反控。 作用 ：a 设备可以直接使用 b 设备的硬件，实现多设备能力融合。 分布式数据管理（数据跨设备一致） 提供跨设备统一数据视图，应用只操作一份数据。 原理 ：基于分布式软总线，实现数据的自动同步、冲突解决、可靠性保障。 作用 ：多设备间数据无缝互通，不用手动同步、不用写复杂网络逻辑。 分布式任务调度（应用跨端流转） 实现应用/组件在多设备间的启动、迁移、协同。 原理 ：基于元能力（ability）拆分，系统根据设备能力、算力、场景动态调度。 作用 ：支持页面接续、任务迁移、分布式协作，实现\"应用在超级终端里流动\"。 十、线程通信与并发 taskpool 和 worker taskpool 和 worker 均支持多线程并发能力。taskpool 的工作线程会绑定系统的调度优先级，并支持负载均衡（自动扩缩容），相比之下，worker 需要开发者自行创建和销毁，存在一定的创建和管理成本。因此，在大多数场景下，推荐优先使用 taskpool。 worker 适用于需要长时间占据线程，并由开发者主动管理线程生命周期的场景。 taskpool 适用于执行相对独立任务的场景，任务在线程中执行时无需关注线程生命周期。 建议使用 worker 的场景 以下场景中，任务通常需要长时间运行或依赖线程上下文，适合使用 worker： 运行时间超过 3 分钟的任务 （此处所说的 3 分钟不包括 promise 和 async/await 异步调用的耗时，如网络下载、文件读写等 i/o 任务的耗时）：例如后台进行 1 小时的预测算法训练等 cpu 密集型任务，适合使用 worker。 有强关联的一系列同步任务 ：例如在需要创建并使用句柄的场景中，每次创建的句柄都不同，且必须持续保存该句柄，以确保后续操作正确执行，此类场景适合使用 worker。 建议使用 taskpool 的场景 以下场景中，任务通常相对独立，对调度、取消或管理能力有更高要求，适合使用 taskpool： 需要设置任务优先级的任务 ：在 api version 18 之前，worker 不支持设置调度优先级，需要使用 taskpool；从 api version 18 开始，worker 支持设置调度优先级，开发者可以根据使用场景和任务特性选择使用 taskpool 或 worker。例如图像直方图绘制场景，后台计算的直方图数据会用于前台界面的显示，影响用户体验，且任务相对独立，推荐使用 taskpool。 需要频繁取消的任务 ：如图库大图浏览场景。为提升体验，系统会同时缓存当前图片左右各两张图片。当往一侧滑动跳到下一张图片时，需取消另一侧的缓存任务，此时适合使用 taskpool。 大量或调度点分散的任务 ：例如大型应用中的多个模块包含多个耗时任务，不建议使用 worker 进行负载管理，推荐使用 taskpool。 鸿蒙线程间通信 线程间通信的原因 在多线程并发场景中，例如通过 taskpool 或 worker 创建后台线程，不同线程间需要进行数据交互。由于线程间内存隔离，线程间通信对象必须通过序列化实现值拷贝或内存共享。 线程间通信的限制 单次序列化传输的数据量大小限制为 16mb。 序列化不支持使用 @state 装饰器、@prop 装饰器、@link 装饰器等装饰器修饰的复杂类型。 arkts 支持的线程间通信对象（总结） 1. 可以直接通过拷贝传递除 symbol 之外的基础类型、date、string、regexp、array、map、set、object、arraybuffer、typedarray。其中 object 只能通过对象字面量（{}）或 new 创建，并无法传递原型和方法。 2. 对于大段连续的二进制内存数据，如图片、视频，可以传递 arraybuffer 对象。arraybuffer 对象包含 js 对象壳和 native 内存两部分。js 对象壳需要通过序列化和反序列化拷贝传递，而 native 内存区域则有两种传递方式：使用默认的拷贝方式，两个线程可以独立访问数据，需要重建 js 壳并拷贝 native 内存，因此效率低；而使用转移方式，只需要重建 js 壳，效率高，但原线程无法访问数据了。 3. 可以使用 sharedarraybuffer，也就是共享内存，但需要配置 atomics 类来设置异步锁控制并发，防止冲突。 4. 对于文件描述符、图形资源等可以使用 transferable 对象来转移对象的所有权给另一个线程。这种方式会使两个线程复用同一个 c++ 对象，而其 js 壳会放在 localheap 中。transferable 对象有两种转移模式：对于能确保线程安全的对象，例如 applicationcontext、windowcontext 等，使用共享模式，在新线程中重新创建 js 壳指向同一个 c++ 对象即可；而对于线程不安全的对象，例如 pixelmap 对象，则需要使用转移模式，移除原先的 js 壳对 c++ 对象的引用，在新线程中重新绑定新的 js 壳。 5. 最后，还有 sendable 对象。通过 @sendable 装饰器装饰，可以使类、属性、方法通过引用的方式在线程间传递。同样需要配置异步锁来防止数据竞争，或通过 freeze 来暂时冻结避免线程冲突。 普通对象（详细） 普通对象跨线程时通过拷贝（序列化，深拷贝）形式传递，两个线程的对象内容一致，但指向各自线程的隔离内存区间，被分配在各自线程的虚拟机本地堆（localheap）。 序列化支持类型包括：除 symbol 之外的基础类型、date、string、regexp、array、map、set、object（仅限简单对象，比如通过 {} 或者 new object 创建，普通对象仅支持传递属性，不支持传递其原型及方法）、arraybuffer、typedarray。 普通类实例对象跨线程通过拷贝形式传递，只能传递数据，类方法会丢失。使用 @sendable 装饰器标识为 sendable 类后，类实例对象跨线程传递后，可携带类方法。 arraybuffer 对象（详细） 用于二进制数据的高效传递，适用于大段连续内存数据（如图片、音频原始数据）。 arraybuffer 包含两部分：底层存储数据的 native 内存区域，以及封装操作的 js 对象壳。js 对象壳分配在虚拟机的本地堆（localheap）中。跨线程传递时，js 对象壳需要序列化和反序列化拷贝传递，而 native 内存区域可以通过拷贝或转移的方式传递。 native 内存有两种传输方式： 拷贝方式 （递归遍历）传输时，传输后两个线程可以独立访问 arraybuffer。此方式需要重建 js 壳和拷贝 native 内存，传输效率较低。 转移方式 传输时，传输后原线程将无法使用此 arraybuffer 对象。跨线程时只需重建 js 壳，native 内存无需拷贝，从而提高效率。 在 arkts 中，taskpool 传递 arraybuffer 数据时，默认采用转移方式。通过调用 settransferlist() 接口，可以指定部分数据的传递方式为转移方式，其他部分数据可以切换为拷贝方式。 sharedarraybuffer 对象（详细） 支持多线程共享内存，允许线程间直接访问同一块内存区域，提升数据传递效率。 sharedarraybuffer 内部包含一块 native 内存，其 js 对象壳被分配在虚拟机本地堆（localheap）。支持跨并发实例间共享 native 内存，但是对共享 native 内存的访问及修改需要采用 atomics 类，防止数据竞争。sharedarraybuffer 可用于多个并发实例间的状态或数据共享。 transferable 对象（详细） 支持跨线程转移对象所有权（如文件描述符、图形资源等），转移后原线程不再拥有访问权限。 transferable 对象，也称为 nativebinding 对象，是指绑定 c++ 对象的 js 对象，其主要功能由 c++ 提供，js 对象壳则分配在虚拟机的本地堆（localheap）中。跨线程传输时复用同一个 c++ 对象，相比 js 对象的拷贝模式，传输效率更高。因此，可共享或转移的 nativebinding 对象被称为 transferable 对象。 transferable 对象有两种通信模式： 共享模式 ：如果 c++ 实现能够确保线程安全性，则 nativebinding 对象的 c++ 部分支持跨线程共享。nativebinding 对象跨线程传输后，只需重新创建 js 壳即可桥接到同一个 c++ 对象上，实现 c++ 对象的共享。常见的共享模式 nativebinding 对象包括：应用上下文（applicationcontext）、窗口上下文（windowcontext）、组件上下文（abilitycontext 或 componentcontext）等 context 类型对象。这些上下文对象封装了应用程序组件的上下文信息，提供了访问系统服务和资源的能力，使得应用程序组件可以与系统进行交互。 转移模式 ：如果 c++ 实现包含数据且无法保证线程安全性，则 nativebinding 对象的 c++ 部分需要采用转移方式传输。nativebinding 对象跨线程传输后，重新创建 js 壳可桥接到 c++ 对象上，但需移除原 js 壳与 c++ 对象的绑定关系。常见的转移模式 nativebinding 对象包括 pixelmap 对象，它可以读取或写入图像数据，获取图像信息，常用于显示图片。 sendable 对象（详细） 符合 arkts 语言规范的可共享对象，需通过 @sendable 装饰器标记，并且满足 sendable 约束。 sendable 对象可共享，跨线程前后指向同一个 js 对象。如果 sendable 对象通过调用 napi 接口与一个 native 对象绑定，当共享传递 sendable 对象时，其绑定的 native 对象也会一并共享传递。 与其它 arkts 数据对象不同，符合 sendable 协议的数据对象在运行时应为类型固定的对象。 当多个并发实例尝试同时更新 sendable 数据时，会发生数据竞争，例如 arkts 共享容器的多线程操作。因此，arkts 提供异步锁机制来避免不同并发实例间的数据竞争，并提供了异步等待机制来控制多线程处理数据的时序。同时，还可以通过对象冻结接口将对象冻结为只读，从而避免数据竞争。 sendable 对象提供了并发实例间高效的通信能力，即引用传递，适用于开发者自定义大对象需要线程间通信的场景，例如子线程读取数据库数据并返回给宿主线程。 传递 arraybuffer 时，拷贝方式和转移方式有什么区别 arraybuffer 可以用来表示图片等资源，在应用开发中，处理图片（如调整亮度、饱和度、大小等）会比较耗时，为了避免长时间阻塞 ui 主线程，可以将图片传递到子线程中进行处理。采用转移方式传递 arraybuffer 可提高传输性能，但原线程将无法再访问该 arraybuffer 对象。如果两个线程都需要访问该对象，只能采用拷贝方式。反之，建议采用转移方式以提升性能。 atomics 类 定义 针对多线程场景设计的静态工具类，核心解决多线程并发修改共享数据时的竞态问题： \"原子操作\"指不可中断的操作：要么完全执行，要么完全不执行，中间不会被其他线程打断。 普通的变量操作（如 count++）本质是\"读取→修改→写入\"三步操作，多线程下可能被打断，导致数据不一致（比如两个线程同时 ++，最终结果少 1）。 atomics 类提供的所有方法都是原子操作，能保证共享数据修改的唯一性和一致性，无需额外加锁（如互斥锁），性能更优。 常见方法 基础读写与增减操作： load：原子化读取共享数组指定索引的值，确保读取过程不被中断。 store：原子化向共享数组指定索引写入值，保证写入操作完整执行。 add：原子化给共享数组指定索引的值累加指定数值，返回操作前原值。 sub：原子化给共享数组指定索引的值减去指定数值，返回操作前原值。 比较并交换操作： compareexchange：核心无锁操作，原子化校验共享数组指定索引值是否等于预期值，相等则替换为新值，不等则不修改，无论是否替换均返回操作前原值，可实现无锁并发逻辑。 线程同步操作： wait：使当前线程进入等待状态，仅当共享数组指定索引值等于目标值时才触发等待，支持设置超时时间避免无限等待。 notify：唤醒在共享数组指定索引上等待的线程，可指定唤醒的线程数量。 其他实用操作： exchange：原子化替换共享数组指定索引的值为目标值，返回操作前原值（无条件替换，区别于比较并交换的条件替换）。 islockfree：判断指定大小的数值类型是否支持无锁原子操作，辅助优化并发性能。 常见使用场景 多线程共享计数器 ：主线程与 worker 线程、多个 worker 线程并发修改计数类数据时，通过原子化增减操作避免计数遗漏、重复等数据不一致问题，保证计数结果准确。 无锁并发逻辑实现 ：借助 compareexchange 方法实现自旋锁等无锁并发逻辑，减少传统加锁带来的线程阻塞开销，提升并发场景下的性能。 多线程执行顺序协调 ：利用 wait 和 notify 方法协调不同线程的执行顺序，例如让线程等待共享数据更新后再执行，避免轮询共享数据造成的资源消耗。 共享内存数据安全操作 ：配合 sharedarraybuffer 共享内存使用，保障不同线程对共享内存中数值型数据读写、修改操作的原子性，解决多线程竞态问题。 @sendable 详解 支持的数据类型 arkts 基本数据类型：boolean、number、string、bigint、null、undefined。 arkts 数据类型：const enum（常量枚举）。 arkts 语言标准库中定义的容器类型数据（须显式引入 @arkts.collections）。 arkts 语言标准库中定义的异步锁（asynclock）对象（须显式引入 @arkts.utils）。 arkts 语言标准库中定义的异步等待对象（须显式引入 @arkts.utils）。 arkts 语言标准库中定义的 sendablelrucache 对象（须显式引入 @arkts.utils）。 继承了 isendable 的 interface。 标注了 @sendable 装饰器的 class。 标注了 @sendable 装饰器的 function。 接入 sendable 的系统对象： 共享用户首选项 可共享的色彩管理 基于 sendable 对象的图片处理 资源管理 sendablecontext 对象管理 元素均为 sendable 类型的 union type 数据。 开发者自定义的 native sendable 对象。 实现原理（sharedheap 与 localheap 的区别） 为了实现 sendable 数据在不同并发实例间的引用传递，sendable 共享对象分配在共享堆中，实现跨并发实例的内存共享。 共享堆（sharedheap） 是进程级别的堆空间，与虚拟机本地堆（localheap）不同，localheap 仅限单个并发实例访问，而 sharedheap 可被所有线程访问。 sendable 对象的跨线程行为为引用传递，因此，一个 sendable 对象可能被多个并发实例引用。判断该 sendable 对象是否存活，取决于所有并发实例是否存在对此 sendable 对象的引用。 各个并发实例的 localheap 是隔离的。sharedheap 是进程级别的堆，可以被所有并发实例共享，但 sharedheap 不能引用 localheap 中的对象。 使用约束 1. 继承约束 ：sendable 类仅能继承自 sendable 类；非 sendable 类仅能继承自非 sendable 类，二者禁止互相继承，且 sendable 类不能继承自变量。 2. 接口实现约束 ：非 sendable 类禁止实现任何继承自 sendable 接口的接口。 3. 类/接口成员变量约束 ：成员变量必须为 sendable 支持的数据类型；不支持使用 ! 断言修饰成员变量；不支持使用计算属性名定义成员变量。 4. 泛型使用约束 ：泛型类中的 sendable 类、sendablelrucache 及 collections 下的 array、map、set，其模板类型必须为 sendable 类型。 5. 上下文访问约束 ：sendable 类内部禁止使用当前模块内上下文环境定义的变量。 6. 装饰器使用约束 ：@sendable 装饰器仅支持修饰类和函数；sendable 类和 sendable 函数禁止搭配 @sendable 以外的其他装饰器；支持在 sendable class 上叠加自定义装饰器（通过在工程级 build profile.json5 文件的 buildoption 字段下的 strictmode 中增加 disablesendablecheckrules 字段，配置该能力）。 7. 初始化约束 ：禁止使用对象字面量或数组字面量初始化 sendable 对象，必须通过 sendable 类型的 new 表达式创建。 8. 类型转换约束 ：除 object 类型外，禁止将非 sendable 类型强制转换为 sendable 类型；sendable 类型可在不违反规则的前提下强转为非 sendable 类型。 9. 函数使用约束 ：箭头函数不支持标记 @sendable 装饰器，属于非 sendable 函数且不支持共享。 10. 与 ts/js 交互约束 ：sendable 对象传入 ts/js 接口、设置到 ts/js 对象或放入 ts/js 容器后，禁止对其对象布局进行增删属性、改变属性类型的操作，sendable 类对象类型间的改变除外。 11. 与 napi 交互约束 ：禁止对 sendable 对象执行删除、新增属性及修改属性类型的操作；不支持使用任何 symbol 相关的 napi 接口和类型。 12. 与 ui 交互约束 ：sendable 数据需要与 makeobserved 联用，才能实现对其数据变化的观察。 13. har 包使用约束 ：在 har 包中使用 sendable 时，需要启用编译生成 ts 文件的相关配置。 sendable 对象的序列化/反序列化 ason 工具与 js 提供的 json 工具类似，json 用于进行 js 对象的序列化（stringify）、反序列化（parse）。ason 则提供了 sendable 对象的序列化、反序列化能力。使用 ason.stringify 方法可将对象转换为字符串，使用 ason.parse 方法可将字符串转换为 sendable 对象，从而实现对象在并发任务间的高性能引用传递。 ason.stringify 方法还支持将 map 和 set 对象转换为字符串，可转换的 map 和 set 类型包括：map、set、collections.map、collections.set、hashmap、hashset。 @sendable 使用场景 sendable 对象在不同并发实例间默认采用引用传递，这种方式比序列化更高效，且不会丢失类成员方法。因此，sendable 能够解决两个关键场景的问题： 跨并发实例传输大数据 （例如达到 100kb 以上的数据）：由于跨并发实例序列化的开销随数据量线性增长，因此当传输数据量较大时（100kb 的数据传输耗时约为 1ms），跨并发实例的拷贝开销会影响应用性能。使用引用传递方式传输对象可提升性能。 跨并发实例传递带方法的 class 实例对象 ：在序列化传输实例对象时，会丢失方法。因此，若需调用实例方法，应使用引用传递。处理数据时，若需解析数据，可使用 ason 工具。 异步锁 为了解决多线程并发实例间的数据竞争问题，arkts 引入了异步锁能力。异步锁可能会被类对象持有，因此为了更方便地在并发实例间获取同一个异步锁对象，asynclock 对象支持跨线程引用传递。 由于 arkts 语言支持异步操作，阻塞锁容易产生死锁问题，因此在 arkts 中仅支持异步锁（非阻塞式锁）。同时，异步锁还可以用于保证单线程内的异步任务时序一致性，防止异步任务时序不确定导致的同步问题。 异步等待 arkts 引入了异步任务的等待和被唤醒能力，以解决多线程任务时序控制问题。通过 conditionvariable 对象控制异步任务的唤醒通知或超时等待，将继续执行。conditionvariable 对象支持跨线程引用传递。 共享容器 arkts 共享容器（@arkts.collections（arkts 容器集））是一种在并发实例间共享传输的容器类，用于并发场景下的高性能数据传递。 arkts 共享容器在多个并发实例间传递时，默认采用引用传递，允许多个并发实例操作同一容器实例。此外，还支持拷贝传递，即每个并发实例拥有独立的 arkts 容器实例。 arkts 共享容器不是线程安全的，内部使用了 fail fast（快速失败）机制，即当检测到多个并发实例同时对容器进行结构性修改时，会触发异常。因此，在多线程场景下修改容器内属性时，开发者需要使用 arkts 提供的异步锁机制保证 arkts 容器的安全访问。 arkts 共享容器包含如下几种：array、map、set、typedarray（int8array、uint8array、int16array、uint16array、int32array、uint32array、uint8clampedarray、float32array）、arraybuffer、bitvector、concatarray。 共享容器和原生容器的转换 原生容器 array → arkts array 容器：通过 collections.array.from 方法转换。 arkts array 容器 → 原生容器 array：通过原生容器 array 的 from 方法转换。 \"use shared\" 的作用（共享模块） 使用 \"use shared\" 这一指令来标记一个模块是否为共享模块，共享模块是进程内只会加载一次的模块。非共享模块在同一线程内只加载一次，而在不同线程中会多次加载，每个线程都会生成新的模块对象。因此，目前只能使用共享模块实现进程单例。 共享模块的使用约束 1. 指令书写约束 ：use shared 指令需写在 arkts 文件顶层，位置在 import 语句之后、其他所有语句之前，书写规则与 use strict 一致。 2. 文件类型约束 ：共享模块仅支持 ets 文件类型，不支持其他文件。 3. 共享属性特性 ：共享属性不具备传递性，引入共享模块的非共享模块，不会因此变为共享模块。 4. 导入约束 ：模块内禁止使用副作用导入（side effects import），该类导入因不涉及导出变量无法被加载，也不受支持。 5. 依赖加载规则 ：共享模块加载时，其导入的非共享模块不会立即加载；在共享模块内访问该非共享模块的导出变量时，当前线程会对其进行懒加载，且非共享模块在线程间相互隔离，不同线程访问会各自触发一次懒加载。 6. 导出对象约束 ：导出的所有变量必须为可共享对象，可共享对象需参考 sendable 支持的数据类型。 7. 导出方式约束 ：不允许直接导出模块，可通过指定对象名的方式导出模块中的对象合集。 8. 模块引用规则 ：共享模块可引用其他共享模块或非共享模块，引用与被引用的场景无任何限制。 9. 加载方式约束 ：仅支持静态加载、napi load module 或 napi load module with info 三种方式加载共享模块，使用其他方式会触发运行时报错。 线程间通信场景 使用 taskpool 执行独立的耗时任务 对于独立运行的耗时任务，任务完成后将结果返回给宿主线程。 使用 taskpool 执行多个耗时任务 如果宿主线程需要所有任务执行完毕的数据，可以通过 taskgroup 的方式实现。 taskpool 任务与宿主线程通信 场景：不仅需要返回最终执行结果，还需定时通知宿主线程状态和数据变化，或分段返回大量数据（如从数据库读取大量数据）。 步骤： 1. 实现接收 task 消息的方法 2. 在需要执行的 task 中，添加 senddata() 接口将消息发送给宿主线程 3. 在宿主线程通过 onreceivedata() 接口接收消息 worker 和宿主线程的即时消息通信 调用 postmessage 方法向 worker 线程发送消息，worker 线程将通过注册的 onmessage 回调处理宿主线程发送的消息。 worker 同步调用宿主线程的接口 通过 callglobalcallobjectmethod 接口实现。 多级 worker 间高性能消息通信 通过父 worker 创建子 worker 的机制形成层级线程关系。 由于 worker 线程生命周期由用户自行管理，因此需要注意多级 worker 生命周期的正确管理，建议开发者确保销毁父 worker 前先销毁所有子 worker。 高性能消息通信的关键在于 sendable 对象，结合 postmessagewithsharedsendable 接口，可以实现线程间高性能的对象传递。 进程间通信 进程间通信方式分为 ipc 和 rpc： ipc 是用于设备内进程间通信，使用 binder 驱动。 rpc 用于设备间跨进程通信，使用软总线驱动。 ipc 和 rpc 采用客户端 服务端（client server）模型。在使用时，client 进程可以获取 server 进程的代理（proxy），通过 proxy 读写数据和发起请求，stub 处理请求并应答结果，实现进程间通信。proxy 和 stub 提供了一组由服务/业务自定义的接口，proxy 实现每一个具体的请求方法，stub 实现对应的每一个具体请求的处理方法以及应答数据的内容。 步骤 1. 创建变量 want 和 connect 创建变量 want，指定要连接的 ability 所在应用的包名（bundlename）、组件名（abilityname）。在跨设备的场景下，还需要连接目标设备的 networkid（组网场景下对应设备的标识符，可以使用 distributeddevicemanager 获取目标设备的 networkid）。 创建变量 connect，指定连接成功、连接失败和断开连接时的回调函数。 2. 连接服务 stage 模型使用 common.uiabilitycontext 的 connectserviceextensionability 接口连接 ability。 3. 客户端发送信息给服务端 通过 onconnect 回调函数（上一步 connect 对象中设置的回调）获取服务端的代理对象 proxy。 使用该 proxy 对象调用 sendmessagerequest 方法发起请求。 当服务端处理请求并返回数据时，在 promise 中接收结果。 4. 服务端处理客户端请求 实现 serviceextension 类继承 serviceextensionability，使用单例模式，在 onconnect 方法中获取 stub 对象。 服务端实现 stub 对象，继承自 rpc.remoteobject，实现 onremotemessagerequest 方法，处理客户端的请求。 5. 断开连接 使用 common.uiabilitycontext 提供的 disconnectserviceextensionability 接口断开连接，传入 connectid（connectserviceextensionability 函数的返回值）。 案例：批量数据写数据库场景 参考链接：https://developer.huawei.com/consumer/cn/doc/harmonyos guides/batch database operations guide 十一、其他 设计一个鸿蒙应用的崩溃监控和恢复方案 崩溃全场景监控 监控类型 ：覆盖应用层崩溃（js/arkts 空指针、数组越界）、native 层崩溃（c/c++ 代码异常）、anr（主线程阻塞超 5s）、启动崩溃（应用初始化失败）、页面渲染崩溃。 监控手段 ：应用层通过注册 uncaughtexception 全局异常捕获器、监听 ability/page 的 onerror 生命周期捕获崩溃；native 层集成 breakpad 生成 minidump 文件解析堆栈；anr 通过 @ohos.resourceschedule 监听主线程阻塞状态。 上下文采集 ：崩溃时同步采集设备信息（型号/系统版本/api 版本）、应用信息（版本/包名）、用户操作路径、内存占用、网络状态，生成唯一 traceid 关联全量信息。 崩溃信息存储与上报 本地存储 ：崩溃数据（json 格式）和 native 崩溃文件本地持久化，按\"类型 + 时间戳\"命名，无网络时最多存储 10 条，超出按 fifo 清理。 上报策略 ：wifi 下崩溃恢复后实时上传全量信息，移动网络仅上传核心堆栈；离线记录网络恢复后批量加密（https）上传，采用指数退避重试（最多 3 次），失败则保留至下次启动。 数据脱敏 ：对用户 id、设备唯一标识等敏感信息脱敏，仅保留问题定位必要字段，符合隐私合规。 分级自动恢复策略 页面级恢复 ：页面崩溃触发 onerror 时，自动销毁当前页返回上一页或重启页面，核心页面提前备份操作状态（如表单内容），恢复后自动还原。 应用级恢复 ：应用整体崩溃通过 abilitystage 监听，自动重启入口 ability，还原崩溃前页面栈；连续启动崩溃（≥3 次）触发安全模式，禁用非核心功能仅加载基础页面。 anr 恢复 ：检测到 anr 后强制终止阻塞任务（如耗时计算/未超时请求），重启当前页面，记录阻塞线程栈用于分析。 崩溃问题定位与闭环 堆栈解析 ：服务端关联 mapping.txt 还原源码行号，自动归类崩溃类型（如空指针、oom、native 异常）。 智能告警 ：设置阈值（版本崩溃率 1% / 单次崩溃影响超 100 用户），触发钉钉/邮件告警，附带崩溃详情、设备分布。 可视化监控 ：搭建崩溃大盘，展示崩溃率、top 崩溃类型、版本/设备分布，跟踪修复进度；灰度发布验证修复效果，确认后全量上线。 前置防护（减少崩溃发生） 代码层 ：全局 try catch 兜底、空值/边界校验、异步任务（worker/taskpool）异常捕获，避免未处理异常导致崩溃。 资源层 ：监控内存占用，接近阈值时释放图片缓存、关闭无用页面，减少 oom 崩溃。 兼容性层 ：针对不同鸿蒙 api 版本/设备型号做适配，封装兼容层接口，避免系统接口差异引发崩溃。 用户体验优化 崩溃提示 ：恢复后轻量弹窗告知\"应用已自动恢复\"，避免用户恐慌。 重复崩溃防护 ：检测到同一用户触发相同崩溃，临时禁用对应功能，引导更新版本。 操作防丢 ：核心操作（支付/表单提交）崩溃后自动校验状态，避免重复提交或数据丢失。 鸿蒙如何后台保活 pc 端保活 harmonyos pc 上不允许后台私自运行程序，提出了托盘方案，可以让应用进程在 pc 后台持续保活运行。如持续开启后台服务、u 盾等场景可采用此方案实现。 手机端保活 应用退至后台后，在后台需要长时间运行用户可感知的任务，如播放音乐、导航等。为防止应用进程被挂起，导致对应功能异常，可以申请长时任务，使应用在后台长时间运行。在长时任务中，支持同时申请多种类型的任务，也可以对任务类型进行更新。应用退至后台执行业务时，系统会做一致性校验，确保应用在执行相应的长时任务。应用在申请长时任务成功后，通知栏会显示与长时任务相关联的消息，用户删除通知栏消息时，系统会自动停止长时任务。 鸿蒙键鼠连接监控 @ohos.multimodalinput.inputdevice 提供输入设备管理能力，包括监听输入设备的连接和断开状态，查询设备名称等输入设备信息。 常用方法： getdeviceinfo：获取指定输入设备（deviceid）的信息。 on：注册监听输入设备的热插拔事件，使用时需连接鼠标、键盘、触摸屏等外部设备。 off：取消监听输入设备的热插拔事件。在应用退出前调用，取消监听。 鸿蒙本地数据库（关系型数据库 rdb） 基于关系模型来管理数据的数据库，基于 sqlite 组件提供了完整的对本地数据库进行管理的机制（增、删、改、查）。 可以直接运行用户输入的 sql 语句来满足复杂的场景需要。 支持通过 resultset.getsendablerow 方法获取 sendable 数据，进行跨线程传递。 为保证插入并读取数据成功，建议一条数据不超过 2mb。如果数据超过 2mb，插入操作将成功，读取操作将失败。 大数据量场景下查询数据可能会导致耗时长甚至应用卡死，建议： 单次查询数据量不超过 5000 条。 在 taskpool 中查询。 拼接 sql 语句尽量简洁。 合理地分批次查询。 rdb 常用功能 rdbpredicates ：数据库中用来代表数据实体的性质、特征或者数据实体之间关系的词项，主要用来定义数据库的操作条件。用于条件评估、逻辑组合等操作，例如判断字段是否等于指定值。 rdbstore ：提供管理关系数据库（rdb）方法的接口。 resultset ：提供用户调用关系型数据库查询接口之后返回的结果集合。 transaction ：提供管理事务对象的接口。"
  },
  {
    "slug": "005-java",
    "title": "Java",
    "category": "其他语言",
    "sourcePath": "docs/其他语言/Java.md",
    "markdown": "# Java\n\n## 介绍下Java的Stream\n\n`Stream`是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列，并且支持并行执行。操作方式更简洁高效。\n\n`Stream`提供了一系列操作的方法，例如过滤、映射、排序等中间操作，收集、归约（累积计算）、遍历等终端操作。\n\n- `Stream`自己不会存储元素。\n- `Stream`不会改变源对象。相反，他们会返回一个持有结果的新`Stream`。\n- `Stream`操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。\n- `Stream`只能被\"消费\"一次，一旦遍历过就会失效。就像容器的迭代器那样，想要再次遍历必须重新生成一个新的`Stream`。\n\n## Stream的中间操作和终端操作有什么区别？\n\n中间操作返回一个新的`Stream`，不会立即执行实际的计算，而是在终端操作调用时才会触发整个操作链的执行，这种特性被称为延迟执行。例如`filter`、`map`等操作都是中间操作。\n\n终端操作会触发`Stream`的计算，返回一个最终结果或执行某种副作用（如`forEach`的打印操作），之后`Stream`就不能再被使用。例如`collect`、`reduce`、`forEach`等是终端操作。\n\n## 字符和字节的区别\n\n### 字节（Byte）\n\n- 字节是计算机中最基本的数据存储和传输单位，1 个字节 = 8 位（bit）二进制数据。\n- 字节是面向硬件的概念，文件存储、网络传输、内存分配等底层操作都以字节为单位。\n- 取值范围：无符号 0~255，有符号 -128~127。\n\n### 字符（Character）\n\n- 字符是人类可读的文字符号（如字母 `A`、汉字 `中`、符号 `@`、emoji 等），是面向人类语言的概念。\n- 字符需要通过编码方案转换为字节才能存储和传输，不同编码下同一个字符占用的字节数不同：\n  - **ASCII**：1 个英文字符 = 1 字节。\n  - **UTF-8**：1 个英文字符 = 1 字节，1 个中文字符 = 3 字节。\n  - **UTF-16**：大部分字符 = 2 字节（包括中文和英文），部分生僻字符 = 4 字节。\n  - **GBK**：1 个英文字符 = 1 字节，1 个中文字符 = 2 字节。\n\n### Java 中的对应\n\n- **`byte`**：Java 中表示字节的基本类型，占 1 个字节（8 位），取值范围 -128~127。`InputStream`/`OutputStream` 等字节流以 `byte` 为单位读写数据。\n- **`char`**：Java 中表示字符的基本类型，占 2 个字节（16 位），采用 UTF-16 编码，可以表示 Unicode 基本多语言平面中的所有字符（包括中文）。`Reader`/`Writer` 等字符流以 `char` 为单位读写数据。\n\n### 核心区别\n\n- **本质：** 字节是二进制数据单位，字符是文字符号。\n- **大小：** 字节固定1字节（8位），字符大小取决于编码方案。\n- **面向：** 字节面向硬件/存储/传输，字符面向人类语言/文本处理。\n- **Java类型：** 字节对应`byte`（1字节），字符对应`char`（2字节，UTF-16）。\n\n## 介绍下Java的Collection\n\n`Collection`是一个接口，它是Java集合框架的基础接口之一，定义了一组对象的集合。\n\n它提供了对集合中元素进行基本操作的方法，如添加、删除、查询等。`Collection`接口的主要目的是为各种集合类提供一个通用的接口，使得不同类型的集合（如列表、集合、队列等）可以以统一的方式进行操作。\n\n常见的集合有`ArrayList`、`LinkedList`、`HashSet`、`TreeSet`等。\n\n## ArrayList和LinkedList有什么区别？\n\n`ArrayList`基于数组实现，内存占用小，随机访问效率高，通过索引直接访问元素的时间复杂度为O(1)。但插入和删除元素效率低，尤其是在列表中间位置操作，需要移动大量元素，时间复杂度为O(n)。\n\n`LinkedList`基于链表实现，由于每个节点需要额外存储前后指针，所以内存占用大。插入和删除元素效率高，只需修改相邻节点的指针，时间复杂度为O(1)。但随机访问效率低，需要从头遍历链表找到目标元素，时间复杂度为O(n)。\n\n## HashSet和TreeSet有什么区别？\n\n`HashSet`基于哈希表实现，元素无序存储，添加元素时通过哈希函数计算元素的存储位置，判断元素是否重复基于元素的哈希码和`equals`方法，添加、删除、查找操作平均时间复杂度为O(1)。\n\n`TreeSet`基于红黑树实现，元素有序存储（默认自然顺序或可自定义排序），添加元素时会将元素插入到合适位置以维护顺序，判断元素是否重复基于元素的排序顺序，添加、删除、查找操作时间复杂度为O(log n)。\n",
    "headings": [
      {
        "depth": 1,
        "text": "Java",
        "slug": "java"
      },
      {
        "depth": 2,
        "text": "介绍下Java的Stream",
        "slug": "介绍下java的stream"
      },
      {
        "depth": 2,
        "text": "Stream的中间操作和终端操作有什么区别？",
        "slug": "stream的中间操作和终端操作有什么区别"
      },
      {
        "depth": 2,
        "text": "字符和字节的区别",
        "slug": "字符和字节的区别"
      },
      {
        "depth": 3,
        "text": "字节（Byte）",
        "slug": "字节byte"
      },
      {
        "depth": 3,
        "text": "字符（Character）",
        "slug": "字符character"
      },
      {
        "depth": 3,
        "text": "Java 中的对应",
        "slug": "java-中的对应"
      },
      {
        "depth": 3,
        "text": "核心区别",
        "slug": "核心区别"
      },
      {
        "depth": 2,
        "text": "介绍下Java的Collection",
        "slug": "介绍下java的collection"
      },
      {
        "depth": 2,
        "text": "ArrayList和LinkedList有什么区别？",
        "slug": "arraylist和linkedlist有什么区别"
      },
      {
        "depth": 2,
        "text": "HashSet和TreeSet有什么区别？",
        "slug": "hashset和treeset有什么区别"
      }
    ],
    "searchText": "java 其他语言 java 介绍下java的stream stream是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列，并且支持并行执行。操作方式更简洁高效。 stream提供了一系列操作的方法，例如过滤、映射、排序等中间操作，收集、归约（累积计算）、遍历等终端操作。 stream自己不会存储元素。 stream不会改变源对象。相反，他们会返回一个持有结果的新stream。 stream操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。 stream只能被\"消费\"一次，一旦遍历过就会失效。就像容器的迭代器那样，想要再次遍历必须重新生成一个新的stream。 stream的中间操作和终端操作有什么区别？ 中间操作返回一个新的stream，不会立即执行实际的计算，而是在终端操作调用时才会触发整个操作链的执行，这种特性被称为延迟执行。例如filter、map等操作都是中间操作。 终端操作会触发stream的计算，返回一个最终结果或执行某种副作用（如foreach的打印操作），之后stream就不能再被使用。例如collect、reduce、foreach等是终端操作。 字符和字节的区别 字节（byte） 字节是计算机中最基本的数据存储和传输单位，1 个字节 = 8 位（bit）二进制数据。 字节是面向硬件的概念，文件存储、网络传输、内存分配等底层操作都以字节为单位。 取值范围：无符号 0~255，有符号 128~127。 字符（character） 字符是人类可读的文字符号（如字母 a、汉字 中、符号 @、emoji 等），是面向人类语言的概念。 字符需要通过编码方案转换为字节才能存储和传输，不同编码下同一个字符占用的字节数不同： ascii ：1 个英文字符 = 1 字节。 utf 8 ：1 个英文字符 = 1 字节，1 个中文字符 = 3 字节。 utf 16 ：大部分字符 = 2 字节（包括中文和英文），部分生僻字符 = 4 字节。 gbk ：1 个英文字符 = 1 字节，1 个中文字符 = 2 字节。 java 中的对应 byte ：java 中表示字节的基本类型，占 1 个字节（8 位），取值范围 128~127。inputstream/outputstream 等字节流以 byte 为单位读写数据。 char ：java 中表示字符的基本类型，占 2 个字节（16 位），采用 utf 16 编码，可以表示 unicode 基本多语言平面中的所有字符（包括中文）。reader/writer 等字符流以 char 为单位读写数据。 核心区别 本质： 字节是二进制数据单位，字符是文字符号。 大小： 字节固定1字节（8位），字符大小取决于编码方案。 面向： 字节面向硬件/存储/传输，字符面向人类语言/文本处理。 java类型： 字节对应byte（1字节），字符对应char（2字节，utf 16）。 介绍下java的collection collection是一个接口，它是java集合框架的基础接口之一，定义了一组对象的集合。 它提供了对集合中元素进行基本操作的方法，如添加、删除、查询等。collection接口的主要目的是为各种集合类提供一个通用的接口，使得不同类型的集合（如列表、集合、队列等）可以以统一的方式进行操作。 常见的集合有arraylist、linkedlist、hashset、treeset等。 arraylist和linkedlist有什么区别？ arraylist基于数组实现，内存占用小，随机访问效率高，通过索引直接访问元素的时间复杂度为o(1)。但插入和删除元素效率低，尤其是在列表中间位置操作，需要移动大量元素，时间复杂度为o(n)。 linkedlist基于链表实现，由于每个节点需要额外存储前后指针，所以内存占用大。插入和删除元素效率高，只需修改相邻节点的指针，时间复杂度为o(1)。但随机访问效率低，需要从头遍历链表找到目标元素，时间复杂度为o(n)。 hashset和treeset有什么区别？ hashset基于哈希表实现，元素无序存储，添加元素时通过哈希函数计算元素的存储位置，判断元素是否重复基于元素的哈希码和equals方法，添加、删除、查找操作平均时间复杂度为o(1)。 treeset基于红黑树实现，元素有序存储（默认自然顺序或可自定义排序），添加元素时会将元素插入到合适位置以维护顺序，判断元素是否重复基于元素的排序顺序，添加、删除、查找操作时间复杂度为o(log n)。"
  },
  {
    "slug": "006-css",
    "title": "CSS",
    "category": "前端基础",
    "sourcePath": "docs/前端基础/CSS.md",
    "markdown": "# CSS\n\n## link 和 @import 的区别？\n\n`link` 是 HTML 标签，加载的 CSS 会和页面同时加载；权重高于 `@import`。实际开发中，推荐使用 `link`。\n\n`@import` 是 CSS 语法。`@import` 引入的 CSS 会等页面加载完再加载。\n\n## 移动端适配的方式\n\n1. 固定宽度，两侧留白。基础做法，不推荐。\n2. 固定宽度，通过 `@media`（媒体查询）在不同尺寸断点生效对应的布局。\n3. `rem` 单位。通过设置 HTML 根节点字体大小作为锚点，其他布局尺寸使用 `rem` 作为单位。当界面尺寸变化时，改变 HTML 根节点字体大小来同步改变内部布局尺寸。\n4. `vw`/`vh` 单位。使用 viewport 视口宽度和高度作为参照，将其等份为 100 份，其中 1 份是 `1vw`/`1vh`。\n5. 百分比单位。通过设置百分比来控制元素占据父元素的尺寸百分比，实现自适应。\n6. Flex 布局。通过设置 Flex 来控制元素在主轴空间上占据多少比例的尺寸，以及如何分布间距。\n7. Grid 布局。通过设置 Grid 布局来控制元素应该占据多少格，并按比例分配空间。\n8. 栅格化布局。一些 CSS 框架或前端组件库提供了栅格化布局。本质上还是将屏幕尺寸等分为若干个栅格，然后控制每个元素应该占几份。\n\n## PX 转 Rem\n\n目标 REM 值 = PX 值 / 根元素字体大小。\n\n## 前端动画实现的方式\n\n1. CSS Transition（过渡动画）\n2. CSS Animation（关键帧动画）\n3. `requestAnimationFrame`（JS 动画）\n4. Canvas 动画\n5. SVG 动画\n\n## 盒模型是什么？标准盒模型 & IE 盒模型区别？\n\nCSS 中可通过 `box-sizing` 属性来切换盒模型。\n\n- 设置为标准盒模型：使用 `box-sizing: content-box;`，这是 CSS 的默认盒模型，元素的 `width` 和 `height` 仅指内容区的宽度和高度，内边距（`padding`）和边框（`border`）会增加元素的总尺寸。\n- 设置为怪异盒模型（IE 盒模型）：使用 `box-sizing: border-box;`，此时元素的 `width` 和 `height` 包含了内容区、内边距和边框，内边距和边框不会增加元素总尺寸，而是会压缩内容区域。\n\n## 行内元素、块级元素有哪些？区别是什么？\n\n### 块级元素\n\n`<div>`、`<p>`、`<h1>`~`<h6>`、`<ul>`、`<ol>`、`<li>`、`<table>` 等。独占一行，可设宽高、内外边距。\n\n### 行内元素\n\n- `<span>`、`<a>`、`<img>`、`<input>`、`<button>`、`<label>` 等。\n- 只占自身宽度，不换行，设置 `width`/`height` 无效（`<img>` 等替换元素除外）。\n\n### 区别要点\n\n- 是否独占一行。\n- 能否设置宽高。\n- 垂直方向的 `padding`/`margin` 行内元素不占空间。\n\n## CSS 选择器优先级怎么算？\n\n优先级从高到低：\n\n1. `!important`\n2. 行内样式（`style=\"...\"`）\n3. ID 选择器（`#id`）\n4. 类选择器（`.class`）、属性选择器（`[attr]`）、伪类（`:hover`）\n5. 标签选择器（`div`）、伪元素（`::before`）\n6. 通配符 `*`\n\n### 权重计算方式（近似）\n\n- 行内样式：1000\n- ID：100\n- 类/属性/伪类：10\n- 标签/伪元素：1\n\n比较时，按位比较，数值越大优先级越高。\n\n## 如何隐藏一个元素？各种方式有什么区别？\n\n- `display: none`：隐藏元素不存在于 DOM 结构中，触发后会导致重排影响性能。\n- `visibility: hidden`：元素仍然在 DOM 中，只触发重绘。\n- `opacity: 0`：元素仍然在 DOM 中，只触发重绘，仍可交互。\n- `position: absolute; left: -9999px`：移出视口。\n- `height: 0; overflow: hidden`：高度塌陷。\n\n## display: none 和 visibility: hidden 区别？\n\n- `display: none`：元素从文档流中消失，不占空间。会触发重排（回流）。\n- `visibility: hidden`：元素不可见，但仍然占空间。只触发重绘，不重排。\n\n## BFC 是什么？怎么触发？能解决什么问题？\n\nBFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素不影响外部，外部也不影响内部。\n\n### 触发条件（常见）\n\n- 根元素 `<html>`\n- 浮动元素：`float` 不为 `none`\n- 绝对定位或固定定位元素：`position` 为 `absolute` 或 `fixed`\n- `display` 为 `inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`\n- `overflow` 不为 `visible`\n- `display: flow-root`\n\n### 能解决的问题\n\n- 避免 `margin` 重叠。\n- 清除浮动（包含浮动子元素）。\n- 实现自适应布局（比如左固定右自适应）。\n- 避免父元素高度塌陷。\n\n## 什么是重排（回流）和重绘？\n\n重排是指由于元素的几何属性发生变化，导致浏览器重新计算元素的布局，进而重新构建渲染树的过程。\n\n重绘是指当元素的外观发生变化，但不影响其几何属性（位置、大小等）时，浏览器重新绘制元素的过程。\n\n### 常见的重排场景\n\n- 改变元素的尺寸，如修改 `width`、`height`、`padding`、`margin` 等属性。\n- 改变元素的位置，如修改 `top`、`left`、`right`、`bottom` 等属性。\n- 改变元素的字体大小，因为这会影响文本的尺寸，进而影响元素的布局。\n- 添加或删除可见的 DOM 元素。\n\n### 常见的重绘场景\n\n- 改变元素的颜色，如修改 `color` 属性。\n- 改变元素的背景色，如修改 `background-color` 属性。\n- 改变元素的边框样式，如修改 `border-style`、`border-color` 等属性。\n- 改变元素的透明度，如修改 `opacity` 属性。\n\n## 实现垂直居中\n\n1. 块级元素垂直居中\n   - `display: flex` + `align-items: center`\n   - `display: grid` + `align-items: center`\n   - 父元素设置 `position: relative`，子元素设置 `position: absolute` + `top: 50%`（将上边界移动到中间）+ `transform: translateY(-50%)`（向上移动一半的高度）\n2. 行内元素垂直居中\n   - `line-height` 设置为等同于元素的 `height`\n   - `vertical-align: middle`\n\n## 常见 CSS 布局：左固定宽，右自适应有几种实现？\n\n- 左侧设置 `float: left`，固定宽度。右侧设置 `margin` 和左侧宽度相同。\n- 左侧设置 `float: left`，固定宽度。右侧设置 `overflow: hidden` 触发 BFC，不与左侧重叠。\n- Flex 布局。\n\n## flex: 1 和 flex: auto 分别代表什么？二者有什么区别？\n\n1. `flex: 1` 是 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%` 的简写。\n2. `flex: auto` 是 `flex-grow: 1; flex-shrink: 1; flex-basis: auto` 的简写。\n3. `flex-grow` 属性控制对剩余空间的分配比例。\n   - `flex-grow: 1` 表示如果有剩余空间，那么将剩余空间平分后，该元素额外占据 1 份空间。如果该值是大于 1 的数，则表示额外多占更多空间。\n   - `flex-grow: 0` 表示即使有剩余空间，也不放大。\n4. `flex-shrink` 属性控制剩余空间不足时，元素如何缩小。\n   - `flex-shrink: 1` 表示如果剩余空间不足，那么将缺失的空间平分，该元素缩小 1 份空间的大小。如果该值大于 1，则表示更多缩小来适应空间。\n   - `flex-shrink: 0` 表示即使空间不足，也不缩小。\n5. `flex-basis` 属性表示该元素的基准尺寸。在 flex 布局中，这个属性的优先级高于元素本身的 `width` 属性。\n   - `flex-basis: 0%` 表示该元素的基准尺寸是 0，那么它的放大缩小完全由 `flex-grow` 和 `flex-shrink` 控制。\n   - `flex-basis: auto` 表示该元素的基准尺寸是该元素内容占据的空间。当需要放大或缩小时，会优先满足其内部元素的空间，然后再分配多余空间。\n",
    "headings": [
      {
        "depth": 1,
        "text": "CSS",
        "slug": "css"
      },
      {
        "depth": 2,
        "text": "link 和 @import 的区别？",
        "slug": "link-和-import-的区别"
      },
      {
        "depth": 2,
        "text": "移动端适配的方式",
        "slug": "移动端适配的方式"
      },
      {
        "depth": 2,
        "text": "PX 转 Rem",
        "slug": "px-转-rem"
      },
      {
        "depth": 2,
        "text": "前端动画实现的方式",
        "slug": "前端动画实现的方式"
      },
      {
        "depth": 2,
        "text": "盒模型是什么？标准盒模型 & IE 盒模型区别？",
        "slug": "盒模型是什么标准盒模型-ie-盒模型区别"
      },
      {
        "depth": 2,
        "text": "行内元素、块级元素有哪些？区别是什么？",
        "slug": "行内元素块级元素有哪些区别是什么"
      },
      {
        "depth": 3,
        "text": "块级元素",
        "slug": "块级元素"
      },
      {
        "depth": 3,
        "text": "行内元素",
        "slug": "行内元素"
      },
      {
        "depth": 3,
        "text": "区别要点",
        "slug": "区别要点"
      },
      {
        "depth": 2,
        "text": "CSS 选择器优先级怎么算？",
        "slug": "css-选择器优先级怎么算"
      },
      {
        "depth": 3,
        "text": "权重计算方式（近似）",
        "slug": "权重计算方式近似"
      },
      {
        "depth": 2,
        "text": "如何隐藏一个元素？各种方式有什么区别？",
        "slug": "如何隐藏一个元素各种方式有什么区别"
      },
      {
        "depth": 2,
        "text": "display: none 和 visibility: hidden 区别？",
        "slug": "display-none-和-visibility-hidden-区别"
      },
      {
        "depth": 2,
        "text": "BFC 是什么？怎么触发？能解决什么问题？",
        "slug": "bfc-是什么怎么触发能解决什么问题"
      },
      {
        "depth": 3,
        "text": "触发条件（常见）",
        "slug": "触发条件常见"
      },
      {
        "depth": 3,
        "text": "能解决的问题",
        "slug": "能解决的问题"
      },
      {
        "depth": 2,
        "text": "什么是重排（回流）和重绘？",
        "slug": "什么是重排回流和重绘"
      },
      {
        "depth": 3,
        "text": "常见的重排场景",
        "slug": "常见的重排场景"
      },
      {
        "depth": 3,
        "text": "常见的重绘场景",
        "slug": "常见的重绘场景"
      },
      {
        "depth": 2,
        "text": "实现垂直居中",
        "slug": "实现垂直居中"
      },
      {
        "depth": 2,
        "text": "常见 CSS 布局：左固定宽，右自适应有几种实现？",
        "slug": "常见-css-布局左固定宽右自适应有几种实现"
      },
      {
        "depth": 2,
        "text": "flex: 1 和 flex: auto 分别代表什么？二者有什么区别？",
        "slug": "flex-1-和-flex-auto-分别代表什么二者有什么区别"
      }
    ],
    "searchText": "css 前端基础 css link 和 @import 的区别？ link 是 html 标签，加载的 css 会和页面同时加载；权重高于 @import。实际开发中，推荐使用 link。 @import 是 css 语法。@import 引入的 css 会等页面加载完再加载。 移动端适配的方式 1. 固定宽度，两侧留白。基础做法，不推荐。 2. 固定宽度，通过 @media（媒体查询）在不同尺寸断点生效对应的布局。 3. rem 单位。通过设置 html 根节点字体大小作为锚点，其他布局尺寸使用 rem 作为单位。当界面尺寸变化时，改变 html 根节点字体大小来同步改变内部布局尺寸。 4. vw/vh 单位。使用 viewport 视口宽度和高度作为参照，将其等份为 100 份，其中 1 份是 1vw/1vh。 5. 百分比单位。通过设置百分比来控制元素占据父元素的尺寸百分比，实现自适应。 6. flex 布局。通过设置 flex 来控制元素在主轴空间上占据多少比例的尺寸，以及如何分布间距。 7. grid 布局。通过设置 grid 布局来控制元素应该占据多少格，并按比例分配空间。 8. 栅格化布局。一些 css 框架或前端组件库提供了栅格化布局。本质上还是将屏幕尺寸等分为若干个栅格，然后控制每个元素应该占几份。 px 转 rem 目标 rem 值 = px 值 / 根元素字体大小。 前端动画实现的方式 1. css transition（过渡动画） 2. css animation（关键帧动画） 3. requestanimationframe（js 动画） 4. canvas 动画 5. svg 动画 盒模型是什么？标准盒模型 & ie 盒模型区别？ css 中可通过 box sizing 属性来切换盒模型。 设置为标准盒模型：使用 box sizing: content box;，这是 css 的默认盒模型，元素的 width 和 height 仅指内容区的宽度和高度，内边距（padding）和边框（border）会增加元素的总尺寸。 设置为怪异盒模型（ie 盒模型）：使用 box sizing: border box;，此时元素的 width 和 height 包含了内容区、内边距和边框，内边距和边框不会增加元素总尺寸，而是会压缩内容区域。 行内元素、块级元素有哪些？区别是什么？ 块级元素 <div 、<p 、<h1 ~<h6 、<ul 、<ol 、<li 、<table 等。独占一行，可设宽高、内外边距。 行内元素 <span 、<a 、<img 、<input 、<button 、<label 等。 只占自身宽度，不换行，设置 width/height 无效（<img 等替换元素除外）。 区别要点 是否独占一行。 能否设置宽高。 垂直方向的 padding/margin 行内元素不占空间。 css 选择器优先级怎么算？ 优先级从高到低： 1. !important 2. 行内样式（style=\"...\"） 3. id 选择器（ id） 4. 类选择器（.class）、属性选择器（[attr]）、伪类（:hover） 5. 标签选择器（div）、伪元素（::before） 6. 通配符 权重计算方式（近似） 行内样式：1000 id：100 类/属性/伪类：10 标签/伪元素：1 比较时，按位比较，数值越大优先级越高。 如何隐藏一个元素？各种方式有什么区别？ display: none：隐藏元素不存在于 dom 结构中，触发后会导致重排影响性能。 visibility: hidden：元素仍然在 dom 中，只触发重绘。 opacity: 0：元素仍然在 dom 中，只触发重绘，仍可交互。 position: absolute; left: 9999px：移出视口。 height: 0; overflow: hidden：高度塌陷。 display: none 和 visibility: hidden 区别？ display: none：元素从文档流中消失，不占空间。会触发重排（回流）。 visibility: hidden：元素不可见，但仍然占空间。只触发重绘，不重排。 bfc 是什么？怎么触发？能解决什么问题？ bfc（block formatting context，块级格式化上下文）是一个独立的渲染区域，内部元素不影响外部，外部也不影响内部。 触发条件（常见） 根元素 <html 浮动元素：float 不为 none 绝对定位或固定定位元素：position 为 absolute 或 fixed display 为 inline block、table cell、table caption、flex、inline flex overflow 不为 visible display: flow root 能解决的问题 避免 margin 重叠。 清除浮动（包含浮动子元素）。 实现自适应布局（比如左固定右自适应）。 避免父元素高度塌陷。 什么是重排（回流）和重绘？ 重排是指由于元素的几何属性发生变化，导致浏览器重新计算元素的布局，进而重新构建渲染树的过程。 重绘是指当元素的外观发生变化，但不影响其几何属性（位置、大小等）时，浏览器重新绘制元素的过程。 常见的重排场景 改变元素的尺寸，如修改 width、height、padding、margin 等属性。 改变元素的位置，如修改 top、left、right、bottom 等属性。 改变元素的字体大小，因为这会影响文本的尺寸，进而影响元素的布局。 添加或删除可见的 dom 元素。 常见的重绘场景 改变元素的颜色，如修改 color 属性。 改变元素的背景色，如修改 background color 属性。 改变元素的边框样式，如修改 border style、border color 等属性。 改变元素的透明度，如修改 opacity 属性。 实现垂直居中 1. 块级元素垂直居中 display: flex + align items: center display: grid + align items: center 父元素设置 position: relative，子元素设置 position: absolute + top: 50%（将上边界移动到中间）+ transform: translatey( 50%)（向上移动一半的高度） 2. 行内元素垂直居中 line height 设置为等同于元素的 height vertical align: middle 常见 css 布局：左固定宽，右自适应有几种实现？ 左侧设置 float: left，固定宽度。右侧设置 margin 和左侧宽度相同。 左侧设置 float: left，固定宽度。右侧设置 overflow: hidden 触发 bfc，不与左侧重叠。 flex 布局。 flex: 1 和 flex: auto 分别代表什么？二者有什么区别？ 1. flex: 1 是 flex grow: 1; flex shrink: 1; flex basis: 0% 的简写。 2. flex: auto 是 flex grow: 1; flex shrink: 1; flex basis: auto 的简写。 3. flex grow 属性控制对剩余空间的分配比例。 flex grow: 1 表示如果有剩余空间，那么将剩余空间平分后，该元素额外占据 1 份空间。如果该值是大于 1 的数，则表示额外多占更多空间。 flex grow: 0 表示即使有剩余空间，也不放大。 4. flex shrink 属性控制剩余空间不足时，元素如何缩小。 flex shrink: 1 表示如果剩余空间不足，那么将缺失的空间平分，该元素缩小 1 份空间的大小。如果该值大于 1，则表示更多缩小来适应空间。 flex shrink: 0 表示即使空间不足，也不缩小。 5. flex basis 属性表示该元素的基准尺寸。在 flex 布局中，这个属性的优先级高于元素本身的 width 属性。 flex basis: 0% 表示该元素的基准尺寸是 0，那么它的放大缩小完全由 flex grow 和 flex shrink 控制。 flex basis: auto 表示该元素的基准尺寸是该元素内容占据的空间。当需要放大或缩小时，会优先满足其内部元素的空间，然后再分配多余空间。"
  },
  {
    "slug": "007-html",
    "title": "HTML",
    "category": "前端基础",
    "sourcePath": "docs/前端基础/HTML.md",
    "markdown": "# HTML\n\n## DOCTYPE 是什么？严格模式 & 混杂模式怎么触发？\n\n`DOCTYPE` 是用来告诉浏览器用哪种规范解析页面。\n\n有两种模式：\n\n- **严格模式（标准模式）**：浏览器按 W3C 标准解析渲染。\n- **混杂模式（怪异模式）**：浏览器兼容老版本页面，行为类似老 IE。\n\n如果 HTML 文档最上面写了一个正确的 `<!DOCTYPE html>`，就进入严格模式；如果没写、写错、或者上面有其他内容（比如注释、XML 声明），就可能触发混杂模式。\n\n## HTML 语义化是什么？为什么要语义化？\n\nHTML 语义化就是：用合适的标签表达内容含义，而不是全用 `<div>` + `<span>`。\n\n好处：\n\n1. 对开发者：结构清晰，易读易维护。\n2. 对搜索引擎：SEO 更友好，爬虫能理解页面结构。\n3. 对无障碍：屏幕阅读器能更好\"读\"网页。\n\n常见语义标签：\n\n- `<header>`、`<footer>`、`<nav>`、`<article>`、`<section>`、`<aside>` 等。\n\n## data- 开头的元素属性是什么？\n\n`data-` 开头的元素属性被称为自定义数据属性（Custom data attributes）。它们允许开发者向 HTML 元素添加额外的、自定义的数据，这些数据可以通过 JavaScript 进行访问和操作，常用于在 DOM 元素中存储与应用程序相关的信息，而不会影响文档的呈现或语义。\n\n在 JavaScript 中可以通过 `dataset` 访问，但属性名中的 `-` 会被忽略，并且后续单词首字母大写。\n\n## <script> 标签有哪些属性，有什么作用？\n\n### src\n\n用于指定外部脚本文件的 URL。当设置了 `src` 属性后，`<script>` 标签内部的代码将被忽略，浏览器会从指定的 URL 获取并执行脚本。\n\n### async\n\nHTML5 新增，用于异步加载和执行脚本。当浏览器遇到带有 `async` 属性的 `<script>` 标签时，会在下载脚本的同时继续解析 HTML 文档，脚本下载完成后立即执行，不会阻塞页面的解析。\n\n### defer\n\nHTML5 新增，同样用于异步加载脚本。与 `async` 不同的是，带有 `defer` 属性的脚本会在 HTML 文档解析完成后，`DOMContentLoaded` 事件触发之前执行。这意味着脚本的执行顺序与它们在文档中的出现顺序一致，适用于那些需要操作 DOM 元素且依赖于 HTML 结构已经解析完成的脚本。\n\n### type\n\n指定脚本的 MIME 类型。在 HTML5 之前，该属性用于明确脚本语言，例如 `type=\"text/javascript\"`。在 HTML5 中，默认值为 `text/javascript`，当使用其他类型的脚本（如 WebAssembly 的 JavaScript 绑定脚本时），需要明确指定类型，例如 `type=\"module\"` 用于定义 JavaScript 模块。\n\n### charset\n\n指定引用脚本的字符编码。浏览器通常会根据页面的整体字符编码来处理脚本。如果脚本的编码与页面编码不一致，使用该属性可以指定脚本的正确编码。\n\n### crossorigin\n\n用于处理跨域脚本的加载。它有两个值：`anonymous` 和 `use-credentials`。\n\n- `anonymous` 表示以匿名方式跨域加载脚本，不会发送身份凭证（如 Cookie）。\n- `use-credentials` 则表示在跨域加载脚本时发送身份凭证。\n\n该属性对于从 CDN 等外部源加载脚本时处理跨域资源共享（CORS）相关问题很有用。\n\n### integrity\n\n与 `crossorigin` 属性配合使用，用于验证从外部源加载的脚本的完整性。它的值是脚本内容的加密哈希值（如 SHA-256、SHA-384 等）。浏览器在加载脚本时会计算脚本的哈希值，并与 `integrity` 属性的值进行比较，如果不匹配则拒绝执行脚本，从而防止脚本被篡改。\n\n## async 和 defer 区别？\n\n`async` 和 `defer` 都异步下载脚本、不阻塞 HTML 解析，`defer` 按顺序在 DOM 解析完、`DOMContentLoaded` 前执行，`async` 下载完就立即执行、顺序不确定。\n\n## DOMContentLoaded 的触发时机\n\n`DOMContentLoaded` 是浏览器 `document` 对象的核心事件，它的触发满足两个核心条件，且不等待外部资源加载：\n\n1. 浏览器已完全解析完 HTML 文档，并构建出完整的 DOM 树（所有 HTML 标签都被解析为 DOM 节点）；\n2. 所有带有 `defer` 属性的脚本执行完毕（`async` 脚本不影响该事件，因为 `async` 脚本是异步加载、执行，不阻塞 DOM 解析）。\n\n## DOMContentLoaded 和 window.onload 的区别\n\n- **`DOMContentLoaded`**：DOM 树构建完成（HTML 解析完），不等待图片、CSS、视频。\n- **`window.onload`**：整个页面所有资源加载完成（包括图片/CSS 等），等待所有外部资源加载完。\n\n## DOM 和 BOM\n\n### DOM\n\nDOM 是针对 HTML 和 XML 文档的一种 API，它将文档解析为一个由节点和对象（包含属性和方法）组成的树形结构，每个节点代表文档中的一个部分，如元素节点、文本节点、属性节点等。可以说 DOM 是 BOM 的一部分，BOM 涵盖了更广泛的与浏览器交互的功能，而 DOM 专注于文档内容的操作。\n\n### BOM\n\nBOM 是 JavaScript 与浏览器进行交互的接口，它提供了一系列对象来访问和操作浏览器的各个方面，如窗口、框架、导航栏、历史记录等。BOM 并没有一个官方的标准，不同浏览器的实现可能会有细微差异，但核心功能基本一致。\n\n## BOM 中的 location 对象有哪些常用属性和方法？\n\n### 常用属性\n\n- `href`：获取或设置整个 URL，例如 `const currentUrl = window.location.href;`\n- `protocol`：获取或设置 URL 的协议部分，如 `http:` 或 `https:`，`const protocol = window.location.protocol;`\n- `host`：获取或设置主机名和端口号，例如 `example.com:80`，`const host = window.location.host;`\n- `pathname`：获取或设置 URL 的路径部分，如 `/path/to/page`，`const path = window.location.pathname;`\n\n### 常用方法\n\n- `reload()`：重新加载当前页面，`window.location.reload();`\n- `assign(url)`：导航到指定的 URL，`window.location.assign('new-url');`\n\n## 设备 DPR 是否可以改变？\n\n设备像素比（Device Pixel Ratio，DPR）在一般情况下，对于特定设备而言，在其正常使用过程中系统层面不可随意改变，但在开发和测试场景下，可以通过一些手段模拟不同的 DPR 值。\n\n在 Chrome 浏览器的开发者工具中，通过 \"Device toolbar\" 可以选择不同的设备模式，其中就包括设置 DPR 的选项。\n\n## DPR 对 Web 开发有什么影响？\n\n- **图像资源加载**：为了在高 DPR 设备上显示清晰的图像，开发者需要提供更高分辨率的图像资源。例如，对于 DPR 为 2 的设备，需要提供两倍分辨率的图像，否则图像会显得模糊。可以通过使用 CSS 的 `srcset` 属性来根据 DPR 加载不同分辨率的图像，如 `<img src=\"image-lowres.jpg\" srcset=\"image-lowres.jpg 1x, image-hires.jpg 2x\" alt=\"example\">`。\n- **字体和图标显示**：在高 DPR 设备上，字体和图标可能会因为物理像素的增多而显得过小。开发者需要适当调整字体大小和图标尺寸，以保证在不同 DPR 设备上都有良好的可读性和视觉效果。可以使用相对单位（如 `em`、`rem`）来设置字体大小，这样字体大小会根据父元素或根元素的字体大小进行自适应调整。\n- **布局和适配**：DPR 会影响页面的布局和适配。在响应式设计中，除了考虑不同屏幕尺寸，还需要考虑 DPR。例如，一些在低 DPR 设备上看起来合适的布局，在高 DPR 设备上可能因为物理像素的增加而显得拥挤。开发者可以使用媒体查询结合 DPR 来优化布局，如 `@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) { /* 针对DPR为2及以上的设备的样式 */ }`。\n\n## HTML5 特性\n\n1. 语义化标签\n2. 本地存储\n3. 多媒体支持（原生支持音频和视频播放，无需依赖第三方插件）\n4. 画布（Canvas）\n5. 地理定位（`navigator.geolocation`）\n6. Web Workers\n7. 拖放（Drag and Drop）\n\n## Canvas 和 SVG 有什么区别？\n\n### 绘制原理\n\n- **Canvas**：基于像素绘制，通过 JavaScript 操作 2D Context 来绘制图形，绘制的图形是位图，放大后可能出现锯齿。\n- **SVG**：基于矢量绘制，使用 XML 格式描述图形，图形由路径、形状等矢量元素组成，无论如何缩放都不会失真。\n\n### 应用场景\n\n- **Canvas**：适合绘制动态图形、游戏、数据可视化中对性能要求较高且不需要精确缩放的场景。\n- **SVG**：适用于需要精确缩放的图形，如图标、地图等，并且支持事件绑定，可实现交互效果。\n\n### 性能表现\n\n- **Canvas**：在绘制大量简单图形或进行动画绘制时性能较好，因为它直接操作像素。\n- **SVG**：在图形较复杂且需要频繁修改和交互时，由于其矢量特性，性能可能优于 Canvas，但如果图形过于复杂，渲染性能可能会下降。\n",
    "headings": [
      {
        "depth": 1,
        "text": "HTML",
        "slug": "html"
      },
      {
        "depth": 2,
        "text": "DOCTYPE 是什么？严格模式 & 混杂模式怎么触发？",
        "slug": "doctype-是什么严格模式-混杂模式怎么触发"
      },
      {
        "depth": 2,
        "text": "HTML 语义化是什么？为什么要语义化？",
        "slug": "html-语义化是什么为什么要语义化"
      },
      {
        "depth": 2,
        "text": "data- 开头的元素属性是什么？",
        "slug": "data-开头的元素属性是什么"
      },
      {
        "depth": 2,
        "text": "<script> 标签有哪些属性，有什么作用？",
        "slug": "script-标签有哪些属性有什么作用"
      },
      {
        "depth": 3,
        "text": "src",
        "slug": "src"
      },
      {
        "depth": 3,
        "text": "async",
        "slug": "async"
      },
      {
        "depth": 3,
        "text": "defer",
        "slug": "defer"
      },
      {
        "depth": 3,
        "text": "type",
        "slug": "type"
      },
      {
        "depth": 3,
        "text": "charset",
        "slug": "charset"
      },
      {
        "depth": 3,
        "text": "crossorigin",
        "slug": "crossorigin"
      },
      {
        "depth": 3,
        "text": "integrity",
        "slug": "integrity"
      },
      {
        "depth": 2,
        "text": "async 和 defer 区别？",
        "slug": "async-和-defer-区别"
      },
      {
        "depth": 2,
        "text": "DOMContentLoaded 的触发时机",
        "slug": "domcontentloaded-的触发时机"
      },
      {
        "depth": 2,
        "text": "DOMContentLoaded 和 window.onload 的区别",
        "slug": "domcontentloaded-和-windowonload-的区别"
      },
      {
        "depth": 2,
        "text": "DOM 和 BOM",
        "slug": "dom-和-bom"
      },
      {
        "depth": 3,
        "text": "DOM",
        "slug": "dom"
      },
      {
        "depth": 3,
        "text": "BOM",
        "slug": "bom"
      },
      {
        "depth": 2,
        "text": "BOM 中的 location 对象有哪些常用属性和方法？",
        "slug": "bom-中的-location-对象有哪些常用属性和方法"
      },
      {
        "depth": 3,
        "text": "常用属性",
        "slug": "常用属性"
      },
      {
        "depth": 3,
        "text": "常用方法",
        "slug": "常用方法"
      },
      {
        "depth": 2,
        "text": "设备 DPR 是否可以改变？",
        "slug": "设备-dpr-是否可以改变"
      },
      {
        "depth": 2,
        "text": "DPR 对 Web 开发有什么影响？",
        "slug": "dpr-对-web-开发有什么影响"
      },
      {
        "depth": 2,
        "text": "HTML5 特性",
        "slug": "html5-特性"
      },
      {
        "depth": 2,
        "text": "Canvas 和 SVG 有什么区别？",
        "slug": "canvas-和-svg-有什么区别"
      },
      {
        "depth": 3,
        "text": "绘制原理",
        "slug": "绘制原理"
      },
      {
        "depth": 3,
        "text": "应用场景",
        "slug": "应用场景"
      },
      {
        "depth": 3,
        "text": "性能表现",
        "slug": "性能表现"
      }
    ],
    "searchText": "html 前端基础 html doctype 是什么？严格模式 & 混杂模式怎么触发？ doctype 是用来告诉浏览器用哪种规范解析页面。 有两种模式： 严格模式（标准模式） ：浏览器按 w3c 标准解析渲染。 混杂模式（怪异模式） ：浏览器兼容老版本页面，行为类似老 ie。 如果 html 文档最上面写了一个正确的 <!doctype html ，就进入严格模式；如果没写、写错、或者上面有其他内容（比如注释、xml 声明），就可能触发混杂模式。 html 语义化是什么？为什么要语义化？ html 语义化就是：用合适的标签表达内容含义，而不是全用 <div + <span 。 好处： 1. 对开发者：结构清晰，易读易维护。 2. 对搜索引擎：seo 更友好，爬虫能理解页面结构。 3. 对无障碍：屏幕阅读器能更好\"读\"网页。 常见语义标签： <header 、<footer 、<nav 、<article 、<section 、<aside 等。 data 开头的元素属性是什么？ data 开头的元素属性被称为自定义数据属性（custom data attributes）。它们允许开发者向 html 元素添加额外的、自定义的数据，这些数据可以通过 javascript 进行访问和操作，常用于在 dom 元素中存储与应用程序相关的信息，而不会影响文档的呈现或语义。 在 javascript 中可以通过 dataset 访问，但属性名中的 会被忽略，并且后续单词首字母大写。 <script 标签有哪些属性，有什么作用？ src 用于指定外部脚本文件的 url。当设置了 src 属性后，<script 标签内部的代码将被忽略，浏览器会从指定的 url 获取并执行脚本。 async html5 新增，用于异步加载和执行脚本。当浏览器遇到带有 async 属性的 <script 标签时，会在下载脚本的同时继续解析 html 文档，脚本下载完成后立即执行，不会阻塞页面的解析。 defer html5 新增，同样用于异步加载脚本。与 async 不同的是，带有 defer 属性的脚本会在 html 文档解析完成后，domcontentloaded 事件触发之前执行。这意味着脚本的执行顺序与它们在文档中的出现顺序一致，适用于那些需要操作 dom 元素且依赖于 html 结构已经解析完成的脚本。 type 指定脚本的 mime 类型。在 html5 之前，该属性用于明确脚本语言，例如 type=\"text/javascript\"。在 html5 中，默认值为 text/javascript，当使用其他类型的脚本（如 webassembly 的 javascript 绑定脚本时），需要明确指定类型，例如 type=\"module\" 用于定义 javascript 模块。 charset 指定引用脚本的字符编码。浏览器通常会根据页面的整体字符编码来处理脚本。如果脚本的编码与页面编码不一致，使用该属性可以指定脚本的正确编码。 crossorigin 用于处理跨域脚本的加载。它有两个值：anonymous 和 use credentials。 anonymous 表示以匿名方式跨域加载脚本，不会发送身份凭证（如 cookie）。 use credentials 则表示在跨域加载脚本时发送身份凭证。 该属性对于从 cdn 等外部源加载脚本时处理跨域资源共享（cors）相关问题很有用。 integrity 与 crossorigin 属性配合使用，用于验证从外部源加载的脚本的完整性。它的值是脚本内容的加密哈希值（如 sha 256、sha 384 等）。浏览器在加载脚本时会计算脚本的哈希值，并与 integrity 属性的值进行比较，如果不匹配则拒绝执行脚本，从而防止脚本被篡改。 async 和 defer 区别？ async 和 defer 都异步下载脚本、不阻塞 html 解析，defer 按顺序在 dom 解析完、domcontentloaded 前执行，async 下载完就立即执行、顺序不确定。 domcontentloaded 的触发时机 domcontentloaded 是浏览器 document 对象的核心事件，它的触发满足两个核心条件，且不等待外部资源加载： 1. 浏览器已完全解析完 html 文档，并构建出完整的 dom 树（所有 html 标签都被解析为 dom 节点）； 2. 所有带有 defer 属性的脚本执行完毕（async 脚本不影响该事件，因为 async 脚本是异步加载、执行，不阻塞 dom 解析）。 domcontentloaded 和 window.onload 的区别 domcontentloaded ：dom 树构建完成（html 解析完），不等待图片、css、视频。 window.onload ：整个页面所有资源加载完成（包括图片/css 等），等待所有外部资源加载完。 dom 和 bom dom dom 是针对 html 和 xml 文档的一种 api，它将文档解析为一个由节点和对象（包含属性和方法）组成的树形结构，每个节点代表文档中的一个部分，如元素节点、文本节点、属性节点等。可以说 dom 是 bom 的一部分，bom 涵盖了更广泛的与浏览器交互的功能，而 dom 专注于文档内容的操作。 bom bom 是 javascript 与浏览器进行交互的接口，它提供了一系列对象来访问和操作浏览器的各个方面，如窗口、框架、导航栏、历史记录等。bom 并没有一个官方的标准，不同浏览器的实现可能会有细微差异，但核心功能基本一致。 bom 中的 location 对象有哪些常用属性和方法？ 常用属性 href：获取或设置整个 url，例如 const currenturl = window.location.href; protocol：获取或设置 url 的协议部分，如 http: 或 https:，const protocol = window.location.protocol; host：获取或设置主机名和端口号，例如 example.com:80，const host = window.location.host; pathname：获取或设置 url 的路径部分，如 /path/to/page，const path = window.location.pathname; 常用方法 reload()：重新加载当前页面，window.location.reload(); assign(url)：导航到指定的 url，window.location.assign('new url'); 设备 dpr 是否可以改变？ 设备像素比（device pixel ratio，dpr）在一般情况下，对于特定设备而言，在其正常使用过程中系统层面不可随意改变，但在开发和测试场景下，可以通过一些手段模拟不同的 dpr 值。 在 chrome 浏览器的开发者工具中，通过 \"device toolbar\" 可以选择不同的设备模式，其中就包括设置 dpr 的选项。 dpr 对 web 开发有什么影响？ 图像资源加载 ：为了在高 dpr 设备上显示清晰的图像，开发者需要提供更高分辨率的图像资源。例如，对于 dpr 为 2 的设备，需要提供两倍分辨率的图像，否则图像会显得模糊。可以通过使用 css 的 srcset 属性来根据 dpr 加载不同分辨率的图像，如 <img src=\"image lowres.jpg\" srcset=\"image lowres.jpg 1x, image hires.jpg 2x\" alt=\"example\" 。 字体和图标显示 ：在高 dpr 设备上，字体和图标可能会因为物理像素的增多而显得过小。开发者需要适当调整字体大小和图标尺寸，以保证在不同 dpr 设备上都有良好的可读性和视觉效果。可以使用相对单位（如 em、rem）来设置字体大小，这样字体大小会根据父元素或根元素的字体大小进行自适应调整。 布局和适配 ：dpr 会影响页面的布局和适配。在响应式设计中，除了考虑不同屏幕尺寸，还需要考虑 dpr。例如，一些在低 dpr 设备上看起来合适的布局，在高 dpr 设备上可能因为物理像素的增加而显得拥挤。开发者可以使用媒体查询结合 dpr 来优化布局，如 @media only screen and ( webkit min device pixel ratio: 2), only screen and (min device pixel ratio: 2) { / 针对dpr为2及以上的设备的样式 / }。 html5 特性 1. 语义化标签 2. 本地存储 3. 多媒体支持（原生支持音频和视频播放，无需依赖第三方插件） 4. 画布（canvas） 5. 地理定位（navigator.geolocation） 6. web workers 7. 拖放（drag and drop） canvas 和 svg 有什么区别？ 绘制原理 canvas ：基于像素绘制，通过 javascript 操作 2d context 来绘制图形，绘制的图形是位图，放大后可能出现锯齿。 svg ：基于矢量绘制，使用 xml 格式描述图形，图形由路径、形状等矢量元素组成，无论如何缩放都不会失真。 应用场景 canvas ：适合绘制动态图形、游戏、数据可视化中对性能要求较高且不需要精确缩放的场景。 svg ：适用于需要精确缩放的图形，如图标、地图等，并且支持事件绑定，可实现交互效果。 性能表现 canvas ：在绘制大量简单图形或进行动画绘制时性能较好，因为它直接操作像素。 svg ：在图形较复杂且需要频繁修改和交互时，由于其矢量特性，性能可能优于 canvas，但如果图形过于复杂，渲染性能可能会下降。"
  },
  {
    "slug": "008-javascript",
    "title": "JavaScript",
    "category": "前端基础",
    "sourcePath": "docs/前端基础/JavaScript.md",
    "markdown": "# JavaScript\n\n## ES6 有哪些常用新特性？\n\n- `let` / `const`\n- 箭头函数\n- 模板字符串\n- 解构赋值\n- 默认参数\n- 扩展运算符\n- `Promise`\n- 类（`class`）\n- 模块化（`import` / `export`）\n\n## typeof 能判断哪些类型？\n\n`typeof` 能准确判断基本类型（除 `null`）。对于引用类型：\n\n- `typeof [] === 'object'`\n- `typeof {} === 'object'`\n- `typeof function(){} === 'function'`\n- `typeof null === 'object'`\n\n### instanceof 原理\n\n`instanceof` 用于检测构造函数的 `prototype` 是否在对象的原型链上。\n\n## this 指向规则？\n\n- **默认绑定**：独立调用，`this` 指向全局对象（严格模式下是 `undefined`）。\n- **隐式绑定**：作为对象方法调用，`this` 指向该对象。\n- **显式绑定**：`call` / `apply` / `bind`。\n- **`new` 绑定**：指向新创建的对象。\n- **箭头函数**：没有自己的 `this`，继承外层作用域的 `this`。\n\n## call / apply / bind 区别？\n\n**核心作用**：三者均为 JavaScript 中手动修改函数内 `this` 指向的显式绑定方法，且都不会改变原函数本身。\n\n**核心区别**：\n\n1. **执行时机**：`call`、`apply` 调用后立即执行函数，`bind` 返回一个绑定了 `this` 的新函数，需手动调用新函数才会执行。\n2. **参数传递**：`call`、`bind` 接收参数列表（逐个传参），`apply` 接收参数数组（或类数组）。\n\n## 原型链\n\n每个函数都有一个 `prototype` 属性，指向自己的原型对象。每个 JavaScript 对象（除了 `null`）都有一个 `__proto__` 属性，它指向该对象的原型对象。原型对象本身也是一个对象，也有自己的 `__proto__` 属性，这样就形成了一条链式结构，即原型链。\n\n当访问一个对象的属性时，如果该对象本身没有这个属性，JavaScript 引擎会沿着原型链向上查找，直到找到该属性或者到达原型链的顶端（`Object.prototype`，其 `__proto__` 为 `null`）。\n\n原型链是 JavaScript 实现继承的主要方式，通过原型链，对象可以共享原型对象上的属性和方法，避免了重复定义，节省了内存空间，同时也实现了代码的复用。\n\n### Object 与 Function 的关系\n\n- **`Function` 是 `Object` 的实例**：在 JavaScript 中，`Function` 是一个内置的构造函数，所有函数都是 `Function` 的实例。而 `Function` 本身也是一个对象，所以 `Function` 是 `Object` 的实例。可以通过 `Function instanceof Object` 来验证，其结果为 `true`。这意味着 `Function` 可以访问 `Object.prototype` 上的属性和方法，如 `toString`、`valueOf` 等。\n- **`Object` 是 `Function` 的原型**：`Function.prototype` 是所有函数的原型对象，而 `Object` 函数的原型对象 `Object.prototype` 是 `Function.prototype` 的原型。即 `Function.prototype.__proto__ === Object.prototype`。这表明所有函数作为 `Function` 的实例，不仅可以访问 `Function.prototype` 上的属性和方法，还可以通过原型链访问 `Object.prototype` 上的属性和方法。\n- **相互依存**：`Object` 提供了基础的对象属性和方法，是所有对象（包括函数对象）的基础。而 `Function` 则是创建对象和定义行为的重要工具，通过函数可以创建自定义对象，并通过原型链来实现继承和属性共享。\n\n## 原型链的尽头是什么？\n\n原型链的尽头是 `Object.prototype`：所有对象的原型链最终都会指向 `Object.prototype`，它是 JavaScript 中所有对象（除了 `null`）的通用原型对象。\n\n`Object.prototype` 提供了一些基础的属性和方法，如 `toString`、`hasOwnProperty` 等。而 `Object.prototype.__proto__` 的值为 `null`，当在原型链查找属性时到达 `Object.prototype` 且未找到目标属性，并且 `Object.prototype.__proto__` 为 `null`，则停止查找，表明该属性不存在。\n\n## 如何通过原型链实现继承？\n\n- **原型继承**：通过将一个构造函数的原型对象设置为另一个构造函数的实例来实现继承。例如，`Dog.prototype = new Animal();`，这样 `Dog` 的实例就可以通过原型链访问 `Animal.prototype` 上的属性和方法，实现了 `Dog` 对 `Animal` 的继承。可以共享属性和方法，但无法向父构造方法传参。适用于属性和方法需要被多个子实例共享，且不需要在创建子实例时动态初始化父类属性的场景。\n- **借用构造函数继承**：在子构造函数内部调用父构造函数，并通过 `call` 或 `apply` 方法绑定 `this`。可以传参初始化，且子实例有自己的属性副本。但只能继承父构造函数内部定义的属性和方法，无法继承父构造函数原型对象上的方法。\n- **组合继承**：将原型继承和借用构造函数继承结合起来。结合了原型继承和构造函数继承的优点。通过构造函数继承可以向父构造函数传递参数初始化属性，通过原型继承可以让子实例共享父构造函数原型对象上的方法，实现了更完整的继承。\n\n### **proto** 和 prototype\n\n`__proto__` 和 `prototype` 是 JavaScript 原型系统中两个关键概念。\n\n- `prototype` 是函数特有的属性，用于定义由该函数创建的实例对象可共享的属性和方法。\n- `__proto__` 是每个对象（除 `null` 外）都有的属性，指向该对象的原型对象，通过它形成原型链，实现属性和方法的继承与查找。\n\n当使用 `new` 关键字调用构造函数创建实例时，新创建的实例对象的 `__proto__` 属性会指向构造函数的 `prototype` 所指向的对象。这意味着实例对象可以访问原型对象上的属性和方法，实现属性和方法的共享。\n\n## 为什么要使用 prototype 来定义共享属性和方法，而不是直接在构造函数内部定义？\n\n- **节省内存**：如果在构造函数内部定义属性和方法，每个实例都会拥有这些属性和方法的独立副本，会浪费大量内存。\n- **便于维护和扩展**：在 `prototype` 上定义属性和方法，只需要修改原型对象，所有实例都会受到影响。\n\n## 什么是作用域、作用域链？\n\n- **作用域**：变量和函数的可访问范围。包括全局作用域、函数作用域、块级作用域（ES6）。\n- **作用域链**：在当前作用域找不到变量，就往外层作用域找，形成一条链。\n\n## 垃圾回收\n\n在 JavaScript 中，垃圾回收（Garbage Collection，GC）是一种自动内存管理机制。其主要作用是识别并回收那些不再被程序使用的对象所占用的内存空间，从而避免内存泄漏，保证程序的高效运行。\n\n### 标记清除算法（Mark-and-Sweep）\n\n**标记阶段**：垃圾回收器从一组根对象（如全局变量、当前调用栈中的变量等）开始，递归地标记所有从根对象可达的对象。这些可达对象是程序在运行过程中仍然需要使用的对象。\n\n**清除阶段**：标记完成后，垃圾回收器会遍历堆内存，回收所有未被标记的对象所占用的内存空间。这些未被标记的对象就是不可达对象，意味着程序不再有任何途径访问到它们，它们所占用的内存可以被释放。\n\n### 引用计数算法（Reference Counting）\n\n引用计数是另一种垃圾回收算法，它为每个对象维护一个引用计数。当一个对象被其他对象引用时，其引用计数加 1；当对该对象的引用被移除时，引用计数减 1。当对象的引用计数变为 0 时，说明该对象不再被任何其他对象引用，垃圾回收器会回收该对象所占用的内存。\n\n**循环引用问题**：当两个或多个对象相互引用形成一个闭环，而它们与根对象没有直接或间接的连接时，尽管这些对象实际上已经无法从根对象访问到，但由于它们之间相互引用，引用计数永远不会变为 0，导致内存无法被回收。\n\n### 分代垃圾回收（Generational Garbage Collection）\n\n这是 JS 当前使用的垃圾回收算法。现代 JavaScript 引擎通常采用分代垃圾回收策略，它基于这样一个观察：大多数对象在创建后很快就不再被使用，而少数对象会存活较长时间。因此，将堆内存分为不同的代（通常分为新生代和老生代）。\n\n**新生代回收**：\n\n- 新生代存储新创建的对象。\n- 由于大多数对象生命周期较短，新生代的垃圾回收频率相对较高。\n- 新生代通常采用复制算法，将新生代空间分为两个相等的区域：使用区（From）和空闲区（To）。\n- 当使用区快满时，垃圾回收器会标记使用区中的存活对象，并将它们复制到空闲区，然后清空使用区。\n- 之后，From 区和 To 区的角色互换。\n\n**老生代回收**：\n\n- 老生代存储存活时间较长的对象。\n- 由于这些对象存活时间长，垃圾回收频率相对较低。\n- 老生代一般采用标记清除或标记整理算法。\n- 标记整理算法在标记清除的基础上，会将存活对象移动到内存的一端，以减少内存碎片。\n\n## JavaScript 引擎如何确定垃圾回收的时机？\n\nJavaScript 引擎通常根据内存使用情况和对象的生命周期来确定垃圾回收时机。当堆内存使用率达到一定阈值（不同引擎阈值不同）时，会触发垃圾回收。\n\n- 对于新生代，由于对象生命周期短，使用区快满时就会进行回收。\n- 老生代回收频率较低，除了内存使用阈值外，还会考虑对象存活时间等因素，当满足特定条件时进行回收，以平衡垃圾回收开销和程序性能。\n\n## 什么是模块化？CommonJS 和 ES6 模块区别？\n\n模块化是一种将程序分解为独立的、可复用的模块的编程理念。每个模块都有自己独立的作用域，包含一组相关的变量、函数、类等代码单元。模块之间通过特定的接口进行通信和交互，提高了代码的可维护性、可复用性以及开发效率。\n\n### CommonJS 模块\n\n**诞生背景**：CommonJS 是为了解决 JavaScript 在非浏览器环境（如 Node.js）中的模块化问题而产生的。在 Node.js 环境下，需要一种机制来组织和管理代码，使代码更具结构化和可维护性。\n\n**使用方式**：在 Node.js 中，使用 `exports` 或 `module.exports` 来暴露模块的接口。\n\n**特点**：\n\n- **同步加载**：在 Node.js 环境下，`require` 是同步加载模块的。这意味着在模块被引入时，会阻塞后续代码的执行，直到模块被完全加载并执行完毕。\n- **值的拷贝**：当一个模块被 `require` 引入时，获取的是被引入模块导出对象的拷贝。如果被引入模块内部对导出对象进行修改，不会影响到引入模块中该对象的值。\n\n### ES6 模块\n\n**诞生背景**：随着 JavaScript 在浏览器端应用的复杂度不断提高，原生的 JavaScript 缺乏统一的模块化方案。ES6（ES2015）引入了模块系统，为浏览器和其他 JavaScript 环境提供了标准化的模块化支持，使 JavaScript 代码的组织和管理更加规范。\n\n**使用方式**：使用 `export` 关键字来导出模块内容，使用 `import` 关键字来导入模块。\n\n**特点**：\n\n- **异步加载**：在浏览器环境中，ES6 模块默认是异步加载的，不会阻塞页面的渲染。这使得多个模块可以并行加载，提高页面的加载性能。\n- **动态绑定**：ES6 模块导入的是值的引用，而不是拷贝。这意味着如果被导入模块内部对导出的值进行修改，导入模块中对应的值也会随之改变。\n\n### CommonJS 和 ES6 模块的区别\n\n| 维度         | CommonJS                                          | ES6 模块                                                         |\n| ------------ | ------------------------------------------------- | ---------------------------------------------------------------- |\n| **加载方式** | 同步加载，适用于服务器端                          | 浏览器环境下默认异步加载，不阻塞页面渲染                         |\n| **导出导入** | `exports` / `module.exports` 导出，`require` 导入 | `export` 导出，`import` 导入                                     |\n| **值的传递** | 导出的值是拷贝，模块内部修改不影响导入模块        | 导出的值是引用，模块内部修改会反映在导入模块中                   |\n| **顶层对象** | 顶层对象是 `module.exports`                       | 没有类似的顶层对象，通过 `export` 和 `import` 直接定义和使用接口 |\n\n## ES6 模块的异步加载是如何实现的？\n\n浏览器在解析到 `import` 语句时，会创建一个新的请求来加载相应的模块文件。这个请求是异步的，不会阻塞页面的渲染和解析。浏览器会并行处理多个 `import` 请求，提高加载效率。在模块加载完成后，浏览器会解析和执行模块的代码。\n\n同时，ES6 模块还支持动态导入（`import()`），这是一种更加灵活的异步导入方式，可以在代码执行过程中根据条件动态地导入模块，进一步优化加载策略。\n\n## Object.is() 和 === 区别？\n\n- `Object.is(NaN, NaN)` 返回 `true`；`NaN === NaN` 返回 `false`。\n- `Object.is(+0, -0)` 返回 `false`；`+0 === -0` 返回 `true`。\n\n## 什么是 arguments？\n\n在 JavaScript 函数中，`arguments` 是一个类数组对象（array-like object），它包含了调用函数时传入的所有参数。它不是一个真正的数组，没有数组的完整方法（如 `map`、`filter` 等），但可以通过索引来访问其元素，并且有一个 `length` 属性来表示参数的数量。\n\n`arguments` 允许函数处理不定数量的参数。这在编写通用函数或需要处理可变参数列表的场景中非常有用。\n\n## 为什么 arguments 不是一个真正的数组？\n\n`arguments` 虽然具有类似数组的索引和 `length` 属性，但它的原型并非 `Array.prototype`，所以它没有数组的完整方法，如 `map`、`filter` 等。\n\n它是 JavaScript 为了实现函数可变参数功能而设计的一种类数组对象，与真正的数组在本质上有所不同，主要是为了满足特定的函数参数处理需求。\n\n## arguments 对象在箭头函数中有什么特点？\n\n箭头函数本身没有 `arguments` 对象。当在箭头函数中访问 `arguments` 时，它会从外层作用域（如果存在普通函数）继承 `arguments` 对象。\n\n这是因为箭头函数没有自己的 `this`、`arguments`、`super` 和 `new.target` 绑定，这些值由外层作用域决定。\n\n## forEach / for...in / for...of 区别？\n\n### 遍历对象类型\n\n- **`forEach`**：主要用于遍历数组。\n- **`for...in`**：通常用于遍历对象的可枚举属性，包括原型链上的可枚举属性（但一般不建议遍历原型链属性，因为可能会得到意外结果）。也可以用于数组，但它遍历得到的是数组的索引（是字符串类型），而非真正意义上遍历数组元素，可能会出现意外情况，比如如果数组对象上定义了非索引的可枚举属性，也会被遍历到。\n- **`for...of`**：用于遍历可迭代对象，如数组、字符串、`Set`、`Map` 等。它直接迭代对象的元素，而不是像 `for...in` 那样迭代对象的属性名。\n\n### 迭代过程控制\n\n- **`forEach`**：不能使用 `break`、`continue` 语句来中断循环，只能通过抛出异常来停止。因为它是基于回调函数的遍历，没有像传统循环那样的明确循环体结构。\n- **`for...in`**：可以使用 `break`、`continue` 语句来控制循环流程，因为它本质上是一种循环结构。\n- **`for...of`**：同样可以使用 `break`、`continue` 语句来控制循环。\n\n### 性能\n\n- **`forEach`**：由于其内部机制和函数调用开销，在性能上一般不如 `for` 循环，特别是在处理大数据量数组时。\n- **`for...in`**：在遍历数组时性能比 `for` 循环差，因为它获取的是对象属性，需要额外的属性查找和转换操作，而且还可能遍历到意外的属性。\n- **`for...of`**：性能和 `for` 循环相近，在现代 JavaScript 引擎优化下，对于可迭代对象的遍历效率较高。\n\n## 数组的方法中，哪些是修改原数组的，哪些是返回一个新数组的？\n\n- **修改原数组的方法**：`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`\n- **返回新数组的方法**：`concat`、`slice`、`map`、`filter`、`reduce`、`reduceRight`、`flat`、`flatMap`\n\n### 修改原数组的方法（Mutator 方法）\n\n这类方法会直接改变调用它们的数组本身，返回值通常不是新数组（多是长度、被删元素等）。\n\n| 方法名         | 作用                                               | 返回值                       |\n| -------------- | -------------------------------------------------- | ---------------------------- |\n| `push()`       | 向数组末尾添加一个/多个元素                        | 数组新长度                   |\n| `pop()`        | 删除数组最后一个元素                               | 被删除的元素                 |\n| `unshift()`    | 向数组开头添加一个/多个元素                        | 数组新长度                   |\n| `shift()`      | 删除数组第一个元素                                 | 被删除的元素                 |\n| `splice()`     | 增/删/改数组元素（最灵活的修改方法）               | 被删除元素组成的数组         |\n| `sort()`       | 对数组元素排序（默认按字符串 Unicode 码点排序）    | 排序后的原数组（原数组已变） |\n| `reverse()`    | 反转数组元素顺序                                   | 反转后的原数组（原数组已变） |\n| `fill()`       | 用指定值填充数组（可指定填充范围）                 | 修改后的原数组               |\n| `copyWithin()` | 复制数组中指定位置的元素到另一位置（覆盖原有元素） | 修改后的原数组               |\n\n### 返回新数组的方法（Accessor 方法）\n\n这类方法不会修改原数组，而是基于原数组生成并返回一个全新的数组，原数组始终保持不变（函数式编程的核心特性）。\n\n| 方法名      | 作用                                             | 返回值                     |\n| ----------- | ------------------------------------------------ | -------------------------- |\n| `map()`     | 遍历数组，对每个元素执行回调，返回处理后的新数组 | 新数组（长度和原数组一致） |\n| `filter()`  | 遍历数组，过滤出符合条件的元素                   | 符合条件的元素组成的新数组 |\n| `slice()`   | 截取数组的指定范围（不包含结束索引）             | 截取的新数组               |\n| `concat()`  | 拼接多个数组/值，生成新数组                      | 拼接后的新数组             |\n| `flat()`    | 将多维数组扁平化（指定深度，默认 1 层）          | 扁平化后的新数组           |\n| `flatMap()` | 先执行 `map`，再执行 `flat(1)`                   | 扁平化后的新数组           |\n\n## 如何判断是否为可迭代对象？\n\n可迭代对象（Iterable）是指实现了迭代器协议的对象（如数组、字符串、`Set`、`Map`、`Generator` 对象）。\n\n判断方法：可迭代对象必须具有 `Symbol.iterator` 属性，且该属性是一个无参数函数，返回迭代器（Iterator）对象（有 `next()` 方法）。\n\n## 如何将可迭代对象转为数组？\n\n1. 扩展运算符（`...`）\n2. `Array.from()`\n3. `Array.prototype.slice.call()`\n4. `for...of` 循环手动收集\n\n## Promise、async、await\n\n`Promise`、`async`、`await` 是 JavaScript 中用于处理异步操作的重要特性。`Promise` 是一种异步操作的解决方案，它将异步操作以同步操作的流程表达出来，避免了回调地狱。`async` 和 `await` 则是建立在 `Promise` 基础之上的语法糖，进一步简化了异步代码的书写，使异步代码看起来更像同步代码，提高了代码的可读性和可维护性。\n\n### Promise\n\n**定义**：`Promise` 是一个表示异步操作最终完成（或失败）及其结果的对象。它有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。状态一旦改变，就不会再变，从 `pending` 变为 `fulfilled` 或 `rejected`。\n\n**使用方式**：创建 `Promise` 对象时，传入一个执行器函数，该函数接收 `resolve` 和 `reject` 两个参数。`resolve` 用于将 `Promise` 的状态从 `pending` 变为 `fulfilled`，并传递成功的值；`reject` 用于将状态变为 `rejected`，并传递失败的原因。\n\n`Promise` 对象有两个方法：`then` 方法用于处理 `Promise` 成功的情况，`catch` 方法用于捕获 `Promise` 失败的情况。`then` 方法返回一个新的 `Promise`，可以链式调用多个 `then` 方法。\n\n### async\n\n**定义**：`async` 函数是一种异步函数，它返回一个 `Promise` 对象。`async` 函数内部可以使用 `await` 关键字暂停函数执行，等待 `Promise` 被解决（resolved 或 rejected）。\n\n**使用方式**：定义 `async` 函数时，在函数声明前加上 `async` 关键字。\n\n### await\n\n`await` 只能在 `async` 函数内部使用，它用于等待一个 `Promise` 对象。`await` 会暂停 `async` 函数的执行，直到 `Promise` 被解决（resolved 或 rejected），然后返回 `Promise` 的解决值。\n\n## 浏览器事件循环\n\n**执行栈**：JavaScript 是单线程语言，所有同步任务都在执行栈中按照顺序执行。当函数被调用时，它会被压入执行栈，执行完毕后从执行栈弹出。\n\n**任务队列**：异步任务不会立即进入执行栈，而是进入任务队列。任务队列分为宏任务队列和微任务队列。\n\n- **宏任务**包括 `setTimeout`、`setInterval`、`setImmediate`（仅在 Node.js 环境）、I/O 操作、UI 渲染等。\n- **微任务**包括 `Promise.then`、`process.nextTick`（仅在 Node.js 环境）、`MutationObserver` 等。\n\n### 事件循环过程\n\n1. 首先，执行同步任务，执行栈为空时，事件循环开始工作。\n2. 事件循环优先处理微任务队列，会不断从微任务队列中取出任务放入执行栈执行，直到微任务队列为空。\n3. 微任务队列处理完毕后，事件循环从宏任务队列中取出一个宏任务放入执行栈执行。\n4. 宏任务执行完毕后，事件循环再次检查微任务队列并处理其中的任务，如此循环往复。\n\n需要注意的是，每次宏任务执行完毕后都会检查微任务队列，而不是等宏任务队列全部执行完。\n\n```javascript\nconsole.log(\"开始\");\nsetTimeout(() => {\n  console.log(\"setTimeout回调1\");\n  Promise.resolve().then(() => {\n    console.log(\"Promise回调1\");\n  });\n}, 0);\nsetTimeout(() => {\n  console.log(\"setTimeout回调2\");\n  Promise.resolve().then(() => {\n    console.log(\"Promise回调2\");\n  });\n}, 0);\nconsole.log(\"结束\");\n// 输出：开始 结束 setTimeout回调1 Promise回调1 setTimeout回调2 Promise回调2\n```\n\n这里第一个 `setTimeout` 回调执行完毕后，会先处理其内部产生的微任务（`Promise` 回调1），然后再执行第二个 `setTimeout` 回调及其内部的微任务。\n\n## 为什么要区分宏任务和微任务？\n\n- **控制任务优先级**：微任务的优先级高于宏任务，这使得一些重要的异步操作（如 `Promise` 的回调）能够在当前宏任务结束后尽快执行，避免等待下一个宏任务周期。例如，在处理一些需要及时反馈的用户交互（如点击按钮后更新 UI 的部分逻辑通过 `Promise` 实现），微任务可以在当前操作结束后迅速执行，提高用户体验。\n- **保证数据一致性**：在宏任务执行过程中，可能会产生多个微任务。将微任务集中在宏任务执行完毕后统一处理，可以确保在处理微任务时，相关的数据状态是稳定的，避免数据不一致问题。例如，在 DOM 操作的 `MutationObserver`（微任务）中，它能在 DOM 变化相关的宏任务执行完毕后，准确获取到最新的 DOM 状态。\n\n## 什么是事件冒泡和事件捕获？\n\n**核心定义**：\n\n- **事件冒泡**是事件从触发的目标元素开始，逐级向上传播至父级、祖先元素的过程，是 DOM 事件流的默认响应阶段。\n- **事件捕获**是事件从最外层祖先元素开始，逐级向下传播至目标元素的过程，是 DOM 事件流的前置阶段。\n\n**执行顺序**：完整 DOM 事件流为\"捕获阶段 → 目标阶段 → 冒泡阶段\"，日常开发中未特殊指定时，事件监听默认响应冒泡阶段。\n\n**触发控制**：\n\n- 通过 `addEventListener` 第三个参数控制触发阶段，`true` 为捕获阶段触发，`false`（默认）为冒泡阶段触发。\n- 可通过 `stopPropagation()` 阻止事件继续传播（冒泡/捕获）。\n\n## 浏览器渲染流程\n\n### 1. 加载资源\n\n浏览器从网络获取 HTML、CSS 和 JavaScript 等文件。先请求 HTML，在解析 HTML 过程中，如果遇到外部 CSS 和 JavaScript 的引用，会并行发起请求去获取这些资源。\n\n### 2. 解析 HTML 生成 DOM 树\n\n浏览器的 HTML 解析器按顺序读取 HTML 文档字符流，把它们转化为一个个的令牌，像标签令牌、属性令牌等。依据这些令牌构建 DOM 树，树的每个节点对应文档中的一个元素，比如 `<html>` 是根节点，`<body>`、`<div>` 等是其子节点，反映文档的层次结构。\n\n这里在源码里对应的是 HTML Tokenizer 函数。HTML 文档不是一次性解析完成的，而是分段解析的，这个过程也被称为渐进式渲染。浏览器会先解析拆分后的 Token，如果是 DOM 结构，就创建 DOM 对象，如果是 `Script` 或者 `Style` 标签，就去解析执行它们。当执行完成一段到空白字符、换行符等中断点，会进行判断，如果当前解析任务时间超过了一定阈值，就会中断，让出主线程根据 CSSOM 合成的 Render 树去到 CC 渲染。\n\n### 3. 解析 CSS 生成 CSSOM 树\n\n浏览器同时解析 CSS 样式规则，无论是内联样式还是外部 CSS 文件引入的规则。解析后生成 CSSOM 树，树的每个节点代表一个 CSS 规则集，包含选择器及其对应的样式属性，用来确定每个 DOM 元素的样式。\n\n### 4. 构建渲染树\n\n浏览器把 DOM 树和 CSSOM 树结合起来构建渲染树。渲染树只包含需要显示的节点及其样式信息，比如 `display: none` 的元素不会在渲染树中。渲染树的节点是渲染对象，每个渲染对象关联一个 DOM 元素，并带有该元素的样式。\n\n### 5. 布局计算\n\n渲染树构建好后，浏览器进行布局计算。基于盒模型，把每个渲染对象看作一个盒子，计算其在文档流中的位置、宽度、高度、边距、边框等属性，从而确定每个节点在页面中的位置和大小。\n\n这一步和后续的步骤都会在浏览器的 CC 线程执行，也就是 Chrome Compositor。\n\n### 6. 绘制\n\n布局完成后进入绘制阶段。浏览器将渲染树中的每个渲染对象转化为屏幕上的实际像素，按层绘制。根据元素的堆叠顺序，先绘制背景层，接着文本层、图片层等，依据元素样式进行具体绘制。\n\n### 7. 合成\n\n绘制完成后，浏览器把各个层的内容合成为最终的屏幕图像。合成时考虑层的堆叠顺序和透明度等属性，将不同层的像素信息合并，确定最终显示在屏幕上的像素值。\n\n## Compositor 线程与主线程是如何协作的？\n\n- **信息传递**：主线程在完成 HTML 解析、CSS 计算、JavaScript 执行以及渲染树构建等操作后，会将页面的图层信息传递给 Compositor 线程。这些信息包括每个图层的几何信息（位置、大小）、样式信息（透明度、可见性等）以及内容信息等。\n- **事件处理协作**：当页面发生一些事件，如用户滚动、点击等，主线程首先接收这些事件。对于一些涉及动画和滚动的事件，主线程会将相关信息传递给 Compositor 线程进行处理，以实现流畅的动画和滚动效果。同时，Compositor 线程在合成过程中如果需要一些额外的信息，也可能会向主线程请求。\n- **避免阻塞**：主线程处理的任务可能会比较耗时，如果主线程被阻塞，可能会影响 Compositor 线程的工作。为了避免这种情况，Chrome 浏览器采用了一些优化策略，如将一些耗时任务（如 JavaScript 的长时间运行脚本）进行限制或异步处理，确保主线程能够及时向 Compositor 线程传递必要的信息，保证合成操作的顺利进行。\n\n## 哪些操作会触发 Compositor 线程的工作？\n\n- **动画操作**：当页面中有 CSS 动画或 JavaScript 驱动的动画时，会触发 Compositor 线程的工作。例如，通过 CSS 的 `transform` 属性实现的元素移动、缩放、旋转动画，Compositor 线程会在动画每一帧更新时，根据新的位置和状态对图层进行合成，以显示动画效果。\n- **滚动操作**：用户在页面上进行滚动时，无论是通过鼠标滚轮、触摸手势还是键盘操作，都会触发 Compositor 线程。Compositor 线程需要快速调整各个图层的显示位置，将新的可见区域的图层进行合成并显示，确保滚动的流畅性。\n- **图层属性变化**：当页面中图层的一些属性发生变化，如透明度、可见性、`z-index`（层级顺序）等，会触发 Compositor 线程重新进行合成。例如，通过 JavaScript 动态改变一个元素的透明度，Compositor 线程需要根据新的透明度值重新计算图层的混合效果，进行合成操作。\n- **页面初次渲染**：在页面初次加载完成后，主线程构建好渲染树并将图层信息传递给 Compositor 线程，Compositor 线程开始进行合成操作，将各个图层合成为最终的页面图像并显示在屏幕上。\n\n## 如何优化 Compositor 线程的性能？\n\n- **合理使用图层**：开发者可以通过 CSS 属性（如 `will-change`）提示浏览器哪些元素可能会发生变化，让浏览器提前将这些元素分配到单独的图层，便于 Compositor 线程进行优化处理。例如，对于一个会频繁进行动画的元素，设置 `will-change: transform`，浏览器可能会将其单独作为一个图层，在动画过程中，Compositor 线程可以更高效地处理该图层，而不需要重新计算和合成整个页面。\n- **避免复杂的合成操作**：尽量减少使用透明度、滤镜等复杂的样式属性，因为这些属性在合成过程中可能会增加 Compositor 线程的计算量。例如，过多使用具有透明度的元素叠加，会使 Compositor 线程在合成时需要进行大量的混合计算，影响性能。如果必须使用，可以尝试通过优化元素的层级结构或使用硬件加速的方式来减轻计算负担。\n- **优化动画和滚动效果**：对于动画和滚动操作，尽量使用硬件加速的属性，如 `transform` 和 `opacity`。这些属性的变化可以由 Compositor 线程直接处理，而不需要主线程重新进行布局和绘制。例如，通过 `transform` 实现元素的平移动画，比通过修改 `left` 和 `top` 属性实现更高效，因为后者可能会触发回流和重绘，增加主线程的负担，进而影响 Compositor 线程的性能。同时，合理控制动画的帧率和复杂度，避免过度复杂的动画导致 Compositor 线程性能下降。\n\n## 浏览器本地存储的方式\n\n### 1. localStorage\n\n**定义**：`localStorage` 是一种持久化的本地存储机制，存储的数据会一直保留在客户端，除非通过 JavaScript 代码手动删除或用户主动清除浏览器缓存。\n\n**使用方式**：\n\n- **存储数据**：使用 `setItem` 方法，接受两个参数，键（key）和值（value）。例如：`localStorage.setItem('username', 'John');`\n- **获取数据**：通过 `getItem` 方法，传入键名获取对应的值。如 `const username = localStorage.getItem('username');`\n- **删除数据**：使用 `removeItem` 方法，传入要删除的键名，如 `localStorage.removeItem('username');`\n- **清除所有数据**：使用 `clear` 方法，`localStorage.clear();` 会删除 `localStorage` 中存储的所有数据。\n\n**特点**：\n\n- **数据持久化**：关闭浏览器窗口或重新打开浏览器，数据依然存在。\n- **同源策略**：遵循同源策略，不同源的页面不能共享 `localStorage` 数据。这里的同源是指协议、域名、端口都相同。\n- **存储容量**：一般来说，不同浏览器的存储容量限制有所不同，但大致在 5MB 左右。\n- **仅在客户端**：数据仅存储在客户端，不会随着 HTTP 请求发送到服务器。\n\n### 2. sessionStorage\n\n**定义**：`sessionStorage` 用于临时存储数据，数据仅在当前会话（session）期间有效，当页面关闭时，数据会被清除。这里的会话通常指的是在同一个浏览器标签页中打开页面到关闭该标签页的过程。\n\n**使用方式**：与 `localStorage` 类似，同样有 `setItem`、`getItem`、`removeItem` 和 `clear` 方法。例如：`sessionStorage.setItem('token', '12345');` 存储一个临时令牌，`const token = sessionStorage.getItem('token');` 获取该令牌。\n\n**特点**：\n\n- **会话级存储**：数据的生命周期仅限于当前会话，这使得它适用于存储一些临时数据，如多步骤表单填写过程中的中间数据，确保用户在同一页面会话中数据不丢失，关闭标签页后数据自动清除。\n- **同源策略**：同样遵循同源策略，不同源的页面无法访问彼此的 `sessionStorage` 数据。\n- **存储容量**：与 `localStorage` 类似，存储容量一般也在 5MB 左右。\n- **仅在客户端**：数据仅存在于客户端，不会发送到服务器。\n\n### 3. Cookies\n\n**定义**：Cookies 是一种存储在用户计算机上的小文件，由服务器发送到浏览器，浏览器会在后续的请求中将 Cookies 发送回服务器。它不仅可以在客户端存储数据，还能在客户端和服务器之间传递数据。\n\n**使用方式**：\n\n- **创建 Cookie**：在 JavaScript 中可以通过 `document.cookie` 属性来创建、读取和修改 Cookies。例如，`document.cookie = 'username=John; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/';` 创建一个名为 `username` 的 Cookie，设置了过期时间和路径。\n- **读取 Cookie**：`const cookies = document.cookie;` 会返回一个包含所有 Cookies 的字符串，需要进一步解析才能获取具体的键值对。\n- **修改 Cookie**：可以通过重新设置相同名称的 Cookie 来修改其值，例如 `document.cookie = 'username=Jane; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/';`\n- **删除 Cookie**：通过设置一个过去的过期时间来删除 Cookie，如 `document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';`\n\n**特点**：\n\n- **服务器交互**：Cookies 会在每次 HTTP 请求时被发送到服务器，这使得服务器可以识别用户状态等信息，但也增加了请求的大小。\n- **过期时间**：可以设置 Cookie 的过期时间，分为会话 Cookie（未设置过期时间，关闭浏览器即失效）和持久化 Cookie（设置了过期时间，在过期前一直有效）。\n- **同源策略**：遵循同源策略，不同源的页面不能访问彼此的 Cookies。同时，还有一些其他的限制，如 `domain` 和 `path` 属性可以进一步限制 Cookie 的访问范围。\n- **存储容量**：单个 Cookie 的大小一般限制在 4KB 左右，每个域名下的 Cookie 数量也有限制，不同浏览器有所不同。\n\n### 4. IndexedDB\n\n**定义**：IndexedDB 是一种低级别的 API，用于在客户端存储大量结构化数据，它提供了一个基于事务的系统，允许异步访问数据库。\n\n**使用方式**：\n\n- **打开数据库**：使用 `window.indexedDB.open('myDatabase', 1);` 打开名为 `myDatabase` 的数据库，第二个参数是数据库版本号。\n- **创建对象仓库**：在 `onsuccess` 和 `onupgradeneeded` 事件中创建对象仓库。\n- **存储数据**：通过事务和对象仓库的 `add` 或 `put` 方法存储数据。\n- **获取数据**：通过事务和对象仓库的 `get` 方法获取数据。\n\n**特点**：\n\n- **大容量存储**：适合存储大量数据，比 `localStorage` 和 `sessionStorage` 的存储容量大得多。\n- **异步操作**：采用异步操作方式，不会阻塞主线程，适合处理大量数据的读写操作。\n- **复杂数据结构**：可以存储复杂的 JavaScript 对象，而不仅仅是字符串。\n- **同源策略**：遵循同源策略，不同源的页面不能访问彼此的 IndexedDB 数据库。\n\n## localStorage、sessionStorage 和 Cookies 有什么区别？\n\n| 维度             | `localStorage`                   | `sessionStorage`                 | Cookies                                            |\n| ---------------- | -------------------------------- | -------------------------------- | -------------------------------------------------- |\n| **数据生命周期** | 持久化存储，除非手动删除         | 仅当前会话有效，页面关闭即清除   | 可设置过期时间，分会话 Cookie 和持久化 Cookie      |\n| **存储容量**     | 约 5MB                           | 约 5MB                           | 单个约 4KB，数量有限制                             |\n| **服务器交互**   | 仅客户端存储，不随 HTTP 请求发送 | 仅客户端存储，不随 HTTP 请求发送 | 每次 HTTP 请求时发送到服务器                       |\n| **应用场景**     | 用户设置、主题偏好等长期数据     | 表单填写过程中的临时中间数据     | 客户端与服务器间传递用户状态（登录状态、购物车等） |\n\n## 在什么场景下应该使用 IndexedDB？\n\n- **大量数据存储**：当需要在客户端存储大量数据时，如离线应用中的大量缓存数据、本地数据库等，IndexedDB 的大容量存储特性使其成为理想选择。例如，一个离线地图应用可以使用 IndexedDB 存储地图数据，以便在离线状态下使用。\n- **复杂数据结构存储**：如果需要存储复杂的 JavaScript 对象，如包含多个属性和嵌套结构的对象，IndexedDB 能够很好地支持。例如，一个项目管理应用可能需要存储项目的详细信息，包括任务列表、成员信息等复杂结构，IndexedDB 可以方便地存储和检索这些数据。\n- **异步操作需求**：当对数据的读写操作可能会比较耗时，且不希望阻塞主线程时，IndexedDB 的异步操作方式能满足需求。例如，在进行大量数据的导入或导出操作时，使用 IndexedDB 可以在后台进行异步处理，不会影响页面的交互性。\n\n## 如何在不同页面之间共享 localStorage 数据？\n\n- **同源页面**：只要是同源的页面（协议、域名、端口相同），都可以访问和修改相同的 `localStorage` 数据。例如，在 `page1.html` 中存储数据 `localStorage.setItem('message', 'Hello');`，在同域名下的 `page2.html` 中可以通过 `localStorage.getItem('message');` 获取该数据。\n- **跨页面通信**：如果需要在不同页面之间实时同步 `localStorage` 数据的变化，可以结合 `window.addEventListener('storage', callback)` 事件。例如，在一个页面修改了 `localStorage` 数据，其他页面通过监听 `storage` 事件可以获取到数据的变化并进行相应处理。\n\n## 闭包及使用场景\n\n### 闭包的形成\n\n在 JavaScript 中，函数在定义时会创建一个词法环境，这个环境包含了函数定义时所在作用域的变量对象。当函数被调用时，会创建一个执行上下文，该执行上下文包含了对词法环境的引用。如果一个函数内部返回另一个函数，并且返回的函数引用了外部函数作用域中的变量，那么闭包就形成了。\n\n### 闭包的特性\n\n- **延长变量的生命周期**：外部函数执行完后，其局部变量本应被销毁，但由于闭包的存在，被内部函数引用的变量会一直保留在内存中，直到闭包不再被使用。\n- **访问外部作用域变量**：闭包可以访问其定义时所在作用域的变量，即使在外部作用域已经执行结束后，依然能够访问和操作这些变量。这使得闭包可以实现数据的封装和隐藏，外部代码无法直接访问闭包内部的变量，但可以通过闭包提供的函数接口来间接操作这些变量。\n\n### 闭包的使用场景\n\n- **数据封装与私有化**：在 JavaScript 中没有传统意义上的私有变量，但可以通过闭包来模拟私有变量。\n- **回调函数与事件处理**：在事件处理程序和回调函数中，闭包经常被使用。\n- **柯里化**：柯里化是一种将多参数函数转换为一系列单参数函数的技术，闭包在柯里化中起到关键作用。\n\n## 闭包会造成内存泄漏吗？为什么？\n\n**可能造成内存泄漏**：闭包可能会造成内存泄漏。因为闭包会延长变量的生命周期，使得被闭包引用的变量在不再需要时，由于仍然存在引用关系而无法被垃圾回收机制回收，从而导致内存占用不断增加，最终可能造成内存泄漏。例如，在一个频繁创建闭包且闭包中引用了大量数据的场景下，如果闭包没有被正确释放，就可能出现内存泄漏问题。\n\n**原因分析**：当一个闭包一直存在于内存中，并且它所引用的变量也一直被其持有，而这些变量实际上已经不再被程序的其他部分所需要，但由于闭包的引用关系，垃圾回收机制无法回收这些变量所占用的内存，从而导致内存泄漏。不过，现代 JavaScript 引擎对于闭包的内存管理有了很大的改进，会尽量检测并回收不再使用的闭包及其相关变量，但不合理地使用闭包仍然可能引发内存泄漏问题。\n\n## 如何避免闭包可能带来的内存泄漏问题？\n\n- **及时释放引用**：当闭包不再需要时，手动将闭包所引用的变量设置为 `null`，以解除引用关系，让垃圾回收机制能够回收相关内存。例如，如果不再需要 `counter` 对象，可以将其设置为 `null`，即 `counter = null;`，这样闭包及其引用的 `count` 变量就有可能被垃圾回收机制回收。\n- **合理使用闭包**：避免在不必要的情况下创建闭包，特别是在循环中或者频繁执行的函数中。如果必须使用闭包，尽量减少闭包所引用的变量数量和生命周期。例如，在事件处理程序中，如果只需要访问某个局部变量的当前值，可以在事件处理程序定义时将该值作为参数传递进去，而不是通过闭包引用，这样可以避免闭包对该变量的长期引用。\n\n## 浅拷贝和深拷贝\n\n### 浅拷贝\n\n浅拷贝只复制对象或数组的第一层属性或元素。对于引用类型（如对象、数组）的属性或元素，新对象或数组中保存的是原对象或数组中对应引用类型的引用，而不是其副本。所以当原对象或数组中的引用类型元素发生变化时，浅拷贝后的对象或数组中的对应元素也会变化。\n\n- **对象的浅拷贝**：可以使用 `Object.assign()` 方法，它将所有可枚举属性的值从一个或多个源对象复制到目标对象。\n- **数组的浅拷贝**：`slice()` 方法和 `concat()` 方法可用于数组的浅拷贝。\n\n### 深拷贝\n\n- **使用 `JSON.parse(JSON.stringify())`**：这是一种简单的深拷贝方式。它先将对象或数组转换为 JSON 字符串，再将 JSON 字符串解析为新的对象或数组。但 JSON 格式不支持存储函数，当使用 `JSON.stringify()` 转换包含函数的对象时，函数会被忽略。\n- **手动实现深拷贝函数**：通过递归的方式遍历对象或数组的所有层级，为每个层级的引用类型创建新的副本。\n\n## JS 处理超过 Number 最大值的数\n\n- 使用 `BigInt`\n- 使用第三方库 `math.js`\n\n## BigInt 与 Number 在运算性能上有什么区别？\n\n- **`Number` 运算性能**：`Number` 类型的运算在现代 JavaScript 引擎中经过高度优化，对于在 `Number.MAX_SAFE_INTEGER` 范围内的整数和浮点数运算，速度非常快。因为引擎可以利用底层硬件的指令集来进行快速计算，例如 CPU 的浮点运算单元可以高效处理 `Number` 类型的运算。\n- **`BigInt` 运算性能**：`BigInt` 的运算性能相对较低。由于 `BigInt` 用于处理大数，其实现方式与 `Number` 不同，不能直接利用底层硬件的浮点数运算指令。`BigInt` 的运算通常需要更多的内存和计算资源，因为它要处理不定长度的整数。例如，在进行大整数乘法时，`BigInt` 需要采用更复杂的算法来确保精度，这比 `Number` 类型的乘法运算要慢很多。所以在处理不超过 `Number.MAX_SAFE_INTEGER` 的数时，优先使用 `Number` 类型以获得更好的性能；而在需要处理超过该值的大数时，虽然 `BigInt` 性能较低，但能保证运算的精确性。\n",
    "headings": [
      {
        "depth": 1,
        "text": "JavaScript",
        "slug": "javascript"
      },
      {
        "depth": 2,
        "text": "ES6 有哪些常用新特性？",
        "slug": "es6-有哪些常用新特性"
      },
      {
        "depth": 2,
        "text": "typeof 能判断哪些类型？",
        "slug": "typeof-能判断哪些类型"
      },
      {
        "depth": 3,
        "text": "instanceof 原理",
        "slug": "instanceof-原理"
      },
      {
        "depth": 2,
        "text": "this 指向规则？",
        "slug": "this-指向规则"
      },
      {
        "depth": 2,
        "text": "call / apply / bind 区别？",
        "slug": "call-apply-bind-区别"
      },
      {
        "depth": 2,
        "text": "原型链",
        "slug": "原型链"
      },
      {
        "depth": 3,
        "text": "Object 与 Function 的关系",
        "slug": "object-与-function-的关系"
      },
      {
        "depth": 2,
        "text": "原型链的尽头是什么？",
        "slug": "原型链的尽头是什么"
      },
      {
        "depth": 2,
        "text": "如何通过原型链实现继承？",
        "slug": "如何通过原型链实现继承"
      },
      {
        "depth": 3,
        "text": "**proto** 和 prototype",
        "slug": "proto-和-prototype"
      },
      {
        "depth": 2,
        "text": "为什么要使用 prototype 来定义共享属性和方法，而不是直接在构造函数内部定义？",
        "slug": "为什么要使用-prototype-来定义共享属性和方法而不是直接在构造函数内部定义"
      },
      {
        "depth": 2,
        "text": "什么是作用域、作用域链？",
        "slug": "什么是作用域作用域链"
      },
      {
        "depth": 2,
        "text": "垃圾回收",
        "slug": "垃圾回收"
      },
      {
        "depth": 3,
        "text": "标记清除算法（Mark-and-Sweep）",
        "slug": "标记清除算法mark-and-sweep"
      },
      {
        "depth": 3,
        "text": "引用计数算法（Reference Counting）",
        "slug": "引用计数算法reference-counting"
      },
      {
        "depth": 3,
        "text": "分代垃圾回收（Generational Garbage Collection）",
        "slug": "分代垃圾回收generational-garbage-collection"
      },
      {
        "depth": 2,
        "text": "JavaScript 引擎如何确定垃圾回收的时机？",
        "slug": "javascript-引擎如何确定垃圾回收的时机"
      },
      {
        "depth": 2,
        "text": "什么是模块化？CommonJS 和 ES6 模块区别？",
        "slug": "什么是模块化commonjs-和-es6-模块区别"
      },
      {
        "depth": 3,
        "text": "CommonJS 模块",
        "slug": "commonjs-模块"
      },
      {
        "depth": 3,
        "text": "ES6 模块",
        "slug": "es6-模块"
      },
      {
        "depth": 3,
        "text": "CommonJS 和 ES6 模块的区别",
        "slug": "commonjs-和-es6-模块的区别"
      },
      {
        "depth": 2,
        "text": "ES6 模块的异步加载是如何实现的？",
        "slug": "es6-模块的异步加载是如何实现的"
      },
      {
        "depth": 2,
        "text": "Object.is() 和 === 区别？",
        "slug": "objectis-和-区别"
      },
      {
        "depth": 2,
        "text": "什么是 arguments？",
        "slug": "什么是-arguments"
      },
      {
        "depth": 2,
        "text": "为什么 arguments 不是一个真正的数组？",
        "slug": "为什么-arguments-不是一个真正的数组"
      },
      {
        "depth": 2,
        "text": "arguments 对象在箭头函数中有什么特点？",
        "slug": "arguments-对象在箭头函数中有什么特点"
      },
      {
        "depth": 2,
        "text": "forEach / for...in / for...of 区别？",
        "slug": "foreach-forin-forof-区别"
      },
      {
        "depth": 3,
        "text": "遍历对象类型",
        "slug": "遍历对象类型"
      },
      {
        "depth": 3,
        "text": "迭代过程控制",
        "slug": "迭代过程控制"
      },
      {
        "depth": 3,
        "text": "性能",
        "slug": "性能"
      },
      {
        "depth": 2,
        "text": "数组的方法中，哪些是修改原数组的，哪些是返回一个新数组的？",
        "slug": "数组的方法中哪些是修改原数组的哪些是返回一个新数组的"
      },
      {
        "depth": 3,
        "text": "修改原数组的方法（Mutator 方法）",
        "slug": "修改原数组的方法mutator-方法"
      },
      {
        "depth": 3,
        "text": "返回新数组的方法（Accessor 方法）",
        "slug": "返回新数组的方法accessor-方法"
      },
      {
        "depth": 2,
        "text": "如何判断是否为可迭代对象？",
        "slug": "如何判断是否为可迭代对象"
      },
      {
        "depth": 2,
        "text": "如何将可迭代对象转为数组？",
        "slug": "如何将可迭代对象转为数组"
      },
      {
        "depth": 2,
        "text": "Promise、async、await",
        "slug": "promiseasyncawait"
      },
      {
        "depth": 3,
        "text": "Promise",
        "slug": "promise"
      },
      {
        "depth": 3,
        "text": "async",
        "slug": "async"
      },
      {
        "depth": 3,
        "text": "await",
        "slug": "await"
      },
      {
        "depth": 2,
        "text": "浏览器事件循环",
        "slug": "浏览器事件循环"
      },
      {
        "depth": 3,
        "text": "事件循环过程",
        "slug": "事件循环过程"
      },
      {
        "depth": 2,
        "text": "为什么要区分宏任务和微任务？",
        "slug": "为什么要区分宏任务和微任务"
      },
      {
        "depth": 2,
        "text": "什么是事件冒泡和事件捕获？",
        "slug": "什么是事件冒泡和事件捕获"
      },
      {
        "depth": 2,
        "text": "浏览器渲染流程",
        "slug": "浏览器渲染流程"
      },
      {
        "depth": 3,
        "text": "1. 加载资源",
        "slug": "1-加载资源"
      },
      {
        "depth": 3,
        "text": "2. 解析 HTML 生成 DOM 树",
        "slug": "2-解析-html-生成-dom-树"
      },
      {
        "depth": 3,
        "text": "3. 解析 CSS 生成 CSSOM 树",
        "slug": "3-解析-css-生成-cssom-树"
      },
      {
        "depth": 3,
        "text": "4. 构建渲染树",
        "slug": "4-构建渲染树"
      },
      {
        "depth": 3,
        "text": "5. 布局计算",
        "slug": "5-布局计算"
      },
      {
        "depth": 3,
        "text": "6. 绘制",
        "slug": "6-绘制"
      },
      {
        "depth": 3,
        "text": "7. 合成",
        "slug": "7-合成"
      },
      {
        "depth": 2,
        "text": "Compositor 线程与主线程是如何协作的？",
        "slug": "compositor-线程与主线程是如何协作的"
      },
      {
        "depth": 2,
        "text": "哪些操作会触发 Compositor 线程的工作？",
        "slug": "哪些操作会触发-compositor-线程的工作"
      },
      {
        "depth": 2,
        "text": "如何优化 Compositor 线程的性能？",
        "slug": "如何优化-compositor-线程的性能"
      },
      {
        "depth": 2,
        "text": "浏览器本地存储的方式",
        "slug": "浏览器本地存储的方式"
      },
      {
        "depth": 3,
        "text": "1. localStorage",
        "slug": "1-localstorage"
      },
      {
        "depth": 3,
        "text": "2. sessionStorage",
        "slug": "2-sessionstorage"
      },
      {
        "depth": 3,
        "text": "3. Cookies",
        "slug": "3-cookies"
      },
      {
        "depth": 3,
        "text": "4. IndexedDB",
        "slug": "4-indexeddb"
      },
      {
        "depth": 2,
        "text": "localStorage、sessionStorage 和 Cookies 有什么区别？",
        "slug": "localstoragesessionstorage-和-cookies-有什么区别"
      },
      {
        "depth": 2,
        "text": "在什么场景下应该使用 IndexedDB？",
        "slug": "在什么场景下应该使用-indexeddb"
      },
      {
        "depth": 2,
        "text": "如何在不同页面之间共享 localStorage 数据？",
        "slug": "如何在不同页面之间共享-localstorage-数据"
      },
      {
        "depth": 2,
        "text": "闭包及使用场景",
        "slug": "闭包及使用场景"
      },
      {
        "depth": 3,
        "text": "闭包的形成",
        "slug": "闭包的形成"
      },
      {
        "depth": 3,
        "text": "闭包的特性",
        "slug": "闭包的特性"
      },
      {
        "depth": 3,
        "text": "闭包的使用场景",
        "slug": "闭包的使用场景"
      },
      {
        "depth": 2,
        "text": "闭包会造成内存泄漏吗？为什么？",
        "slug": "闭包会造成内存泄漏吗为什么"
      },
      {
        "depth": 2,
        "text": "如何避免闭包可能带来的内存泄漏问题？",
        "slug": "如何避免闭包可能带来的内存泄漏问题"
      },
      {
        "depth": 2,
        "text": "浅拷贝和深拷贝",
        "slug": "浅拷贝和深拷贝"
      },
      {
        "depth": 3,
        "text": "浅拷贝",
        "slug": "浅拷贝"
      },
      {
        "depth": 3,
        "text": "深拷贝",
        "slug": "深拷贝"
      },
      {
        "depth": 2,
        "text": "JS 处理超过 Number 最大值的数",
        "slug": "js-处理超过-number-最大值的数"
      },
      {
        "depth": 2,
        "text": "BigInt 与 Number 在运算性能上有什么区别？",
        "slug": "bigint-与-number-在运算性能上有什么区别"
      }
    ],
    "searchText": "javascript 前端基础 javascript es6 有哪些常用新特性？ let / const 箭头函数 模板字符串 解构赋值 默认参数 扩展运算符 promise 类（class） 模块化（import / export） typeof 能判断哪些类型？ typeof 能准确判断基本类型（除 null）。对于引用类型： typeof [] === 'object' typeof {} === 'object' typeof function(){} === 'function' typeof null === 'object' instanceof 原理 instanceof 用于检测构造函数的 prototype 是否在对象的原型链上。 this 指向规则？ 默认绑定 ：独立调用，this 指向全局对象（严格模式下是 undefined）。 隐式绑定 ：作为对象方法调用，this 指向该对象。 显式绑定 ：call / apply / bind。 new 绑定 ：指向新创建的对象。 箭头函数 ：没有自己的 this，继承外层作用域的 this。 call / apply / bind 区别？ 核心作用 ：三者均为 javascript 中手动修改函数内 this 指向的显式绑定方法，且都不会改变原函数本身。 核心区别 ： 1. 执行时机 ：call、apply 调用后立即执行函数，bind 返回一个绑定了 this 的新函数，需手动调用新函数才会执行。 2. 参数传递 ：call、bind 接收参数列表（逐个传参），apply 接收参数数组（或类数组）。 原型链 每个函数都有一个 prototype 属性，指向自己的原型对象。每个 javascript 对象（除了 null）都有一个 proto 属性，它指向该对象的原型对象。原型对象本身也是一个对象，也有自己的 proto 属性，这样就形成了一条链式结构，即原型链。 当访问一个对象的属性时，如果该对象本身没有这个属性，javascript 引擎会沿着原型链向上查找，直到找到该属性或者到达原型链的顶端（object.prototype，其 proto 为 null）。 原型链是 javascript 实现继承的主要方式，通过原型链，对象可以共享原型对象上的属性和方法，避免了重复定义，节省了内存空间，同时也实现了代码的复用。 object 与 function 的关系 function 是 object 的实例 ：在 javascript 中，function 是一个内置的构造函数，所有函数都是 function 的实例。而 function 本身也是一个对象，所以 function 是 object 的实例。可以通过 function instanceof object 来验证，其结果为 true。这意味着 function 可以访问 object.prototype 上的属性和方法，如 tostring、valueof 等。 object 是 function 的原型 ：function.prototype 是所有函数的原型对象，而 object 函数的原型对象 object.prototype 是 function.prototype 的原型。即 function.prototype. proto === object.prototype。这表明所有函数作为 function 的实例，不仅可以访问 function.prototype 上的属性和方法，还可以通过原型链访问 object.prototype 上的属性和方法。 相互依存 ：object 提供了基础的对象属性和方法，是所有对象（包括函数对象）的基础。而 function 则是创建对象和定义行为的重要工具，通过函数可以创建自定义对象，并通过原型链来实现继承和属性共享。 原型链的尽头是什么？ 原型链的尽头是 object.prototype：所有对象的原型链最终都会指向 object.prototype，它是 javascript 中所有对象（除了 null）的通用原型对象。 object.prototype 提供了一些基础的属性和方法，如 tostring、hasownproperty 等。而 object.prototype. proto 的值为 null，当在原型链查找属性时到达 object.prototype 且未找到目标属性，并且 object.prototype. proto 为 null，则停止查找，表明该属性不存在。 如何通过原型链实现继承？ 原型继承 ：通过将一个构造函数的原型对象设置为另一个构造函数的实例来实现继承。例如，dog.prototype = new animal();，这样 dog 的实例就可以通过原型链访问 animal.prototype 上的属性和方法，实现了 dog 对 animal 的继承。可以共享属性和方法，但无法向父构造方法传参。适用于属性和方法需要被多个子实例共享，且不需要在创建子实例时动态初始化父类属性的场景。 借用构造函数继承 ：在子构造函数内部调用父构造函数，并通过 call 或 apply 方法绑定 this。可以传参初始化，且子实例有自己的属性副本。但只能继承父构造函数内部定义的属性和方法，无法继承父构造函数原型对象上的方法。 组合继承 ：将原型继承和借用构造函数继承结合起来。结合了原型继承和构造函数继承的优点。通过构造函数继承可以向父构造函数传递参数初始化属性，通过原型继承可以让子实例共享父构造函数原型对象上的方法，实现了更完整的继承。 proto 和 prototype proto 和 prototype 是 javascript 原型系统中两个关键概念。 prototype 是函数特有的属性，用于定义由该函数创建的实例对象可共享的属性和方法。 proto 是每个对象（除 null 外）都有的属性，指向该对象的原型对象，通过它形成原型链，实现属性和方法的继承与查找。 当使用 new 关键字调用构造函数创建实例时，新创建的实例对象的 proto 属性会指向构造函数的 prototype 所指向的对象。这意味着实例对象可以访问原型对象上的属性和方法，实现属性和方法的共享。 为什么要使用 prototype 来定义共享属性和方法，而不是直接在构造函数内部定义？ 节省内存 ：如果在构造函数内部定义属性和方法，每个实例都会拥有这些属性和方法的独立副本，会浪费大量内存。 便于维护和扩展 ：在 prototype 上定义属性和方法，只需要修改原型对象，所有实例都会受到影响。 什么是作用域、作用域链？ 作用域 ：变量和函数的可访问范围。包括全局作用域、函数作用域、块级作用域（es6）。 作用域链 ：在当前作用域找不到变量，就往外层作用域找，形成一条链。 垃圾回收 在 javascript 中，垃圾回收（garbage collection，gc）是一种自动内存管理机制。其主要作用是识别并回收那些不再被程序使用的对象所占用的内存空间，从而避免内存泄漏，保证程序的高效运行。 标记清除算法（mark and sweep） 标记阶段 ：垃圾回收器从一组根对象（如全局变量、当前调用栈中的变量等）开始，递归地标记所有从根对象可达的对象。这些可达对象是程序在运行过程中仍然需要使用的对象。 清除阶段 ：标记完成后，垃圾回收器会遍历堆内存，回收所有未被标记的对象所占用的内存空间。这些未被标记的对象就是不可达对象，意味着程序不再有任何途径访问到它们，它们所占用的内存可以被释放。 引用计数算法（reference counting） 引用计数是另一种垃圾回收算法，它为每个对象维护一个引用计数。当一个对象被其他对象引用时，其引用计数加 1；当对该对象的引用被移除时，引用计数减 1。当对象的引用计数变为 0 时，说明该对象不再被任何其他对象引用，垃圾回收器会回收该对象所占用的内存。 循环引用问题 ：当两个或多个对象相互引用形成一个闭环，而它们与根对象没有直接或间接的连接时，尽管这些对象实际上已经无法从根对象访问到，但由于它们之间相互引用，引用计数永远不会变为 0，导致内存无法被回收。 分代垃圾回收（generational garbage collection） 这是 js 当前使用的垃圾回收算法。现代 javascript 引擎通常采用分代垃圾回收策略，它基于这样一个观察：大多数对象在创建后很快就不再被使用，而少数对象会存活较长时间。因此，将堆内存分为不同的代（通常分为新生代和老生代）。 新生代回收 ： 新生代存储新创建的对象。 由于大多数对象生命周期较短，新生代的垃圾回收频率相对较高。 新生代通常采用复制算法，将新生代空间分为两个相等的区域：使用区（from）和空闲区（to）。 当使用区快满时，垃圾回收器会标记使用区中的存活对象，并将它们复制到空闲区，然后清空使用区。 之后，from 区和 to 区的角色互换。 老生代回收 ： 老生代存储存活时间较长的对象。 由于这些对象存活时间长，垃圾回收频率相对较低。 老生代一般采用标记清除或标记整理算法。 标记整理算法在标记清除的基础上，会将存活对象移动到内存的一端，以减少内存碎片。 javascript 引擎如何确定垃圾回收的时机？ javascript 引擎通常根据内存使用情况和对象的生命周期来确定垃圾回收时机。当堆内存使用率达到一定阈值（不同引擎阈值不同）时，会触发垃圾回收。 对于新生代，由于对象生命周期短，使用区快满时就会进行回收。 老生代回收频率较低，除了内存使用阈值外，还会考虑对象存活时间等因素，当满足特定条件时进行回收，以平衡垃圾回收开销和程序性能。 什么是模块化？commonjs 和 es6 模块区别？ 模块化是一种将程序分解为独立的、可复用的模块的编程理念。每个模块都有自己独立的作用域，包含一组相关的变量、函数、类等代码单元。模块之间通过特定的接口进行通信和交互，提高了代码的可维护性、可复用性以及开发效率。 commonjs 模块 诞生背景 ：commonjs 是为了解决 javascript 在非浏览器环境（如 node.js）中的模块化问题而产生的。在 node.js 环境下，需要一种机制来组织和管理代码，使代码更具结构化和可维护性。 使用方式 ：在 node.js 中，使用 exports 或 module.exports 来暴露模块的接口。 特点 ： 同步加载 ：在 node.js 环境下，require 是同步加载模块的。这意味着在模块被引入时，会阻塞后续代码的执行，直到模块被完全加载并执行完毕。 值的拷贝 ：当一个模块被 require 引入时，获取的是被引入模块导出对象的拷贝。如果被引入模块内部对导出对象进行修改，不会影响到引入模块中该对象的值。 es6 模块 诞生背景 ：随着 javascript 在浏览器端应用的复杂度不断提高，原生的 javascript 缺乏统一的模块化方案。es6（es2015）引入了模块系统，为浏览器和其他 javascript 环境提供了标准化的模块化支持，使 javascript 代码的组织和管理更加规范。 使用方式 ：使用 export 关键字来导出模块内容，使用 import 关键字来导入模块。 特点 ： 异步加载 ：在浏览器环境中，es6 模块默认是异步加载的，不会阻塞页面的渲染。这使得多个模块可以并行加载，提高页面的加载性能。 动态绑定 ：es6 模块导入的是值的引用，而不是拷贝。这意味着如果被导入模块内部对导出的值进行修改，导入模块中对应的值也会随之改变。 commonjs 和 es6 模块的区别 | 维度 | commonjs | es6 模块 | | | | | | 加载方式 | 同步加载，适用于服务器端 | 浏览器环境下默认异步加载，不阻塞页面渲染 | | 导出导入 | exports / module.exports 导出，require 导入 | export 导出，import 导入 | | 值的传递 | 导出的值是拷贝，模块内部修改不影响导入模块 | 导出的值是引用，模块内部修改会反映在导入模块中 | | 顶层对象 | 顶层对象是 module.exports | 没有类似的顶层对象，通过 export 和 import 直接定义和使用接口 | es6 模块的异步加载是如何实现的？ 浏览器在解析到 import 语句时，会创建一个新的请求来加载相应的模块文件。这个请求是异步的，不会阻塞页面的渲染和解析。浏览器会并行处理多个 import 请求，提高加载效率。在模块加载完成后，浏览器会解析和执行模块的代码。 同时，es6 模块还支持动态导入（import()），这是一种更加灵活的异步导入方式，可以在代码执行过程中根据条件动态地导入模块，进一步优化加载策略。 object.is() 和 === 区别？ object.is(nan, nan) 返回 true；nan === nan 返回 false。 object.is(+0, 0) 返回 false；+0 === 0 返回 true。 什么是 arguments？ 在 javascript 函数中，arguments 是一个类数组对象（array like object），它包含了调用函数时传入的所有参数。它不是一个真正的数组，没有数组的完整方法（如 map、filter 等），但可以通过索引来访问其元素，并且有一个 length 属性来表示参数的数量。 arguments 允许函数处理不定数量的参数。这在编写通用函数或需要处理可变参数列表的场景中非常有用。 为什么 arguments 不是一个真正的数组？ arguments 虽然具有类似数组的索引和 length 属性，但它的原型并非 array.prototype，所以它没有数组的完整方法，如 map、filter 等。 它是 javascript 为了实现函数可变参数功能而设计的一种类数组对象，与真正的数组在本质上有所不同，主要是为了满足特定的函数参数处理需求。 arguments 对象在箭头函数中有什么特点？ 箭头函数本身没有 arguments 对象。当在箭头函数中访问 arguments 时，它会从外层作用域（如果存在普通函数）继承 arguments 对象。 这是因为箭头函数没有自己的 this、arguments、super 和 new.target 绑定，这些值由外层作用域决定。 foreach / for...in / for...of 区别？ 遍历对象类型 foreach ：主要用于遍历数组。 for...in ：通常用于遍历对象的可枚举属性，包括原型链上的可枚举属性（但一般不建议遍历原型链属性，因为可能会得到意外结果）。也可以用于数组，但它遍历得到的是数组的索引（是字符串类型），而非真正意义上遍历数组元素，可能会出现意外情况，比如如果数组对象上定义了非索引的可枚举属性，也会被遍历到。 for...of ：用于遍历可迭代对象，如数组、字符串、set、map 等。它直接迭代对象的元素，而不是像 for...in 那样迭代对象的属性名。 迭代过程控制 foreach ：不能使用 break、continue 语句来中断循环，只能通过抛出异常来停止。因为它是基于回调函数的遍历，没有像传统循环那样的明确循环体结构。 for...in ：可以使用 break、continue 语句来控制循环流程，因为它本质上是一种循环结构。 for...of ：同样可以使用 break、continue 语句来控制循环。 性能 foreach ：由于其内部机制和函数调用开销，在性能上一般不如 for 循环，特别是在处理大数据量数组时。 for...in ：在遍历数组时性能比 for 循环差，因为它获取的是对象属性，需要额外的属性查找和转换操作，而且还可能遍历到意外的属性。 for...of ：性能和 for 循环相近，在现代 javascript 引擎优化下，对于可迭代对象的遍历效率较高。 数组的方法中，哪些是修改原数组的，哪些是返回一个新数组的？ 修改原数组的方法 ：push、pop、shift、unshift、splice、sort、reverse 返回新数组的方法 ：concat、slice、map、filter、reduce、reduceright、flat、flatmap 修改原数组的方法（mutator 方法） 这类方法会直接改变调用它们的数组本身，返回值通常不是新数组（多是长度、被删元素等）。 | 方法名 | 作用 | 返回值 | | | | | | push() | 向数组末尾添加一个/多个元素 | 数组新长度 | | pop() | 删除数组最后一个元素 | 被删除的元素 | | unshift() | 向数组开头添加一个/多个元素 | 数组新长度 | | shift() | 删除数组第一个元素 | 被删除的元素 | | splice() | 增/删/改数组元素（最灵活的修改方法） | 被删除元素组成的数组 | | sort() | 对数组元素排序（默认按字符串 unicode 码点排序） | 排序后的原数组（原数组已变） | | reverse() | 反转数组元素顺序 | 反转后的原数组（原数组已变） | | fill() | 用指定值填充数组（可指定填充范围） | 修改后的原数组 | | copywithin() | 复制数组中指定位置的元素到另一位置（覆盖原有元素） | 修改后的原数组 | 返回新数组的方法（accessor 方法） 这类方法不会修改原数组，而是基于原数组生成并返回一个全新的数组，原数组始终保持不变（函数式编程的核心特性）。 | 方法名 | 作用 | 返回值 | | | | | | map() | 遍历数组，对每个元素执行回调，返回处理后的新数组 | 新数组（长度和原数组一致） | | filter() | 遍历数组，过滤出符合条件的元素 | 符合条件的元素组成的新数组 | | slice() | 截取数组的指定范围（不包含结束索引） | 截取的新数组 | | concat() | 拼接多个数组/值，生成新数组 | 拼接后的新数组 | | flat() | 将多维数组扁平化（指定深度，默认 1 层） | 扁平化后的新数组 | | flatmap() | 先执行 map，再执行 flat(1) | 扁平化后的新数组 | 如何判断是否为可迭代对象？ 可迭代对象（iterable）是指实现了迭代器协议的对象（如数组、字符串、set、map、generator 对象）。 判断方法：可迭代对象必须具有 symbol.iterator 属性，且该属性是一个无参数函数，返回迭代器（iterator）对象（有 next() 方法）。 如何将可迭代对象转为数组？ 1. 扩展运算符（...） 2. array.from() 3. array.prototype.slice.call() 4. for...of 循环手动收集 promise、async、await promise、async、await 是 javascript 中用于处理异步操作的重要特性。promise 是一种异步操作的解决方案，它将异步操作以同步操作的流程表达出来，避免了回调地狱。async 和 await 则是建立在 promise 基础之上的语法糖，进一步简化了异步代码的书写，使异步代码看起来更像同步代码，提高了代码的可读性和可维护性。 promise 定义 ：promise 是一个表示异步操作最终完成（或失败）及其结果的对象。它有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。状态一旦改变，就不会再变，从 pending 变为 fulfilled 或 rejected。 使用方式 ：创建 promise 对象时，传入一个执行器函数，该函数接收 resolve 和 reject 两个参数。resolve 用于将 promise 的状态从 pending 变为 fulfilled，并传递成功的值；reject 用于将状态变为 rejected，并传递失败的原因。 promise 对象有两个方法：then 方法用于处理 promise 成功的情况，catch 方法用于捕获 promise 失败的情况。then 方法返回一个新的 promise，可以链式调用多个 then 方法。 async 定义 ：async 函数是一种异步函数，它返回一个 promise 对象。async 函数内部可以使用 await 关键字暂停函数执行，等待 promise 被解决（resolved 或 rejected）。 使用方式 ：定义 async 函数时，在函数声明前加上 async 关键字。 await await 只能在 async 函数内部使用，它用于等待一个 promise 对象。await 会暂停 async 函数的执行，直到 promise 被解决（resolved 或 rejected），然后返回 promise 的解决值。 浏览器事件循环 执行栈 ：javascript 是单线程语言，所有同步任务都在执行栈中按照顺序执行。当函数被调用时，它会被压入执行栈，执行完毕后从执行栈弹出。 任务队列 ：异步任务不会立即进入执行栈，而是进入任务队列。任务队列分为宏任务队列和微任务队列。 宏任务 包括 settimeout、setinterval、setimmediate（仅在 node.js 环境）、i/o 操作、ui 渲染等。 微任务 包括 promise.then、process.nexttick（仅在 node.js 环境）、mutationobserver 等。 事件循环过程 1. 首先，执行同步任务，执行栈为空时，事件循环开始工作。 2. 事件循环优先处理微任务队列，会不断从微任务队列中取出任务放入执行栈执行，直到微任务队列为空。 3. 微任务队列处理完毕后，事件循环从宏任务队列中取出一个宏任务放入执行栈执行。 4. 宏任务执行完毕后，事件循环再次检查微任务队列并处理其中的任务，如此循环往复。 需要注意的是，每次宏任务执行完毕后都会检查微任务队列，而不是等宏任务队列全部执行完。 这里第一个 settimeout 回调执行完毕后，会先处理其内部产生的微任务（promise 回调1），然后再执行第二个 settimeout 回调及其内部的微任务。 为什么要区分宏任务和微任务？ 控制任务优先级 ：微任务的优先级高于宏任务，这使得一些重要的异步操作（如 promise 的回调）能够在当前宏任务结束后尽快执行，避免等待下一个宏任务周期。例如，在处理一些需要及时反馈的用户交互（如点击按钮后更新 ui 的部分逻辑通过 promise 实现），微任务可以在当前操作结束后迅速执行，提高用户体验。 保证数据一致性 ：在宏任务执行过程中，可能会产生多个微任务。将微任务集中在宏任务执行完毕后统一处理，可以确保在处理微任务时，相关的数据状态是稳定的，避免数据不一致问题。例如，在 dom 操作的 mutationobserver（微任务）中，它能在 dom 变化相关的宏任务执行完毕后，准确获取到最新的 dom 状态。 什么是事件冒泡和事件捕获？ 核心定义 ： 事件冒泡 是事件从触发的目标元素开始，逐级向上传播至父级、祖先元素的过程，是 dom 事件流的默认响应阶段。 事件捕获 是事件从最外层祖先元素开始，逐级向下传播至目标元素的过程，是 dom 事件流的前置阶段。 执行顺序 ：完整 dom 事件流为\"捕获阶段 → 目标阶段 → 冒泡阶段\"，日常开发中未特殊指定时，事件监听默认响应冒泡阶段。 触发控制 ： 通过 addeventlistener 第三个参数控制触发阶段，true 为捕获阶段触发，false（默认）为冒泡阶段触发。 可通过 stoppropagation() 阻止事件继续传播（冒泡/捕获）。 浏览器渲染流程 1. 加载资源 浏览器从网络获取 html、css 和 javascript 等文件。先请求 html，在解析 html 过程中，如果遇到外部 css 和 javascript 的引用，会并行发起请求去获取这些资源。 2. 解析 html 生成 dom 树 浏览器的 html 解析器按顺序读取 html 文档字符流，把它们转化为一个个的令牌，像标签令牌、属性令牌等。依据这些令牌构建 dom 树，树的每个节点对应文档中的一个元素，比如 <html 是根节点，<body 、<div 等是其子节点，反映文档的层次结构。 这里在源码里对应的是 html tokenizer 函数。html 文档不是一次性解析完成的，而是分段解析的，这个过程也被称为渐进式渲染。浏览器会先解析拆分后的 token，如果是 dom 结构，就创建 dom 对象，如果是 script 或者 style 标签，就去解析执行它们。当执行完成一段到空白字符、换行符等中断点，会进行判断，如果当前解析任务时间超过了一定阈值，就会中断，让出主线程根据 cssom 合成的 render 树去到 cc 渲染。 3. 解析 css 生成 cssom 树 浏览器同时解析 css 样式规则，无论是内联样式还是外部 css 文件引入的规则。解析后生成 cssom 树，树的每个节点代表一个 css 规则集，包含选择器及其对应的样式属性，用来确定每个 dom 元素的样式。 4. 构建渲染树 浏览器把 dom 树和 cssom 树结合起来构建渲染树。渲染树只包含需要显示的节点及其样式信息，比如 display: none 的元素不会在渲染树中。渲染树的节点是渲染对象，每个渲染对象关联一个 dom 元素，并带有该元素的样式。 5. 布局计算 渲染树构建好后，浏览器进行布局计算。基于盒模型，把每个渲染对象看作一个盒子，计算其在文档流中的位置、宽度、高度、边距、边框等属性，从而确定每个节点在页面中的位置和大小。 这一步和后续的步骤都会在浏览器的 cc 线程执行，也就是 chrome compositor。 6. 绘制 布局完成后进入绘制阶段。浏览器将渲染树中的每个渲染对象转化为屏幕上的实际像素，按层绘制。根据元素的堆叠顺序，先绘制背景层，接着文本层、图片层等，依据元素样式进行具体绘制。 7. 合成 绘制完成后，浏览器把各个层的内容合成为最终的屏幕图像。合成时考虑层的堆叠顺序和透明度等属性，将不同层的像素信息合并，确定最终显示在屏幕上的像素值。 compositor 线程与主线程是如何协作的？ 信息传递 ：主线程在完成 html 解析、css 计算、javascript 执行以及渲染树构建等操作后，会将页面的图层信息传递给 compositor 线程。这些信息包括每个图层的几何信息（位置、大小）、样式信息（透明度、可见性等）以及内容信息等。 事件处理协作 ：当页面发生一些事件，如用户滚动、点击等，主线程首先接收这些事件。对于一些涉及动画和滚动的事件，主线程会将相关信息传递给 compositor 线程进行处理，以实现流畅的动画和滚动效果。同时，compositor 线程在合成过程中如果需要一些额外的信息，也可能会向主线程请求。 避免阻塞 ：主线程处理的任务可能会比较耗时，如果主线程被阻塞，可能会影响 compositor 线程的工作。为了避免这种情况，chrome 浏览器采用了一些优化策略，如将一些耗时任务（如 javascript 的长时间运行脚本）进行限制或异步处理，确保主线程能够及时向 compositor 线程传递必要的信息，保证合成操作的顺利进行。 哪些操作会触发 compositor 线程的工作？ 动画操作 ：当页面中有 css 动画或 javascript 驱动的动画时，会触发 compositor 线程的工作。例如，通过 css 的 transform 属性实现的元素移动、缩放、旋转动画，compositor 线程会在动画每一帧更新时，根据新的位置和状态对图层进行合成，以显示动画效果。 滚动操作 ：用户在页面上进行滚动时，无论是通过鼠标滚轮、触摸手势还是键盘操作，都会触发 compositor 线程。compositor 线程需要快速调整各个图层的显示位置，将新的可见区域的图层进行合成并显示，确保滚动的流畅性。 图层属性变化 ：当页面中图层的一些属性发生变化，如透明度、可见性、z index（层级顺序）等，会触发 compositor 线程重新进行合成。例如，通过 javascript 动态改变一个元素的透明度，compositor 线程需要根据新的透明度值重新计算图层的混合效果，进行合成操作。 页面初次渲染 ：在页面初次加载完成后，主线程构建好渲染树并将图层信息传递给 compositor 线程，compositor 线程开始进行合成操作，将各个图层合成为最终的页面图像并显示在屏幕上。 如何优化 compositor 线程的性能？ 合理使用图层 ：开发者可以通过 css 属性（如 will change）提示浏览器哪些元素可能会发生变化，让浏览器提前将这些元素分配到单独的图层，便于 compositor 线程进行优化处理。例如，对于一个会频繁进行动画的元素，设置 will change: transform，浏览器可能会将其单独作为一个图层，在动画过程中，compositor 线程可以更高效地处理该图层，而不需要重新计算和合成整个页面。 避免复杂的合成操作 ：尽量减少使用透明度、滤镜等复杂的样式属性，因为这些属性在合成过程中可能会增加 compositor 线程的计算量。例如，过多使用具有透明度的元素叠加，会使 compositor 线程在合成时需要进行大量的混合计算，影响性能。如果必须使用，可以尝试通过优化元素的层级结构或使用硬件加速的方式来减轻计算负担。 优化动画和滚动效果 ：对于动画和滚动操作，尽量使用硬件加速的属性，如 transform 和 opacity。这些属性的变化可以由 compositor 线程直接处理，而不需要主线程重新进行布局和绘制。例如，通过 transform 实现元素的平移动画，比通过修改 left 和 top 属性实现更高效，因为后者可能会触发回流和重绘，增加主线程的负担，进而影响 compositor 线程的性能。同时，合理控制动画的帧率和复杂度，避免过度复杂的动画导致 compositor 线程性能下降。 浏览器本地存储的方式 1. localstorage 定义 ：localstorage 是一种持久化的本地存储机制，存储的数据会一直保留在客户端，除非通过 javascript 代码手动删除或用户主动清除浏览器缓存。 使用方式 ： 存储数据 ：使用 setitem 方法，接受两个参数，键（key）和值（value）。例如：localstorage.setitem('username', 'john'); 获取数据 ：通过 getitem 方法，传入键名获取对应的值。如 const username = localstorage.getitem('username'); 删除数据 ：使用 removeitem 方法，传入要删除的键名，如 localstorage.removeitem('username'); 清除所有数据 ：使用 clear 方法，localstorage.clear(); 会删除 localstorage 中存储的所有数据。 特点 ： 数据持久化 ：关闭浏览器窗口或重新打开浏览器，数据依然存在。 同源策略 ：遵循同源策略，不同源的页面不能共享 localstorage 数据。这里的同源是指协议、域名、端口都相同。 存储容量 ：一般来说，不同浏览器的存储容量限制有所不同，但大致在 5mb 左右。 仅在客户端 ：数据仅存储在客户端，不会随着 http 请求发送到服务器。 2. sessionstorage 定义 ：sessionstorage 用于临时存储数据，数据仅在当前会话（session）期间有效，当页面关闭时，数据会被清除。这里的会话通常指的是在同一个浏览器标签页中打开页面到关闭该标签页的过程。 使用方式 ：与 localstorage 类似，同样有 setitem、getitem、removeitem 和 clear 方法。例如：sessionstorage.setitem('token', '12345'); 存储一个临时令牌，const token = sessionstorage.getitem('token'); 获取该令牌。 特点 ： 会话级存储 ：数据的生命周期仅限于当前会话，这使得它适用于存储一些临时数据，如多步骤表单填写过程中的中间数据，确保用户在同一页面会话中数据不丢失，关闭标签页后数据自动清除。 同源策略 ：同样遵循同源策略，不同源的页面无法访问彼此的 sessionstorage 数据。 存储容量 ：与 localstorage 类似，存储容量一般也在 5mb 左右。 仅在客户端 ：数据仅存在于客户端，不会发送到服务器。 3. cookies 定义 ：cookies 是一种存储在用户计算机上的小文件，由服务器发送到浏览器，浏览器会在后续的请求中将 cookies 发送回服务器。它不仅可以在客户端存储数据，还能在客户端和服务器之间传递数据。 使用方式 ： 创建 cookie ：在 javascript 中可以通过 document.cookie 属性来创建、读取和修改 cookies。例如，document.cookie = 'username=john; expires=thu, 18 dec 2023 12:00:00 utc; path=/'; 创建一个名为 username 的 cookie，设置了过期时间和路径。 读取 cookie ：const cookies = document.cookie; 会返回一个包含所有 cookies 的字符串，需要进一步解析才能获取具体的键值对。 修改 cookie ：可以通过重新设置相同名称的 cookie 来修改其值，例如 document.cookie = 'username=jane; expires=thu, 18 dec 2023 12:00:00 utc; path=/'; 删除 cookie ：通过设置一个过去的过期时间来删除 cookie，如 document.cookie = 'username=; expires=thu, 01 jan 1970 00:00:00 utc; path=/'; 特点 ： 服务器交互 ：cookies 会在每次 http 请求时被发送到服务器，这使得服务器可以识别用户状态等信息，但也增加了请求的大小。 过期时间 ：可以设置 cookie 的过期时间，分为会话 cookie（未设置过期时间，关闭浏览器即失效）和持久化 cookie（设置了过期时间，在过期前一直有效）。 同源策略 ：遵循同源策略，不同源的页面不能访问彼此的 cookies。同时，还有一些其他的限制，如 domain 和 path 属性可以进一步限制 cookie 的访问范围。 存储容量 ：单个 cookie 的大小一般限制在 4kb 左右，每个域名下的 cookie 数量也有限制，不同浏览器有所不同。 4. indexeddb 定义 ：indexeddb 是一种低级别的 api，用于在客户端存储大量结构化数据，它提供了一个基于事务的系统，允许异步访问数据库。 使用方式 ： 打开数据库 ：使用 window.indexeddb.open('mydatabase', 1); 打开名为 mydatabase 的数据库，第二个参数是数据库版本号。 创建对象仓库 ：在 onsuccess 和 onupgradeneeded 事件中创建对象仓库。 存储数据 ：通过事务和对象仓库的 add 或 put 方法存储数据。 获取数据 ：通过事务和对象仓库的 get 方法获取数据。 特点 ： 大容量存储 ：适合存储大量数据，比 localstorage 和 sessionstorage 的存储容量大得多。 异步操作 ：采用异步操作方式，不会阻塞主线程，适合处理大量数据的读写操作。 复杂数据结构 ：可以存储复杂的 javascript 对象，而不仅仅是字符串。 同源策略 ：遵循同源策略，不同源的页面不能访问彼此的 indexeddb 数据库。 localstorage、sessionstorage 和 cookies 有什么区别？ | 维度 | localstorage | sessionstorage | cookies | | | | | | | 数据生命周期 | 持久化存储，除非手动删除 | 仅当前会话有效，页面关闭即清除 | 可设置过期时间，分会话 cookie 和持久化 cookie | | 存储容量 | 约 5mb | 约 5mb | 单个约 4kb，数量有限制 | | 服务器交互 | 仅客户端存储，不随 http 请求发送 | 仅客户端存储，不随 http 请求发送 | 每次 http 请求时发送到服务器 | | 应用场景 | 用户设置、主题偏好等长期数据 | 表单填写过程中的临时中间数据 | 客户端与服务器间传递用户状态（登录状态、购物车等） | 在什么场景下应该使用 indexeddb？ 大量数据存储 ：当需要在客户端存储大量数据时，如离线应用中的大量缓存数据、本地数据库等，indexeddb 的大容量存储特性使其成为理想选择。例如，一个离线地图应用可以使用 indexeddb 存储地图数据，以便在离线状态下使用。 复杂数据结构存储 ：如果需要存储复杂的 javascript 对象，如包含多个属性和嵌套结构的对象，indexeddb 能够很好地支持。例如，一个项目管理应用可能需要存储项目的详细信息，包括任务列表、成员信息等复杂结构，indexeddb 可以方便地存储和检索这些数据。 异步操作需求 ：当对数据的读写操作可能会比较耗时，且不希望阻塞主线程时，indexeddb 的异步操作方式能满足需求。例如，在进行大量数据的导入或导出操作时，使用 indexeddb 可以在后台进行异步处理，不会影响页面的交互性。 如何在不同页面之间共享 localstorage 数据？ 同源页面 ：只要是同源的页面（协议、域名、端口相同），都可以访问和修改相同的 localstorage 数据。例如，在 page1.html 中存储数据 localstorage.setitem('message', 'hello');，在同域名下的 page2.html 中可以通过 localstorage.getitem('message'); 获取该数据。 跨页面通信 ：如果需要在不同页面之间实时同步 localstorage 数据的变化，可以结合 window.addeventlistener('storage', callback) 事件。例如，在一个页面修改了 localstorage 数据，其他页面通过监听 storage 事件可以获取到数据的变化并进行相应处理。 闭包及使用场景 闭包的形成 在 javascript 中，函数在定义时会创建一个词法环境，这个环境包含了函数定义时所在作用域的变量对象。当函数被调用时，会创建一个执行上下文，该执行上下文包含了对词法环境的引用。如果一个函数内部返回另一个函数，并且返回的函数引用了外部函数作用域中的变量，那么闭包就形成了。 闭包的特性 延长变量的生命周期 ：外部函数执行完后，其局部变量本应被销毁，但由于闭包的存在，被内部函数引用的变量会一直保留在内存中，直到闭包不再被使用。 访问外部作用域变量 ：闭包可以访问其定义时所在作用域的变量，即使在外部作用域已经执行结束后，依然能够访问和操作这些变量。这使得闭包可以实现数据的封装和隐藏，外部代码无法直接访问闭包内部的变量，但可以通过闭包提供的函数接口来间接操作这些变量。 闭包的使用场景 数据封装与私有化 ：在 javascript 中没有传统意义上的私有变量，但可以通过闭包来模拟私有变量。 回调函数与事件处理 ：在事件处理程序和回调函数中，闭包经常被使用。 柯里化 ：柯里化是一种将多参数函数转换为一系列单参数函数的技术，闭包在柯里化中起到关键作用。 闭包会造成内存泄漏吗？为什么？ 可能造成内存泄漏 ：闭包可能会造成内存泄漏。因为闭包会延长变量的生命周期，使得被闭包引用的变量在不再需要时，由于仍然存在引用关系而无法被垃圾回收机制回收，从而导致内存占用不断增加，最终可能造成内存泄漏。例如，在一个频繁创建闭包且闭包中引用了大量数据的场景下，如果闭包没有被正确释放，就可能出现内存泄漏问题。 原因分析 ：当一个闭包一直存在于内存中，并且它所引用的变量也一直被其持有，而这些变量实际上已经不再被程序的其他部分所需要，但由于闭包的引用关系，垃圾回收机制无法回收这些变量所占用的内存，从而导致内存泄漏。不过，现代 javascript 引擎对于闭包的内存管理有了很大的改进，会尽量检测并回收不再使用的闭包及其相关变量，但不合理地使用闭包仍然可能引发内存泄漏问题。 如何避免闭包可能带来的内存泄漏问题？ 及时释放引用 ：当闭包不再需要时，手动将闭包所引用的变量设置为 null，以解除引用关系，让垃圾回收机制能够回收相关内存。例如，如果不再需要 counter 对象，可以将其设置为 null，即 counter = null;，这样闭包及其引用的 count 变量就有可能被垃圾回收机制回收。 合理使用闭包 ：避免在不必要的情况下创建闭包，特别是在循环中或者频繁执行的函数中。如果必须使用闭包，尽量减少闭包所引用的变量数量和生命周期。例如，在事件处理程序中，如果只需要访问某个局部变量的当前值，可以在事件处理程序定义时将该值作为参数传递进去，而不是通过闭包引用，这样可以避免闭包对该变量的长期引用。 浅拷贝和深拷贝 浅拷贝 浅拷贝只复制对象或数组的第一层属性或元素。对于引用类型（如对象、数组）的属性或元素，新对象或数组中保存的是原对象或数组中对应引用类型的引用，而不是其副本。所以当原对象或数组中的引用类型元素发生变化时，浅拷贝后的对象或数组中的对应元素也会变化。 对象的浅拷贝 ：可以使用 object.assign() 方法，它将所有可枚举属性的值从一个或多个源对象复制到目标对象。 数组的浅拷贝 ：slice() 方法和 concat() 方法可用于数组的浅拷贝。 深拷贝 使用 json.parse(json.stringify()) ：这是一种简单的深拷贝方式。它先将对象或数组转换为 json 字符串，再将 json 字符串解析为新的对象或数组。但 json 格式不支持存储函数，当使用 json.stringify() 转换包含函数的对象时，函数会被忽略。 手动实现深拷贝函数 ：通过递归的方式遍历对象或数组的所有层级，为每个层级的引用类型创建新的副本。 js 处理超过 number 最大值的数 使用 bigint 使用第三方库 math.js bigint 与 number 在运算性能上有什么区别？ number 运算性能 ：number 类型的运算在现代 javascript 引擎中经过高度优化，对于在 number.max safe integer 范围内的整数和浮点数运算，速度非常快。因为引擎可以利用底层硬件的指令集来进行快速计算，例如 cpu 的浮点运算单元可以高效处理 number 类型的运算。 bigint 运算性能 ：bigint 的运算性能相对较低。由于 bigint 用于处理大数，其实现方式与 number 不同，不能直接利用底层硬件的浮点数运算指令。bigint 的运算通常需要更多的内存和计算资源，因为它要处理不定长度的整数。例如，在进行大整数乘法时，bigint 需要采用更复杂的算法来确保精度，这比 number 类型的乘法运算要慢很多。所以在处理不超过 number.max safe integer 的数时，优先使用 number 类型以获得更好的性能；而在需要处理超过该值的大数时，虽然 bigint 性能较低，但能保证运算的精确性。"
  },
  {
    "slug": "009-css预处理器与css库",
    "title": "CSS 预处理器与 CSS 库",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/CSS预处理器与CSS库.md",
    "markdown": "# CSS 预处理器与 CSS 库\n\n## 什么是 CSS 预处理器\n\n一种工具，它扩展了 CSS 语言，增加了如变量、嵌套规则、混合（Mixin）、函数等编程特性，让开发者可以用更简洁、更具逻辑性的方式编写 CSS 代码。\n\n通常配合 Webpack 的 loader 来解析或直接通过工具对应的编译器编译成 CSS 文件来执行。\n\n## SCSS 和 Less 在语法上有哪些主要区别\n\n- **变量定义符号：** SCSS 使用 `$` 定义变量，而 Less 使用 `@`。\n- **混合定义方式：** SCSS 使用 `@mixin` 定义混合，Less 直接使用类名定义混合。\n- **继承方式：** SCSS 通过 `@extend` 继承占位符选择器，Less 没有类似 SCSS 的占位符继承机制，但可以通过混合实现类似效果。\n- **语法风格：** SCSS 有两种语法格式，`.scss` 格式更接近 CSS，`.sass` 格式使用缩进代替大括号和分号；Less 则完全基于 CSS 语法进行扩展，相对更简洁直观。\n\n## TailwindCSS 有哪些用法\n\nTailwindCSS 可以直接通过使用类名来使用布局。\n\n例如：\n\n### 1. 响应式布局\n\n- `sm`、`md`、`lg`、`xl` 等前缀的尺寸\n- `m`、`p` 控制的外间距、内间距\n- 通过 `flex`、`grid` 等类名直接生效 flex 和 grid 布局\n\n### 2. 样式\n\n- `bg-*` 控制背景颜色\n- `text-*` 控制文字颜色\n\n### 3. 状态\n\n- `hover:*` 控制鼠标悬停状态对应的样式\n- `focus:*` 控制聚焦时的样式\n\n## CSS 预处理器和 CSS 库的区别\n\nCSS 预处理器本质是一种工具，扩展了 CSS 语言，让开发者能使用类似编程的方式编写 CSS。它增加了变量、嵌套规则、混合（Mixin）、函数等特性，这些特性并非标准 CSS 语法，需通过预处理器编译成标准 CSS 代码，浏览器才能识别。例如 SCSS、LESS 等。\n\nCSS 库是一系列预先编写好的 CSS 代码集合，提供了可复用的样式和组件，如 TailwindCSS、Bootstrap 等。它们基于标准 CSS 语法构建，直接在项目中引入使用，无需编译过程。\n",
    "headings": [
      {
        "depth": 1,
        "text": "CSS 预处理器与 CSS 库",
        "slug": "css-预处理器与-css-库"
      },
      {
        "depth": 2,
        "text": "什么是 CSS 预处理器",
        "slug": "什么是-css-预处理器"
      },
      {
        "depth": 2,
        "text": "SCSS 和 Less 在语法上有哪些主要区别",
        "slug": "scss-和-less-在语法上有哪些主要区别"
      },
      {
        "depth": 2,
        "text": "TailwindCSS 有哪些用法",
        "slug": "tailwindcss-有哪些用法"
      },
      {
        "depth": 3,
        "text": "1. 响应式布局",
        "slug": "1-响应式布局"
      },
      {
        "depth": 3,
        "text": "2. 样式",
        "slug": "2-样式"
      },
      {
        "depth": 3,
        "text": "3. 状态",
        "slug": "3-状态"
      },
      {
        "depth": 2,
        "text": "CSS 预处理器和 CSS 库的区别",
        "slug": "css-预处理器和-css-库的区别"
      }
    ],
    "searchText": "css 预处理器与 css 库 前端框架 css 预处理器与 css 库 什么是 css 预处理器 一种工具，它扩展了 css 语言，增加了如变量、嵌套规则、混合（mixin）、函数等编程特性，让开发者可以用更简洁、更具逻辑性的方式编写 css 代码。 通常配合 webpack 的 loader 来解析或直接通过工具对应的编译器编译成 css 文件来执行。 scss 和 less 在语法上有哪些主要区别 变量定义符号： scss 使用 $ 定义变量，而 less 使用 @。 混合定义方式： scss 使用 @mixin 定义混合，less 直接使用类名定义混合。 继承方式： scss 通过 @extend 继承占位符选择器，less 没有类似 scss 的占位符继承机制，但可以通过混合实现类似效果。 语法风格： scss 有两种语法格式，.scss 格式更接近 css，.sass 格式使用缩进代替大括号和分号；less 则完全基于 css 语法进行扩展，相对更简洁直观。 tailwindcss 有哪些用法 tailwindcss 可以直接通过使用类名来使用布局。 例如： 1. 响应式布局 sm、md、lg、xl 等前缀的尺寸 m、p 控制的外间距、内间距 通过 flex、grid 等类名直接生效 flex 和 grid 布局 2. 样式 bg 控制背景颜色 text 控制文字颜色 3. 状态 hover: 控制鼠标悬停状态对应的样式 focus: 控制聚焦时的样式 css 预处理器和 css 库的区别 css 预处理器本质是一种工具，扩展了 css 语言，让开发者能使用类似编程的方式编写 css。它增加了变量、嵌套规则、混合（mixin）、函数等特性，这些特性并非标准 css 语法，需通过预处理器编译成标准 css 代码，浏览器才能识别。例如 scss、less 等。 css 库是一系列预先编写好的 css 代码集合，提供了可复用的样式和组件，如 tailwindcss、bootstrap 等。它们基于标准 css 语法构建，直接在项目中引入使用，无需编译过程。"
  },
  {
    "slug": "010-nextjs",
    "title": "Next.js",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/NextJS.md",
    "markdown": "# Next.js\n\n## Next.js 对比 React 做了哪些额外优化\n\n### 1. 图片优化\n\n通过使用 `next/Image` 组件可以生效图片优化，包含如下能力：\n\n- 通过加载器自动补全 URL\n- 自动采用现代图片格式\n- 自动识别静态图片的宽高，保证始终提供正确的宽高，以减少累积布局偏移\n- 图片仅在进入视口时加载，可选择模糊占位符\n- 即使图片存储在远程服务器也可以按需调整图片大小\n- 可以通过 `priority` 来调整优先级，优先加载最影响 LCP 的图片\n\n### 2. 字体优化\n\n通过使用 `next/Head` 组件可以生效字体优化，包含如下能力：\n\n- 自动内联字体 CSS，减少服务器请求\n\n### 3. Script 优化\n\n通过使用 `next/Script` 组件可以生效脚本优化，包含如下能力：\n\n- 使用 `strategy` 属性可以使开发者能够在应用中的任何位置设置第三方脚本的加载优先级，而无需直接追加到 `next/head`，从而节省开发时间并提升加载性能。\n  - `beforeInteractive`：页面变为交互状态前加载\n  - `afterInteractive`（默认）：页面变为交互状态后立即加载\n  - `lazyOnload`：空闲时加载\n\n## Next.js 的两种预渲染模式\n\n### 静态生成（推荐）\n\nHTML 在构建时生成，并在每次页面请求（request）时重用。通过 `export async getStaticProps` 获取数据。通过 `export async getStaticPaths` 获取动态路径。\n\n### 服务器端渲染\n\n在每次页面请求（request）时重新生成 HTML。通过在 page 中 `export` 一个名为 `getServerSideProps` 的 `async` 函数。服务器会在每次请求页面时调用此函数。\n\n可以为每个页面选择预渲染的方式，创建一个\"混合渲染\"的 Next.js 应用程序。出于性能考虑，更推荐使用静态生成，这样可以只构建一次，然后托管在 CDN 上来获得更好的性能。但是，如果无法在用户请求前预渲染页面，则需要使用服务器端渲染。\n\n## 静态生成获取动态数据\n\n### 页面内容取决于外部数据\n\n通过在页面的同一个文件中 `export` 一个名为 `getStaticProps` 的 `async` 函数来获取外部数据。该函数会在构建时被调用，并将数据作为 `props` 传递给页面。\n\n### 页面路径（paths）取决于外部数据\n\n通过在动态路由页面的同一个文件中 `export` 一个名为 `getStaticPaths` 的 `async` 函数来获取外部路径。后续，也需要通过 `getStaticProps` 来根据路径 id 对应的数据 id 来获取动态路由页面对应的数据。\n\n## Next.js 的 Layout 组件的作用是什么\n\nLayout 组件是 Next.js App Router（`app/` 目录）中的核心概念，通过在路由目录下创建 `layout.tsx`（或 `layout.js`）文件来定义。它的核心作用是**在多个页面之间共享 UI 布局，且在页面切换时不会重新渲染**。\n\n### 核心特性\n\n1. **共享布局**：Layout 包裹其子路由页面，定义通用的 UI 结构（如导航栏、侧边栏、页脚等），避免在每个页面中重复编写相同的布局代码。\n2. **状态保持，不重新渲染**：当用户在同一个 Layout 下的不同页面之间导航时，Layout 组件不会被卸载和重新挂载，它的状态（如滚动位置、表单输入等）会被保持，只有页面内容部分会更新。\n3. **嵌套布局**：Layout 支持嵌套。每个路由段都可以定义自己的 `layout.tsx`，子 Layout 会嵌套在父 Layout 内部，形成层级布局结构。例如 `/dashboard` 有一个带侧边栏的 Layout，`/dashboard/settings` 可以在此基础上再嵌套一个设置页专属的 Layout。\n4. **根布局（Root Layout）**：`app/layout.tsx` 是必须存在的根布局，它替代了 Pages Router 中的 `_app.tsx` 和 `_document.tsx`，必须包含 `<html>` 和 `<body>` 标签。\n\n访问 `/dashboard/settings` 时，页面结构为：`RootLayout` → `DashboardLayout` → `SettingsPage`，两层 Layout 嵌套渲染。\n",
    "headings": [
      {
        "depth": 1,
        "text": "Next.js",
        "slug": "nextjs"
      },
      {
        "depth": 2,
        "text": "Next.js 对比 React 做了哪些额外优化",
        "slug": "nextjs-对比-react-做了哪些额外优化"
      },
      {
        "depth": 3,
        "text": "1. 图片优化",
        "slug": "1-图片优化"
      },
      {
        "depth": 3,
        "text": "2. 字体优化",
        "slug": "2-字体优化"
      },
      {
        "depth": 3,
        "text": "3. Script 优化",
        "slug": "3-script-优化"
      },
      {
        "depth": 2,
        "text": "Next.js 的两种预渲染模式",
        "slug": "nextjs-的两种预渲染模式"
      },
      {
        "depth": 3,
        "text": "静态生成（推荐）",
        "slug": "静态生成推荐"
      },
      {
        "depth": 3,
        "text": "服务器端渲染",
        "slug": "服务器端渲染"
      },
      {
        "depth": 2,
        "text": "静态生成获取动态数据",
        "slug": "静态生成获取动态数据"
      },
      {
        "depth": 3,
        "text": "页面内容取决于外部数据",
        "slug": "页面内容取决于外部数据"
      },
      {
        "depth": 3,
        "text": "页面路径（paths）取决于外部数据",
        "slug": "页面路径paths取决于外部数据"
      },
      {
        "depth": 2,
        "text": "Next.js 的 Layout 组件的作用是什么",
        "slug": "nextjs-的-layout-组件的作用是什么"
      },
      {
        "depth": 3,
        "text": "核心特性",
        "slug": "核心特性"
      }
    ],
    "searchText": "next.js 前端框架 next.js next.js 对比 react 做了哪些额外优化 1. 图片优化 通过使用 next/image 组件可以生效图片优化，包含如下能力： 通过加载器自动补全 url 自动采用现代图片格式 自动识别静态图片的宽高，保证始终提供正确的宽高，以减少累积布局偏移 图片仅在进入视口时加载，可选择模糊占位符 即使图片存储在远程服务器也可以按需调整图片大小 可以通过 priority 来调整优先级，优先加载最影响 lcp 的图片 2. 字体优化 通过使用 next/head 组件可以生效字体优化，包含如下能力： 自动内联字体 css，减少服务器请求 3. script 优化 通过使用 next/script 组件可以生效脚本优化，包含如下能力： 使用 strategy 属性可以使开发者能够在应用中的任何位置设置第三方脚本的加载优先级，而无需直接追加到 next/head，从而节省开发时间并提升加载性能。 beforeinteractive：页面变为交互状态前加载 afterinteractive（默认）：页面变为交互状态后立即加载 lazyonload：空闲时加载 next.js 的两种预渲染模式 静态生成（推荐） html 在构建时生成，并在每次页面请求（request）时重用。通过 export async getstaticprops 获取数据。通过 export async getstaticpaths 获取动态路径。 服务器端渲染 在每次页面请求（request）时重新生成 html。通过在 page 中 export 一个名为 getserversideprops 的 async 函数。服务器会在每次请求页面时调用此函数。 可以为每个页面选择预渲染的方式，创建一个\"混合渲染\"的 next.js 应用程序。出于性能考虑，更推荐使用静态生成，这样可以只构建一次，然后托管在 cdn 上来获得更好的性能。但是，如果无法在用户请求前预渲染页面，则需要使用服务器端渲染。 静态生成获取动态数据 页面内容取决于外部数据 通过在页面的同一个文件中 export 一个名为 getstaticprops 的 async 函数来获取外部数据。该函数会在构建时被调用，并将数据作为 props 传递给页面。 页面路径（paths）取决于外部数据 通过在动态路由页面的同一个文件中 export 一个名为 getstaticpaths 的 async 函数来获取外部路径。后续，也需要通过 getstaticprops 来根据路径 id 对应的数据 id 来获取动态路由页面对应的数据。 next.js 的 layout 组件的作用是什么 layout 组件是 next.js app router（app/ 目录）中的核心概念，通过在路由目录下创建 layout.tsx（或 layout.js）文件来定义。它的核心作用是 在多个页面之间共享 ui 布局，且在页面切换时不会重新渲染 。 核心特性 1. 共享布局 ：layout 包裹其子路由页面，定义通用的 ui 结构（如导航栏、侧边栏、页脚等），避免在每个页面中重复编写相同的布局代码。 2. 状态保持，不重新渲染 ：当用户在同一个 layout 下的不同页面之间导航时，layout 组件不会被卸载和重新挂载，它的状态（如滚动位置、表单输入等）会被保持，只有页面内容部分会更新。 3. 嵌套布局 ：layout 支持嵌套。每个路由段都可以定义自己的 layout.tsx，子 layout 会嵌套在父 layout 内部，形成层级布局结构。例如 /dashboard 有一个带侧边栏的 layout，/dashboard/settings 可以在此基础上再嵌套一个设置页专属的 layout。 4. 根布局（root layout） ：app/layout.tsx 是必须存在的根布局，它替代了 pages router 中的 app.tsx 和 document.tsx，必须包含 <html 和 <body 标签。 访问 /dashboard/settings 时，页面结构为：rootlayout → dashboardlayout → settingspage，两层 layout 嵌套渲染。"
  },
  {
    "slug": "011-react",
    "title": "React",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/React.md",
    "markdown": "# React\n\n## Fiber 架构解决的核心问题\n\n### 同步阻塞问题\n\n旧架构用同步递归遍历虚拟 DOM，当组件树庞大时，会长时间占用主线程。由于 JS 是单线程，会导致卡顿、输入延迟、掉帧。\n\n### 缺乏优先级调度\n\n旧架构中所有更新操作的优先级相同（如用户输入、网络请求回调、日志上报）。如列表渲染等非关键任务可能阻塞如按钮点击等关键任务，无法保证核心交互的响应性。\n\n### 无法实现并发特性\n\n同步渲染模式下，无法中断、恢复或放弃渲染任务，为后续的 `Suspense`、时间切片（Time Slicing）等并发特性设置了技术障碍。\n\n## Fiber 工作原理\n\nFiber 是一套可中断、可恢复、优先级可控的协调算法。\n\n首先是核心数据结构——Fiber 节点，将渲染任务拆分为最小的工作单元。每个 React 元素对应一个 Fiber 节点，节点内记录了组件状态、优先级（Lanes）、副作用标记（EffectTag）、以及双缓存关联（`alternate`）。\n\nFiber 对结构进行了改造，用链表替代递归栈，通过 `child`（第一个子节点）、`sibling`（下一个兄弟节点）、`return`（父节点）指针连接，支持随时中断和恢复遍历。\n\n其次是 React 内存中维护两棵 Fiber 树，保证更新的原子性：\n\n- **Current 树：** 与当前页面真实 DOM 对应的树，代表当前渲染状态。\n- **WorkInProgress 树：** 在内存中构建的新树，所有的 Diff 计算、状态更新都在这棵树上进行，不影响当前界面。\n\n当 WorkInProgress 树构建完成后，仅需切换 `current` 指针，即可完成视图更新，避免用户看到半成品 UI。\n\n然后是由 Scheduler（调度器）主导任务执行顺序，基于 Lanes（车道模型）为不同更新分配优先级，高优先级任务可中断低优先级任务。利用浏览器空闲时间（通过 `requestIdleCallback` 或自研调度器）执行工作单元，每执行完一个单元就检查剩余时间。若时间不足或有高优先级任务，立即暂停当前任务，待下一次空闲时恢复。\n\n## React 渲染过程\n\n### Render 阶段（可中断）\n\n遍历 Fiber 树，执行 Diff 算法，标记副作用（如插入、更新、删除），生成副作用链表（Effect List）。\n\n### Commit 阶段（不可中断）\n\n遍历副作用链表，一次性将变更应用到真实 DOM，并执行生命周期钩子（如 `componentDidMount`）或 Hooks 副作用。\n\n## 为什么函数式更新 State 可以拿到上一次状态并更新，它的底层原理是什么\n\nReact 内部维护了有序的更新队列（Update Queue）和状态快照（`currentState`），并对函数式更新进行了\"链式求值\"处理。\n\n因为 React 会在更新时封装一个 Update 对象存进队列，然后在每次处理 Update 对象时更新 `currentState` 的值，也就是一个中间状态，最后在调用更新函数时将 `currentState` 传入，作为第一个参数（`prevState`）。\n\n而对象式更新则基于最原始的 state 值进行更新。\n\n## setState 的处理过程\n\n1. 当调用 `setState` 时，React 会创建一个 Update 对象，放入更新链表，并不会立即执行更新操作。\n2. 当前执行上下文执行结束后，React 进入批量更新阶段，开始遍历整个更新链表，并维护一个快照，这个快照称为 `currentState`。\n3. 更新过程中，一开始，`currentState` 的值是 state 的初始值，随着 Update 对象的遍历处理，`currentState` 的值会逐步更新。\n4. 对于函数式更新来说，`currentState` 的值会作为更新函数的第一个参数 `prevState` 被传入。对于对象式更新，则会基于 state 的原始值进行更新。\n5. 当整个更新过程结束后，React 会将 `currentState` 的值赋值给 state，然后触发组件的 render 函数触发渲染，更新完成。\n\n## React 不立即更新 state 的底层原理和原因是什么\n\n- 性能优化，减少高频 DOM 渲染开销；\n- 保证 UI 一致性，避免中间状态的闪烁和逻辑 bug；\n- 支持事务性更新和优先级调度，提升用户交互体验。\n\n## React 如何实现 Vue 中 keep-alive 的功能\n\n### 使用 React.memo 和自定义状态管理\n\n`React.memo` 是一个高阶组件，它可以对函数式组件进行浅比较，如果组件的 `props` 没有变化，就不会重新渲染组件。通过结合自定义状态管理（如 `useState` 或 `useReducer`）来保存组件内部状态，从而达到类似 `keep-alive` 保留组件状态的效果。\n\n### 使用 React.lazy 和 Suspense 配合缓存\n\n`React.lazy` 用于动态导入组件，`Suspense` 用于在组件加载时显示加载状态。通过合理设置缓存机制，可以实现组件的缓存复用。适用于组件加载开销较大且需要缓存的场景。\n\n### 使用第三方库 react-cached-component\n\n该库提供了一种简单的方式来缓存 React 组件。它会在组件卸载时保存组件的状态，在重新挂载时恢复状态。\n\n## React.memo 和 Vue 的 keep-alive 在实现原理上有什么不同？\n\n`React.memo` 主要通过浅比较 `props` 来决定组件是否重新渲染，侧重于避免不必要的渲染以提升性能，它本身不负责缓存组件实例，需要结合状态管理来保留组件状态。\n\n而 Vue 的 `keep-alive` 直接缓存组件实例，在组件切换时，组件的生命周期钩子函数会进入特定的缓存状态（如 `activated` 和 `deactivated`），组件状态得以保留，其实现是基于 Vue 自身的组件管理和生命周期机制。\n\n## 在使用 React.lazy 和 Suspense 实现类似 keep-alive 功能时，如何处理缓存更新？\n\n可以通过在组件内部使用 `useEffect` 钩子，在依赖项发生变化时手动触发缓存更新。例如，当某个数据更新导致需要更新缓存的组件时，可以在 `useEffect` 中通过设置一个标志位，触发组件重新渲染，从而实现缓存更新。\n\n另外，也可以结合自定义的缓存管理逻辑，在合适的时机清除或更新缓存。\n\n## React Hooks 使用限制及原因\n\n1. Hooks 只能在函数组件顶层调用，不能在循环、条件、嵌套函数中调用。因为 React 通过队列维护了 Hooks 依赖调用顺序，并以此来正确管理状态和副作用。对于循环、条件等情况，会打破队列的调用顺序，导致无法匹配正确的 state 和副作用。如果实在需要，可以将 Hooks 提取到单独的组件中，然后在新组件的顶层调用 Hooks。\n2. Hooks 只能在 React 函数组件或自定义 Hooks 里调用。因为 Hooks 依赖 React 的上下文环境。\n3. Hooks 需要稳定的依赖数组，例如 `useEffect`、`useCallback`、`useMemo` 这类需要提供依赖数组的 Hooks，如果依赖数组是动态的，会导致每次副作用触发时机不可控，导致潜在的功能和性能问题。\n\n## 常用的 React Hooks\n\n### useState\n\n为函数组件添加状态。返回一个包含当前状态值和用于更新该状态的函数的数组。\n\n### useEffect\n\n在函数组件中执行副作用操作，比如数据获取、订阅事件或手动修改 DOM。接收一个回调函数和一个依赖数组作为参数。\n\n**使用场景：**\n\n- 数据获取场景，在组件挂载后从服务器获取数据；\n- 监听事件，例如监听窗口的滚动事件；\n- 操作 DOM，在组件渲染后对 DOM 元素进行特定操作。\n\n依赖数组为空时，副作用只在组件挂载和卸载时执行；依赖数组包含某些变量时，当这些变量变化，副作用会重新执行。\n\n### useLayoutEffect\n\n与 `useEffect` 类似，但它会在浏览器绘制之前同步执行，在 DOM 更新后立即执行副作用操作。\n\n**使用场景：**\n\n- 当需要在 DOM 更新后立即测量 DOM 元素的布局或进行与布局相关的操作时使用。\n- 例如获取元素的尺寸并根据其进行样式调整，且要确保这些操作在浏览器绘制之前完成，避免页面闪烁等问题。\n\n### useContext\n\n在函数组件中消费 React 上下文（Context），实现跨组件层级共享数据，无需通过 `props` 层层传递。\n\n**使用场景：**\n\n- 应用中有一些全局数据，如主题、用户认证信息等，多个组件都需要使用这些数据，且这些组件在组件树中位置较分散，使用 `useContext` 可方便共享数据。\n- 使用方法：在父组件上使用 `createContext` 返回的 `Provider` 属性，在子组件中使用 `useContext` 接收。\n\n### useReducer\n\n用于在函数组件中管理复杂状态逻辑。接收一个 reducer 函数和初始状态作为参数，返回当前状态以及一个用于派发 action 的函数。\n\n**使用场景：**\n\n- 状态更新逻辑复杂，且涉及多个子状态相互关联的场景。\n- 例如表单验证，输入框的状态会影响整个表单的验证结果；多步骤向导，每个步骤的状态会影响后续步骤的显示和操作。\n\n### useMemo\n\n对计算结果进行缓存，只有当它的依赖项发生变化时才会重新计算。接收一个回调函数和一个依赖数组作为参数，返回回调函数的计算结果。\n\n**使用场景：**\n\n- 当有昂贵的计算操作，且计算结果依赖的变量不频繁变化时，使用 `useMemo` 可避免不必要的重复计算，提升性能。\n- 比如复杂的数组排序或过滤操作，只有在数组或相关参数变化时才重新计算。\n\n### useCallback\n\n缓存回调函数，只有当它的依赖项发生变化时才会重新生成回调函数。接收一个回调函数和一个依赖数组作为参数，返回缓存后的回调函数。\n\n**使用场景：**\n\n- 需要将回调函数传递给子组件，且希望控制子组件的重新渲染时机。\n- 如果子组件使用了 `React.memo`，由于父组件重新渲染会重建内部所有函数，导致传递给子组件的、作为 props 的回调函数引用变更，触发子组件的重渲染。\n- 如果 `useEffect` 或者 `useMemo` 依赖了一个函数，由于每次组件更新都会创建一个新的函数引用，因此会导致每次都执行副作用，此时可以使用 `useCallback` 缓存。\n- 如果长列表中子列表项使用了列表的回调函数，例如 `onDelete` 回调，如果其中一个列表项变更，整个列表都会触发更新，从而使回调函数的引用更新，触发其他子列表项的渲染。此时，可以使用 `useCallback` 缓存回调函数，配合 `React.memo`，减少重更新。\n\n### useRef\n\n创建可变的 ref 对象，其 `.current` 属性在组件的整个生命周期内保持不变。可用于访问 DOM 元素、保存可变值等。\n\n**使用场景：**\n\n- 获取 DOM 元素的引用，例如在表单提交时获取输入框的值；\n- 保存一个可变值，但不想触发组件重新渲染，如记录动画的当前状态。\n\n### useImperativeHandle\n\n在使用 `forwardRef` 时，自定义暴露给父组件的实例值。\n\n**使用场景：**\n\n- 当子组件通过 `forwardRef` 将 ref 传递给父组件时，父组件通常可以访问子组件的所有实例属性和方法。\n- 使用 `useImperativeHandle` 可以选择性地暴露特定的方法或属性给父组件，增强封装性。\n\n## useState 和 useReducer 在状态管理上有何不同？\n\n`useState` 适用于简单状态管理，状态更新逻辑直接，每次更新状态相对独立。\n\n`useReducer` 用于复杂状态管理，当状态更新依赖先前状态且多个子状态相互关联时更适用，它将状态更新逻辑集中在 reducer 函数中，通过派发 action 来更新状态，使代码结构更清晰，可维护性更强。\n\n## useState 和 useRef 的区别\n\n**`useState`：**\n\n- 目的是保存界面状态。\n- 需要通过设置的更新函数对值进行修改。\n- 值的更新会触发 UI 渲染。\n- 更新是异步的。\n\n**`useRef`：**\n\n- 目的是缓存持久化数据或 DOM 节点。\n- 直接修改 `.current` 属性完成更新。\n- 值的更新不会触发 UI 渲染。\n- 更新是同步的。\n\n## useEffect 和 useLayoutEffect 的执行时机有什么区别？\n\n`useEffect` 在浏览器绘制完成后异步执行，不会阻塞浏览器渲染，适合执行一些不会影响页面视觉的副作用操作，如网络请求。\n\n`useLayoutEffect` 在 DOM 更新后、浏览器绘制之前同步执行，适合执行与布局相关且需在浏览器绘制前完成的操作，如获取元素尺寸并据此调整样式，以避免页面闪烁。\n\n## useMemo 和 useCallback 都有缓存功能，它们的主要区别是什么？\n\n`useMemo` 缓存的是计算结果，主要用于避免昂贵的计算操作重复执行，提升性能。\n\n`useCallback` 缓存的是回调函数，主要用于控制子组件因回调函数引用变化而导致的不必要重新渲染。\n\n## React Hook 闭包陷阱\n\nJS 的闭包特性，会让函数保存其外部的变量值。而 React 本质是调用函数渲染组件，每次执行会更新其作用域，但如果 `useEffect` 没有正确设置依赖导致没有更新，那么里面的闭包会访问原本未更新的值。\n\n在 React 中，常出现以下两种情况：\n\n### 1. useState 中的闭包\n\n例如，有一个按钮，其点击计数是一个名为 `count` 的 state。`count` 通过 `handleClick` 来更新。`handleClick` 中使用 `setTimeout(setCount(count + 1), 1000)` 来更新 `count` 的值。由于闭包特性，在 1s 内，连续点击按钮，由于 `count` 来不及更新，所以 `count` 一直是初始值，最后结果就只是 `count + 1`。\n\n可以使用函数式更新来避免这种情况。也可以使用 `useRef` 来缓存值。\n\n### 2. useEffect 中的闭包\n\n例如，在没有依赖项的 `useEffect` 中，使用 `setInterval` 来持续更新一个 state 值，由于此 `useEffect` 只会在初始渲染执行一次，所以 `setInterval` 内部保存的一直是初始值，外部的更新无法影响到它。\n\n这种情况可以在 `useEffect` 中通过 `return` 返回一个用于销毁 `setInterval` 的函数来解决，但是计时会不准确。最好是用 `useRef` 来缓存值。\n\n## React 循环为什么不推荐 index 做 key\n\nReact 循环中需要提供 `key` 用来唯一标识元素，它可以高效地帮助 React 识别元素是否变化，借此可以判断如何就地复用没有改变的列表项，优化 DOM 更新性能。\n\n如果使用 `index` 作为 `key`，当元素顺序变更时，`key` 的值会改变，会触发意外更新，影响性能。应该使用唯一 ID 来作为 `key` 的值。\n\n## React 如何进行路由变化监听\n\n使用 `react-router` 库。\n\n### 1. 配置\n\n- 通过 `BrowserRouter`（History API）或 `HashRouter`（Hash Change）包裹整个 `App` 组件来生效全局路由。\n- 使用 `Routes` 组件和 `Route` 组件配置路由表。`Route` 组件通过 `path` 属性指定 URL，通过 `element` 属性指定对应的组件。\n\n### 2. 路由跳转\n\n- 通过 `Link` 组件跳转路由，使用 `to` 属性配置跳转目标。\n- 通过 `useNavigate` 获取 `navigate` 方法：\n  - 传入对应目标 URL 跳转指定路由\n  - 传入数值实现跳转指定步数\n  - 第二个参数传入配置对象，如 `{ replace: true }` 表示替换当前路由\n\n### 3. 获取参数\n\n- 目标页面通过 `useParams` 获取动态路由参数\n- 通过 `useSearchParams` 获取 `?` 后的键值参数\n\n### 4. 嵌套路由\n\n- 子组件中使用 `Outlet` 组件来渲染路由对应的组件，实现主界面不变，子界面通过路由更新。\n\n### 5. 重定向\n\n- 通过 `Navigate` 组件实现重定向，使用 `to` 属性配置重定向目标，使用 `replace` 属性控制是否替换路由。\n\n## React 事件和原生事件的执行顺序\n\n在捕获阶段和冒泡阶段，如果原生事件和 React 事件都有绑定在相同元素上，原生事件捕获处理函数会先于 React 合成事件的捕获处理函数执行。\n\n当事件到达目标元素时，如果在目标元素上同时绑定了原生事件和 React 事件，React 合成事件会先执行。\n\n**React 合成事件的机制：**\n\n- **事件委托：** React 使用事件委托机制，将所有事件绑定到最外层的 `document` 对象上（在移动端是 `document` 或 `window`）。当事件发生时，React 根据事件的目标信息，通过自己的事件分发机制来确定具体应该执行哪个组件的事件处理函数。这使得 React 能够高效地管理和处理事件，减少内存开销。\n- **合成事件对象：** React 合成事件不是原生事件本身，而是对原生事件的封装。它提供了跨浏览器的兼容性，并且在合成事件对象上提供了统一的属性和方法。例如，`e.preventDefault()` 和 `e.stopPropagation()` 等方法在不同浏览器下行为一致，而原生事件在不同浏览器可能存在差异。\n\n## React 生命周期\n\n- `componentDidMount`：通过空依赖数组的 `useEffect` 实现\n- `componentDidUpdate`：通过提供依赖项的 `useEffect` 实现\n- `componentWillUnmount`：通过 `useEffect` 的返回值实现\n\n使用 `useLayoutEffect` 可以在 DOM 更新后渲染前执行副作用。\n\n## 在 constructor 中为什么要调用 super(props)？\n\n在 React 类组件中，`constructor` 里调用 `super(props)` 是为了初始化父类（`React.Component`）的构造函数。这一步确保了 `this.props` 在组件中可用，同时为正确初始化 state 和绑定事件处理函数提供基础。如果不调用 `super(props)`，在构造函数中访问 `this.props` 会导致错误。\n",
    "headings": [
      {
        "depth": 1,
        "text": "React",
        "slug": "react"
      },
      {
        "depth": 2,
        "text": "Fiber 架构解决的核心问题",
        "slug": "fiber-架构解决的核心问题"
      },
      {
        "depth": 3,
        "text": "同步阻塞问题",
        "slug": "同步阻塞问题"
      },
      {
        "depth": 3,
        "text": "缺乏优先级调度",
        "slug": "缺乏优先级调度"
      },
      {
        "depth": 3,
        "text": "无法实现并发特性",
        "slug": "无法实现并发特性"
      },
      {
        "depth": 2,
        "text": "Fiber 工作原理",
        "slug": "fiber-工作原理"
      },
      {
        "depth": 2,
        "text": "React 渲染过程",
        "slug": "react-渲染过程"
      },
      {
        "depth": 3,
        "text": "Render 阶段（可中断）",
        "slug": "render-阶段可中断"
      },
      {
        "depth": 3,
        "text": "Commit 阶段（不可中断）",
        "slug": "commit-阶段不可中断"
      },
      {
        "depth": 2,
        "text": "为什么函数式更新 State 可以拿到上一次状态并更新，它的底层原理是什么",
        "slug": "为什么函数式更新-state-可以拿到上一次状态并更新它的底层原理是什么"
      },
      {
        "depth": 2,
        "text": "setState 的处理过程",
        "slug": "setstate-的处理过程"
      },
      {
        "depth": 2,
        "text": "React 不立即更新 state 的底层原理和原因是什么",
        "slug": "react-不立即更新-state-的底层原理和原因是什么"
      },
      {
        "depth": 2,
        "text": "React 如何实现 Vue 中 keep-alive 的功能",
        "slug": "react-如何实现-vue-中-keep-alive-的功能"
      },
      {
        "depth": 3,
        "text": "使用 React.memo 和自定义状态管理",
        "slug": "使用-reactmemo-和自定义状态管理"
      },
      {
        "depth": 3,
        "text": "使用 React.lazy 和 Suspense 配合缓存",
        "slug": "使用-reactlazy-和-suspense-配合缓存"
      },
      {
        "depth": 3,
        "text": "使用第三方库 react-cached-component",
        "slug": "使用第三方库-react-cached-component"
      },
      {
        "depth": 2,
        "text": "React.memo 和 Vue 的 keep-alive 在实现原理上有什么不同？",
        "slug": "reactmemo-和-vue-的-keep-alive-在实现原理上有什么不同"
      },
      {
        "depth": 2,
        "text": "在使用 React.lazy 和 Suspense 实现类似 keep-alive 功能时，如何处理缓存更新？",
        "slug": "在使用-reactlazy-和-suspense-实现类似-keep-alive-功能时如何处理缓存更新"
      },
      {
        "depth": 2,
        "text": "React Hooks 使用限制及原因",
        "slug": "react-hooks-使用限制及原因"
      },
      {
        "depth": 2,
        "text": "常用的 React Hooks",
        "slug": "常用的-react-hooks"
      },
      {
        "depth": 3,
        "text": "useState",
        "slug": "usestate"
      },
      {
        "depth": 3,
        "text": "useEffect",
        "slug": "useeffect"
      },
      {
        "depth": 3,
        "text": "useLayoutEffect",
        "slug": "uselayouteffect"
      },
      {
        "depth": 3,
        "text": "useContext",
        "slug": "usecontext"
      },
      {
        "depth": 3,
        "text": "useReducer",
        "slug": "usereducer"
      },
      {
        "depth": 3,
        "text": "useMemo",
        "slug": "usememo"
      },
      {
        "depth": 3,
        "text": "useCallback",
        "slug": "usecallback"
      },
      {
        "depth": 3,
        "text": "useRef",
        "slug": "useref"
      },
      {
        "depth": 3,
        "text": "useImperativeHandle",
        "slug": "useimperativehandle"
      },
      {
        "depth": 2,
        "text": "useState 和 useReducer 在状态管理上有何不同？",
        "slug": "usestate-和-usereducer-在状态管理上有何不同"
      },
      {
        "depth": 2,
        "text": "useState 和 useRef 的区别",
        "slug": "usestate-和-useref-的区别"
      },
      {
        "depth": 2,
        "text": "useEffect 和 useLayoutEffect 的执行时机有什么区别？",
        "slug": "useeffect-和-uselayouteffect-的执行时机有什么区别"
      },
      {
        "depth": 2,
        "text": "useMemo 和 useCallback 都有缓存功能，它们的主要区别是什么？",
        "slug": "usememo-和-usecallback-都有缓存功能它们的主要区别是什么"
      },
      {
        "depth": 2,
        "text": "React Hook 闭包陷阱",
        "slug": "react-hook-闭包陷阱"
      },
      {
        "depth": 3,
        "text": "1. useState 中的闭包",
        "slug": "1-usestate-中的闭包"
      },
      {
        "depth": 3,
        "text": "2. useEffect 中的闭包",
        "slug": "2-useeffect-中的闭包"
      },
      {
        "depth": 2,
        "text": "React 循环为什么不推荐 index 做 key",
        "slug": "react-循环为什么不推荐-index-做-key"
      },
      {
        "depth": 2,
        "text": "React 如何进行路由变化监听",
        "slug": "react-如何进行路由变化监听"
      },
      {
        "depth": 3,
        "text": "1. 配置",
        "slug": "1-配置"
      },
      {
        "depth": 3,
        "text": "2. 路由跳转",
        "slug": "2-路由跳转"
      },
      {
        "depth": 3,
        "text": "3. 获取参数",
        "slug": "3-获取参数"
      },
      {
        "depth": 3,
        "text": "4. 嵌套路由",
        "slug": "4-嵌套路由"
      },
      {
        "depth": 3,
        "text": "5. 重定向",
        "slug": "5-重定向"
      },
      {
        "depth": 2,
        "text": "React 事件和原生事件的执行顺序",
        "slug": "react-事件和原生事件的执行顺序"
      },
      {
        "depth": 2,
        "text": "React 生命周期",
        "slug": "react-生命周期"
      },
      {
        "depth": 2,
        "text": "在 constructor 中为什么要调用 super(props)？",
        "slug": "在-constructor-中为什么要调用-superprops"
      }
    ],
    "searchText": "react 前端框架 react fiber 架构解决的核心问题 同步阻塞问题 旧架构用同步递归遍历虚拟 dom，当组件树庞大时，会长时间占用主线程。由于 js 是单线程，会导致卡顿、输入延迟、掉帧。 缺乏优先级调度 旧架构中所有更新操作的优先级相同（如用户输入、网络请求回调、日志上报）。如列表渲染等非关键任务可能阻塞如按钮点击等关键任务，无法保证核心交互的响应性。 无法实现并发特性 同步渲染模式下，无法中断、恢复或放弃渲染任务，为后续的 suspense、时间切片（time slicing）等并发特性设置了技术障碍。 fiber 工作原理 fiber 是一套可中断、可恢复、优先级可控的协调算法。 首先是核心数据结构——fiber 节点，将渲染任务拆分为最小的工作单元。每个 react 元素对应一个 fiber 节点，节点内记录了组件状态、优先级（lanes）、副作用标记（effecttag）、以及双缓存关联（alternate）。 fiber 对结构进行了改造，用链表替代递归栈，通过 child（第一个子节点）、sibling（下一个兄弟节点）、return（父节点）指针连接，支持随时中断和恢复遍历。 其次是 react 内存中维护两棵 fiber 树，保证更新的原子性： current 树： 与当前页面真实 dom 对应的树，代表当前渲染状态。 workinprogress 树： 在内存中构建的新树，所有的 diff 计算、状态更新都在这棵树上进行，不影响当前界面。 当 workinprogress 树构建完成后，仅需切换 current 指针，即可完成视图更新，避免用户看到半成品 ui。 然后是由 scheduler（调度器）主导任务执行顺序，基于 lanes（车道模型）为不同更新分配优先级，高优先级任务可中断低优先级任务。利用浏览器空闲时间（通过 requestidlecallback 或自研调度器）执行工作单元，每执行完一个单元就检查剩余时间。若时间不足或有高优先级任务，立即暂停当前任务，待下一次空闲时恢复。 react 渲染过程 render 阶段（可中断） 遍历 fiber 树，执行 diff 算法，标记副作用（如插入、更新、删除），生成副作用链表（effect list）。 commit 阶段（不可中断） 遍历副作用链表，一次性将变更应用到真实 dom，并执行生命周期钩子（如 componentdidmount）或 hooks 副作用。 为什么函数式更新 state 可以拿到上一次状态并更新，它的底层原理是什么 react 内部维护了有序的更新队列（update queue）和状态快照（currentstate），并对函数式更新进行了\"链式求值\"处理。 因为 react 会在更新时封装一个 update 对象存进队列，然后在每次处理 update 对象时更新 currentstate 的值，也就是一个中间状态，最后在调用更新函数时将 currentstate 传入，作为第一个参数（prevstate）。 而对象式更新则基于最原始的 state 值进行更新。 setstate 的处理过程 1. 当调用 setstate 时，react 会创建一个 update 对象，放入更新链表，并不会立即执行更新操作。 2. 当前执行上下文执行结束后，react 进入批量更新阶段，开始遍历整个更新链表，并维护一个快照，这个快照称为 currentstate。 3. 更新过程中，一开始，currentstate 的值是 state 的初始值，随着 update 对象的遍历处理，currentstate 的值会逐步更新。 4. 对于函数式更新来说，currentstate 的值会作为更新函数的第一个参数 prevstate 被传入。对于对象式更新，则会基于 state 的原始值进行更新。 5. 当整个更新过程结束后，react 会将 currentstate 的值赋值给 state，然后触发组件的 render 函数触发渲染，更新完成。 react 不立即更新 state 的底层原理和原因是什么 性能优化，减少高频 dom 渲染开销； 保证 ui 一致性，避免中间状态的闪烁和逻辑 bug； 支持事务性更新和优先级调度，提升用户交互体验。 react 如何实现 vue 中 keep alive 的功能 使用 react.memo 和自定义状态管理 react.memo 是一个高阶组件，它可以对函数式组件进行浅比较，如果组件的 props 没有变化，就不会重新渲染组件。通过结合自定义状态管理（如 usestate 或 usereducer）来保存组件内部状态，从而达到类似 keep alive 保留组件状态的效果。 使用 react.lazy 和 suspense 配合缓存 react.lazy 用于动态导入组件，suspense 用于在组件加载时显示加载状态。通过合理设置缓存机制，可以实现组件的缓存复用。适用于组件加载开销较大且需要缓存的场景。 使用第三方库 react cached component 该库提供了一种简单的方式来缓存 react 组件。它会在组件卸载时保存组件的状态，在重新挂载时恢复状态。 react.memo 和 vue 的 keep alive 在实现原理上有什么不同？ react.memo 主要通过浅比较 props 来决定组件是否重新渲染，侧重于避免不必要的渲染以提升性能，它本身不负责缓存组件实例，需要结合状态管理来保留组件状态。 而 vue 的 keep alive 直接缓存组件实例，在组件切换时，组件的生命周期钩子函数会进入特定的缓存状态（如 activated 和 deactivated），组件状态得以保留，其实现是基于 vue 自身的组件管理和生命周期机制。 在使用 react.lazy 和 suspense 实现类似 keep alive 功能时，如何处理缓存更新？ 可以通过在组件内部使用 useeffect 钩子，在依赖项发生变化时手动触发缓存更新。例如，当某个数据更新导致需要更新缓存的组件时，可以在 useeffect 中通过设置一个标志位，触发组件重新渲染，从而实现缓存更新。 另外，也可以结合自定义的缓存管理逻辑，在合适的时机清除或更新缓存。 react hooks 使用限制及原因 1. hooks 只能在函数组件顶层调用，不能在循环、条件、嵌套函数中调用。因为 react 通过队列维护了 hooks 依赖调用顺序，并以此来正确管理状态和副作用。对于循环、条件等情况，会打破队列的调用顺序，导致无法匹配正确的 state 和副作用。如果实在需要，可以将 hooks 提取到单独的组件中，然后在新组件的顶层调用 hooks。 2. hooks 只能在 react 函数组件或自定义 hooks 里调用。因为 hooks 依赖 react 的上下文环境。 3. hooks 需要稳定的依赖数组，例如 useeffect、usecallback、usememo 这类需要提供依赖数组的 hooks，如果依赖数组是动态的，会导致每次副作用触发时机不可控，导致潜在的功能和性能问题。 常用的 react hooks usestate 为函数组件添加状态。返回一个包含当前状态值和用于更新该状态的函数的数组。 useeffect 在函数组件中执行副作用操作，比如数据获取、订阅事件或手动修改 dom。接收一个回调函数和一个依赖数组作为参数。 使用场景： 数据获取场景，在组件挂载后从服务器获取数据； 监听事件，例如监听窗口的滚动事件； 操作 dom，在组件渲染后对 dom 元素进行特定操作。 依赖数组为空时，副作用只在组件挂载和卸载时执行；依赖数组包含某些变量时，当这些变量变化，副作用会重新执行。 uselayouteffect 与 useeffect 类似，但它会在浏览器绘制之前同步执行，在 dom 更新后立即执行副作用操作。 使用场景： 当需要在 dom 更新后立即测量 dom 元素的布局或进行与布局相关的操作时使用。 例如获取元素的尺寸并根据其进行样式调整，且要确保这些操作在浏览器绘制之前完成，避免页面闪烁等问题。 usecontext 在函数组件中消费 react 上下文（context），实现跨组件层级共享数据，无需通过 props 层层传递。 使用场景： 应用中有一些全局数据，如主题、用户认证信息等，多个组件都需要使用这些数据，且这些组件在组件树中位置较分散，使用 usecontext 可方便共享数据。 使用方法：在父组件上使用 createcontext 返回的 provider 属性，在子组件中使用 usecontext 接收。 usereducer 用于在函数组件中管理复杂状态逻辑。接收一个 reducer 函数和初始状态作为参数，返回当前状态以及一个用于派发 action 的函数。 使用场景： 状态更新逻辑复杂，且涉及多个子状态相互关联的场景。 例如表单验证，输入框的状态会影响整个表单的验证结果；多步骤向导，每个步骤的状态会影响后续步骤的显示和操作。 usememo 对计算结果进行缓存，只有当它的依赖项发生变化时才会重新计算。接收一个回调函数和一个依赖数组作为参数，返回回调函数的计算结果。 使用场景： 当有昂贵的计算操作，且计算结果依赖的变量不频繁变化时，使用 usememo 可避免不必要的重复计算，提升性能。 比如复杂的数组排序或过滤操作，只有在数组或相关参数变化时才重新计算。 usecallback 缓存回调函数，只有当它的依赖项发生变化时才会重新生成回调函数。接收一个回调函数和一个依赖数组作为参数，返回缓存后的回调函数。 使用场景： 需要将回调函数传递给子组件，且希望控制子组件的重新渲染时机。 如果子组件使用了 react.memo，由于父组件重新渲染会重建内部所有函数，导致传递给子组件的、作为 props 的回调函数引用变更，触发子组件的重渲染。 如果 useeffect 或者 usememo 依赖了一个函数，由于每次组件更新都会创建一个新的函数引用，因此会导致每次都执行副作用，此时可以使用 usecallback 缓存。 如果长列表中子列表项使用了列表的回调函数，例如 ondelete 回调，如果其中一个列表项变更，整个列表都会触发更新，从而使回调函数的引用更新，触发其他子列表项的渲染。此时，可以使用 usecallback 缓存回调函数，配合 react.memo，减少重更新。 useref 创建可变的 ref 对象，其 .current 属性在组件的整个生命周期内保持不变。可用于访问 dom 元素、保存可变值等。 使用场景： 获取 dom 元素的引用，例如在表单提交时获取输入框的值； 保存一个可变值，但不想触发组件重新渲染，如记录动画的当前状态。 useimperativehandle 在使用 forwardref 时，自定义暴露给父组件的实例值。 使用场景： 当子组件通过 forwardref 将 ref 传递给父组件时，父组件通常可以访问子组件的所有实例属性和方法。 使用 useimperativehandle 可以选择性地暴露特定的方法或属性给父组件，增强封装性。 usestate 和 usereducer 在状态管理上有何不同？ usestate 适用于简单状态管理，状态更新逻辑直接，每次更新状态相对独立。 usereducer 用于复杂状态管理，当状态更新依赖先前状态且多个子状态相互关联时更适用，它将状态更新逻辑集中在 reducer 函数中，通过派发 action 来更新状态，使代码结构更清晰，可维护性更强。 usestate 和 useref 的区别 usestate： 目的是保存界面状态。 需要通过设置的更新函数对值进行修改。 值的更新会触发 ui 渲染。 更新是异步的。 useref： 目的是缓存持久化数据或 dom 节点。 直接修改 .current 属性完成更新。 值的更新不会触发 ui 渲染。 更新是同步的。 useeffect 和 uselayouteffect 的执行时机有什么区别？ useeffect 在浏览器绘制完成后异步执行，不会阻塞浏览器渲染，适合执行一些不会影响页面视觉的副作用操作，如网络请求。 uselayouteffect 在 dom 更新后、浏览器绘制之前同步执行，适合执行与布局相关且需在浏览器绘制前完成的操作，如获取元素尺寸并据此调整样式，以避免页面闪烁。 usememo 和 usecallback 都有缓存功能，它们的主要区别是什么？ usememo 缓存的是计算结果，主要用于避免昂贵的计算操作重复执行，提升性能。 usecallback 缓存的是回调函数，主要用于控制子组件因回调函数引用变化而导致的不必要重新渲染。 react hook 闭包陷阱 js 的闭包特性，会让函数保存其外部的变量值。而 react 本质是调用函数渲染组件，每次执行会更新其作用域，但如果 useeffect 没有正确设置依赖导致没有更新，那么里面的闭包会访问原本未更新的值。 在 react 中，常出现以下两种情况： 1. usestate 中的闭包 例如，有一个按钮，其点击计数是一个名为 count 的 state。count 通过 handleclick 来更新。handleclick 中使用 settimeout(setcount(count + 1), 1000) 来更新 count 的值。由于闭包特性，在 1s 内，连续点击按钮，由于 count 来不及更新，所以 count 一直是初始值，最后结果就只是 count + 1。 可以使用函数式更新来避免这种情况。也可以使用 useref 来缓存值。 2. useeffect 中的闭包 例如，在没有依赖项的 useeffect 中，使用 setinterval 来持续更新一个 state 值，由于此 useeffect 只会在初始渲染执行一次，所以 setinterval 内部保存的一直是初始值，外部的更新无法影响到它。 这种情况可以在 useeffect 中通过 return 返回一个用于销毁 setinterval 的函数来解决，但是计时会不准确。最好是用 useref 来缓存值。 react 循环为什么不推荐 index 做 key react 循环中需要提供 key 用来唯一标识元素，它可以高效地帮助 react 识别元素是否变化，借此可以判断如何就地复用没有改变的列表项，优化 dom 更新性能。 如果使用 index 作为 key，当元素顺序变更时，key 的值会改变，会触发意外更新，影响性能。应该使用唯一 id 来作为 key 的值。 react 如何进行路由变化监听 使用 react router 库。 1. 配置 通过 browserrouter（history api）或 hashrouter（hash change）包裹整个 app 组件来生效全局路由。 使用 routes 组件和 route 组件配置路由表。route 组件通过 path 属性指定 url，通过 element 属性指定对应的组件。 2. 路由跳转 通过 link 组件跳转路由，使用 to 属性配置跳转目标。 通过 usenavigate 获取 navigate 方法： 传入对应目标 url 跳转指定路由 传入数值实现跳转指定步数 第二个参数传入配置对象，如 { replace: true } 表示替换当前路由 3. 获取参数 目标页面通过 useparams 获取动态路由参数 通过 usesearchparams 获取 ? 后的键值参数 4. 嵌套路由 子组件中使用 outlet 组件来渲染路由对应的组件，实现主界面不变，子界面通过路由更新。 5. 重定向 通过 navigate 组件实现重定向，使用 to 属性配置重定向目标，使用 replace 属性控制是否替换路由。 react 事件和原生事件的执行顺序 在捕获阶段和冒泡阶段，如果原生事件和 react 事件都有绑定在相同元素上，原生事件捕获处理函数会先于 react 合成事件的捕获处理函数执行。 当事件到达目标元素时，如果在目标元素上同时绑定了原生事件和 react 事件，react 合成事件会先执行。 react 合成事件的机制： 事件委托： react 使用事件委托机制，将所有事件绑定到最外层的 document 对象上（在移动端是 document 或 window）。当事件发生时，react 根据事件的目标信息，通过自己的事件分发机制来确定具体应该执行哪个组件的事件处理函数。这使得 react 能够高效地管理和处理事件，减少内存开销。 合成事件对象： react 合成事件不是原生事件本身，而是对原生事件的封装。它提供了跨浏览器的兼容性，并且在合成事件对象上提供了统一的属性和方法。例如，e.preventdefault() 和 e.stoppropagation() 等方法在不同浏览器下行为一致，而原生事件在不同浏览器可能存在差异。 react 生命周期 componentdidmount：通过空依赖数组的 useeffect 实现 componentdidupdate：通过提供依赖项的 useeffect 实现 componentwillunmount：通过 useeffect 的返回值实现 使用 uselayouteffect 可以在 dom 更新后渲染前执行副作用。 在 constructor 中为什么要调用 super(props)？ 在 react 类组件中，constructor 里调用 super(props) 是为了初始化父类（react.component）的构造函数。这一步确保了 this.props 在组件中可用，同时为正确初始化 state 和绑定事件处理函数提供基础。如果不调用 super(props)，在构造函数中访问 this.props 会导致错误。"
  },
  {
    "slug": "012-typescript",
    "title": "TypeScript",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/TypeScript.md",
    "markdown": "# TypeScript\n\n## TypeScript 和 JavaScript 的区别\n\n1. JS 是动态类型，弱类型，代码在运行时推断变量或是参数的类型，只有在运行时才能发现类型不匹配的 bug。而 TS 是静态类型，强类型，通过类型注解和静态编译检查类型，可以在编译期间提早发现潜在的问题。\n2. TS 在 JS 基础上，增加了泛型、枚举、接口等语法扩展，使其更完善。\n\n## Interface 和 Type 的区别\n\n二者都可以描述对象的结构。\n\n1. `Interface` 侧重于描述接口约束，即对象应该具有什么属性、方法。可以通过 `extends` 关键字进行扩展，支持声明合并，可以直接被实现。\n2. `type` 侧重于类型别名，复用类型，如给联合类型、交叉元素等复杂类型一个别名，使其更方便复用。用 `&` 扩展，不支持声明合并。除了对象，还支持声明基本类型的 `type`。只有对象类型的 `type` 可以被实现。\n\n## TypeScript 的泛型有什么作用，在哪些场景下使用？\n\n泛型允许编写可复用的代码，同时保持类型安全。通过使用类型参数，函数、类或接口可以适应不同的类型，而不需要为每种类型单独编写代码。\n\n通常用于通用工具方法，这类方法通常会接收不同类型的参数，并根据参数类型做出相应的操作。\n",
    "headings": [
      {
        "depth": 1,
        "text": "TypeScript",
        "slug": "typescript"
      },
      {
        "depth": 2,
        "text": "TypeScript 和 JavaScript 的区别",
        "slug": "typescript-和-javascript-的区别"
      },
      {
        "depth": 2,
        "text": "Interface 和 Type 的区别",
        "slug": "interface-和-type-的区别"
      },
      {
        "depth": 2,
        "text": "TypeScript 的泛型有什么作用，在哪些场景下使用？",
        "slug": "typescript-的泛型有什么作用在哪些场景下使用"
      }
    ],
    "searchText": "typescript 前端框架 typescript typescript 和 javascript 的区别 1. js 是动态类型，弱类型，代码在运行时推断变量或是参数的类型，只有在运行时才能发现类型不匹配的 bug。而 ts 是静态类型，强类型，通过类型注解和静态编译检查类型，可以在编译期间提早发现潜在的问题。 2. ts 在 js 基础上，增加了泛型、枚举、接口等语法扩展，使其更完善。 interface 和 type 的区别 二者都可以描述对象的结构。 1. interface 侧重于描述接口约束，即对象应该具有什么属性、方法。可以通过 extends 关键字进行扩展，支持声明合并，可以直接被实现。 2. type 侧重于类型别名，复用类型，如给联合类型、交叉元素等复杂类型一个别名，使其更方便复用。用 & 扩展，不支持声明合并。除了对象，还支持声明基本类型的 type。只有对象类型的 type 可以被实现。 typescript 的泛型有什么作用，在哪些场景下使用？ 泛型允许编写可复用的代码，同时保持类型安全。通过使用类型参数，函数、类或接口可以适应不同的类型，而不需要为每种类型单独编写代码。 通常用于通用工具方法，这类方法通常会接收不同类型的参数，并根据参数类型做出相应的操作。"
  },
  {
    "slug": "013-vue",
    "title": "Vue",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/Vue.md",
    "markdown": "# Vue\n\n## reactive 和 ref 的区别和相同点\n\n1. `reactive` 只能处理对象数据类型，`ref` 既可以处理对象类型，也可以处理基本类型。所以当处理基本类型的时候，需要使用 `ref`。而在不涉及解构赋值或整体替换的操作时，`reactive` 可以提供更方便的写法。\n2. `ref` 底层调用了 `reactive`，底层都是基于 `Proxy` 的拦截。不同的是 `ref` 对基本类型进行了封装处理，所以在 `script` 中访问需要使用 `.value` 属性，而 `reactive` 不需要。而在模板中，二者都不需要额外的解包操作。\n3. 在 `script` 中，对 `reactive` 对象的解构赋值，会导致失去响应性，需要使用 `toRef` 或者 `toRefs`。而 `ref` 则不需要考虑这点。而在 HTML 模板中，如果使用了展开运算符，那么二者都不会再具有响应性，同样可以使用 `toRefs` 解决。\n\n## 为什么 ref 需要 .value 属性？\n\nVue 3 的响应式系统基于 `Proxy` 实现，而 `Proxy` 只能劫持对象的属性访问（如 `obj.key`），无法直接劫持基本类型值。\n\n所以 Vue 将基本元素打包成了 `RefImpl` 对象，然后调用 `reactive` 实现了响应式。而 `RefImpl` 中定义了 `value` 属性用于返回值。\n\n## v-if 和 v-show 的区别\n\n`v-if` 类似 `display: none`，当 `v-if` 是 `false` 时，该组件不会存在于虚拟 DOM 和 Virtual DOM 中，不会占据内存。因此频繁切换显示隐藏状态时性能不好。好处是首次如果不需要加载，会获得更良好的性能。\n\n`v-show` 类似 `visibility: hidden`，当 `v-show` 是 `false` 时，该组件不会被移出 DOM 结构，而是不参与渲染。因此频繁切换状态时性能良好。但是如果首次不需要显示，由于组件仍然占据内存，所以会影响首次加载性能。\n\n## Vue3 对比 Vue2 的改进\n\n### 1. 优化了响应式系统（Vue3 用 Proxy 代替 Object.defineProperty 的原因）\n\n**Vue2 的实现：** Vue2 使用 `Object.defineProperty` 接口，通过拦截 getter 和 setter 来进行依赖追踪和响应式更新，同时也在 `Array` 的原型链上重写了方法来劫持对数组的修改。\n\n**Vue2 设计的局限：**\n\n- 无法监听到直接修改对象属性的操作。\n- 无法监听到对数组下标的直接操作。\n- 在面对层级深的对象结构时，递归调用 `Object.defineProperty` 也很耗费性能。\n- 不准确的依赖追踪可能导致内存泄漏和渲染性能的下降。\n\n**Vue3 的改进：**\n\n- 通过 ES6 `Proxy` 机制代理整个对象，同时在内部使用 `Reflect` 来实现操作。\n- 可以监听到对象属性的修改和对数组下标的操作。\n- 对于层级深的对象，Vue3 不会在一开始就深度遍历收集依赖，而是在实际访问的时候才收集，优化了初始化的性能。\n\n### 2. 优化了虚拟 DOM 的 diff 算法（Vue3 的 patch 算法做了哪些更新）\n\n- **静态节点标记：** Vue3 会对模板中的静态节点，例如文本节点、没有进行插值绑定或属性绑定的节点等进行标记，从而跳过每次组件更新的 diff 对比，直接复用。\n- **PatchFlag：** 通过标记节点可能的变化属性，例如 `TEXT` 表示文本，`CLASS` 表示类名等，在 diff 过程中只对比可能发生变化的部分，避免节点之间全量比较。\n- **动态节点提升：** 对于动态组件的静态框架部分，Vue3 会将其提升到渲染函数外部，仅在初始化时调用，每次仅更新动态数据影响的部分。\n- **双端比较算法优化：** Vue2 采用了双端对比法进行 diff，Vue3 在此基础上，新增了根据 `key` 找到对应节点尝试排序的算法，减少节点的移动操作，保证最大程度的节点复用。\n- **最长递增子序列算法优化：** 在子节点对比中，使用最长递增子序列算法进行优化，同样可以减少移动 DOM 节点的次数。\n\n### 3. Composition API 组合式 API（Composition API 与 Options API 相比，有哪些优势）\n\n**Vue2 的做法：** 通过 Options API 选项式 API 构建 Vue 组件，这个方式的好处是直观易懂，分类明确。\n\n**Options API 的局限：**\n\n- 当组件逻辑变得复杂时，涉及统一逻辑点的不同片段会被分散在不同选项上，使得组件内部不够内聚，关注点十分分散。\n- 当一段逻辑需要被多个组件复用时，除了重复书写，就是使用公共组件复用或 Mixin 特性实现，开发复杂，容易造成命名冲突，且数据来源也不清晰。\n\n**Composition API 的优势：** 逻辑点统一，归属于同一个逻辑点的代码自然会被书写在一起，且易于进行封装复用，在其他组件使用时仅需引用这个函数即可，来源清晰。\n\n### 4. TypeScript 支持\n\n更完善的类型定义和类型推断。\n\n### 5. Fragment 特性（什么是 Fragment？Fragment 在实际项目中有哪些应用场景）\n\n- Vue2 中，仅支持单根节点，在没有单根节点的场景下，需要使用额外的 `<template>` 标签进行包裹，这使得 DOM 结构中存在许多无意义的节点需要处理，代码结构变得复杂。\n- Vue3 支持了 Fragment，允许组件返回多个根节点，无需额外添加 `<template>`，减少了无意义的节点。\n\n### 6. Teleport 特性（什么是 Teleport？Teleport 在实际项目中有哪些应用场景）\n\n- 这个特性允许将组件移动到指定的节点下方。\n- 例如对于弹窗，可以很方便地从深层的子组件挂载到 `body` 下方，避免出现样式和布局问题。\n- 例如一些三方库提供的组件，可能有指定挂载节点的要求，`Teleport` 可以使组件的使用更灵活。\n\n### 7. 打包优化\n\n- Vue3 全面支持 ES Module，并在构建过程中进行了更深入的静态分析，实现了更精准的 Tree-Shaking。\n- 通过组件层面的按需引入和指令的按需编译，减少无用代码的打包。\n- `Proxy` 的实现和渲染函数的优化，使得代码更轻量，自然减少打包体积。\n\n## Vue3 的响应式系统原理\n\nVue3 的响应式系统基于 ES6 的 `Proxy` 和 `Reflect` 实现。通过 `Proxy` 对目标对象进行代理，拦截对象的各种操作，通过 `Reflect` 转发操作并收集依赖，从而实现对数据变化的追踪和响应，当依赖的数据发生变化时，自动触发相关副作用函数重新执行，更新视图。\n\n## 什么是虚拟 DOM（Virtual DOM）？它解决了哪些问题？\n\n虚拟 DOM（Virtual DOM）是一种在 JavaScript 中对真实 DOM 的抽象表示。它以 JavaScript 对象的形式存在，描述了真实 DOM 的结构、属性和节点关系。\n\n通过在内存中操作虚拟 DOM，并与上一次的虚拟 DOM 进行对比，计算出最小的变化集，然后将这些变化应用到真实 DOM 上，从而高效地更新页面，解决了频繁直接操作真实 DOM 带来的性能问题，同时也提升了开发的可维护性和灵活性。\n\n## Vue 的虚拟 DOM Diff 过程 / 双端比较算法\n\nVue 的 Diff 过程会按层级匹配新旧 DOM 结构的节点，只对比同层级，照顾性能。在遍历对比子节点时，Vue 不同于 React，会采用双端对比算法进行 diff。\n\n1. 首先，Vue 会设置四个指针，分别指向新旧虚拟 DOM 结构的头尾。\n2. 然后，分别比较如下四项，如果 `key` 和标签名相同，则传入 `patch` 函数进行更新操作，并将对应指针向中间移动。\n   - 新头和旧头\n   - 新尾和旧尾\n   - 新尾和旧头\n   - 新头和旧尾\n3. 如果以上都不匹配，会在旧子节点列表中，找到 `key` 不变的节点，进行复用。这里采用了最长递增子序列的算法保证最大程度的就地复用。对于位置变了的节点，进行移动。\n4. 如果出现了新的子节点，则新建并插入到对应位置。\n5. 当旧子节点列表的双端指针相遇后，遍历过程完成。\n\n## computed 和 watch / watchEffect 的区别？\n\n`computed` 是计算属性，目的是将一段复杂的变量计算映射为一个独立的变量。依赖于其他响应式数据的值，通过计算返回一个新值。这个值会被缓存，仅当依赖变化时才重新计算。\n\n`watch` 是响应式数据监听，用于监听响应式数据的变化，并在变化时执行回调方法。这个过程不涉及缓存。\n\n`watch` 有三个配置：\n\n- `deep: true`：触发深度监听\n- `immediate: true`：在创建组件时立即调用一次回调\n- `flush`：\n  - `post`：组件更新后执行回调\n  - `sync`：同步执行回调\n  - `pre`：组件更新前执行回调\n\n`watchEffect` 会立即执行传入的回调，并自动追踪内部用到的响应式数据。当依赖数据变化时，执行回调处理。\n\n## computed 的缓存机制是如何实现的，有什么好处？\n\nVue 内部为 `computed` 属性创建了一个 Watcher 实例，内部设置了标志位，表示该 `computed` 值是否被计算过。当首次访问时，标志位是 `true`。后续仅当依赖变化时，将标志位设为 `false`，触发重新计算。\n\n好处是减少不必要的计算，优化性能。\n\n## 为什么 computed 可以依赖另一个 computed？\n\n因为 `computed` 同样具有响应性，有自身的依赖追踪逻辑。\n\n## 多个 computed 相互依赖可能会带来什么问题？\n\n可能会引发不必要的重复计算，复杂的依赖关系也更难维护。\n\n必要时，应简化依赖关系，将关联的数据放在同一个 `computed` 中进行一次计算，或采用 `watch` 并手动实现缓存机制。\n\n## 在 Vue 的响应式系统中，computed 依赖的更新是同步还是异步的？\n\n`computed` 依赖的更新是同步的。同步更新机制使 `computed` 属性能够实时反映依赖数据的变化，为视图渲染提供准确的数据。\n\n## Vue 的生命周期\n\n### Vue3 的生命周期钩子有哪些主要变化？\n\n统一增加了 `on` 前缀，例如 `onMounted`，命名风格更统一、直观。\n\n新增 `onRenderTracked` 钩子，此钩子在组件渲染过程中，追踪到响应式依赖时被调用。\n\n新增 `onRenderTriggered` 钩子，当组件因响应式依赖变化而触发重新渲染时，会调用这个钩子。\n\n### setup() 函数的作用是什么？\n\n`setup()` 钩子是在组件中使用组合式 API 的入口，通常只在以下情况下使用：\n\n1. 需要在非单文件组件中使用组合式 API 时。\n2. 需要在基于选项式 API 的组件中集成基于组合式 API 的代码时。\n\n在组合式 API 的单文件组件中，可以使用 `<script setup>` 语法糖。\n\n### setup() 函数在组件的生命周期中处于什么位置？\n\n`setup()` 函数在 `beforeCreate` 钩子之前执行，并且它的执行结果会影响 `created` 钩子。\n\n## provide 和 inject 的作用是什么？\n\n`provide` 和 `inject` 是 Vue 中用于实现祖先组件向后代组件传递数据的一对选项。\n\n在大型组件树结构中，当一个祖先组件需要向其深层嵌套的后代组件传递数据，而又不想通过中间层层组件传递（避免中间组件无意义地接收和传递数据，造成代码冗余）时，就可以使用 `provide` 和 `inject`。\n\n## Vue3 中组件通信的方式有哪些？\n\n- 父组件传递 `Props` 赋值，子组件通过 `Emits` 抛出自定义事件更新。\n- 父组件 `provide`，后代组件 `inject`。\n\n## 什么是作用域插槽（Scoped Slots）？\n\n作用域插槽（Scoped Slots）是 Vue 中一种特殊类型的插槽，它允许子组件将自身的数据传递给父组件，同时父组件可以在插槽内容中使用这些子组件传递的数据进行自定义渲染。\n\n**使用场景：**\n\n- **列表渲染的定制化：** 例如，一个通用的列表组件，子组件提供列表数据，父组件可以通过作用域插槽根据数据中的不同字段，如用户角色，来决定每个列表项的样式或显示内容。\n- **可复用组件的扩展：** 比如表格组件，子组件提供表格数据和基本的表格结构，父组件可以通过作用域插槽定制每一列的渲染方式，如将数字字段渲染为进度条等。\n\n## 作用域插槽和具名插槽有什么区别？\n\n作用域插槽在父组件上通过 `v-slot=\"xxx\"`，在指令的值上绑定，用于传递数据。\n\n具名插槽在父组件上通过 `v-slot:xxx`，在指令的名上绑定，对应子组件 `slot` 组件的 `name` 属性，用于控制渲染的位置。\n\n## Vue3 中 v-model 的语法糖是如何实现的？与 Vue2 有何差异？\n\n`v-model` 是一种语法糖。\n\n在 Vue2 中，自定义组件使用 `v-model` 时，是通过 `value` prop 和 `input` 事件来实现双向绑定。\n\n在 Vue3 中它会被展开为一个 `value` prop 和一个 `update:value` 事件。Vue3 允许在一个组件上使用多个 `v-model`。还可以通过 `defineModel` 来处理自定义修饰符。\n\n## Vue3 中如何使用异步组件？\n\n使用 `defineAsyncComponent(() => import('./xxx.vue'))`。\n\n`defineAsyncComponent` 支持配置对象：\n\n```javascript\ndefineAsyncComponent({\n  loader: () => import(\"xxx.vue\"),\n  loadingComponent: 加载中组件,\n  errorComponent: 加载失败显示组件,\n  timeout: 加载超时,\n});\n```\n\n可以配合 `Suspense` 组件进行统一的加载状态和错误显示管理。`Suspense` 组件提供了如下能力：\n\n- `#default` 插槽：用于渲染异步组件\n- `#fallback` 插槽：用于渲染备用组件\n- `timeout` props：用于配置超时时间\n- `pending` 事件：进入渲染状态触发钩子\n- `resolve` 事件：渲染成功\n- `fallback` 事件：渲染失败\n\n## keep-alive 组件的作用与相关生命周期？\n\n`keep-alive` 主要用于缓存组件实例，避免重复渲染。当组件被 `keep-alive` 包裹时，在组件切换过程中，被切换掉的组件不会被销毁，而是被缓存起来。当下次再次切换到该组件时，直接从缓存中复用，而不是重新创建组件实例。\n\n**相关生命周期：**\n\n- `activated`：当被 `keep-alive` 缓存的组件激活（即从缓存中被重新使用，再次出现在视图中）时，会触发 `activated` 生命周期钩子。\n- `deactivated`：当被 `keep-alive` 缓存的组件失活（即从视图中被切换出去，进入缓存状态）时，会触发 `deactivated` 生命周期钩子。\n\n## Keep-Alive、Transition 的书写顺序\n\n外层 `Transition`，内层 `Keep-Alive`。\n\n## Vue 中如何定义全局方法\n\n### 在 Vue.prototype 上定义\n\n在 Vue 应用入口文件（通常是 `main.js`）中，通过 `Vue.prototype` 来添加全局方法，通过 `this` 访问。\n\n这种方式虽然简单直接，但会污染 `Vue.prototype`，可能会与未来 Vue 自身的属性或方法产生命名冲突。同时，在 TypeScript 项目中，可能需要额外的类型声明来正确识别这些全局方法。\n\n### 使用 Vue.mixin\n\n通过 `Vue.mixin` 传入一个混入对象，对象中 `methods` 字段中的方法会被混入到每个 Vue 组件中，从而实现全局方法的效果，在组件中通过 `this` 可以直接访问该方法。\n\n混入的方法会影响到所有组件，可能导致组件的逻辑变得不清晰，难以追踪方法的来源。而且如果多个混入对象有相同名称的方法，会根据混入的顺序决定最终使用哪个方法，增加了代码的不确定性。\n\n### 使用插件\n\n创建一个实现了 `install` 方法的插件对象。在 `install` 方法中定义全局方法，在使用时通过 `this` 访问该全局方法。\n\n使用插件的方式更加模块化和可维护，插件可以包含多个功能，并且可以按需引入和使用，不会像 `Vue.mixin` 那样影响所有组件，也相对 `Vue.prototype` 方式更易于管理和组织代码。\n\n### 使用 app.config.globalProperties\n\n这是 Vue 3 的标准实现方式，替代了 Vue 2 中的 `Vue.prototype`。通过 `app.config.globalProperties` 设置，通过 `this` 访问。\n\n### 使用 provide / inject\n\n用于在父组件和后代组件之间进行共享。\n\n## 完整的 Vue Router 导航解析流程\n\n1. 导航被触发。\n2. 在失活的组件里调用 `beforeRouteLeave` 守卫。\n3. 调用全局的 `beforeEach` 守卫。\n4. 在重用的组件里调用 `beforeRouteUpdate` 守卫（2.2+）。\n5. 在路由配置里调用 `beforeEnter`。\n6. 解析异步路由组件。\n7. 在被激活的组件里调用 `beforeRouteEnter`。\n8. 调用全局的 `beforeResolve` 守卫（2.5+）。\n9. 导航被确认。\n10. 调用全局的 `afterEach` 钩子。\n11. 触发 DOM 更新。\n12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。\n\n## 在导航解析流程中，beforeRouteEnter 守卫为什么不能直接访问 this？\n\n因为 `beforeRouteEnter` 守卫是在导航确认前调用，此时组件实例还未创建。\n\n可以通过 `next` 回调函数传递一个回调，当组件被创建后，这个回调会被调用，并且回调函数的参数 `vm` 就是组件实例，从而可以在回调中访问组件实例的属性和方法。\n\n## beforeEach 和 beforeEnter 守卫有什么区别？\n\n`beforeEach` 是全局前置守卫，会在每次导航时都被调用，对所有路由生效。用于一些全局的导航控制逻辑，如全局的身份验证、权限检查等，确保所有路由导航都符合一定规则。\n\n而 `beforeEnter` 是路由独享守卫，只对特定的路由配置生效。适合对单个路由进行特定的导航控制，例如某个管理页面路由，只有管理员权限才能访问，就可以在该路由的 `beforeEnter` 中进行权限判断。\n\n## beforeResolve 守卫的作用\n\n`beforeResolve` 是 Vue Router 提供的全局解析守卫，它是导航确认前的最后一个全局守卫——会在所有组件内守卫（如 `beforeRouteEnter`）、异步路由组件解析完成后触发，且在导航正式被确认（跳转）之前执行。\n\n## Vite 原理\n\n### 开发时\n\n- **基于 ES 模块：** Vite 利用浏览器对 ES 模块的支持，直接提供项目的源文件给浏览器。浏览器在请求这些模块时，Vite 的开发服务器会根据请求动态编译和处理模块，比如将 `.jsx`、`.ts` 等文件转换为浏览器可识别的 JavaScript。\n- **快速冷启动：** 由于无需在启动时进行全量打包，Vite 启动速度极快，大大节省了开发等待时间。\n- **热模块替换（HMR）：** Vite 通过 WebSocket 与浏览器建立连接，当文件发生变化时，Vite 能精确识别变化的模块，并只将变化的模块推送给浏览器，浏览器在不刷新页面的情况下更新相关模块，实现即时反馈。\n\n### 构建时\n\n- **Rollup 集成：** Vite 在构建阶段使用 Rollup 进行打包，Rollup 以其高效的 Tree-shaking 能力著称，能够去除未使用的代码，优化输出的 bundle 体积。\n- **代码优化：** Vite 会对代码进行各种优化，如压缩代码、处理 CSS、生成静态资源等，以确保生成的代码适合生产环境部署。\n\n## Vite 与 Webpack 相比，优势在哪里？\n\nVite 在开发阶段优势明显，其利用浏览器原生 ES 模块导入，无需提前打包，冷启动速度快，HMR 即时响应。\n\n而 Webpack 在项目启动时需全量打包，随着项目增大启动和 HMR 速度会变慢。\n\n构建阶段 Vite 集成 Rollup，借助 Rollup 强大的 Tree-shaking 能力优化代码，同样能有效减少 bundle 体积。\n\n## Vite 的热模块替换（HMR）是如何实现的？\n\nVite 通过 WebSocket 与浏览器建立连接。当文件发生变化时，Vite 能识别变化的模块，将变化的模块通过 WebSocket 推送给浏览器，浏览器在不刷新页面的情况下，根据这些变化更新相关模块，实现热模块替换。\n\n## Vite 的依赖预构建是做什么的？\n\nVite 在启动时会对一些第三方依赖进行预构建。因为有些依赖并非以 ES 模块形式提供，预构建可以将这些依赖转换为 ES 模块，并且将多个小模块合并为一个大模块，减少浏览器请求数量，提高加载性能。\n",
    "headings": [
      {
        "depth": 1,
        "text": "Vue",
        "slug": "vue"
      },
      {
        "depth": 2,
        "text": "reactive 和 ref 的区别和相同点",
        "slug": "reactive-和-ref-的区别和相同点"
      },
      {
        "depth": 2,
        "text": "为什么 ref 需要 .value 属性？",
        "slug": "为什么-ref-需要-value-属性"
      },
      {
        "depth": 2,
        "text": "v-if 和 v-show 的区别",
        "slug": "v-if-和-v-show-的区别"
      },
      {
        "depth": 2,
        "text": "Vue3 对比 Vue2 的改进",
        "slug": "vue3-对比-vue2-的改进"
      },
      {
        "depth": 3,
        "text": "1. 优化了响应式系统（Vue3 用 Proxy 代替 Object.defineProperty 的原因）",
        "slug": "1-优化了响应式系统vue3-用-proxy-代替-objectdefineproperty-的原因"
      },
      {
        "depth": 3,
        "text": "2. 优化了虚拟 DOM 的 diff 算法（Vue3 的 patch 算法做了哪些更新）",
        "slug": "2-优化了虚拟-dom-的-diff-算法vue3-的-patch-算法做了哪些更新"
      },
      {
        "depth": 3,
        "text": "3. Composition API 组合式 API（Composition API 与 Options API 相比，有哪些优势）",
        "slug": "3-composition-api-组合式-apicomposition-api-与-options-api-相比有哪些优势"
      },
      {
        "depth": 3,
        "text": "4. TypeScript 支持",
        "slug": "4-typescript-支持"
      },
      {
        "depth": 3,
        "text": "5. Fragment 特性（什么是 Fragment？Fragment 在实际项目中有哪些应用场景）",
        "slug": "5-fragment-特性什么是-fragmentfragment-在实际项目中有哪些应用场景"
      },
      {
        "depth": 3,
        "text": "6. Teleport 特性（什么是 Teleport？Teleport 在实际项目中有哪些应用场景）",
        "slug": "6-teleport-特性什么是-teleportteleport-在实际项目中有哪些应用场景"
      },
      {
        "depth": 3,
        "text": "7. 打包优化",
        "slug": "7-打包优化"
      },
      {
        "depth": 2,
        "text": "Vue3 的响应式系统原理",
        "slug": "vue3-的响应式系统原理"
      },
      {
        "depth": 2,
        "text": "什么是虚拟 DOM（Virtual DOM）？它解决了哪些问题？",
        "slug": "什么是虚拟-domvirtual-dom它解决了哪些问题"
      },
      {
        "depth": 2,
        "text": "Vue 的虚拟 DOM Diff 过程 / 双端比较算法",
        "slug": "vue-的虚拟-dom-diff-过程-双端比较算法"
      },
      {
        "depth": 2,
        "text": "computed 和 watch / watchEffect 的区别？",
        "slug": "computed-和-watch-watcheffect-的区别"
      },
      {
        "depth": 2,
        "text": "computed 的缓存机制是如何实现的，有什么好处？",
        "slug": "computed-的缓存机制是如何实现的有什么好处"
      },
      {
        "depth": 2,
        "text": "为什么 computed 可以依赖另一个 computed？",
        "slug": "为什么-computed-可以依赖另一个-computed"
      },
      {
        "depth": 2,
        "text": "多个 computed 相互依赖可能会带来什么问题？",
        "slug": "多个-computed-相互依赖可能会带来什么问题"
      },
      {
        "depth": 2,
        "text": "在 Vue 的响应式系统中，computed 依赖的更新是同步还是异步的？",
        "slug": "在-vue-的响应式系统中computed-依赖的更新是同步还是异步的"
      },
      {
        "depth": 2,
        "text": "Vue 的生命周期",
        "slug": "vue-的生命周期"
      },
      {
        "depth": 3,
        "text": "Vue3 的生命周期钩子有哪些主要变化？",
        "slug": "vue3-的生命周期钩子有哪些主要变化"
      },
      {
        "depth": 3,
        "text": "setup() 函数的作用是什么？",
        "slug": "setup-函数的作用是什么"
      },
      {
        "depth": 3,
        "text": "setup() 函数在组件的生命周期中处于什么位置？",
        "slug": "setup-函数在组件的生命周期中处于什么位置"
      },
      {
        "depth": 2,
        "text": "provide 和 inject 的作用是什么？",
        "slug": "provide-和-inject-的作用是什么"
      },
      {
        "depth": 2,
        "text": "Vue3 中组件通信的方式有哪些？",
        "slug": "vue3-中组件通信的方式有哪些"
      },
      {
        "depth": 2,
        "text": "什么是作用域插槽（Scoped Slots）？",
        "slug": "什么是作用域插槽scoped-slots"
      },
      {
        "depth": 2,
        "text": "作用域插槽和具名插槽有什么区别？",
        "slug": "作用域插槽和具名插槽有什么区别"
      },
      {
        "depth": 2,
        "text": "Vue3 中 v-model 的语法糖是如何实现的？与 Vue2 有何差异？",
        "slug": "vue3-中-v-model-的语法糖是如何实现的与-vue2-有何差异"
      },
      {
        "depth": 2,
        "text": "Vue3 中如何使用异步组件？",
        "slug": "vue3-中如何使用异步组件"
      },
      {
        "depth": 2,
        "text": "keep-alive 组件的作用与相关生命周期？",
        "slug": "keep-alive-组件的作用与相关生命周期"
      },
      {
        "depth": 2,
        "text": "Keep-Alive、Transition 的书写顺序",
        "slug": "keep-alivetransition-的书写顺序"
      },
      {
        "depth": 2,
        "text": "Vue 中如何定义全局方法",
        "slug": "vue-中如何定义全局方法"
      },
      {
        "depth": 3,
        "text": "在 Vue.prototype 上定义",
        "slug": "在-vueprototype-上定义"
      },
      {
        "depth": 3,
        "text": "使用 Vue.mixin",
        "slug": "使用-vuemixin"
      },
      {
        "depth": 3,
        "text": "使用插件",
        "slug": "使用插件"
      },
      {
        "depth": 3,
        "text": "使用 app.config.globalProperties",
        "slug": "使用-appconfigglobalproperties"
      },
      {
        "depth": 3,
        "text": "使用 provide / inject",
        "slug": "使用-provide-inject"
      },
      {
        "depth": 2,
        "text": "完整的 Vue Router 导航解析流程",
        "slug": "完整的-vue-router-导航解析流程"
      },
      {
        "depth": 2,
        "text": "在导航解析流程中，beforeRouteEnter 守卫为什么不能直接访问 this？",
        "slug": "在导航解析流程中beforerouteenter-守卫为什么不能直接访问-this"
      },
      {
        "depth": 2,
        "text": "beforeEach 和 beforeEnter 守卫有什么区别？",
        "slug": "beforeeach-和-beforeenter-守卫有什么区别"
      },
      {
        "depth": 2,
        "text": "beforeResolve 守卫的作用",
        "slug": "beforeresolve-守卫的作用"
      },
      {
        "depth": 2,
        "text": "Vite 原理",
        "slug": "vite-原理"
      },
      {
        "depth": 3,
        "text": "开发时",
        "slug": "开发时"
      },
      {
        "depth": 3,
        "text": "构建时",
        "slug": "构建时"
      },
      {
        "depth": 2,
        "text": "Vite 与 Webpack 相比，优势在哪里？",
        "slug": "vite-与-webpack-相比优势在哪里"
      },
      {
        "depth": 2,
        "text": "Vite 的热模块替换（HMR）是如何实现的？",
        "slug": "vite-的热模块替换hmr是如何实现的"
      },
      {
        "depth": 2,
        "text": "Vite 的依赖预构建是做什么的？",
        "slug": "vite-的依赖预构建是做什么的"
      }
    ],
    "searchText": "vue 前端框架 vue reactive 和 ref 的区别和相同点 1. reactive 只能处理对象数据类型，ref 既可以处理对象类型，也可以处理基本类型。所以当处理基本类型的时候，需要使用 ref。而在不涉及解构赋值或整体替换的操作时，reactive 可以提供更方便的写法。 2. ref 底层调用了 reactive，底层都是基于 proxy 的拦截。不同的是 ref 对基本类型进行了封装处理，所以在 script 中访问需要使用 .value 属性，而 reactive 不需要。而在模板中，二者都不需要额外的解包操作。 3. 在 script 中，对 reactive 对象的解构赋值，会导致失去响应性，需要使用 toref 或者 torefs。而 ref 则不需要考虑这点。而在 html 模板中，如果使用了展开运算符，那么二者都不会再具有响应性，同样可以使用 torefs 解决。 为什么 ref 需要 .value 属性？ vue 3 的响应式系统基于 proxy 实现，而 proxy 只能劫持对象的属性访问（如 obj.key），无法直接劫持基本类型值。 所以 vue 将基本元素打包成了 refimpl 对象，然后调用 reactive 实现了响应式。而 refimpl 中定义了 value 属性用于返回值。 v if 和 v show 的区别 v if 类似 display: none，当 v if 是 false 时，该组件不会存在于虚拟 dom 和 virtual dom 中，不会占据内存。因此频繁切换显示隐藏状态时性能不好。好处是首次如果不需要加载，会获得更良好的性能。 v show 类似 visibility: hidden，当 v show 是 false 时，该组件不会被移出 dom 结构，而是不参与渲染。因此频繁切换状态时性能良好。但是如果首次不需要显示，由于组件仍然占据内存，所以会影响首次加载性能。 vue3 对比 vue2 的改进 1. 优化了响应式系统（vue3 用 proxy 代替 object.defineproperty 的原因） vue2 的实现： vue2 使用 object.defineproperty 接口，通过拦截 getter 和 setter 来进行依赖追踪和响应式更新，同时也在 array 的原型链上重写了方法来劫持对数组的修改。 vue2 设计的局限： 无法监听到直接修改对象属性的操作。 无法监听到对数组下标的直接操作。 在面对层级深的对象结构时，递归调用 object.defineproperty 也很耗费性能。 不准确的依赖追踪可能导致内存泄漏和渲染性能的下降。 vue3 的改进： 通过 es6 proxy 机制代理整个对象，同时在内部使用 reflect 来实现操作。 可以监听到对象属性的修改和对数组下标的操作。 对于层级深的对象，vue3 不会在一开始就深度遍历收集依赖，而是在实际访问的时候才收集，优化了初始化的性能。 2. 优化了虚拟 dom 的 diff 算法（vue3 的 patch 算法做了哪些更新） 静态节点标记： vue3 会对模板中的静态节点，例如文本节点、没有进行插值绑定或属性绑定的节点等进行标记，从而跳过每次组件更新的 diff 对比，直接复用。 patchflag： 通过标记节点可能的变化属性，例如 text 表示文本，class 表示类名等，在 diff 过程中只对比可能发生变化的部分，避免节点之间全量比较。 动态节点提升： 对于动态组件的静态框架部分，vue3 会将其提升到渲染函数外部，仅在初始化时调用，每次仅更新动态数据影响的部分。 双端比较算法优化： vue2 采用了双端对比法进行 diff，vue3 在此基础上，新增了根据 key 找到对应节点尝试排序的算法，减少节点的移动操作，保证最大程度的节点复用。 最长递增子序列算法优化： 在子节点对比中，使用最长递增子序列算法进行优化，同样可以减少移动 dom 节点的次数。 3. composition api 组合式 api（composition api 与 options api 相比，有哪些优势） vue2 的做法： 通过 options api 选项式 api 构建 vue 组件，这个方式的好处是直观易懂，分类明确。 options api 的局限： 当组件逻辑变得复杂时，涉及统一逻辑点的不同片段会被分散在不同选项上，使得组件内部不够内聚，关注点十分分散。 当一段逻辑需要被多个组件复用时，除了重复书写，就是使用公共组件复用或 mixin 特性实现，开发复杂，容易造成命名冲突，且数据来源也不清晰。 composition api 的优势： 逻辑点统一，归属于同一个逻辑点的代码自然会被书写在一起，且易于进行封装复用，在其他组件使用时仅需引用这个函数即可，来源清晰。 4. typescript 支持 更完善的类型定义和类型推断。 5. fragment 特性（什么是 fragment？fragment 在实际项目中有哪些应用场景） vue2 中，仅支持单根节点，在没有单根节点的场景下，需要使用额外的 <template 标签进行包裹，这使得 dom 结构中存在许多无意义的节点需要处理，代码结构变得复杂。 vue3 支持了 fragment，允许组件返回多个根节点，无需额外添加 <template ，减少了无意义的节点。 6. teleport 特性（什么是 teleport？teleport 在实际项目中有哪些应用场景） 这个特性允许将组件移动到指定的节点下方。 例如对于弹窗，可以很方便地从深层的子组件挂载到 body 下方，避免出现样式和布局问题。 例如一些三方库提供的组件，可能有指定挂载节点的要求，teleport 可以使组件的使用更灵活。 7. 打包优化 vue3 全面支持 es module，并在构建过程中进行了更深入的静态分析，实现了更精准的 tree shaking。 通过组件层面的按需引入和指令的按需编译，减少无用代码的打包。 proxy 的实现和渲染函数的优化，使得代码更轻量，自然减少打包体积。 vue3 的响应式系统原理 vue3 的响应式系统基于 es6 的 proxy 和 reflect 实现。通过 proxy 对目标对象进行代理，拦截对象的各种操作，通过 reflect 转发操作并收集依赖，从而实现对数据变化的追踪和响应，当依赖的数据发生变化时，自动触发相关副作用函数重新执行，更新视图。 什么是虚拟 dom（virtual dom）？它解决了哪些问题？ 虚拟 dom（virtual dom）是一种在 javascript 中对真实 dom 的抽象表示。它以 javascript 对象的形式存在，描述了真实 dom 的结构、属性和节点关系。 通过在内存中操作虚拟 dom，并与上一次的虚拟 dom 进行对比，计算出最小的变化集，然后将这些变化应用到真实 dom 上，从而高效地更新页面，解决了频繁直接操作真实 dom 带来的性能问题，同时也提升了开发的可维护性和灵活性。 vue 的虚拟 dom diff 过程 / 双端比较算法 vue 的 diff 过程会按层级匹配新旧 dom 结构的节点，只对比同层级，照顾性能。在遍历对比子节点时，vue 不同于 react，会采用双端对比算法进行 diff。 1. 首先，vue 会设置四个指针，分别指向新旧虚拟 dom 结构的头尾。 2. 然后，分别比较如下四项，如果 key 和标签名相同，则传入 patch 函数进行更新操作，并将对应指针向中间移动。 新头和旧头 新尾和旧尾 新尾和旧头 新头和旧尾 3. 如果以上都不匹配，会在旧子节点列表中，找到 key 不变的节点，进行复用。这里采用了最长递增子序列的算法保证最大程度的就地复用。对于位置变了的节点，进行移动。 4. 如果出现了新的子节点，则新建并插入到对应位置。 5. 当旧子节点列表的双端指针相遇后，遍历过程完成。 computed 和 watch / watcheffect 的区别？ computed 是计算属性，目的是将一段复杂的变量计算映射为一个独立的变量。依赖于其他响应式数据的值，通过计算返回一个新值。这个值会被缓存，仅当依赖变化时才重新计算。 watch 是响应式数据监听，用于监听响应式数据的变化，并在变化时执行回调方法。这个过程不涉及缓存。 watch 有三个配置： deep: true：触发深度监听 immediate: true：在创建组件时立即调用一次回调 flush： post：组件更新后执行回调 sync：同步执行回调 pre：组件更新前执行回调 watcheffect 会立即执行传入的回调，并自动追踪内部用到的响应式数据。当依赖数据变化时，执行回调处理。 computed 的缓存机制是如何实现的，有什么好处？ vue 内部为 computed 属性创建了一个 watcher 实例，内部设置了标志位，表示该 computed 值是否被计算过。当首次访问时，标志位是 true。后续仅当依赖变化时，将标志位设为 false，触发重新计算。 好处是减少不必要的计算，优化性能。 为什么 computed 可以依赖另一个 computed？ 因为 computed 同样具有响应性，有自身的依赖追踪逻辑。 多个 computed 相互依赖可能会带来什么问题？ 可能会引发不必要的重复计算，复杂的依赖关系也更难维护。 必要时，应简化依赖关系，将关联的数据放在同一个 computed 中进行一次计算，或采用 watch 并手动实现缓存机制。 在 vue 的响应式系统中，computed 依赖的更新是同步还是异步的？ computed 依赖的更新是同步的。同步更新机制使 computed 属性能够实时反映依赖数据的变化，为视图渲染提供准确的数据。 vue 的生命周期 vue3 的生命周期钩子有哪些主要变化？ 统一增加了 on 前缀，例如 onmounted，命名风格更统一、直观。 新增 onrendertracked 钩子，此钩子在组件渲染过程中，追踪到响应式依赖时被调用。 新增 onrendertriggered 钩子，当组件因响应式依赖变化而触发重新渲染时，会调用这个钩子。 setup() 函数的作用是什么？ setup() 钩子是在组件中使用组合式 api 的入口，通常只在以下情况下使用： 1. 需要在非单文件组件中使用组合式 api 时。 2. 需要在基于选项式 api 的组件中集成基于组合式 api 的代码时。 在组合式 api 的单文件组件中，可以使用 <script setup 语法糖。 setup() 函数在组件的生命周期中处于什么位置？ setup() 函数在 beforecreate 钩子之前执行，并且它的执行结果会影响 created 钩子。 provide 和 inject 的作用是什么？ provide 和 inject 是 vue 中用于实现祖先组件向后代组件传递数据的一对选项。 在大型组件树结构中，当一个祖先组件需要向其深层嵌套的后代组件传递数据，而又不想通过中间层层组件传递（避免中间组件无意义地接收和传递数据，造成代码冗余）时，就可以使用 provide 和 inject。 vue3 中组件通信的方式有哪些？ 父组件传递 props 赋值，子组件通过 emits 抛出自定义事件更新。 父组件 provide，后代组件 inject。 什么是作用域插槽（scoped slots）？ 作用域插槽（scoped slots）是 vue 中一种特殊类型的插槽，它允许子组件将自身的数据传递给父组件，同时父组件可以在插槽内容中使用这些子组件传递的数据进行自定义渲染。 使用场景： 列表渲染的定制化： 例如，一个通用的列表组件，子组件提供列表数据，父组件可以通过作用域插槽根据数据中的不同字段，如用户角色，来决定每个列表项的样式或显示内容。 可复用组件的扩展： 比如表格组件，子组件提供表格数据和基本的表格结构，父组件可以通过作用域插槽定制每一列的渲染方式，如将数字字段渲染为进度条等。 作用域插槽和具名插槽有什么区别？ 作用域插槽在父组件上通过 v slot=\"xxx\"，在指令的值上绑定，用于传递数据。 具名插槽在父组件上通过 v slot:xxx，在指令的名上绑定，对应子组件 slot 组件的 name 属性，用于控制渲染的位置。 vue3 中 v model 的语法糖是如何实现的？与 vue2 有何差异？ v model 是一种语法糖。 在 vue2 中，自定义组件使用 v model 时，是通过 value prop 和 input 事件来实现双向绑定。 在 vue3 中它会被展开为一个 value prop 和一个 update:value 事件。vue3 允许在一个组件上使用多个 v model。还可以通过 definemodel 来处理自定义修饰符。 vue3 中如何使用异步组件？ 使用 defineasynccomponent(() = import('./xxx.vue'))。 defineasynccomponent 支持配置对象： 可以配合 suspense 组件进行统一的加载状态和错误显示管理。suspense 组件提供了如下能力： default 插槽：用于渲染异步组件 fallback 插槽：用于渲染备用组件 timeout props：用于配置超时时间 pending 事件：进入渲染状态触发钩子 resolve 事件：渲染成功 fallback 事件：渲染失败 keep alive 组件的作用与相关生命周期？ keep alive 主要用于缓存组件实例，避免重复渲染。当组件被 keep alive 包裹时，在组件切换过程中，被切换掉的组件不会被销毁，而是被缓存起来。当下次再次切换到该组件时，直接从缓存中复用，而不是重新创建组件实例。 相关生命周期： activated：当被 keep alive 缓存的组件激活（即从缓存中被重新使用，再次出现在视图中）时，会触发 activated 生命周期钩子。 deactivated：当被 keep alive 缓存的组件失活（即从视图中被切换出去，进入缓存状态）时，会触发 deactivated 生命周期钩子。 keep alive、transition 的书写顺序 外层 transition，内层 keep alive。 vue 中如何定义全局方法 在 vue.prototype 上定义 在 vue 应用入口文件（通常是 main.js）中，通过 vue.prototype 来添加全局方法，通过 this 访问。 这种方式虽然简单直接，但会污染 vue.prototype，可能会与未来 vue 自身的属性或方法产生命名冲突。同时，在 typescript 项目中，可能需要额外的类型声明来正确识别这些全局方法。 使用 vue.mixin 通过 vue.mixin 传入一个混入对象，对象中 methods 字段中的方法会被混入到每个 vue 组件中，从而实现全局方法的效果，在组件中通过 this 可以直接访问该方法。 混入的方法会影响到所有组件，可能导致组件的逻辑变得不清晰，难以追踪方法的来源。而且如果多个混入对象有相同名称的方法，会根据混入的顺序决定最终使用哪个方法，增加了代码的不确定性。 使用插件 创建一个实现了 install 方法的插件对象。在 install 方法中定义全局方法，在使用时通过 this 访问该全局方法。 使用插件的方式更加模块化和可维护，插件可以包含多个功能，并且可以按需引入和使用，不会像 vue.mixin 那样影响所有组件，也相对 vue.prototype 方式更易于管理和组织代码。 使用 app.config.globalproperties 这是 vue 3 的标准实现方式，替代了 vue 2 中的 vue.prototype。通过 app.config.globalproperties 设置，通过 this 访问。 使用 provide / inject 用于在父组件和后代组件之间进行共享。 完整的 vue router 导航解析流程 1. 导航被触发。 2. 在失活的组件里调用 beforerouteleave 守卫。 3. 调用全局的 beforeeach 守卫。 4. 在重用的组件里调用 beforerouteupdate 守卫（2.2+）。 5. 在路由配置里调用 beforeenter。 6. 解析异步路由组件。 7. 在被激活的组件里调用 beforerouteenter。 8. 调用全局的 beforeresolve 守卫（2.5+）。 9. 导航被确认。 10. 调用全局的 aftereach 钩子。 11. 触发 dom 更新。 12. 调用 beforerouteenter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。 在导航解析流程中，beforerouteenter 守卫为什么不能直接访问 this？ 因为 beforerouteenter 守卫是在导航确认前调用，此时组件实例还未创建。 可以通过 next 回调函数传递一个回调，当组件被创建后，这个回调会被调用，并且回调函数的参数 vm 就是组件实例，从而可以在回调中访问组件实例的属性和方法。 beforeeach 和 beforeenter 守卫有什么区别？ beforeeach 是全局前置守卫，会在每次导航时都被调用，对所有路由生效。用于一些全局的导航控制逻辑，如全局的身份验证、权限检查等，确保所有路由导航都符合一定规则。 而 beforeenter 是路由独享守卫，只对特定的路由配置生效。适合对单个路由进行特定的导航控制，例如某个管理页面路由，只有管理员权限才能访问，就可以在该路由的 beforeenter 中进行权限判断。 beforeresolve 守卫的作用 beforeresolve 是 vue router 提供的全局解析守卫，它是导航确认前的最后一个全局守卫——会在所有组件内守卫（如 beforerouteenter）、异步路由组件解析完成后触发，且在导航正式被确认（跳转）之前执行。 vite 原理 开发时 基于 es 模块： vite 利用浏览器对 es 模块的支持，直接提供项目的源文件给浏览器。浏览器在请求这些模块时，vite 的开发服务器会根据请求动态编译和处理模块，比如将 .jsx、.ts 等文件转换为浏览器可识别的 javascript。 快速冷启动： 由于无需在启动时进行全量打包，vite 启动速度极快，大大节省了开发等待时间。 热模块替换（hmr）： vite 通过 websocket 与浏览器建立连接，当文件发生变化时，vite 能精确识别变化的模块，并只将变化的模块推送给浏览器，浏览器在不刷新页面的情况下更新相关模块，实现即时反馈。 构建时 rollup 集成： vite 在构建阶段使用 rollup 进行打包，rollup 以其高效的 tree shaking 能力著称，能够去除未使用的代码，优化输出的 bundle 体积。 代码优化： vite 会对代码进行各种优化，如压缩代码、处理 css、生成静态资源等，以确保生成的代码适合生产环境部署。 vite 与 webpack 相比，优势在哪里？ vite 在开发阶段优势明显，其利用浏览器原生 es 模块导入，无需提前打包，冷启动速度快，hmr 即时响应。 而 webpack 在项目启动时需全量打包，随着项目增大启动和 hmr 速度会变慢。 构建阶段 vite 集成 rollup，借助 rollup 强大的 tree shaking 能力优化代码，同样能有效减少 bundle 体积。 vite 的热模块替换（hmr）是如何实现的？ vite 通过 websocket 与浏览器建立连接。当文件发生变化时，vite 能识别变化的模块，将变化的模块通过 websocket 推送给浏览器，浏览器在不刷新页面的情况下，根据这些变化更新相关模块，实现热模块替换。 vite 的依赖预构建是做什么的？ vite 在启动时会对一些第三方依赖进行预构建。因为有些依赖并非以 es 模块形式提供，预构建可以将这些依赖转换为 es 模块，并且将多个小模块合并为一个大模块，减少浏览器请求数量，提高加载性能。"
  },
  {
    "slug": "014-小程序",
    "title": "小程序",
    "category": "前端框架",
    "sourcePath": "docs/前端框架/小程序.md",
    "markdown": "# 小程序\n\n## 小程序为什么会有两个线程\n\n小程序采用**双线程架构**，将逻辑层和渲染层分离到两个独立的线程中运行：\n\n- **渲染层（View Thread）**：运行在 WebView 中，负责页面的渲染和展示（WXML + WXSS）。每个页面对应一个独立的 WebView 实例。\n- **逻辑层（Logic Thread）**：运行在 JSCore（JavaScriptCore）中，负责执行开发者编写的 JavaScript 业务逻辑。所有页面共享同一个 JSCore 线程。\n\n两个线程之间不能直接通信，必须通过微信客户端（Native）层进行桥接转发：逻辑层调用 `setData()` 将数据传递给 Native，Native 再将数据分发到对应的 WebView 进行渲染。\n\n### 为什么要这样设计\n\n1. **安全沙箱**：逻辑层运行在 JSCore 而非 WebView 中，开发者的 JavaScript 代码无法直接操作 DOM 和 BOM（如 `document`、`window` 等对象不存在）。这防止了开发者通过 JS 获取页面敏感信息、跳转到恶意页面或篡改渲染内容，保障了平台的安全性和可控性。\n2. **性能优化**：逻辑层和渲染层并行运行，JS 逻辑的执行不会阻塞页面渲染，渲染也不会阻塞 JS 执行，避免了传统 Web 页面中 JS 长时间运行导致页面卡顿的问题。\n3. **平台管控**：微信可以通过 Native 层对 JS 的 API 调用进行拦截和管控，确保小程序只能使用微信提供的能力，防止滥用。\n\n### 注意事项\n\n由于逻辑层和渲染层的通信需要经过 Native 桥接并进行数据序列化，`setData()` 传输大量数据时会有性能开销。因此应避免频繁调用 `setData()` 和传递过大的数据对象。\n",
    "headings": [
      {
        "depth": 1,
        "text": "小程序",
        "slug": "小程序"
      },
      {
        "depth": 2,
        "text": "小程序为什么会有两个线程",
        "slug": "小程序为什么会有两个线程"
      },
      {
        "depth": 3,
        "text": "为什么要这样设计",
        "slug": "为什么要这样设计"
      },
      {
        "depth": 3,
        "text": "注意事项",
        "slug": "注意事项"
      }
    ],
    "searchText": "小程序 前端框架 小程序 小程序为什么会有两个线程 小程序采用 双线程架构 ，将逻辑层和渲染层分离到两个独立的线程中运行： 渲染层（view thread） ：运行在 webview 中，负责页面的渲染和展示（wxml + wxss）。每个页面对应一个独立的 webview 实例。 逻辑层（logic thread） ：运行在 jscore（javascriptcore）中，负责执行开发者编写的 javascript 业务逻辑。所有页面共享同一个 jscore 线程。 两个线程之间不能直接通信，必须通过微信客户端（native）层进行桥接转发：逻辑层调用 setdata() 将数据传递给 native，native 再将数据分发到对应的 webview 进行渲染。 为什么要这样设计 1. 安全沙箱 ：逻辑层运行在 jscore 而非 webview 中，开发者的 javascript 代码无法直接操作 dom 和 bom（如 document、window 等对象不存在）。这防止了开发者通过 js 获取页面敏感信息、跳转到恶意页面或篡改渲染内容，保障了平台的安全性和可控性。 2. 性能优化 ：逻辑层和渲染层并行运行，js 逻辑的执行不会阻塞页面渲染，渲染也不会阻塞 js 执行，避免了传统 web 页面中 js 长时间运行导致页面卡顿的问题。 3. 平台管控 ：微信可以通过 native 层对 js 的 api 调用进行拦截和管控，确保小程序只能使用微信提供的能力，防止滥用。 注意事项 由于逻辑层和渲染层的通信需要经过 native 桥接并进行数据序列化，setdata() 传输大量数据时会有性能开销。因此应避免频繁调用 setdata() 和传递过大的数据对象。"
  },
  {
    "slug": "015-实践场景",
    "title": "场景题",
    "category": "实践",
    "sourcePath": "docs/实践/实践场景.md",
    "markdown": "# 场景题\n\n## 前端如何实现截图\n\n主流方案有两种：`html2canvas` 和 `dom-to-image`。\n\n- **html2canvas**：遍历目标 DOM 节点，将其样式和内容绘制到 `<canvas>` 上，再通过 `canvas.toDataURL()` 导出为图片。不依赖服务端，但对 CSS 支持不完整（如 `box-shadow`、`filter` 等部分属性渲染存在差异），且受同源策略限制，跨域图片需配置 `useCORS: true` 或使用代理。\n- **dom-to-image**：将 DOM 序列化为 SVG（`foreignObject`），再渲染到 `<canvas>` 导出。对 CSS 还原度更高，支持导出 `svg`、`png`、`jpeg` 等格式，但在部分浏览器兼容性上不如 `html2canvas`。\n\n## 前端如何实现上传文件进度条\n\n核心是利用 `XMLHttpRequest` 的 `upload.onprogress` 事件或 `axios` 的 `onUploadProgress` 回调，获取已发送字节数与总字节数的比值。\n\n- `e.loaded` 为已上传字节数，`e.total` 为文件总大小\n- `fetch` API 原生不支持上传进度监听，需要用 `XMLHttpRequest` 或第三方库\n\n## 前端页面添加水印，禁止移除水印\n\n使用 Canvas 生成水印图片作为背景，配合 `MutationObserver` 防篡改。\n\n- **生成水印**：创建 `<canvas>` 绘制文字，通过 `canvas.toDataURL()` 转为 `base64` 图片，设为水印容器的 `background-image` 并平铺。\n- **防篡改**：使用 `MutationObserver` 监听水印 DOM 的 `attributes`、`childList`、`subtree` 变化，一旦检测到删除或修改，立即重新生成水印节点。\n- 还可监听 `div` 的属性变化，防止通过 DevTools 修改 `style` 隐藏水印\n- 设置 `pointer-events: none` 保证水印不影响页面交互\n\n## 合并请求，返回一个结果\n\n常见场景：短时间内触发多次相同请求，合并为一次发送或等待所有并发请求完成后统一返回结果。\n\n- **`Promise.all`**：适用于多个独立请求需要全部完成后再处理结果的场景，任意一个失败则整体失败。\n- **`Promise.allSettled`**：不论成功失败均返回每个请求的结果状态。\n- **请求队列 / 请求合并**：对短时间内重复触发的同一接口，用 Map 缓存进行中的 Promise，相同 key 直接复用，避免重复发送。\n\n## 前端实现即时通讯\n\n三种主流方案，按实时性递增排列：\n\n- **短轮询（Polling）**：客户端定时发送 HTTP 请求查询新消息。实现简单但延迟高、浪费带宽，适合对实时性要求不高的场景。\n- **SSE（Server-Sent Events）**：基于 HTTP 的单向推送协议，服务端可主动推送消息到客户端。使用 `EventSource` API，自动重连，适合通知、实时数据流等服务端到客户端的单向通信。\n- **WebSocket**：基于 TCP 的全双工通信协议，延迟低、支持双向通信。适合聊天室、协同编辑等高实时性场景。\n\n## 前端项目工程自动化部署（CICD）\n\nCI/CD 即持续集成 / 持续部署，核心流程：代码提交 → 自动构建 → 自动测试 → 自动部署。\n\n- **GitHub Actions**：在 `.github/workflows/` 下编写 YAML 配置，监听 `push`/`pull_request` 事件触发流水线，免费额度适合开源项目。\n- **GitLab CI**：通过项目根目录的 `.gitlab-ci.yml` 配置流水线，与 GitLab 深度集成。\n- **Jenkins**：自托管的 CI/CD 平台，通过 `Jenkinsfile` 定义 Pipeline，插件生态丰富，适合企业内部署。\n- 前端项目通常构建产物为静态文件，部署到 Nginx / CDN / OSS 即可\n- 可在流水线中集成 ESLint、单元测试、E2E 测试等质量门禁\n\n## token过期后，页面无感刷新\n\n使用双 Token 机制：短期的 `access_token` 用于接口鉴权，长期的 `refresh_token` 用于刷新。在 HTTP 拦截器中检测 401 响应，自动用 `refresh_token` 换取新 `access_token` 并重发失败请求，用户无感知。\n\n- 使用 `isRefreshing` 标志和等待队列，避免多个请求同时触发刷新\n- `refresh_token` 也过期时需跳转登录页\n\n## table header吸顶\n\n使表格表头在滚动时固定在可视区域顶部，常用两种方案：\n\n- **`position: sticky`**：最简方案，给 `<th>` 设置 `position: sticky; top: 0;`，需确保父容器没有 `overflow: hidden`。兼容性良好（IE 不支持）。\n- **`IntersectionObserver`**：监听表格是否离开视口，动态为表头添加固定定位样式，适合需要更精细控制的场景。\n- `sticky` 方案需注意 `border-collapse` 下边框可能不随元素固定，可用 `box-shadow` 替代下边框\n- 如果表格在滚动容器内，`top` 值应相对于最近的滚动祖先\n\n## 实现AI聊天打字机效果\n\n核心思路：通过 SSE（Server-Sent Events）流式接收模型输出，前端逐字 / 逐块渲染到页面。\n\n- 后端接口返回 `Content-Type: text/event-stream`，使用 `ReadableStream` 逐块读取\n- 可配合 `requestAnimationFrame` 或定时器控制渲染速度，模拟打字节奏\n- 支持 Markdown 渲染时，可在每次 chunk 到来后用 `marked` 等库重新解析已累积的文本\n\n## 实现一个简单的微前端架构\n\n微前端将大型前端应用拆分为多个独立子应用，各自开发、部署、运行。主流方案：\n\n- **`qiankun`**：基于 `single-spa`，提供 JS 沙箱（`Proxy`）和样式隔离，子应用需导出 `bootstrap`/`mount`/`unmount` 生命周期。\n- **Module Federation（Webpack 5）**：在构建层面共享模块，子应用通过远程入口暴露组件，主应用动态加载。适合技术栈统一的场景。\n- **iframe**：天然隔离，但有通信成本高、URL 不同步、性能开销等问题，适合对隔离性要求极高的场景。\n- 选型建议：团队技术栈统一优先 Module Federation，历史项目渐进式迁移优先 qiankun，强隔离需求用 iframe\n- 需关注子应用间通信（`CustomEvent` / 全局状态）、路由协调、样式隔离等问题\n\n## 判断用户设备\n\n通过 `navigator.userAgent` 解析或 CSS 媒体查询判断设备类型。\n\n- `navigator.userAgent` 可被伪造，不应作为安全判断依据，仅做 UI 适配参考\n- `navigator.userAgentData`（User-Agent Client Hints）是更现代的替代方案，提供结构化设备信息\n- 结合多维度判断（屏幕宽度 + 触控支持 + UA）更可靠\n\n## 电梯导航实现\n\n电梯导航即点击侧边栏锚点滚动到对应内容区域，滚动时高亮当前区域对应的导航项。\n\n- **点击滚动**：点击导航项调用 `element.scrollIntoView({ behavior: 'smooth' })` 或 `window.scrollTo()` 平滑滚动到目标位置。\n- **滚动高亮**：使用 `IntersectionObserver` 监听各个内容区块的可见性，当某区块进入视口时高亮对应导航项。\n\n## 上滑加载\n\n也称无限滚动（Infinite Scroll），当用户滚动到列表底部时自动加载更多数据。\n\n- **IntersectionObserver 方案（推荐）**：在列表底部放置一个哨兵元素（sentinel），用 `IntersectionObserver` 监听其是否进入视口，触发加载。\n- **scroll 事件方案**：监听滚动容器的 `scroll` 事件，判断 `scrollTop + clientHeight >= scrollHeight - threshold`，需配合节流。\n- 设置 `rootMargin` 可提前触发加载，提升体验\n- 注意维护 `isLoading` 状态防止重复请求，数据加载完毕后 `observer.unobserve(sentinel)`\n\n## 下拉刷新\n\n移动端常见交互，通过触摸事件实现：`touchstart` 记录起始位置 → `touchmove` 计算下拉距离并显示加载提示 → `touchend` 触发数据刷新。\n\n- 需在 `scrollTop === 0` 时才启用下拉逻辑，避免与正常滚动冲突\n- 通常设置最大下拉距离（如 80px）和触发刷新阈值（如 60px）\n- 成熟组件库如 Vant `PullRefresh`、Ant Design Mobile `PullToRefresh` 已封装好此逻辑\n\n## 判断元素在可视区域\n\n两种主流方案：\n\n- **`IntersectionObserver`（推荐）**：异步观察目标元素与视口的交叉状态，性能好，无需手动计算。\n- **`getBoundingClientRect()`**：返回元素相对于视口的位置信息，手动判断是否在可视区域内。\n- `IntersectionObserver` 支持配置 `threshold`（交叉比例阈值）和 `rootMargin`（提前/延迟触发）\n- `getBoundingClientRect` 在高频调用（如 `scroll` 事件）时需搭配节流避免性能问题\n\n## 表单校验场景，实现页面视口滚动到报错位置\n\n表单校验失败后，调用 `scrollIntoView()` 将第一个报错字段滚动到视口中，提升用户体验。\n\n- `block: 'center'` 将元素滚动到视口垂直居中，比 `start` 体验更好\n- 滚动后调用 `focus()` 聚焦输入框，方便用户直接修改\n- 多表单分步场景中，需先判断报错字段在哪个步骤并切换过去\n\n## 判断页签是否活跃\n\n使用 `document.visibilityState` 和 `visibilitychange` 事件判断当前标签页是否可见。\n\n- `document.visibilityState` 有两个值：`visible`（可见）和 `hidden`（隐藏）\n- 典型应用：页签不可见时暂停定时器、动画、视频播放、WebSocket 心跳，节省资源\n- `document.hidden` 是布尔属性，作用等同于 `visibilityState === 'hidden'`\n\n## 页面关闭时如何执行方法\n\n使用 `beforeunload` 事件和 `navigator.sendBeacon()` 在页面关闭 / 刷新前执行逻辑。\n\n- `navigator.sendBeacon()` 是专为页面卸载设计的 API，异步发送少量数据，不阻塞页面关闭，成功率高于普通 `fetch`/`XHR`\n- `beforeunload` 中的异步请求（如 `fetch`）可能被浏览器取消，因此数据上报优先用 `sendBeacon`\n- `unload` 事件在现代浏览器中不可靠，推荐使用 `beforeunload` 或 `pagehide`\n\n## 介绍下大文件上传\n\n大文件切片上传，如何确定切片数量，考虑哪些因素\n\n核心流程：`File.slice()` 将文件切片 → 并发上传各分片 → 服务端合并。支持断点续传。\n\n- **切片大小确定**：一般设为 2MB~10MB。需考虑：网络带宽（弱网用小切片）、服务端接收限制、并发数量、重传成本（切片越小重传代价越低）。\n- **断点续传**：上传前根据文件内容计算 hash（`SparkMD5` / `crypto.subtle`），向服务端查询已上传的分片列表，仅上传缺失的分片。\n- **并发控制**：限制同时上传的分片数（通常 3~6 个），避免带宽竞争。\n- 使用 Web Worker 计算文件 hash 避免阻塞主线程\n- 各分片上传失败可独立重试，不影响其他分片\n\n## 统计用户PV访问发起的请求数量\n\n使用 `PerformanceObserver` 监听 `resource` 类型的性能条目，或直接通过 `performance.getEntriesByType('resource')` 获取当前页面所有资源请求。\n\n- `initiatorType` 可区分请求来源：`xmlhttprequest`、`fetch`、`img`、`script`、`css` 等\n- `buffered: true` 可捕获观察器创建前已完成的请求\n- 配合 `sendBeacon` 在页面关闭时上报统计数据\n\n## 长文本溢出处理\n\n分为单行溢出和多行溢出两种场景。\n\n- 单行方案三个属性缺一不可：`white-space: nowrap` 禁止换行、`overflow: hidden` 隐藏溢出、`text-overflow: ellipsis` 显示省略号\n- `-webkit-line-clamp` 虽带 `-webkit-` 前缀，但已被所有现代浏览器支持\n- 需精确控制或自定义省略符时，可用 JS 方案：通过 `scrollHeight > clientHeight` 判断是否溢出，手动截断文本\n\n## 鼠标拖拽\n\n两种实现方式：原生鼠标事件和 HTML5 Drag and Drop API。\n\n- 原生鼠标事件适合自由拖拽定位（如拖拽弹窗），需设置 `position: absolute`\n- HTML5 Drag API（`draggable=\"true\"` + `dragstart`/`dragover`/`drop`）适合拖拽排序、拖放交互\n- 移动端需用 `touchstart`/`touchmove`/`touchend` 替代\n\n## 防止前端页面重复请求\n\n三种常用策略可组合使用：\n\n- **AbortController 取消请求**：发起新请求前取消上一次未完成的同类请求。\n- **请求缓存 / 请求去重**：以请求 URL + 参数为 key，相同请求复用已有 Promise。\n- **UI 层防护**：按钮点击后禁用（`disabled`）或加 loading 状态，防止重复触发。\n\n## ResizeObserver作用\n\n`ResizeObserver` 用于监听元素尺寸（`contentRect` / `borderBoxSize`）变化，当元素宽高发生改变时触发回调。\n\n- 与 `window.resize` 不同，`ResizeObserver` 可监听**任意元素**的尺寸变化，不仅限于窗口\n- 典型应用场景：响应式图表/画布（`ECharts` 调用 `resize()`）、容器查询替代方案、虚拟列表高度自适应\n- 注意在组件卸载时调用 `observer.disconnect()` 避免内存泄漏\n\n## 实时统计浏览器窗口大小\n\n监听 `window` 的 `resize` 事件，搭配节流函数避免高频触发性能问题。\n\n- `window.innerWidth/innerHeight` 返回视口大小（不含滚动条在某些浏览器中的宽度）\n- `document.documentElement.clientWidth/clientHeight` 不含滚动条宽度\n- 如果只是做响应式布局，优先考虑 CSS 媒体查询而非 JS 监听\n\n## 站点一键换肤\n\n核心思路：通过 CSS 变量定义主题色，切换 `html` 的 `data-theme` 属性或 `class` 来切换变量集合。\n\n- CSS 变量方案性能最好，无需重新加载样式文件\n- 可配合 `prefers-color-scheme` 媒体查询自动跟随系统深色模式\n- 大型项目可使用 CSS-in-JS 或 design token 体系管理主题变量\n\n## 网页加载进度条\n\n在路由切换或页面加载时展示顶部进度条，提升用户感知速度。\n\n- **NProgress**：轻量级进度条库，调用 `NProgress.start()` / `NProgress.done()` 即可，常与路由守卫搭配。\n- **自定义实现**：监听页面资源加载进度，或在 SPA 路由切换时手动控制进度条。\n- NProgress 本质是\"假进度\"，模拟加载过程，请求完成后快速填满\n- 可结合 `PerformanceObserver` 监听资源加载实现真实进度\n\n## 图片懒加载\n\n延迟加载视口外的图片，减少首屏请求数和带宽消耗。\n\n- **`loading=\"lazy\"`（原生方案）**：HTML 属性，浏览器原生支持，最简单。\n- **`IntersectionObserver`（推荐方案）**：监听图片是否进入视口，进入时将 `data-src` 赋值给 `src`。\n- `loading=\"lazy\"` 兼容性已覆盖所有现代浏览器，是首选方案\n- `rootMargin: '200px'` 提前 200px 开始加载，避免图片进入视口时出现空白\n- 首屏关键图片不应懒加载，应设置 `loading=\"eager\"` 或不设置该属性\n\n## SEO优化\n\n前端 SEO 优化的核心策略：\n\n- **SSR / SSG**：服务端渲染（Next.js / Nuxt.js）或静态站点生成，让爬虫能获取完整 HTML 内容，解决 SPA 爬取问题。\n- **语义化 HTML**：使用 `<header>`、`<nav>`、`<main>`、`<article>`、`<section>` 等语义标签，帮助搜索引擎理解页面结构。\n- **Meta 标签**：设置 `<title>`、`<meta name=\"description\">`、`<meta name=\"keywords\">` 以及 Open Graph 标签。\n- **Sitemap 与 robots.txt**：提交站点地图帮助爬虫发现页面，`robots.txt` 控制爬取范围。\n- **性能优化**：Core Web Vitals（LCP、FID、CLS）是 Google 排名因素，需优化加载速度。\n- **结构化数据**：使用 JSON-LD 格式的 Schema.org 标记，帮助搜索引擎理解页面内容（如产品、文章、FAQ）。\n\n## 如何通过设置失效时间清除本地存储的数据\n\n`localStorage` 本身没有过期机制，需在存储时附带过期时间戳，读取时判断是否过期。\n\n- 此方案是\"惰性清除\"，仅在读取时检查是否过期\n- 可配合定时器主动清理：`setInterval` 遍历 `localStorage` 清除过期项\n- 如果只需会话级存储，直接使用 `sessionStorage`（标签页关闭即清除）\n\n## QPS达到峰值时如何处理\n\n从前端和架构两个层面应对高并发：\n\n- **前端限流**：防抖节流减少请求频率、合并请求（如批量操作合并为一次接口调用）、按钮禁用防重复提交。\n- **CDN 加速**：静态资源走 CDN 分发，减轻源站压力。HTML 页面可配置短时缓存。\n- **接口缓存**：对不频繁变动的数据使用 HTTP 缓存（`Cache-Control`）或前端内存缓存，减少重复请求。\n- **服务端限流**：令牌桶 / 滑动窗口算法限流，超出阈值返回 `429 Too Many Requests`。\n- **服务降级**：非核心功能降级（如关闭推荐模块），保障核心链路可用。\n- **弹性扩容**：K8s HPA 自动扩容，配合负载均衡分摊流量。\n- **消息队列削峰**：将突发请求写入消息队列（Kafka / RabbitMQ），消费端平稳处理。\n\n## 同一个链接，PC打开是Web应用，手机打开是H5应用\n\n两种主流方案：\n\n- **响应式设计（同一套代码）**：使用 CSS 媒体查询 + 弹性布局，根据屏幕宽度自适应 PC 和移动端 UI。适合内容型网站，维护成本低。\n- **UA 判断 + 重定向（两套代码）**：服务端或前端检测 `User-Agent`，将移动设备重定向到 H5 域名（如 `m.example.com`）。适合 PC 和移动端交互差异大的场景。\n- 响应式方案通过 `@media` 断点适配不同屏幕，一套代码维护成本低但灵活性受限\n- 重定向方案两套代码各自优化体验，但维护成本翻倍\n- 混合方案：核心页面响应式，差异大的页面分别开发\n",
    "headings": [
      {
        "depth": 1,
        "text": "场景题",
        "slug": "场景题"
      },
      {
        "depth": 2,
        "text": "前端如何实现截图",
        "slug": "前端如何实现截图"
      },
      {
        "depth": 2,
        "text": "前端如何实现上传文件进度条",
        "slug": "前端如何实现上传文件进度条"
      },
      {
        "depth": 2,
        "text": "前端页面添加水印，禁止移除水印",
        "slug": "前端页面添加水印禁止移除水印"
      },
      {
        "depth": 2,
        "text": "合并请求，返回一个结果",
        "slug": "合并请求返回一个结果"
      },
      {
        "depth": 2,
        "text": "前端实现即时通讯",
        "slug": "前端实现即时通讯"
      },
      {
        "depth": 2,
        "text": "前端项目工程自动化部署（CICD）",
        "slug": "前端项目工程自动化部署cicd"
      },
      {
        "depth": 2,
        "text": "token过期后，页面无感刷新",
        "slug": "token过期后页面无感刷新"
      },
      {
        "depth": 2,
        "text": "table header吸顶",
        "slug": "table-header吸顶"
      },
      {
        "depth": 2,
        "text": "实现AI聊天打字机效果",
        "slug": "实现ai聊天打字机效果"
      },
      {
        "depth": 2,
        "text": "实现一个简单的微前端架构",
        "slug": "实现一个简单的微前端架构"
      },
      {
        "depth": 2,
        "text": "判断用户设备",
        "slug": "判断用户设备"
      },
      {
        "depth": 2,
        "text": "电梯导航实现",
        "slug": "电梯导航实现"
      },
      {
        "depth": 2,
        "text": "上滑加载",
        "slug": "上滑加载"
      },
      {
        "depth": 2,
        "text": "下拉刷新",
        "slug": "下拉刷新"
      },
      {
        "depth": 2,
        "text": "判断元素在可视区域",
        "slug": "判断元素在可视区域"
      },
      {
        "depth": 2,
        "text": "表单校验场景，实现页面视口滚动到报错位置",
        "slug": "表单校验场景实现页面视口滚动到报错位置"
      },
      {
        "depth": 2,
        "text": "判断页签是否活跃",
        "slug": "判断页签是否活跃"
      },
      {
        "depth": 2,
        "text": "页面关闭时如何执行方法",
        "slug": "页面关闭时如何执行方法"
      },
      {
        "depth": 2,
        "text": "介绍下大文件上传",
        "slug": "介绍下大文件上传"
      },
      {
        "depth": 2,
        "text": "统计用户PV访问发起的请求数量",
        "slug": "统计用户pv访问发起的请求数量"
      },
      {
        "depth": 2,
        "text": "长文本溢出处理",
        "slug": "长文本溢出处理"
      },
      {
        "depth": 2,
        "text": "鼠标拖拽",
        "slug": "鼠标拖拽"
      },
      {
        "depth": 2,
        "text": "防止前端页面重复请求",
        "slug": "防止前端页面重复请求"
      },
      {
        "depth": 2,
        "text": "ResizeObserver作用",
        "slug": "resizeobserver作用"
      },
      {
        "depth": 2,
        "text": "实时统计浏览器窗口大小",
        "slug": "实时统计浏览器窗口大小"
      },
      {
        "depth": 2,
        "text": "站点一键换肤",
        "slug": "站点一键换肤"
      },
      {
        "depth": 2,
        "text": "网页加载进度条",
        "slug": "网页加载进度条"
      },
      {
        "depth": 2,
        "text": "图片懒加载",
        "slug": "图片懒加载"
      },
      {
        "depth": 2,
        "text": "SEO优化",
        "slug": "seo优化"
      },
      {
        "depth": 2,
        "text": "如何通过设置失效时间清除本地存储的数据",
        "slug": "如何通过设置失效时间清除本地存储的数据"
      },
      {
        "depth": 2,
        "text": "QPS达到峰值时如何处理",
        "slug": "qps达到峰值时如何处理"
      },
      {
        "depth": 2,
        "text": "同一个链接，PC打开是Web应用，手机打开是H5应用",
        "slug": "同一个链接pc打开是web应用手机打开是h5应用"
      }
    ],
    "searchText": "场景题 实践 场景题 前端如何实现截图 主流方案有两种：html2canvas 和 dom to image。 html2canvas ：遍历目标 dom 节点，将其样式和内容绘制到 <canvas 上，再通过 canvas.todataurl() 导出为图片。不依赖服务端，但对 css 支持不完整（如 box shadow、filter 等部分属性渲染存在差异），且受同源策略限制，跨域图片需配置 usecors: true 或使用代理。 dom to image ：将 dom 序列化为 svg（foreignobject），再渲染到 <canvas 导出。对 css 还原度更高，支持导出 svg、png、jpeg 等格式，但在部分浏览器兼容性上不如 html2canvas。 前端如何实现上传文件进度条 核心是利用 xmlhttprequest 的 upload.onprogress 事件或 axios 的 onuploadprogress 回调，获取已发送字节数与总字节数的比值。 e.loaded 为已上传字节数，e.total 为文件总大小 fetch api 原生不支持上传进度监听，需要用 xmlhttprequest 或第三方库 前端页面添加水印，禁止移除水印 使用 canvas 生成水印图片作为背景，配合 mutationobserver 防篡改。 生成水印 ：创建 <canvas 绘制文字，通过 canvas.todataurl() 转为 base64 图片，设为水印容器的 background image 并平铺。 防篡改 ：使用 mutationobserver 监听水印 dom 的 attributes、childlist、subtree 变化，一旦检测到删除或修改，立即重新生成水印节点。 还可监听 div 的属性变化，防止通过 devtools 修改 style 隐藏水印 设置 pointer events: none 保证水印不影响页面交互 合并请求，返回一个结果 常见场景：短时间内触发多次相同请求，合并为一次发送或等待所有并发请求完成后统一返回结果。 promise.all ：适用于多个独立请求需要全部完成后再处理结果的场景，任意一个失败则整体失败。 promise.allsettled ：不论成功失败均返回每个请求的结果状态。 请求队列 / 请求合并 ：对短时间内重复触发的同一接口，用 map 缓存进行中的 promise，相同 key 直接复用，避免重复发送。 前端实现即时通讯 三种主流方案，按实时性递增排列： 短轮询（polling） ：客户端定时发送 http 请求查询新消息。实现简单但延迟高、浪费带宽，适合对实时性要求不高的场景。 sse（server sent events） ：基于 http 的单向推送协议，服务端可主动推送消息到客户端。使用 eventsource api，自动重连，适合通知、实时数据流等服务端到客户端的单向通信。 websocket ：基于 tcp 的全双工通信协议，延迟低、支持双向通信。适合聊天室、协同编辑等高实时性场景。 前端项目工程自动化部署（cicd） ci/cd 即持续集成 / 持续部署，核心流程：代码提交 → 自动构建 → 自动测试 → 自动部署。 github actions ：在 .github/workflows/ 下编写 yaml 配置，监听 push/pull request 事件触发流水线，免费额度适合开源项目。 gitlab ci ：通过项目根目录的 .gitlab ci.yml 配置流水线，与 gitlab 深度集成。 jenkins ：自托管的 ci/cd 平台，通过 jenkinsfile 定义 pipeline，插件生态丰富，适合企业内部署。 前端项目通常构建产物为静态文件，部署到 nginx / cdn / oss 即可 可在流水线中集成 eslint、单元测试、e2e 测试等质量门禁 token过期后，页面无感刷新 使用双 token 机制：短期的 access token 用于接口鉴权，长期的 refresh token 用于刷新。在 http 拦截器中检测 401 响应，自动用 refresh token 换取新 access token 并重发失败请求，用户无感知。 使用 isrefreshing 标志和等待队列，避免多个请求同时触发刷新 refresh token 也过期时需跳转登录页 table header吸顶 使表格表头在滚动时固定在可视区域顶部，常用两种方案： position: sticky ：最简方案，给 <th 设置 position: sticky; top: 0;，需确保父容器没有 overflow: hidden。兼容性良好（ie 不支持）。 intersectionobserver ：监听表格是否离开视口，动态为表头添加固定定位样式，适合需要更精细控制的场景。 sticky 方案需注意 border collapse 下边框可能不随元素固定，可用 box shadow 替代下边框 如果表格在滚动容器内，top 值应相对于最近的滚动祖先 实现ai聊天打字机效果 核心思路：通过 sse（server sent events）流式接收模型输出，前端逐字 / 逐块渲染到页面。 后端接口返回 content type: text/event stream，使用 readablestream 逐块读取 可配合 requestanimationframe 或定时器控制渲染速度，模拟打字节奏 支持 markdown 渲染时，可在每次 chunk 到来后用 marked 等库重新解析已累积的文本 实现一个简单的微前端架构 微前端将大型前端应用拆分为多个独立子应用，各自开发、部署、运行。主流方案： qiankun ：基于 single spa，提供 js 沙箱（proxy）和样式隔离，子应用需导出 bootstrap/mount/unmount 生命周期。 module federation（webpack 5） ：在构建层面共享模块，子应用通过远程入口暴露组件，主应用动态加载。适合技术栈统一的场景。 iframe ：天然隔离，但有通信成本高、url 不同步、性能开销等问题，适合对隔离性要求极高的场景。 选型建议：团队技术栈统一优先 module federation，历史项目渐进式迁移优先 qiankun，强隔离需求用 iframe 需关注子应用间通信（customevent / 全局状态）、路由协调、样式隔离等问题 判断用户设备 通过 navigator.useragent 解析或 css 媒体查询判断设备类型。 navigator.useragent 可被伪造，不应作为安全判断依据，仅做 ui 适配参考 navigator.useragentdata（user agent client hints）是更现代的替代方案，提供结构化设备信息 结合多维度判断（屏幕宽度 + 触控支持 + ua）更可靠 电梯导航实现 电梯导航即点击侧边栏锚点滚动到对应内容区域，滚动时高亮当前区域对应的导航项。 点击滚动 ：点击导航项调用 element.scrollintoview({ behavior: 'smooth' }) 或 window.scrollto() 平滑滚动到目标位置。 滚动高亮 ：使用 intersectionobserver 监听各个内容区块的可见性，当某区块进入视口时高亮对应导航项。 上滑加载 也称无限滚动（infinite scroll），当用户滚动到列表底部时自动加载更多数据。 intersectionobserver 方案（推荐） ：在列表底部放置一个哨兵元素（sentinel），用 intersectionobserver 监听其是否进入视口，触发加载。 scroll 事件方案 ：监听滚动容器的 scroll 事件，判断 scrolltop + clientheight = scrollheight threshold，需配合节流。 设置 rootmargin 可提前触发加载，提升体验 注意维护 isloading 状态防止重复请求，数据加载完毕后 observer.unobserve(sentinel) 下拉刷新 移动端常见交互，通过触摸事件实现：touchstart 记录起始位置 → touchmove 计算下拉距离并显示加载提示 → touchend 触发数据刷新。 需在 scrolltop === 0 时才启用下拉逻辑，避免与正常滚动冲突 通常设置最大下拉距离（如 80px）和触发刷新阈值（如 60px） 成熟组件库如 vant pullrefresh、ant design mobile pulltorefresh 已封装好此逻辑 判断元素在可视区域 两种主流方案： intersectionobserver（推荐） ：异步观察目标元素与视口的交叉状态，性能好，无需手动计算。 getboundingclientrect() ：返回元素相对于视口的位置信息，手动判断是否在可视区域内。 intersectionobserver 支持配置 threshold（交叉比例阈值）和 rootmargin（提前/延迟触发） getboundingclientrect 在高频调用（如 scroll 事件）时需搭配节流避免性能问题 表单校验场景，实现页面视口滚动到报错位置 表单校验失败后，调用 scrollintoview() 将第一个报错字段滚动到视口中，提升用户体验。 block: 'center' 将元素滚动到视口垂直居中，比 start 体验更好 滚动后调用 focus() 聚焦输入框，方便用户直接修改 多表单分步场景中，需先判断报错字段在哪个步骤并切换过去 判断页签是否活跃 使用 document.visibilitystate 和 visibilitychange 事件判断当前标签页是否可见。 document.visibilitystate 有两个值：visible（可见）和 hidden（隐藏） 典型应用：页签不可见时暂停定时器、动画、视频播放、websocket 心跳，节省资源 document.hidden 是布尔属性，作用等同于 visibilitystate === 'hidden' 页面关闭时如何执行方法 使用 beforeunload 事件和 navigator.sendbeacon() 在页面关闭 / 刷新前执行逻辑。 navigator.sendbeacon() 是专为页面卸载设计的 api，异步发送少量数据，不阻塞页面关闭，成功率高于普通 fetch/xhr beforeunload 中的异步请求（如 fetch）可能被浏览器取消，因此数据上报优先用 sendbeacon unload 事件在现代浏览器中不可靠，推荐使用 beforeunload 或 pagehide 介绍下大文件上传 大文件切片上传，如何确定切片数量，考虑哪些因素 核心流程：file.slice() 将文件切片 → 并发上传各分片 → 服务端合并。支持断点续传。 切片大小确定 ：一般设为 2mb~10mb。需考虑：网络带宽（弱网用小切片）、服务端接收限制、并发数量、重传成本（切片越小重传代价越低）。 断点续传 ：上传前根据文件内容计算 hash（sparkmd5 / crypto.subtle），向服务端查询已上传的分片列表，仅上传缺失的分片。 并发控制 ：限制同时上传的分片数（通常 3~6 个），避免带宽竞争。 使用 web worker 计算文件 hash 避免阻塞主线程 各分片上传失败可独立重试，不影响其他分片 统计用户pv访问发起的请求数量 使用 performanceobserver 监听 resource 类型的性能条目，或直接通过 performance.getentriesbytype('resource') 获取当前页面所有资源请求。 initiatortype 可区分请求来源：xmlhttprequest、fetch、img、script、css 等 buffered: true 可捕获观察器创建前已完成的请求 配合 sendbeacon 在页面关闭时上报统计数据 长文本溢出处理 分为单行溢出和多行溢出两种场景。 单行方案三个属性缺一不可：white space: nowrap 禁止换行、overflow: hidden 隐藏溢出、text overflow: ellipsis 显示省略号 webkit line clamp 虽带 webkit 前缀，但已被所有现代浏览器支持 需精确控制或自定义省略符时，可用 js 方案：通过 scrollheight clientheight 判断是否溢出，手动截断文本 鼠标拖拽 两种实现方式：原生鼠标事件和 html5 drag and drop api。 原生鼠标事件适合自由拖拽定位（如拖拽弹窗），需设置 position: absolute html5 drag api（draggable=\"true\" + dragstart/dragover/drop）适合拖拽排序、拖放交互 移动端需用 touchstart/touchmove/touchend 替代 防止前端页面重复请求 三种常用策略可组合使用： abortcontroller 取消请求 ：发起新请求前取消上一次未完成的同类请求。 请求缓存 / 请求去重 ：以请求 url + 参数为 key，相同请求复用已有 promise。 ui 层防护 ：按钮点击后禁用（disabled）或加 loading 状态，防止重复触发。 resizeobserver作用 resizeobserver 用于监听元素尺寸（contentrect / borderboxsize）变化，当元素宽高发生改变时触发回调。 与 window.resize 不同，resizeobserver 可监听 任意元素 的尺寸变化，不仅限于窗口 典型应用场景：响应式图表/画布（echarts 调用 resize()）、容器查询替代方案、虚拟列表高度自适应 注意在组件卸载时调用 observer.disconnect() 避免内存泄漏 实时统计浏览器窗口大小 监听 window 的 resize 事件，搭配节流函数避免高频触发性能问题。 window.innerwidth/innerheight 返回视口大小（不含滚动条在某些浏览器中的宽度） document.documentelement.clientwidth/clientheight 不含滚动条宽度 如果只是做响应式布局，优先考虑 css 媒体查询而非 js 监听 站点一键换肤 核心思路：通过 css 变量定义主题色，切换 html 的 data theme 属性或 class 来切换变量集合。 css 变量方案性能最好，无需重新加载样式文件 可配合 prefers color scheme 媒体查询自动跟随系统深色模式 大型项目可使用 css in js 或 design token 体系管理主题变量 网页加载进度条 在路由切换或页面加载时展示顶部进度条，提升用户感知速度。 nprogress ：轻量级进度条库，调用 nprogress.start() / nprogress.done() 即可，常与路由守卫搭配。 自定义实现 ：监听页面资源加载进度，或在 spa 路由切换时手动控制进度条。 nprogress 本质是\"假进度\"，模拟加载过程，请求完成后快速填满 可结合 performanceobserver 监听资源加载实现真实进度 图片懒加载 延迟加载视口外的图片，减少首屏请求数和带宽消耗。 loading=\"lazy\"（原生方案） ：html 属性，浏览器原生支持，最简单。 intersectionobserver（推荐方案） ：监听图片是否进入视口，进入时将 data src 赋值给 src。 loading=\"lazy\" 兼容性已覆盖所有现代浏览器，是首选方案 rootmargin: '200px' 提前 200px 开始加载，避免图片进入视口时出现空白 首屏关键图片不应懒加载，应设置 loading=\"eager\" 或不设置该属性 seo优化 前端 seo 优化的核心策略： ssr / ssg ：服务端渲染（next.js / nuxt.js）或静态站点生成，让爬虫能获取完整 html 内容，解决 spa 爬取问题。 语义化 html ：使用 <header 、<nav 、<main 、<article 、<section 等语义标签，帮助搜索引擎理解页面结构。 meta 标签 ：设置 <title 、<meta name=\"description\" 、<meta name=\"keywords\" 以及 open graph 标签。 sitemap 与 robots.txt ：提交站点地图帮助爬虫发现页面，robots.txt 控制爬取范围。 性能优化 ：core web vitals（lcp、fid、cls）是 google 排名因素，需优化加载速度。 结构化数据 ：使用 json ld 格式的 schema.org 标记，帮助搜索引擎理解页面内容（如产品、文章、faq）。 如何通过设置失效时间清除本地存储的数据 localstorage 本身没有过期机制，需在存储时附带过期时间戳，读取时判断是否过期。 此方案是\"惰性清除\"，仅在读取时检查是否过期 可配合定时器主动清理：setinterval 遍历 localstorage 清除过期项 如果只需会话级存储，直接使用 sessionstorage（标签页关闭即清除） qps达到峰值时如何处理 从前端和架构两个层面应对高并发： 前端限流 ：防抖节流减少请求频率、合并请求（如批量操作合并为一次接口调用）、按钮禁用防重复提交。 cdn 加速 ：静态资源走 cdn 分发，减轻源站压力。html 页面可配置短时缓存。 接口缓存 ：对不频繁变动的数据使用 http 缓存（cache control）或前端内存缓存，减少重复请求。 服务端限流 ：令牌桶 / 滑动窗口算法限流，超出阈值返回 429 too many requests。 服务降级 ：非核心功能降级（如关闭推荐模块），保障核心链路可用。 弹性扩容 ：k8s hpa 自动扩容，配合负载均衡分摊流量。 消息队列削峰 ：将突发请求写入消息队列（kafka / rabbitmq），消费端平稳处理。 同一个链接，pc打开是web应用，手机打开是h5应用 两种主流方案： 响应式设计（同一套代码） ：使用 css 媒体查询 + 弹性布局，根据屏幕宽度自适应 pc 和移动端 ui。适合内容型网站，维护成本低。 ua 判断 + 重定向（两套代码） ：服务端或前端检测 user agent，将移动设备重定向到 h5 域名（如 m.example.com）。适合 pc 和移动端交互差异大的场景。 响应式方案通过 @media 断点适配不同屏幕，一套代码维护成本低但灵活性受限 重定向方案两套代码各自优化体验，但维护成本翻倍 混合方案：核心页面响应式，差异大的页面分别开发"
  },
  {
    "slug": "016-git",
    "title": "Git",
    "category": "工程化",
    "sourcePath": "docs/工程化/Git.md",
    "markdown": "# Git\n\n## git rebase 和 git merge 区别\n\n### 操作结果\n\n- **`git merge`**：会将指定分支的更改合并到当前分支，生成一个新的合并提交（merge commit）。这个新的提交记录了两个分支的合并情况，保留了分支的完整历史，使得项目的历史记录呈现出分支交错的状态，适用于多人协作且希望保留清晰分支合并历史的场景。\n- **`git rebase`**：会把当前分支所基于的基础分支更新到最新，然后将当前分支的所有提交按照顺序依次应用到更新后的基础分支上。它会改变提交历史，使项目历史看起来像是一条直线，让提交历史更加简洁，适用于个人开发或在推送代码到共享仓库前整理提交历史的场景。\n\n### 冲突处理\n\n- **`git merge`**：在合并时如果出现冲突，开发者需要手动解决冲突，然后使用 `git add` 和 `git commit` 完成合并提交。因为保留了分支的合并历史，所以解决冲突时相对直观，可清楚看到两个分支的差异。\n- **`git rebase`**：在变基过程中出现冲突，同样需要手动解决冲突。但与 `git merge` 不同的是，解决冲突后不是提交一个新的合并提交，而是继续执行变基操作（`git rebase --continue`）。由于变基改变了提交历史，解决冲突时可能需要更多思考来确定修改的正确性。\n\n## git pull 和 git fetch 区别\n\n- **`git pull`**：是一个复合操作，它实际上是 `git fetch` 和 `git merge` 的组合。`git pull` 会从远程仓库下载最新的代码，并自动将其合并到当前分支。\n- **`git fetch`**：只从远程仓库下载最新的代码，但不会自动合并到当前分支。下载的代码会存储在本地的远程跟踪分支（如 `origin/master`）中，开发者需要手动决定如何处理这些新代码，比如通过 `git merge` 或 `git rebase` 进行合并。\n",
    "headings": [
      {
        "depth": 1,
        "text": "Git",
        "slug": "git"
      },
      {
        "depth": 2,
        "text": "git rebase 和 git merge 区别",
        "slug": "git-rebase-和-git-merge-区别"
      },
      {
        "depth": 3,
        "text": "操作结果",
        "slug": "操作结果"
      },
      {
        "depth": 3,
        "text": "冲突处理",
        "slug": "冲突处理"
      },
      {
        "depth": 2,
        "text": "git pull 和 git fetch 区别",
        "slug": "git-pull-和-git-fetch-区别"
      }
    ],
    "searchText": "git 工程化 git git rebase 和 git merge 区别 操作结果 git merge ：会将指定分支的更改合并到当前分支，生成一个新的合并提交（merge commit）。这个新的提交记录了两个分支的合并情况，保留了分支的完整历史，使得项目的历史记录呈现出分支交错的状态，适用于多人协作且希望保留清晰分支合并历史的场景。 git rebase ：会把当前分支所基于的基础分支更新到最新，然后将当前分支的所有提交按照顺序依次应用到更新后的基础分支上。它会改变提交历史，使项目历史看起来像是一条直线，让提交历史更加简洁，适用于个人开发或在推送代码到共享仓库前整理提交历史的场景。 冲突处理 git merge ：在合并时如果出现冲突，开发者需要手动解决冲突，然后使用 git add 和 git commit 完成合并提交。因为保留了分支的合并历史，所以解决冲突时相对直观，可清楚看到两个分支的差异。 git rebase ：在变基过程中出现冲突，同样需要手动解决冲突。但与 git merge 不同的是，解决冲突后不是提交一个新的合并提交，而是继续执行变基操作（git rebase continue）。由于变基改变了提交历史，解决冲突时可能需要更多思考来确定修改的正确性。 git pull 和 git fetch 区别 git pull ：是一个复合操作，它实际上是 git fetch 和 git merge 的组合。git pull 会从远程仓库下载最新的代码，并自动将其合并到当前分支。 git fetch ：只从远程仓库下载最新的代码，但不会自动合并到当前分支。下载的代码会存储在本地的远程跟踪分支（如 origin/master）中，开发者需要手动决定如何处理这些新代码，比如通过 git merge 或 git rebase 进行合并。"
  },
  {
    "slug": "017-webpack",
    "title": "Webpack",
    "category": "工程化",
    "sourcePath": "docs/工程化/Webpack.md",
    "markdown": "# Webpack\n\nWebpack，前端打包构建工具。\n\n## 构建流程\n\n### 1. 初始化阶段\n\n- 读取配置：从 `webpack.config.js` 或 CLI 参数中合并得到最终配置。\n- 创建 `Compiler` 实例：这是 Webpack 的核心引擎，负责管理整个编译周期。\n- 注册插件：执行所有配置的插件，监听编译生命周期的钩子（hooks）。\n\n### 2. 编译阶段\n\n- 入口分析：从配置的 `entry` 入口文件开始，启动编译。\n- 依赖解析：使用 `enhanced-resolve` 解析模块路径，递归查找所有依赖模块。\n- 模块转换：对每个模块，根据配置的 `rules` 使用对应的 Loader 进行编译（如 Babel 转译 ES6、Sass 转 CSS），生成可执行代码。\n- 生成模块依赖图：将所有模块及其依赖关系组织成一个依赖图（Dependency Graph）。\n\n### 3. 生成阶段\n\n- Chunk 生成：根据依赖图和配置的代码分割规则，将模块组合成多个 Chunk。\n- 资源优化：执行代码压缩、Tree Shaking、Scope Hoisting 等优化操作。\n- 输出文件：将优化后的 Chunk 写入到配置的 `output` 目录，生成最终的 bundle 文件。\n\n## 打包速度优化\n\n- **缩小 Loader 处理范围**：在 `module.rules` 中使用 `include` 和 `exclude` 明确指定需要/不需要处理的文件目录，避免遍历整个项目。\n- **优化 `resolve` 配置**：\n  - 配置 `resolve.extensions` 减少文件扩展名尝试次数。\n  - 配置 `resolve.modules` 明确模块搜索路径，避免向上递归查找。\n- **Loader 缓存**：为 `babel-loader` 等开启缓存，将编译结果缓存到文件系统。\n- **Webpack 5 持久化缓存**：直接在配置中开启，缓存整个编译过程。\n- **多线程/多进程并行处理**：`thread-loader`（写在第一个 loader），将耗时的 Loader 任务放到 worker 池里并行执行。\n- **代码分割与资源优化**：`optimization` 中配置 `splitChunks`，分离公共依赖和第三方库，避免重复打包，减小单个 bundle 体积。\n- **动态 `import` 懒加载**：将非首屏代码按需加载，减少初始 bundle 大小。\n- **Source Map 优化**：开发环境使用 `eval-cheap-module-source-map`，生产环境使用 `hidden-source-map` 或不生成，减少 Source Map 生成时间。\n\n## Webpack 分块（Chunk）\n\n### 分的对象\n\n分块操作的核心是 chunk（代码块），而非直接分割\"依赖（dependency）\"。依赖是构成 chunk 的基本单元（比如一个文件、一个模块），Webpack 会先分析依赖关系，再将相关依赖打包成不同的 chunk。\n\n### 分块依据\n\n1. **入口起点（entry）**：每个 `entry` 默认生成一个 chunk（单入口只有 1 个主 chunk，多入口会生成多个入口 chunk）。\n2. **代码分割规则**：\n   - 显式分割：通过 `import()` 动态导入、`splitChunks` 配置主动拆分（如抽离公共代码、第三方库）。\n   - 隐式分割：Webpack 内置规则（如异步加载的模块自动拆分为独立 chunk）。\n3. **缓存策略**：`splitChunks` 中 `minChunks`（模块被引用次数）、`minSize`（chunk 最小体积）等参数决定是否拆分。\n\n### 分块过程\n\nWebpack 先构建依赖图（记录模块间的引用关系），再根据上述规则将依赖图中的模块分组，每组形成一个 chunk，最终输出为单独的文件（如 `main.js`、`vendors~main.js`）。\n\n## 按需引入\n\n按需引入的核心是\"运行时动态加载模块\" + \"Webpack 的代码分割\"，具体逻辑：\n\n1. **编译时**：Webpack 遇到 `import('./module.js')`（动态导入语法）时，会将该模块拆分为独立 chunk，生成对应的异步加载文件（如 `0.js`），并在主 chunk 中插入\"加载逻辑代码\"。\n2. **运行时**：\n   - 代码执行到 `import()` 时，先判断该 chunk 是否已加载：未加载则通过 JSONP（或 `fetch`）请求对应的异步文件；\n   - 文件加载完成后，将其挂载到全局（或执行模块代码），返回 `Promise`；\n   - 开发者通过 `.then()` 接收模块导出内容，实现\"用到时才加载\"。\n3. **路由级按需引入**（如 Vue Router/React Router）：本质是将路由组件作为异步 chunk，只有当用户访问该路由时，才触发 `import()` 加载对应的组件 chunk。\n\n## 单入口下\"引用次数 minChunks\"指什么？\n\n单入口只有 1 个\"入口 chunk\"，此时\"引用次数\"是指：该模块被入口 chunk 中的多少个不同子模块引用。\n\n- 举例：单入口 `main.js` 中，`a.js` 引用了 `lodash`，`b.js` 也引用了 `lodash`，则 `lodash` 的引用次数为 2。若 `minChunks=2`，Webpack 会将 `lodash` 抽离为独立 chunk（vendors）。\n- 同一模块多次 `import`（如同一文件内多次导入）只算 1 次引用，核心是\"不同引用源\"的数量。\n\n多入口下\"引用次数\"是指模块被多少个入口 chunk 引用（如两个入口都引用 `lodash`，次数为 2）。\n\n## resolve 配置\n\n`resolve` 是 Webpack 用于解析模块路径的配置，核心配置项：\n\n### （1）路径解析规则\n\n- `extensions`：自动补全文件后缀，如 `['.js', '.vue', '.json']`，导入 `./a` 时会依次查找 `a.js`、`a.vue`、`a.json`。\n- `alias`：路径别名，如 `{ '@': path.resolve(__dirname, 'src') }`，简化 `import '@/components'` 的写法。\n- `modules`：指定模块查找目录，默认 `['node_modules']`，可添加自定义目录（如 `src/components`）。\n\n### （2）文件解析优先级\n\n- `mainFiles`：指定目录的入口文件，默认 `['index']`，查找 `./dir` 时会找 `./dir/index.js`。\n- `descriptionFiles`：读取包描述文件，默认 `['package.json']`，优先按 `package.json` 的 `main` 字段解析。\n\n### （3）符号链接解析\n\n- `symlinks`：是否解析符号链接（软链），默认 `true`，设为 `false` 可避免软链路径解析错误。\n\n## Loader 和 Plugin 的区别\n\n### Loader（模块转换器）\n\n- **作用**：对单个模块（文件）的内容进行转换处理。Webpack 本身只能处理 JavaScript 和 JSON 文件，Loader 让 Webpack 能够处理其他类型的文件（如 CSS、图片、TypeScript 等）。\n- **运行时机**：在模块加载阶段，Webpack 解析到某个模块时，根据 `module.rules` 匹配对应的 Loader 进行转换。\n- **配置位置**：在 `module.rules` 中配置。\n- **本质**：一个导出为函数的模块，接收源文件内容作为参数，返回转换后的内容。\n- **执行顺序**：从右到左、从下到上依次执行（链式调用）。\n\n### Plugin（构建扩展器）\n\n- **作用**：扩展 Webpack 整个构建流程的能力。Plugin 可以在 Webpack 构建的各个生命周期钩子中执行自定义操作，如打包优化、资源管理、注入环境变量等。\n- **运行时机**：贯穿整个编译生命周期，通过监听 Webpack 的 hooks（钩子）在特定时机执行。\n- **配置位置**：在 `plugins` 数组中配置，传入 `new` 实例。\n- **本质**：一个具有 `apply` 方法的类，`apply` 方法接收 `compiler` 对象，通过它可以访问 Webpack 的所有生命周期钩子。\n\n### 核心区别\n\n- **职责：** Loader负责转换模块内容（文件级别），Plugin扩展整个构建流程（全局级别）。\n- **作用范围：** Loader作用于单个文件的转换，Plugin贯穿整个编译生命周期。\n- **配置位置：** Loader在`module.rules`中配置，Plugin在`plugins`数组中配置。\n- **运行时机：** Loader在模块加载时执行，Plugin在编译各阶段的钩子中执行。\n\n## WebPack Tree Shaking 原理\n\nTree Shaking 是一种消除未使用代码（Dead Code）的优化技术，Webpack 在生产模式下默认开启。\n\n### 实现原理\n\n1. **依赖 ES Module 的静态结构**：ES Module 的 `import`/`export` 是静态声明（编译时确定依赖关系，不能在条件语句中动态导入），Webpack 可以在编译阶段对模块的导入导出进行静态分析，精确判断哪些导出被使用、哪些未被使用。CommonJS 的 `require` 是动态的（运行时才确定），因此无法进行 Tree Shaking。\n2. **标记未使用的导出**：Webpack 在构建模块依赖图时，会分析每个模块的导出是否被其他模块引用。对于未被任何模块引用的导出，Webpack 会在生成的代码中添加标记注释（如 `/*unused harmony export*/`）。\n3. **压缩工具删除死代码**：最终由代码压缩工具（如 Terser）读取这些标记，在压缩阶段将未使用的代码彻底删除，从而减小打包体积。\n\n### 生效条件\n\n- 必须使用 ES Module 语法（`import`/`export`），不能使用 CommonJS（`require`/`module.exports`）。\n- 生产模式（`mode: 'production'`）下默认开启。\n- 模块不能有副作用，或需要通过 `sideEffects` 属性声明（见下文）。\n\n## package.json 里 sideEffects 属性作用\n\n`sideEffects` 用于告知 Webpack 当前包中的哪些模块是\"无副作用\"的，从而帮助 Webpack 更安全地进行 Tree Shaking。\n\n### 什么是副作用\n\n副作用是指模块在被 `import` 时，除了导出内容之外，还会执行一些影响全局的操作。例如：修改全局变量、添加 CSS 样式（`import './style.css'`）、注册 polyfill 等。\n\n### sideEffects 的作用\n\n如果不声明 `sideEffects`，Webpack 在做 Tree Shaking 时会比较保守——即使某个模块的导出没有被使用，Webpack 也不敢直接删除它，因为担心它有副作用代码需要执行。\n\n通过在 `package.json` 中配置 `sideEffects`，可以明确告诉 Webpack：`\"sideEffects\": false` 表示该包中的所有模块都没有副作用，Webpack 可以放心地删除所有未被引用的模块。也可以指定有副作用的文件列表（如 `[\"*.css\", \"*.less\", \"./src/polyfill.js\"]`），其余模块均视为无副作用，Webpack 会保留 CSS 和 polyfill 的副作用，对其他未被引用的模块执行 Tree Shaking。\n",
    "headings": [
      {
        "depth": 1,
        "text": "Webpack",
        "slug": "webpack"
      },
      {
        "depth": 2,
        "text": "构建流程",
        "slug": "构建流程"
      },
      {
        "depth": 3,
        "text": "1. 初始化阶段",
        "slug": "1-初始化阶段"
      },
      {
        "depth": 3,
        "text": "2. 编译阶段",
        "slug": "2-编译阶段"
      },
      {
        "depth": 3,
        "text": "3. 生成阶段",
        "slug": "3-生成阶段"
      },
      {
        "depth": 2,
        "text": "打包速度优化",
        "slug": "打包速度优化"
      },
      {
        "depth": 2,
        "text": "Webpack 分块（Chunk）",
        "slug": "webpack-分块chunk"
      },
      {
        "depth": 3,
        "text": "分的对象",
        "slug": "分的对象"
      },
      {
        "depth": 3,
        "text": "分块依据",
        "slug": "分块依据"
      },
      {
        "depth": 3,
        "text": "分块过程",
        "slug": "分块过程"
      },
      {
        "depth": 2,
        "text": "按需引入",
        "slug": "按需引入"
      },
      {
        "depth": 2,
        "text": "单入口下\"引用次数 minChunks\"指什么？",
        "slug": "单入口下引用次数-minchunks指什么"
      },
      {
        "depth": 2,
        "text": "resolve 配置",
        "slug": "resolve-配置"
      },
      {
        "depth": 3,
        "text": "（1）路径解析规则",
        "slug": "1路径解析规则"
      },
      {
        "depth": 3,
        "text": "（2）文件解析优先级",
        "slug": "2文件解析优先级"
      },
      {
        "depth": 3,
        "text": "（3）符号链接解析",
        "slug": "3符号链接解析"
      },
      {
        "depth": 2,
        "text": "Loader 和 Plugin 的区别",
        "slug": "loader-和-plugin-的区别"
      },
      {
        "depth": 3,
        "text": "Loader（模块转换器）",
        "slug": "loader模块转换器"
      },
      {
        "depth": 3,
        "text": "Plugin（构建扩展器）",
        "slug": "plugin构建扩展器"
      },
      {
        "depth": 3,
        "text": "核心区别",
        "slug": "核心区别"
      },
      {
        "depth": 2,
        "text": "WebPack Tree Shaking 原理",
        "slug": "webpack-tree-shaking-原理"
      },
      {
        "depth": 3,
        "text": "实现原理",
        "slug": "实现原理"
      },
      {
        "depth": 3,
        "text": "生效条件",
        "slug": "生效条件"
      },
      {
        "depth": 2,
        "text": "package.json 里 sideEffects 属性作用",
        "slug": "packagejson-里-sideeffects-属性作用"
      },
      {
        "depth": 3,
        "text": "什么是副作用",
        "slug": "什么是副作用"
      },
      {
        "depth": 3,
        "text": "sideEffects 的作用",
        "slug": "sideeffects-的作用"
      }
    ],
    "searchText": "webpack 工程化 webpack webpack，前端打包构建工具。 构建流程 1. 初始化阶段 读取配置：从 webpack.config.js 或 cli 参数中合并得到最终配置。 创建 compiler 实例：这是 webpack 的核心引擎，负责管理整个编译周期。 注册插件：执行所有配置的插件，监听编译生命周期的钩子（hooks）。 2. 编译阶段 入口分析：从配置的 entry 入口文件开始，启动编译。 依赖解析：使用 enhanced resolve 解析模块路径，递归查找所有依赖模块。 模块转换：对每个模块，根据配置的 rules 使用对应的 loader 进行编译（如 babel 转译 es6、sass 转 css），生成可执行代码。 生成模块依赖图：将所有模块及其依赖关系组织成一个依赖图（dependency graph）。 3. 生成阶段 chunk 生成：根据依赖图和配置的代码分割规则，将模块组合成多个 chunk。 资源优化：执行代码压缩、tree shaking、scope hoisting 等优化操作。 输出文件：将优化后的 chunk 写入到配置的 output 目录，生成最终的 bundle 文件。 打包速度优化 缩小 loader 处理范围 ：在 module.rules 中使用 include 和 exclude 明确指定需要/不需要处理的文件目录，避免遍历整个项目。 优化 resolve 配置 ： 配置 resolve.extensions 减少文件扩展名尝试次数。 配置 resolve.modules 明确模块搜索路径，避免向上递归查找。 loader 缓存 ：为 babel loader 等开启缓存，将编译结果缓存到文件系统。 webpack 5 持久化缓存 ：直接在配置中开启，缓存整个编译过程。 多线程/多进程并行处理 ：thread loader（写在第一个 loader），将耗时的 loader 任务放到 worker 池里并行执行。 代码分割与资源优化 ：optimization 中配置 splitchunks，分离公共依赖和第三方库，避免重复打包，减小单个 bundle 体积。 动态 import 懒加载 ：将非首屏代码按需加载，减少初始 bundle 大小。 source map 优化 ：开发环境使用 eval cheap module source map，生产环境使用 hidden source map 或不生成，减少 source map 生成时间。 webpack 分块（chunk） 分的对象 分块操作的核心是 chunk（代码块），而非直接分割\"依赖（dependency）\"。依赖是构成 chunk 的基本单元（比如一个文件、一个模块），webpack 会先分析依赖关系，再将相关依赖打包成不同的 chunk。 分块依据 1. 入口起点（entry） ：每个 entry 默认生成一个 chunk（单入口只有 1 个主 chunk，多入口会生成多个入口 chunk）。 2. 代码分割规则 ： 显式分割：通过 import() 动态导入、splitchunks 配置主动拆分（如抽离公共代码、第三方库）。 隐式分割：webpack 内置规则（如异步加载的模块自动拆分为独立 chunk）。 3. 缓存策略 ：splitchunks 中 minchunks（模块被引用次数）、minsize（chunk 最小体积）等参数决定是否拆分。 分块过程 webpack 先构建依赖图（记录模块间的引用关系），再根据上述规则将依赖图中的模块分组，每组形成一个 chunk，最终输出为单独的文件（如 main.js、vendors~main.js）。 按需引入 按需引入的核心是\"运行时动态加载模块\" + \"webpack 的代码分割\"，具体逻辑： 1. 编译时 ：webpack 遇到 import('./module.js')（动态导入语法）时，会将该模块拆分为独立 chunk，生成对应的异步加载文件（如 0.js），并在主 chunk 中插入\"加载逻辑代码\"。 2. 运行时 ： 代码执行到 import() 时，先判断该 chunk 是否已加载：未加载则通过 jsonp（或 fetch）请求对应的异步文件； 文件加载完成后，将其挂载到全局（或执行模块代码），返回 promise； 开发者通过 .then() 接收模块导出内容，实现\"用到时才加载\"。 3. 路由级按需引入 （如 vue router/react router）：本质是将路由组件作为异步 chunk，只有当用户访问该路由时，才触发 import() 加载对应的组件 chunk。 单入口下\"引用次数 minchunks\"指什么？ 单入口只有 1 个\"入口 chunk\"，此时\"引用次数\"是指：该模块被入口 chunk 中的多少个不同子模块引用。 举例：单入口 main.js 中，a.js 引用了 lodash，b.js 也引用了 lodash，则 lodash 的引用次数为 2。若 minchunks=2，webpack 会将 lodash 抽离为独立 chunk（vendors）。 同一模块多次 import（如同一文件内多次导入）只算 1 次引用，核心是\"不同引用源\"的数量。 多入口下\"引用次数\"是指模块被多少个入口 chunk 引用（如两个入口都引用 lodash，次数为 2）。 resolve 配置 resolve 是 webpack 用于解析模块路径的配置，核心配置项： （1）路径解析规则 extensions：自动补全文件后缀，如 ['.js', '.vue', '.json']，导入 ./a 时会依次查找 a.js、a.vue、a.json。 alias：路径别名，如 { '@': path.resolve( dirname, 'src') }，简化 import '@/components' 的写法。 modules：指定模块查找目录，默认 ['node modules']，可添加自定义目录（如 src/components）。 （2）文件解析优先级 mainfiles：指定目录的入口文件，默认 ['index']，查找 ./dir 时会找 ./dir/index.js。 descriptionfiles：读取包描述文件，默认 ['package.json']，优先按 package.json 的 main 字段解析。 （3）符号链接解析 symlinks：是否解析符号链接（软链），默认 true，设为 false 可避免软链路径解析错误。 loader 和 plugin 的区别 loader（模块转换器） 作用 ：对单个模块（文件）的内容进行转换处理。webpack 本身只能处理 javascript 和 json 文件，loader 让 webpack 能够处理其他类型的文件（如 css、图片、typescript 等）。 运行时机 ：在模块加载阶段，webpack 解析到某个模块时，根据 module.rules 匹配对应的 loader 进行转换。 配置位置 ：在 module.rules 中配置。 本质 ：一个导出为函数的模块，接收源文件内容作为参数，返回转换后的内容。 执行顺序 ：从右到左、从下到上依次执行（链式调用）。 plugin（构建扩展器） 作用 ：扩展 webpack 整个构建流程的能力。plugin 可以在 webpack 构建的各个生命周期钩子中执行自定义操作，如打包优化、资源管理、注入环境变量等。 运行时机 ：贯穿整个编译生命周期，通过监听 webpack 的 hooks（钩子）在特定时机执行。 配置位置 ：在 plugins 数组中配置，传入 new 实例。 本质 ：一个具有 apply 方法的类，apply 方法接收 compiler 对象，通过它可以访问 webpack 的所有生命周期钩子。 核心区别 职责： loader负责转换模块内容（文件级别），plugin扩展整个构建流程（全局级别）。 作用范围： loader作用于单个文件的转换，plugin贯穿整个编译生命周期。 配置位置： loader在module.rules中配置，plugin在plugins数组中配置。 运行时机： loader在模块加载时执行，plugin在编译各阶段的钩子中执行。 webpack tree shaking 原理 tree shaking 是一种消除未使用代码（dead code）的优化技术，webpack 在生产模式下默认开启。 实现原理 1. 依赖 es module 的静态结构 ：es module 的 import/export 是静态声明（编译时确定依赖关系，不能在条件语句中动态导入），webpack 可以在编译阶段对模块的导入导出进行静态分析，精确判断哪些导出被使用、哪些未被使用。commonjs 的 require 是动态的（运行时才确定），因此无法进行 tree shaking。 2. 标记未使用的导出 ：webpack 在构建模块依赖图时，会分析每个模块的导出是否被其他模块引用。对于未被任何模块引用的导出，webpack 会在生成的代码中添加标记注释（如 / unused harmony export /）。 3. 压缩工具删除死代码 ：最终由代码压缩工具（如 terser）读取这些标记，在压缩阶段将未使用的代码彻底删除，从而减小打包体积。 生效条件 必须使用 es module 语法（import/export），不能使用 commonjs（require/module.exports）。 生产模式（mode: 'production'）下默认开启。 模块不能有副作用，或需要通过 sideeffects 属性声明（见下文）。 package.json 里 sideeffects 属性作用 sideeffects 用于告知 webpack 当前包中的哪些模块是\"无副作用\"的，从而帮助 webpack 更安全地进行 tree shaking。 什么是副作用 副作用是指模块在被 import 时，除了导出内容之外，还会执行一些影响全局的操作。例如：修改全局变量、添加 css 样式（import './style.css'）、注册 polyfill 等。 sideeffects 的作用 如果不声明 sideeffects，webpack 在做 tree shaking 时会比较保守——即使某个模块的导出没有被使用，webpack 也不敢直接删除它，因为担心它有副作用代码需要执行。 通过在 package.json 中配置 sideeffects，可以明确告诉 webpack：\"sideeffects\": false 表示该包中的所有模块都没有副作用，webpack 可以放心地删除所有未被引用的模块。也可以指定有副作用的文件列表（如 [\" .css\", \" .less\", \"./src/polyfill.js\"]），其余模块均视为无副作用，webpack 会保留 css 和 polyfill 的副作用，对其他未被引用的模块执行 tree shaking。"
  },
  {
    "slug": "018-前端安全",
    "title": "前端安全",
    "category": "工程化",
    "sourcePath": "docs/工程化/前端安全.md",
    "markdown": "# 前端安全\n\n## 什么是 XSS？如何防范？\n\n### XSS 的定义\n\n全称及概念：XSS 即跨站脚本攻击（Cross-Site Scripting），为避免与层叠样式表（CSS）混淆，故简称为 XSS。它是一种常见的 Web 安全漏洞，攻击者利用网站对用户输入过滤不足的缺陷，将恶意脚本（通常为 JavaScript，但也可能是其他脚本语言，如 VBScript 等）注入到网页中。当其他用户访问该网页时，这些恶意脚本就会在用户浏览器中执行，从而达到窃取用户信息、进行操作模拟等恶意目的。\n\n攻击原理示例：假设一个留言板网站，没有对用户输入进行严格过滤。攻击者在留言内容中插入一段恶意 JavaScript 脚本，如 `<script>alert('XSS')</script>`。当其他用户浏览该留言板时，浏览器会解析并执行这段脚本，弹出提示框。更恶意的脚本可能会获取用户的 cookie 信息，通过网络发送给攻击者，攻击者利用这些 cookie 就有可能以用户身份登录网站，进行各种操作。\n\n### XSS 的类型\n\n**反射型 XSS：**\n\n- 原理：攻击者构造包含恶意脚本的链接，诱导用户点击。服务器接收请求后，未经严格处理直接将恶意脚本反射给用户浏览器执行。例如，攻击者发送一个链接 `http://example.com/search?query=<script>alert('XSS')</script>`，如果网站搜索功能对输入未进行过滤，当用户点击该链接，服务器返回的搜索结果页面就会包含这段恶意脚本，在用户浏览器中执行。\n- 特点：这种攻击方式具有一次性特点，恶意脚本不会存储在服务器端，攻击效果依赖用户点击特定链接。\n\n**存储型 XSS：**\n\n- 原理：攻击者将恶意脚本提交并存储到服务器端，如在论坛发帖、留言等功能处。当其他用户访问包含该恶意脚本的页面时，脚本会自动执行。例如，攻击者在论坛发布一篇包含恶意脚本的帖子，其他用户浏览该帖子时，恶意脚本就会在其浏览器中运行。\n- 特点：危害更大，因为只要有用户访问相关页面就会受到攻击，影响范围广，且恶意脚本长期存储在服务器端，持续威胁用户安全。\n\n**DOM-based XSS：**\n\n- 原理：通过修改页面的 DOM 树来注入恶意脚本。攻击者利用网页中 JavaScript 对 DOM 操作的漏洞，当用户浏览器加载页面后，脚本在本地执行过程中被篡改，从而触发 XSS 攻击。例如，网页中有一段 JavaScript 代码获取 URL 参数并动态创建 DOM 元素，攻击者通过修改 URL 参数注入恶意脚本，如 `http://example.com/page?param='><script>alert('XSS')</script>`，当页面脚本处理该参数时，就会创建恶意的 DOM 元素并执行脚本。\n- 特点：攻击发生在客户端，不依赖服务器端返回恶意内容，检测相对困难。\n\n### 防范 XSS 的方法\n\n**输入验证与过滤：**\n\n- 验证类型：对用户输入的数据进行严格的类型检查和格式验证。例如，对于期望输入数字的字段，只允许数字字符输入，使用正则表达式进行验证，如在 JavaScript 中，验证输入是否为数字可使用 `/^\\d+$/` 正则表达式。\n- 过滤特殊字符：对用户输入中的特殊字符进行转义或过滤。特殊字符如 `<`、`>`、`'`、`\"`、`;` 等在 HTML 和 JavaScript 中有特殊含义，可能被用于构造恶意脚本。可以使用专门的库函数进行转义，如在 Node.js 中使用 `DOMPurify` 库，它能有效清理和过滤恶意脚本。\n\n**输出编码：**\n\n- HTML 编码：在将用户输入输出到页面时，对特殊字符进行 HTML 编码。例如，将 `<` 编码为 `&lt;`，`>` 编码为 `&gt;`，这样浏览器会将其作为普通字符显示，而非解析为 HTML 标签，从而防止恶意脚本执行。\n- JavaScript 编码：当在 JavaScript 代码中输出用户输入内容时，要进行 JavaScript 编码。比如，将 `'` 编码为 `\\u0027`，防止输入内容破坏 JavaScript 代码结构并注入恶意脚本。\n\n**HttpOnly Cookie：**\n\n- 原理：设置 Cookie 的 `HttpOnly` 属性，该属性使得 Cookie 只能通过 HTTP 协议传输，无法通过 JavaScript 访问。这样即使页面存在 XSS 漏洞，攻击者也无法通过脚本获取用户的 Cookie，从而降低用户会话被劫持的风险。\n- 设置方式：在服务器端设置 Cookie 时添加 `HttpOnly` 属性，不同编程语言设置方式略有不同。例如在 PHP 中，使用 `setcookie('cookie_name', 'cookie_value', time() + 3600, '/', '', false, true);`，最后一个参数 `true` 表示设置 `HttpOnly` 属性。\n\n**内容安全策略（CSP）：**\n\n- 原理：通过 HTTP 响应头或 HTML 元标签来限制页面可以加载的资源来源。例如，只允许从特定域名加载脚本、样式表等资源，防止恶意脚本的注入。\n- 设置示例：可以在服务器端设置 `Content-Security-Policy` 响应头，如 `Content-Security-Policy: default-src 'self'; script-src 'self' example.com`，表示默认只允许从本域名加载资源，脚本资源可从本域名和 `example.com` 加载。\n\n**使用安全的开发框架和库：**\n\n- 框架优势：许多现代 Web 开发框架和库在设计时考虑了 XSS 防范。例如，React 在渲染用户输入时，默认会对内容进行转义，防止 XSS 攻击。Vue.js 也提供了一些机制来确保数据在绑定到 DOM 时是安全的。使用这些框架和库可以减少开发者手动处理 XSS 防范的工作量，降低出现漏洞的风险。\n\n## 反射型 XSS 和存储型 XSS 的主要区别是什么？\n\n反射型 XSS 的恶意脚本不会存储在服务器端，攻击依赖用户点击包含恶意脚本的特定链接，具有一次性特点。而存储型 XSS 的恶意脚本被存储在服务器端，只要有用户访问包含该脚本的页面就会触发攻击，影响范围更广，危害更大。\n\n## 什么是 CSRF？如何防范？\n\n### CSRF 的定义\n\n全称及概念：CSRF 即跨站请求伪造（Cross-Site Request Forgery），也被称为\"One Click Attack\"或者\"Session Riding\"，通常缩写为 CSRF 或者 XSRF。它是一种网络攻击手段，攻击者诱导受害者在已登录目标网站的情况下，访问一个恶意链接或页面，利用受害者已登录的身份，在受害者不知情的情况下以受害者的名义向目标网站发送恶意请求，执行一些非本意的操作，如转账、修改密码等。\n\n攻击原理示例：假设用户在银行网站完成登录后，未退出账号。此时用户访问了一个恶意网站，该恶意网站包含一个隐藏的表单，表单的 `action` 指向银行网站的转账接口，并且预先填充好了收款账号等信息。当用户打开恶意网站时，由于浏览器会自动发送该表单请求（因为用户已登录银行网站，带有有效的会话凭证，如 cookie），银行网站接收到请求后，会认为是用户本人发起的转账操作，从而执行转账，导致用户资金受损。\n\n### CSRF 攻击的特点\n\n- **利用用户身份**：CSRF 攻击依赖于用户已在目标网站登录且浏览器保存了有效的会话凭证（如 cookie）。攻击者无法直接获取用户的凭证，而是借助用户浏览器自动发送凭证的机制来实施攻击。\n- **诱导用户操作**：攻击者需要诱使用户主动访问恶意链接或页面，从而触发恶意请求。这可能通过钓鱼邮件、恶意广告等方式实现。\n- **跨站特性**：攻击通常来自与目标网站不同的域，利用了浏览器的同源策略漏洞（虽然同源策略限制了跨域资源的访问，但对于 `GET`、`POST` 等请求，浏览器在某些情况下仍会自动发送请求及相关凭证）。\n\n### 防范 CSRF 的方法\n\n**CSRF Token 机制：**\n\n- 原理：在用户访问网站时，服务器为每个用户生成一个唯一的、随机的 CSRF Token，并将其存储在用户会话（session）中。同时，在返回给用户的页面中，将该 Token 包含在表单或 HTTP 头中。当用户提交表单或发送请求时，将 Token 一并发送到服务器。服务器收到请求后，比对请求中的 Token 与存储在会话中的 Token 是否一致。如果一致，则认为请求是合法的；否则，拒绝请求。\n- 实现方式：在服务器端生成 Token。\n\n**`SameSite` Cookie 属性：**\n\n- 原理：通过设置 Cookie 的 `SameSite` 属性，来限制 Cookie 在跨站请求中的发送。`SameSite` 有三个值：`Strict`、`Lax` 和 `None`。`Strict` 模式下，Cookie 在任何跨站请求中都不会被发送；`Lax` 模式相对宽松，在一些安全的跨站请求（如用户从外部链接点击进入网站的 `GET` 请求）中会发送 Cookie，但对于 `POST` 等可能修改数据的请求，不会发送 Cookie；`None` 则表示 Cookie 可以在跨站请求中发送，但需要同时设置 `Secure` 属性，确保 Cookie 仅通过 HTTPS 协议传输。\n- 设置方式：在服务器端设置 Cookie 时，指定 `SameSite` 属性。\n\n**检查 `Referer` 头：**\n\n- 原理：`Referer` 头包含了用户请求页面的来源地址。服务器可以检查 `Referer` 头，确认请求是否来自合法的源。如果 `Referer` 头显示请求来自恶意网站，服务器可以拒绝该请求。\n- 局限性与风险：这种方法并非完全可靠，因为用户可以通过一些手段（如修改浏览器设置）来隐藏或伪造 `Referer` 头。此外，在某些情况下（如从 HTTPS 页面跳转到 HTTP 页面），浏览器可能不会发送 `Referer` 头。但它仍可作为一种辅助的防范措施。\n\n**双重提交 Cookie：**\n\n- 原理：在用户登录时，服务器生成两个相关联的 Token，一个作为 Cookie 发送给用户，另一个存储在服务器端。当用户发送请求时，请求中同时包含 Cookie 中的 Token 和表单或 HTTP 头中的另一个 Token。服务器比对这两个 Token 是否匹配，若匹配则认为请求合法。\n- 实现方式：在服务器端生成两个 Token 并关联存储，前端在请求中同时发送两个 Token。\n\n## CSRF Token 机制中，Token 的生成有什么要求？\n\nToken 需要具有随机性和唯一性，难以被猜测或伪造。通常使用加密安全的随机数生成算法来生成，例如使用 UUID（通用唯一识别码）或基于加密密钥的随机数生成方法。同时，Token 的长度也应足够长，以增加破解难度，一般建议长度在 16 位以上。\n\n## SameSite Cookie 属性的三种值（Strict、Lax、None）在防范 CSRF 攻击方面有什么区别？\n\n- `Strict` 模式最为严格，在任何跨站请求中都不会发送 Cookie，能有效防范 CSRF 攻击，但可能会影响一些正常的跨站功能，如从外部链接分享到本网站的功能。\n- `Lax` 模式相对宽松，在一些安全的跨站请求（如 `GET` 请求从外部链接进入网站）中会发送 Cookie，但对于可能修改数据的 `POST` 等请求，不会发送 Cookie，既能防范大部分 CSRF 攻击，又能保证一些基本的跨站功能正常运行。\n- `None` 值表示 Cookie 可以在跨站请求中发送，本身不能防范 CSRF 攻击，但结合 `Secure` 属性确保仅通过 HTTPS 传输，可在一定程度上提高安全性。\n",
    "headings": [
      {
        "depth": 1,
        "text": "前端安全",
        "slug": "前端安全"
      },
      {
        "depth": 2,
        "text": "什么是 XSS？如何防范？",
        "slug": "什么是-xss如何防范"
      },
      {
        "depth": 3,
        "text": "XSS 的定义",
        "slug": "xss-的定义"
      },
      {
        "depth": 3,
        "text": "XSS 的类型",
        "slug": "xss-的类型"
      },
      {
        "depth": 3,
        "text": "防范 XSS 的方法",
        "slug": "防范-xss-的方法"
      },
      {
        "depth": 2,
        "text": "反射型 XSS 和存储型 XSS 的主要区别是什么？",
        "slug": "反射型-xss-和存储型-xss-的主要区别是什么"
      },
      {
        "depth": 2,
        "text": "什么是 CSRF？如何防范？",
        "slug": "什么是-csrf如何防范"
      },
      {
        "depth": 3,
        "text": "CSRF 的定义",
        "slug": "csrf-的定义"
      },
      {
        "depth": 3,
        "text": "CSRF 攻击的特点",
        "slug": "csrf-攻击的特点"
      },
      {
        "depth": 3,
        "text": "防范 CSRF 的方法",
        "slug": "防范-csrf-的方法"
      },
      {
        "depth": 2,
        "text": "CSRF Token 机制中，Token 的生成有什么要求？",
        "slug": "csrf-token-机制中token-的生成有什么要求"
      },
      {
        "depth": 2,
        "text": "SameSite Cookie 属性的三种值（Strict、Lax、None）在防范 CSRF 攻击方面有什么区别？",
        "slug": "samesite-cookie-属性的三种值strictlaxnone在防范-csrf-攻击方面有什么区别"
      }
    ],
    "searchText": "前端安全 工程化 前端安全 什么是 xss？如何防范？ xss 的定义 全称及概念：xss 即跨站脚本攻击（cross site scripting），为避免与层叠样式表（css）混淆，故简称为 xss。它是一种常见的 web 安全漏洞，攻击者利用网站对用户输入过滤不足的缺陷，将恶意脚本（通常为 javascript，但也可能是其他脚本语言，如 vbscript 等）注入到网页中。当其他用户访问该网页时，这些恶意脚本就会在用户浏览器中执行，从而达到窃取用户信息、进行操作模拟等恶意目的。 攻击原理示例：假设一个留言板网站，没有对用户输入进行严格过滤。攻击者在留言内容中插入一段恶意 javascript 脚本，如 <script alert('xss')</script 。当其他用户浏览该留言板时，浏览器会解析并执行这段脚本，弹出提示框。更恶意的脚本可能会获取用户的 cookie 信息，通过网络发送给攻击者，攻击者利用这些 cookie 就有可能以用户身份登录网站，进行各种操作。 xss 的类型 反射型 xss： 原理：攻击者构造包含恶意脚本的链接，诱导用户点击。服务器接收请求后，未经严格处理直接将恶意脚本反射给用户浏览器执行。例如，攻击者发送一个链接 http://example.com/search?query=<script alert('xss')</script ，如果网站搜索功能对输入未进行过滤，当用户点击该链接，服务器返回的搜索结果页面就会包含这段恶意脚本，在用户浏览器中执行。 特点：这种攻击方式具有一次性特点，恶意脚本不会存储在服务器端，攻击效果依赖用户点击特定链接。 存储型 xss： 原理：攻击者将恶意脚本提交并存储到服务器端，如在论坛发帖、留言等功能处。当其他用户访问包含该恶意脚本的页面时，脚本会自动执行。例如，攻击者在论坛发布一篇包含恶意脚本的帖子，其他用户浏览该帖子时，恶意脚本就会在其浏览器中运行。 特点：危害更大，因为只要有用户访问相关页面就会受到攻击，影响范围广，且恶意脚本长期存储在服务器端，持续威胁用户安全。 dom based xss： 原理：通过修改页面的 dom 树来注入恶意脚本。攻击者利用网页中 javascript 对 dom 操作的漏洞，当用户浏览器加载页面后，脚本在本地执行过程中被篡改，从而触发 xss 攻击。例如，网页中有一段 javascript 代码获取 url 参数并动态创建 dom 元素，攻击者通过修改 url 参数注入恶意脚本，如 http://example.com/page?param=' <script alert('xss')</script ，当页面脚本处理该参数时，就会创建恶意的 dom 元素并执行脚本。 特点：攻击发生在客户端，不依赖服务器端返回恶意内容，检测相对困难。 防范 xss 的方法 输入验证与过滤： 验证类型：对用户输入的数据进行严格的类型检查和格式验证。例如，对于期望输入数字的字段，只允许数字字符输入，使用正则表达式进行验证，如在 javascript 中，验证输入是否为数字可使用 /^\\d+$/ 正则表达式。 过滤特殊字符：对用户输入中的特殊字符进行转义或过滤。特殊字符如 <、 、'、\"、; 等在 html 和 javascript 中有特殊含义，可能被用于构造恶意脚本。可以使用专门的库函数进行转义，如在 node.js 中使用 dompurify 库，它能有效清理和过滤恶意脚本。 输出编码： html 编码：在将用户输入输出到页面时，对特殊字符进行 html 编码。例如，将 < 编码为 &lt;， 编码为 &gt;，这样浏览器会将其作为普通字符显示，而非解析为 html 标签，从而防止恶意脚本执行。 javascript 编码：当在 javascript 代码中输出用户输入内容时，要进行 javascript 编码。比如，将 ' 编码为 \\u0027，防止输入内容破坏 javascript 代码结构并注入恶意脚本。 httponly cookie： 原理：设置 cookie 的 httponly 属性，该属性使得 cookie 只能通过 http 协议传输，无法通过 javascript 访问。这样即使页面存在 xss 漏洞，攻击者也无法通过脚本获取用户的 cookie，从而降低用户会话被劫持的风险。 设置方式：在服务器端设置 cookie 时添加 httponly 属性，不同编程语言设置方式略有不同。例如在 php 中，使用 setcookie('cookie name', 'cookie value', time() + 3600, '/', '', false, true);，最后一个参数 true 表示设置 httponly 属性。 内容安全策略（csp）： 原理：通过 http 响应头或 html 元标签来限制页面可以加载的资源来源。例如，只允许从特定域名加载脚本、样式表等资源，防止恶意脚本的注入。 设置示例：可以在服务器端设置 content security policy 响应头，如 content security policy: default src 'self'; script src 'self' example.com，表示默认只允许从本域名加载资源，脚本资源可从本域名和 example.com 加载。 使用安全的开发框架和库： 框架优势：许多现代 web 开发框架和库在设计时考虑了 xss 防范。例如，react 在渲染用户输入时，默认会对内容进行转义，防止 xss 攻击。vue.js 也提供了一些机制来确保数据在绑定到 dom 时是安全的。使用这些框架和库可以减少开发者手动处理 xss 防范的工作量，降低出现漏洞的风险。 反射型 xss 和存储型 xss 的主要区别是什么？ 反射型 xss 的恶意脚本不会存储在服务器端，攻击依赖用户点击包含恶意脚本的特定链接，具有一次性特点。而存储型 xss 的恶意脚本被存储在服务器端，只要有用户访问包含该脚本的页面就会触发攻击，影响范围更广，危害更大。 什么是 csrf？如何防范？ csrf 的定义 全称及概念：csrf 即跨站请求伪造（cross site request forgery），也被称为\"one click attack\"或者\"session riding\"，通常缩写为 csrf 或者 xsrf。它是一种网络攻击手段，攻击者诱导受害者在已登录目标网站的情况下，访问一个恶意链接或页面，利用受害者已登录的身份，在受害者不知情的情况下以受害者的名义向目标网站发送恶意请求，执行一些非本意的操作，如转账、修改密码等。 攻击原理示例：假设用户在银行网站完成登录后，未退出账号。此时用户访问了一个恶意网站，该恶意网站包含一个隐藏的表单，表单的 action 指向银行网站的转账接口，并且预先填充好了收款账号等信息。当用户打开恶意网站时，由于浏览器会自动发送该表单请求（因为用户已登录银行网站，带有有效的会话凭证，如 cookie），银行网站接收到请求后，会认为是用户本人发起的转账操作，从而执行转账，导致用户资金受损。 csrf 攻击的特点 利用用户身份 ：csrf 攻击依赖于用户已在目标网站登录且浏览器保存了有效的会话凭证（如 cookie）。攻击者无法直接获取用户的凭证，而是借助用户浏览器自动发送凭证的机制来实施攻击。 诱导用户操作 ：攻击者需要诱使用户主动访问恶意链接或页面，从而触发恶意请求。这可能通过钓鱼邮件、恶意广告等方式实现。 跨站特性 ：攻击通常来自与目标网站不同的域，利用了浏览器的同源策略漏洞（虽然同源策略限制了跨域资源的访问，但对于 get、post 等请求，浏览器在某些情况下仍会自动发送请求及相关凭证）。 防范 csrf 的方法 csrf token 机制： 原理：在用户访问网站时，服务器为每个用户生成一个唯一的、随机的 csrf token，并将其存储在用户会话（session）中。同时，在返回给用户的页面中，将该 token 包含在表单或 http 头中。当用户提交表单或发送请求时，将 token 一并发送到服务器。服务器收到请求后，比对请求中的 token 与存储在会话中的 token 是否一致。如果一致，则认为请求是合法的；否则，拒绝请求。 实现方式：在服务器端生成 token。 samesite cookie 属性： 原理：通过设置 cookie 的 samesite 属性，来限制 cookie 在跨站请求中的发送。samesite 有三个值：strict、lax 和 none。strict 模式下，cookie 在任何跨站请求中都不会被发送；lax 模式相对宽松，在一些安全的跨站请求（如用户从外部链接点击进入网站的 get 请求）中会发送 cookie，但对于 post 等可能修改数据的请求，不会发送 cookie；none 则表示 cookie 可以在跨站请求中发送，但需要同时设置 secure 属性，确保 cookie 仅通过 https 协议传输。 设置方式：在服务器端设置 cookie 时，指定 samesite 属性。 检查 referer 头： 原理：referer 头包含了用户请求页面的来源地址。服务器可以检查 referer 头，确认请求是否来自合法的源。如果 referer 头显示请求来自恶意网站，服务器可以拒绝该请求。 局限性与风险：这种方法并非完全可靠，因为用户可以通过一些手段（如修改浏览器设置）来隐藏或伪造 referer 头。此外，在某些情况下（如从 https 页面跳转到 http 页面），浏览器可能不会发送 referer 头。但它仍可作为一种辅助的防范措施。 双重提交 cookie： 原理：在用户登录时，服务器生成两个相关联的 token，一个作为 cookie 发送给用户，另一个存储在服务器端。当用户发送请求时，请求中同时包含 cookie 中的 token 和表单或 http 头中的另一个 token。服务器比对这两个 token 是否匹配，若匹配则认为请求合法。 实现方式：在服务器端生成两个 token 并关联存储，前端在请求中同时发送两个 token。 csrf token 机制中，token 的生成有什么要求？ token 需要具有随机性和唯一性，难以被猜测或伪造。通常使用加密安全的随机数生成算法来生成，例如使用 uuid（通用唯一识别码）或基于加密密钥的随机数生成方法。同时，token 的长度也应足够长，以增加破解难度，一般建议长度在 16 位以上。 samesite cookie 属性的三种值（strict、lax、none）在防范 csrf 攻击方面有什么区别？ strict 模式最为严格，在任何跨站请求中都不会发送 cookie，能有效防范 csrf 攻击，但可能会影响一些正常的跨站功能，如从外部链接分享到本网站的功能。 lax 模式相对宽松，在一些安全的跨站请求（如 get 请求从外部链接进入网站）中会发送 cookie，但对于可能修改数据的 post 等请求，不会发送 cookie，既能防范大部分 csrf 攻击，又能保证一些基本的跨站功能正常运行。 none 值表示 cookie 可以在跨站请求中发送，本身不能防范 csrf 攻击，但结合 secure 属性确保仅通过 https 传输，可在一定程度上提高安全性。"
  },
  {
    "slug": "019-前端工程化",
    "title": "前端工程化",
    "category": "工程化",
    "sourcePath": "docs/工程化/前端工程化.md",
    "markdown": "# 前端工程化\n\n## 对前端工程化的理解\n\n前端工程化是指将软件工程的方法和思想应用到前端开发中，解决开发效率、代码质量、协作规范和项目可维护性问题。核心包含四个维度：\n\n- **模块化**：将代码拆分为独立模块，通过 ES Modules（`import` / `export`）或 CommonJS 管理依赖关系，避免全局变量污染，提升复用性。CSS 模块化可使用 CSS Modules 或 CSS-in-JS\n- **组件化**：以 UI 组件为单位组织代码（如 React Component、Vue SFC），每个组件封装自身的结构（HTML）、样式（CSS）和逻辑（JS），通过 props 通信，可独立开发、测试和复用\n- **规范化**：统一代码风格（ESLint + Prettier）、Git 提交规范（Commitlint + Husky）、目录结构约定、Code Review 流程和文档规范，降低多人协作的沟通成本\n- **自动化**：通过工具链实现构建打包（Webpack / Vite）、自动化测试（Jest / Playwright）、CI/CD 流水线（GitHub Actions / Jenkins）、自动部署等，减少人工操作和出错概率\n\n## 什么是微前端\n\n微前端是一种将大型前端应用拆分为多个可独立开发、独立部署、独立运行的子应用的架构方案，类似于后端微服务的理念：\n\n- **核心思想**：主应用（基座）负责路由分发和子应用生命周期管理，各子应用可以使用不同技术栈（React / Vue / Angular），拥有独立的代码仓库和 CI/CD 流程\n- **主流方案**：\n  - `qiankun`：基于 `single-spa` 封装，提供 JS 沙箱（`Proxy` 隔离全局变量）、CSS 隔离（Shadow DOM 或 scoped 前缀）、应用间通信等开箱即用能力\n  - `Module Federation`（Webpack 5）：在构建层面实现模块共享，不同应用可直接远程加载彼此的模块，无需发布 npm 包，适合共享组件库或工具库\n  - `single-spa`：较底层的微前端框架，负责子应用的注册、加载和生命周期调度，需自行处理沙箱和样式隔离\n  - `iframe`：最简单的隔离方案，天然沙箱隔离，但存在通信复杂、性能开销大、SEO 不友好等问题\n- **适用场景**：大型企业级应用的渐进式重构、多团队并行开发、遗留系统的逐步迁移\n\n## 如何排除样式文件、图片等资源文件进行单测\n\n单测运行在 Node.js 环境中，无法解析 `.css`、`.less`、`.png` 等非 JS 资源，需要在 Jest 配置中将其 mock 掉：\n\n- **`moduleNameMapper`**：通过正则将资源文件映射到 mock 文件，如 CSS 映射到 `identity-obj-proxy`，图片映射到 `fileMock.js`\n- **`fileMock.js`**：导出一个字符串占位即可\n- **`identity-obj-proxy`**：一个 npm 包，对 CSS Modules 的 `import styles from './a.module.css'` 返回一个 Proxy 对象，`styles.className` 会返回 `\"className\"` 字符串，便于快照测试\n- **`transform` 忽略**：也可使用自定义 transformer 将资源文件转换为空模块，或在 `transformIgnorePatterns` 中配置跳过\n\n## Jest 有哪些重要配置？\n\n- **`testEnvironment`**：测试运行环境，`'jsdom'` 模拟浏览器 DOM（适合 React/Vue 组件测试），`'node'` 用于纯 Node.js 逻辑测试\n- **`transform`**：文件转换器配置，如使用 `ts-jest` 处理 TypeScript，`babel-jest` 处理 JSX/ES6+\n- **`moduleNameMapper`**：模块路径映射，用于 mock 资源文件、处理路径别名（如 `@/` → `src/`）\n- **`setupFiles`**：在测试框架安装前执行的脚本，用于设置环境变量等\n- **`setupFilesAfterFramework`（`setupFilesAfterSetup` 的别名 `setupFiles` 之后）/ `setupFiles`**：在每个测试文件运行前执行，常用于引入 `@testing-library/jest-dom` 扩展断言\n- **`collectCoverage` + `coverageThreshold`**：开启覆盖率收集，并设置最低覆盖率阈值（如 `branches: 80`），不达标则 CI 失败\n- **`testMatch` / `testRegex`**：指定测试文件匹配规则，如 `['**/__tests__/**/*.test.ts']`\n- **`moduleFileExtensions`**：模块文件扩展名解析顺序，如 `['ts', 'tsx', 'js', 'jsx', 'json']`\n- **`transformIgnorePatterns`**：默认忽略 `node_modules`，对于需要转译的 ESM 包需手动排除\n\n## 该如何给自己的项目添加 Jest 去测试 React TS 项目\n\n**第一步**：安装依赖（jest、ts-jest、@testing-library/react、@testing-library/jest-dom、@testing-library/user-event、jest-environment-jsdom、identity-obj-proxy）\n**第二步**：配置 `jest.config.ts`（testEnvironment、transform、moduleNameMapper、setupFilesAfterSetup）\n**第三步**：编写测试（使用 `render`、`screen`、`userEvent` 进行组件交互测试）\n**第四步**：在 `package.json` 添加脚本 `\"test\": \"jest --coverage\"`\n\n## 如何搭建前端测试环境\n\n搭建完整的前端测试环境需要涵盖多个层次：\n\n- **单元测试**：Jest（测试框架 + 断言库 + Mock 能力 + 覆盖率）+ React Testing Library（组件测试），或 Vitest（兼容 Jest API，基于 Vite 更快）\n- **E2E 测试**：Playwright 或 Cypress，模拟用户操作验证完整业务流程\n- **覆盖率工具**：Jest 内置 Istanbul，通过 `--coverage` 生成覆盖率报告（行覆盖、分支覆盖、函数覆盖），可输出 HTML/LCOV 格式\n- **CI 集成**：在 GitHub Actions / GitLab CI 中配置测试流水线，PR 提交自动运行单测和 E2E，覆盖率报告上传到 Codecov / Coveralls 等平台\n- **Git Hooks**：使用 `husky` + `lint-staged` 在 `pre-commit` 阶段运行受影响文件的单测（`jest --findRelatedTests`），在 `pre-push` 阶段运行完整测试\n- **Mock 服务**：使用 `msw`（Mock Service Worker）拦截网络请求，在开发和测试环境统一使用同一套 mock 数据\n\n## 前端单元测试，React 项目为例，该如何做单测选型\n\n推荐组合：**Jest + React Testing Library (RTL)**\n\n- **Jest**：Facebook 出品，零配置开箱即用，内置断言（`expect`）、Mock（`jest.fn()` / `jest.mock()`）、定时器模拟（`jest.useFakeTimers()`）、快照测试和覆盖率统计，React 社区事实标准\n- **React Testing Library**：遵循\"测试用户行为而非实现细节\"的理念，提供 `render`、`screen.getByRole` / `getByText` 等查询方法，鼓励通过 accessible role 和文本内容查找元素，测试不依赖组件内部状态和实现\n- **`@testing-library/user-event`**：模拟真实用户交互（点击、输入、键盘事件），比 `fireEvent` 更贴近浏览器行为\n- **为什么不选 Enzyme**：Enzyme 侧重于测试组件内部实现（`state`、`instance()`），与 React 新特性（Hooks、Concurrent Mode）兼容性差，官方已不积极维护\n- **Vitest 替代方案**：如果项目使用 Vite 构建，Vitest 兼容 Jest API 且利用 Vite 的模块解析速度更快，是现代项目的优选\n\n## 前端 E2E 测试，该如何选型\n\nE2E 测试模拟用户在真实浏览器中的操作，验证完整业务流程。主流方案对比：\n\n- **Playwright**（推荐）：Microsoft 出品，支持 Chromium / Firefox / WebKit 三大引擎，API 简洁且功能强大，支持自动等待、网络拦截、多标签页/多浏览器上下文、移动端模拟、trace 录制回放，并行执行性能优秀，社区活跃度高\n- **Cypress**：开发体验极佳，提供 GUI 调试界面和时间旅行快照，上手快。但限制较多：运行在单浏览器上下文中、不支持多标签页、跨域场景处理复杂、仅支持 Chrome 系和 Firefox\n- **Puppeteer**：Google 出品，专注于 Chrome/Chromium 自动化，API 细粒度控制能力强，适合爬虫和自动化脚本，但不是专为测试设计，缺少断言库和测试组织能力，通常需配合 Jest 使用\n\n**选型建议**：新项目首选 Playwright（跨浏览器 + 功能全面），已有 Cypress 基础设施的团队可继续使用 Cypress，仅需 Chrome 自动化的轻量场景考虑 Puppeteer\n\n## 如何保障前端项目质量\n\n从开发、测试、部署三个阶段建立质量保障体系：\n\n**开发阶段：**\n\n- **ESLint + Prettier**：统一代码风格和最佳实践，配合 `husky` + `lint-staged` 在提交时自动检查\n- **TypeScript**：通过静态类型系统在编译阶段捕获类型错误\n- **Code Review**：PR 必须经过至少一人 review 才能合并，关注业务逻辑、边界处理和性能隐患\n\n**测试阶段：**\n\n- **单元测试**：核心逻辑和工具函数覆盖率 ≥ 80%，关键组件有渲染测试和交互测试\n- **E2E 测试**：覆盖核心业务流程（如登录、下单、支付），确保用户关键路径可用\n- **可视化回归测试**：使用 Chromatic / Percy 等工具对比 UI 截图变化，防止样式意外变更\n\n**部署阶段：**\n\n- **CI/CD 流水线**：自动化构建 → 测试 → 部署，测试不通过则阻断部署\n- **灰度发布**：新版本先推给小比例用户（如 5%），观察监控指标无异常后逐步全量\n- **线上监控 + 告警**：接入错误监控（Sentry）和性能监控，异常时自动告警并支持快速回滚\n\n## 前端单测，如何通过单测模拟请求\n\n单测中不应发真实网络请求，需要 mock 请求以保证测试的隔离性和稳定性：\n\n- **`jest.mock` 模块级 mock**：直接 mock 请求库（如 Axios），控制返回值\n- **MSW（Mock Service Worker）**（推荐）：在 Service Worker 层拦截网络请求，不侵入业务代码，支持 REST 和 GraphQL\n- **`nock`**：拦截 Node.js 层的 HTTP 请求（底层 hook `http` / `https` 模块），适合纯 Node 环境测试\n- **`jest.spyOn(global, 'fetch')`**：直接 spy 原生 `fetch`，适合简单场景\n\n## Jest 单测，如何测试 React 组件交互\n\n使用 React Testing Library 的 `render` + `screen` 查询 + `fireEvent` / `userEvent` 进行交互测试。优先使用 `getByRole` / `getByLabelText` 等语义化查询；异步场景使用 `waitFor` 或 `findByText` 等待 DOM 变化。\n\n- **`userEvent`** 比 `fireEvent` 更真实，会触发完整的事件链（`focus` → `keydown` → `input` → `keyup`）\n- **异步场景**使用 `waitFor` 或 `findByText`（内部封装 `waitFor`）等待 DOM 变化\n- **查询优先级**：`getByRole` > `getByLabelText` > `getByText` > `getByTestId`，尽量使用语义化查询\n\n## 如何对 React 状态库进行单测，比如 Redux、Recoil 等状态库\n\n测试状态库需要在测试环境中提供正确的 Provider 包裹，并使用 `renderHook` 测试自定义 Hook：\n\n**Redux 测试方案**：自定义 `renderWithProviders` 包裹 `<Provider store={store}>`，传入 `preloadedState` 控制初始状态，使用 `userEvent` 模拟点击等交互。\n**自定义 Hook / Zustand / Recoil 测试**：使用 `renderHook` 在虚拟组件中运行 Hook，`act` 包裹所有会触发状态更新的操作；Recoil 需自定义 `wrapper` 传入 `<RecoilRoot>`。\n\n- **关键工具**：`renderHook` 在虚拟组件中运行 Hook，`act` 包裹所有会触发状态更新的操作\n- **Recoil 测试**需要自定义 `wrapper`，传入 `<RecoilRoot>` 作为 Provider\n- **纯 reducer / selector 测试**：直接作为普通函数调用即可，无需 Provider，属于最简单的纯逻辑测试\n\n## 单测中，如果有一些三方依赖，想排除这个三方依赖进行测试，该如何做？\n\n排除三方依赖的目的是保证单测只关注被测模块自身的逻辑，避免三方库的副作用影响测试：\n\n- **`jest.mock('模块名')`**：将整个三方模块替换为自动 mock，所有导出变为 `jest.fn()`，可通过 `mockResolvedValue` 控制返回值\n- **手动 mock（`__mocks__` 目录）**：在项目根目录或模块同级创建 `__mocks__/模块名.js`，Jest 会自动使用该文件替代真实模块，适合需要提供固定返回值的场景\n- **`moduleNameMapper`**：在 `jest.config.js` 中将三方模块映射到 mock 文件，适合全局统一处理\n- **`jest.mock` + 工厂函数**：部分 mock，保留模块中需要的部分方法，如 `jest.requireActual` 配合工厂函数\n- **`jest.spyOn`**：不替换整个模块，仅拦截特定方法，测试结束后自动恢复\n",
    "headings": [
      {
        "depth": 1,
        "text": "前端工程化",
        "slug": "前端工程化"
      },
      {
        "depth": 2,
        "text": "对前端工程化的理解",
        "slug": "对前端工程化的理解"
      },
      {
        "depth": 2,
        "text": "什么是微前端",
        "slug": "什么是微前端"
      },
      {
        "depth": 2,
        "text": "如何排除样式文件、图片等资源文件进行单测",
        "slug": "如何排除样式文件图片等资源文件进行单测"
      },
      {
        "depth": 2,
        "text": "Jest 有哪些重要配置？",
        "slug": "jest-有哪些重要配置"
      },
      {
        "depth": 2,
        "text": "该如何给自己的项目添加 Jest 去测试 React TS 项目",
        "slug": "该如何给自己的项目添加-jest-去测试-react-ts-项目"
      },
      {
        "depth": 2,
        "text": "如何搭建前端测试环境",
        "slug": "如何搭建前端测试环境"
      },
      {
        "depth": 2,
        "text": "前端单元测试，React 项目为例，该如何做单测选型",
        "slug": "前端单元测试react-项目为例该如何做单测选型"
      },
      {
        "depth": 2,
        "text": "前端 E2E 测试，该如何选型",
        "slug": "前端-e2e-测试该如何选型"
      },
      {
        "depth": 2,
        "text": "如何保障前端项目质量",
        "slug": "如何保障前端项目质量"
      },
      {
        "depth": 2,
        "text": "前端单测，如何通过单测模拟请求",
        "slug": "前端单测如何通过单测模拟请求"
      },
      {
        "depth": 2,
        "text": "Jest 单测，如何测试 React 组件交互",
        "slug": "jest-单测如何测试-react-组件交互"
      },
      {
        "depth": 2,
        "text": "如何对 React 状态库进行单测，比如 Redux、Recoil 等状态库",
        "slug": "如何对-react-状态库进行单测比如-reduxrecoil-等状态库"
      },
      {
        "depth": 2,
        "text": "单测中，如果有一些三方依赖，想排除这个三方依赖进行测试，该如何做？",
        "slug": "单测中如果有一些三方依赖想排除这个三方依赖进行测试该如何做"
      }
    ],
    "searchText": "前端工程化 工程化 前端工程化 对前端工程化的理解 前端工程化是指将软件工程的方法和思想应用到前端开发中，解决开发效率、代码质量、协作规范和项目可维护性问题。核心包含四个维度： 模块化 ：将代码拆分为独立模块，通过 es modules（import / export）或 commonjs 管理依赖关系，避免全局变量污染，提升复用性。css 模块化可使用 css modules 或 css in js 组件化 ：以 ui 组件为单位组织代码（如 react component、vue sfc），每个组件封装自身的结构（html）、样式（css）和逻辑（js），通过 props 通信，可独立开发、测试和复用 规范化 ：统一代码风格（eslint + prettier）、git 提交规范（commitlint + husky）、目录结构约定、code review 流程和文档规范，降低多人协作的沟通成本 自动化 ：通过工具链实现构建打包（webpack / vite）、自动化测试（jest / playwright）、ci/cd 流水线（github actions / jenkins）、自动部署等，减少人工操作和出错概率 什么是微前端 微前端是一种将大型前端应用拆分为多个可独立开发、独立部署、独立运行的子应用的架构方案，类似于后端微服务的理念： 核心思想 ：主应用（基座）负责路由分发和子应用生命周期管理，各子应用可以使用不同技术栈（react / vue / angular），拥有独立的代码仓库和 ci/cd 流程 主流方案 ： qiankun：基于 single spa 封装，提供 js 沙箱（proxy 隔离全局变量）、css 隔离（shadow dom 或 scoped 前缀）、应用间通信等开箱即用能力 module federation（webpack 5）：在构建层面实现模块共享，不同应用可直接远程加载彼此的模块，无需发布 npm 包，适合共享组件库或工具库 single spa：较底层的微前端框架，负责子应用的注册、加载和生命周期调度，需自行处理沙箱和样式隔离 iframe：最简单的隔离方案，天然沙箱隔离，但存在通信复杂、性能开销大、seo 不友好等问题 适用场景 ：大型企业级应用的渐进式重构、多团队并行开发、遗留系统的逐步迁移 如何排除样式文件、图片等资源文件进行单测 单测运行在 node.js 环境中，无法解析 .css、.less、.png 等非 js 资源，需要在 jest 配置中将其 mock 掉： modulenamemapper ：通过正则将资源文件映射到 mock 文件，如 css 映射到 identity obj proxy，图片映射到 filemock.js filemock.js ：导出一个字符串占位即可 identity obj proxy ：一个 npm 包，对 css modules 的 import styles from './a.module.css' 返回一个 proxy 对象，styles.classname 会返回 \"classname\" 字符串，便于快照测试 transform 忽略 ：也可使用自定义 transformer 将资源文件转换为空模块，或在 transformignorepatterns 中配置跳过 jest 有哪些重要配置？ testenvironment ：测试运行环境，'jsdom' 模拟浏览器 dom（适合 react/vue 组件测试），'node' 用于纯 node.js 逻辑测试 transform ：文件转换器配置，如使用 ts jest 处理 typescript，babel jest 处理 jsx/es6+ modulenamemapper ：模块路径映射，用于 mock 资源文件、处理路径别名（如 @/ → src/） setupfiles ：在测试框架安装前执行的脚本，用于设置环境变量等 setupfilesafterframework（setupfilesaftersetup 的别名 setupfiles 之后）/ setupfiles ：在每个测试文件运行前执行，常用于引入 @testing library/jest dom 扩展断言 collectcoverage + coveragethreshold ：开启覆盖率收集，并设置最低覆盖率阈值（如 branches: 80），不达标则 ci 失败 testmatch / testregex ：指定测试文件匹配规则，如 [' / tests / / .test.ts'] modulefileextensions ：模块文件扩展名解析顺序，如 ['ts', 'tsx', 'js', 'jsx', 'json'] transformignorepatterns ：默认忽略 node modules，对于需要转译的 esm 包需手动排除 该如何给自己的项目添加 jest 去测试 react ts 项目 第一步 ：安装依赖（jest、ts jest、@testing library/react、@testing library/jest dom、@testing library/user event、jest environment jsdom、identity obj proxy） 第二步 ：配置 jest.config.ts（testenvironment、transform、modulenamemapper、setupfilesaftersetup） 第三步 ：编写测试（使用 render、screen、userevent 进行组件交互测试） 第四步 ：在 package.json 添加脚本 \"test\": \"jest coverage\" 如何搭建前端测试环境 搭建完整的前端测试环境需要涵盖多个层次： 单元测试 ：jest（测试框架 + 断言库 + mock 能力 + 覆盖率）+ react testing library（组件测试），或 vitest（兼容 jest api，基于 vite 更快） e2e 测试 ：playwright 或 cypress，模拟用户操作验证完整业务流程 覆盖率工具 ：jest 内置 istanbul，通过 coverage 生成覆盖率报告（行覆盖、分支覆盖、函数覆盖），可输出 html/lcov 格式 ci 集成 ：在 github actions / gitlab ci 中配置测试流水线，pr 提交自动运行单测和 e2e，覆盖率报告上传到 codecov / coveralls 等平台 git hooks ：使用 husky + lint staged 在 pre commit 阶段运行受影响文件的单测（jest findrelatedtests），在 pre push 阶段运行完整测试 mock 服务 ：使用 msw（mock service worker）拦截网络请求，在开发和测试环境统一使用同一套 mock 数据 前端单元测试，react 项目为例，该如何做单测选型 推荐组合： jest + react testing library (rtl) jest ：facebook 出品，零配置开箱即用，内置断言（expect）、mock（jest.fn() / jest.mock()）、定时器模拟（jest.usefaketimers()）、快照测试和覆盖率统计，react 社区事实标准 react testing library ：遵循\"测试用户行为而非实现细节\"的理念，提供 render、screen.getbyrole / getbytext 等查询方法，鼓励通过 accessible role 和文本内容查找元素，测试不依赖组件内部状态和实现 @testing library/user event ：模拟真实用户交互（点击、输入、键盘事件），比 fireevent 更贴近浏览器行为 为什么不选 enzyme ：enzyme 侧重于测试组件内部实现（state、instance()），与 react 新特性（hooks、concurrent mode）兼容性差，官方已不积极维护 vitest 替代方案 ：如果项目使用 vite 构建，vitest 兼容 jest api 且利用 vite 的模块解析速度更快，是现代项目的优选 前端 e2e 测试，该如何选型 e2e 测试模拟用户在真实浏览器中的操作，验证完整业务流程。主流方案对比： playwright （推荐）：microsoft 出品，支持 chromium / firefox / webkit 三大引擎，api 简洁且功能强大，支持自动等待、网络拦截、多标签页/多浏览器上下文、移动端模拟、trace 录制回放，并行执行性能优秀，社区活跃度高 cypress ：开发体验极佳，提供 gui 调试界面和时间旅行快照，上手快。但限制较多：运行在单浏览器上下文中、不支持多标签页、跨域场景处理复杂、仅支持 chrome 系和 firefox puppeteer ：google 出品，专注于 chrome/chromium 自动化，api 细粒度控制能力强，适合爬虫和自动化脚本，但不是专为测试设计，缺少断言库和测试组织能力，通常需配合 jest 使用 选型建议 ：新项目首选 playwright（跨浏览器 + 功能全面），已有 cypress 基础设施的团队可继续使用 cypress，仅需 chrome 自动化的轻量场景考虑 puppeteer 如何保障前端项目质量 从开发、测试、部署三个阶段建立质量保障体系： 开发阶段： eslint + prettier ：统一代码风格和最佳实践，配合 husky + lint staged 在提交时自动检查 typescript ：通过静态类型系统在编译阶段捕获类型错误 code review ：pr 必须经过至少一人 review 才能合并，关注业务逻辑、边界处理和性能隐患 测试阶段： 单元测试 ：核心逻辑和工具函数覆盖率 ≥ 80%，关键组件有渲染测试和交互测试 e2e 测试 ：覆盖核心业务流程（如登录、下单、支付），确保用户关键路径可用 可视化回归测试 ：使用 chromatic / percy 等工具对比 ui 截图变化，防止样式意外变更 部署阶段： ci/cd 流水线 ：自动化构建 → 测试 → 部署，测试不通过则阻断部署 灰度发布 ：新版本先推给小比例用户（如 5%），观察监控指标无异常后逐步全量 线上监控 + 告警 ：接入错误监控（sentry）和性能监控，异常时自动告警并支持快速回滚 前端单测，如何通过单测模拟请求 单测中不应发真实网络请求，需要 mock 请求以保证测试的隔离性和稳定性： jest.mock 模块级 mock ：直接 mock 请求库（如 axios），控制返回值 msw（mock service worker） （推荐）：在 service worker 层拦截网络请求，不侵入业务代码，支持 rest 和 graphql nock ：拦截 node.js 层的 http 请求（底层 hook http / https 模块），适合纯 node 环境测试 jest.spyon(global, 'fetch') ：直接 spy 原生 fetch，适合简单场景 jest 单测，如何测试 react 组件交互 使用 react testing library 的 render + screen 查询 + fireevent / userevent 进行交互测试。优先使用 getbyrole / getbylabeltext 等语义化查询；异步场景使用 waitfor 或 findbytext 等待 dom 变化。 userevent 比 fireevent 更真实，会触发完整的事件链（focus → keydown → input → keyup） 异步场景 使用 waitfor 或 findbytext（内部封装 waitfor）等待 dom 变化 查询优先级 ：getbyrole getbylabeltext getbytext getbytestid，尽量使用语义化查询 如何对 react 状态库进行单测，比如 redux、recoil 等状态库 测试状态库需要在测试环境中提供正确的 provider 包裹，并使用 renderhook 测试自定义 hook： redux 测试方案 ：自定义 renderwithproviders 包裹 <provider store={store} ，传入 preloadedstate 控制初始状态，使用 userevent 模拟点击等交互。 自定义 hook / zustand / recoil 测试 ：使用 renderhook 在虚拟组件中运行 hook，act 包裹所有会触发状态更新的操作；recoil 需自定义 wrapper 传入 <recoilroot 。 关键工具 ：renderhook 在虚拟组件中运行 hook，act 包裹所有会触发状态更新的操作 recoil 测试 需要自定义 wrapper，传入 <recoilroot 作为 provider 纯 reducer / selector 测试 ：直接作为普通函数调用即可，无需 provider，属于最简单的纯逻辑测试 单测中，如果有一些三方依赖，想排除这个三方依赖进行测试，该如何做？ 排除三方依赖的目的是保证单测只关注被测模块自身的逻辑，避免三方库的副作用影响测试： jest.mock('模块名') ：将整个三方模块替换为自动 mock，所有导出变为 jest.fn()，可通过 mockresolvedvalue 控制返回值 手动 mock（ mocks 目录） ：在项目根目录或模块同级创建 mocks /模块名.js，jest 会自动使用该文件替代真实模块，适合需要提供固定返回值的场景 modulenamemapper ：在 jest.config.js 中将三方模块映射到 mock 文件，适合全局统一处理 jest.mock + 工厂函数 ：部分 mock，保留模块中需要的部分方法，如 jest.requireactual 配合工厂函数 jest.spyon ：不替换整个模块，仅拦截特定方法，测试结束后自动恢复"
  },
  {
    "slug": "020-性能优化及监控",
    "title": "性能优化及监控",
    "category": "工程化",
    "sourcePath": "docs/工程化/性能优化及监控.md",
    "markdown": "# 性能优化及监控\n\n## 前端页面崩溃监控\n\n页面崩溃（Tab Crash）发生时，页面内的 JavaScript 已无法执行，因此 `window.onerror` 等常规手段无法捕获崩溃事件。常用方案：\n\n- **Service Worker 心跳检测**：页面启动后通过 `setInterval` 定时向 Service Worker 发送心跳消息（如每 5 秒一次）。Service Worker 维护每个客户端的最后心跳时间，若超过阈值（如 15 秒）未收到心跳且该客户端已不在 `clients.matchAll()` 结果中，则判定页面崩溃，通过 `fetch` 向监控服务上报\n- **`beforeunload` + `sessionStorage` 标记法**：页面加载时在 `sessionStorage` 写入 `page_alive = true`，在 `beforeunload` 事件中将其设为 `false`。下次用户打开页面时若检测到 `page_alive === true`，说明上次未正常卸载，可能发生了崩溃\n- **Web Worker 备选方案**：与 Service Worker 思路类似，利用独立线程检测主线程是否存活，但无法在页面完全销毁后继续运行，适用于检测主线程卡死（非完全崩溃）的场景\n\n## 前端错误监控\n\n前端错误分为 JS 运行时错误、资源加载错误和异步错误，需要多种手段组合覆盖：\n\n- **`window.onerror`**：捕获同步和异步的 JS 运行时错误，回调参数包含 `message`、`source`、`lineno`、`colno`、`error` 对象。注意：无法捕获资源加载错误和 Promise 拒绝\n- **`window.addEventListener('error', fn, true)`**：在捕获阶段监听，可以拦截 `<img>`、`<script>`、`<link>` 等资源加载失败事件（通过 `event.target.tagName` 区分是否为资源错误）\n- **`window.addEventListener('unhandledrejection', fn)`**：捕获未被 `.catch()` 处理的 Promise 拒绝错误，通过 `event.reason` 获取错误信息\n- **框架错误边界**：React 的 `componentDidCatch` / `ErrorBoundary` 组件捕获渲染阶段错误；Vue 的 `app.config.errorHandler` 全局捕获组件错误\n- **跨域脚本错误**：第三方脚本错误默认只显示 `Script error.`，需在 `<script>` 标签添加 `crossorigin=\"anonymous\"` 并在服务端配置 `Access-Control-Allow-Origin` 响应头\n\n## 前端常见性能优化手段\n\n从资源、渲染、网络三个维度进行优化：\n\n**资源优化：**\n\n- 代码压缩（Terser / CSS Minify）、Tree Shaking 移除无用代码\n- 图片优化：使用 WebP/AVIF 格式、根据屏幕尺寸加载合适尺寸（`srcset`）、小图使用 Base64 内联或 SVG Sprite\n- 静态资源上 CDN，利用内容哈希实现长缓存（`Cache-Control: max-age=31536000`）\n- 路由级代码分割（`React.lazy` / 动态 `import()`），按需加载\n\n**渲染优化：**\n\n- 大列表使用虚拟滚动（仅渲染可视区域 DOM），减少节点数量\n- 频繁触发的事件（`scroll`、`resize`、`input`）使用防抖 / 节流\n- 减少重排重绘：批量修改 DOM、使用 `transform` 代替 `top/left` 做动画、利用 `will-change` 提示 GPU 加速\n- 使用 `requestAnimationFrame` 做动画，避免 `setTimeout` 导致的帧丢失\n\n**网络优化：**\n\n- 关键资源 `<link rel=\"preload\">`，后续页面资源 `<link rel=\"prefetch\">`\n- 开启 HTTP/2 多路复用，减少连接开销；使用 Brotli / Gzip 压缩传输\n- 接口数据合理使用缓存策略（ETag / Last-Modified / `stale-while-revalidate`）\n- DNS 预解析 `<link rel=\"dns-prefetch\">`，减少 DNS 查找时间\n\n## 大数据量渲染优化\n\n当需要展示成千上万条数据时，直接渲染全部 DOM 会导致页面卡顿甚至崩溃，核心方案：\n\n- **虚拟滚动（Virtual Scroll）**：只渲染可视区域内的列表项，通过监听滚动位置动态计算 `startIndex` 和 `endIndex`，用 `transform: translateY()` 或 padding 撑开容器高度。常用库：`react-virtualized`、`react-window`、`vue-virtual-scroller`\n- **时间分片（Time Slicing）**：将大量 DOM 操作分成多个小任务，利用 `requestAnimationFrame` 或 `requestIdleCallback` 在每一帧中只渲染一部分，避免长时间阻塞主线程\n- **Web Worker 离线计算**：将数据排序、过滤、聚合等计算密集型任务放到 Web Worker 中执行，主线程只负责渲染最终结果，避免计算阻塞 UI\n- **增量渲染 + 分页 / 无限滚动**：结合后端分页接口，前端只请求和渲染当前需要的数据，滚动到底部时加载下一页\n- **Canvas 渲染**：对于超大规模表格或图表场景，使用 Canvas 替代 DOM 渲染，绕过 DOM 节点数瓶颈\n\n## 请求接口大规模并发\n\n当页面需要同时发起大量请求（如批量上传、批量查询）时，需要控制并发防止浏览器和服务器过载：\n\n- **并发控制（Promise 池）**：维护一个最大并发数（如 `limit = 6`）的请求池，每完成一个请求就从队列中取出下一个执行。\n- **请求合并（Batching）**：在一个时间窗口内（如 50ms）收集多个相似请求，合并为一个批量请求发送给后端，减少请求总数。DataLoader 模式即采用此方案\n- **请求队列 + 优先级**：按业务重要性对请求排优先级，保证关键请求（如用户操作触发的）优先执行，后台任务（如预加载、埋点上报）延后执行\n- **`AbortController` 取消过期请求**：当用户快速操作产生大量请求时，使用 `AbortController` 取消已不需要的请求，释放并发额度\n\n## 静态资源加载失败场景降级\n\n生产环境中 CDN 节点故障、网络抖动等都可能导致静态资源加载失败，需要做好降级策略：\n\n- **备用 CDN 切换**：`<script>` 加载失败后，通过 `onerror` 回调动态创建新的 `<script>` 标签，`src` 指向备用 CDN 地址。例如 `<script src=\"https://cdn1.example.com/lib.js\" onerror=\"loadFallback(this)\">`\n- **自动重试机制**：资源加载失败后自动重试 1-2 次，可加入退避策略（如间隔 1s、2s 重试）。通过全局 `addEventListener('error', fn, true)` 在捕获阶段监听资源错误并触发重试\n- **占位 / 兜底方案**：图片加载失败使用默认占位图（`<img onerror=\"this.src='fallback.png'\">`）；CSS 加载失败时确保页面有内联的基础样式不至于完全不可用；JS 加载失败时展示友好的降级提示\n- **资源指纹校验**：使用 `integrity` 属性（SRI，Subresource Integrity）验证资源完整性，防止 CDN 返回被篡改或截断的文件\n- **Service Worker 离线缓存**：通过 Service Worker 的 Cache API 缓存关键静态资源，网络不可用时从本地缓存加载\n\n## SPA 首屏加载速度慢\n\nSPA 需要下载完整 JS Bundle 后才能渲染内容，导致白屏时间长。优化方向：\n\n- **路由懒加载**：使用动态 `import()` + `React.lazy` 或 Vue 的异步组件，仅加载当前路由所需代码，显著减少首屏 Bundle 体积\n- **SSR（服务端渲染）**：使用 Next.js / Nuxt.js 等框架在服务端生成完整 HTML，浏览器直接展示内容后再进行 hydration，大幅减少首屏白屏时间\n- **预渲染（Prerender）**：构建阶段对固定路由生成静态 HTML（如使用 `prerender-spa-plugin`），适用于内容不频繁变化的页面\n- **骨架屏（Skeleton Screen）**：在 JS 加载和数据请求完成前先展示页面结构的灰色占位块，提升用户感知体验\n- **代码分割 + 按需加载**：通过 Webpack/Vite 的 `splitChunks` 将第三方库单独打包，利用浏览器缓存；使用 `<link rel=\"preload\">` 预加载关键 chunk\n- **减少首屏接口依赖**：首屏只请求必要数据，非关键数据延迟加载；接口支持 BFF 层聚合，减少请求数量\n- **内联关键 CSS**：将首屏渲染所需的关键 CSS 内联到 HTML 的 `<style>` 标签中，避免额外的 CSS 请求阻塞渲染\n\n## 设计一套统计全站请求耗时的工具\n\n利用浏览器提供的 Performance API 采集请求耗时数据，核心设计：\n\n- **Resource Timing API**：通过 `performance.getEntriesByType('resource')` 获取所有资源请求的详细时间线，关键指标包括 `duration`（总耗时）、`responseEnd - requestStart`（服务端处理 + 传输时间）、`connectEnd - connectStart`（TCP 连接耗时）等\n- **自定义 `fetch` / `XMLHttpRequest` 拦截**：通过 monkey-patch 或请求库拦截器（如 Axios interceptors）记录每个接口的请求开始时间和结束时间，补充业务维度信息（接口名称、状态码、是否超时等）\n- **数据聚合与上报**：采集的数据按接口分组统计 P50/P90/P99 耗时，使用 `navigator.sendBeacon` 在页面卸载前可靠上报到监控后端，避免阻塞页面关闭\n\n## 设计一套前端监控系统，考虑哪些模块，如何实现\n\n一套完整的前端监控系统包含以下核心模块：\n\n**错误监控：**\n\n- JS 运行时错误（`window.onerror` + `unhandledrejection`）、资源加载错误（捕获阶段 `error` 事件）、接口异常（HTTP 状态码非 2xx、超时）\n- 错误去重（相同错误按 `message + stack` 聚合）和采样率控制\n\n**性能监控：**\n\n- 页面加载性能：`FCP`、`LCP`、`FID`、`CLS`、`TTFB` 等 Web Vitals 指标，通过 `PerformanceObserver` 采集\n- 接口性能：请求耗时、成功率、慢查询统计\n- 长任务监控：`PerformanceObserver` 监听 `longtask`，发现阻塞主线程超过 50ms 的任务\n\n**行为监控：**\n\n- PV/UV 统计、页面停留时长、用户行为路径记录\n- 操作录制（如接入 `rrweb`）用于错误场景回放\n\n**上报策略：**\n\n- 使用 `navigator.sendBeacon` 保证页面卸载时数据不丢失\n- 非紧急数据合并批量上报（如积攒 10 条或每隔 10 秒上报一次），减少请求数\n- 错误数据优先上报，性能 / 行为数据可延迟上报\n- 控制采样率（如仅采集 10% 用户的性能数据）降低服务端压力\n\n## 如何处理大规模的数据渲染和计算\n\n前端处理大规模数据需从渲染和计算两方面分别优化：\n\n**渲染层面：**\n\n- **虚拟列表**：只渲染可视区域的 DOM 节点，典型库如 `react-window`，将万级列表的 DOM 数量控制在几十个\n- **分片渲染**：使用 `requestIdleCallback` 或 `requestAnimationFrame` 将大量 DOM 操作拆分到多帧执行，每帧只处理一小批数据，保证页面不卡顿\n- **Canvas / WebGL 渲染**：对于超大规模可视化（如万级节点的图表），使用 Canvas 或 WebGL 替代 DOM 渲染\n\n**计算层面：**\n\n- **Web Worker**：将数据过滤、排序、聚合等 CPU 密集型任务放入 Worker 线程，避免阻塞 UI。通过 `postMessage` 传递数据，对于大数据可使用 `Transferable Objects` 实现零拷贝传输\n- **WASM（WebAssembly）**：对于极端计算密集场景（如加密、图像处理），可引入 WASM 模块获得接近原生的性能\n- **增量计算 + 缓存**：对于重复计算的场景使用 `useMemo` / memoization 缓存结果，数据变更时只重新计算变化的部分\n\n## 统计 Long Task\n\nLong Task 是指执行时间超过 50ms 的任务，会阻塞主线程导致页面卡顿。使用 `PerformanceObserver` 监听 `longtask` 类型。\n\n- `duration` 表示任务执行时长，超过 50ms 即被记录\n- `attribution` 数组包含 `containerType`、`containerSrc` 等属性，帮助定位长任务来源（主文档还是某个 iframe/脚本）\n- 典型应用场景：统计页面在交互阶段的长任务数量和总阻塞时间（TBT），结合 `FID` 指标评估页面交互响应性\n- 注意：`buffered: true` 可获取 Observer 注册前已发生的 Long Task，避免遗漏页面初始化阶段的长任务\n\n## PerformanceObserver 使用\n\n`PerformanceObserver` 是浏览器提供的异步性能条目监听 API，用于高效获取各类性能数据：\n\n**常见 Entry Type：**\n\n- `navigation`：页面导航性能（`domContentLoadedEventEnd`、`loadEventEnd` 等）\n- `resource`：资源加载详情（`initiatorType`、`transferSize`、`duration`）\n- `paint`：`first-paint`、`first-contentful-paint`\n- `largest-contentful-paint`：最大内容绘制（LCP）\n- `first-input`：首次输入延迟（FID）\n- `layout-shift`：累计布局偏移（CLS）\n- `longtask`：执行超过 50ms 的长任务\n- `measure` / `mark`：自定义 `performance.mark()` 和 `performance.measure()` 的条目\n\n**注意事项：**\n\n- `buffered: true` 获取 Observer 创建前已产生的条目，适合在 SDK 异步加载后补获历史数据\n- 部分类型（如 `longtask`、`largest-contentful-paint`）需要在独立的 `observe()` 调用中监听，不能与其他类型合并\n- 调用 `observer.disconnect()` 停止监听，释放资源\n\n## 前端高并发页面渲染与状态管理（例如微信红包）\n\n类似微信红包等高并发实时场景，核心挑战是短时间内大量数据推送导致频繁渲染和状态更新：\n\n- **批量更新（Batching）**：将高频推送的数据在一个缓冲区中积攒（如每 100ms 合并一次），统一触发一次 UI 更新，避免每条消息都触发 re-render。React 18 的 `automatic batching` 天然支持此能力\n- **不可变数据 + 浅比较**：使用 `Immer` 等库维护不可变状态，配合 `React.memo` / `shouldComponentUpdate` 通过浅比较跳过不必要的渲染\n- **分层状态管理**：将高频变化的临时状态（如红包动画、实时计数）与稳定的业务状态（如用户信息、红包列表）分离，放在不同的 store 或 context 中，避免高频状态更新导致无关组件重新渲染\n- **`requestAnimationFrame` 节流渲染**：将 WebSocket 推送的数据写入缓冲区，每帧（16ms）只从缓冲区取一次数据更新 UI，保证动画流畅\n- **离屏 / 分优先级渲染**：可视区域外的内容延迟渲染，优先保证用户可见区域的更新性能\n\n## 前端复杂异步操作的状态一致性保障\n\n当多个异步操作并行执行或用户快速操作时，容易出现状态不一致（如搜索结果错乱、表单重复提交），需要以下保障措施：\n\n- **竞态处理（Race Condition）**：每次发起请求时生成一个唯一版本号（递增计数器或 `Symbol`），响应回来后对比版本号，只有最新版本的响应才更新状态，丢弃过期响应\n- **`AbortController` 取消请求**：发起新请求前，调用上一次请求的 `controller.abort()` 取消旧请求，从根本上避免旧数据覆盖新数据\n- **乐观更新 + 回滚**：先更新 UI 状态提升用户体验，若后端请求失败则回滚到之前的状态并提示用户。React Query / SWR 等库内置此能力\n- **请求去重 / 锁**：对同一接口的重复请求做去重处理，或使用 loading 锁（按钮 disable）防止用户重复提交\n- **状态机管理**：使用 `XState` 等状态机库显式定义异步操作的各个阶段（`idle` → `loading` → `success` / `error`），避免出现非法状态转换\n\n## 多个请求只弹出一个 Toast 表示请求失败\n\n当页面同时发出多个请求且多个请求都失败时，不应弹出多个 Toast，而应合并为一个提示：\n\n- **请求计数器方案**：维护一个全局的 pending 计数和 error 标记。每发起一个请求 `pending++`，请求完成 `pending--`，失败时设 `hasError = true`。当 `pending === 0` 时若 `hasError` 为 true 则弹出一次 Toast，然后重置标记\n- **防抖合并方案**：对错误 Toast 的展示做防抖处理（如 300ms），多个错误在时间窗口内只触发一次 Toast\n- **全局拦截器方案**：在 Axios 的响应拦截器中统一处理，维护一个错误队列，使用 `setTimeout` 合并同一事件循环内的所有错误再展示一次 Toast\n- 注意区分不同类型的错误（网络错误 vs 业务错误），网络错误可合并为一个 Toast，业务错误可能需要分别提示\n\n## 浏览器为什么要请求并发数限制\n\n浏览器对同一域名的 HTTP 并发请求数有限制（Chrome 下 HTTP/1.1 为 6 个），原因如下：\n\n- **TCP 连接成本高**：每个 HTTP/1.1 请求需要一个独立 TCP 连接，建立连接涉及三次握手（HTTPS 还需 TLS 握手），大量连接会消耗客户端和服务器的内存、CPU 资源和端口号\n- **保护服务器**：如果浏览器不限制并发，一个页面可能同时发起上百个请求，对服务器造成类似 DDoS 的压力，影响服务稳定性和其他用户的访问\n- **HTTP/1.1 的队头阻塞**：HTTP/1.1 在一个连接上只能串行处理请求（虽然有 pipeline 但实际几乎没有浏览器实现），过多连接反而会互相抢占带宽，降低整体加载效率\n- **操作系统资源限制**：每个 TCP 连接占用文件描述符和内存，操作系统对进程的文件描述符数量有限制，浏览器需要合理分配\n- **HTTP/2 的改进**：HTTP/2 采用多路复用（Multiplexing），在一个 TCP 连接上可以并发传输多个请求 / 响应，因此浏览器对 HTTP/2 同域名的并发限制大幅放宽。这也是现代网站推荐使用 HTTP/2 的原因之一\n",
    "headings": [
      {
        "depth": 1,
        "text": "性能优化及监控",
        "slug": "性能优化及监控"
      },
      {
        "depth": 2,
        "text": "前端页面崩溃监控",
        "slug": "前端页面崩溃监控"
      },
      {
        "depth": 2,
        "text": "前端错误监控",
        "slug": "前端错误监控"
      },
      {
        "depth": 2,
        "text": "前端常见性能优化手段",
        "slug": "前端常见性能优化手段"
      },
      {
        "depth": 2,
        "text": "大数据量渲染优化",
        "slug": "大数据量渲染优化"
      },
      {
        "depth": 2,
        "text": "请求接口大规模并发",
        "slug": "请求接口大规模并发"
      },
      {
        "depth": 2,
        "text": "静态资源加载失败场景降级",
        "slug": "静态资源加载失败场景降级"
      },
      {
        "depth": 2,
        "text": "SPA 首屏加载速度慢",
        "slug": "spa-首屏加载速度慢"
      },
      {
        "depth": 2,
        "text": "设计一套统计全站请求耗时的工具",
        "slug": "设计一套统计全站请求耗时的工具"
      },
      {
        "depth": 2,
        "text": "设计一套前端监控系统，考虑哪些模块，如何实现",
        "slug": "设计一套前端监控系统考虑哪些模块如何实现"
      },
      {
        "depth": 2,
        "text": "如何处理大规模的数据渲染和计算",
        "slug": "如何处理大规模的数据渲染和计算"
      },
      {
        "depth": 2,
        "text": "统计 Long Task",
        "slug": "统计-long-task"
      },
      {
        "depth": 2,
        "text": "PerformanceObserver 使用",
        "slug": "performanceobserver-使用"
      },
      {
        "depth": 2,
        "text": "前端高并发页面渲染与状态管理（例如微信红包）",
        "slug": "前端高并发页面渲染与状态管理例如微信红包"
      },
      {
        "depth": 2,
        "text": "前端复杂异步操作的状态一致性保障",
        "slug": "前端复杂异步操作的状态一致性保障"
      },
      {
        "depth": 2,
        "text": "多个请求只弹出一个 Toast 表示请求失败",
        "slug": "多个请求只弹出一个-toast-表示请求失败"
      },
      {
        "depth": 2,
        "text": "浏览器为什么要请求并发数限制",
        "slug": "浏览器为什么要请求并发数限制"
      }
    ],
    "searchText": "性能优化及监控 工程化 性能优化及监控 前端页面崩溃监控 页面崩溃（tab crash）发生时，页面内的 javascript 已无法执行，因此 window.onerror 等常规手段无法捕获崩溃事件。常用方案： service worker 心跳检测 ：页面启动后通过 setinterval 定时向 service worker 发送心跳消息（如每 5 秒一次）。service worker 维护每个客户端的最后心跳时间，若超过阈值（如 15 秒）未收到心跳且该客户端已不在 clients.matchall() 结果中，则判定页面崩溃，通过 fetch 向监控服务上报 beforeunload + sessionstorage 标记法 ：页面加载时在 sessionstorage 写入 page alive = true，在 beforeunload 事件中将其设为 false。下次用户打开页面时若检测到 page alive === true，说明上次未正常卸载，可能发生了崩溃 web worker 备选方案 ：与 service worker 思路类似，利用独立线程检测主线程是否存活，但无法在页面完全销毁后继续运行，适用于检测主线程卡死（非完全崩溃）的场景 前端错误监控 前端错误分为 js 运行时错误、资源加载错误和异步错误，需要多种手段组合覆盖： window.onerror ：捕获同步和异步的 js 运行时错误，回调参数包含 message、source、lineno、colno、error 对象。注意：无法捕获资源加载错误和 promise 拒绝 window.addeventlistener('error', fn, true) ：在捕获阶段监听，可以拦截 <img 、<script 、<link 等资源加载失败事件（通过 event.target.tagname 区分是否为资源错误） window.addeventlistener('unhandledrejection', fn) ：捕获未被 .catch() 处理的 promise 拒绝错误，通过 event.reason 获取错误信息 框架错误边界 ：react 的 componentdidcatch / errorboundary 组件捕获渲染阶段错误；vue 的 app.config.errorhandler 全局捕获组件错误 跨域脚本错误 ：第三方脚本错误默认只显示 script error.，需在 <script 标签添加 crossorigin=\"anonymous\" 并在服务端配置 access control allow origin 响应头 前端常见性能优化手段 从资源、渲染、网络三个维度进行优化： 资源优化： 代码压缩（terser / css minify）、tree shaking 移除无用代码 图片优化：使用 webp/avif 格式、根据屏幕尺寸加载合适尺寸（srcset）、小图使用 base64 内联或 svg sprite 静态资源上 cdn，利用内容哈希实现长缓存（cache control: max age=31536000） 路由级代码分割（react.lazy / 动态 import()），按需加载 渲染优化： 大列表使用虚拟滚动（仅渲染可视区域 dom），减少节点数量 频繁触发的事件（scroll、resize、input）使用防抖 / 节流 减少重排重绘：批量修改 dom、使用 transform 代替 top/left 做动画、利用 will change 提示 gpu 加速 使用 requestanimationframe 做动画，避免 settimeout 导致的帧丢失 网络优化： 关键资源 <link rel=\"preload\" ，后续页面资源 <link rel=\"prefetch\" 开启 http/2 多路复用，减少连接开销；使用 brotli / gzip 压缩传输 接口数据合理使用缓存策略（etag / last modified / stale while revalidate） dns 预解析 <link rel=\"dns prefetch\" ，减少 dns 查找时间 大数据量渲染优化 当需要展示成千上万条数据时，直接渲染全部 dom 会导致页面卡顿甚至崩溃，核心方案： 虚拟滚动（virtual scroll） ：只渲染可视区域内的列表项，通过监听滚动位置动态计算 startindex 和 endindex，用 transform: translatey() 或 padding 撑开容器高度。常用库：react virtualized、react window、vue virtual scroller 时间分片（time slicing） ：将大量 dom 操作分成多个小任务，利用 requestanimationframe 或 requestidlecallback 在每一帧中只渲染一部分，避免长时间阻塞主线程 web worker 离线计算 ：将数据排序、过滤、聚合等计算密集型任务放到 web worker 中执行，主线程只负责渲染最终结果，避免计算阻塞 ui 增量渲染 + 分页 / 无限滚动 ：结合后端分页接口，前端只请求和渲染当前需要的数据，滚动到底部时加载下一页 canvas 渲染 ：对于超大规模表格或图表场景，使用 canvas 替代 dom 渲染，绕过 dom 节点数瓶颈 请求接口大规模并发 当页面需要同时发起大量请求（如批量上传、批量查询）时，需要控制并发防止浏览器和服务器过载： 并发控制（promise 池） ：维护一个最大并发数（如 limit = 6）的请求池，每完成一个请求就从队列中取出下一个执行。 请求合并（batching） ：在一个时间窗口内（如 50ms）收集多个相似请求，合并为一个批量请求发送给后端，减少请求总数。dataloader 模式即采用此方案 请求队列 + 优先级 ：按业务重要性对请求排优先级，保证关键请求（如用户操作触发的）优先执行，后台任务（如预加载、埋点上报）延后执行 abortcontroller 取消过期请求 ：当用户快速操作产生大量请求时，使用 abortcontroller 取消已不需要的请求，释放并发额度 静态资源加载失败场景降级 生产环境中 cdn 节点故障、网络抖动等都可能导致静态资源加载失败，需要做好降级策略： 备用 cdn 切换 ：<script 加载失败后，通过 onerror 回调动态创建新的 <script 标签，src 指向备用 cdn 地址。例如 <script src=\"https://cdn1.example.com/lib.js\" onerror=\"loadfallback(this)\" 自动重试机制 ：资源加载失败后自动重试 1 2 次，可加入退避策略（如间隔 1s、2s 重试）。通过全局 addeventlistener('error', fn, true) 在捕获阶段监听资源错误并触发重试 占位 / 兜底方案 ：图片加载失败使用默认占位图（<img onerror=\"this.src='fallback.png'\" ）；css 加载失败时确保页面有内联的基础样式不至于完全不可用；js 加载失败时展示友好的降级提示 资源指纹校验 ：使用 integrity 属性（sri，subresource integrity）验证资源完整性，防止 cdn 返回被篡改或截断的文件 service worker 离线缓存 ：通过 service worker 的 cache api 缓存关键静态资源，网络不可用时从本地缓存加载 spa 首屏加载速度慢 spa 需要下载完整 js bundle 后才能渲染内容，导致白屏时间长。优化方向： 路由懒加载 ：使用动态 import() + react.lazy 或 vue 的异步组件，仅加载当前路由所需代码，显著减少首屏 bundle 体积 ssr（服务端渲染） ：使用 next.js / nuxt.js 等框架在服务端生成完整 html，浏览器直接展示内容后再进行 hydration，大幅减少首屏白屏时间 预渲染（prerender） ：构建阶段对固定路由生成静态 html（如使用 prerender spa plugin），适用于内容不频繁变化的页面 骨架屏（skeleton screen） ：在 js 加载和数据请求完成前先展示页面结构的灰色占位块，提升用户感知体验 代码分割 + 按需加载 ：通过 webpack/vite 的 splitchunks 将第三方库单独打包，利用浏览器缓存；使用 <link rel=\"preload\" 预加载关键 chunk 减少首屏接口依赖 ：首屏只请求必要数据，非关键数据延迟加载；接口支持 bff 层聚合，减少请求数量 内联关键 css ：将首屏渲染所需的关键 css 内联到 html 的 <style 标签中，避免额外的 css 请求阻塞渲染 设计一套统计全站请求耗时的工具 利用浏览器提供的 performance api 采集请求耗时数据，核心设计： resource timing api ：通过 performance.getentriesbytype('resource') 获取所有资源请求的详细时间线，关键指标包括 duration（总耗时）、responseend requeststart（服务端处理 + 传输时间）、connectend connectstart（tcp 连接耗时）等 自定义 fetch / xmlhttprequest 拦截 ：通过 monkey patch 或请求库拦截器（如 axios interceptors）记录每个接口的请求开始时间和结束时间，补充业务维度信息（接口名称、状态码、是否超时等） 数据聚合与上报 ：采集的数据按接口分组统计 p50/p90/p99 耗时，使用 navigator.sendbeacon 在页面卸载前可靠上报到监控后端，避免阻塞页面关闭 设计一套前端监控系统，考虑哪些模块，如何实现 一套完整的前端监控系统包含以下核心模块： 错误监控： js 运行时错误（window.onerror + unhandledrejection）、资源加载错误（捕获阶段 error 事件）、接口异常（http 状态码非 2xx、超时） 错误去重（相同错误按 message + stack 聚合）和采样率控制 性能监控： 页面加载性能：fcp、lcp、fid、cls、ttfb 等 web vitals 指标，通过 performanceobserver 采集 接口性能：请求耗时、成功率、慢查询统计 长任务监控：performanceobserver 监听 longtask，发现阻塞主线程超过 50ms 的任务 行为监控： pv/uv 统计、页面停留时长、用户行为路径记录 操作录制（如接入 rrweb）用于错误场景回放 上报策略： 使用 navigator.sendbeacon 保证页面卸载时数据不丢失 非紧急数据合并批量上报（如积攒 10 条或每隔 10 秒上报一次），减少请求数 错误数据优先上报，性能 / 行为数据可延迟上报 控制采样率（如仅采集 10% 用户的性能数据）降低服务端压力 如何处理大规模的数据渲染和计算 前端处理大规模数据需从渲染和计算两方面分别优化： 渲染层面： 虚拟列表 ：只渲染可视区域的 dom 节点，典型库如 react window，将万级列表的 dom 数量控制在几十个 分片渲染 ：使用 requestidlecallback 或 requestanimationframe 将大量 dom 操作拆分到多帧执行，每帧只处理一小批数据，保证页面不卡顿 canvas / webgl 渲染 ：对于超大规模可视化（如万级节点的图表），使用 canvas 或 webgl 替代 dom 渲染 计算层面： web worker ：将数据过滤、排序、聚合等 cpu 密集型任务放入 worker 线程，避免阻塞 ui。通过 postmessage 传递数据，对于大数据可使用 transferable objects 实现零拷贝传输 wasm（webassembly） ：对于极端计算密集场景（如加密、图像处理），可引入 wasm 模块获得接近原生的性能 增量计算 + 缓存 ：对于重复计算的场景使用 usememo / memoization 缓存结果，数据变更时只重新计算变化的部分 统计 long task long task 是指执行时间超过 50ms 的任务，会阻塞主线程导致页面卡顿。使用 performanceobserver 监听 longtask 类型。 duration 表示任务执行时长，超过 50ms 即被记录 attribution 数组包含 containertype、containersrc 等属性，帮助定位长任务来源（主文档还是某个 iframe/脚本） 典型应用场景：统计页面在交互阶段的长任务数量和总阻塞时间（tbt），结合 fid 指标评估页面交互响应性 注意：buffered: true 可获取 observer 注册前已发生的 long task，避免遗漏页面初始化阶段的长任务 performanceobserver 使用 performanceobserver 是浏览器提供的异步性能条目监听 api，用于高效获取各类性能数据： 常见 entry type： navigation：页面导航性能（domcontentloadedeventend、loadeventend 等） resource：资源加载详情（initiatortype、transfersize、duration） paint：first paint、first contentful paint largest contentful paint：最大内容绘制（lcp） first input：首次输入延迟（fid） layout shift：累计布局偏移（cls） longtask：执行超过 50ms 的长任务 measure / mark：自定义 performance.mark() 和 performance.measure() 的条目 注意事项： buffered: true 获取 observer 创建前已产生的条目，适合在 sdk 异步加载后补获历史数据 部分类型（如 longtask、largest contentful paint）需要在独立的 observe() 调用中监听，不能与其他类型合并 调用 observer.disconnect() 停止监听，释放资源 前端高并发页面渲染与状态管理（例如微信红包） 类似微信红包等高并发实时场景，核心挑战是短时间内大量数据推送导致频繁渲染和状态更新： 批量更新（batching） ：将高频推送的数据在一个缓冲区中积攒（如每 100ms 合并一次），统一触发一次 ui 更新，避免每条消息都触发 re render。react 18 的 automatic batching 天然支持此能力 不可变数据 + 浅比较 ：使用 immer 等库维护不可变状态，配合 react.memo / shouldcomponentupdate 通过浅比较跳过不必要的渲染 分层状态管理 ：将高频变化的临时状态（如红包动画、实时计数）与稳定的业务状态（如用户信息、红包列表）分离，放在不同的 store 或 context 中，避免高频状态更新导致无关组件重新渲染 requestanimationframe 节流渲染 ：将 websocket 推送的数据写入缓冲区，每帧（16ms）只从缓冲区取一次数据更新 ui，保证动画流畅 离屏 / 分优先级渲染 ：可视区域外的内容延迟渲染，优先保证用户可见区域的更新性能 前端复杂异步操作的状态一致性保障 当多个异步操作并行执行或用户快速操作时，容易出现状态不一致（如搜索结果错乱、表单重复提交），需要以下保障措施： 竞态处理（race condition） ：每次发起请求时生成一个唯一版本号（递增计数器或 symbol），响应回来后对比版本号，只有最新版本的响应才更新状态，丢弃过期响应 abortcontroller 取消请求 ：发起新请求前，调用上一次请求的 controller.abort() 取消旧请求，从根本上避免旧数据覆盖新数据 乐观更新 + 回滚 ：先更新 ui 状态提升用户体验，若后端请求失败则回滚到之前的状态并提示用户。react query / swr 等库内置此能力 请求去重 / 锁 ：对同一接口的重复请求做去重处理，或使用 loading 锁（按钮 disable）防止用户重复提交 状态机管理 ：使用 xstate 等状态机库显式定义异步操作的各个阶段（idle → loading → success / error），避免出现非法状态转换 多个请求只弹出一个 toast 表示请求失败 当页面同时发出多个请求且多个请求都失败时，不应弹出多个 toast，而应合并为一个提示： 请求计数器方案 ：维护一个全局的 pending 计数和 error 标记。每发起一个请求 pending++，请求完成 pending ，失败时设 haserror = true。当 pending === 0 时若 haserror 为 true 则弹出一次 toast，然后重置标记 防抖合并方案 ：对错误 toast 的展示做防抖处理（如 300ms），多个错误在时间窗口内只触发一次 toast 全局拦截器方案 ：在 axios 的响应拦截器中统一处理，维护一个错误队列，使用 settimeout 合并同一事件循环内的所有错误再展示一次 toast 注意区分不同类型的错误（网络错误 vs 业务错误），网络错误可合并为一个 toast，业务错误可能需要分别提示 浏览器为什么要请求并发数限制 浏览器对同一域名的 http 并发请求数有限制（chrome 下 http/1.1 为 6 个），原因如下： tcp 连接成本高 ：每个 http/1.1 请求需要一个独立 tcp 连接，建立连接涉及三次握手（https 还需 tls 握手），大量连接会消耗客户端和服务器的内存、cpu 资源和端口号 保护服务器 ：如果浏览器不限制并发，一个页面可能同时发起上百个请求，对服务器造成类似 ddos 的压力，影响服务稳定性和其他用户的访问 http/1.1 的队头阻塞 ：http/1.1 在一个连接上只能串行处理请求（虽然有 pipeline 但实际几乎没有浏览器实现），过多连接反而会互相抢占带宽，降低整体加载效率 操作系统资源限制 ：每个 tcp 连接占用文件描述符和内存，操作系统对进程的文件描述符数量有限制，浏览器需要合理分配 http/2 的改进 ：http/2 采用多路复用（multiplexing），在一个 tcp 连接上可以并发传输多个请求 / 响应，因此浏览器对 http/2 同域名的并发限制大幅放宽。这也是现代网站推荐使用 http/2 的原因之一"
  },
  {
    "slug": "021-刷题记录",
    "title": "刷题记录",
    "category": "算法",
    "sourcePath": "docs/算法/刷题记录.md",
    "markdown": "# 刷题记录\n\n## 滑动窗口\n\n### 定长滑动窗口\n\n**基础：**\n\n- 定长子串中元音的最大数目\n- 子数组最大平均数 I\n- 大小为 K 且平均值大于等于阈值的子数组数目\n- 半径为 k 的子数组平均值\n- 得到 K 个黑块的最少涂色次数\n- 几乎唯一子数组的最大和\n- 长度为 K 子数组中的最大和\n- 可获得的最大点数\n\n### 不定长滑动窗口\n\n#### 越短越合法/求最长/最大\n\n**基础：**\n\n- 无重复字符的最长子串\n- 每个字符最多出现两次的最长子字符串\n- 删掉一个元素以后全为 1 的最长子数组\n- 使数组平衡的最少移除数目\n- 尽可能使字符串相等\n- 水果成篮\n- 删除子数组的最大得分\n- 最多 K 个重复元素的最长子数组\n- 考试的最大困扰度\n- 最大连续 1 的个数 III\n\n#### 越长越合法/求最短/最小\n\n- 长度最小的子数组\n- 不同元素和至少为 K 的最短子数组长度\n- 最短且字典序最小的美丽子字符串\n- 替换子串得到平衡字符串\n- 无限数组的最短子数组\n- 最小覆盖子串\n- 最小区间\n",
    "headings": [
      {
        "depth": 1,
        "text": "刷题记录",
        "slug": "刷题记录"
      },
      {
        "depth": 2,
        "text": "滑动窗口",
        "slug": "滑动窗口"
      },
      {
        "depth": 3,
        "text": "定长滑动窗口",
        "slug": "定长滑动窗口"
      },
      {
        "depth": 3,
        "text": "不定长滑动窗口",
        "slug": "不定长滑动窗口"
      },
      {
        "depth": 4,
        "text": "越短越合法/求最长/最大",
        "slug": "越短越合法求最长最大"
      },
      {
        "depth": 4,
        "text": "越长越合法/求最短/最小",
        "slug": "越长越合法求最短最小"
      }
    ],
    "searchText": "刷题记录 算法 刷题记录 滑动窗口 定长滑动窗口 基础： 定长子串中元音的最大数目 子数组最大平均数 i 大小为 k 且平均值大于等于阈值的子数组数目 半径为 k 的子数组平均值 得到 k 个黑块的最少涂色次数 几乎唯一子数组的最大和 长度为 k 子数组中的最大和 可获得的最大点数 不定长滑动窗口 越短越合法/求最长/最大 基础： 无重复字符的最长子串 每个字符最多出现两次的最长子字符串 删掉一个元素以后全为 1 的最长子数组 使数组平衡的最少移除数目 尽可能使字符串相等 水果成篮 删除子数组的最大得分 最多 k 个重复元素的最长子数组 考试的最大困扰度 最大连续 1 的个数 iii 越长越合法/求最短/最小 长度最小的子数组 不同元素和至少为 k 的最短子数组长度 最短且字典序最小的美丽子字符串 替换子串得到平衡字符串 无限数组的最短子数组 最小覆盖子串 最小区间"
  },
  {
    "slug": "022-算法笔试题",
    "title": "算法笔试题",
    "category": "算法",
    "sourcePath": "docs/算法/算法笔试题.md",
    "markdown": "# 算法笔试题\n\n## 滑动窗口\n\n### 定长滑动窗口\n\n窗口右端点在 i 时，由于窗口长度为 k，所以窗口左端点为 i−k+1。\n\n三步：入-更新-出。\n\n- **入：** 下标为 i 的元素进入窗口，更新相关统计量。如果窗口左端点 i−k+1<0，则尚未形成第一个窗口，重复第一步。\n- **更新：** 更新答案。一般是更新最大值/最小值。\n- **出：** 下标为 i−k+1 的元素离开窗口，更新相关统计量，为下一个循环做准备。\n\n以上三步适用于所有定长滑窗题目。\n\n### 不定长滑动窗口\n\n滑动窗口相当于在维护一个队列。右指针的移动可以视作入队，左指针的移动可以视作出队。\n\n## 动态规划\n\n### 跳房子（面试真题）\n\n跳房子，每次跳1或2或3步，给定n个格子，不能选择和上次一样的步数，一共有几种跳法。\n\n- **思路**\n\n定义 `dp[i][j]` 表示跳到第 `i` 格且最后一步使用步数 `j`（`j` 取 1、2、3）的方案数。由于不能选择和上一次一样的步数，状态转移为：\n\n- `dp[i][1] = dp[i-1][2] + dp[i-1][3]`（跳 1 步到第 i 格，上一步不能是 1）\n- `dp[i][2] = dp[i-2][1] + dp[i-2][3]`（跳 2 步到第 i 格，上一步不能是 2）\n- `dp[i][3] = dp[i-3][1] + dp[i-3][2]`（跳 3 步到第 i 格，上一步不能是 3）\n\n初始条件：`dp[1][1] = 1`，`dp[2][2] = 1`，`dp[3][3] = 1`（分别对应第一步直接跳到 1、2、3 的情况）。同时 `dp[3][1] = dp[2][2] + dp[2][3] = 1`（先跳 2 步到第 2 格，再跳 1 步到第 3 格）。\n\n最终答案为 `dp[n][1] + dp[n][2] + dp[n][3]`。\n\n- **答案**\n\n使用二维 DP，`dp[i][j]` 表示跳到第 i 格且最后一步用步数 j 的方案数，状态转移时排除上一步相同步数，最终答案为 `dp[n][1] + dp[n][2] + dp[n][3]`。\n\n- **相似题**\n\n1. [LeetCode 70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)：每次爬 1 或 2 个台阶，求到达第 n 阶的方案数（经典一维 DP）。\n2. [LeetCode 746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)：每次爬 1 或 2 个台阶，每个台阶有花费，求到达顶部的最小花费。\n\n## 二叉树\n\n### 判断二叉搜索树（面试真题）\n\n判断一个树是否是二叉搜索树。\n\n- **思路**\n\n两种常见方法：\n\n1. **中序遍历递增判断**：二叉搜索树的中序遍历结果是严格递增序列。对树进行中序遍历，记录前一个节点的值，若当前节点值 ≤ 前一个节点值，则不是 BST。\n2. **递归判断范围**：对每个节点维护一个合法的值范围 `(min, max)`。根节点的范围是 `(-Infinity, +Infinity)`，左子节点的范围是 `(min, 父节点值)`，右子节点的范围是 `(父节点值, max)`。若某个节点的值不在合法范围内，则不是 BST。\n\n- **答案**\n\n方法一：中序遍历，记录前驱节点值，若当前值 ≤ 前驱则非法。方法二：递归判断范围，每个节点维护合法区间 (min, max)，左子区间为 (min, 父值)，右子区间为 (父值, max)。\n\n- **相似题**\n\n1. [LeetCode 98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)：与本题完全一致，判断给定的二叉树是否是有效的二叉搜索树。\n\n## 栈\n\n### 括号匹配（面试题）\n\n给一个JSON字符串，判断大括号和中括号是否匹配，返回第一个不匹配的下标位置（没被匹配到的括号的下标）。\n\n### 相对路径简化\n\n给一个表示路径的字符串，需要将字符串中的相对路径转成绝对路径，并去除多余和末尾的`/`。其中，`~`表示`home/base/user`，`.`表示当前路径，`..`表示上一级目录。\n\n## 并查集\n\n### 朋友圈（面试题）\n\n给定一个二维数组`know`，一个数字`m`和一个数字`n`。`know`中的每个子数组的长度是`m`，子数组中的每一项表示一个小朋友，子数组表示这些小朋友互相认识。`n`表示一共有n个小朋友。需要根据`know`中的认识关系，合并所有认识的人组成一个朋友圈，没有朋友圈（没有出现在`know`数组中）的小朋友自己一个朋友圈，输出最终朋友圈的数量。\n\n## 图\n\n### 勇士与恶龙（面试题）\n\n一个m\\*n的矩形地图k，其中存在恶龙，用字母表示，字母取值有N、S、E、W表示方向，恶龙会向此方向喷出条状火焰，直到遇到墙壁或者其他恶龙。玩家从0,0坐标出发，如果遇到火会死，请判断玩家是否可以顺利走出去。\n",
    "headings": [
      {
        "depth": 1,
        "text": "算法笔试题",
        "slug": "算法笔试题"
      },
      {
        "depth": 2,
        "text": "滑动窗口",
        "slug": "滑动窗口"
      },
      {
        "depth": 3,
        "text": "定长滑动窗口",
        "slug": "定长滑动窗口"
      },
      {
        "depth": 3,
        "text": "不定长滑动窗口",
        "slug": "不定长滑动窗口"
      },
      {
        "depth": 2,
        "text": "动态规划",
        "slug": "动态规划"
      },
      {
        "depth": 3,
        "text": "跳房子（面试真题）",
        "slug": "跳房子面试真题"
      },
      {
        "depth": 2,
        "text": "二叉树",
        "slug": "二叉树"
      },
      {
        "depth": 3,
        "text": "判断二叉搜索树（面试真题）",
        "slug": "判断二叉搜索树面试真题"
      },
      {
        "depth": 2,
        "text": "栈",
        "slug": "栈"
      },
      {
        "depth": 3,
        "text": "括号匹配（面试题）",
        "slug": "括号匹配面试题"
      },
      {
        "depth": 3,
        "text": "相对路径简化",
        "slug": "相对路径简化"
      },
      {
        "depth": 2,
        "text": "并查集",
        "slug": "并查集"
      },
      {
        "depth": 3,
        "text": "朋友圈（面试题）",
        "slug": "朋友圈面试题"
      },
      {
        "depth": 2,
        "text": "图",
        "slug": "图"
      },
      {
        "depth": 3,
        "text": "勇士与恶龙（面试题）",
        "slug": "勇士与恶龙面试题"
      }
    ],
    "searchText": "算法笔试题 算法 算法笔试题 滑动窗口 定长滑动窗口 窗口右端点在 i 时，由于窗口长度为 k，所以窗口左端点为 i−k+1。 三步：入 更新 出。 入： 下标为 i 的元素进入窗口，更新相关统计量。如果窗口左端点 i−k+1<0，则尚未形成第一个窗口，重复第一步。 更新： 更新答案。一般是更新最大值/最小值。 出： 下标为 i−k+1 的元素离开窗口，更新相关统计量，为下一个循环做准备。 以上三步适用于所有定长滑窗题目。 不定长滑动窗口 滑动窗口相当于在维护一个队列。右指针的移动可以视作入队，左指针的移动可以视作出队。 动态规划 跳房子（面试真题） 跳房子，每次跳1或2或3步，给定n个格子，不能选择和上次一样的步数，一共有几种跳法。 思路 定义 dp[i][j] 表示跳到第 i 格且最后一步使用步数 j（j 取 1、2、3）的方案数。由于不能选择和上一次一样的步数，状态转移为： dp[i][1] = dp[i 1][2] + dp[i 1][3]（跳 1 步到第 i 格，上一步不能是 1） dp[i][2] = dp[i 2][1] + dp[i 2][3]（跳 2 步到第 i 格，上一步不能是 2） dp[i][3] = dp[i 3][1] + dp[i 3][2]（跳 3 步到第 i 格，上一步不能是 3） 初始条件：dp[1][1] = 1，dp[2][2] = 1，dp[3][3] = 1（分别对应第一步直接跳到 1、2、3 的情况）。同时 dp[3][1] = dp[2][2] + dp[2][3] = 1（先跳 2 步到第 2 格，再跳 1 步到第 3 格）。 最终答案为 dp[n][1] + dp[n][2] + dp[n][3]。 答案 使用二维 dp，dp[i][j] 表示跳到第 i 格且最后一步用步数 j 的方案数，状态转移时排除上一步相同步数，最终答案为 dp[n][1] + dp[n][2] + dp[n][3]。 相似题 1. $1：每次爬 1 或 2 个台阶，求到达第 n 阶的方案数（经典一维 dp）。 2. $1：每次爬 1 或 2 个台阶，每个台阶有花费，求到达顶部的最小花费。 二叉树 判断二叉搜索树（面试真题） 判断一个树是否是二叉搜索树。 思路 两种常见方法： 1. 中序遍历递增判断 ：二叉搜索树的中序遍历结果是严格递增序列。对树进行中序遍历，记录前一个节点的值，若当前节点值 ≤ 前一个节点值，则不是 bst。 2. 递归判断范围 ：对每个节点维护一个合法的值范围 (min, max)。根节点的范围是 ( infinity, +infinity)，左子节点的范围是 (min, 父节点值)，右子节点的范围是 (父节点值, max)。若某个节点的值不在合法范围内，则不是 bst。 答案 方法一：中序遍历，记录前驱节点值，若当前值 ≤ 前驱则非法。方法二：递归判断范围，每个节点维护合法区间 (min, max)，左子区间为 (min, 父值)，右子区间为 (父值, max)。 相似题 1. $1：与本题完全一致，判断给定的二叉树是否是有效的二叉搜索树。 栈 括号匹配（面试题） 给一个json字符串，判断大括号和中括号是否匹配，返回第一个不匹配的下标位置（没被匹配到的括号的下标）。 相对路径简化 给一个表示路径的字符串，需要将字符串中的相对路径转成绝对路径，并去除多余和末尾的/。其中，~表示home/base/user，.表示当前路径，..表示上一级目录。 并查集 朋友圈（面试题） 给定一个二维数组know，一个数字m和一个数字n。know中的每个子数组的长度是m，子数组中的每一项表示一个小朋友，子数组表示这些小朋友互相认识。n表示一共有n个小朋友。需要根据know中的认识关系，合并所有认识的人组成一个朋友圈，没有朋友圈（没有出现在know数组中）的小朋友自己一个朋友圈，输出最终朋友圈的数量。 图 勇士与恶龙（面试题） 一个m\\ n的矩形地图k，其中存在恶龙，用字母表示，字母取值有n、s、e、w表示方向，恶龙会向此方向喷出条状火焰，直到遇到墙壁或者其他恶龙。玩家从0,0坐标出发，如果遇到火会死，请判断玩家是否可以顺利走出去。"
  },
  {
    "slug": "023-网络",
    "title": "网络",
    "category": "网络",
    "sourcePath": "docs/网络/网络.md",
    "markdown": "# 网络\n\n## DNS 解析过程\n\nDNS（Domain Name System）解析是将域名转换为 IP 地址的过程，完整流程如下：\n\n1. **浏览器缓存**：浏览器首先检查自身的 DNS 缓存中是否有该域名的解析记录，有则直接返回。\n2. **操作系统缓存**：浏览器缓存未命中，查询操作系统的 DNS 缓存（如 `hosts` 文件中的静态映射）。\n3. **本地 DNS 服务器**：操作系统缓存未命中，向本地 DNS 服务器（通常由 ISP 提供）发起查询请求。本地 DNS 服务器也有缓存，命中则直接返回。\n4. **根 DNS 服务器**：本地 DNS 服务器缓存未命中，向根 DNS 服务器（全球 13 组）发起查询。根 DNS 服务器不直接返回 IP，而是返回对应顶级域（如 `.com`）的 DNS 服务器地址。\n5. **顶级域 DNS 服务器**：本地 DNS 服务器向顶级域 DNS 服务器查询，获取该域名对应的权威 DNS 服务器地址。\n6. **权威 DNS 服务器**：本地 DNS 服务器向权威 DNS 服务器查询，获取域名对应的最终 IP 地址。\n7. **返回结果**：本地 DNS 服务器将 IP 地址缓存，并返回给操作系统，操作系统再返回给浏览器。\n\n其中，客户端到本地 DNS 服务器之间通常采用**递归查询**（客户端只需等待最终结果），本地 DNS 服务器到各级 DNS 服务器之间通常采用**迭代查询**（本地 DNS 服务器依次向各级 DNS 服务器请求，每次获得下一步的查询地址）。\n\n## 什么是 DNS 预解析\n\nDNS 预解析（DNS Prefetch）是一种前端性能优化手段，通过提前对页面中即将用到的域名进行 DNS 解析，将域名与 IP 的映射关系缓存到本地，从而在真正发起请求时减少 DNS 解析的延迟。\n\n使用方式：在 HTML 的 `<head>` 中添加 `<link rel=\"dns-prefetch\" href=\"https://域名\">` 标签。\n\n适用场景：页面中引用了多个外部域名的资源（如 CDN 资源、第三方 API、统计脚本等），通过 DNS 预解析可以减少用户首次访问时的 DNS 查询耗时，通常可节省 20–120ms。\n\n注意：浏览器默认会对页面中 `<a>` 标签的 `href` 属性进行 DNS 预解析（仅限 HTTP 页面），HTTPS 页面需要手动开启 `<meta http-equiv=\"x-dns-prefetch-control\" content=\"on\">`。\n\n## 什么是 CDN\n\nCDN（Content Delivery Network，内容分发网络）是一种分布式服务器架构，通过在全球各地部署边缘节点服务器，将网站内容缓存到离用户最近的节点，使用户就近获取资源，从而降低访问延迟、提高传输速度。\n\n核心工作原理：\n\n1. **智能调度**：用户请求域名时，CDN 的智能 DNS 系统会根据用户的地理位置、网络状况、节点负载等因素，将请求导向最优的边缘节点。\n2. **边缘缓存**：边缘节点会缓存源站的静态资源（如 HTML、CSS、JS、图片、视频等）。用户请求的资源如果在边缘节点有缓存，则直接返回（缓存命中）。\n3. **回源机制**：如果边缘节点没有缓存该资源（缓存未命中），则向源站服务器请求资源，获取后缓存到本地并返回给用户。\n\n前端常见用途：托管静态资源（JS/CSS/图片）、加速 API 请求、分发字体文件等。常见的 CDN 服务商有 Cloudflare、AWS CloudFront、阿里云 CDN 等。\n\n## HTTP GET/POST 区别\n\n1. 语义上，`GET` 是获取资源，幂等（多次执行同一个请求，产生的服务器状态变化和最终效果，与只执行一次完全相同）；`POST` 是提交数据，非幂等。\n2. `GET` 能被缓存，`POST` 默认不缓存。\n3. `GET` 参数在 URL 里，`POST` 在请求体里。\n4. 长度限制上，`GET` 受 URL 长度限制，`POST` 没有。\n5. `GET` 参数暴露，适合非敏感数据；`POST` 更隐蔽，适合传敏感数据或文件。\n\n## PUT/DELETE/PATCH/HEAD/OPTIONS 的使用场景\n\n1. `PUT`：全量更新资源（幂等）。前端提交完整的资源数据更新，比如\"修改用户资料\"时，一次性提交姓名、年龄、手机号等所有字段，服务器用新数据全量替换旧数据。\n2. `DELETE`：删除资源（幂等）。前端触发删除操作，比如删除一条评论、删除一个收藏、删除用户账号。\n3. `PATCH`：增量更新资源（非幂等）。前端只更新资源的某个字段，比如只修改用户的昵称，不需要提交年龄、手机号等其他字段，减少数据传输量。\n4. `HEAD`：仅获取响应头（不返回响应体）。检查资源是否存在（比如判断文件是否在服务器上）；获取资源的元信息（比如文件大小、最后修改时间），无需下载完整内容；可用于前端优化：比如先 `HEAD` 请求检查图片大小，再决定是否加载高清版本。\n5. `OPTIONS`：预检请求（跨域）。当前端发起跨域复杂请求时，浏览器会先自动发送一次 `OPTIONS` 请求到服务器，询问\"是否允许当前域名的跨域请求\"。\n\n### 触发预检请求的条件（复杂请求）\n\n- 请求方法不是 `GET`/`POST`/`HEAD`（比如 `PUT`/`DELETE`/`PATCH`）；\n- 请求头包含非默认字段（比如 `Authorization`、`Content-Type: application/json`、自定义头 `X-Token` 等）；\n- 请求包含 `Access-Control-Request-Headers` 或 `Access-Control-Request-Method`。\n\n## HTTP 常见状态码\n\n1. `2xx` 代表成功响应；`3xx` 代表重定向；`4xx` 代表客户端错误；`5xx` 代表服务端错误。\n2. `200 OK`；`201 Created` 服务器成功创建了新的资源，例如创建订单、上传头像，会携带 `Location` 响应头，指向新资源的 URL；`204 No Content` 请求成功，但没有响应体。\n3. `301 Moved Permanently` 永久重定向；`302 Found` 临时重定向；`304 Not Modified` 协商缓存命中。\n4. `400 Bad Request` 请求语法错误或参数无效；`401 Unauthorized` 未授权，例如 Token 过期、未登录，可以跳转到登录页；`403 Forbidden` 禁止访问，例如权限不足、被添加进了黑名单；`404 Not Found` 资源未找到；`405 Method Not Allowed` 请求方法不被允许。\n5. `500 Internal Server Error` 服务器内部错误；`502 Bad Gateway` 网关错误，例如网站使用了反向代理，但代理服务器无法连接到应用服务器。\n\n## HTTP 常见的请求/响应头\n\n### 请求头\n\n1. `Content-Type`：请求体的格式和编码，如 `application/json`、`multipart/form-data`、`text/plain`。\n2. `Authorization`：携带用户的身份凭证（如 Token）。\n3. `Cookie`：携带服务器通过 `Set-Cookie` 下发的 Cookie 数据（如会话 ID、登录态），浏览器会自动携带同域名的 Cookie，无需前端手动设置。\n4. `Origin`：当前请求的来源（协议 + 域名 + 端口）。\n5. `Referer`：当前请求是从哪个页面跳转过来的。\n6. `Cache-Control`：客户端的缓存策略。`no-cache`：不使用本地强缓存，直接发请求到服务器做协商缓存（`304` 校验）；`no-store`：不缓存任何资源，每次都从服务器获取最新的。\n7. `User-Agent`：客户端的设备/浏览器/系统信息。\n8. `Accept`：客户端能接收的响应数据格式。\n9. `Accept-Encoding`：客户端能解压的编码格式。\n\n### 响应头\n\n1. `Set-Cookie`：服务器向下发 Cookie（如登录态、会话 ID），浏览器会自动保存，并在后续同域名请求中携带。\n   - `HttpOnly`：Cookie 只能由浏览器自动携带，前端 JS 无法读取（`document.cookie` 拿不到），防止 XSS 攻击；\n   - `Secure`：Cookie 仅在 `HTTPS` 协议下传输，`HTTP` 下不携带，防止窃听；\n   - `SameSite`：限制 Cookie 的跨域携带：\n     - `Strict` 表示仅同站请求携带；\n     - `Lax` 是默认值，表示部分跨域请求携带；\n     - `None` 表示所有跨域请求携带，且需要配合 `Secure` 字段一起使用；\n   - `max-age`：Cookie 有效期。\n2. `Access-Control-*`：跨域 CORS 核心响应头。如果跨域请求带 Cookie，`Access-Control-Allow-Origin` 不能是 `*`。\n3. `Cache-Control`：强缓存规则（优先级最高）。\n4. `Expires`：强缓存的过期时间（HTTP/1.0，优先级低于 `Cache-Control`）。\n5. `ETag`：资源的唯一标识（协商缓存）。\n6. `Last-Modified`：资源的最后修改时间（协商缓存）。\n7. `Content-Type`：响应体的格式和编码。\n8. `Content-Encoding`：响应体的压缩格式。\n9. `Location`：配合 `301`/`302` 重定向状态码，告诉浏览器「要跳转的新 URL」。\n\n## 上传文件为什么必须用 multipart/form-data，而不能用 application/json？\n\n因为 `application/json` 仅支持文本数据传输，文件本质是二进制数据（01 字节流），无法被 JSON 字符串编码；而 `multipart/form-data` 专门设计用于传输二进制数据，可直接将文件的二进制内容封装到请求体中，无需额外编码，因此是文件上传的唯一选择。\n\n## axios 发送 POST 请求时，默认的 Content-Type 是什么？如果要传传统表单格式，该怎么配置？\n\n`axios` 默认的 `Content-Type` 是 `application/json`，会自动将传入的对象转为 JSON 字符串；如果要传传统表单格式（`x-www-form-urlencoded`），需要先用 `qs` 库将对象转为 URL 编码的键值对字符串，再手动设置 `Content-Type` 为 `application/x-www-form-urlencoded`。\n\n## Token 放哪里更安全\n\nToken 的安全存储需分前端场景和后端场景讨论，不同场景的风险不同，安全方案也有差异。\n\n### 前端 Token（如 API Token、JWT）：优先规避 XSS/CSRF 风险\n\n前端处于浏览器环境，需避免 Token 被脚本窃取或恶意利用，推荐按优先级选择存储方式：\n\n1. **最优：`HttpOnly` + `Secure` Cookie**\n   - 存储位置：后端通过 `Set-Cookie` 设置，标记 `HttpOnly`（禁止 JS 读取）、`Secure`（仅 HTTPS 传输）、`SameSite=Strict/Lax`（防御 CSRF）、`Path=/`（限定生效路径）。\n   - 优势：彻底规避 XSS 攻击（JS 无法获取），是前端 Token 最安全的存储方式。\n   - 适用场景：大部分前后端分离项目的接口 Token（如登录态 Token）。\n2. **次优：内存存储（如 Vuex/Redux 状态、变量）**\n   - 存储位置：前端应用的内存变量（如 React 的 `useState`、Vue 的 `data`），或状态管理库（如 Redux）。\n   - 优势：页面刷新/关闭后 Token 消失，不会被持久化窃取；避免 XSS 窃取（内存数据不会被本地存储读取）。\n   - 缺点：页面刷新后需重新获取 Token，需配合\"刷新 Token\"机制。\n   - 适用场景：临时 Token（如单次请求的临时凭证）。\n3. **不推荐：`localStorage`/`sessionStorage`**\n   - 风险：易被 XSS 攻击窃取（JS 可直接读取 `localStorage.getItem()`），且数据持久化存储，被盗后风险更高。\n   - 仅在\"无 XSS 风险、Token 无敏感权限\"的场景下临时使用（不建议）。\n\n### 后端 Token（如用户 Token、第三方 API 密钥）：优先加密 + 权限隔离\n\n后端 Token 需避免泄露、被未授权访问，核心是\"加密存储 + 最小权限\"：\n\n1. **数据库存储：加密后存储**\n   - 方式：用对称加密（如 AES）或哈希算法（如 SHA-256 + 盐值）加密 Token 后，存入数据库。\n   - 注意：JWT 的 `secret` 等核心密钥，禁止明文存数据库，需存在后端配置文件（配合环境变量）或密钥管理服务（如 AWS KMS）。\n2. **缓存存储：限制访问权限**\n   - 方式：存入 Redis/Memcached 时，设置短过期时间，同时配置缓存服务的访问权限（仅允许后端服务 IP 访问）。\n   - 注意：缓存中的 Token 需加密（同数据库规则），避免缓存被攻破后直接泄露。\n3. **配置文件：用环境变量/密钥管理**\n   - 禁止将 Token 明文写在代码或配置文件中，应通过环境变量（如 Node.js 的 `process.env.TOKEN`）、配置中心（如 Nacos）或密钥管理服务加载。\n\n## Cookie 和 Token 区别\n\n### 一、核心定义\n\n1. **Cookie**：是浏览器内置的小型文本存储机制，由服务端通过 `Set-Cookie` 响应头下发，浏览器自动存储。后续每次向同一域名发请求时，会自动携带在请求头的 `Cookie` 字段中。核心定位：浏览器的存储工具 + 天然的请求携带机制，早期主要用于存储会话信息（如 `PHPSESSID`）。\n2. **Token**：是服务端生成的一串加密字符串凭证，无固定格式（常见 JWT、随机字符串）。服务端不存储 Token 本身（如 JWT 是无状态的），仅验证其有效性。核心定位：身份鉴权的凭证，需要手动处理存储和传输（如放在请求头的 `Authorization` 字段中）。\n\n### 二、10 个关键维度对比\n\n| 对比维度   | Cookie                                                                            | Token                                                                                     |\n| ---------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |\n| 本质与定位 | 浏览器存储机制 + 会话传输载体                                                     | 服务端生成的鉴权凭证                                                                      |\n| 存储位置   | 浏览器的 Cookie 存储区（有固定路径）                                              | 灵活：前端可存在 Cookie、`localStorage`、内存、甚至 URL（不推荐）                         |\n| 传输方式   | 浏览器自动携带，无需前端代码处理                                                  | 前端手动设置（如请求头 `Authorization: Bearer <token>`）                                  |\n| 大小限制   | 有严格限制：单条 Cookie 最大 4KB，单域名下最多 50 条                              | 无固定限制（由服务端决定），JWT 一般建议不超过 1KB（避免请求头过大）                      |\n| 安全特性   | 支持 `HttpOnly`、`Secure`、`SameSite` 等安全属性，可防御 XSS、CSRF                | 本身无安全属性，安全依赖存储方式和传输方式（如存 `HttpOnly` Cookie 则继承其安全特性）     |\n| 跨域支持   | 天生不支持跨域：浏览器仅会携带同域名的 Cookie                                     | 完美支持跨域：手动放在请求头中，不受域名限制                                              |\n| 生命周期   | 两种：会话级（浏览器关闭即失效）、持久化（通过 `expires`/`max-age` 设置过期时间） | 灵活：由服务端在生成时指定过期时间，前端可通过存储方式控制（如内存存储则页面刷新失效）    |\n| 状态性     | 通常是有状态的：服务端存储会话信息，Cookie 仅存会话 ID（如 `PHPSESSID`）          | 通常是无状态的：Token 本身包含所有鉴权信息（如 JWT），服务端无需存储，仅验证签名          |\n| 扩展性     | 弱：仅能用于浏览器端，无法用于非浏览器场景（如 App、小程序、后端服务间调用）      | 强：适用于所有客户端（浏览器、App、小程序、后端服务），是分布式系统、微服务的首选鉴权方案 |\n| 适用场景   | 传统前后端不分离项目（如 PHP、JSP 项目）、需要利用浏览器自动携带特性的场景        | 前后端分离项目、跨域项目、分布式系统、微服务、App/小程序鉴权                              |\n\n### 三、实战中的关键补充\n\n1. **Token 可以存放在 Cookie 中**：很多人误以为 Token 和 Cookie 是互斥的，实际最佳实践之一是：将 Token 存放在 `HttpOnly` + `Secure` + `SameSite` 的 Cookie 中。这样既利用了 Cookie 的安全特性（防御 XSS），又保留了 Token 的无状态优势，同时解决了 Token 存 `localStorage` 被 XSS 窃取的风险。\n2. **JWT 是 Token 的一种，不是全部**：Token 是一个广义概念，JWT（JSON Web Token）是 Token 的一种具体实现格式。除此之外，还有随机字符串 Token（如 Redis 中存储的会话 Token）、OAuth2.0 的 Access Token 等。\n3. **Cookie 的跨域问题的本质**：Cookie 的跨域不是指\"不同域名不能发送 Cookie\"，而是指浏览器不会自动携带跨域的 Cookie。若手动在请求头中设置跨域 Cookie，浏览器会拦截（同源策略限制），而 Token 手动放在请求头中则可以正常跨域。\n4. **实战选型的核心逻辑**：\n   - 若为传统前后端不分离项目（如 PHP 项目）：优先用 Cookie + Session。\n   - 若为前后端分离项目：优先用 Token（JWT 或 Redis Token），存储方式优先选 `HttpOnly` Cookie，其次选内存存储，绝对不推荐 `localStorage`。\n   - 若为跨域项目、App、小程序、微服务：必须用 Token。\n\n## 跨域\n\n跨域是浏览器的同源策略安全限制：当前端发起的请求，其协议、域名、端口三者中任意一个与当前页面的不相同（即不同源），该请求就叫跨域，浏览器会默认拦截非授权的跨域响应（注意：请求本身能发到服务端，只是响应会被浏览器拦下来）。\n\n### 跨域如何携带 Cookie\n\n跨域携带 Cookie 的核心是「前后端双向授权 + Cookie 合理配置」：\n\n1. 前端：开启 `withCredentials`（Axios）或 `credentials: 'include'`（Fetch）。\n2. 后端：指定 `Access-Control-Allow-Origin` + 开启 `Access-Control-Allow-Credentials: true`。\n3. Cookie：配置 `SameSite=None/Lax` + `Secure`（HTTPS），避免域名/路径不匹配。\n\n## TCP 三次握手\n\n### 为什么不能是两次握手？\n\n核心问题：无法确保服务端的连接请求被客户端收到，会导致「半连接」浪费服务端资源。\n\n举例：如果服务端的第二次握手报文（`SYN+ACK`）丢失了，客户端会认为连接没有建立，而服务端会认为连接已经建立，一直在等待客户端发送数据。此时服务端会维护一个「半连接」，如果有大量这样的情况，会导致服务端资源耗尽（这也是 SYN 洪水攻击的原理）。\n\n三次握手的第三次：客户端的 `ACK` 报文可以让服务端确认「客户端已经收到了我的连接请求」，从而避免半连接的产生。\n\n### 为什么不需要四次握手？\n\n核心原因：三次握手已经足够完成所有必要的工作，四次握手会增加不必要的延迟，降低效率。\n\n逻辑：第二次握手时，服务端可以同时发送「`SYN`（自己的连接请求）」和「`ACK`（对客户端的确认）」，这两个报文可以合并成一个，不需要分开发送。因此，三次握手是效率最高的方式。\n\n### SYN 洪水攻击（SYN Flood）\n\n- **原理**：攻击者向服务端发送大量的第一次握手报文（`SYN`），但不发送第三次握手报文（`ACK`），导致服务端维护大量的「半连接」（`SYN-RCVD` 状态），耗尽服务端的 CPU 和内存资源，从而拒绝正常的连接请求。\n- **防御方案**：SYN Cookie（服务端不存储半连接的序列号，而是通过算法生成一个 Cookie，放在第二次握手的 `SYN+ACK` 报文中，客户端第三次握手时携带这个 Cookie，服务端验证通过后再建立连接）、限制半连接的数量、缩短半连接的超时时间。\n\n### 三次握手的超时重传\n\n客户端发送第一次握手报文（`SYN`）后，如果在超时时间内没有收到服务端的第二次握手报文（`SYN+ACK`），会重传 `SYN` 报文，重传次数由系统配置决定（通常为 3-5 次）。\n\n### 三次握手与 HTTP 的关系\n\n浏览器发起 HTTP 请求时，底层会先建立 TCP 连接（三次握手），然后再发送 HTTP 报文；HTTP 响应完成后，会关闭 TCP 连接（四次挥手）。\n\nHTTP/1.1 默认开启长连接（`Keep-Alive`），即一次 TCP 连接可以发送多个 HTTP 请求，避免了频繁的三次握手和四次挥手，提高了效率。\n\n## TCP 四次挥手\n\n### 为什么是四次挥手，不是三次？\n\n核心原因：TCP 是全双工通信协议，关闭连接需要双向独立释放。每次单向释放都需要「`FIN`（关闭请求）+ `ACK`（确认）」两个报文。由于服务端在收到客户端的 `FIN` 后，可能还有数据要发送，无法立即发送自己的 `FIN`，因此必须先发送 `ACK` 确认，等数据发送完毕后再发送 `FIN`，这就导致了四次交互。而三次握手可以将 `SYN` 和 `ACK` 合并，是因为服务端在收到 `SYN` 后，没有数据要发送，可直接合并同步和确认报文。\n\n### TIME-WAIT 状态的作用是什么？为什么要等待 2 个 MSL（报文最大生存时间）？\n\n`TIME-WAIT` 状态是客户端在第四次挥手后进入的状态，作用有两个：\n\n1. **确保服务端能收到最后一个 ACK 报文**：如果服务端没收到客户端的 `ACK`，会重发 `FIN` 报文。客户端在 `TIME-WAIT` 状态下，能收到重发的 `FIN`，然后重发 `ACK`，确保服务端正常关闭。\n2. **确保本次连接的所有报文都从网络中消失**：MSL 是报文在网络中的最大生存时间，2 个 MSL 是报文往返的最大时间。等待 2 个 MSL 后，本次连接的所有报文都会过期，避免新连接收到旧连接的报文，导致数据混乱。\n\n## HTTP/1.1、HTTP/2、HTTP/3 区别\n\n### HTTP/1.1\n\n- **持久连接**：默认开启持久连接（`Connection: keep-alive`），允许在一次 TCP 连接上进行多次 HTTP 请求和响应，减少了连接建立和关闭的开销，提高了性能。\n- **管道化**：在持久连接的基础上，客户端可以在还未收到上一个请求的响应时，就发送下一个请求。但服务器必须按照请求的顺序返回响应，这可能导致队头阻塞问题。\n- **缓存处理**：增加了更多的缓存控制头字段，如 `Cache-Control`，允许更细粒度地控制缓存行为，提高资源的复用率。\n- **分块传输编码**：支持将响应数据分割成多个块进行传输，这样服务器可以在数据未完全生成时就开始发送，提高了传输效率。\n\n### HTTP/2\n\n- **二进制分帧层**：HTTP/2 将所有传输的信息分割为更小的帧，并采用二进制格式进行传输。相比 HTTP/1.1 的文本格式，二进制格式更紧凑、解析效率更高，并且可以在不破坏兼容性的情况下扩展新功能。\n- **多路复用**：通过二进制分帧层，多个请求和响应可以在同一个 TCP 连接上同时并行进行，避免了 HTTP/1.1 中的队头阻塞问题，显著提高了传输效率。\n- **头部压缩**：使用 `HPACK` 算法对 HTTP 头部进行压缩，减少了头部数据的传输量，从而提高了性能。因为 HTTP 头部通常包含大量重复信息，`HPACK` 算法通过建立索引表来压缩这些信息。\n- **服务器推送**：服务器可以主动向客户端推送资源，而无需客户端明确请求。例如，服务器可以在发送 HTML 页面时，同时推送相关的 CSS 和 JavaScript 文件，提前将资源缓存到客户端，提高页面加载速度。\n\n### HTTP/3\n\n- **基于 QUIC 协议**：QUIC 协议在 UDP 之上实现了类似 TCP 的可靠传输，同时具有更低的延迟。它通过减少连接建立的往返次数，如 `0-RTT`（零往返时间）握手，加快了数据传输的速度。\n- **多路复用改进**：HTTP/3 的多路复用在 QUIC 协议的基础上进一步优化，彻底解决了队头阻塞问题。即使某个流出现丢包，也不会影响其他流的数据传输。\n- **连接迁移**：当客户端的网络环境发生变化，如从 Wi-Fi 切换到移动数据时，HTTP/3 可以在不中断连接的情况下，快速将连接迁移到新的网络接口上，保证数据传输的连续性。\n- **前向纠错**：QUIC 协议支持前向纠错（FEC），发送方在数据包中添加额外的冗余数据，当接收方发现数据包丢失时，可以利用这些冗余数据恢复丢失的数据包，减少了重传次数，提高了传输效率。\n\n## HTTP/2 是如何解决 HTTP/1.1 的队头阻塞问题的？\n\nHTTP/2 通过二进制分帧层实现多路复用。它将所有传输的信息分割为更小的帧，并采用二进制格式传输。多个请求和响应的帧可以在同一个 TCP 连接上交错发送和接收，每个帧都有自己的标识符，客户端和服务器可以根据标识符对帧进行重组，这样即使某个请求的响应因为网络等原因延迟，也不会影响其他请求的处理和响应，从而解决了 HTTP/1.1 中的队头阻塞问题。\n\n## HTTP/3 的 0-RTT 握手是如何实现的？\n\n在首次连接时，客户端会发送带有初始密钥的 `ClientHello` 消息。服务器收到后，返回带有服务器配置和加密数据的 `ServerHello` 消息。客户端和服务器使用这些信息协商出会话密钥。后续客户端再次连接时，会在 `ClientHello` 消息中带上之前保存的会话密钥和一些加密的应用数据。服务器可以直接使用该会话密钥解密数据，实现 0-RTT 握手，即无需等待额外的往返时间就可以开始传输应用数据。\n\n## WebSocket 与实时通信\n\nHTTP 协议是单向、无状态、请求-响应模式，在实时通信场景下存在致命痛点：只能由客户端主动发起请求，频繁请求带来的开销大，实时性差。\n\nWebSocket 是一种基于 TCP 协议的全双工通信协议，它先通过 HTTP 完成握手升级，之后建立持久化长连接，实现双向数据传输。\n\n- WebSocket 建立在 TCP 连接之上，握手完成后连接不会断开，除非主动关闭或网络异常，避免了频繁建立连接的开销。\n- 后续数据传输使用 WebSocket 自有协议，数据帧体积小，比 HTTP 更高效。\n- 和 AJAX 不同，WebSocket 本身不遵循同源策略（但服务端可通过配置限制客户端域名），支持跨域通信。\n- 不仅可以传输文本（如 JSON），还可以传输二进制数据（如图片、音频）。\n\n## HTTPS 的理解\n\n1. HTTPS 是超文本传输安全协议。\n2. HTTP 协议与 TLS/SSL 协议的结合，增加了加密传输、身份认证和数据完整性校验机制，通过混合加密与数字证书技术解决 HTTP 明文传输的安全隐患。\n3. 与 HTTP 协议的区别：一个是传输方式，HTTP 是明文，容易被窃听篡改，HTTPS 则会加密；一个是端口，HTTP 默认是 `80` 端口，HTTPS 则是 `443`；还有就是浏览器方面，HTTP 会被标记为\"不安全\"，从而影响 SEO 排名。\n\n## TLS 握手流程\n\n1. 客户端向服务器发送\"客户端随机数\"和支持的加密套件列表，发起 HTTPS 连接请求。\n2. 服务器返回\"服务器随机数\"、选定的加密套件，以及包含公钥的数字证书。\n3. 客户端验证服务器证书的合法性（比如是否由可信 CA 签发、域名是否匹配、是否过期），验证通过后，生成\"预主密钥\"，用服务器的公钥加密后发送给服务器。\n4. 服务器用自己的私钥解密，得到预主密钥。此时，客户端和服务器都有了三个随机数：客户端随机数、服务器随机数、预主密钥，双方用相同的算法生成会话密钥（对称密钥）。\n5. 双方互相发送加密的握手完成消息，后续的所有 HTTP 数据都用会话密钥进行对称加密传输。\n\n## HTTPS 的混合加密机制是什么？为什么不只用一种加密方式？\n\n混合加密是结合了非对称加密和对称加密的优点。TLS 握手阶段，用非对称加密（比如 RSA）来安全交换会话密钥；后续的实际数据传输，用对称加密（比如 AES）来加密。\n\n- 不用纯非对称的原因是：非对称加密的加解密速度很慢，不适合大量数据的传输。\n- 不用纯对称的原因是：对称加密的密钥如果明文传输，很容易被截获，失去加密的意义。\n\n混合加密既保证了密钥交换的安全性，又保证了数据传输的效率。\n\n## TLS 1.2 和 TLS 1.3 的主要区别是什么？\n\n最核心的区别是握手效率和安全性。\n\n1. **握手次数减少**：TLS 1.2 完成握手需要 2 个 RTT（往返时间），而 TLS 1.3 只需要 1 个 RTT，大大降低了首次连接的延迟。\n2. **支持复用**：TLS 1.3 新增了 `0-RTT` 功能，对于复用之前会话的客户端，可以直接发送应用数据，不需要等待握手完成，进一步提升性能。\n3. **加密套件简化**：TLS 1.3 禁用了所有不安全的加密套件，只保留了最安全的几种，减少了协商的复杂度，也提升了安全性。\n4. **握手过程更安全**：TLS 1.3 中，预主密钥的传输等步骤被进一步加密，即使握手信息被截获，也不会泄露关键信息。\n\n## 什么是中间人攻击？HTTPS 是如何防止的？\n\n中间人攻击的本质是，攻击者在客户端和服务器之间，伪装成\"客户端的服务器\"和\"服务器的客户端\"，拦截并篡改双方的通信数据。\n\nHTTPS 防止中间人攻击的核心是数字证书和非对称加密。因为服务器的公钥是放在数字证书里的，而证书是由权威的 CA 签发的。客户端在接收证书后，会验证证书的合法性。如果攻击者想要伪造证书，他没有 CA 的私钥，无法生成有效的签名，客户端会发现证书无效，从而终止连接。这样，攻击者就无法冒充服务器，也就无法完成中间人攻击。\n\n## 数字证书\n\n数字证书是由权威证书颁发机构（CA）签发的电子身份凭证，核心作用是解决 HTTPS 混合加密中「公钥的归属问题」——它能证明\"这个公钥确实属于这个服务器/域名\"，从而为 HTTPS 提供身份认证的基础，防止攻击者伪造公钥实施中间人攻击。按信任等级从低到高可分为 DV（域名验证）、OV（组织验证）、EV（扩展验证）。\n\n但是数字证书也并非绝对安全，如果 CA 机构被攻破，或者根 CA 的私钥泄露，攻击者就可以进行伪造从而实施中间人攻击。\n\n## 浏览器是如何验证服务器数字证书的合法性的？\n\n信任链验证：\n\n1. 浏览器接收服务器的证书，先检查证书的基本信息：域名是否和当前访问的域名一致、证书是否在有效期内、证书的签名是否有效。\n2. 如果证书是由中间 CA 签发的，浏览器会向上追溯，验证中间 CA 的证书，直到找到一个根 CA 证书。\n3. 根 CA 证书是浏览器内置的、默认信任的证书。如果能追溯到信任的根 CA，并且整个链条的签名都有效，那么服务器的证书就是合法的；否则，浏览器会弹出警告，提示用户该网站的证书不可信。\n\n## HTTPS 的性能开销主要在哪里？有哪些优化手段？\n\n性能开销：\n\n1. TLS 握手的延迟，首次连接需要额外的 RTT，会增加页面的加载时间；\n2. 加解密的计算开销，服务器和客户端都需要消耗 CPU 资源来进行加解密操作，对高并发的服务器压力更大。\n\n优化手段：\n\n1. 使用 TLS 1.3 协议，减少握手延迟；\n2. 开启会话复用，包括 Session ID 和 Session Ticket，复用之前的会话密钥，避免重复握手；\n3. 开启 OCSP Stapling，减少证书验证时的网络请求；\n4. 使用 HTTP/2 或 HTTP/3 协议，HTTP/2 的多路复用可以提升并发性能，HTTP/3 基于 QUIC 协议，进一步优化了握手和重传的效率；\n5. 前端层面，尽量减少混合内容的请求，避免浏览器的安全拦截。\n\n### OCSP Stapling\n\n浏览器验证数字证书时，除了检查信任链、有效期、域名匹配，还有一个关键步骤：确认这个证书有没有被 CA 提前吊销（比如服务器私钥泄露，CA 会立刻吊销对应的证书，防止被滥用）。\n\n传统的验证方式是 OCSP 查询（在线证书状态协议）。浏览器在验证证书时，会自己主动向 CA 的 OCSP 服务器发送请求，查询当前证书的状态（有效/吊销/未知）。但是这样会导致性能延迟，因为多了一次额外的请求。而且如果 CA 的 OCSP 服务器宕机，会无法验证，影响用户体验。\n\n因此，诞生了 OCSP Stapling 技术，由服务器端配置，提前定时主动查询并缓存。当客户端发起 HTTPS 连接请求时，服务器在发送数字证书的同时，会把缓存的 OCSP 响应一起「钉」（Staple）在证书后面，发送给客户端。这样无需二次验证，可以提升性能，提高可靠性。\n\n## QUIC 协议\n\nTCP + TLS + HTTP/2 的握手延迟过高（需要 2-3 个 RTT），存在传输层的队头阻塞问题（一个数据包丢失，所有数据包都要等待重传）以及不支持连接迁移的问题（如果用户网络环境变化，TCP 连接会直接断开，需要重新连接）。\n\n所以 QUIC 是为了解决以上问题而出现的：\n\n1. 只需要一个 RTT 完成 TCP 连接、TLS 握手和应用层协议协商的过程。\n2. 可以包含多个流，并有标识，所以在丢失数据包时可以只重传丢失的数据包。\n3. 用连接 ID 代替四元组（源 IP、源端口、目的 IP、目的端口），网络环境变化不会影响连接。\n4. 内置加密，几乎所有头部信息都被加密，更安全。\n5. 对比 TCP，有着更灵活的拥塞控制算法，可以根据场景进行切换。\n\n## 前端开发中，遇到的 HTTPS 相关的常见问题有哪些？\n\n1. **混合内容**：页面本身是 HTTPS 协议，但是引入了 HTTP 协议的资源，比如图片、脚本、样式表等。浏览器为了安全，会阻止这些混合内容的加载，控制台会报错。解决方法是，把所有资源都改成 HTTPS 协议，或者使用相对路径、`//` 开头的协议无关路径。\n2. **自签名证书**：在本地开发时，如果使用自签名的 HTTPS 证书，浏览器会弹出安全警告，需要手动添加信任。\n3. **证书过期或不匹配**：如果服务器的证书过期，或者域名和证书上的域名不匹配，浏览器也会弹出警告，导致页面无法正常访问。\n\n## HTTPS 能保证绝对的安全吗？\n\n不能。HTTPS 只能保证传输过程中的安全，也就是客户端和服务器之间的数据传输是安全的。它无法解决传输之外的安全问题。比如，服务器本身被黑客入侵，数据被窃取；客户端的设备被木马感染，密钥被获取；或者 CA 机构被攻破，伪造了合法的证书。这些情况，HTTPS 是无法防范的。所以，HTTPS 是网络安全的重要一环，但不是全部，还需要结合其他安全措施，比如服务器的防火墙、数据的加密存储、用户的身份认证等。\n\n## 浏览器缓存策略\n\n浏览器缓存分为**强缓存**和**协商缓存**两种机制，共同减少重复请求、加快页面加载速度。\n\n### 强缓存\n\n强缓存不会向服务器发送请求，直接从本地缓存中读取资源，返回状态码 `200`（from disk cache / from memory cache）。\n\n通过以下响应头控制：\n\n1. **`Cache-Control`**（HTTP/1.1，优先级高）：\n   - `max-age=<seconds>`：资源在指定秒数内有效，例如 `max-age=31536000` 表示缓存一年。\n   - `no-cache`：不使用强缓存，每次请求都需要向服务器进行协商缓存验证。\n   - `no-store`：完全不缓存，每次都从服务器获取最新资源。\n   - `public`：资源可被任何中间代理缓存。\n   - `private`：资源仅允许浏览器缓存，不允许 CDN 等中间代理缓存。\n2. **`Expires`**（HTTP/1.0，优先级低）：指定资源的过期时间（绝对时间），如 `Expires: Wed, 21 Oct 2026 07:28:00 GMT`。缺点是依赖客户端时间，如果客户端时间不准确会导致缓存失效判断出错。\n\n### 协商缓存\n\n强缓存过期后，浏览器会向服务器发送请求，由服务器判断资源是否有更新。如果没更新，返回 `304 Not Modified`，浏览器继续使用本地缓存；如果有更新，返回 `200` 和新资源。\n\n通过以下请求/响应头配对控制：\n\n1. **`ETag` / `If-None-Match`**（优先级高）：\n   - 服务器返回资源时，在响应头携带 `ETag`（资源的唯一标识，通常是内容的哈希值）。\n   - 浏览器再次请求时，在请求头携带 `If-None-Match: <ETag值>`。\n   - 服务器比较当前资源的 ETag 与请求中的值，相同则返回 `304`，不同则返回新资源。\n2. **`Last-Modified` / `If-Modified-Since`**（优先级低）：\n   - 服务器返回资源时，在响应头携带 `Last-Modified`（资源的最后修改时间）。\n   - 浏览器再次请求时，在请求头携带 `If-Modified-Since: <Last-Modified值>`。\n   - 服务器比较资源的最后修改时间，没有变化则返回 `304`，有变化则返回新资源。\n   - 缺点：精度只到秒级，1 秒内的多次修改无法识别；文件内容没变但修改时间变了（如重新保存）也会导致缓存失效。\n\n### 缓存流程总结\n\n浏览器请求资源时：先检查强缓存（`Cache-Control` → `Expires`）→ 命中则直接使用本地缓存 → 未命中则发起协商缓存请求（`ETag` → `Last-Modified`）→ 服务器判断资源是否变化 → 未变化返回 `304` 使用缓存 → 变化则返回 `200` 和新资源。\n",
    "headings": [
      {
        "depth": 1,
        "text": "网络",
        "slug": "网络"
      },
      {
        "depth": 2,
        "text": "DNS 解析过程",
        "slug": "dns-解析过程"
      },
      {
        "depth": 2,
        "text": "什么是 DNS 预解析",
        "slug": "什么是-dns-预解析"
      },
      {
        "depth": 2,
        "text": "什么是 CDN",
        "slug": "什么是-cdn"
      },
      {
        "depth": 2,
        "text": "HTTP GET/POST 区别",
        "slug": "http-getpost-区别"
      },
      {
        "depth": 2,
        "text": "PUT/DELETE/PATCH/HEAD/OPTIONS 的使用场景",
        "slug": "putdeletepatchheadoptions-的使用场景"
      },
      {
        "depth": 3,
        "text": "触发预检请求的条件（复杂请求）",
        "slug": "触发预检请求的条件复杂请求"
      },
      {
        "depth": 2,
        "text": "HTTP 常见状态码",
        "slug": "http-常见状态码"
      },
      {
        "depth": 2,
        "text": "HTTP 常见的请求/响应头",
        "slug": "http-常见的请求响应头"
      },
      {
        "depth": 3,
        "text": "请求头",
        "slug": "请求头"
      },
      {
        "depth": 3,
        "text": "响应头",
        "slug": "响应头"
      },
      {
        "depth": 2,
        "text": "上传文件为什么必须用 multipart/form-data，而不能用 application/json？",
        "slug": "上传文件为什么必须用-multipartform-data而不能用-applicationjson"
      },
      {
        "depth": 2,
        "text": "axios 发送 POST 请求时，默认的 Content-Type 是什么？如果要传传统表单格式，该怎么配置？",
        "slug": "axios-发送-post-请求时默认的-content-type-是什么如果要传传统表单格式该怎么配置"
      },
      {
        "depth": 2,
        "text": "Token 放哪里更安全",
        "slug": "token-放哪里更安全"
      },
      {
        "depth": 3,
        "text": "前端 Token（如 API Token、JWT）：优先规避 XSS/CSRF 风险",
        "slug": "前端-token如-api-tokenjwt优先规避-xsscsrf-风险"
      },
      {
        "depth": 3,
        "text": "后端 Token（如用户 Token、第三方 API 密钥）：优先加密 + 权限隔离",
        "slug": "后端-token如用户-token第三方-api-密钥优先加密-权限隔离"
      },
      {
        "depth": 2,
        "text": "Cookie 和 Token 区别",
        "slug": "cookie-和-token-区别"
      },
      {
        "depth": 3,
        "text": "一、核心定义",
        "slug": "一核心定义"
      },
      {
        "depth": 3,
        "text": "二、10 个关键维度对比",
        "slug": "二10-个关键维度对比"
      },
      {
        "depth": 3,
        "text": "三、实战中的关键补充",
        "slug": "三实战中的关键补充"
      },
      {
        "depth": 2,
        "text": "跨域",
        "slug": "跨域"
      },
      {
        "depth": 3,
        "text": "跨域如何携带 Cookie",
        "slug": "跨域如何携带-cookie"
      },
      {
        "depth": 2,
        "text": "TCP 三次握手",
        "slug": "tcp-三次握手"
      },
      {
        "depth": 3,
        "text": "为什么不能是两次握手？",
        "slug": "为什么不能是两次握手"
      },
      {
        "depth": 3,
        "text": "为什么不需要四次握手？",
        "slug": "为什么不需要四次握手"
      },
      {
        "depth": 3,
        "text": "SYN 洪水攻击（SYN Flood）",
        "slug": "syn-洪水攻击syn-flood"
      },
      {
        "depth": 3,
        "text": "三次握手的超时重传",
        "slug": "三次握手的超时重传"
      },
      {
        "depth": 3,
        "text": "三次握手与 HTTP 的关系",
        "slug": "三次握手与-http-的关系"
      },
      {
        "depth": 2,
        "text": "TCP 四次挥手",
        "slug": "tcp-四次挥手"
      },
      {
        "depth": 3,
        "text": "为什么是四次挥手，不是三次？",
        "slug": "为什么是四次挥手不是三次"
      },
      {
        "depth": 3,
        "text": "TIME-WAIT 状态的作用是什么？为什么要等待 2 个 MSL（报文最大生存时间）？",
        "slug": "time-wait-状态的作用是什么为什么要等待-2-个-msl报文最大生存时间"
      },
      {
        "depth": 2,
        "text": "HTTP/1.1、HTTP/2、HTTP/3 区别",
        "slug": "http11http2http3-区别"
      },
      {
        "depth": 3,
        "text": "HTTP/1.1",
        "slug": "http11"
      },
      {
        "depth": 3,
        "text": "HTTP/2",
        "slug": "http2"
      },
      {
        "depth": 3,
        "text": "HTTP/3",
        "slug": "http3"
      },
      {
        "depth": 2,
        "text": "HTTP/2 是如何解决 HTTP/1.1 的队头阻塞问题的？",
        "slug": "http2-是如何解决-http11-的队头阻塞问题的"
      },
      {
        "depth": 2,
        "text": "HTTP/3 的 0-RTT 握手是如何实现的？",
        "slug": "http3-的-0-rtt-握手是如何实现的"
      },
      {
        "depth": 2,
        "text": "WebSocket 与实时通信",
        "slug": "websocket-与实时通信"
      },
      {
        "depth": 2,
        "text": "HTTPS 的理解",
        "slug": "https-的理解"
      },
      {
        "depth": 2,
        "text": "TLS 握手流程",
        "slug": "tls-握手流程"
      },
      {
        "depth": 2,
        "text": "HTTPS 的混合加密机制是什么？为什么不只用一种加密方式？",
        "slug": "https-的混合加密机制是什么为什么不只用一种加密方式"
      },
      {
        "depth": 2,
        "text": "TLS 1.2 和 TLS 1.3 的主要区别是什么？",
        "slug": "tls-12-和-tls-13-的主要区别是什么"
      },
      {
        "depth": 2,
        "text": "什么是中间人攻击？HTTPS 是如何防止的？",
        "slug": "什么是中间人攻击https-是如何防止的"
      },
      {
        "depth": 2,
        "text": "数字证书",
        "slug": "数字证书"
      },
      {
        "depth": 2,
        "text": "浏览器是如何验证服务器数字证书的合法性的？",
        "slug": "浏览器是如何验证服务器数字证书的合法性的"
      },
      {
        "depth": 2,
        "text": "HTTPS 的性能开销主要在哪里？有哪些优化手段？",
        "slug": "https-的性能开销主要在哪里有哪些优化手段"
      },
      {
        "depth": 3,
        "text": "OCSP Stapling",
        "slug": "ocsp-stapling"
      },
      {
        "depth": 2,
        "text": "QUIC 协议",
        "slug": "quic-协议"
      },
      {
        "depth": 2,
        "text": "前端开发中，遇到的 HTTPS 相关的常见问题有哪些？",
        "slug": "前端开发中遇到的-https-相关的常见问题有哪些"
      },
      {
        "depth": 2,
        "text": "HTTPS 能保证绝对的安全吗？",
        "slug": "https-能保证绝对的安全吗"
      },
      {
        "depth": 2,
        "text": "浏览器缓存策略",
        "slug": "浏览器缓存策略"
      },
      {
        "depth": 3,
        "text": "强缓存",
        "slug": "强缓存"
      },
      {
        "depth": 3,
        "text": "协商缓存",
        "slug": "协商缓存"
      },
      {
        "depth": 3,
        "text": "缓存流程总结",
        "slug": "缓存流程总结"
      }
    ],
    "searchText": "网络 网络 网络 dns 解析过程 dns（domain name system）解析是将域名转换为 ip 地址的过程，完整流程如下： 1. 浏览器缓存 ：浏览器首先检查自身的 dns 缓存中是否有该域名的解析记录，有则直接返回。 2. 操作系统缓存 ：浏览器缓存未命中，查询操作系统的 dns 缓存（如 hosts 文件中的静态映射）。 3. 本地 dns 服务器 ：操作系统缓存未命中，向本地 dns 服务器（通常由 isp 提供）发起查询请求。本地 dns 服务器也有缓存，命中则直接返回。 4. 根 dns 服务器 ：本地 dns 服务器缓存未命中，向根 dns 服务器（全球 13 组）发起查询。根 dns 服务器不直接返回 ip，而是返回对应顶级域（如 .com）的 dns 服务器地址。 5. 顶级域 dns 服务器 ：本地 dns 服务器向顶级域 dns 服务器查询，获取该域名对应的权威 dns 服务器地址。 6. 权威 dns 服务器 ：本地 dns 服务器向权威 dns 服务器查询，获取域名对应的最终 ip 地址。 7. 返回结果 ：本地 dns 服务器将 ip 地址缓存，并返回给操作系统，操作系统再返回给浏览器。 其中，客户端到本地 dns 服务器之间通常采用 递归查询 （客户端只需等待最终结果），本地 dns 服务器到各级 dns 服务器之间通常采用 迭代查询 （本地 dns 服务器依次向各级 dns 服务器请求，每次获得下一步的查询地址）。 什么是 dns 预解析 dns 预解析（dns prefetch）是一种前端性能优化手段，通过提前对页面中即将用到的域名进行 dns 解析，将域名与 ip 的映射关系缓存到本地，从而在真正发起请求时减少 dns 解析的延迟。 使用方式：在 html 的 <head 中添加 <link rel=\"dns prefetch\" href=\"https://域名\" 标签。 适用场景：页面中引用了多个外部域名的资源（如 cdn 资源、第三方 api、统计脚本等），通过 dns 预解析可以减少用户首次访问时的 dns 查询耗时，通常可节省 20–120ms。 注意：浏览器默认会对页面中 <a 标签的 href 属性进行 dns 预解析（仅限 http 页面），https 页面需要手动开启 <meta http equiv=\"x dns prefetch control\" content=\"on\" 。 什么是 cdn cdn（content delivery network，内容分发网络）是一种分布式服务器架构，通过在全球各地部署边缘节点服务器，将网站内容缓存到离用户最近的节点，使用户就近获取资源，从而降低访问延迟、提高传输速度。 核心工作原理： 1. 智能调度 ：用户请求域名时，cdn 的智能 dns 系统会根据用户的地理位置、网络状况、节点负载等因素，将请求导向最优的边缘节点。 2. 边缘缓存 ：边缘节点会缓存源站的静态资源（如 html、css、js、图片、视频等）。用户请求的资源如果在边缘节点有缓存，则直接返回（缓存命中）。 3. 回源机制 ：如果边缘节点没有缓存该资源（缓存未命中），则向源站服务器请求资源，获取后缓存到本地并返回给用户。 前端常见用途：托管静态资源（js/css/图片）、加速 api 请求、分发字体文件等。常见的 cdn 服务商有 cloudflare、aws cloudfront、阿里云 cdn 等。 http get/post 区别 1. 语义上，get 是获取资源，幂等（多次执行同一个请求，产生的服务器状态变化和最终效果，与只执行一次完全相同）；post 是提交数据，非幂等。 2. get 能被缓存，post 默认不缓存。 3. get 参数在 url 里，post 在请求体里。 4. 长度限制上，get 受 url 长度限制，post 没有。 5. get 参数暴露，适合非敏感数据；post 更隐蔽，适合传敏感数据或文件。 put/delete/patch/head/options 的使用场景 1. put：全量更新资源（幂等）。前端提交完整的资源数据更新，比如\"修改用户资料\"时，一次性提交姓名、年龄、手机号等所有字段，服务器用新数据全量替换旧数据。 2. delete：删除资源（幂等）。前端触发删除操作，比如删除一条评论、删除一个收藏、删除用户账号。 3. patch：增量更新资源（非幂等）。前端只更新资源的某个字段，比如只修改用户的昵称，不需要提交年龄、手机号等其他字段，减少数据传输量。 4. head：仅获取响应头（不返回响应体）。检查资源是否存在（比如判断文件是否在服务器上）；获取资源的元信息（比如文件大小、最后修改时间），无需下载完整内容；可用于前端优化：比如先 head 请求检查图片大小，再决定是否加载高清版本。 5. options：预检请求（跨域）。当前端发起跨域复杂请求时，浏览器会先自动发送一次 options 请求到服务器，询问\"是否允许当前域名的跨域请求\"。 触发预检请求的条件（复杂请求） 请求方法不是 get/post/head（比如 put/delete/patch）； 请求头包含非默认字段（比如 authorization、content type: application/json、自定义头 x token 等）； 请求包含 access control request headers 或 access control request method。 http 常见状态码 1. 2xx 代表成功响应；3xx 代表重定向；4xx 代表客户端错误；5xx 代表服务端错误。 2. 200 ok；201 created 服务器成功创建了新的资源，例如创建订单、上传头像，会携带 location 响应头，指向新资源的 url；204 no content 请求成功，但没有响应体。 3. 301 moved permanently 永久重定向；302 found 临时重定向；304 not modified 协商缓存命中。 4. 400 bad request 请求语法错误或参数无效；401 unauthorized 未授权，例如 token 过期、未登录，可以跳转到登录页；403 forbidden 禁止访问，例如权限不足、被添加进了黑名单；404 not found 资源未找到；405 method not allowed 请求方法不被允许。 5. 500 internal server error 服务器内部错误；502 bad gateway 网关错误，例如网站使用了反向代理，但代理服务器无法连接到应用服务器。 http 常见的请求/响应头 请求头 1. content type：请求体的格式和编码，如 application/json、multipart/form data、text/plain。 2. authorization：携带用户的身份凭证（如 token）。 3. cookie：携带服务器通过 set cookie 下发的 cookie 数据（如会话 id、登录态），浏览器会自动携带同域名的 cookie，无需前端手动设置。 4. origin：当前请求的来源（协议 + 域名 + 端口）。 5. referer：当前请求是从哪个页面跳转过来的。 6. cache control：客户端的缓存策略。no cache：不使用本地强缓存，直接发请求到服务器做协商缓存（304 校验）；no store：不缓存任何资源，每次都从服务器获取最新的。 7. user agent：客户端的设备/浏览器/系统信息。 8. accept：客户端能接收的响应数据格式。 9. accept encoding：客户端能解压的编码格式。 响应头 1. set cookie：服务器向下发 cookie（如登录态、会话 id），浏览器会自动保存，并在后续同域名请求中携带。 httponly：cookie 只能由浏览器自动携带，前端 js 无法读取（document.cookie 拿不到），防止 xss 攻击； secure：cookie 仅在 https 协议下传输，http 下不携带，防止窃听； samesite：限制 cookie 的跨域携带： strict 表示仅同站请求携带； lax 是默认值，表示部分跨域请求携带； none 表示所有跨域请求携带，且需要配合 secure 字段一起使用； max age：cookie 有效期。 2. access control ：跨域 cors 核心响应头。如果跨域请求带 cookie，access control allow origin 不能是 。 3. cache control：强缓存规则（优先级最高）。 4. expires：强缓存的过期时间（http/1.0，优先级低于 cache control）。 5. etag：资源的唯一标识（协商缓存）。 6. last modified：资源的最后修改时间（协商缓存）。 7. content type：响应体的格式和编码。 8. content encoding：响应体的压缩格式。 9. location：配合 301/302 重定向状态码，告诉浏览器「要跳转的新 url」。 上传文件为什么必须用 multipart/form data，而不能用 application/json？ 因为 application/json 仅支持文本数据传输，文件本质是二进制数据（01 字节流），无法被 json 字符串编码；而 multipart/form data 专门设计用于传输二进制数据，可直接将文件的二进制内容封装到请求体中，无需额外编码，因此是文件上传的唯一选择。 axios 发送 post 请求时，默认的 content type 是什么？如果要传传统表单格式，该怎么配置？ axios 默认的 content type 是 application/json，会自动将传入的对象转为 json 字符串；如果要传传统表单格式（x www form urlencoded），需要先用 qs 库将对象转为 url 编码的键值对字符串，再手动设置 content type 为 application/x www form urlencoded。 token 放哪里更安全 token 的安全存储需分前端场景和后端场景讨论，不同场景的风险不同，安全方案也有差异。 前端 token（如 api token、jwt）：优先规避 xss/csrf 风险 前端处于浏览器环境，需避免 token 被脚本窃取或恶意利用，推荐按优先级选择存储方式： 1. 最优：httponly + secure cookie 存储位置：后端通过 set cookie 设置，标记 httponly（禁止 js 读取）、secure（仅 https 传输）、samesite=strict/lax（防御 csrf）、path=/（限定生效路径）。 优势：彻底规避 xss 攻击（js 无法获取），是前端 token 最安全的存储方式。 适用场景：大部分前后端分离项目的接口 token（如登录态 token）。 2. 次优：内存存储（如 vuex/redux 状态、变量） 存储位置：前端应用的内存变量（如 react 的 usestate、vue 的 data），或状态管理库（如 redux）。 优势：页面刷新/关闭后 token 消失，不会被持久化窃取；避免 xss 窃取（内存数据不会被本地存储读取）。 缺点：页面刷新后需重新获取 token，需配合\"刷新 token\"机制。 适用场景：临时 token（如单次请求的临时凭证）。 3. 不推荐：localstorage/sessionstorage 风险：易被 xss 攻击窃取（js 可直接读取 localstorage.getitem()），且数据持久化存储，被盗后风险更高。 仅在\"无 xss 风险、token 无敏感权限\"的场景下临时使用（不建议）。 后端 token（如用户 token、第三方 api 密钥）：优先加密 + 权限隔离 后端 token 需避免泄露、被未授权访问，核心是\"加密存储 + 最小权限\"： 1. 数据库存储：加密后存储 方式：用对称加密（如 aes）或哈希算法（如 sha 256 + 盐值）加密 token 后，存入数据库。 注意：jwt 的 secret 等核心密钥，禁止明文存数据库，需存在后端配置文件（配合环境变量）或密钥管理服务（如 aws kms）。 2. 缓存存储：限制访问权限 方式：存入 redis/memcached 时，设置短过期时间，同时配置缓存服务的访问权限（仅允许后端服务 ip 访问）。 注意：缓存中的 token 需加密（同数据库规则），避免缓存被攻破后直接泄露。 3. 配置文件：用环境变量/密钥管理 禁止将 token 明文写在代码或配置文件中，应通过环境变量（如 node.js 的 process.env.token）、配置中心（如 nacos）或密钥管理服务加载。 cookie 和 token 区别 一、核心定义 1. cookie ：是浏览器内置的小型文本存储机制，由服务端通过 set cookie 响应头下发，浏览器自动存储。后续每次向同一域名发请求时，会自动携带在请求头的 cookie 字段中。核心定位：浏览器的存储工具 + 天然的请求携带机制，早期主要用于存储会话信息（如 phpsessid）。 2. token ：是服务端生成的一串加密字符串凭证，无固定格式（常见 jwt、随机字符串）。服务端不存储 token 本身（如 jwt 是无状态的），仅验证其有效性。核心定位：身份鉴权的凭证，需要手动处理存储和传输（如放在请求头的 authorization 字段中）。 二、10 个关键维度对比 | 对比维度 | cookie | token | | | | | | 本质与定位 | 浏览器存储机制 + 会话传输载体 | 服务端生成的鉴权凭证 | | 存储位置 | 浏览器的 cookie 存储区（有固定路径） | 灵活：前端可存在 cookie、localstorage、内存、甚至 url（不推荐） | | 传输方式 | 浏览器自动携带，无需前端代码处理 | 前端手动设置（如请求头 authorization: bearer <token ） | | 大小限制 | 有严格限制：单条 cookie 最大 4kb，单域名下最多 50 条 | 无固定限制（由服务端决定），jwt 一般建议不超过 1kb（避免请求头过大） | | 安全特性 | 支持 httponly、secure、samesite 等安全属性，可防御 xss、csrf | 本身无安全属性，安全依赖存储方式和传输方式（如存 httponly cookie 则继承其安全特性） | | 跨域支持 | 天生不支持跨域：浏览器仅会携带同域名的 cookie | 完美支持跨域：手动放在请求头中，不受域名限制 | | 生命周期 | 两种：会话级（浏览器关闭即失效）、持久化（通过 expires/max age 设置过期时间） | 灵活：由服务端在生成时指定过期时间，前端可通过存储方式控制（如内存存储则页面刷新失效） | | 状态性 | 通常是有状态的：服务端存储会话信息，cookie 仅存会话 id（如 phpsessid） | 通常是无状态的：token 本身包含所有鉴权信息（如 jwt），服务端无需存储，仅验证签名 | | 扩展性 | 弱：仅能用于浏览器端，无法用于非浏览器场景（如 app、小程序、后端服务间调用） | 强：适用于所有客户端（浏览器、app、小程序、后端服务），是分布式系统、微服务的首选鉴权方案 | | 适用场景 | 传统前后端不分离项目（如 php、jsp 项目）、需要利用浏览器自动携带特性的场景 | 前后端分离项目、跨域项目、分布式系统、微服务、app/小程序鉴权 | 三、实战中的关键补充 1. token 可以存放在 cookie 中 ：很多人误以为 token 和 cookie 是互斥的，实际最佳实践之一是：将 token 存放在 httponly + secure + samesite 的 cookie 中。这样既利用了 cookie 的安全特性（防御 xss），又保留了 token 的无状态优势，同时解决了 token 存 localstorage 被 xss 窃取的风险。 2. jwt 是 token 的一种，不是全部 ：token 是一个广义概念，jwt（json web token）是 token 的一种具体实现格式。除此之外，还有随机字符串 token（如 redis 中存储的会话 token）、oauth2.0 的 access token 等。 3. cookie 的跨域问题的本质 ：cookie 的跨域不是指\"不同域名不能发送 cookie\"，而是指浏览器不会自动携带跨域的 cookie。若手动在请求头中设置跨域 cookie，浏览器会拦截（同源策略限制），而 token 手动放在请求头中则可以正常跨域。 4. 实战选型的核心逻辑 ： 若为传统前后端不分离项目（如 php 项目）：优先用 cookie + session。 若为前后端分离项目：优先用 token（jwt 或 redis token），存储方式优先选 httponly cookie，其次选内存存储，绝对不推荐 localstorage。 若为跨域项目、app、小程序、微服务：必须用 token。 跨域 跨域是浏览器的同源策略安全限制：当前端发起的请求，其协议、域名、端口三者中任意一个与当前页面的不相同（即不同源），该请求就叫跨域，浏览器会默认拦截非授权的跨域响应（注意：请求本身能发到服务端，只是响应会被浏览器拦下来）。 跨域如何携带 cookie 跨域携带 cookie 的核心是「前后端双向授权 + cookie 合理配置」： 1. 前端：开启 withcredentials（axios）或 credentials: 'include'（fetch）。 2. 后端：指定 access control allow origin + 开启 access control allow credentials: true。 3. cookie：配置 samesite=none/lax + secure（https），避免域名/路径不匹配。 tcp 三次握手 为什么不能是两次握手？ 核心问题：无法确保服务端的连接请求被客户端收到，会导致「半连接」浪费服务端资源。 举例：如果服务端的第二次握手报文（syn+ack）丢失了，客户端会认为连接没有建立，而服务端会认为连接已经建立，一直在等待客户端发送数据。此时服务端会维护一个「半连接」，如果有大量这样的情况，会导致服务端资源耗尽（这也是 syn 洪水攻击的原理）。 三次握手的第三次：客户端的 ack 报文可以让服务端确认「客户端已经收到了我的连接请求」，从而避免半连接的产生。 为什么不需要四次握手？ 核心原因：三次握手已经足够完成所有必要的工作，四次握手会增加不必要的延迟，降低效率。 逻辑：第二次握手时，服务端可以同时发送「syn（自己的连接请求）」和「ack（对客户端的确认）」，这两个报文可以合并成一个，不需要分开发送。因此，三次握手是效率最高的方式。 syn 洪水攻击（syn flood） 原理 ：攻击者向服务端发送大量的第一次握手报文（syn），但不发送第三次握手报文（ack），导致服务端维护大量的「半连接」（syn rcvd 状态），耗尽服务端的 cpu 和内存资源，从而拒绝正常的连接请求。 防御方案 ：syn cookie（服务端不存储半连接的序列号，而是通过算法生成一个 cookie，放在第二次握手的 syn+ack 报文中，客户端第三次握手时携带这个 cookie，服务端验证通过后再建立连接）、限制半连接的数量、缩短半连接的超时时间。 三次握手的超时重传 客户端发送第一次握手报文（syn）后，如果在超时时间内没有收到服务端的第二次握手报文（syn+ack），会重传 syn 报文，重传次数由系统配置决定（通常为 3 5 次）。 三次握手与 http 的关系 浏览器发起 http 请求时，底层会先建立 tcp 连接（三次握手），然后再发送 http 报文；http 响应完成后，会关闭 tcp 连接（四次挥手）。 http/1.1 默认开启长连接（keep alive），即一次 tcp 连接可以发送多个 http 请求，避免了频繁的三次握手和四次挥手，提高了效率。 tcp 四次挥手 为什么是四次挥手，不是三次？ 核心原因：tcp 是全双工通信协议，关闭连接需要双向独立释放。每次单向释放都需要「fin（关闭请求）+ ack（确认）」两个报文。由于服务端在收到客户端的 fin 后，可能还有数据要发送，无法立即发送自己的 fin，因此必须先发送 ack 确认，等数据发送完毕后再发送 fin，这就导致了四次交互。而三次握手可以将 syn 和 ack 合并，是因为服务端在收到 syn 后，没有数据要发送，可直接合并同步和确认报文。 time wait 状态的作用是什么？为什么要等待 2 个 msl（报文最大生存时间）？ time wait 状态是客户端在第四次挥手后进入的状态，作用有两个： 1. 确保服务端能收到最后一个 ack 报文 ：如果服务端没收到客户端的 ack，会重发 fin 报文。客户端在 time wait 状态下，能收到重发的 fin，然后重发 ack，确保服务端正常关闭。 2. 确保本次连接的所有报文都从网络中消失 ：msl 是报文在网络中的最大生存时间，2 个 msl 是报文往返的最大时间。等待 2 个 msl 后，本次连接的所有报文都会过期，避免新连接收到旧连接的报文，导致数据混乱。 http/1.1、http/2、http/3 区别 http/1.1 持久连接 ：默认开启持久连接（connection: keep alive），允许在一次 tcp 连接上进行多次 http 请求和响应，减少了连接建立和关闭的开销，提高了性能。 管道化 ：在持久连接的基础上，客户端可以在还未收到上一个请求的响应时，就发送下一个请求。但服务器必须按照请求的顺序返回响应，这可能导致队头阻塞问题。 缓存处理 ：增加了更多的缓存控制头字段，如 cache control，允许更细粒度地控制缓存行为，提高资源的复用率。 分块传输编码 ：支持将响应数据分割成多个块进行传输，这样服务器可以在数据未完全生成时就开始发送，提高了传输效率。 http/2 二进制分帧层 ：http/2 将所有传输的信息分割为更小的帧，并采用二进制格式进行传输。相比 http/1.1 的文本格式，二进制格式更紧凑、解析效率更高，并且可以在不破坏兼容性的情况下扩展新功能。 多路复用 ：通过二进制分帧层，多个请求和响应可以在同一个 tcp 连接上同时并行进行，避免了 http/1.1 中的队头阻塞问题，显著提高了传输效率。 头部压缩 ：使用 hpack 算法对 http 头部进行压缩，减少了头部数据的传输量，从而提高了性能。因为 http 头部通常包含大量重复信息，hpack 算法通过建立索引表来压缩这些信息。 服务器推送 ：服务器可以主动向客户端推送资源，而无需客户端明确请求。例如，服务器可以在发送 html 页面时，同时推送相关的 css 和 javascript 文件，提前将资源缓存到客户端，提高页面加载速度。 http/3 基于 quic 协议 ：quic 协议在 udp 之上实现了类似 tcp 的可靠传输，同时具有更低的延迟。它通过减少连接建立的往返次数，如 0 rtt（零往返时间）握手，加快了数据传输的速度。 多路复用改进 ：http/3 的多路复用在 quic 协议的基础上进一步优化，彻底解决了队头阻塞问题。即使某个流出现丢包，也不会影响其他流的数据传输。 连接迁移 ：当客户端的网络环境发生变化，如从 wi fi 切换到移动数据时，http/3 可以在不中断连接的情况下，快速将连接迁移到新的网络接口上，保证数据传输的连续性。 前向纠错 ：quic 协议支持前向纠错（fec），发送方在数据包中添加额外的冗余数据，当接收方发现数据包丢失时，可以利用这些冗余数据恢复丢失的数据包，减少了重传次数，提高了传输效率。 http/2 是如何解决 http/1.1 的队头阻塞问题的？ http/2 通过二进制分帧层实现多路复用。它将所有传输的信息分割为更小的帧，并采用二进制格式传输。多个请求和响应的帧可以在同一个 tcp 连接上交错发送和接收，每个帧都有自己的标识符，客户端和服务器可以根据标识符对帧进行重组，这样即使某个请求的响应因为网络等原因延迟，也不会影响其他请求的处理和响应，从而解决了 http/1.1 中的队头阻塞问题。 http/3 的 0 rtt 握手是如何实现的？ 在首次连接时，客户端会发送带有初始密钥的 clienthello 消息。服务器收到后，返回带有服务器配置和加密数据的 serverhello 消息。客户端和服务器使用这些信息协商出会话密钥。后续客户端再次连接时，会在 clienthello 消息中带上之前保存的会话密钥和一些加密的应用数据。服务器可以直接使用该会话密钥解密数据，实现 0 rtt 握手，即无需等待额外的往返时间就可以开始传输应用数据。 websocket 与实时通信 http 协议是单向、无状态、请求 响应模式，在实时通信场景下存在致命痛点：只能由客户端主动发起请求，频繁请求带来的开销大，实时性差。 websocket 是一种基于 tcp 协议的全双工通信协议，它先通过 http 完成握手升级，之后建立持久化长连接，实现双向数据传输。 websocket 建立在 tcp 连接之上，握手完成后连接不会断开，除非主动关闭或网络异常，避免了频繁建立连接的开销。 后续数据传输使用 websocket 自有协议，数据帧体积小，比 http 更高效。 和 ajax 不同，websocket 本身不遵循同源策略（但服务端可通过配置限制客户端域名），支持跨域通信。 不仅可以传输文本（如 json），还可以传输二进制数据（如图片、音频）。 https 的理解 1. https 是超文本传输安全协议。 2. http 协议与 tls/ssl 协议的结合，增加了加密传输、身份认证和数据完整性校验机制，通过混合加密与数字证书技术解决 http 明文传输的安全隐患。 3. 与 http 协议的区别：一个是传输方式，http 是明文，容易被窃听篡改，https 则会加密；一个是端口，http 默认是 80 端口，https 则是 443；还有就是浏览器方面，http 会被标记为\"不安全\"，从而影响 seo 排名。 tls 握手流程 1. 客户端向服务器发送\"客户端随机数\"和支持的加密套件列表，发起 https 连接请求。 2. 服务器返回\"服务器随机数\"、选定的加密套件，以及包含公钥的数字证书。 3. 客户端验证服务器证书的合法性（比如是否由可信 ca 签发、域名是否匹配、是否过期），验证通过后，生成\"预主密钥\"，用服务器的公钥加密后发送给服务器。 4. 服务器用自己的私钥解密，得到预主密钥。此时，客户端和服务器都有了三个随机数：客户端随机数、服务器随机数、预主密钥，双方用相同的算法生成会话密钥（对称密钥）。 5. 双方互相发送加密的握手完成消息，后续的所有 http 数据都用会话密钥进行对称加密传输。 https 的混合加密机制是什么？为什么不只用一种加密方式？ 混合加密是结合了非对称加密和对称加密的优点。tls 握手阶段，用非对称加密（比如 rsa）来安全交换会话密钥；后续的实际数据传输，用对称加密（比如 aes）来加密。 不用纯非对称的原因是：非对称加密的加解密速度很慢，不适合大量数据的传输。 不用纯对称的原因是：对称加密的密钥如果明文传输，很容易被截获，失去加密的意义。 混合加密既保证了密钥交换的安全性，又保证了数据传输的效率。 tls 1.2 和 tls 1.3 的主要区别是什么？ 最核心的区别是握手效率和安全性。 1. 握手次数减少 ：tls 1.2 完成握手需要 2 个 rtt（往返时间），而 tls 1.3 只需要 1 个 rtt，大大降低了首次连接的延迟。 2. 支持复用 ：tls 1.3 新增了 0 rtt 功能，对于复用之前会话的客户端，可以直接发送应用数据，不需要等待握手完成，进一步提升性能。 3. 加密套件简化 ：tls 1.3 禁用了所有不安全的加密套件，只保留了最安全的几种，减少了协商的复杂度，也提升了安全性。 4. 握手过程更安全 ：tls 1.3 中，预主密钥的传输等步骤被进一步加密，即使握手信息被截获，也不会泄露关键信息。 什么是中间人攻击？https 是如何防止的？ 中间人攻击的本质是，攻击者在客户端和服务器之间，伪装成\"客户端的服务器\"和\"服务器的客户端\"，拦截并篡改双方的通信数据。 https 防止中间人攻击的核心是数字证书和非对称加密。因为服务器的公钥是放在数字证书里的，而证书是由权威的 ca 签发的。客户端在接收证书后，会验证证书的合法性。如果攻击者想要伪造证书，他没有 ca 的私钥，无法生成有效的签名，客户端会发现证书无效，从而终止连接。这样，攻击者就无法冒充服务器，也就无法完成中间人攻击。 数字证书 数字证书是由权威证书颁发机构（ca）签发的电子身份凭证，核心作用是解决 https 混合加密中「公钥的归属问题」——它能证明\"这个公钥确实属于这个服务器/域名\"，从而为 https 提供身份认证的基础，防止攻击者伪造公钥实施中间人攻击。按信任等级从低到高可分为 dv（域名验证）、ov（组织验证）、ev（扩展验证）。 但是数字证书也并非绝对安全，如果 ca 机构被攻破，或者根 ca 的私钥泄露，攻击者就可以进行伪造从而实施中间人攻击。 浏览器是如何验证服务器数字证书的合法性的？ 信任链验证： 1. 浏览器接收服务器的证书，先检查证书的基本信息：域名是否和当前访问的域名一致、证书是否在有效期内、证书的签名是否有效。 2. 如果证书是由中间 ca 签发的，浏览器会向上追溯，验证中间 ca 的证书，直到找到一个根 ca 证书。 3. 根 ca 证书是浏览器内置的、默认信任的证书。如果能追溯到信任的根 ca，并且整个链条的签名都有效，那么服务器的证书就是合法的；否则，浏览器会弹出警告，提示用户该网站的证书不可信。 https 的性能开销主要在哪里？有哪些优化手段？ 性能开销： 1. tls 握手的延迟，首次连接需要额外的 rtt，会增加页面的加载时间； 2. 加解密的计算开销，服务器和客户端都需要消耗 cpu 资源来进行加解密操作，对高并发的服务器压力更大。 优化手段： 1. 使用 tls 1.3 协议，减少握手延迟； 2. 开启会话复用，包括 session id 和 session ticket，复用之前的会话密钥，避免重复握手； 3. 开启 ocsp stapling，减少证书验证时的网络请求； 4. 使用 http/2 或 http/3 协议，http/2 的多路复用可以提升并发性能，http/3 基于 quic 协议，进一步优化了握手和重传的效率； 5. 前端层面，尽量减少混合内容的请求，避免浏览器的安全拦截。 ocsp stapling 浏览器验证数字证书时，除了检查信任链、有效期、域名匹配，还有一个关键步骤：确认这个证书有没有被 ca 提前吊销（比如服务器私钥泄露，ca 会立刻吊销对应的证书，防止被滥用）。 传统的验证方式是 ocsp 查询（在线证书状态协议）。浏览器在验证证书时，会自己主动向 ca 的 ocsp 服务器发送请求，查询当前证书的状态（有效/吊销/未知）。但是这样会导致性能延迟，因为多了一次额外的请求。而且如果 ca 的 ocsp 服务器宕机，会无法验证，影响用户体验。 因此，诞生了 ocsp stapling 技术，由服务器端配置，提前定时主动查询并缓存。当客户端发起 https 连接请求时，服务器在发送数字证书的同时，会把缓存的 ocsp 响应一起「钉」（staple）在证书后面，发送给客户端。这样无需二次验证，可以提升性能，提高可靠性。 quic 协议 tcp + tls + http/2 的握手延迟过高（需要 2 3 个 rtt），存在传输层的队头阻塞问题（一个数据包丢失，所有数据包都要等待重传）以及不支持连接迁移的问题（如果用户网络环境变化，tcp 连接会直接断开，需要重新连接）。 所以 quic 是为了解决以上问题而出现的： 1. 只需要一个 rtt 完成 tcp 连接、tls 握手和应用层协议协商的过程。 2. 可以包含多个流，并有标识，所以在丢失数据包时可以只重传丢失的数据包。 3. 用连接 id 代替四元组（源 ip、源端口、目的 ip、目的端口），网络环境变化不会影响连接。 4. 内置加密，几乎所有头部信息都被加密，更安全。 5. 对比 tcp，有着更灵活的拥塞控制算法，可以根据场景进行切换。 前端开发中，遇到的 https 相关的常见问题有哪些？ 1. 混合内容 ：页面本身是 https 协议，但是引入了 http 协议的资源，比如图片、脚本、样式表等。浏览器为了安全，会阻止这些混合内容的加载，控制台会报错。解决方法是，把所有资源都改成 https 协议，或者使用相对路径、// 开头的协议无关路径。 2. 自签名证书 ：在本地开发时，如果使用自签名的 https 证书，浏览器会弹出安全警告，需要手动添加信任。 3. 证书过期或不匹配 ：如果服务器的证书过期，或者域名和证书上的域名不匹配，浏览器也会弹出警告，导致页面无法正常访问。 https 能保证绝对的安全吗？ 不能。https 只能保证传输过程中的安全，也就是客户端和服务器之间的数据传输是安全的。它无法解决传输之外的安全问题。比如，服务器本身被黑客入侵，数据被窃取；客户端的设备被木马感染，密钥被获取；或者 ca 机构被攻破，伪造了合法的证书。这些情况，https 是无法防范的。所以，https 是网络安全的重要一环，但不是全部，还需要结合其他安全措施，比如服务器的防火墙、数据的加密存储、用户的身份认证等。 浏览器缓存策略 浏览器缓存分为 强缓存 和 协商缓存 两种机制，共同减少重复请求、加快页面加载速度。 强缓存 强缓存不会向服务器发送请求，直接从本地缓存中读取资源，返回状态码 200（from disk cache / from memory cache）。 通过以下响应头控制： 1. cache control （http/1.1，优先级高）： max age=<seconds ：资源在指定秒数内有效，例如 max age=31536000 表示缓存一年。 no cache：不使用强缓存，每次请求都需要向服务器进行协商缓存验证。 no store：完全不缓存，每次都从服务器获取最新资源。 public：资源可被任何中间代理缓存。 private：资源仅允许浏览器缓存，不允许 cdn 等中间代理缓存。 2. expires （http/1.0，优先级低）：指定资源的过期时间（绝对时间），如 expires: wed, 21 oct 2026 07:28:00 gmt。缺点是依赖客户端时间，如果客户端时间不准确会导致缓存失效判断出错。 协商缓存 强缓存过期后，浏览器会向服务器发送请求，由服务器判断资源是否有更新。如果没更新，返回 304 not modified，浏览器继续使用本地缓存；如果有更新，返回 200 和新资源。 通过以下请求/响应头配对控制： 1. etag / if none match （优先级高）： 服务器返回资源时，在响应头携带 etag（资源的唯一标识，通常是内容的哈希值）。 浏览器再次请求时，在请求头携带 if none match: <etag值 。 服务器比较当前资源的 etag 与请求中的值，相同则返回 304，不同则返回新资源。 2. last modified / if modified since （优先级低）： 服务器返回资源时，在响应头携带 last modified（资源的最后修改时间）。 浏览器再次请求时，在请求头携带 if modified since: <last modified值 。 服务器比较资源的最后修改时间，没有变化则返回 304，有变化则返回新资源。 缺点：精度只到秒级，1 秒内的多次修改无法识别；文件内容没变但修改时间变了（如重新保存）也会导致缓存失效。 缓存流程总结 浏览器请求资源时：先检查强缓存（cache control → expires）→ 命中则直接使用本地缓存 → 未命中则发起协商缓存请求（etag → last modified）→ 服务器判断资源是否变化 → 未变化返回 304 使用缓存 → 变化则返回 200 和新资源。"
  },
  {
    "slug": "024-nodejs",
    "title": "NodeJS",
    "category": "运行时",
    "sourcePath": "docs/运行时/NodeJS.md",
    "markdown": "# NodeJS\n\n## NodeJS 事件循环\n\n### 1. timers 阶段\n\n- 核心任务：执行 `setTimeout()`、`setInterval()` 的到期回调函数；\n- 注意点：`setTimeout(cb, 0)` 不是立即执行，而是至少等待 1ms（Node.js 底层限制），回调会被放入 timers 队列，等本轮事件循环的 timers 阶段执行；\n- 优先级：高于后续的 pending callbacks、poll 等阶段，但低于微任务。\n\n### 2. pending callbacks 阶段\n\n- 核心任务：执行延迟到下一轮循环的 I/O 回调（比如某些系统级错误的回调，如 TCP 连接失败）；\n- 开发者很少直接接触这个阶段，属于 libuv 内部的\"兜底\"处理。\n\n### 3. idle/prepare 阶段\n\n- 核心任务：仅 Node.js 内部使用（比如准备 poll 阶段的轮询），开发者无需关注。\n\n### 4. poll 阶段（最核心）\n\n这是事件循环停留时间最长的阶段，核心做两件事：\n\n- **执行 I/O 回调**：执行已完成的 I/O 操作的回调（如文件读取、网络请求完成的回调）；\n- **等待新的 I/O 事件**：如果 poll 队列为空，事件循环会在这里阻塞等待，直到有新的 I/O 事件触发，或到达 check 阶段的触发条件（比如有 `setImmediate` 回调）。\n\n触发离开 poll 阶段的条件：\n\n- poll 队列清空；\n- 有 timers 回调到期；\n- 有 `setImmediate` 回调需要执行。\n\n### 5. check 阶段\n\n- 核心任务：执行 `setImmediate()` 的回调函数；\n- `setImmediate` 的设计目标：在 poll 阶段结束后立即执行回调，优先级低于 timers 但高于 close callbacks。\n\n### 6. close callbacks 阶段\n\n- 核心任务：执行关闭相关的回调（如 `socket.on('close', cb)`、`fs.close()` 的回调）；\n- 本轮事件循环的最后一个阶段，执行完后回到 timers 阶段开始下一轮循环。\n\n## Node.js setTimeout 最低延迟 1ms 的底层原因\n\nNode.js 限制 `setTimeout` 最小延迟为 1ms，本质是为了保障事件循环的公平性，避免定时器回调抢占主线程；同时受底层 libuv 库的轮询精度、操作系统时钟粒度限制，最终在源码层面强制将小于 1ms 的延迟修正为 1ms。\n\n## NodeJS 有哪些全局对象\n\n### global\n\n- 定义：`global` 是 Node.js 中的全局命名空间，在 Node.js REPL 环境中，它是全局对象；在模块中，`global` 对象也可以访问，通过它可以访问到所有的全局变量和函数。\n- 使用方式：例如，在模块中通过 `global` 访问全局变量 `process`：`const process = global.process;`，不过通常直接使用 `process` 即可，无需通过 `global`。\n\n### process\n\n- 定义：`process` 对象是一个全局对象，提供了有关当前 Node.js 进程的信息并允许控制该进程。它是 `EventEmitter` 的实例。\n- 使用方式：\n  - 获取环境变量：通过 `process.env` 获取当前进程的环境变量，如 `const myEnvVar = process.env.MY_VARIABLE;`。\n  - 退出进程：使用 `process.exit([code])` 方法，`code` 为退出码，0 表示正常退出，非 0 表示异常退出，例如 `process.exit(1);`。\n  - 监听事件：`process` 对象可以监听一些事件，如 `process.on('exit', function() { console.log('进程即将退出'); });`。\n\n### console\n\n- 定义：`console` 是用于打印到标准输出和标准错误的全局对象，提供了一系列用于调试和日志记录的方法。\n- 使用方式：\n  - 打印信息到控制台：`console.log('普通日志信息');`\n  - 打印错误信息：`console.error('错误信息');`，这些错误信息通常会输出到标准错误流。\n  - 计时功能：`console.time('test');` 开始计时，`console.timeEnd('test');` 结束计时并输出所花费的时间。\n\n### Buffer\n\n- 定义：`Buffer` 类用于处理二进制数据，在 Node.js 中，它是一个全局变量，可以直接使用。`Buffer` 实例类似于整数数组，但对应于 V8 堆外的一块原始内存。\n- 使用方式：\n  - 创建 `Buffer` 实例：可以通过多种方式创建，如 `const buf = Buffer.from('hello', 'utf8');` 将字符串转换为 `Buffer` 实例。`const buf2 = Buffer.alloc(10);` 创建一个指定长度的 `Buffer` 实例，初始值为 0。\n  - 操作 `Buffer` 数据：`buf.write('world', 0);` 在 `Buffer` 指定位置写入数据。`buf.toString('utf8');` 将 `Buffer` 数据转换为字符串。\n\n### \\_\\_dirname\n\n- 定义：`__dirname` 是一个全局变量，它返回当前执行脚本所在的目录的完整路径。\n- 使用方式：例如在一个模块中，要获取当前模块所在目录下某个文件的路径，可以这样写 `const path = require('path'); const filePath = path.join(__dirname, 'test.txt');`。\n\n### \\_\\_filename\n\n- 定义：`__filename` 是一个全局变量，它返回当前执行脚本的文件名的完整路径。\n- 使用方式：在模块中获取当前模块的完整路径名，比如 `console.log(__filename);` 会输出当前模块的绝对路径。\n\n### setTimeout\n\n- 定义：`setTimeout` 函数用于在指定的毫秒数后执行一个函数。它是 JavaScript 在浏览器和 Node.js 中都有的全局函数。\n- 使用方式：`const timeoutId = setTimeout(() => { console.log('延迟执行的代码'); }, 1000);`，返回的 `timeoutId` 可用于取消该定时器，如 `clearTimeout(timeoutId);`。\n\n### setInterval\n\n- 定义：`setInterval` 函数用于按照指定的时间间隔（毫秒）重复执行一个函数。\n- 使用方式：`const intervalId = setInterval(() => { console.log('每隔1秒执行一次'); }, 1000);`，同样可以通过 `clearInterval(intervalId);` 来取消该定时器。\n\n## process.env 在 Node.js 中有什么作用？\n\n`process.env` 用于获取当前 Node.js 进程的环境变量。环境变量可以用来配置应用程序的不同运行参数，比如数据库连接字符串、服务器端口等。这样可以在不修改代码的情况下，根据不同的运行环境（开发、测试、生产）设置不同的值，提高应用程序的灵活性和可部署性。\n\n## Buffer 和普通数组有什么区别？\n\n- `Buffer` 用于处理二进制数据，它对应于 V8 堆外的一块原始内存，主要用于与网络、文件系统等进行二进制数据交互。\n- 普通数组在 V8 堆内分配内存，主要用于存储 JavaScript 对象和基本数据类型。\n- `Buffer` 的操作是针对二进制数据的，如读写字节等，而数组主要用于数据的逻辑组织和操作。\n- 此外，`Buffer` 的内存分配和管理方式与普通数组不同，`Buffer` 更注重与底层系统的交互。\n\n## \\_\\_dirname 和 process.cwd() 有什么区别？\n\n- `__dirname` 返回当前执行脚本所在的目录的完整路径，而 `process.cwd()` 返回 Node.js 进程当前工作目录的路径。\n- 如果在一个模块中调用 `__dirname`，它始终是该模块文件所在的目录。而 `process.cwd()` 取决于启动 Node.js 进程时所在的目录，例如在项目根目录启动 Node.js 进程，即使在子目录的模块中调用 `process.cwd()`，返回的也是项目根目录。\n\n## NodeJS 调试\n\n### 使用 console.log 调试\n\n通过在代码中合适的位置添加 `console.log` 语句，将变量的值、程序执行状态等信息输出到控制台，以此来观察程序的运行情况，辅助定位问题。\n\n### Node.js 内置调试器\n\n- 启动调试会话：在命令行中使用 `node inspect <script.js>` 来启动对指定脚本的调试，例如 `node inspect test.js`。这会启动调试会话并暂停在脚本的第一行。\n- 设置断点：在调试会话中，可以使用 `break <line_number>` 命令在指定行号设置断点，例如 `break 5` 就在第 5 行设置了断点。也可以使用 `setBreakpoint()` 在当前行设置断点。\n- 执行程序：使用 `cont` 命令继续执行程序，当程序执行到断点处会暂停。\n- 查看信息：程序暂停时，可以使用 `repl` 命令进入交互式 REPL 环境，在其中查看变量的值，如输入变量名就可以看到其当前值。还可以使用 `backtrace` 命令查看调用栈信息。\n\n### 使用 Chrome DevTools 调试\n\n- 启动 Node.js 应用并开启调试模式：在命令行中使用 `node --inspect <script.js>` 启动应用，例如 `node --inspect test.js`。这会启动应用并监听调试端口（默认 `9229`）。\n- 打开 Chrome 浏览器并连接调试：在 Chrome 浏览器地址栏输入 `chrome://inspect`，进入调试界面。在\"远程目标\"下会显示正在运行的 Node.js 进程，点击\"打开专用 DevTools for Node\"链接，就会打开 Chrome DevTools 界面。\n- 调试操作：在 DevTools 的\"Sources\"面板中，可以找到 Node.js 脚本文件，在代码中设置断点。当程序运行到断点处暂停，就可以像调试前端 JavaScript 代码一样，查看变量值、调用栈，单步执行代码等。\n\n### 使用 VS Code 调试\n\nVS Code 内置了对 Node.js 的调试支持，主要有两种模式：\n\n#### Launch 模式（启动调试）\n\n由 VS Code 直接启动 Node.js 进程并附加调试器。在项目根目录创建 `.vscode/launch.json` 配置文件，配置 `type: \"node\"`、`request: \"launch\"`、`program` 等。配置完成后，在代码中需要暂停的行号左侧点击即可设置断点，然后按 `F5` 启动调试。程序会在断点处暂停，左侧面板可以查看变量值、调用栈、监视表达式等。\n\n#### Attach 模式（附加调试）\n\n先以调试模式启动 Node.js 进程，再由 VS Code 附加上去。适用于调试已经在运行的进程或需要特定启动参数的场景。\n\n1. 启动 Node.js 时添加 `--inspect` 参数（如 `node --inspect app.js` 监听 9229 端口，`--inspect-brk` 在第一行暂停）。\n2. 配置 `launch.json` 的 Attach 模式（`request: \"attach\"`、`port: 9229`）。\n3. 按 `F5` 附加调试器到运行中的 Node.js 进程。\n\n#### 常用调试操作\n\n- `F5`：继续执行 / 启动调试\n- `F10`：单步跳过（Step Over），执行当前行但不进入函数内部\n- `F11`：单步进入（Step Into），进入当前行调用的函数\n- `Shift + F11`：单步跳出（Step Out），执行完当前函数并返回调用处\n- `Ctrl + Shift + F5`：重启调试\n- `Shift + F5`：停止调试\n\n## Node.js 多进程模型\n\n### child_process 模块\n\n用于创建独立的子进程，执行外部命令或 Node.js 脚本。\n\n主要 API：\n\n- `spawn()`：启动一个子进程，返回流，适合处理大量数据。\n- `exec()`：启动一个 shell，执行命令，缓存输出。\n- `execFile()`：直接执行可执行文件，比 `exec()` 更高效。\n- `fork()`：专门用于创建 Node.js 子进程，自动建立 IPC 通道，是实现多进程 Node.js 应用的基础。\n\n### cluster 模块\n\n基于 `child_process.fork()` 封装，用于构建共享同一端口的多进程 Node.js 服务。\n\n模型结构：\n\n- **主进程（Master）**：不处理业务逻辑，负责创建和管理工作进程，实现负载均衡（默认采用轮询策略）。\n- **工作进程（Worker）**：每个进程都是独立的 Node.js 实例，拥有自己的事件循环，负责处理客户端请求。\n\n优势：无需修改应用代码即可利用多核 CPU，提升服务吞吐量和可靠性。\n\n### 进程间通信（IPC）实现方式\n\n#### 内置 IPC 通道（推荐）\n\n- 适用场景：通过 `child_process.fork()` 或 `cluster` 创建的父子进程之间。\n- 实现原理：Node.js 在创建子进程时，会在父进程和子进程之间建立一个匿名的 Unix 域套接字（或 Windows 上的命名管道），用于高效传递消息。\n- API 使用：\n  - 发送消息：`process.send(message)`（子进程）或 `child.send(message)`（父进程）。\n  - 接收消息：监听 `message` 事件：`process.on('message', (msg) => { ... })`。\n- 注意：传递的消息会被序列化为 JSON，因此不能直接传递函数、`Buffer` 等特殊类型。\n\n#### 其他 IPC 方案\n\n- **网络套接字**：使用 TCP/UDP 套接字进行通信，适用于跨机器或非父子关系的进程。\n- **共享内存**：通过 `mmap` 或第三方库（如 `shared-memory`）实现，但 Node.js 原生支持有限，多用于高性能场景。\n- **文件系统**：通过读写文件或目录作为数据交换的中介，适合大数据量或持久化需求，但效率较低。\n- **消息队列**：引入 Redis、RabbitMQ 等中间件，实现异步、解耦的进程间通信。\n",
    "headings": [
      {
        "depth": 1,
        "text": "NodeJS",
        "slug": "nodejs"
      },
      {
        "depth": 2,
        "text": "NodeJS 事件循环",
        "slug": "nodejs-事件循环"
      },
      {
        "depth": 3,
        "text": "1. timers 阶段",
        "slug": "1-timers-阶段"
      },
      {
        "depth": 3,
        "text": "2. pending callbacks 阶段",
        "slug": "2-pending-callbacks-阶段"
      },
      {
        "depth": 3,
        "text": "3. idle/prepare 阶段",
        "slug": "3-idleprepare-阶段"
      },
      {
        "depth": 3,
        "text": "4. poll 阶段（最核心）",
        "slug": "4-poll-阶段最核心"
      },
      {
        "depth": 3,
        "text": "5. check 阶段",
        "slug": "5-check-阶段"
      },
      {
        "depth": 3,
        "text": "6. close callbacks 阶段",
        "slug": "6-close-callbacks-阶段"
      },
      {
        "depth": 2,
        "text": "Node.js setTimeout 最低延迟 1ms 的底层原因",
        "slug": "nodejs-settimeout-最低延迟-1ms-的底层原因"
      },
      {
        "depth": 2,
        "text": "NodeJS 有哪些全局对象",
        "slug": "nodejs-有哪些全局对象"
      },
      {
        "depth": 3,
        "text": "global",
        "slug": "global"
      },
      {
        "depth": 3,
        "text": "process",
        "slug": "process"
      },
      {
        "depth": 3,
        "text": "console",
        "slug": "console"
      },
      {
        "depth": 3,
        "text": "Buffer",
        "slug": "buffer"
      },
      {
        "depth": 3,
        "text": "\\_\\_dirname",
        "slug": "__dirname"
      },
      {
        "depth": 3,
        "text": "\\_\\_filename",
        "slug": "__filename"
      },
      {
        "depth": 3,
        "text": "setTimeout",
        "slug": "settimeout"
      },
      {
        "depth": 3,
        "text": "setInterval",
        "slug": "setinterval"
      },
      {
        "depth": 2,
        "text": "process.env 在 Node.js 中有什么作用？",
        "slug": "processenv-在-nodejs-中有什么作用"
      },
      {
        "depth": 2,
        "text": "Buffer 和普通数组有什么区别？",
        "slug": "buffer-和普通数组有什么区别"
      },
      {
        "depth": 2,
        "text": "\\_\\_dirname 和 process.cwd() 有什么区别？",
        "slug": "__dirname-和-processcwd-有什么区别"
      },
      {
        "depth": 2,
        "text": "NodeJS 调试",
        "slug": "nodejs-调试"
      },
      {
        "depth": 3,
        "text": "使用 console.log 调试",
        "slug": "使用-consolelog-调试"
      },
      {
        "depth": 3,
        "text": "Node.js 内置调试器",
        "slug": "nodejs-内置调试器"
      },
      {
        "depth": 3,
        "text": "使用 Chrome DevTools 调试",
        "slug": "使用-chrome-devtools-调试"
      },
      {
        "depth": 3,
        "text": "使用 VS Code 调试",
        "slug": "使用-vs-code-调试"
      },
      {
        "depth": 4,
        "text": "Launch 模式（启动调试）",
        "slug": "launch-模式启动调试"
      },
      {
        "depth": 4,
        "text": "Attach 模式（附加调试）",
        "slug": "attach-模式附加调试"
      },
      {
        "depth": 4,
        "text": "常用调试操作",
        "slug": "常用调试操作"
      },
      {
        "depth": 2,
        "text": "Node.js 多进程模型",
        "slug": "nodejs-多进程模型"
      },
      {
        "depth": 3,
        "text": "child_process 模块",
        "slug": "child_process-模块"
      },
      {
        "depth": 3,
        "text": "cluster 模块",
        "slug": "cluster-模块"
      },
      {
        "depth": 3,
        "text": "进程间通信（IPC）实现方式",
        "slug": "进程间通信ipc实现方式"
      },
      {
        "depth": 4,
        "text": "内置 IPC 通道（推荐）",
        "slug": "内置-ipc-通道推荐"
      },
      {
        "depth": 4,
        "text": "其他 IPC 方案",
        "slug": "其他-ipc-方案"
      }
    ],
    "searchText": "nodejs 运行时 nodejs nodejs 事件循环 1. timers 阶段 核心任务：执行 settimeout()、setinterval() 的到期回调函数； 注意点：settimeout(cb, 0) 不是立即执行，而是至少等待 1ms（node.js 底层限制），回调会被放入 timers 队列，等本轮事件循环的 timers 阶段执行； 优先级：高于后续的 pending callbacks、poll 等阶段，但低于微任务。 2. pending callbacks 阶段 核心任务：执行延迟到下一轮循环的 i/o 回调（比如某些系统级错误的回调，如 tcp 连接失败）； 开发者很少直接接触这个阶段，属于 libuv 内部的\"兜底\"处理。 3. idle/prepare 阶段 核心任务：仅 node.js 内部使用（比如准备 poll 阶段的轮询），开发者无需关注。 4. poll 阶段（最核心） 这是事件循环停留时间最长的阶段，核心做两件事： 执行 i/o 回调 ：执行已完成的 i/o 操作的回调（如文件读取、网络请求完成的回调）； 等待新的 i/o 事件 ：如果 poll 队列为空，事件循环会在这里阻塞等待，直到有新的 i/o 事件触发，或到达 check 阶段的触发条件（比如有 setimmediate 回调）。 触发离开 poll 阶段的条件： poll 队列清空； 有 timers 回调到期； 有 setimmediate 回调需要执行。 5. check 阶段 核心任务：执行 setimmediate() 的回调函数； setimmediate 的设计目标：在 poll 阶段结束后立即执行回调，优先级低于 timers 但高于 close callbacks。 6. close callbacks 阶段 核心任务：执行关闭相关的回调（如 socket.on('close', cb)、fs.close() 的回调）； 本轮事件循环的最后一个阶段，执行完后回到 timers 阶段开始下一轮循环。 node.js settimeout 最低延迟 1ms 的底层原因 node.js 限制 settimeout 最小延迟为 1ms，本质是为了保障事件循环的公平性，避免定时器回调抢占主线程；同时受底层 libuv 库的轮询精度、操作系统时钟粒度限制，最终在源码层面强制将小于 1ms 的延迟修正为 1ms。 nodejs 有哪些全局对象 global 定义：global 是 node.js 中的全局命名空间，在 node.js repl 环境中，它是全局对象；在模块中，global 对象也可以访问，通过它可以访问到所有的全局变量和函数。 使用方式：例如，在模块中通过 global 访问全局变量 process：const process = global.process;，不过通常直接使用 process 即可，无需通过 global。 process 定义：process 对象是一个全局对象，提供了有关当前 node.js 进程的信息并允许控制该进程。它是 eventemitter 的实例。 使用方式： 获取环境变量：通过 process.env 获取当前进程的环境变量，如 const myenvvar = process.env.my variable;。 退出进程：使用 process.exit([code]) 方法，code 为退出码，0 表示正常退出，非 0 表示异常退出，例如 process.exit(1);。 监听事件：process 对象可以监听一些事件，如 process.on('exit', function() { console.log('进程即将退出'); });。 console 定义：console 是用于打印到标准输出和标准错误的全局对象，提供了一系列用于调试和日志记录的方法。 使用方式： 打印信息到控制台：console.log('普通日志信息'); 打印错误信息：console.error('错误信息');，这些错误信息通常会输出到标准错误流。 计时功能：console.time('test'); 开始计时，console.timeend('test'); 结束计时并输出所花费的时间。 buffer 定义：buffer 类用于处理二进制数据，在 node.js 中，它是一个全局变量，可以直接使用。buffer 实例类似于整数数组，但对应于 v8 堆外的一块原始内存。 使用方式： 创建 buffer 实例：可以通过多种方式创建，如 const buf = buffer.from('hello', 'utf8'); 将字符串转换为 buffer 实例。const buf2 = buffer.alloc(10); 创建一个指定长度的 buffer 实例，初始值为 0。 操作 buffer 数据：buf.write('world', 0); 在 buffer 指定位置写入数据。buf.tostring('utf8'); 将 buffer 数据转换为字符串。 \\ \\ dirname 定义： dirname 是一个全局变量，它返回当前执行脚本所在的目录的完整路径。 使用方式：例如在一个模块中，要获取当前模块所在目录下某个文件的路径，可以这样写 const path = require('path'); const filepath = path.join( dirname, 'test.txt');。 \\ \\ filename 定义： filename 是一个全局变量，它返回当前执行脚本的文件名的完整路径。 使用方式：在模块中获取当前模块的完整路径名，比如 console.log( filename); 会输出当前模块的绝对路径。 settimeout 定义：settimeout 函数用于在指定的毫秒数后执行一个函数。它是 javascript 在浏览器和 node.js 中都有的全局函数。 使用方式：const timeoutid = settimeout(() = { console.log('延迟执行的代码'); }, 1000);，返回的 timeoutid 可用于取消该定时器，如 cleartimeout(timeoutid);。 setinterval 定义：setinterval 函数用于按照指定的时间间隔（毫秒）重复执行一个函数。 使用方式：const intervalid = setinterval(() = { console.log('每隔1秒执行一次'); }, 1000);，同样可以通过 clearinterval(intervalid); 来取消该定时器。 process.env 在 node.js 中有什么作用？ process.env 用于获取当前 node.js 进程的环境变量。环境变量可以用来配置应用程序的不同运行参数，比如数据库连接字符串、服务器端口等。这样可以在不修改代码的情况下，根据不同的运行环境（开发、测试、生产）设置不同的值，提高应用程序的灵活性和可部署性。 buffer 和普通数组有什么区别？ buffer 用于处理二进制数据，它对应于 v8 堆外的一块原始内存，主要用于与网络、文件系统等进行二进制数据交互。 普通数组在 v8 堆内分配内存，主要用于存储 javascript 对象和基本数据类型。 buffer 的操作是针对二进制数据的，如读写字节等，而数组主要用于数据的逻辑组织和操作。 此外，buffer 的内存分配和管理方式与普通数组不同，buffer 更注重与底层系统的交互。 \\ \\ dirname 和 process.cwd() 有什么区别？ dirname 返回当前执行脚本所在的目录的完整路径，而 process.cwd() 返回 node.js 进程当前工作目录的路径。 如果在一个模块中调用 dirname，它始终是该模块文件所在的目录。而 process.cwd() 取决于启动 node.js 进程时所在的目录，例如在项目根目录启动 node.js 进程，即使在子目录的模块中调用 process.cwd()，返回的也是项目根目录。 nodejs 调试 使用 console.log 调试 通过在代码中合适的位置添加 console.log 语句，将变量的值、程序执行状态等信息输出到控制台，以此来观察程序的运行情况，辅助定位问题。 node.js 内置调试器 启动调试会话：在命令行中使用 node inspect <script.js 来启动对指定脚本的调试，例如 node inspect test.js。这会启动调试会话并暂停在脚本的第一行。 设置断点：在调试会话中，可以使用 break <line number 命令在指定行号设置断点，例如 break 5 就在第 5 行设置了断点。也可以使用 setbreakpoint() 在当前行设置断点。 执行程序：使用 cont 命令继续执行程序，当程序执行到断点处会暂停。 查看信息：程序暂停时，可以使用 repl 命令进入交互式 repl 环境，在其中查看变量的值，如输入变量名就可以看到其当前值。还可以使用 backtrace 命令查看调用栈信息。 使用 chrome devtools 调试 启动 node.js 应用并开启调试模式：在命令行中使用 node inspect <script.js 启动应用，例如 node inspect test.js。这会启动应用并监听调试端口（默认 9229）。 打开 chrome 浏览器并连接调试：在 chrome 浏览器地址栏输入 chrome://inspect，进入调试界面。在\"远程目标\"下会显示正在运行的 node.js 进程，点击\"打开专用 devtools for node\"链接，就会打开 chrome devtools 界面。 调试操作：在 devtools 的\"sources\"面板中，可以找到 node.js 脚本文件，在代码中设置断点。当程序运行到断点处暂停，就可以像调试前端 javascript 代码一样，查看变量值、调用栈，单步执行代码等。 使用 vs code 调试 vs code 内置了对 node.js 的调试支持，主要有两种模式： launch 模式（启动调试） 由 vs code 直接启动 node.js 进程并附加调试器。在项目根目录创建 .vscode/launch.json 配置文件，配置 type: \"node\"、request: \"launch\"、program 等。配置完成后，在代码中需要暂停的行号左侧点击即可设置断点，然后按 f5 启动调试。程序会在断点处暂停，左侧面板可以查看变量值、调用栈、监视表达式等。 attach 模式（附加调试） 先以调试模式启动 node.js 进程，再由 vs code 附加上去。适用于调试已经在运行的进程或需要特定启动参数的场景。 1. 启动 node.js 时添加 inspect 参数（如 node inspect app.js 监听 9229 端口， inspect brk 在第一行暂停）。 2. 配置 launch.json 的 attach 模式（request: \"attach\"、port: 9229）。 3. 按 f5 附加调试器到运行中的 node.js 进程。 常用调试操作 f5：继续执行 / 启动调试 f10：单步跳过（step over），执行当前行但不进入函数内部 f11：单步进入（step into），进入当前行调用的函数 shift + f11：单步跳出（step out），执行完当前函数并返回调用处 ctrl + shift + f5：重启调试 shift + f5：停止调试 node.js 多进程模型 child process 模块 用于创建独立的子进程，执行外部命令或 node.js 脚本。 主要 api： spawn()：启动一个子进程，返回流，适合处理大量数据。 exec()：启动一个 shell，执行命令，缓存输出。 execfile()：直接执行可执行文件，比 exec() 更高效。 fork()：专门用于创建 node.js 子进程，自动建立 ipc 通道，是实现多进程 node.js 应用的基础。 cluster 模块 基于 child process.fork() 封装，用于构建共享同一端口的多进程 node.js 服务。 模型结构： 主进程（master） ：不处理业务逻辑，负责创建和管理工作进程，实现负载均衡（默认采用轮询策略）。 工作进程（worker） ：每个进程都是独立的 node.js 实例，拥有自己的事件循环，负责处理客户端请求。 优势：无需修改应用代码即可利用多核 cpu，提升服务吞吐量和可靠性。 进程间通信（ipc）实现方式 内置 ipc 通道（推荐） 适用场景：通过 child process.fork() 或 cluster 创建的父子进程之间。 实现原理：node.js 在创建子进程时，会在父进程和子进程之间建立一个匿名的 unix 域套接字（或 windows 上的命名管道），用于高效传递消息。 api 使用： 发送消息：process.send(message)（子进程）或 child.send(message)（父进程）。 接收消息：监听 message 事件：process.on('message', (msg) = { ... })。 注意：传递的消息会被序列化为 json，因此不能直接传递函数、buffer 等特殊类型。 其他 ipc 方案 网络套接字 ：使用 tcp/udp 套接字进行通信，适用于跨机器或非父子关系的进程。 共享内存 ：通过 mmap 或第三方库（如 shared memory）实现，但 node.js 原生支持有限，多用于高性能场景。 文件系统 ：通过读写文件或目录作为数据交换的中介，适合大数据量或持久化需求，但效率较低。 消息队列 ：引入 redis、rabbitmq 等中间件，实现异步、解耦的进程间通信。"
  },
  {
    "slug": "025-自我介绍",
    "title": "自我介绍",
    "category": "面试准备",
    "sourcePath": "docs/面试准备/自我介绍.md",
    "markdown": "# 自我介绍\n\n## 中文版\n\n面试官你好，我叫【姓名】，毕业于【院校名称】，【学历】，【专业】。\n\n曾就职于【公司】【部门】，任【职务】，主要负责。\n\n工作的主要技术栈是TypeScript、C++操作Chromium内核和鸿蒙的ArkTs。\n\n华为期间，我有4段项目经历。\n\n1. 系统级的UI自适应系统，使用TypeScript进行目标页面的布局识别，并自动调整使其适配宽屏界面。\n2. 针对开发者的缓存接口，提供在页面加载前，提前将资源注入内存缓存的能力。\n3. 针对开发者的JS编译优化接口，提供在页面加载前，提前编译JS生成字节码缓存的能力。\n4. 针对开发者的首屏渲染优化接口，通过调整Web内核的渲染机制，减少白屏时间。\n\n## 英文版\n\nHi, My name is Tao Zhuowei. I graduated from Shenyang University of Technology. And I major in Software Engineering.\n\nPreviously, I worked at Hangzhou Huawei Research Institute, 2012 Laboratory, Web Team. My main responsibilities included 3 key areas.\n\nFor the first one, I develope system-level functions for wide screen device.\n\nAnd Second, I work on performance optimization of Harmony App. I write interface for developers to improve there HarmonyOS Web App. Such as Taobao、Kuaishou and Meituan.\n\nThe last one is analyzing the performance bottleneck of Harmony Web Page. I analyze why they are slower than Android and give the solutions or suggestions to developer. I also went on-site at Alipay、Taobao as a Harmony technical expert, assisting their developers in solving technical issues when building Harmony Apps.\n\nDuring my time at Huawei, I have 4 core products:\n\n1. First project is a system-level UI adaptive plugin. I used TypeScript to identify the layout of the target Web page and automatically adjust it to adapt to wide screen devices.\n2. Second product is an interface for developer which provides the ability to pre-inject resources into the memory cache before page loading.\n3. And Except that, for giving better experience of users who use our Harmony Web Apps, I also design an interface to pre-compile Javascript and generate CacheCode to optimize the first contentful paint.\n4. As for the last project, it's an Chromium-based interface to optimize the performance when Web page first start. It helps Harmony Apps has less while screen time and user can earlier to see the content.\n",
    "headings": [
      {
        "depth": 1,
        "text": "自我介绍",
        "slug": "自我介绍"
      },
      {
        "depth": 2,
        "text": "中文版",
        "slug": "中文版"
      },
      {
        "depth": 2,
        "text": "英文版",
        "slug": "英文版"
      }
    ],
    "searchText": "自我介绍 面试准备 自我介绍 中文版 面试官你好，我叫【姓名】，毕业于【院校名称】，【学历】，【专业】。 曾就职于【公司】【部门】，任【职务】，主要负责。 工作的主要技术栈是typescript、c++操作chromium内核和鸿蒙的arkts。 华为期间，我有4段项目经历。 1. 系统级的ui自适应系统，使用typescript进行目标页面的布局识别，并自动调整使其适配宽屏界面。 2. 针对开发者的缓存接口，提供在页面加载前，提前将资源注入内存缓存的能力。 3. 针对开发者的js编译优化接口，提供在页面加载前，提前编译js生成字节码缓存的能力。 4. 针对开发者的首屏渲染优化接口，通过调整web内核的渲染机制，减少白屏时间。 英文版 hi, my name is tao zhuowei. i graduated from shenyang university of technology. and i major in software engineering. previously, i worked at hangzhou huawei research institute, 2012 laboratory, web team. my main responsibilities included 3 key areas. for the first one, i develope system level functions for wide screen device. and second, i work on performance optimization of harmony app. i write interface for developers to improve there harmonyos web app. such as taobao、kuaishou and meituan. the last one is analyzing the performance bottleneck of harmony web page. i analyze why they are slower than android and give the solutions or suggestions to developer. i also went on site at alipay、taobao as a harmony technical expert, assisting their developers in solving technical issues when building harmony apps. during my time at huawei, i have 4 core products: 1. first project is a system level ui adaptive plugin. i used typescript to identify the layout of the target web page and automatically adjust it to adapt to wide screen devices. 2. second product is an interface for developer which provides the ability to pre inject resources into the memory cache before page loading. 3. and except that, for giving better experience of users who use our harmony web apps, i also design an interface to pre compile javascript and generate cachecode to optimize the first contentful paint. 4. as for the last project, it's an chromium based interface to optimize the performance when web page first start. it helps harmony apps has less while screen time and user can earlier to see the content."
  },
  {
    "slug": "026-项目介绍",
    "title": "项目介绍",
    "category": "面试准备",
    "sourcePath": "docs/面试准备/项目介绍.md",
    "markdown": "# 项目介绍\n\n## 介绍下做过的项目/项目中的难点\n\n### 1. 系统级的UI自适应系统\n\n使用TypeScript进行目标页面的布局识别，并自动调整使其适配宽屏界面。\n\n- 核心技术栈是TypeScript + Webpack\n- 我在其中主要负责的是项目的构建和页面元素的识别与处理。\n- 构建主要是通过Webpack和ES6 `import`进行模块的拆分，打包构建。配置在开发环境下开启日志以及自研的调试工具，在生产环境下做最小打包、关闭日志和调试工具。\n- 识别主要是通过DOM接口，获取元素的位置、大小等关键信息，识别出对应的布局模式，并应用对应的模式处理，使其适配宽屏。这个处理过程并非同步，而是考虑性能做了异步队列，在空闲时一次性进行操作。\n\n### 2. 缓存接口\n\n针对开发者的缓存接口，提供在页面加载前，提前将资源注入内存缓存的能力。\n\n- 这个项目由我完全主导设计并实现，以及提供基础测试。\n- 首先是内存缓存的研究，包括源码中针对内存缓存生成、读取的一系列条件，如何根据本地资源模拟构建出内存缓存需要的数据格式，然后将其注入并让内核可以正常使用。\n- 这里涉及的难点主要是构造的资源对象在使用之前会失活导致被回收。解决方案是找到了Chromium内部的`KeepAlive`类，在`Resource`对象中持有`KeepAlive`对象作为成员属性，可以在垃圾回收中保活，当需要删除时，将其置空即可回收。\n\n### 3. JS编译优化接口\n\n针对开发者的JS编译优化接口，提供在页面加载前，提前编译JS生成字节码缓存的能力。\n\n- 这个项目由我完全主导设计并实现，以及提供基础测试。\n- 首先是对于JS编译生成字节码缓存流程的研究。之后构造出Compile方法需要的结构体来提前生成字节码缓存。同时，由于`CodeCache`依赖`DiskCache`，在内部自己实现了一套简易的disk cache读写接口，用于缓存JS文件本身。\n- 这个项目的难点在于disk cache系统的设计，内部采用了索引机制，通过索引文件找到对应的缓存实现高效的读、写和查。\n\n### 4. 首屏渲染优化接口\n\n针对开发者的首屏渲染优化接口，通过调整Web内核的渲染机制，减少白屏时间。\n\n- 这个项目由我完全主导设计并实现，以及提供基础测试。\n- 项目主要是基于Chromium HTML Parser过程的优化。\n- 主要难点是对Parser过程的拆解并找到优化点。Chromium的Parser过程并非一次性的，而是分段的，通过优化分段逻辑，让分段更细粒度，达到优化白屏的效果。\n",
    "headings": [
      {
        "depth": 1,
        "text": "项目介绍",
        "slug": "项目介绍"
      },
      {
        "depth": 2,
        "text": "介绍下做过的项目/项目中的难点",
        "slug": "介绍下做过的项目项目中的难点"
      },
      {
        "depth": 3,
        "text": "1. 系统级的UI自适应系统",
        "slug": "1-系统级的ui自适应系统"
      },
      {
        "depth": 3,
        "text": "2. 缓存接口",
        "slug": "2-缓存接口"
      },
      {
        "depth": 3,
        "text": "3. JS编译优化接口",
        "slug": "3-js编译优化接口"
      },
      {
        "depth": 3,
        "text": "4. 首屏渲染优化接口",
        "slug": "4-首屏渲染优化接口"
      }
    ],
    "searchText": "项目介绍 面试准备 项目介绍 介绍下做过的项目/项目中的难点 1. 系统级的ui自适应系统 使用typescript进行目标页面的布局识别，并自动调整使其适配宽屏界面。 核心技术栈是typescript + webpack 我在其中主要负责的是项目的构建和页面元素的识别与处理。 构建主要是通过webpack和es6 import进行模块的拆分，打包构建。配置在开发环境下开启日志以及自研的调试工具，在生产环境下做最小打包、关闭日志和调试工具。 识别主要是通过dom接口，获取元素的位置、大小等关键信息，识别出对应的布局模式，并应用对应的模式处理，使其适配宽屏。这个处理过程并非同步，而是考虑性能做了异步队列，在空闲时一次性进行操作。 2. 缓存接口 针对开发者的缓存接口，提供在页面加载前，提前将资源注入内存缓存的能力。 这个项目由我完全主导设计并实现，以及提供基础测试。 首先是内存缓存的研究，包括源码中针对内存缓存生成、读取的一系列条件，如何根据本地资源模拟构建出内存缓存需要的数据格式，然后将其注入并让内核可以正常使用。 这里涉及的难点主要是构造的资源对象在使用之前会失活导致被回收。解决方案是找到了chromium内部的keepalive类，在resource对象中持有keepalive对象作为成员属性，可以在垃圾回收中保活，当需要删除时，将其置空即可回收。 3. js编译优化接口 针对开发者的js编译优化接口，提供在页面加载前，提前编译js生成字节码缓存的能力。 这个项目由我完全主导设计并实现，以及提供基础测试。 首先是对于js编译生成字节码缓存流程的研究。之后构造出compile方法需要的结构体来提前生成字节码缓存。同时，由于codecache依赖diskcache，在内部自己实现了一套简易的disk cache读写接口，用于缓存js文件本身。 这个项目的难点在于disk cache系统的设计，内部采用了索引机制，通过索引文件找到对应的缓存实现高效的读、写和查。 4. 首屏渲染优化接口 针对开发者的首屏渲染优化接口，通过调整web内核的渲染机制，减少白屏时间。 这个项目由我完全主导设计并实现，以及提供基础测试。 项目主要是基于chromium html parser过程的优化。 主要难点是对parser过程的拆解并找到优化点。chromium的parser过程并非一次性的，而是分段的，通过优化分段逻辑，让分段更细粒度，达到优化白屏的效果。"
  }
]
