import useFinance from "../hooks/useFinance";
import { useState } from "react";

export default function Wallet() {
  const { wallets, addWallet, updateWalletBalance } = useFinance();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [edit, setEdit] = useState({});

  const format = (n) => Number(n || 0).toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-yellow-50 p-4 font-mono space-y-4">

      {/* HEADER */}
      <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_black]">
        <h1 className="font-black text-xl">🏦 YOUR WALLET BANK</h1>
      </div>

      {/* CARDS */}
      <div className="space-y-3">
        {wallets.map((w) => (
          <div
            key={w.name}
            className="bg-gradient-to-br from-black to-zinc-900 text-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_black] transition-all hover:translate-y-[-2px]"
          >
            <div className="flex justify-between items-center">
              <div className="font-black text-lg tracking-wide">
                {w.name.toUpperCase()}
              </div>

              <div className="text-xs bg-yellow-300 text-black px-2 py-1 font-black border-2 border-black">
                ACTIVE
              </div>
            </div>

            {/* BALANCE INPUT */}
            <div className="mt-3 relative">
                <span className="absolute left-3 top-2 font-black text-yellow-300">
                    Rp
                </span>

                <input
                    type="number"
                    className="bg-black text-white border-2 border-yellow-300 pl-10 pr-2 py-2 w-full font-black text-right focus:outline-none focus:border-pink-400"
                    value={edit[w.name] ?? w.balance}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.target.select()}
                    onChange={(e) => {
                    const val = e.target.value;

                    setEdit((prev) => ({
                        ...prev,
                        [w.name]: val,
                    }));

                    updateWalletBalance(w.name, val);
                    }}
                />
                </div>

            <div className="text-sm mt-2 font-bold text-yellow-300">
              Balance: Rp {format(w.balance)}
            </div>
          </div>
        ))}
      </div>

      {/* ADD WALLET */}
      <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_black]">
        <div className="font-black mb-2">➕ ADD WALLET</div>

        <input
          className="border-2 border-black p-2 w-full mb-2"
          placeholder="wallet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border-2 border-black p-2 w-full mb-2"
          placeholder="balance"
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        <button
          onClick={() => {
            addWallet(name, balance);
            setName("");
            setBalance("");
          }}
          className="w-full bg-black text-white font-black p-2 border-4 border-black shadow-[4px_4px_0px_0px_black]"
        >
          CREATE WALLET
        </button>
      </div>

    </div>
  );
}