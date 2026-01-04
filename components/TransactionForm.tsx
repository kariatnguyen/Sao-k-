
import React, { useState, useRef } from 'react';
import { extractTransactionFromImage } from '../geminiService';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<Transaction> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setExtractedData(null);
    try {
      const data = await extractTransactionFromImage(base64);
      setExtractedData(data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xử lý ảnh. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: extractedData.type || 'Chuyển đổi PI sang USDT',
        status: extractedData.status || 'Đã chuyển đổi ✅',
        piAmount: extractedData.piAmount || 0,
        usdtAmount: extractedData.usdtAmount || 0,
        fee: extractedData.fee || 'Không mất phí',
        sourceAccount: extractedData.sourceAccount || 'Tài khoản Giao dịch',
        exchangeRate: extractedData.exchangeRate || '',
        timestamp: extractedData.timestamp || new Date().toLocaleString(),
        createdAt: Date.now(),
      };
      onSave(newTransaction);
      setPreviewUrl(null);
      setExtractedData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
      {/* Upload Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Tải lên biên lai</h2>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            {previewUrl ? (
              <div className="relative aspect-[3/4] max-w-xs mx-auto overflow-hidden rounded-2xl shadow-xl">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white font-medium">Thay đổi ảnh</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-700">Thêm ảnh giao dịch</p>
                  <p className="text-slate-400 text-sm">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-indigo-400"></i>
            Hệ thống sử dụng AI Gemini để tự động phân tích dữ liệu từ hình ảnh.
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Kết quả phân tích</h2>
          
          {!previewUrl && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <i className="fa-solid fa-robot text-5xl opacity-20"></i>
              <p>Chưa có dữ liệu để hiển thị</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Đang quét dữ liệu...</p>
            </div>
          )}

          {extractedData && !loading && (
            <div className="flex-1 space-y-4 animate-slideUp">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin chính</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Loại:</span>
                    <span className="font-semibold text-slate-800">{extractedData.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Trạng thái:</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {extractedData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-medium text-slate-700">{extractedData.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Đã chuyển (PI)</p>
                  <p className="text-xl font-bold text-indigo-700">{extractedData.piAmount?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Nhận về (USDT)</p>
                  <p className="text-xl font-bold text-emerald-700">{extractedData.usdtAmount?.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí:</span>
                  <span className="text-slate-700">{extractedData.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tỷ giá:</span>
                  <span className="text-slate-700 font-mono text-xs">{extractedData.exchangeRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tài khoản:</span>
                  <span className="text-slate-700 truncate max-w-[150px]">{extractedData.sourceAccount}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                Xác nhận & Lưu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
