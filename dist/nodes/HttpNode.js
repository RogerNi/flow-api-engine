"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeHttpNode = executeHttpNode;
const node_fetch_1 = __importDefault(require("node-fetch"));
const templateResolver_1 = require("../utils/templateResolver");
async function executeHttpNode(node, context) {
    const url = (0, templateResolver_1.resolveTemplates)(node.url, context);
    const body = (0, templateResolver_1.resolveTemplates)(node.body, context);
    const res = await (0, node_fetch_1.default)(url, {
        method: node.method || "GET",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });
    return await res.json();
}
