
🌊 Flow API Engine
Declarative, Dependency-Aware API Orchestration for Node.js

1. Introduction
Modern applications rarely depend on a single API. Most real-world features require multiple dependent API calls, data transformations, and aggregation logic.
Flow API Engine is a lightweight Node.js library that introduces a flow-based execution model for APIs. Instead of writing imperative code to chain APIs manually, developers define a declarative flow describing:
* which APIs to call
* how they depend on each other
* how data flows between them
The engine takes care of execution order, dependency resolution, and result aggregation.

2. Motivation
2.1 The Traditional REST Problem
Consider a simple requirement:
“Fetch a user, then fetch their posts, then count total posts.”
Traditional approach:
Client
 ├─ Call /users/1
 ├─ Extract userId
 ├─ Call /posts?userId=1
 ├─ Process response
 └─ Return result
Problems:
* Multiple sequential network calls
* Tight coupling between APIs
* Hardcoded execution logic
* Difficult to change flow later
* Client or backend becomes complex

2.2 Existing Solutions & Gaps
Technology	Limitation
REST	No orchestration or dependency support
GraphQL	Focused on data fetching, not execution flow
Workflow engines	Heavy, infrastructure-intensive
Custom code	Error-prone and hard to maintain
3. What is Flow API Engine?
Flow API Engine is a declarative orchestration layer that sits on top of REST APIs.
You define what should happen, not how to chain it.
Client → Flow Definition → Flow Engine → Final Result

4. Core Concepts
4.1 Flow
A flow is a JSON object that describes an entire workflow.
{
  "nodes": { }
}
Each flow contains multiple nodes.

4.2 Node
A node represents a single execution step.
Supported node types:
* http – executes an HTTP API
* transform – processes data using JavaScript
Each node:
* has a unique ID
* may depend on other nodes
* produces an output stored in context

4.3 Dependency Resolution
Dependencies are declared using:
"depends_on": ["nodeId"]
The engine:
* builds a dependency graph (DAG)
* executes nodes only when dependencies are resolved
* detects circular dependencies automatically

4.4 Context
All node outputs are stored in a shared context object:
context = {
  user: {...},
  posts: [...]
}
This context is accessible to downstream nodes.

5. Installation
npm install @your-username/flow-api-engine

6. Basic Example
Example: Fetch User & Extract Data
import { FlowEngine } from "@your-username/flow-api-engine";

const engine = new FlowEngine();

const result = await engine.execute({
  nodes: {
    user: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/users/1"
    },
    summary: {
      type: "transform",
      depends_on: ["user"],
      script: `
        return {
          name: context.user.name,
          email: context.user.email
        };
      `
    }
  }
});

console.log(result);

7. Output Structure
{
  "user": {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz"
  },
  "summary": {
    "name": "Leanne Graham",
    "email": "Sincere@april.biz"
  }
}
Each node’s output is included in the final response.

8. Dynamic Data Passing (Key Feature)
Flow API Engine supports dynamic value substitution using templates:
{{nodes.<nodeId>.<property>}}
Example:
"url": "https://api.com/posts?userId={{nodes.user.id}}"
At runtime, this becomes:
https://api.com/posts?userId=1
Works in:
* URLs
* Request bodies
* Nested objects

9. Example: Dependent API Calls
Problem
Fetch a user, then fetch their posts.
engine.execute({
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
});

10. Example: Multiple Dependencies
Fetch posts + todos, then summarize
engine.execute({
  nodes: {
    posts: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/posts?userId=1"
    },
    todos: {
      type: "http",
      url: "https://jsonplaceholder.typicode.com/todos?userId=1"
    },
    summary: {
      type: "transform",
      depends_on: ["posts", "todos"],
      script: `
        return {
          totalPosts: context.posts.length,
          totalTodos: context.todos.length
        };
      `
    }
  }
});

11. Transform Node Explained
Transform nodes allow business logic without extra APIs.
{
  "type": "transform",
  "depends_on": ["posts"],
  "script": "return { count: context.posts.length };"
}
Use cases:
* aggregation
* filtering
* reshaping responses
* computed fields

12. Execution Model
1. Flow is submitted
2. Nodes are validated
3. Dependency graph is created
4. Nodes execute in correct order
5. Results stored in context
6. Final response returned

13. Error Handling
* ❌ Circular dependencies → explicit error
* ❌ Missing dependency → execution blocked
* ❌ HTTP failure → error propagated
* ❌ Script error → transform failure reported

14. Use Cases
* Backend-for-Frontend (BFF)
* API aggregation services
* Microservice orchestration
* Automation workflows
* Reporting pipelines
* College & research projects

15. Comparison with REST & GraphQL
Feature	REST	GraphQL	Flow API
Execution order	❌	❌	✅
Dependencies	❌	❌	✅
Single request	❌	✅	✅
Workflow logic	❌	❌	✅
16. Architecture Overview
FlowEngine
 ├─ Flow Validator
 ├─ Dependency Resolver (DAG)
 ├─ Template Resolver
 ├─ HTTP Node Executor
 ├─ Transform Node Executor
 └─ Context Store

17. Limitations
* Sequential execution only
* Transform scripts not sandboxed
* Not intended for long-running workflows

18. Future Enhancements
* Parallel execution
* Conditional branching
* Retry & timeout policies
* Secure transform sandbox
* Visual flow designer

19. License
MIT License © 2026 Zubair Shareef

20. Conclusion
Flow API Engine demonstrates a new way to design APIs — not as isolated endpoints, but as orchestrated execution flows.
It simplifies backend logic, improves maintainability, and provides a strong foundation for complex workflows.


