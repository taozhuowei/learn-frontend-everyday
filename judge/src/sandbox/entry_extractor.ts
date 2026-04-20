/**
 * 💡 核心逻辑 (entry_extractor):
 * 负责将 ES 源码转换为返回导出对象的 IIFE。
 * 
 * 增强版 (G4):
 * 1. 自动处理所有 export 语法。
 * 2. 如果没有 export，自动寻找第一个具名函数或类。
 * 3. 拦截常见关键字。
 */

export function extractPrototype(
  code: string,
  host: string,
  name: string,
): string {
  return `
    (function() {
      var exports = {};
      var module = { exports: exports };
      
      var cleanCode = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        .replace(/^\\s*export\\s+default\\s+/gm, '')
        .replace(/^\\s*export\\s+/gm, '');
      
      eval(cleanCode);
      
      return ${host}.prototype.${name};
    })()
  `;
}

export function extractExport(code: string, problemId?: string): string {
  const camelId = problemId ? problemId.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) : '';
  const pascalId = camelId ? camelId[0].toUpperCase() + camelId.slice(1) : '';

  return `
    (function() {
      var exports = {};
      var module = { exports: exports };
      var __cf_default__ = undefined;
      
      var cleanCode = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        .replace(/^\\s*export\\s+default\\s+function\\s+([\\w$]+)/gm, 'function $1')
        .replace(/^\\s*export\\s+default\\s+class\\s+([\\w$]+)/gm, 'class $1')
        .replace(/^\\s*export\\s+default\\s+/gm, '__cf_default__ = ')
        .replace(/^\\s*export\\s+/gm, '');
      
      eval(cleanCode);
      
      var result = __cf_default__ || module.exports.default || (module.exports !== exports ? module.exports : undefined);
      
      if (typeof result !== 'undefined') return result;
      
      // Fallback: search for names
      var names = ["${problemId || ""}", "${camelId}", "${pascalId}", "MyPromise", "Scheduler", "TaskQueue", "detectCycle", "myInstanceof", "myNew", "deepCopy", "deepClone", "curry", "flat", "mergeTwoLists", "promiseAll", "promiseRace"];
      for (var i = 0; i < names.length; i++) {
        if (!names[i]) continue;
        try {
          var v = eval(names[i]);
          if (typeof v !== 'undefined') return v;
        } catch(e) {}
      }
      
      // Fallback: first function
      var m = cleanCode.match(/function\\s+([\\w$]+)/);
      if (m) {
        try {
           return eval(m[1]);
        } catch(e) {}
      }

      throw new Error("Export not found for problem: ${problemId || 'unknown'}");
    })()
  `;
}

export function extractClass(code: string, problemId?: string): string {
  return extractExport(code, problemId);
}
