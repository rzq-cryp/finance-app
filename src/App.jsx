import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import useFinance from "./hooks/useFinance";


export default function App() {
  const location = useLocation();
  const [openExport, setOpenExport] = useState(false);
  const { exportPDF, exportCSV } = useFinance ();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col font-mono">

      <div className="flex-1 pb-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>

      {/* NEUBRUTAL NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-4 border-black flex justify-around p-3 z-[999] shadow-[6px_6px_0px_0px_black]">

        <Link
          to="/"
          className={
            "font-black px-3 " +
            (isActive("/") ? "text-black" : "text-gray-400")
          }
        >
          HOME
        </Link>

        <Link
          to="/stats"
          className={
            "font-black px-3 " +
            (isActive("/stats") ? "text-black" : "text-gray-400")
          }
        >
          STATS
        </Link>

        <button
          onClick={() => setOpenExport(true)}
          className="font-black text-gray-400 px-3"
        >
          EXPORT
        </button>

      </div>

      {/* EXPORT MODAL NEUBRUTAL */}
      {openExport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">

          <div className="bg-white border-4 border-black p-5 w-80 space-y-3 shadow-[6px_6px_0px_0px_black]">

            <h2 className="font-black text-lg">EXPORT DATA</h2>

            <button
            onClick={exportPDF} 
            className="w-full border-2 border-black p-2 font-black bg-blue-300 shadow-[4px_4px_0px_0px_black]"
            >
              EXPORT PDF
            </button>

            <button
             onClick={exportCSV}
             className="w-full border-2 border-black p-2 font-black bg-green-300 shadow-[4px_4px_0px_0px_black]"
             >
              EXPORT CSV
            </button>

            <button
              onClick={() => setOpenExport(false)}
              className="w-full border-2 border-black p-2 font-black bg-red-300 shadow-[4px_4px_0px_0px_black]"
            >
              CLOSE
            </button>

          </div>

        </div>
      )}

    </div>
  );
}