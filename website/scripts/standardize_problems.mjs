import fs from 'fs'
import path from 'path'

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (f.endsWith('.js')) fix(p)
  }
}

function fix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (filePath.endsWith('_test.js')) {
    // 💡 修复 G4: 确保对象字面量带括号
    // 匹配 target: "{...}" 转换为 target: "({...})"
    const fixed = content.replace(/target:\s*"(\{[\s\S]*?\})"/g, (m, p1) => {
      if (p1.includes('(')) return m // 已经有括号了
      return 'target: "(' + p1 + ')"'
    })
    if (fixed !== content) fs.writeFileSync(filePath, fixed)
    return
  }

  const stem = path.basename(filePath, '.js')

  // 识别原型链方法
  const protoMatch = content.match(
    /^((?:Array|Function|Object|Promise)\.prototype\.([\w$]+))\s*=\s*function/m,
  )
  const staticMatch = content.match(
    /^((?:Array|Function|Object|Promise)\.([\w$]+))\s*=\s*function/m,
  )

  // 💡 如果是失败题目之一，提供硬核修复实现
  if (stem === 'flat' || stem === 'flatten') {
    content = content.replace(
      /function\s+\w+\s*\([\s\S]*?\}\s*Array/m,
      `function flat(depth = 1) {
  const d = depth === undefined ? 1 : Number(depth);
  const result = [];
  const exec = (arr, curr) => {
    arr.forEach(i => {
      if (Array.isArray(i) && curr < d) exec(i, curr + 1);
      else result.push(i);
    });
  };
  exec(this, 0);
  return result;
}
Array`,
    )
  }

  // 统一导出格式
  if (!content.includes('export default')) {
    if (protoMatch) {
      content += '\nexport default ' + protoMatch[1] + ';\n'
    } else if (staticMatch) {
      content += '\nexport default ' + staticMatch[1] + ';\n'
    } else {
      const fnMatch = content.match(/^function\s+([\w$]+)/m)
      const clsMatch = content.match(/^class\s+([\w$]+)/m)
      if (fnMatch) content += '\nexport default ' + fnMatch[1] + ';\n'
      else if (clsMatch) content += '\nexport default ' + clsMatch[1] + ';\n'
      else content += '\nexport default ' + stem + ';\n'
    }
  }

  fs.writeFileSync(filePath, content)
}

walk('problems')
