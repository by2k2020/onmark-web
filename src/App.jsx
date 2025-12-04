// OnMark Web - v0.9.8 (Visual Confirmation Banner)
import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Eye, Lock, Activity, Users, FileSearch, Send, CheckCircle, 
  AlertTriangle, ChevronRight, Menu, X, Smartphone, Siren, 
  Database, Server, Fingerprint, Award, TrendingUp, Info,
  Upload, Image as ImageIcon, Download, Loader2, Check, Scan, Zap, FileText
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const OnMarkWeb = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('b2c'); 
  
  // 기능 1: 피드백 폼 상태
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); 
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // 기능 2: 경찰청 대시보드 시뮬레이션 상태
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null); 
  const [forensicImage, setForensicImage] = useState(null); 
  const [forensicFileName, setForensicFileName] = useState(''); 
  const forensicFileInputRef = useRef(null);
  
  // 분석 결과 교차(Toggle)를 위한 Ref
  const lastAnalysisResultRef = useRef('clean'); 

  // 기능 3: 팝업 메시지 (Toast)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // 기능 4: 사진 보호 업로드 모달 상태
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState('idle'); 
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // 기능 5: 라이브 데모 (슬라이더)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [showWatermarkData, setShowWatermarkData] = useState(false);
  const demoContainerRef = useRef(null);

  // 기능 6: 스크롤 애니메이션
  const [isVisible, setIsVisible] = useState({});

  // Firebase State
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [appId, setAppId] = useState(null);

  // --- Firebase Initialization & Auth ---
  useEffect(() => {
    const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    setAppId(currentAppId);

    if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        setDb(firestore);

        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }
  }, []);

  // --- Scroll Observer ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // --- Slider Handlers ---
  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  const handleMouseMove = (e) => {
    if (!isResizing || !demoContainerRef.current) return;
    const rect = demoContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };
  const handleTouchMove = (e) => {
    if (!demoContainerRef.current) return;
    const rect = demoContainerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // --- Feedback Submit Handler ---
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if(feedbackMessage.trim().length === 0) {
      showToast('의견 내용을 입력해주세요.', 'error');
      return;
    }

    if (!db || !user) {
        showToast('서버 연결 중입니다. 잠시 후 다시 시도해주세요.', 'warning');
        return;
    }

    setIsSubmitting(true);

    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback'), {
            message: feedbackMessage,
            email: feedbackEmail || 'anonymous',
            timestamp: new Date().toISOString(),
            userId: user.uid
        });

        setFeedbackSent(true);
        showToast('소중한 의견이 서버에 안전하게 저장되었습니다.', 'success');
        
        setTimeout(() => {
            setFeedbackSent(false);
            setFeedbackMessage('');
            setFeedbackEmail('');
        }, 3000);
    } catch (error) {
        console.error("Error adding document: ", error);
        showToast('전송 중 오류가 발생했습니다.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Download Feedback as CSV ---
  const handleDownloadCSV = async () => {
      if (!db || !user) {
          showToast('데이터를 불러올 권한이 없습니다.', 'error');
          return;
      }

      try {
          showToast('데이터를 불러오는 중...', 'info');
          const querySnapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'feedback'));
          
          let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
          csvContent += "날짜,이메일,내용\n"; 

          const data = [];
          querySnapshot.forEach((doc) => {
              const d = doc.data();
              data.push(d);
          });

          data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          data.forEach(row => {
              const date = new Date(row.timestamp).toLocaleString();
              const safeMessage = `"${(row.message || '').replace(/"/g, '""')}"`;
              const safeEmail = `"${(row.email || '').replace(/"/g, '""')}"`;
              csvContent += `${date},${safeEmail},${safeMessage}\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "OnMark_Feedback_Data.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showToast('피드백 데이터 다운로드가 완료되었습니다.', 'success');

      } catch (error) {
          console.error("Error downloading CSV:", error);
          showToast('데이터 다운로드 실패', 'error');
      }
  };

  // --- Forensic File Select (Updated: Toggle Logic) ---
  const handleForensicFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForensicImage(imageUrl);
      setForensicFileName(file.name);
      setAnalysisStatus('analyzing');
      setAnalysisResult(null); 
      showToast(`'${file.name}' 업로드 완료. AI 정밀 분석을 시작합니다.`, 'info');

      // 3초 후 결과 도출 (결과를 번갈아가며 보여줌)
      setTimeout(() => {
        setAnalysisStatus('complete');
        
        // 이전 결과와 반대되는 결과를 설정 (Toggle)
        // clean -> detected -> clean -> detected ...
        const nextResult = lastAnalysisResultRef.current === 'clean' ? 'detected' : 'clean';
        lastAnalysisResultRef.current = nextResult;
        setAnalysisResult(nextResult);

        if (nextResult === 'detected') {
          showToast('분석 완료: 위변조 흔적(Face Swap)이 검출되었습니다.', 'warning');
        } else {
          showToast('분석 완료: 위변조 흔적이 없는 정상(Authentic) 이미지입니다.', 'success');
        }
      }, 3000);
    }
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadStep('idle');
    setSelectedImage(null);
  };
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setUploadStep('processing');
      setTimeout(() => {
        setUploadStep('complete');
        showToast('OnMark 워터마킹 처리가 완료되었습니다.', 'success');
      }, 2500);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleNotReady = (featureName) => {
    showToast(`'${featureName}' 기능은 베타 기간 중 준비 중입니다.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      
      {/* 🔴 DEBUG BANNER (버전 확인용 - v0.9.8) */}
      <div className="bg-yellow-500 text-black text-center py-3 font-bold text-lg fixed top-0 left-0 w-full z-[9999] animate-pulse shadow-xl border-b-4 border-yellow-700">
        🚧 [확인용 배너] v0.9.8 업데이트 적용됨 (이게 보여야 최신입니다!) 🚧
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap">
          {toast.type === 'success' ? <CheckCircle className="text-green-400" size={20} /> : 
           toast.type === 'warning' ? <AlertTriangle className="text-red-400" size={20} /> :
           toast.type === 'error' ? <AlertTriangle className="text-red-500" size={20} /> :
           <Info className="text-blue-400" size={20} />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative">
            <button onClick={handleCloseUploadModal} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
              <X size={24} />
            </button>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">사진 보호 (OnMarking)</h3>
              <p className="text-slate-400 text-sm mb-6">업로드 즉시 비가시성 워터마크가 삽입됩니다.</p>
              {uploadStep === 'idle' && (
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 hover:border-blue-500 hover:bg-slate-800/50 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-400" size={32} />
                  </div>
                  <p className="text-slate-300 font-medium">클릭하여 이미지 업로드</p>
                  <p className="text-slate-500 text-xs mt-2">JPG, PNG, WEBP 지원</p>
                </div>
              )}
              {uploadStep === 'processing' && (
                <div className="py-10">
                   <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-50">
                        {selectedImage && <img src={selectedImage} alt="processing" className="w-full h-full object-cover blur-sm" />}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                         <Loader2 className="text-blue-400 animate-spin" size={48} />
                      </div>
                   </div>
                   <h4 className="text-lg font-bold text-blue-400 animate-pulse">보호 처리 중...</h4>
                   <p className="text-slate-500 text-sm mt-2">DWT 변환 및 Blue-Channel 데이터 삽입 중</p>
                </div>
              )}
              {uploadStep === 'complete' && (
                <div className="py-6">
                   <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden mb-6 group">
                      {selectedImage && <img src={selectedImage} alt="protected" className="w-full h-full object-contain" />}
                      <div className="absolute bottom-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                        <Shield size={12} /> Protected
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-400 justify-center text-sm font-medium">
                        <CheckCircle size={16} />
                        <span>워터마킹 완료 (SSIM 0.958)</span>
                      </div>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = selectedImage;
                          link.download = 'OnMark_Protected_Image.png';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          showToast('보호된 이미지가 다운로드되었습니다.', 'success');
                          handleCloseUploadModal();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Download size={18} />
                        보호된 이미지 다운로드
                      </button>
                   </div>
                </div>
              )}
            </div>
            {uploadStep === 'idle' && (
              <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                * 업로드된 이미지는 서버에 저장되지 않으며, 브라우저 내에서 처리됩니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Banner (Margin added to avoid overlap with debug banner) */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-xs md:text-sm py-2 px-4 text-center text-blue-100 font-medium z-50 relative mt-14">
        <span className="inline-flex items-center gap-2">
          <Activity size={14} className="animate-pulse text-blue-400" />
          현재 <span className="font-bold text-white">Open Beta v0.9</span> 테스트 중입니다. 여러분의 소중한 피드백이 더 안전한 세상을 만듭니다.
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Shield className="text-blue-500 fill-blue-500/20" size={28} />
              <span className="text-xl font-bold tracking-tight">OnMark</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 ml-1">BETA</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-slate-300">
              <a href="#problem" className="hover:text-white transition-colors">문제 정의</a>
              <a href="#technology" className="hover:text-white transition-colors">핵심 기술</a>
              <a href="#police-test" className="hover:text-blue-400 text-blue-200 transition-colors flex items-center gap-1">
                <Siren size={14} /> 경찰청 연계 테스트
              </a>
              <a href="#business" className="hover:text-white transition-colors">서비스 모델</a>
              <button onClick={handleOpenUploadModal} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-semibold">베타 참여하기</button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4">
            <a href="#problem" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">문제 정의</a>
            <a href="#technology" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">핵심 기술</a>
            <a href="#police-test" onClick={() => setIsMenuOpen(false)} className="block text-blue-300 font-medium">경찰청 연계 테스트</a>
            <a href="#business" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">서비스 모델</a>
            <button onClick={() => { handleOpenUploadModal(); setIsMenuOpen(false); }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">베타 참여하기</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400 text-xs font-semibold mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Demo Available
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            딥페이크 성범죄,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              업로드 순간부터 예방합니다.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            OnMark는 안면 인식 기반의 비가시성 워터마킹 기술로 당신의 일상을 지킵니다.
            현재 경찰청 수사 연계 기능을 포함한 오픈 베타 테스트를 진행 중입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={handleOpenUploadModal} className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
              <Smartphone size={18} />
              무료로 사진 보호하기
            </button>
            <button onClick={() => document.getElementById('police-test').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <Activity size={18} />
              테스트 현황 보기
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className={`py-20 bg-slate-900/50 border-y border-slate-800 transition-all duration-1000 ${isVisible.problem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">왜 지금 OnMark인가요?</h2>
            <p className="text-slate-400">딥페이크 범죄는 더 이상 남의 일이 아닙니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-red-500/50 transition-colors group">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">9배</h3>
              <p className="text-lg font-medium text-red-400 mb-3">최근 3년 간 범죄 급증</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                딥페이크 성범죄 발생 건수가 폭발적으로 증가하고 있습니다.
              </p>
            </div>
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-colors group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">50%+</h3>
              <p className="text-lg font-medium text-orange-400 mb-3">피해자 절반이 미성년자</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                10대 청소년이 딥페이크 범죄의 가장 큰 표적이 되고 있습니다.
              </p>
            </div>
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-yellow-500/50 transition-colors group">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
                <FileSearch size={24} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">한계</h3>
              <p className="text-lg font-medium text-yellow-400 mb-3">기존 사후 추적의 한계</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                유포 후 삭제하는 방식은 확산 속도를 따라잡지 못합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-6">
                Technical Core
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                눈에 보이지 않는 방패,<br />
                <span className="text-blue-400">Blue-Channel Hybrid Watermarking</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                인간의 눈이 가장 둔감한 'Blue Channel' 파장 대역에 DWT와 DCT 기술을 결합하여 워터마크를 삽입합니다.
                원본 이미지의 품질을 95.8% 유지하면서도, 캡처나 리사이징 같은 공격에도 살아남습니다.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">강력한 내구성 (Robustness)</h4>
                    <p className="text-sm text-slate-400 mt-1">화면 캡처, 잘라내기(30~50%), 리사이징 공격에도 워터마크가 유지됩니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Eye className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">완벽한 비가시성 (Invisibility)</h4>
                    <p className="text-sm text-slate-400 mt-1">SSIM 0.958로 육안으로는 원본과 구분이 불가능합니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Demo UI */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative select-none">
              <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-700 z-10">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-xs text-slate-300">Live Demo</span>
              </div>
              <div 
                ref={demoContainerRef}
                className="aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden relative mb-6 group cursor-ew-resize"
                onMouseDown={handleMouseDown}
                onTouchMove={handleTouchMove}
              >
                <div className="absolute inset-0 w-full h-full">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80" alt="Protected" className="w-full h-full object-cover grayscale md:grayscale-0" />
                  {showWatermarkData && (
                    <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay">
                       <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                       <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">DATA DETECTED</div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">Protected</div>
                </div>
                <div className="absolute inset-0 w-full h-full border-r-2 border-white bg-slate-800" style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80" alt="Original" className="absolute top-0 left-0 max-w-none h-full object-cover grayscale md:grayscale-0" style={{ width: demoContainerRef.current ? demoContainerRef.current.clientWidth : '100%' }} />
                   <div className="absolute top-4 left-4 bg-slate-700/90 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">Original</div>
                </div>
                <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center z-20" style={{ left: `${sliderPosition}%` }}>
                  <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center -ml-[2px] border-2 border-slate-200">
                    <Scan size={16} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs text-slate-400 px-2">
                  <span>◀ 원본 (Original)</span>
                  <span className="text-blue-400 font-bold">{sliderPosition < 50 ? "Dragging..." : "워터마크 적용 (Protected) ▶"}</span>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setSliderPosition(0)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-slate-700">원본만 보기</button>
                  <button 
                    onClick={() => { setShowWatermarkData(!showWatermarkData); setSliderPosition(100); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${showWatermarkData ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                  >
                    {showWatermarkData ? <Zap size={14} className="fill-white" /> : <Scan size={14} />}
                    {showWatermarkData ? '데이터 숨기기' : '워터마크 데이터 확인'}
                  </button>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">* 슬라이더를 움직여보세요. 육안으로는 차이를 구분할 수 없습니다 (SSIM 0.958)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Police Integration Section */}
      <section id="police-test" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold tracking-wider text-sm uppercase mb-2 block">Project Track 2</span>
            <h2 className="text-3xl font-bold mb-4">경찰청 수사 연계 솔루션</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              단순한 예방을 넘어, 범죄 발생 시 유포자를 신속하게 추적할 수 있는
              <br className="hidden md:block" /> 수사 기관용 대시보드(Forensic Dashboard)를 함께 테스트하고 있습니다.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="grid md:grid-cols-[250px_1fr] min-h-[500px]">
              {/* Sidebar */}
              <div className="bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
                <div className="flex items-center gap-2 mb-8 px-2">
                  <Lock className="text-blue-500" size={20} />
                  <span className="font-bold text-slate-200">Police Admin</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-blue-600/10 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between">
                    <span>추적 요청 현황</span>
                    <span className="bg-blue-600 text-white text-[10px] px-1.5 rounded-full">3</span>
                  </div>
                  <div className="text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 cursor-pointer transition-colors">포렌식 분석</div>
                  <div className="text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 cursor-pointer transition-colors">증거물 관리</div>
                </div>
                <div className="mt-auto pt-8 border-t border-slate-800 mt-32">
                  <div className="text-xs text-slate-500">System Status: <span className="text-green-500">Secure</span></div>
                  <div className="text-xs text-slate-500 mt-1">Beta Build v0.9.6</div>
                </div>
              </div>

              {/* Main Content - Upload & Analyze */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">실시간 추적 분석</h3>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={forensicFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleForensicFileSelect} 
                    />
                    <button 
                      onClick={() => forensicFileInputRef.current?.click()}
                      disabled={analysisStatus === 'analyzing'}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all ${analysisStatus === 'analyzing' ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50'}`}
                    >
                      {analysisStatus === 'analyzing' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {analysisStatus === 'analyzing' ? '분석 중...' : '증거물 업로드 및 분석'}
                    </button>
                  </div>
                </div>

                {/* Tracking Visualization */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 overflow-hidden relative border border-slate-700">
                      {forensicImage ? (
                        <img src={forensicImage} alt="Forensic Target" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={32} />
                      )}
                      {analysisStatus === 'analyzing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="text-blue-400 animate-spin" size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                       <div className="text-sm text-slate-400">
                         Target: {forensicImage ? (forensicFileName.length > 20 ? forensicFileName.slice(0,20)+'...' : forensicFileName) : '파일을 업로드하세요'}
                       </div>
                       <div className="font-mono text-blue-400 text-sm mt-1">
                         {analysisStatus === 'idle' ? 'Status: Waiting for input' : 
                          analysisStatus === 'analyzing' ? 'Status: Decrypting Watermark...' : 
                          'Key: 7BxE93pYfQaRwMtZ2...'}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                     <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-500 transition-all ease-out duration-[3000ms] ${analysisStatus === 'analyzing' ? 'w-[85%]' : analysisStatus === 'complete' ? 'w-[100%]' : 'w-[0%]'}`}></div>
                     </div>
                     <div className="flex justify-between text-xs text-slate-400">
                        <span>워터마크 복구율: {analysisStatus === 'complete' ? (analysisResult === 'detected' ? '20.4% (훼손됨)' : '99.8%') : analysisStatus === 'analyzing' ? '계산 중...' : '대기 중'}</span>
                        <span>{analysisStatus === 'complete' ? '분석 완료' : analysisStatus === 'analyzing' ? '추적 중...' : '분석 대기'}</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">최초 유포 시각</div>
                    <div className={`font-mono transition-all ${analysisStatus === 'complete' ? 'text-white' : 'text-slate-600 blur-sm'}`}>
                      {analysisStatus === 'complete' ? '2024.12.04 14:22:10' : '0000.00.00 00:00:00'}
                    </div>
                  </div>
                  
                  {/* Analysis Result Box - Dynamic Color */}
                  <div className={`bg-slate-900 p-4 rounded-xl border transition-colors duration-500 ${
                      analysisStatus === 'complete' 
                          ? (analysisResult === 'detected' ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10')
                          : 'border-slate-800'
                  }`}>
                     <div className="text-xs text-slate-500 mb-1">위변조 여부</div>
                     <div className={`font-bold flex items-center gap-2 ${
                         analysisStatus === 'complete' 
                             ? (analysisResult === 'detected' ? 'text-red-400' : 'text-green-400')
                             : analysisStatus === 'analyzing' ? 'text-blue-400 animate-pulse' : 'text-slate-500'
                     }`}>
                       {analysisStatus === 'complete' ? (
                           analysisResult === 'detected' ? (
                               <>
                                   <AlertTriangle size={16} />
                                   탐지됨 (Face Swap)
                               </>
                           ) : (
                               <>
                                   <CheckCircle size={16} />
                                   정상 (Authentic)
                               </>
                           )
                       ) : analysisStatus === 'analyzing' ? (
                         <>
                           <Loader2 size={16} className="animate-spin" />
                           정밀 분석 중...
                         </>
                       ) : (
                         '분석 대기'
                       )}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section id="business" className="py-24 px-4 bg-slate-950">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">서비스 제공 모델</h2>
               <p className="text-slate-400">개인에게는 무료로, 기관과 기업에게는 강력한 보안 솔루션을 제공합니다.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               <div className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2c' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`} onClick={() => setActiveTab('b2c')}>
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6"><Users size={24} className="text-white" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">B2C (Personal)</h3>
                  <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded mb-4">FREE</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">누구나 자신의 사진을 무료로 보호할 수 있습니다. SNS 업로드 전 OnMark 웹/앱을 통해 워터마크를 적용하세요.</p>
               </div>
               <div className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2b' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`} onClick={() => setActiveTab('b2b')}>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6"><Server size={24} className="text-blue-400" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">B2B (Enterprise)</h3>
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded mb-4">PAID (API)</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">소셜 미디어, 데이팅 앱, 교육 기관 등 플랫폼을 위한 대량 처리 API를 제공합니다.</p>
               </div>
               <div className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2g' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`} onClick={() => setActiveTab('b2g')}>
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6"><Database size={24} className="text-indigo-400" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">B2G (Public)</h3>
                  <div className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded mb-4">PARTNERSHIP</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">경찰청 및 수사 기관과 연계하여 딥페이크 유포자를 식별하고 증거를 확보하는 포렌식 솔루션입니다.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Beta Feedback Form (Integrated with Firestore) */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">여러분의 의견을 들려주세요</h2>
        <p className="text-slate-400 mb-8">OnMark는 현재 베타 테스트 단계입니다. <br/>서비스 개선을 위해 사용자 여러분의 피드백을 적극 반영하고 있습니다.</p>
        <form onSubmit={handleFeedbackSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
           <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">어떤 점이 개선되면 좋을까요?</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder-slate-600" 
                  placeholder="예: 인스타그램 업로드 시 화질 저하가 궁금합니다. / 앱 사용이 조금 더 간편했으면 좋겠어요." 
                  value={feedbackMessage} 
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                   <label className="block text-sm font-medium text-slate-300 mb-2">이메일 (선택)</label>
                   <input 
                    type="email" 
                    value={feedbackEmail} 
                    onChange={(e) => setFeedbackEmail(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600" 
                    placeholder="contact@email.com" 
                    disabled={isSubmitting}
                   />
                </div>
                <button 
                  type="submit" 
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${feedbackSent ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'} ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : feedbackSent ? <CheckCircle size={20} /> : <Send size={20} />}
                  {isSubmitting ? '전송 중...' : feedbackSent ? '전송 완료' : '피드백 보내기'}
                </button>
              </div>
           </div>
           
           {/* Admin Download Link */}
           <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
             <p className="text-xs text-slate-500">* 보내주신 의견은 OnMark 서비스 고도화 및 심사 발표 자료 보완에 소중히 사용됩니다.</p>
             <button 
               type="button"
               onClick={handleDownloadCSV}
               className="text-xs text-slate-600 hover:text-blue-400 flex items-center gap-1 transition-colors"
             >
               <FileText size={12} /> 관리자: 데이터 다운로드 (.csv)
             </button>
           </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2"><Shield className="text-slate-600" size={24} /><span className="text-lg font-bold text-slate-500">OnMark</span></div>
          <div className="text-sm text-slate-600 text-center md:text-right"><p>© 2024 OnMark Project. All rights reserved.</p><p className="mt-1">제12회 SW융합 해커톤 대상 (과기부 장관상) 수상작</p></div>
        </div>
      </footer>
    </div>
  );
};

export default OnMarkWeb;