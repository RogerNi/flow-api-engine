
import { executeHttpNode } from "./nodes/HttpNode";
import { executeTransformNode } from "./nodes/TransformNode";

export class FlowEngine {
  async execute(flow: any) {
    const context: Record<string, any> = {};
    const executed = new Set<string>();

    const nodes = flow.nodes;

    while (executed.size < Object.keys(nodes).length) {
      let progress = false;

      for (const [id, node] of Object.entries<any>(nodes)) {
        if (executed.has(id)) continue;

        const deps = node.depends_on || [];
        if (!deps.every((d: string) => executed.has(d))) continue;

        let result;
        if (node.type === "http") {
          result = await executeHttpNode(node, context);
        } else if (node.type === "transform") {
          result = await executeTransformNode(node, context);
        } else {
          throw new Error("Unknown node type: " + node.type);
        }

        context[id] = result;
        executed.add(id);
        progress = true;
      }

      if (!progress) {
        throw new Error("Circular dependency detected");
      }
    }

    return context;
  }
}
