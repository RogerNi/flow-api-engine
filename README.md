
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
# 🌊 Flow API Engine

**Flow API Engine** is a lightweight Node.js library that enables developers to **define and execute multi-step, dependency-aware API workflows using a single declarative flow definition**.

Instead of manually chaining multiple REST API calls in code, Flow API Engine allows you to describe the **execution flow**, and the engine automatically handles:

* execution order
* dependency resolution
* data passing between APIs

---

## 📌 What Problem Does This Solve?

In real-world applications, a single feature often requires **multiple API calls**.

### Traditional REST approach

```text
Client → API 1 → API 2 → API 3 → Merge responses manually
```

This leads to:

* Multiple network requests
* Complex client or backend logic
* Hardcoded execution order
* Poor maintainability

---

### Flow API approach

```text
Client → One Flow Definition → Engine executes everything
```

✔ Single request
✔ Automatic dependency handling
✔ Cleaner and more flexible architecture

---

## ✨ Key Features

* 🔗 **Dependency-aware execution** using a DAG (Directed Acyclic Graph)
* 🔄 **Automatic data passing** between APIs
* 🧾 **Declarative JSON flow definition**
* 🌐 **HTTP API execution support**
* 🔧 **Transform nodes** for data processing and aggregation
* ⚡ Lightweight and easy to integrate with Node.js backends

---

## 📦 Installation

```bash
npm install flow-api-engine
```



---

## 🧠 Basic Usage

```ts
import { FlowEngine } from "flow-api-engine";

const engine = new FlowEngine();

const result = await engine.execute({
  nodes: {
    getUser: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/users/1"
    },
    extractUser: {
      type: "transform",
      depends_on: ["getUser"],
      script: `
        return {
          name: context.getUser.name,
          email: context.getUser.email
        };
      `
    }
  }
});

console.log(result);
```

---

## 📤 Output Example

```json
{
  "getUser": {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz"
  },
  "extractUser": {
    "name": "Leanne Graham",
    "email": "Sincere@april.biz"
  }
}
```

---

## 🔁 Flow Definition Structure

```json
{
  "nodes": {
    "<nodeId>": {
      "type": "http | transform",
      "depends_on": ["otherNodeId"],
      "method": "GET | POST",
      "url": "https://api.example.com",
      "body": {},
      "script": "JavaScript code"
    }
  }
}
```

* Each **node** represents one execution step
* `depends_on` controls execution order
* Nodes run automatically when dependencies are satisfied

---

## 🔗 Supported Node Types

### 1️⃣ HTTP Node

Used to call REST APIs.

```json
{
  "type": "http",
  "method": "POST",
  "url": "https://api.example.com/order",
  "body": {
    "userId": "{{nodes.getUser.id}}",
    "item": "Laptop"
  }
}
```

---

### 2️⃣ Transform Node

Used to process, merge, or summarize data.

```json
{
  "type": "transform",
  "depends_on": ["getUser"],
  "script": "return { username: context.getUser.name };"
}
```

---

## 🔄 Data Passing Between Nodes (Core Concept)

Flow API Engine supports **dynamic value substitution** using templates:

```text
{{nodes.<nodeId>.<property>}}
```

### Examples

**Inside transform scripts**

```ts
context.getUser.name
```

**Inside request bodies or URLs**

```json
"userId": "{{nodes.getUser.id}}"
```

This allows one API’s response to be used directly in another API call.

---

## 🧪 Example: Dependent POST Requests

```ts
engine.execute({
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
        product: "Laptop"
      }
    }
  }
});
```
---

## 🧪 Example: Better Long Example

```ts
await engine.execute({
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
            script: "return { totalPosts: context.posts.length, totalTodos: context.todos.length };"
          }
        }
      });
```
---

## 🧩 Internal Architecture (High Level)

```
FlowEngine
 ├─ Flow Executor
 ├─ Dependency Resolver (DAG)
 ├─ Context Store
 ├─ HTTP Node Executor
 └─ Transform Executor
```

---

## ⚠️ Limitations

* Sequential execution only (parallel execution planned)
* Transform scripts are not sandboxed (trusted input recommended)
* Not intended for long-running workflows

---

## 🔮 Roadmap

* Parallel node execution
* Retry and timeout policies
* Conditional branching
* Secure transform sandbox
* Visual flow designer

---

## 📄 License

MIT License

---

## ⭐ Summary

**Flow API Engine** simplifies backend orchestration by allowing developers to define **what should happen**, instead of hardcoding **how API calls should be chained**.


## Contact 
https://www.linkedin.com/in/zubair-shareef

