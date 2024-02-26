exports.addTodo = async (req, res, next) => {
  try {
    res.status(201).json({ message: "AddTodo successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getAllTodo = async (req, res, next) => {
  try {
    res.status(200).json({ message: "GetAllTodo successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    res.status(200).json({ message: "GetTodoById successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    res.status(200).json({ message: "UpdateTodo successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    res.status(200).json({ message: "DeleteTodo successful" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
