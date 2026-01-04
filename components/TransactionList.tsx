
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Thời gian', 'Loại giao dịch', 'Trạng thái', 'Số Pi', 'Số USDT', 'Phí', 'Tài khoản nguồn', 'Tỷ giá'];
    const rows = transactions.map(tx => [
      tx.timestamp,
      tx.type,
      tx.status,
      tx.piAmount,
      tx.usdtAmount,
      tx.fee,
      tx.sourceAccount,
      tx.exchangeRate.replace(/,/g, '.')
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `lich_su_giao_dich_${Date.now()}.csv`);
  };

  const exportToJSON = () => {
    if (transactions.length === 0) return;
    const jsonString = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, 'data.json');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
      <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lịch sử giao dịch</h2>
          <p className="text-sm text-slate-500">Xem lại các biên lai đã được AI xử lý</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToJSON}
            disabled={transactions.length === 0}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              transactions.length === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100'
            }`}
          >
            <i className="fa-solid fa-file-code"></i> Lưu data.json
          </button>
          <button 
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              transactions.length === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95'
            }`}
          >
            <i className="fa-solid fa-download"></i> Xuất CSV
          </button>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-folder-open text-slate-300 text-3xl"></i>
          </div>
          <p className="text-slate-500 font-medium">Bạn chưa lưu giao dịch nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Thời gian</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Loại & Trạng thái</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Số Pi</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Số USDT</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice().sort((a,b) => b.createdAt - a.createdAt).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-semibold text-slate-800">{tx.timestamp.split(' – ')[0]}</p>
                    <p className="text-xs text-slate-400">{tx.timestamp.split(' – ')[1] || ''}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-slate-700">{tx.type}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-bold">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-amber-600">
                    -{tx.piAmount.toLocaleString()} <span className="text-[10px] text-slate-400">PI</span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-emerald-600">
                    +{tx.usdtAmount.toLocaleString()} <span className="text-[10px] text-slate-400">USDT</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => {
                        if (confirm('Xóa giao dịch này?')) onDelete(tx.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
