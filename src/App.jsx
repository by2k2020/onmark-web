import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Activity, Users, FileSearch, Send, CheckCircle, AlertTriangle, ChevronRight, Menu, X, Smartphone, Siren } from 'lucide-react';


const OnMarkWeb = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [activeTab, setActiveTab] = useState('user'); // user vs police
 const [demoState, setDemoState] = useState('original'); // original vs watermarked
 const [feedbackEmail, setFeedbackEmail] = useState('');
 const [feedbackSent, setFeedbackSent] = useState(false);


 // Scroll animations
 const [isVisible, setIsVisible] = useState({});
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


 const handleFeedbackSubmit = (e) => {
   e.preventDefault();
   if(feedbackEmail) {
     setFeedbackSent(true);
     setTimeout(() => setFeedbackSent(false), 3000);
     setFeedbackEmail('');
   }
 };


 return (
   <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

     {/* Top Banner - Beta Notice */}
     <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-xs md:text-sm py-2 px-4 text-center text-blue-100 font-medium z-50 relative">
       <span className="inline-flex items-center gap-2">
         <Activity size={14} className="animate-pulse text-blue-400" />
         현재 <span className="font-bold text-white">Open Beta v0.9</span> 테스트 중입니다. 여러분의 소중한 피드백이 더 안전한 세상을 만듭니다.
       </span>
     </div>


     {/* Navigation */}
     <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between h-16 items-center">
           <div className="flex items-center gap-2">
             <Shield className="text-blue-500 fill-blue-500/20" size={28} />
             <span className="text-xl font-bold tracking-tight">OnMark</span>
             <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 ml-1">BETA</span>
           </div>

           {/* Desktop Menu */}
           <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-slate-300">
             <a href="#problem" className="hover:text-white transition-colors">문제 정의</a>
             <a href="#technology" className="hover:text-white transition-colors">핵심 기술</a>
             <a href="#police-test" className="hover:text-blue-400 text-blue-200 transition-colors flex items-center gap-1">
               <Siren size={14} /> 경찰청 연계 테스트
             </a>
             <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-semibold">
               베타 참여하기
             </button>
           </div>


           {/* Mobile Menu Button */}
           <div className="md:hidden">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
           </div>
         </div>
       </div>


       {/* Mobile Menu */}
       {isMenuOpen && (
         <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4">
           <a href="#problem" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">문제 정의</a>
           <a href="#technology" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">핵심 기술</a>
           <a href="#police-test" onClick={() => setIsMenuOpen(false)} className="block text-blue-300 font-medium">경찰청 연계 테스트</a>
           <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">베타 참여하기</button>
         </div>
       )}
     </nav>


     {/* Hero Section */}
     <section id="hero" className="relative pt-20 pb-32 px-4 overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
         <div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
       </div>


       <div className="max-w-5xl mx-auto text-center relative z-10">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400 text-xs font-semibold mb-6">
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
           <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
             <Smartphone size={18} />
             무료로 사진 보호하기
           </button>
           <button className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
             <Activity size={18} />
             테스트 현황 보기
           </button>
         </div>
       </div>
     </section>


     {/* Problem Section (Statistics) */}
     <section id="problem" className={`py-20 bg-slate-900/50 border-y border-slate-800 transition-opacity duration-1000 ${isVisible.problem ? 'opacity-100' : 'opacity-0'}`}>
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
           <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative">
             <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-700 z-10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-300">Live Demo</span>
             </div>

             <div className="aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden relative mb-6 group">
               {demoState === 'original' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600 text-slate-400 flex-col">
                     <Users size={64} className="mb-4 text-slate-500" />
                     <span>원본 이미지 (Original)</span>
                  </div>
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600 text-slate-400 flex-col relative">
                     <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay pointer-events-none"></div>
                     <Users size={64} className="mb-4 text-slate-500" />
                     <span className="text-blue-200">OnMark 보호 적용됨 (Protected)</span>
                     <div className="absolute bottom-4 left-4 text-[10px] text-blue-300 bg-blue-900/50 px-2 py-1 rounded border border-blue-500/30">
                       Blue-Channel: [Hidden Data]
                     </div>
                  </div>
               )}

               {/* Comparison Slider Handle (Fake) */}
               <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center justify-center cursor-ew-resize">
                  <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                     <Activity size={16} className="text-slate-900" />
                  </div>
               </div>
             </div>


             <div className="flex justify-center gap-4">
               <button
                 onClick={() => setDemoState('original')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${demoState === 'original' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 원본 보기
               </button>
               <button
                 onClick={() => setDemoState('protected')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${demoState === 'protected' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 워터마크 적용 확인
               </button>
             </div>

             <p className="text-center text-xs text-slate-500 mt-4">
               * 실제 눈으로는 차이를 구분할 수 없습니다 (SSIM 0.958)
             </p>
           </div>
         </div>
       </div>
     </section>


     {/* Police Integration Section (B2G) - Key User Request */}
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
           {/* Fake Dashboard UI */}
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
                 <div className="text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 cursor-pointer">포렌식 분석</div>
                 <div className="text-slate-400 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 cursor-pointer">증거물 관리</div>
               </div>

               <div className="mt-auto pt-8 border-t border-slate-800 mt-32">
                 <div className="text-xs text-slate-500">
                   System Status: <span className="text-green-500">Secure</span>
                 </div>
                 <div className="text-xs text-slate-500 mt-1">
                   Beta Build v0.9.4
                 </div>
               </div>
             </div>


             {/* Main Content */}
             <div className="p-6 md:p-8">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold">실시간 추적 분석</h3>
                 <button className="bg-red-500/10 text-red-400 px-3 py-1 rounded text-xs font-medium border border-red-500/20 animate-pulse">
                   긴급 분석 요청 처리 중...
                 </button>
               </div>


               {/* Tracking Visualization */}
               <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                     <Users size={32} />
                   </div>
                   <div>
                      <div className="text-sm text-slate-400">Target ID: #CASE-2024-8832</div>
                      <div className="font-mono text-blue-400 text-sm mt-1">Key: 7BxE93pYfQaRwMtZ2...</div>
                   </div>
                 </div>

                 <div className="space-y-3">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[85%]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                       <span>워터마크 복구율: 95% (Reed-Solomon)</span>
                       <span>유포 경로 추적 중</span>
                    </div>
                 </div>
               </div>


               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                   <div className="text-xs text-slate-500 mb-1">최초 유포 시각</div>
                   <div className="font-mono text-white">2024.12.04 14:22:10</div>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">위변조 여부</div>
                    <div className="font-bold text-red-400">탐지됨 (Face Swap)</div>
                 </div>
               </div>

               <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-sm text-blue-200 flex items-start gap-3">
                 <Activity className="shrink-0 mt-0.5" size={16} />
                 <p>이 대시보드는 현재 경찰 자문위원 및 사이버 수사팀과 협력하여 UI/UX 및 기능 실효성을 검증하고 있습니다.</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>


     {/* Beta Feedback Form */}
     <section className="py-20 px-4 max-w-3xl mx-auto text-center">
       <h2 className="text-3xl font-bold mb-4">여러분의 의견을 들려주세요</h2>
       <p className="text-slate-400 mb-8">
         OnMark는 현재 베타 테스트 단계입니다. <br/>
         서비스 개선을 위해 사용자 여러분의 피드백을 적극 반영하고 있습니다.
       </p>


       <form onSubmit={handleFeedbackSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex flex-col gap-4 text-left">
             <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">어떤 점이 개선되면 좋을까요?</label>
               <textarea
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder-slate-600"
                 placeholder="예: 인스타그램 업로드 시 화질 저하가 궁금합니다. / 앱 사용이 조금 더 간편했으면 좋겠어요."
               ></textarea>
             </div>

             <div className="flex gap-4 items-end">
               <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">이메일 (선택)</label>
                  <input
                   type="email"
                   value={feedbackEmail}
                   onChange={(e) => setFeedbackEmail(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                   placeholder="contact@email.com"
                  />
               </div>
               <button
                 type="submit"
                 className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${feedbackSent ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
               >
                 {feedbackSent ? <CheckCircle size={20} /> : <Send size={20} />}
                 {feedbackSent ? '전송 완료' : '피드백 보내기'}
               </button>
             </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-left">
            * 보내주신 의견은 OnMark 서비스 고도화 및 심사 발표 자료 보완에 소중히 사용됩니다.
          </p>
       </form>
     </section>


     {/* Footer */}
     <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4">
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-2">
           <Shield className="text-slate-600" size={24} />
           <span className="text-lg font-bold text-slate-500">OnMark</span>
         </div>
         <div className="text-sm text-slate-600 text-center md:text-right">
           <p>© 2024 OnMark Project. All rights reserved.</p>
           <p className="mt-1">제12회 SW융합 해커톤 대상 (과기부 장관상) 수상작</p>
         </div>
       </div>
     </footer>
   </div>
 );
};


export default OnMarkWeb;