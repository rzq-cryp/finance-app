import useFinance from "../hooks/useFinance";

export default function Stats() {
  const {
    income,
    expense,
    balance,
    wallets,
    transactions,
    transfers,
  } = useFinance();

  return (
    <div className="min-h-screen bg-yellow-50 p-4 font-mono space-y-4">

      {/* HEADER */}
      <div className="bg-white border-4 border-black p-4 shadow">
        <h1 className="text-2xl font-black">
          📊 FINANCE STATS DASHBOARD
        </h1>
        <p className="text-xs mt-1">
          Analisis seluruh pergerakan uang kamu
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3">

        <div className="bg-white border-4 border-black p-3 font-black">
          💰 TOTAL BALANCE: Rp {balance}
        </div>

        <div className="bg-green-200 border-4 border-black p-3 font-black">
          📈 TOTAL INCOME: Rp {income}
        </div>

        <div className="bg-red-200 border-4 border-black p-3 font-black">
          📉 TOTAL EXPENSE: Rp {expense}
        </div>

        <div className="bg-blue-200 border-4 border-black p-3 font-black">
          🔁 TOTAL TRANSFERS: {transfers?.length || 0}
        </div>

      </div>

      {/* WALLET BREAKDOWN */}
      <div className="bg-white border-4 border-black p-3 space-y-2">

        <div className="font-black">🏦 WALLET BREAKDOWN</div>

        {wallets.map((w, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span className="font-bold">
              {w.name.toUpperCase()}
            </span>

            <span className="font-black">
              Rp {w.balance}
            </span>
          </div>
        ))}

      </div>

      {/* TRANSACTION COUNT */}
      <div className="bg-white border-4 border-black p-3 space-y-1">

        <div className="font-black">📦 TRANSACTION INSIGHT</div>

        <div>📌 Total transaksi: {transactions.length}</div>

        <div>
          💸 Income transaksi:{" "}
          {
            transactions.filter((t) => t.type === "income")
              .length
          }
        </div>

        <div>
          💳 Expense transaksi:{" "}
          {
            transactions.filter((t) => t.type === "expense")
              .length
          }
        </div>

      </div>

      {/* SIMPLE INSIGHT BOX */}
      <div className="bg-black text-white p-4 border-4 border-black font-black">

        📌 INSIGHT:
        <br />
        {income > expense
          ? "Keuangan kamu POSITIF (aman 👍)"
          : "Keuangan kamu DEFISIT (hati-hati ⚠️)"}

      </div>

    </div>
  );
}