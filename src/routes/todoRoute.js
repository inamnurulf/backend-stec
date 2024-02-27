const express = require("express");
const router = express.Router();

const todoController= require("../controllers/todoController.js");

router.post("/add-todo", todoController.addTodo);

router.get("/get-all-todo", todoController.getAllTodo);

router.get("/get-todo-by-id/:id", todoController.getTodoById);

router.get("/get-todo-by-user-id", todoController.getTodoByUserId);

router.put("/update-todo-by-id/:id", todoController.updateTodo);

router.delete("/delete-todo-by-id/:id", todoController.deleteTodo);


module.exports = router;