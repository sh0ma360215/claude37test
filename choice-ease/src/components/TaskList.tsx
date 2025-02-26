"use client";
import { useState } from 'react';
import { Task } from '@/types';
import RandomPicker from './RandomPicker';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // タスク追加関数を修正
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    // 改行で分割して複数のタスクを作成
    const taskTitles = newTaskTitle.split('\n').filter(title => title.trim());
    
    const newTasks = taskTitles.map(title => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      category: 'default',
      completed: false,
      createdAt: Date.now()
    }));
    
    setTasks([...tasks, ...newTasks]);
    setNewTaskTitle('');
  };
  
  // タスク削除関数
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // タスク完了切り替え関数
  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

   // タスク選択関数
  const handleSelectTask = (task: Task | null) => {
    setSelectedTask(task);
    };
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">タスクリスト</h1>
      
      {/* タスク追加フォームをテキストエリアに変更 */}
      <div className="flex mb-4">
        <textarea
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="新しいタスクを入力...&#13;&#10;改行で区切って複数入力できます"
          className="flex-1 border p-2 rounded-l text-black dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
        <button 
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          追加
        </button>
      </div>

      {/* 選択されたタスクの表示 */}
      {selectedTask && (
        <div className="my-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 shadow-lg transform transition-all duration-500 hover:scale-105">
          <h2 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">次にやること:</h2>
          <p className="text-2xl mt-3 font-bold text-gray-800 dark:text-gray-100">{selectedTask.title}</p>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {new Date(selectedTask.createdAt).toLocaleDateString('ja-JP')} に追加
          </div>
        </div>
      )}
      
      {/* タスクリスト */}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li 
            key={task.id} 
            className={`border p-3 rounded flex justify-between items-center ${
              task.completed ? 'bg-green-50 dark:bg-green-900/20' : ''
            }`}
          >
            <span className={`cursor-pointer flex-1 ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
            }`}>
              {task.title}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleComplete(task.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  task.completed 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                }`}
              >
                {task.completed ? '完了済' : '完了'}
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    {/* ランダムピッカー */}
    <RandomPicker tasks={tasks} onSelect={handleSelectTask} />
    </div>
  );
}