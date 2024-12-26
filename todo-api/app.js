import * as todoService from "./services/todoService.js";
import { cacheMethodCalls } from "./util/cacheUtil.js";

const cachedTodoService = cacheMethodCalls(todoService, ["addTodo", "deleteTodo"]);

const handleGetTodos = async (request) => {
  return Response.json(await cachedTodoService.getTodos());
};

const handleGetTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  return Response.json(await cachedTodoService.getTodo(id));
}

const handlePostTodos = async (request) => {
  const todo = await request.json();
  await cachedTodoService.addTodo(todo);
  return new Response("OK", { status: 200 });
};

const handleDeleteTodo = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  await cachedTodoService.deleteTodo(id);
  return new Response("OK", { status: 200 });
}

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handleGetTodos,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/todos/:id" }),
    fn: handleGetTodo,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/todos" }),
    fn: handlePostTodos,
  },
  {
    method: "DELETE",
    pattern: new URLPattern({ pathname: "/todos/:id" }),
    fn: handleDeleteTodo,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 7777, hostname: '0.0.0.0' };
Deno.serve(portConfig, handleRequest);