const KEY = "finance-app-v1";

export const getTransactions = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const saveTransactions = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};