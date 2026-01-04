
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractTransactionFromImage = async (base64Image: string): Promise<Partial<Transaction>> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Bạn là một chuyên gia OCR chuyên nghiệp. Nhiệm vụ của bạn là trích xuất thông tin từ ảnh chụp màn hình giao dịch tiền điện tử (đặc biệt là Pi sang USDT).
    Hãy trả về dữ liệu dưới dạng JSON thuần túy theo cấu trúc yêu cầu.
    Nếu không tìm thấy thông tin cụ thể, hãy cố gắng dự đoán dựa trên ngữ cảnh hoặc để trống.
    Lưu ý quan trọng:
    - Loại giao dịch: thường là "Chuyển đổi PI sang USDT"
    - Trạng thái: ví dụ "Đã chuyển đổi ✅"
    - Số PI đã chuyển: chỉ lấy số (ví dụ: 26.28416566)
    - Số USDT nhận được: chỉ lấy số (ví dụ: 5.61671067)
    - Phí giao dịch: ví dụ "Không mất phí"
    - Tài khoản nguồn: tên tài khoản
    - Tỷ giá giao dịch: ví dụ "1 PI ≈ 0.2136918 USDT"
    - Thời gian chuyển đổi: định dạng "HH:mm:ss – DD/MM/YYYY"
  `;

  const prompt = "Hãy trích xuất thông tin giao dịch từ hình ảnh này.";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          status: { type: Type.STRING },
          piAmount: { type: Type.NUMBER },
          usdtAmount: { type: Type.NUMBER },
          fee: { type: Type.STRING },
          sourceAccount: { type: Type.STRING },
          exchangeRate: { type: Type.STRING },
          timestamp: { type: Type.STRING },
        },
        required: ["type", "status", "piAmount", "usdtAmount", "timestamp"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Không thể nhận diện được nội dung ảnh.");
  
  return JSON.parse(text);
};
