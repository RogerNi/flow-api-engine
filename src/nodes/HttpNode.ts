
import fetch from "node-fetch";
import { resolveTemplates } from "../utils/templateResolver";

export async function executeHttpNode(node: any, context: Record<string, any>) {
  const url = resolveTemplates(node.url, context);
  const body = resolveTemplates(node.body, context);

  const res = await fetch(url, {
    method: node.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });

  return await res.json();
}
