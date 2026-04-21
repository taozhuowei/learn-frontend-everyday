/**
 * 💡 核心逻辑 (entry_extractor):
 * 负责将 ES 源码转换为返回导出对象的 IIFE。
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
        .replace(/export\\s+default\\s+/g, '')
        .replace(/export\\s+/g, '');
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
        .replace(/export\\s+default\\s+/g, '__cf_default__ = ')
        .replace(/export\\s+/g, '');
      
      try {
        eval(cleanCode);
      } catch (e) {
        try { 
           var wrapped = eval('(' + cleanCode + ')');
           if (typeof wrapped !== 'undefined') return wrapped;
        } catch(e2) {}
        throw e;
      }
      
      var result = __cf_default__ || module.exports.default || (module.exports !== exports ? module.exports : undefined);
      if (typeof result !== 'undefined') return result;
      
      var names = ["${problemId || ""}", "${camelId}", "${pascalId}", "MyPromise", "Scheduler", "TaskQueue", "detectCycle", "myInstanceof", "myNew", "deepCopy", "deepClone", "curry", "flat", "mergeTwoLists", "promiseAll", "promiseRace"];
      for (var i = 0; i < names.length; i++) {
        if (!names[i]) continue;
        try {
          var v = eval(names[i]);
          if (typeof v !== 'undefined') return v;
        } catch(e) {}
      }
      
      var m = cleanCode.match(/function\\s+([\\w$]+)/);
      if (m) { try { var v = eval(m[1]); if (typeof v !== 'undefined') return v; } catch(e) {} }
      
      m = cleanCode.match(/class\\s+([\\w$]+)/);
      if (m) { try { var v = eval(m[1]); if (typeof v !== 'undefined') return v; } catch(e) {} }

      throw new Error("Export not found for problem: " + "${problemId || 'unknown'}");
    })()
  `;
}

export function extractClass(code: string, problemId?: string): string {
  return extractExport(code, problemId);
}
