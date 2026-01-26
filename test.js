const { FlowEngine } = require("./dist/index");

(async () => {
  const engine = new FlowEngine();

  const result = await engine.execute({
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

  console.log("RESULT:", result);
})();
