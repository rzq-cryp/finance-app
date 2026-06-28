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
      date: new Date().toISOString(), 
    };

    setTransactions((prev) => [...prev, newTx]);

    fetch("https://script.google.com/macros/s/AKfycbwG79oeknDZaEI8HgKy5DELOQsF6Lf15_AmzMJq2pFVnB_irMjEaf-Ix6XCsAKU6eH3Vg/exec",{
      method: "POST",
      body: JSON.stringify(newTx),
      headers: {
        "Content-Type": "text/plain"
      }
    })
    .then(res => res.text())
    .then(data => console.log("SHEET RESPONSE:", data))
    .catch(err => console.log("ERROR:", err));

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
  let csv = "title,amount,type,wallet,category\n";

  transactions.forEach((t) => {
    csv += `"${t.title}",${t.amount},${t.type},${t.wallet},${t.category}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
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

  let y = 15;

  const line = () => {
    doc.setDrawColor(0);
    doc.line(10, y, 200, y);
    y += 8;
  };

  const addText = (text, size = 11, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, 10, y);
    y += 7;
  };

  // HEADER
  addText("FINANCE REPORT", 16, true);
  y += 2;
  line();

  // SUMMARY
  addText(`INCOME   : Rp ${income}`, 11, true);
  addText(`EXPENSE  : Rp ${expense}`, 11, true);
  addText(`BALANCE  : Rp ${balance}`, 11, true);

  y += 3;
  line();

  // WALLETS
  addText("WALLETS", 13, true);

  wallets.forEach((w) => {
    addText(`${w.name.toUpperCase()} : Rp ${w.balance}`, 10, false);
  });

  y += 3;
  line();

  // TRANSACTIONS GROUPED BY DATE
  addText("TRANSACTIONS", 13, true);

  const grouped = transactions.reduce((acc, t) => {
    const date = t.date
      ? new Date(t.date).toLocaleDateString("id-ID")
      : "No Date";

    if (!acc[date]) acc[date] = [];
    acc[date].push(t);

    return acc;
  }, {});

  Object.entries(grouped).forEach(([date, items]) => {
    addText(date, 12, true);

    items.forEach((t) => {
      addText(
        `• ${t.title} | Rp ${t.amount} | ${t.type}`,
        10,
        false
      );
    });

    y += 2;
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