import '../styles/TodoItem.css'

import { ITodo } from '../App';

interface ITodoItemProps {
  todo: ITodo;
  onToggleTodo: (id: number) => void;
  onRemoveTodo: (id: number) => void;
  onStartEditTodo: (id: number) => void;
  onEndEditTodo: (id: number, newText: string) => void;


}

export function TodoItem({ todo, onToggleTodo, onRemoveTodo, onStartEditTodo, onEndEditTodo }: ITodoItemProps) {
  const { id, text, completed, isEditing } = todo;

  const handleDoubleClick = () => {
    onStartEditTodo(id);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onEndEditTodo(id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEndEditTodo(id, e.currentTarget.value);
    }
  }
  

  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <input className='todo-checkbox' type="checkbox" checked={completed} onChange={() => onToggleTodo(id)} />
      {isEditing ? (
        <input type="text" defaultValue={text} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus />
      ) : (
        <span onDoubleClick={handleDoubleClick}>{text}</span>
      )}
      <button className='todo-btn-remove' onClick={() => onRemoveTodo(todo.id)}>Remove</button>
    </li>
  );
}