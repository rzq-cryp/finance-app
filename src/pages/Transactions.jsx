import { useState } from "react";
import useFinance from "../hooks/useFinance";

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useFinance();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) return;

    addTransaction(form);

    setForm({
      title: "",
      amount: "",
      type: "expense",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-xl font-bold">Transactions</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl space-y-2">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button className="w-full bg-black text-white p-2 rounded">
          Add Transaction
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-2">
        {transactions.length === 0 && (
          <p className="text-gray-500">Belum ada transaksi</p>
        )}

        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-gray-500">{t.type}</p>
            </div>

            <div className="text-right">
              <p>Rp {t.amount}</p>
              <button
                onClick={() => deleteTransaction(t.id)}
                className="text-red-500 text-sm"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}