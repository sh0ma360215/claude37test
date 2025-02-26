// タスクの型定義
export interface Task {
    id: string;
    title: string;
    category: string;
    completed: boolean;
    createdAt: number;
  }
  
  // カテゴリの型定義
  export interface Category {
    id: string;
    name: string;
    color: string;
  }