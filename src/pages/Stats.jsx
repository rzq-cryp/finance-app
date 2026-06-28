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

  // Helper untuk format mata uang
  const formatRupiah = (angka) => {
    if (!angka && angka !== 0) return "0";
    return Number(angka).toLocaleString("id-ID");
  };

  // Logika pengelompokan transaksi dipindah ke sini agar JSX lebih bersih
  const transactionsByDate = transactions?.reduce((acc, t) => {
    const date = t.date
      ? new Date(t.date).toLocaleDateString("id-ID")
      : "Tanpa Tanggal";

    if (!acc[date]) acc[date] = [];
    acc[date].push(t);

    return acc;
  }, {}) || {};

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
          💰 TOTAL BALANCE: Rp {formatRupiah(balance)}
        </div>

        <div className="bg-green-200 border-4 border-black p-3 font-black">
          📈 TOTAL INCOME: Rp {formatRupiah(income)}
        </div>

        <div className="bg-red-200 border-4 border-black p-3 font-black">
          📉 TOTAL EXPENSE: Rp {formatRupiah(expense)}
        </div>

        <div className="bg-blue-200 border-4 border-black p-3 font-black">
          🔁 TOTAL TRANSFERS: {transfers?.length || 0}
        </div>
      </div>

      {/* WALLET BREAKDOWN */}
      {wallets?.length > 0 && (
        <div className="bg-white border-4 border-black p-3 space-y-2">
          <div className="font-black">🏦 WALLET BREAKDOWN</div>

          {wallets.map((w, i) => (
            <div key={w.id || i} className="flex justify-between border-b py-1">
              <span className="font-bold">
                {w.name.toUpperCase()}
              </span>
              <span className="font-black">
                Rp {formatRupiah(w.balance)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TRANSAKSI PER HARI */}
      <div className="bg-white border-4 border-black p-3 space-y-2">
        <div className="font-black">📅 TRANSAKSI PER HARI</div>

        {Object.entries(transactionsByDate).map(([date, items]) => (
          <div key={date} className="border-b pb-2">
            
            {/* HEADER TANGGAL */}
            <div className="bg-black text-white px-2 py-1 font-black text-sm">
              {date}
            </div>

            {/* LIST TRANSAKSI */}
            {items.map((t) => (
              <div
                key={t.id}
                className="flex justify-between text-sm py-1"
              >
                <div>
                  <div className="font-black">{t.title}</div>
                  <div className="text-xs">{t.category}</div>
                </div>

                <div className="font-black">
                  {/* Reuse helper formatRupiah di sini */}
                  Rp {formatRupiah(t.amount)} 
                </div>
              </div>
            ))}
          </div>
        ))}
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