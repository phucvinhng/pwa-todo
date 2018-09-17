import React from 'react';

const Todo = ({ todo, onDelete }) => (
  <li>
    <span>{todo.name}</span>
    <button onClick={() => onDelete(todo)}>x</button>
  </li>
);

export default Todo;
