
export async function executeTransformNode(node: any, context: Record<string, any>) {
  const fn = new Function("context", node.script);
  return fn(context);
}
