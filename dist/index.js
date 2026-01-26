"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowEngine = void 0;
const HttpNode_1 = require("./nodes/HttpNode");
const TransformNode_1 = require("./nodes/TransformNode");
class FlowEngine {
    async execute(flow) {
        const context = {};
        const executed = new Set();
        const nodes = flow.nodes;
        while (executed.size < Object.keys(nodes).length) {
            let progress = false;
            for (const [id, node] of Object.entries(nodes)) {
                if (executed.has(id))
                    continue;
                const deps = node.depends_on || [];
                if (!deps.every((d) => executed.has(d)))
                    continue;
                let result;
                if (node.type === "http") {
                    result = await (0, HttpNode_1.executeHttpNode)(node, context);
                }
                else if (node.type === "transform") {
                    result = await (0, TransformNode_1.executeTransformNode)(node, context);
                }
                else {
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
exports.FlowEngine = FlowEngine;
