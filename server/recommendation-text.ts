// Decode only a named top-level string from an unfinished model JSON response.
export function recommendationText(content: string, field = 'message'): string | undefined {
  const json = content.trimStart().replace(/^```(?:json)?\s*/, '');
  if (!json.startsWith('{')) return;
  let depth = 1; let expectingKey = true;
  for (let i = 1; i < json.length; i++) {
    const char = json[i];
    if (char === '"') {
      const token = readString(json, i);
      if (!token.closed) return;
      if (depth === 1 && expectingKey) {
        expectingKey = false;
        let valueStart = token.end + 1;
        while (/\s/.test(json[valueStart] || '') && valueStart < json.length) valueStart++;
        if (json[valueStart] !== ':') return;
        valueStart++;
        while (/\s/.test(json[valueStart] || '') && valueStart < json.length) valueStart++;
        if (token.value === field) return json[valueStart] === '"' ? readString(json, valueStart).value : undefined;
      }
      i = token.end;
    } else if (char === '{' || char === '[') depth++;
    else if (char === '}' || char === ']') { depth--; if (depth === 0) return; }
    else if (char === ',' && depth === 1) expectingKey = true;
  }
}

function readString(json: string, start: number): { value: string; end: number; closed: boolean } {
  let end = start + 1; let safeEnd = end;
  for (; end < json.length; end++) {
    if (json[end] === '"') {
      try { return { value: JSON.parse(json.slice(start, end + 1)), end, closed: true }; }
      catch { return { value: '', end, closed: false }; }
    }
    if (json[end] === '\\') {
      const length = json[end + 1] === 'u' ? 6 : 2;
      if (end + length > json.length) break;
      end += length - 1;
    }
    safeEnd = end + 1;
  }
  try {
    let value: string = JSON.parse(json.slice(start, safeEnd) + '"');
    if (/[\uD800-\uDBFF]$/.test(value)) value = value.slice(0, -1);
    return { value, end, closed: false };
  } catch { return { value: '', end, closed: false }; }
}
