
import React, { useState, useRef } from 'react';
import { 
  CameraIcon, 
  PhotoIcon, 
  ArrowPathIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  UserIcon,
  ArrowsPointingOutIcon,
  SparklesIcon,
  IdentificationIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BriefcaseIcon
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
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              ID Photo <span className="text-blue-600">Pro AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">AI-Powered Photo Engine</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="mb-2">
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Tạo ảnh thẻ tự động cho mọi loại hồ sơ
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Chụp ảnh tại nhà và để AI lo phần còn lại. Chuẩn ảnh lái xe, hộ chiếu và khám sức khỏe.
            </p>
          </div>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-blue-600" />
              1. Tải ảnh selfie của bạn
            </h3>
            
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
                    alt="Ảnh thẻ gốc" 
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
                    <p className="text-sm font-medium text-slate-700">Tải ảnh để tạo ảnh thẻ</p>
                    <p className="text-xs text-slate-400 mt-1">Chuẩn bị ảnh đủ sáng, nhìn thẳng</p>
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
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <InformationCircleIcon className="w-5 h-5 text-blue-600" />
              2. Cấu hình ảnh thẻ chuẩn SEO
            </h3>

            <div className="space-y-6">
              {/* Target Size Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Chọn kích thước (3x4, 4x6, Passport)</label>
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

              {/* Background Selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Phông nền theo quy định</label>
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Trang phục chuyên nghiệp</label>
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
                    AI đang xử lý tự động...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Bắt đầu tạo ảnh {selectedSize?.label}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Results & Guides */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-green-600" />
              Kết quả ảnh thẻ AI chất lượng Studio
            </h3>

            {!resultImage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <SparklesIcon className="w-8 h-8 text-blue-300" />
                </div>
                <p className="text-sm font-medium">Tự động hoá ảnh thẻ chuyên nghiệp</p>
                <p className="text-xs mt-2 text-slate-400 max-w-sm">
                  Công nghệ AI giúp tạo ảnh thẻ lái xe, hộ chiếu và hồ sơ đạt chuẩn quy định của cơ quan nhà nước.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col items-center">
                  <div className="relative inline-block">
                    <div 
                       className="relative shadow-2xl border-8 border-white rounded overflow-hidden"
                       style={{
                         aspectRatio: `${selectedSize?.width}/${selectedSize?.height}`,
                         maxHeight: '400px'
                       }}
                    >
                      <img 
                        src={resultImage} 
                        alt={`Ảnh thẻ ${selectedSize?.label} tự động`} 
                        className="h-full w-auto object-cover" 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                     <p className="text-lg font-bold text-slate-800">Ảnh {selectedSize?.label} đã sẵn sàng</p>
                     <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">High-Resolution Output</p>
                  </div>

                  <button 
                    onClick={() => downloadImage(resultImage, selectedSize?.label || 'anh-the-ai')}
                    className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Tải ảnh thẻ chuẩn SEO
                  </button>
                </div>
                <hr className="border-slate-100" />
              </div>
            )}
          </section>

          {/* New Section for Purpose Guidance (SEO Optimized) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <IdentificationIcon className="w-6 h-6 text-blue-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800">ẢNH BẰNG LÁI XE</p>
              <p className="text-[9px] text-slate-400">Chuẩn 3x4 hoặc 4x6 nền xanh/trắng</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <DocumentTextIcon className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800">ẢNH KHÁM SỨC KHOẺ</p>
              <p className="text-[9px] text-slate-400">Chuẩn 4x6 nền trắng sắc nét</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <GlobeAltIcon className="w-6 h-6 text-purple-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800">ẢNH HỘ CHIẾU</p>
              <p className="text-[9px] text-slate-400">Chuẩn Passport 4x6 quốc tế</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <BriefcaseIcon className="w-6 h-6 text-orange-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-800">ẢNH HỒ SƠ XIN VIỆC</p>
              <p className="text-[9px] text-slate-400">Chỉnh chu với vest và sơ mi AI</p>
            </div>
          </div>
          
          <div className="bg-blue-600 p-6 rounded-2xl text-white">
             <h4 className="font-bold mb-3 flex items-center gap-2">
               <SparklesIcon className="w-5 h-5 text-blue-200" />
               Ưu điểm của tạo ảnh thẻ tự động AI
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs opacity-90">
                <div className="flex gap-2">
                   <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center shrink-0">✓</div>
                   <p><b>Tạo ảnh thẻ lái xe:</b> Đáp ứng chuẩn phông nền và kích thước của Bộ Giao thông.</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center shrink-0">✓</div>
                   <p><b>Tạo ảnh thẻ khám sức khỏe:</b> Tự động xử lý ánh sáng chuẩn phòng chụp Studio.</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center shrink-0">✓</div>
                   <p><b>Tạo ảnh hộ chiếu online:</b> Tỷ lệ khuôn mặt 70-80% chuẩn ICAO quốc tế.</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center shrink-0">✓</div>
                   <p><b>Tạo ảnh hồ sơ CV:</b> Trang phục lịch sự giúp bạn ghi điểm với nhà tuyển dụng.</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Footer with SEO Keywords */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Danh mục tạo ảnh thẻ chuyên dụng</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 text-xs font-medium text-slate-500">
            <span className="hover:text-blue-600 cursor-default">Tạo ảnh thẻ tự động AI</span>
            <span className="hover:text-blue-600 cursor-default">Tạo ảnh thẻ lái xe online</span>
            <span className="hover:text-blue-600 cursor-default">Tạo ảnh thẻ khám sức khoẻ</span>
            <span className="hover:text-blue-600 cursor-default">Tạo ảnh hộ chiếu (Passport)</span>
            <span className="hover:text-blue-600 cursor-default">Tạo ảnh hồ sơ xin việc (CV)</span>
            <span className="hover:text-blue-600 cursor-default">Làm ảnh thẻ 3x4 miễn phí</span>
            <span className="hover:text-blue-600 cursor-default">Chỉnh sửa ảnh thẻ online</span>
          </div>
          <div className="pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-[10px] leading-relaxed">
              ID Photo Pro AI - Nền tảng tạo ảnh thẻ tự động hàng đầu. Chúng tôi cung cấp giải pháp làm ảnh thẻ lái xe, khám sức khỏe, hộ chiếu chuẩn SEO và thẩm mỹ cao nhất.<br/>
              © 2024 AI Vision Lab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
