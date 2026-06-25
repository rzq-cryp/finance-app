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

      {/* WALLET SECTION */}
      <div className="bg-white border-4 border-black p-3 space-y-2">

        <div className="font-black text-sm md:text-base">
          🏦 YOUR WALLETS
        </div>

        {wallets.map((w, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 border-b py-2"
          >
            <span className="font-black text-sm">
              {w.name.toUpperCase()}
            </span>

            <input
              type="number"
              className="border-2 border-black px-2 py-1 w-full md:w-28 text-right font-black text-sm"
              value={w.balance}
              onChange={(e) =>
                updateWalletBalance(w.name, e.target.value)
              }
            />
          <div className="text-[10px] font-black mt-1">
            Rp {formatRupiah(w.balance)}
          </div>  
          </div>
        ))}

        {/* ADD WALLET */}
        <div className="flex flex-col md:flex-row gap-2 mt-2">

          <input
            className="border p-2 w-full font-black text-sm"
            placeholder="wallet name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />

          <input
            className="border p-2 w-full md:w-28 font-black text-sm"
            placeholder="saldo"
            type="number"
            value={walletBalance}
            onChange={(e) => setWalletBalance(e.target.value)}
          />

          <button
            onClick={() => {
              if (!walletName) return;
              addWallet(walletName, walletBalance);
              setWalletName("");
              setWalletBalance("");
            }}
            className="bg-black text-white px-3 py-2 font-black text-sm"
          >
            +
          </button>

        </div>
      </div>

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

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

        <div className="bg-white border-4 border-black p-3 font-black text-sm">
          BALANCE: Rp {formatRupiah(balance)}
        </div>

        <div className="bg-green-200 border-4 border-black p-3 font-black text-sm">
          INCOME: Rp {formatRupiah(income)}
        </div>

        <div className="bg-red-200 border-4 border-black p-3 font-black text-sm">
          EXPENSE: Rp {formatRupiah(expense)}
        </div>

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

            <div className="flex justify-between items-center">
              <div className="font-black text-sm">
                Rp {formatRupiah(t.amount)}
              </div>

              <button
                onClick={() => deleteTransaction(t.id)}
                className="bg-red-300 border-2 border-black px-2 font-black text-sm"
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