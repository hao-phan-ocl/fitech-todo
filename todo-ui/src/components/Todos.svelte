<script>
    let item = "";
    const getTodos = async () => {
      const response = await fetch("/api/todos");
      return await response.json();
    };
  
    let todosPromise = getTodos();

    const addTodo = async () => {
        if (item.length == 0) {
            return;
        }

        const newTodo = { item };

        await fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify(newTodo),
        });

        item = "";

        todosPromise = getTodos();
    };

    const deleteTodo = async (id) => {
            await fetch(`/api/todos/${id}`, {
            method: "DELETE",
        });

        todosPromise = getTodos();
    }
</script>

<h1 class="p-4 mb-4 shadow">Todos</h1>

<input type="text" bind:value={item} />
<button on:click={addTodo}>Add todo</button>

{#await todosPromise}
    <p>Loading todos</p>
{:then todos}
    {#if todos.length == 0}
        <p>No todos available</p>
    {:else}
        <ul>
            {#each todos as todo}
                <li>
                    <span>{todo.item}</span>
                    <span><button on:click={() => deleteTodo(todo.id)}>Delete</button></span>
                </li>
            {/each}
        </ul>
    {/if}
{/await}