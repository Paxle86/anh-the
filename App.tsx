
import React, { useState, useRef } from 'react';
import { 
  CameraIcon, 
  PhotoIcon, 
  ArrowPathIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  UserIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { BACKGROUND_COLORS, CLOTHING_OPTIONS, PHOTO_SIZES } from './constants';
import { BackgroundColor, ClothingType, GenerationConfig } from './types';
import { generateIdPhoto } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<GenerationConfig>({
    bgColor: 'white',
    clothing: 'none',
    targetSizeId: '3x4',
    faceRatio: 70
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateIdPhoto(sourceImage, config);
      if (result) {
        setResultImage(result);
      } else {
        setError("Không thể tạo ảnh. Vui lòng thử lại với ảnh khác.");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra trong quá trình xử lý.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, sizeLabel: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `id-photo-${sizeLabel.replace(/\s/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedSize = PHOTO_SIZES.find(s => s.id === config.targetSizeId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ID Photo <span className="text-blue-600">Pro AI</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Kích thước chuẩn</a>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <a href="#" className="hover:text-blue-600 transition-colors">Yêu cầu kỹ thuật</a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-blue-600" />
              1. Tải ảnh gốc
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                sourceImage ? 'border-blue-200 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {sourceImage ? (
                <div className="relative group">
                  <img 
                    src={sourceImage} 
                    alt="Source" 
                    className="max-h-64 mx-auto rounded-lg shadow-md" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                    <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <ArrowDownTrayIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Tải ảnh chân dung</p>
                    <p className="text-xs text-slate-400 mt-1">Ảnh chụp rõ mặt, đủ sáng</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-blue-600" />
              2. Tuỳ chỉnh thông số
            </h2>

            <div className="space-y-6">
              {/* Target Size Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Kích thước ảnh đích</label>
                <div className="grid grid-cols-2 gap-2">
                  {PHOTO_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setConfig(prev => ({ ...prev, targetSizeId: size.id }))}
                      className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        config.targetSizeId === size.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Face Ratio Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ khuôn mặt</label>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{config.faceRatio}%</span>
                </div>
                <div className="flex gap-2">
                  {[60, 70, 80].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setConfig(prev => ({ ...prev, faceRatio: ratio }))}
                      className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        config.faceRatio === ratio 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {ratio === 60 ? 'Nhỏ (60%)' : ratio === 70 ? 'Vừa (70%)' : 'Lớn (80%)'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic flex items-center gap-1">
                  <ArrowsPointingOutIcon className="w-3 h-3" />
                  Kích thước đầu so với tổng chiều cao ảnh thẻ
                </p>
              </div>

              {/* Background Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Màu phông nền</label>
                <div className="flex gap-4">
                  {BACKGROUND_COLORS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setConfig(prev => ({ ...prev, bgColor: bg.id as BackgroundColor }))}
                      className={`flex-1 flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                        config.bgColor === bg.id ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full shadow-inner border border-black/5 ${bg.class}`} />
                      <span className="text-[10px] font-bold text-slate-600">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clothing Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Trang phục</label>
                <div className="grid grid-cols-3 gap-2">
                  {CLOTHING_OPTIONS.map((cloth) => (
                    <button
                      key={cloth.id}
                      onClick={() => setConfig(prev => ({ ...prev, clothing: cloth.id as ClothingType }))}
                      className={`p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                        config.clothing === cloth.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{cloth.icon}</span>
                      <span className="text-[9px] font-bold leading-tight text-slate-700 whitespace-pre-wrap">{cloth.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!sourceImage || isGenerating}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                  !sourceImage || isGenerating 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Đang thiết kế...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Tạo ảnh thẻ {selectedSize?.label}
                  </>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Results Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-green-600" />
              Kết quả ảnh thẻ AI
            </h2>

            {!resultImage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <PhotoIcon className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Chọn các tuỳ chọn và bấm "Tạo ảnh thẻ"</p>
                <p className="text-xs mt-1 text-center max-w-xs">AI sẽ phân tích ảnh gốc, đổi phông nền, trang phục và cắt theo kích thước chuẩn.</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                {/* Master Preview */}
                <div className="flex flex-col items-center">
                  <div className="relative inline-block group">
                    <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-10 rounded-full"></div>
                    <div 
                       className="relative shadow-2xl border-8 border-white rounded shadow-blue-900/10 overflow-hidden"
                       style={{
                         aspectRatio: `${selectedSize?.width}/${selectedSize?.height}`,
                         maxHeight: '400px'
                       }}
                    >
                      <img 
                        src={resultImage} 
                        alt="Result Master" 
                        className="h-full w-auto object-cover" 
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                      <CheckCircleIcon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                     <p className="text-lg font-bold text-slate-800">{selectedSize?.label}</p>
                     <p className="text-xs text-slate-400">Kích thước chuẩn: {selectedSize?.mmWidth}mm x {selectedSize?.mmHeight}mm</p>
                  </div>

                  <button 
                    onClick={() => downloadImage(resultImage, selectedSize?.label || 'result')}
                    className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Tải về máy
                  </button>
                </div>

                <hr className="border-slate-100" />

                {/* Grid Preview Simulation */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bản in khổ 10x15cm</p>
                    <button 
                      onClick={() => window.print()}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      In ngay
                    </button>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="shadow-[0_2px_5px_rgba(0,0,0,0.1)] bg-white overflow-hidden" style={{ aspectRatio: `${selectedSize?.width}/${selectedSize?.height}` }}>
                        <img src={resultImage} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 text-center italic">Minh họa cách sắp xếp trên giấy in ảnh chuyên dụng</p>
                </div>
              </div>
            )}
          </section>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
             <InformationCircleIcon className="w-6 h-6 text-amber-500 shrink-0" />
             <div className="text-sm text-amber-900">
                <p className="font-bold mb-1">Ghi chú về chất lượng:</p>
                <p className="text-xs opacity-90 leading-relaxed">
                   AI sẽ giữ nguyên <b>từng đặc điểm khuôn mặt</b> và <b>kết cấu da tự nhiên</b> (không làm mịn da). 
                   Chỉ các khuyết điểm tạm thời như mụn sẽ được xử lý để ảnh thẻ trông chuyên nghiệp nhất.
                </p>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 ID Photo Pro AI. Nâng tầm ảnh thẻ bằng Trí tuệ nhân tạo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
