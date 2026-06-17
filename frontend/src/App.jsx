import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);

      alert("Login Successful!");
    } catch (error) {
      console.log(error);
      alert("Login Failed!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setTodos([]);
    alert("Logged Out!");
  };

  const getTodos = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/todos",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/todos",
        {
          title,
          description,
          priority: "High",
          status: "Pending",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setTitle("");
      setDescription("");

      getTodos();

      alert("Todo Created Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error creating todo");
    }
  };

  const markComplete = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        {
          status: "Completed",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      getTodos();
      alert("Todo Completed!");
    } catch (error) {
      console.log(error);
      alert("Error updating todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/todos/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      getTodos();
      alert("Todo Deleted Successfully!");
    } catch (error) {
      console.log(error);
      alert("Error deleting todo");
    }
  };

  useEffect(() => {
    if (token) {
      getTodos();
    }
  }, [token]);

  return (
    <div className="container">
      <h1>Employee Todo System</h1>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={login}>Login</button>

      <button
        onClick={logout}
        style={{ marginLeft: "10px" }}
      >
        Logout
      </button>

      <hr />

      {token && (
        <>
          <input
            type="text"
            placeholder="Todo Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <br />
          <br />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <br />
          <br />

          <button onClick={createTodo}>
            Create Todo
          </button>

          <hr />
        </>
      )}

      <h2>Todo List</h2>

      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`todo-card ${
            todo.status === "Completed"
              ? "completed"
              : "pending"
          }`}
        >
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>Status: {todo.status}</p>
          <p>Priority: {todo.priority}</p>

          <button
            onClick={() =>
              markComplete(todo._id)
            }
          >
            Mark Complete
          </button>

          <button
            onClick={() =>
              deleteTodo(todo._id)
            }
            style={{ marginLeft: "10px" }}
          >
            Delete Todo
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;