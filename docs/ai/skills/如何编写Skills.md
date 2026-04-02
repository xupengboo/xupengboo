# 如何编写 Skills：AI Agent 技能开发完整指南

## 一、什么是 Skills？

**Skills（技能）** 是一种为 AI Agent 提供专门领域能力的模块化扩展机制。通过 Skills，可以让 AI Agent：

- 获得特定领域的专业知识
- 执行复杂的多步骤任务
- 调用特定的工具和 API
- 提供更精准、更专业的服务

### Skills 的核心价值

```
普通 AI Agent    +    Skills    =    专业 AI Agent
   ↓                      ↓                  ↓
通用能力           领域专精          专家级服务
```

## 二、Skills 的工作原理

### 2.1 基本架构

```
┌─────────────────────────────────────────────────────────┐
│                      AI Agent                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              核心引擎 (LLM)                      │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Skills 调度器                        │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │   │
│  │  │ Skill 1 │ │ Skill 2 │ │ Skill 3 │  ...     │   │
│  │  │ (PDF)   │ │ (XLSX)  │ │ (Chart) │          │   │
│  │  └─────────┘ └─────────┘ └─────────┘          │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              工具层 (Tools)                     │   │
│  │  read_file │ write_file │ web_fetch │ bash     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 调用流程

```
用户请求 → Agent 分析 → 匹配 Skill → 执行 Skill → 返回结果
     │           │            │            │           │
     │           │            │            │           │
   "处理PDF"  识别为      调用 PDF     读取/解析    返回PDF
              PDF任务      Skill       PDF文件      内容
```

## 三、Skill 的基本结构

一个完整的 Skill 通常包含以下组成部分：

### 3.1 元数据定义

```yaml
skill:
  name: "pdf-processor"           # 技能名称
  version: "1.0.0"                # 版本号
  description: "PDF文档处理技能"   # 描述
  author: "your-name"             # 作者
  tags: [pdf, document, parsing]  # 标签
```

### 3.2 能力声明

```yaml
capabilities:
  - name: "read_pdf"
    description: "读取PDF文件内容"
    inputs:
      file_path: "PDF文件路径"
    outputs:
      content: "PDF文本内容"
      metadata: "PDF元数据"
  
  - name: "extract_images"
    description: "提取PDF中的图片"
    inputs:
      file_path: "PDF文件路径"
      output_dir: "图片输出目录"
    outputs:
      images: "图片文件列表"
```

### 3.3 工具依赖

```yaml
tools_required:
  - read_file      # 需要读取文件能力
  - write_file     # 需要写入文件能力
  - run_shell_command  # 需要执行命令能力
```

### 3.4 提示词模板

```yaml
prompts:
  system: |
    你是一个专业的PDF文档处理专家。
    你的任务是帮助用户处理和分析PDF文档。
    
    可用操作：
    1. 读取PDF内容
    2. 提取文本和图片
    3. 分析PDF结构
    
    注意事项：
    - 确保文件路径正确
    - 处理大文件时注意内存使用
    - 保留原始格式信息
  
  user_template: |
    请帮我处理以下PDF文件：{{file_path}}
    需要执行的操作：{{operation}}
```

## 四、从零开始编写一个 Skill

让我们以创建一个 **Markdown 转 HTML** 的 Skill 为例。

### 步骤 1：创建目录结构

```
skills/
└── md2html/
    ├── skill.yaml      # Skill 配置文件
    ├── README.md       # 使用说明
    └── prompts/
        └── system.txt  # 系统提示词
```

### 步骤 2：编写 skill.yaml

```yaml
# skills/md2html/skill.yaml

name: "md2html"
version: "1.0.0"
description: "将 Markdown 文档转换为 HTML 格式"
author: "your-name"

# 触发条件
triggers:
  keywords:
    - "markdown转html"
    - "md转html"
    - "转换markdown"
  patterns:
    - "将.*md.*转换为.*html"
    - "md2html"

# 能力定义
capabilities:
  - name: "convert"
    description: "执行 Markdown 到 HTML 的转换"
    inputs:
      source: "Markdown 文件路径或内容"
      output: "输出 HTML 文件路径"
      style: "样式选项（可选）"
    outputs:
      html_content: "转换后的 HTML 内容"
      output_path: "输出文件路径"

# 工具需求
tools_required:
  - read_file
  - write_file
  - run_shell_command

# 执行配置
execution:
  max_tokens: 4096
  timeout: 60
  
# 提示词
prompts:
  system_file: "prompts/system.txt"
```

### 步骤 3：编写系统提示词

```text
<!-- skills/md2html/prompts/system.txt -->

你是一个专业的 Markdown 到 HTML 转换工具。

## 你的职责

1. 读取用户提供的 Markdown 内容
2. 将 Markdown 语法转换为标准 HTML
3. 应用适当的样式和格式
4. 输出格式良好的 HTML 文档

## 转换规则

### 标题转换
- # → <h1>
- ## → <h2>
- ### → <h3>
- 以此类推...

### 文本格式
- **粗体** → <strong>粗体</strong>
- *斜体* → <em>斜体</em>
- `代码` → <code>代码</code>

### 列表转换
- 无序列表：- item → <ul><li>item</li></ul>
- 有序列表：1. item → <ol><li>item</li></ol>

### 代码块
```language → <pre><code class="language-language">

### 链接和图片
- [text](url) → <a href="url">text</a>
- ![alt](url) → <img src="url" alt="alt">

## HTML 模板

输出的 HTML 应该包含完整的文档结构：

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>转换文档</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        img { max-width: 100%; }
    </style>
</head>
<body>
    <!-- 转换内容放在这里 -->
</body>
</html>

## 注意事项

1. 保持原始内容的语义
2. 处理特殊字符转义
3. 支持嵌套的 Markdown 语法
4. 生成格式化、缩进的 HTML
```

### 步骤 4：编写使用说明

```markdown
# skills/md2html/README.md

# Markdown 转 HTML Skill

## 简介

将 Markdown 文档转换为格式良好的 HTML 文件。

## 使用方法

### 基本用法

```
用户: 请把这个 markdown 文件转换为 html: docs/readme.md
Agent: [自动调用 md2html skill，读取文件并转换]
```

### 指定输出路径

```
用户: 将 docs/readme.md 转换为 html 并保存到 output/readme.html
```

### 添加自定义样式

```
用户: 把 readme.md 转成 html，使用暗色主题
```

## 示例

输入 Markdown:
```markdown
# 标题

这是一段**粗体**和*斜体*文本。

- 列表项 1
- 列表项 2
```

输出 HTML:
```html
<h1>标题</h1>
<p>这是一段<strong>粗体</strong>和<em>斜体</em>文本。</p>
<ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
</ul>
```

## 限制

- 不支持复杂的 Markdown 扩展语法
- 表格转换需要特殊处理
- 某些 Markdown 方言可能有差异
```

## 五、iFlow CLI 中的 Skills 实现示例

以下是一个在 iFlow CLI 中实现 Skill 的完整示例：

### 5.1 Skill 定义示例（PDF 处理）

```typescript
// skills/pdf-skill.ts

interface SkillDefinition {
  name: string;
  description: string;
  tools: string[];
  handler: SkillHandler;
}

interface SkillHandler {
  (context: SkillContext): Promise<SkillResult>;
}

interface SkillContext {
  userQuery: string;
  tools: Map<string, Function>;
  memory: any;
}

interface SkillResult {
  success: boolean;
  data?: any;
  error?: string;
}

const pdfSkill: SkillDefinition = {
  name: 'pdf',
  description: 'PDF文档创建、编辑和分析技能',
  tools: ['read_file', 'write_file', 'run_shell_command'],
  
  handler: async (context: SkillContext) => {
    const { userQuery, tools } = context;
    const readFile = tools.get('read_file');
    const writeFile = tools.get('write_file');
    
    // 分析用户意图
    if (userQuery.includes('读取') || userQuery.includes('查看')) {
      // 提取文件路径
      const filePath = extractFilePath(userQuery);
      
      // 使用 read_file 工具
      const content = await readFile({ absolute_path: filePath });
      
      return {
        success: true,
        data: { content }
      };
    }
    
    // 其他操作...
    
    return {
      success: false,
      error: '无法识别的操作'
    };
  }
};

function extractFilePath(query: string): string {
  // 实现路径提取逻辑
  const match = query.match(/['"]([^'"]+\.(pdf|PDF))['"]/);
  return match ? match[1] : '';
}

export default pdfSkill;
```

### 5.2 Skill 注册和使用

```typescript
// skill-manager.ts

class SkillManager {
  private skills: Map<string, SkillDefinition> = new Map();
  
  // 注册 Skill
  register(skill: SkillDefinition) {
    this.skills.set(skill.name, skill);
    console.log(`Skill "${skill.name}" 已注册`);
  }
  
  // 匹配最适合的 Skill
  match(query: string): SkillDefinition | null {
    for (const [name, skill] of this.skills) {
      if (query.toLowerCase().includes(name)) {
        return skill;
      }
    }
    return null;
  }
  
  // 执行 Skill
  async execute(skillName: string, context: SkillContext): Promise<SkillResult> {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return { success: false, error: `Skill "${skillName}" 未找到` };
    }
    
    return await skill.handler(context);
  }
}

// 使用示例
const manager = new SkillManager();
manager.register(pdfSkill);

const result = await manager.execute('pdf', {
  userQuery: '请读取 report.pdf 文件',
  tools: new Map([...]),
  memory: {}
});
```

## 六、编写高质量 Skills 的最佳实践

### 6.1 明确的职责边界

```
❌ 错误示例：一个 Skill 做所有事情
skill: "文件处理器"
- 读取文件
- 编辑文件
- 转换格式
- 压缩文件
- 发送邮件

✅ 正确示例：单一职责
skill: "pdf-reader"     → 只负责读取 PDF
skill: "pdf-converter"  → 只负责转换 PDF 格式
skill: "pdf-editor"     → 只负责编辑 PDF
```

### 6.2 详尽的提示词设计

```text
好的提示词应该包含：

1. 角色定义
   "你是一个专业的 XX 专家"

2. 任务描述
   "你的职责是..."

3. 工具说明
   "你可以使用以下工具..."

4. 操作步骤
   "执行任务时，请按以下步骤..."
   步骤 1：验证输入
   步骤 2：执行操作
   步骤 3：验证结果
   步骤 4：格式化输出

5. 约束条件
   "注意：不要..."
   "限制：只能..."

6. 错误处理
   "如果遇到 XX 情况，请..."
   "当出现错误时，返回..."

7. 输出格式
   "输出应该包含..."
   "格式要求：..."
```

### 6.3 错误处理和容错

```yaml
error_handling:
  - error_type: "file_not_found"
    action: "提示用户文件不存在，询问正确路径"
    
  - error_type: "permission_denied"
    action: "提示用户没有权限，建议使用管理员模式"
    
  - error_type: "timeout"
    action: "报告超时，建议分批处理或增加超时时间"
    
  - error_type: "invalid_input"
    action: "说明输入格式要求，提供正确示例"
```

### 6.4 性能优化

```yaml
optimization:
  # 大文件处理
  large_file:
    strategy: "分块处理"
    chunk_size: "1MB"
    
  # 并发处理
  concurrent:
    max_tasks: 5
    timeout_per_task: 30
    
  # 缓存策略
  cache:
    enabled: true
    ttl: 3600
    max_size: "100MB"
```

### 6.5 安全考虑

```yaml
security:
  # 输入验证
  input_validation:
    - "验证文件路径是否在允许范围内"
    - "检查文件类型和大小"
    - "过滤危险字符和命令"
  
  # 权限控制
  permissions:
    - "最小权限原则"
    - "用户确认敏感操作"
    - "操作日志记录"
  
  # 数据保护
  data_protection:
    - "敏感数据不记录到日志"
    - "临时文件及时清理"
    - "输出内容安全检查"
```

## 七、调试和测试 Skills

### 7.1 单元测试

```typescript
// skills/__tests__/pdf-skill.test.ts

describe('PDF Skill', () => {
  test('应该正确读取 PDF 文件', async () => {
    const context = {
      userQuery: '读取 test.pdf',
      tools: mockTools,
      memory: {}
    };
    
    const result = await pdfSkill.handler(context);
    
    expect(result.success).toBe(true);
    expect(result.data.content).toBeDefined();
  });
  
  test('文件不存在时应该返回错误', async () => {
    const context = {
      userQuery: '读取 nonexistent.pdf',
      tools: mockTools,
      memory: {}
    };
    
    const result = await pdfSkill.handler(context);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('不存在');
  });
});
```

### 7.2 调试技巧

```typescript
// 在 Skill 中添加调试日志

const debugMode = process.env.SKILL_DEBUG === 'true';

handler: async (context: SkillContext) => {
  if (debugMode) {
    console.log('[DEBUG] 接收到的查询:', context.userQuery);
    console.log('[DEBUG] 可用工具:', Array.from(context.tools.keys()));
  }
  
  // ... 处理逻辑
  
  if (debugMode) {
    console.log('[DEBUG] 处理结果:', result);
  }
  
  return result;
}
```

### 7.3 测试检查清单

```markdown
## Skill 测试检查清单

### 功能测试
- [ ] 正常输入能否正确处理
- [ ] 边界情况是否处理得当
- [ ] 错误输入是否有合适的提示

### 性能测试
- [ ] 大文件/大数据处理是否正常
- [ ] 并发请求是否稳定
- [ ] 内存使用是否合理

### 安全测试
- [ ] 是否防止了命令注入
- [ ] 是否防止了路径遍历
- [ ] 敏感信息是否得到保护

### 兼容性测试
- [ ] 不同文件格式是否支持
- [ ] 不同操作系统是否兼容
- [ ] 不同编码是否正确处理
```

## 八、发布和分享 Skills

### 8.1 打包 Skill

```bash
# 目录结构
my-skill/
├── skill.yaml          # 配置文件（必需）
├── README.md           # 说明文档（必需）
├── prompts/
│   ├── system.txt      # 系统提示词
│   └── user.txt        # 用户提示词模板
├── handlers/
│   └── main.ts         # 处理逻辑（如果需要）
├── tests/
│   └── main.test.ts    # 测试文件
└── examples/
    └── usage.md        # 使用示例
```

### 8.2 发布到仓库

```yaml
# skill-registry.yaml

name: "markdown-to-html"
version: "1.0.0"
author: "xupengboo"
repository: "https://github.com/xupengboo/skills/md2html"
download_url: "https://github.com/xupengboo/skills/archive/md2html-1.0.0.zip"
checksum: "sha256:abc123..."

# 依赖
dependencies:
  - "node >= 18.0.0"
  
# 兼容性
compatible_agents:
  - "iflow-cli >= 1.0.0"
  - "claude-agent >= 1.0.0"
```

### 8.3 版本管理

```
版本号规则：主版本.次版本.修订版本

- 主版本：不兼容的 API 修改
- 次版本：向下兼容的功能新增
- 修订版本：向下兼容的问题修正

示例：
1.0.0 → 初始版本
1.1.0 → 新增功能（如支持表格）
1.1.1 → 修复 bug
2.0.0 → 重构架构，API 变化
```

## 九、实战练习：手写一个完整的 Skill

### 练习目标

创建一个 **JSON 格式化工具 Skill**，功能包括：
1. 格式化 JSON（美化输出）
2. 压缩 JSON（移除空白）
3. 验证 JSON 语法
4. JSON 转 YAML
5. YAML 转 JSON

### 练习步骤

#### 第一步：创建项目结构

```bash
mkdir -p skills/json-tools/prompts
mkdir -p skills/json-tools/tests
touch skills/json-tools/skill.yaml
touch skills/json-tools/README.md
touch skills/json-tools/prompts/system.txt
```

#### 第二步：编写 skill.yaml

```yaml
# 请自己尝试填写
# 提示：参考上面的 md2html 示例

name: "json-tools"
version: "1.0.0"
description: "TODO: 填写描述"

triggers:
  keywords:
    # TODO: 填写触发关键词

capabilities:
  # TODO: 定义能力

tools_required:
  # TODO: 列出需要的工具

prompts:
  system_file: "prompts/system.txt"
```

#### 第三步：编写系统提示词

```text
<!-- skills/json-tools/prompts/system.txt -->

TODO: 编写提示词

应该包含：
1. 角色定义
2. 支持的操作说明
3. 每种操作的详细步骤
4. 错误处理方式
5. 输出格式要求
```

#### 第四步：编写 README.md

```markdown
<!-- skills/json-tools/README.md -->

TODO: 编写使用说明

应该包含：
1. Skill 简介
2. 安装方法
3. 使用示例（每种操作至少一个）
4. 参数说明
5. 注意事项
```

#### 第五步：测试你的 Skill

创建测试文件：
```json
<!-- skills/json-tools/tests/test.json -->
{
  "name": "测试",
  "value": 123,
  "nested": {
    "key": "value"
  }
}
```

测试用例：
```markdown
1. 格式化测试：请求格式化 test.json
2. 压缩测试：请求压缩 JSON
3. 验证测试：提供错误的 JSON，检查是否报错
4. 转换测试：JSON ↔ YAML 互转
```

### 参考答案

完成练习后，可以参考以下答案：

<details>
<summary>点击展开参考答案</summary>

```yaml
# skills/json-tools/skill.yaml

name: "json-tools"
version: "1.0.0"
description: "JSON 格式化、验证和转换工具"

triggers:
  keywords:
    - "json格式化"
    - "json压缩"
    - "json验证"
    - "json转yaml"
    - "yaml转json"
  patterns:
    - "格式化.*json"
    - "压缩.*json"
    - "验证.*json"

capabilities:
  - name: "format"
    description: "格式化 JSON，使其更易读"
    inputs:
      json: "JSON 字符串或文件路径"
      indent: "缩进空格数（默认 2）"
    outputs:
      formatted: "格式化后的 JSON"
      
  - name: "minify"
    description: "压缩 JSON，移除所有空白"
    inputs:
      json: "JSON 字符串或文件路径"
    outputs:
      minified: "压缩后的 JSON"
      
  - name: "validate"
    description: "验证 JSON 语法是否正确"
    inputs:
      json: "JSON 字符串或文件路径"
    outputs:
      valid: "是否有效"
      errors: "错误信息列表"
      
  - name: "to_yaml"
    description: "将 JSON 转换为 YAML"
    inputs:
      json: "JSON 字符串或文件路径"
    outputs:
      yaml: "YAML 格式内容"
      
  - name: "from_yaml"
    description: "将 YAML 转换为 JSON"
    inputs:
      yaml: "YAML 字符串或文件路径"
    outputs:
      json: "JSON 格式内容"

tools_required:
  - read_file
  - write_file
  - run_shell_command

prompts:
  system_file: "prompts/system.txt"
```

```text
<!-- skills/json-tools/prompts/system.txt -->

你是一个专业的 JSON 处理工具。

## 可用操作

### 1. 格式化 JSON
- 识别用户请求中的 JSON 内容或文件路径
- 使用 read_file 读取文件（如果是路径）
- 解析 JSON 并按指定缩进格式化
- 返回格式化结果

### 2. 压缩 JSON
- 移除所有不必要的空白字符
- 保持 JSON 语义不变
- 返回压缩结果

### 3. 验证 JSON
- 检查 JSON 语法是否正确
- 报告错误位置和原因
- 如果有效，返回解析后的数据结构

### 4. JSON ↔ YAML 转换
- 保持数据结构一致
- 正确处理嵌套对象和数组
- 注意 YAML 的特殊语法规则

## 错误处理

- JSON 解析错误：报告错误位置和可能的原因
- 文件不存在：提示用户并提供帮助
- 编码问题：尝试检测编码并转换

## 输出格式

使用代码块展示 JSON/YAML 内容，并在代码块前后说明操作结果。
```

</details>

## 十、学习路径建议

### 10.1 循序渐进的学习步骤

```
第 1 阶段：理解概念（1-2 天）
├── 阅读 Skills 原理
├── 研究现有 Skills 示例
└── 理解工具调用机制

第 2 阶段：简单实践（2-3 天）
├── 完成本文档的 JSON Tools 练习
├── 尝试修改现有 Skill
└── 测试和调试

第 3 阶段：进阶开发（1 周）
├── 设计自己的 Skill
├── 实现复杂功能
└── 优化和重构

第 4 阶段：发布分享（可选）
├── 完善文档
├── 编写测试
└── 发布到社区
```

### 10.2 推荐的练习项目

```
初级难度：
1. 文本格式转换器（如大小写转换）
2. 简单计算器 Skill
3. URL 编码/解码工具

中级难度：
1. CSV 数据分析 Skill
2. 图片批量处理 Skill
3. API 测试工具 Skill

高级难度：
1. 代码生成器 Skill
2. 数据库迁移工具 Skill
3. 自动化测试框架 Skill
```

## 十一、常见问题与解决方案

### Q1: Skill 如何被 Agent 识别和调用？

```
Agent 通过以下方式识别 Skill：

1. 关键词匹配
   用户输入包含 Skill 名称或预定义关键词

2. 意图识别
   Agent 分析用户意图，匹配最合适的 Skill

3. 显式调用
   用户明确指定要使用的 Skill

示例：
用户: "用 pdf skill 读取这个文件"
Agent: [识别到 "pdf skill"] → 调用 pdf skill
```

### Q2: 如何处理 Skill 之间的依赖？

```yaml
# 在 skill.yaml 中声明依赖
dependencies:
  skills:
    - name: "file-reader"
      version: ">=1.0.0"
    - name: "text-processor"
      version: ">=2.0.0"
      
# Agent 会自动加载依赖的 Skills
```

### Q3: Skill 可以调用其他 Skill 吗？

```typescript
// 可以！在 handler 中调用其他 Skill

handler: async (context: SkillContext) => {
  // 调用其他 Skill
  const otherSkill = context.skills.get('other-skill-name');
  const result = await otherSkill.handler(context);
  
  // 使用其他 Skill 的结果
  // ...
}
```

### Q4: 如何处理长时间运行的任务？

```typescript
// 方案 1：分块处理
for (const chunk of chunks) {
  await processChunk(chunk);
  // 给 Agent 反馈进度
}

// 方案 2：后台运行
const taskId = await runInBackground(longRunningTask);
// 返回任务 ID，用户可以稍后查询结果

// 方案 3：流式输出
streamOutput(async (emit) => {
  const result = await process();
  emit(result);
});
```

## 十二、总结

编写一个好的 Skill 需要：

1. **清晰的定位** - 明确 Skill 要解决什么问题
2. **完善的设计** - 设计好接口、提示词和错误处理
3. **充分的测试** - 覆盖各种使用场景
4. **详细的文档** - 让用户和 Agent 都容易理解
5. **持续的迭代** - 根据反馈不断改进

记住：
- Skills 是给 Agent 用的工具，要站在 Agent 的角度思考
- 好的提示词是 Skill 成功的关键
- 单一职责、可组合、可复用是设计原则

---

## 附录：实用资源

### A. Skill 模板仓库

```bash
# 克隆模板
git clone https://github.com/your-org/skill-template.git my-skill

# 修改配置
cd my-skill
# 编辑 skill.yaml, README.md, prompts/system.txt

# 测试
npm test

# 发布
npm publish
```

### B. 常用提示词模式

```text
# 角色+任务模式
你是 [角色]，你的任务是 [任务描述]。

# 步骤模式
请按以下步骤执行：
1. [步骤 1]
2. [步骤 2]

# 约束模式
要求：
- [约束 1]
- [约束 2]

# 示例模式
示例：
输入: [示例输入]
输出: [示例输出]

# 错误处理模式
如果 [情况]，则 [处理方式]。
```

### C. 工具使用最佳实践

```typescript
// 检查工具是否可用
if (!context.tools.has('read_file')) {
  return {
    success: false,
    error: '需要 read_file 工具，但未提供'
  };
}

// 安全地调用工具
try {
  const result = await context.tools.get('read_file')({
    absolute_path: sanitizedPath
  });
} catch (error) {
  // 处理错误
  return {
    success: false,
    error: `读取文件失败: ${error.message}`
  };
}
```

---

**祝你学习顺利！有问题随时交流。**
