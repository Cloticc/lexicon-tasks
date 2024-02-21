import { ITodo } from './components/TodoInterface';
import { SortSelect } from './components/SortSelect';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useState } from 'react';

export function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false, isEditing: false, createdAt: new Date(), author: '' }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const removeTodo = (id: number) => {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );
  }
  const [title, setTitle] = useState<string>('Todo');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const editTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  }

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => todo.id === id ? { ...todo, text: newText, isEditing: !todo.isEditing } : todo)
    );
  };

  const [sortItem, setSortItem] = useState<'asc' | 'desc' | 'completed' | 'uncompleted' | 'timestamp' | 'author'>('timestamp');
  const sortTodos = (todos: ITodo[]) => {
    switch (sortItem) {
      case 'asc':
        return todos.sort((a, b) => a.text.localeCompare(b.text));
      case 'desc':
        return todos.sort((a, b) => b.text.localeCompare(a.text));
      case 'completed':
        return todos.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
      case 'uncompleted':
        return todos.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? -1 : 1);
      case 'timestamp':
        return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'author':
        return todos.sort((a, b) => a.author.localeCompare(b.author));
      default:
        return todos;
    }
  };



  return (
    <div className="App">
      <h1>{title}</h1>
      {isEditingTitle && <input type="text" value={title} onChange={e => setTitle(e.target.value)} />}
      <button onClick={editTitle}>{isEditingTitle ? 'Save Title' : 'Edit Title'}</button>
      <SortSelect sortItem={sortItem} setSortItem={setSortItem} />
      <TodoInput onAddTodo={addTodo} />
      <TodoList
        todos={sortTodos(todos)}
        onToggleTodo={toggleTodo}
        onRemoveTodo={removeTodo}
        onStartEditTodo={id => {
          setTodos(
            todos.map((todo) => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo)
          );
        }}
        onEndEditTodo={editTodo}
      />
    </div>
  );

}


