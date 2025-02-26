import { useState, useEffect } from 'react';

// ローカルストレージを使用するカスタムフック
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 状態の初期化
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // 初回マウント時にローカルストレージから値を取得
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log('ローカルストレージからの読み込みエラー:', error);
    }
  }, [key]);
  
  // 値を設定し、ローカルストレージに保存する関数
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('ローカルストレージへの保存エラー:', error);
    }
  };
  
  return [storedValue, setValue];
}