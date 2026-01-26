````md
# 🌊 Flow API Engine  
### Declarative, Dependency-Aware API Orchestration for Node.js (REST + GraphQL Friendly)

Flow API Engine is a lightweight **Node.js / TypeScript** library that lets you execute **multiple dependent API calls in a single flow definition**.  
Instead of manually chaining REST APIs (or building a custom orchestration layer), you define a **JSON workflow** and the engine executes nodes in the correct order, passing data automatically between them.

> Think of it as **“Postman collection execution + dependency passing + server-side orchestration”** — but programmable and reusable as a library.

---

## 📌 Table of Contents

- [1. What is Flow API Engine?](#1-what-is-flow-api-engine)
- [2. What Problem Does It Solve?](#2-what-problem-does-it-solve)
- [3. How It Works](#3-how-it-works)
- [4. Key Features](#4-key-features)
- [5. Installation](#5-installation)
- [6. Quick Start](#6-quick-start)
- [7. Flow Definition Explained](#7-flow-definition-explained)
- [8. Data Passing & Templates](#8-data-passing--templates)
- [9. Node Types](#9-node-types)
- [10. Real Examples](#10-real-examples)
- [11. Usage in Express Backend](#11-usage-in-express-backend)
- [12. Debugging & Common Errors](#12-debugging--common-errors)
- [13. Use Cases](#13-use-cases)
- [14. Architecture](#14-architecture)
- [15. Limitations](#15-limitations)
- [16. Roadmap](#16-roadmap)
- [17. License](#17-license)
- [18. Keywords](#18-keywords)

---

## 1. What is Flow API Engine?

Flow API Engine is a **flow-based execution engine** for APIs.

You define a flow like this:

- Call API A
- Take `A.id`
- Call API B using `A.id`
- Call API C
- Transform results into a single final output

But instead of writing code to chain them manually, you describe the workflow in JSON and run it:

```ts
const result = await engine.execute(flowDefinition);
````

---

## 2. What Problem Does It Solve?

### ✅ Real-world situation

In microservices or modular backends, one frontend action (ex: “Open Dashboard”) needs:

* user profile API
* orders API
* payments API
* notifications API
  and finally a merged response

### ❌ Traditional REST approach

The client (or gateway) has to manually call multiple APIs:

```text
Client → /user
Client → /orders?userId=1
Client → /payments?userId=1
Client → Merge responses
```

**Problems**

* Too many requests
* More latency
* Client becomes complex
* Lots of duplicate aggregation logic
* Changing the flow requires code rewrite

---

### ✅ Flow API approach

Client sends **one flow definition** and engine executes it:

```text
Client → Flow Definition → Flow Engine → Final Aggregated Result
```

**Benefits**

* One request
* Central orchestration
* Clean client
* Easy to change execution flow
* Reusable flows across apps

---

## 3. How It Works

Flow API Engine processes your flow using these steps:

1. Parse all nodes
2. Build dependency graph (DAG style)
3. Execute nodes in the correct order
4. Store each node output in a context object
5. Resolve templates like `{{nodes.user.id}}`
6. Return final output containing all node results

---

## 4. Key Features

✅ **Dependency-aware execution** (DAG-like model)
✅ **Dynamic value passing** between APIs using templates
✅ **Single JSON flow definition** controlling complete workflow
✅ Supports **HTTP nodes** (REST calls)
✅ Supports **Transform nodes** (custom processing)
✅ Works perfectly with **REST APIs / Microservices**
✅ Can complement **GraphQL / BFF / API Gateway architectures**
✅ Lightweight, no heavy infra required

---

## 5. Installation

> If your package is scoped (recommended):

```bash
npm install @your-username/flow-api-engine
```

---

## 6. Quick Start

### ✅ Minimal working flow (no HTTP)

```ts
import { FlowEngine } from "@your-username/flow-api-engine";

const engine = new FlowEngine();

const result = await engine.execute({
  nodes: {
    hello: {
      type: "transform",
      script: "return { message: 'Flow API works ✅' };"
    }
  }
});

console.log(result);
```

Output:

```json
{
  "hello": { "message": "Flow API works ✅" }
}
```

---

## 7. Flow Definition Explained

A flow is a JSON object with **nodes**:

```json
{
  "nodes": {
    "nodeId": {
      "type": "http | transform",
      "depends_on": ["anotherNode"],
      "url": "....",
      "method": "GET|POST",
      "body": {},
      "script": "..."
    }
  }
}
```

### Node properties

| Field        | Required        | Meaning                          |
| ------------ | --------------- | -------------------------------- |
| `type`       | ✅               | `http` or `transform`            |
| `depends_on` | ❌               | dependencies that must run first |
| `url`        | ✅ for http      | API URL                          |
| `method`     | ❌               | default `GET`                    |
| `body`       | ❌               | payload for POST/PUT             |
| `script`     | ✅ for transform | code to run                      |

---

## 8. Data Passing & Templates

### ✅ Template syntax

You can refer to any previous node output:

```text
{{nodes.<nodeId>.<property>}}
```

Example:

```json
"url": "https://.../posts?userId={{nodes.user.id}}"
```

At runtime this becomes:

```text
...posts?userId=1
```

---

### ✅ Where templates work

| Place              | Supported |
| ------------------ | --------- |
| URL                | ✅ yes     |
| Body               | ✅ yes     |
| Nested body object | ✅ yes     |
| Arrays inside body | ✅ yes     |

---

## 9. Node Types

---

### 9.1 HTTP Node

Calls external or internal REST APIs.

Example:

```json
{
  "type": "http",
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/users/1"
}
```

---

### 9.2 Transform Node

Runs JavaScript code for processing/aggregation.

Example:

```json
{
  "type": "transform",
  "depends_on": ["user"],
  "script": "return { username: context.user.name };"
}
```

---

## 10. Real Examples

---

### ✅ Example 1: User → Posts (Dynamic URL substitution)

```ts
const flow = {
  nodes: {
    user: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/users/1"
    },
    posts: {
      type: "http",
      depends_on: ["user"],
      url: "https://jsonplaceholder.typicode.com/posts?userId={{nodes.user.id}}"
    }
  }
};

console.log(await engine.execute(flow));
```

---

### ✅ Example 2: User → Posts + Todos → Summary

This demonstrates **multi-dependency** + **transform aggregation**.

```ts
const flow = {
  nodes: {
    user: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/users/1"
    },

    posts: {
      type: "http",
      depends_on: ["user"],
      url: "https://jsonplaceholder.typicode.com/posts?userId={{nodes.user.id}}"
    },

    todos: {
      type: "http",
      depends_on: ["user"],
      url: "https://jsonplaceholder.typicode.com/todos?userId={{nodes.user.id}}"
    },

    summary: {
      type: "transform",
      depends_on: ["posts", "todos"],
      script: `
        return {
          totalPosts: Array.isArray(context.posts) ? context.posts.length : 0,
          totalTodos: Array.isArray(context.todos) ? context.todos.length : 0
        };
      `
    }
  }
};

console.log(await engine.execute(flow));
```

Output (example):

```json
{
  "summary": {
    "totalPosts": 10,
    "totalTodos": 20
  }
}
```

---

### ✅ Example 3: Dependent POST Requests

Create user → use returned ID → create order.

```ts
const flow = {
  nodes: {
    createUser: {
      type: "http",
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/users",
      body: { name: "Zubair" }
    },

    createOrder: {
      type: "http",
      depends_on: ["createUser"],
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/posts",
      body: {
        userId: "{{nodes.createUser.id}}",
        item: "Laptop"
      }
    }
  }
};

console.log(await engine.execute(flow));
```

---

### ✅ Example 4: Custom Transform Pipeline

Fetch posts → filter → return selected output.

```ts
const flow = {
  nodes: {
    posts: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/posts?userId=1"
    },

    top5: {
      type: "transform",
      depends_on: ["posts"],
      script: `
        return context.posts.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title
        }));
      `
    }
  }
};

console.log(await engine.execute(flow));
```

---

### ✅ Example 5: Multi-step response composition (BFF style)

```ts
const flow = {
  nodes: {
    user: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/users/1"
    },
    posts: {
      type: "http",
      depends_on: ["user"],
      url: "https://jsonplaceholder.typicode.com/posts?userId={{nodes.user.id}}"
    },
    response: {
      type: "transform",
      depends_on: ["user", "posts"],
      script: `
        return {
          user: { id: context.user.id, name: context.user.name },
          postsCount: context.posts.length
        };
      `
    }
  }
};
```

This becomes a **single response API** for frontend.

---

## 11. Usage in Express Backend

Flow API Engine works well as a backend endpoint:

```ts
import express from "express";
import { FlowEngine } from "@your-username/flow-api-engine";

const app = express();
app.use(express.json());

const engine = new FlowEngine();

app.post("/run-flow", async (req, res) => {
  try {
    const result = await engine.execute(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Running on 3000"));
```

Now you can run **any workflow** from one endpoint.

---

## 12. Debugging & Common Errors

### ❌ 1. Template not replaced

Make sure:

* dependent node executed
* you used correct syntax
* referenced property exists

Correct:

```json
"{{nodes.user.id}}"
```

Wrong:

```json
"{{node.user.id}}"
```

---

### ❌ 2. Transform script failing

Add safe checks:

```js
Array.isArray(context.posts) ? context.posts.length : 0
```

---

### ❌ 3. Circular dependency detected

This happens when:

* A depends on B
* B depends on A

Fix by removing one dependency.

---

## 13. Use Cases

### ✅ Microservices Orchestration

Combine multiple service calls:

* user-service
* order-service
* payment-service

### ✅ Backend for Frontend (BFF)

One API returns full UI-ready response.

### ✅ API Gateway workflows

Dynamic orchestration without writing new gateway code each time.

### ✅ Automation APIs

Define automation flows as JSON and execute them.

### ✅ College / Research

Demonstrates:

* DAG execution
* dependency resolution
* declarative workflow definitions

---

## 14. Architecture

High-level internal components:

```
FlowEngine
 ├── Dependency Resolver (DAG ordering)
 ├── Context Store
 ├── Template Resolver
 ├── HTTP Node Executor
 └── Transform Node Executor
```

Execution flow:

1. Validate nodes
2. Determine order by dependency satisfaction
3. Execute http/transform nodes
4. Store node outputs in context
5. Return merged context as final output

---

## 15. Limitations

* Sequential execution (parallel planned)
* Transform scripts run as JS (trusted input only)
* Not built for long-running workflows (use Temporal/Airflow for that)

---

## 16. Roadmap

Planned improvements:

* Parallel execution when dependencies allow
* Conditional nodes (if/else)
* Retry + timeout policies
* Secure transform sandbox
* Visual flow editor UI

---

## 17. License

MIT License © 2026 Zubair Shareef

---

## 18. Keywords

These help discoverability on npm and GitHub:

* flow-api
* api-orchestration
* workflow-engine
* dependency-graph
* dag-workflow
* rest-api
* graphql
* api-gateway
* backend-for-frontend
* microservices
* typescript
* nodejs

---

## ⭐ Final Note

Flow API Engine makes workflows **declarative**, **dynamic**, and **dependency-aware**.

It’s built for developers who want:
✅ cleaner backend orchestration
✅ fewer client-side API chains
✅ reusable workflow definitions
✅ a lightweight alternative to heavy workflow systems


```
```
