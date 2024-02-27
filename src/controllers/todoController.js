const { decode } = require("jsonwebtoken");
const db = require("../helper/db");
const { isLoggedIn } = require("../middlewares/authorization");

exports.addTodo = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const accountId = req.user.payload.id;
    const todo = await db.toDo.create({
      data: {
        title,
        description,
        completed,
        account: { connect: { id: accountId } },
      },
    });
    res.status(201).json({ message: 'AddTodo successfully', todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTodo = async (req, res, next) => {
  try {
    const todos = await db.toDo.findMany();;
    res.status(200).json({ message: 'GetAllTodo successful', todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await db.toDo.findUnique({ where: { id } });
    res.status(200).json({ message: 'GetTodoById successful', todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodoByUserId = async (req, res, next) => {
  try {
    const user_id = req.user.payload.id;
    const todo = await db.toDo.findMany({
      where: { accountId: user_id },
    });
    res.status(200).json({ message: 'GetTodoById successful', todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const updatedTodo = await db.toDo.update({
      where: { id },
      data: { title, description, completed },
    });
    res.status(200).json({ message: 'UpdateTodo successful', updatedTodo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.toDo.delete({ where: { id } });
    res.status(200).json({ message: 'DeleteTodo successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
