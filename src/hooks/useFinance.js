import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

export default function useFinance() {
  // 💾 SAFE LOAD WALLET
  const [wallets, setWallets] = useState(() => {
    try {
      const saved = localStorage.getItem("wallets");
      return saved
        ? JSON.parse(saved)
        : [
            { name: "cash", balance: 0 },
            { name: "dana", balance: 0 },
          ];
    } catch {
      return [
        { name: "cash", balance: 0 },
        { name: "dana", balance: 0 },
      ];
    }
  });

  // 💾 SAFE LOAD TRANSACTIONS
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("transactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 💾 SAFE LOAD TRANSFERS
  const [transfers, setTransfers] = useState(() => {
    try {
      const saved = localStorage.getItem("transfers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 💾 AUTO SAVE
  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("transfers", JSON.stringify(transfers));
  }, [transfers]);

  // ✏️ EDIT WALLET
  const updateWalletBalance = (name, newBalance) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.name === name
          ? { ...w, balance: Number(newBalance) }
          : w
      )
    );
  };

  // ➕ ADD WALLET
  const addWallet = (name, initialBalance = 0) => {
    if (!name) return;

    if (wallets.find((w) => w.name === name)) return;

    setWallets((prev) => [
      ...prev,
      {
        name,
        balance: Number(initialBalance),
      },
    ]);
  };

  // 💰 ADD TRANSACTION
  const addTransaction = (data) => {
    const amount = Number(data.amount);

    const newTx = {
      ...data,
      id: Date.now(),
      amount,
    };

    setTransactions((prev) => [...prev, newTx]);

    setWallets((prev) =>
      prev.map((w) => {
        if (w.name !== data.wallet) return w;

        return {
          ...w,
          balance:
            data.type === "income"
              ? w.balance + amount
              : w.balance - amount,
        };
      })
    );
  };

  // ❌ DELETE TRANSACTION
  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  // 🔁 TRANSFER
  const transferBetweenWallets = (from, to, amount) => {
    amount = Number(amount);

    if (!from || !to || !amount) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (w.name === from) {
          return { ...w, balance: w.balance - amount };
        }
        if (w.name === to) {
          return { ...w, balance: w.balance + amount };
        }
        return w;
      })
    );

    setTransfers((prev) => [
      ...prev,
      {
        id: Date.now(),
        from,
        to,
        amount,
      },
    ]);
  };

  // 📊 INCOME
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  // 📉 EXPENSE
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  // 💰 BALANCE
  const balance = wallets.reduce(
    (sum, w) => sum + w.balance,
    0
  );

  // 📊 EXPORT CSV
  const exportCSV = () => {
    let csv =
      "title,amount,type,wallet,category\n";

    transactions.forEach((t) => {
      csv += `${t.title},${t.amount},${t.type},${t.wallet},${t.category}\n`;
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "finance-data.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 📄 EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(16);
    doc.text("FINANCE REPORT", 10, y);

    y += 10;

    doc.setFontSize(10);

    doc.text(`INCOME: Rp ${income}`, 10, (y += 10));
    doc.text(`EXPENSE: Rp ${expense}`, 10, (y += 8));
    doc.text(`BALANCE: Rp ${balance}`, 10, (y += 8));

    y += 10;

    doc.text("WALLETS:", 10, (y += 10));

    wallets.forEach((w) => {
      doc.text(
        `${w.name.toUpperCase()} : Rp ${w.balance}`,
        10,
        (y += 8)
      );
    });

    y += 10;

    doc.text("TRANSACTIONS:", 10, (y += 10));

    transactions.forEach((t) => {
      doc.text(
        `${t.title} | Rp ${t.amount} | ${t.type} | ${t.wallet}`,
        10,
        (y += 8)
      );
    });

    doc.save("finance-report.pdf");
  };

  return {
    wallets,
    transactions,
    transfers,
    addWallet,
    updateWalletBalance,
    addTransaction,
    deleteTransaction,
    transferBetweenWallets,
    income,
    expense,
    balance,
    exportCSV,
    exportPDF,
  };
}