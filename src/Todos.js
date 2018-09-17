import React, { Component } from 'react';
import PouchDB from 'pouchdb';

import Todo from './Todo';

const localDB = new PouchDB('todos');
const remoteDB = new PouchDB('http://phuc:123456@localhost:5984/todos');

class Todos extends Component {
  constructor(props) {
    super(props);
    this.dbSync = localDB
      .sync(remoteDB, {
        live: true,
        retry: true
      })
      .on('error', function(err) {
        console.log(err);
      });
    this.dbChanges = localDB
      .changes({ since: 'now', live: true })
      .on('change', this.getTodos);
    this.state = {
      todos: []
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  componentWillUnmount() {
    this.dbChanges.cancel();
    this.dbSync.cancel();
  }

  getTodos = () => {
    localDB.allDocs({ include_docs: true }).then(({ rows }) => {
      const todos = rows.map(row => row.doc);
      this.setState({ todos });
    });
  };

  onDelete = todo => {
    localDB.remove(todo);
  };

  onSubmit = e => {
    e.preventDefault();
    const { value } = this.input;
    if (!value) return;

    localDB.post({ name: value }).then(() => {
      this.input.value = '';
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>Name</label>
          <input type="text" ref={node => (this.input = node)} />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {this.state.todos.map(todo => (
            <Todo key={todo._id} todo={todo} onDelete={this.onDelete} />
          ))}
        </ul>
      </div>
    );
  }
}

export default Todos;
