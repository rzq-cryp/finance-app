import { useState } from "react";
import useFinance from "../hooks/useFinance";

export default function Dashboard() {
  const {
    income,
    expense,
    balance,
    wallets,
    transactions,
    addTransaction,
    addWallet,
    updateWalletBalance,
    deleteTransaction,
    transferBetweenWallets,
    exportCSV,
    exportPDF,
  } = useFinance();

  const [tab, setTab] = useState("expense");

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    wallet: "cash",
    method: "cash_payment",
  });

  const [walletName, setWalletName] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [editBalance, setEditBalance] = useState({});

  const [transfer, setTransfer] = useState({
    from: "cash",
    to: "dana",
    amount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) return;

    addTransaction({
      ...form,
      type: tab,
      amount: Number(form.amount),
      date: new Date().toISOString(),
    });

    setForm({
      title: "",
      amount: "",
      category: "",
      wallet: "cash",
      method: "cash_payment",
    });
  };

  const formatRupiah = (angka) => {
    if (!angka && angka !== 0) return "0";
    return Number(angka).toLocaleString("id-ID");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-3 md:p-4 font-mono space-y-4 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="bg-white border-4 border-black p-3 md:p-4 shadow">
        <h1 className="text-lg md:text-2xl font-black">
          💸 MULTI WALLET BANKING SYSTEM
        </h1>

        <p className="text-[10px] md:text-xs mt-2 font-semibold">
          Aplikasi keuangan pribadi dengan wallet, transaksi, dan transfer antar wallet.
        </p>
      </div>

      {/* INFO */}
      <div className="bg-white border-4 border-black p-3 text-[10px] md:text-xs">
        <div className="font-black mb-1">📌 PENJELASAN</div>
        🏦 Wallet = tempat uang (cash/bank/e-wallet) <br />
        💰 Income = uang masuk <br />
        💳 Expense = uang keluar <br />
        🔁 Transfer = pindah saldo antar wallet <br />
        📊 Balance = total semua wallet
      </div>

      <button
        onClick={() => {
          const oldData =
            JSON.parse(localStorage.getItem("transactions")) || [];

          oldData.forEach((t) => {
            fetch(
              "https://script.google.com/macros/s/AKfycbwG79oeknDZaEI8HgKy5DELOQsF6Lf15_AmzMJq2pFVnB_irMjEaf-Ix6XCsAKU6eH3Vg/exec",
              {
                method: "POST",
                headers: {
                  "Content-Type": "text/plain",
                },
                body: JSON.stringify({
                  title: t.title,
                  category: t.category,
                  type: t.type,
                  wallet: t.wallet,
                  amount: t.amount,
                  date: t.date || new Date().toISOString(),
                }),
              }
            );
          });

          localStorage.setItem("migrated", "true");

          alert("Migration success 🚀");
        }}
        className="w-full bg-black text-white p-2 font-black text-xs mt-2"
      >
        MIGRATE LOCAL DATA → GOOGLE SHEETS
      </button>

      
      {/* TRANSFER SECTION */}
      <div className="bg-white border-4 border-black p-3 space-y-2">
        <div className="font-black text-sm">🔁 TRANSFER WALLET</div>

        <select
          className="w-full border p-2 text-sm font-black"
          value={transfer.from}
          onChange={(e) =>
            setTransfer({ ...transfer, from: e.target.value })
          }
        >
          {wallets.map((w) => (
            <option key={w.name} value={w.name}>
              FROM: {w.name.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 text-sm font-black"
          value={transfer.to}
          onChange={(e) =>
            setTransfer({ ...transfer, to: e.target.value })
          }
        >
          {wallets.map((w) => (
            <option key={w.name} value={w.name}>
              TO: {w.name.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          className="w-full border p-2 text-sm font-black"
          type="number"
          placeholder="AMOUNT"
          value={transfer.amount}
          onChange={(e) =>
            setTransfer({ ...transfer, amount: e.target.value })
          }
        />

        <button
          onClick={() => {
            transferBetweenWallets(
              transfer.from,
              transfer.to,
              transfer.amount
            );

            setTransfer({
              from: "cash",
              to: "dana",
              amount: "",
            });
          }}
          className="w-full bg-black text-white p-3 font-black text-sm"
        >
          TRANSFER NOW
        </button>
      </div>

      {/* TAB */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("income")}
          className={`flex-1 border-4 border-black p-2 font-black text-sm ${
            tab === "income" ? "bg-green-300" : "bg-white"
          }`}
        >
          PEMASUKAN
        </button>

        <button
          onClick={() => setTab("expense")}
          className={`flex-1 border-4 border-black p-2 font-black text-sm ${
            tab === "expense" ? "bg-red-300" : "bg-white"
          }`}
        >
          PENGELUARAN
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black p-3 space-y-2"
      >
        <div className="font-black text-sm">
          MODE: {tab.toUpperCase()}
        </div>

        <input
          className="w-full border p-2 text-sm font-black"
          placeholder="TITLE"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="w-full border p-2 text-sm font-black"
          placeholder="AMOUNT"
          type="number"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <input
          className="w-full border p-2 text-sm font-black"
          placeholder="CATEGORY"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <select
          className="w-full border p-2 text-sm font-black"
          value={form.wallet}
          onChange={(e) =>
            setForm({ ...form, wallet: e.target.value })
          }
        >
          {wallets.map((w) => (
            <option key={w.name} value={w.name}>
              {w.name.toUpperCase()}
            </option>
          ))}
        </select>

        <button className="w-full bg-black text-white p-3 font-black text-sm">
          + ADD TRANSACTION
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-white border-4 border-black p-3 flex flex-col md:flex-row md:justify-between gap-2"
          >
            <div>
              <div className="font-black text-sm">{t.title}</div>
              <div className="text-[10px] md:text-xs">
                {t.category} • {t.type}
              </div>
              <div className="text-[10px] font-black">
                WALLET: {t.wallet}
              </div>
            </div>

            <div className="flex justify-between items-center md:flex-col md:items-end">
              <div className="font-black text-sm">
                Rp {formatRupiah(t.amount)}
              </div>

              <button
                onClick={() => deleteTransaction(t.id)}
                className="bg-red-300 border-2 border-black px-2 mt-2 md:mt-1 font-black text-sm"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}