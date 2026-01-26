
export function resolveTemplates(input: any, context: Record<string, any>): any {
  if (typeof input === "string") {
    return input.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
      const path = expr.trim().replace(/^nodes\./, "");
      return path.split(".").reduce((acc, key) => acc?.[key], context) ?? "";
    });
  }

  if (Array.isArray(input)) {
    return input.map(v => resolveTemplates(v, context));
  }

  if (typeof input === "object" && input !== null) {
    const obj: any = {};
    for (const k in input) obj[k] = resolveTemplates(input[k], context);
    return obj;
  }

  return input;
}
