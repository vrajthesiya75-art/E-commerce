import { useEffect, useState } from "react";
import { Container, Card, Spinner, Form, Button, Badge, ListGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import ShophubLayout from "../../components/ShophubLayout";
import { getAllTodos, addTodo, updateTodo, deleteTodo } from "../../api/dummyjsonAPI";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [newTodo, setNewTodo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getAllTodos({ limit: 50 });
      setTodos(data.todos || []);
    } catch (err) {
      console.error("Todos error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setSubmitting(true);
    try {
      const data = await addTodo({
        todo: newTodo,
        completed: false,
        userId: 1, // You can get from logged-in user
      });
      setTodos([data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("Add todo error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTodo = async (todoId, currentStatus) => {
    try {
      const data = await updateTodo(todoId, { completed: !currentStatus });
      setTodos(todos.map((t) => (t.id === todoId ? data : t)));
    } catch (err) {
      console.error("Update todo error:", err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  return (
    <ShophubLayout>
      <Container className="py-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
          style={{ fontSize: "1.75rem", fontWeight: 700 }}
        >
          Todo List
        </motion.h1>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Form onSubmit={handleAddTodo} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button variant="warning" type="submit" disabled={submitting || !newTodo.trim()}>
                {submitting ? "Adding..." : "Add"}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Filter Buttons */}
        <div className="d-flex gap-2 mb-4">
          <Button
            variant={filter === "all" ? "warning" : "outline-secondary"}
            onClick={() => setFilter("all")}
          >
            All ({todos.length})
          </Button>
          <Button
            variant={filter === "completed" ? "warning" : "outline-secondary"}
            onClick={() => setFilter("completed")}
          >
            Completed ({completedCount})
          </Button>
          <Button
            variant={filter === "pending" ? "warning" : "outline-secondary"}
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </Button>
        </div>

        {/* Todos List */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">Loading todos...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <h4 className="text-muted">No todos found</h4>
              <p className="text-muted">Add a new todo to get started!</p>
            </Card.Body>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <AnimatePresence>
                  {filteredTodos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListGroup.Item
                        className="d-flex align-items-center gap-3 px-4 py-3 border-bottom"
                        style={{
                          backgroundColor: todo.completed ? "#f8f9fa" : "#fff",
                          textDecoration: todo.completed ? "line-through" : "none",
                          opacity: todo.completed ? 0.7 : 1,
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id, todo.completed)}
                          style={{ cursor: "pointer" }}
                        />
                        <div className="flex-grow-1">
                          <p className="mb-0" style={{ fontSize: "1rem" }}>
                            {todo.todo}
                          </p>
                          <small className="text-muted">User ID: {todo.userId}</small>
                        </div>
                        <Badge bg={todo.completed ? "success" : "warning"} className="me-2">
                          {todo.completed ? "Done" : "Pending"}
                        </Badge>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          Delete
                        </Button>
                      </ListGroup.Item>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Container>
    </ShophubLayout>
  );
}
