import { postgres } from "../deps.js";

const sql = postgres({});

const getTodo = async (id) => {
  try {
    const todos = await sql`SELECT * FROM todos WHERE id = ${id}`;
    return todos[0];
  } catch (error) {
    return new Response(error, { status: 404 });
  }
};

const getTodos = async (name) => {
  return await sql`SELECT * FROM todos`;
};

const addTodo = async (todo) => {
  try {
    if (!todo.item) {
      return new Response("Bad request", { status: 400 });
    }
    await sql`INSERT INTO todos (item) VALUES (${todo.item})`;
  } catch (error) {
    return new Response(error, { status: 400 });
  }
};

const deleteTodo = async (id) => {
  try {
    await sql`DELETE FROM todos WHERE id = ${id}`;
    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response(error, { status: 404 });
  }
}

export { getTodo, getTodos, addTodo, deleteTodo };