"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransformNode = executeTransformNode;
async function executeTransformNode(node, context) {
    const fn = new Function("context", node.script);
    return fn(context);
}
