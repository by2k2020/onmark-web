import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, Lock, Activity, Users, FileSearch, Send, CheckCircle, 
  AlertTriangle, ChevronRight, Menu, X, Smartphone, Siren, 
  Database, Server, Fingerprint, Award, TrendingUp 
} from 'lucide-react';

const OnMarkWeb = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoState, setDemoState] = useState('original'); // original vs protected
  const [activeTab, setActiveTab] = useState('b2c'); // b2c, b2b, b2g
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

      {/* Top Banner - Awards & Beta Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-[10px] md:text-xs py-2 px-4 text-center text-blue-100 font-medium z-50 relative border-b border-blue-800/30">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Award size={14} className="text-yellow-400" />
          <span className="font-bold text-white">제12회 SW융합 해커톤 대상 (과학기술정보통신부 장관상)</span>
          <span className="hidden sm:inline mx-2 text-blue-500">|</span>
          <span className="inline-flex items-center gap-1">
             <Activity size={14} className="text-blue-400 animate-pulse" />
             Open Beta v0.9 Live
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <Shield className="text-blue-500 fill-blue-500/20" size={28} />
              <span className="text-xl font-bold tracking-tight">OnMark</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-slate-300">
              <a href="#problem" className="hover:text-white transition-colors">문제 정의</a>
              <a href="#technology" className="hover:text-white transition-colors">핵심 기술</a>
              <a href="#police-solution" className="hover:text-white transition-colors">솔루션</a>
              <a href="#business" className="hover:text-white transition-colors">서비스 모델</a>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-semibold flex items-center gap-2">
                보호 시작하기 <ChevronRight size={14} />
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
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4 shadow-xl">
            <a href="#problem" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">문제 정의</a>
            <a href="#technology" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">핵심 기술</a>
            <a href="#police-solution" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">솔루션</a>
            <a href="#business" onClick={() => setIsMenuOpen(false)} className="block text-slate-300 hover:text-white">서비스 모델</a>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-4">보호 시작하기</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400 text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Deepfake-Resistant Identity Protection
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            당신의 얼굴, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              보이지 않는 방패
            </span>로 지키세요.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            OnMark는 <strong>안면 인식 기반 비가시성 워터마킹</strong> 기술입니다.<br className="hidden md:block"/>
            업로드 순간부터 딥페이크 악용을 차단하고, 유포 시 추적 가능한 증거를 남깁니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group">
              <Smartphone size={18} className="group-hover:scale-110 transition-transform"/>
              무료로 사진 보호하기
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <FileSearch size={18} />
              기술 백서(Whitepaper) 보기
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section (Statistics based on PDF) */}
      <section id="problem" className={`py-20 bg-slate-900/50 border-y border-slate-800 transition-all duration-1000 ${isVisible.problem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 leading-tight">
                <span className="text-red-500">7배 급증</span>한 딥페이크 범죄,<br />
                학교도 더 이상 안전지대가 아닙니다.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                2021년 1,913건에서 2024년 10,305건으로.<br />
                딥페이크 성범죄는 폭발적으로 증가하고 있으며, 피해자의 절반 이상이 미성년자입니다.
                단 일주일 만에 88건의 피해 사례가 발생하기도 했습니다.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="bg-red-500/10 p-3 rounded-lg text-red-500">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">10,305건</div>
                    <div className="text-sm text-slate-500">2024년 10월 기준 누적 피해 (21년 대비 급증)</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="bg-orange-500/10 p-3 rounded-lg text-orange-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">88건 / 1주</div>
                    <div className="text-sm text-slate-500">특정 텔레그램방 단일 주간 업로드 수</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Visualization */}
            <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle size={120} />
               </div>
               <h3 className="text-lg font-semibold mb-6 text-slate-200">연도별 딥페이크 피해 발생 추이</h3>
               <div className="flex items-end justify-between gap-4 h-64 w-full px-2">
                  <div className="w-full flex flex-col items-center gap-2 group">
                    <div className="text-xs text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">1,913</div>
                    <div className="w-full bg-slate-700 hover:bg-slate-600 rounded-t-lg transition-all h-[18%] relative group-hover:shadow-[0_0_15px_rgba(100,116,139,0.5)]"></div>
                    <span className="text-xs text-slate-500">2021</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2 group">
                    <div className="text-xs text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">3,574</div>
                    <div className="w-full bg-slate-700 hover:bg-slate-600 rounded-t-lg transition-all h-[34%] relative group-hover:shadow-[0_0_15px_rgba(100,116,139,0.5)]"></div>
                    <span className="text-xs text-slate-500">2022</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2 group">
                    <div className="text-xs text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">7,187</div>
                    <div className="w-full bg-orange-500/60 hover:bg-orange-500 rounded-t-lg transition-all h-[69%] relative group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"></div>
                    <span className="text-xs text-slate-500 font-bold text-orange-400">2023</span>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2 group">
                    <div className="text-xs text-red-400 font-bold mb-1 opacity-100">10,305</div>
                    <div className="w-full bg-red-600 hover:bg-red-500 rounded-t-lg transition-all h-[95%] relative animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                    <span className="text-xs text-slate-300 font-bold">2024</span>
                  </div>
               </div>
               <p className="text-xs text-right text-slate-600 mt-4">*출처: 한국형사·법무정책연구원 및 경찰청 통계 재구성</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section (Based on PDF Technical Details) */}
      <section id="technology" className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold tracking-wider text-sm uppercase mb-2 block">Our Core Technology</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Blue-Channel Hybrid Watermarking
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              DWT(이산 웨이블릿 변환)와 DCT(이산 코사인 변환)를 결합하여<br />
              인간의 시각이 가장 둔감한 <strong>Blue Channel</strong> 영역에 비가시성 마크를 삽입합니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
             {/* Tech Specs */}
             <div className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400 mt-1">
                      <Eye size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">완벽한 비가시성 (Invisibility)</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">
                        원본 이미지와 워터마킹된 이미지의 시각적 차이를 수치화한 <strong>SSIM 점수는 평균 0.958</strong>입니다. 
                        육안으로는 원본과 구분이 불가능합니다.
                      </p>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 w-[95.8%] h-full"></div>
                      </div>
                      <div className="text-right text-xs text-blue-400 mt-1">SSIM Score 0.958</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-3 rounded-lg text-green-400 mt-1">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">강력한 내구성 (Robustness)</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-2">
                        Reed-Solomon 오류 정정 코드를 적용하여 이미지가 손상되어도 워터마크를 복구합니다.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-500">
                        <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">스크린샷</span>
                        <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">30~50% 크롭</span>
                        <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">리사이징</span>
                        <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">노이즈 추가</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-4">
                     <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400 mt-1">
                        <Fingerprint size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">얼굴 인식 기반 보호 (Face ROI)</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          딥페이크 공격의 대상이 되는 얼굴 영역(ROI)을 집중적으로 보호하여, 
                          얼굴이 합성(Swap)되거나 변조될 경우 즉시 탐지합니다.
                        </p>
                     </div>
                  </div>
                </div>
             </div>

             {/* Interactive Demo */}
             <div className="bg-slate-950 rounded-3xl p-1 border border-slate-800 shadow-2xl relative group">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="relative bg-slate-900 rounded-[22px] p-6 h-full flex flex-col">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         <span className="text-sm font-semibold text-slate-300">Live Tech Demo</span>
                      </div>
                      <div className="flex bg-slate-800 rounded-lg p-1">
                         <button 
                           onClick={() => setDemoState('original')}
                           className={`px-3 py-1 rounded text-xs font-medium transition-colors ${demoState === 'original' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                         >
                           Original
                         </button>
                         <button 
                           onClick={() => setDemoState('protected')}
                           className={`px-3 py-1 rounded text-xs font-medium transition-colors ${demoState === 'protected' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                         >
                           Protected
                         </button>
                      </div>
                   </div>

                   {/* Demo Image Area */}
                   <div className="relative flex-1 bg-slate-800 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center border border-slate-700/50">
                      {demoState === 'original' ? (
                        <div className="text-center p-6">
                           <Users size={64} className="mx-auto text-slate-600 mb-4" />
                           <p className="text-slate-400 font-medium">원본 이미지</p>
                           <p className="text-slate-500 text-xs mt-2">일반적인 JPEG/PNG 데이터</p>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] mix-blend-overlay"></div>
                           <Users size={64} className="mx-auto text-blue-500/50 mb-4" />
                           <p className="text-blue-300 font-medium z-10">OnMark 보호 적용됨</p>
                           <p className="text-slate-500 text-xs mt-2 z-10">육안상 차이 없음 (SSIM 0.958)</p>
                           
                           {/* Hidden Data Visualization */}
                           <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-blue-500/30 p-3 rounded-lg text-[10px] font-mono text-blue-400">
                              <div className="flex justify-between mb-1 text-slate-500">
                                 <span>Blue Channel Data:</span>
                                 <span>FEC: Active</span>
                              </div>
                              <div className="break-all opacity-70">
                                 01001101 01100001 01110010 01101011 00101101 01001000 01010111 
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                   
                   <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                         <span>Protection Strength</span>
                         <span className="text-blue-400">High (DWT+DCT)</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-[92%] h-full"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Solutions & Police Integration (B2G) */}
      <section id="police-solution" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 relative">
                {/* Forensic Dashboard Mockup */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl p-4 md:p-6 relative z-10">
                   <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                         <Siren className="text-blue-500" size={20} />
                         <span className="font-bold text-slate-200">Police Forensic Dashboard</span>
                      </div>
                      <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded font-medium border border-red-500/20">
                         CONFIDENTIAL
                      </span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                         <div className="text-xs text-slate-500 mb-2">분석 대상 이미지 ID: #REQ-2024-8992</div>
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center">
                               <Users size={20} className="text-slate-600"/>
                            </div>
                            <div className="flex-1">
                               <div className="h-2 bg-slate-800 rounded-full mb-1">
                                  <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">워터마크 복구 성공</span>
                                  <span className="text-green-500 font-bold">98.2% 일치</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">최초 유포자 ID</span>
                            <span className="text-sm text-blue-400 font-mono">user_772_ab</span>
                         </div>
                         <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-500 block mb-1">최초 업로드 시간</span>
                            <span className="text-sm text-slate-200 font-mono">24.12.04 14:22</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                      * 이 시스템은 경찰청 수사 자문위원이 검증한 Forensic-ready 아키텍처를 따릅니다.
                   </div>
                </div>
                
                {/* Decoration */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[60px] pointer-events-none"></div>
             </div>

             <div className="order-1 md:order-2">
                <span className="text-blue-400 font-bold text-sm uppercase mb-2 block">B2G Solution</span>
                <h2 className="text-3xl font-bold mb-6">수사 기관을 위한<br />확실한 추적 도구</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                   단순 예방을 넘어, 범죄 발생 시 신속하게 유포자를 추적할 수 있는 
                   <strong>Forensic Dashboard</strong>를 제공합니다. 
                   OnMark의 워터마킹은 법적 효력을 갖는 디지털 증거로 활용될 수 있도록 설계되었습니다.
                </p>
                <ul className="space-y-4">
                   <li className="flex gap-3">
                      <CheckCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                      <div>
                         <strong className="text-white block">이미지 무결성 검증</strong>
                         <span className="text-slate-500 text-sm">해당 이미지가 AI로 변조(Deepfake)되었는지 즉시 판별</span>
                      </div>
                   </li>
                   <li className="flex gap-3">
                      <CheckCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                      <div>
                         <strong className="text-white block">유포 경로 추적</strong>
                         <span className="text-slate-500 text-sm">최초 유포자 및 유포 경로 파악을 위한 메타데이터 복원</span>
                      </div>
                   </li>
                </ul>
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
               {/* B2C */}
               <div 
                  className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2c' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`}
                  onClick={() => setActiveTab('b2c')}
               >
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                     <Users size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">B2C (Personal)</h3>
                  <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded mb-4">FREE</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">
                     누구나 자신의 사진을 무료로 보호할 수 있습니다. SNS 업로드 전 OnMark 웹/앱을 통해 워터마크를 적용하세요.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 무제한 이미지 보호</li>
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 기본 추적 기능</li>
                  </ul>
               </div>

               {/* B2B */}
               <div 
                  className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2b' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`}
                  onClick={() => setActiveTab('b2b')}
               >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                     <Server size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">B2B (Enterprise)</h3>
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded mb-4">PAID (API)</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">
                     소셜 미디어, 데이팅 앱, 교육 기관 등 플랫폼을 위한 대량 처리 API를 제공합니다.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 고속 Batch Processing</li>
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 전용 관리 대시보드</li>
                  </ul>
               </div>

               {/* B2G */}
               <div 
                  className={`p-8 rounded-2xl border transition-all cursor-pointer ${activeTab === 'b2g' ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}`}
                  onClick={() => setActiveTab('b2g')}
               >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6">
                     <Database size={24} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">B2G (Public)</h3>
                  <div className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded mb-4">PARTNERSHIP</div>
                  <p className="text-slate-400 text-sm mb-6 h-20">
                     경찰청 및 수사 기관과 연계하여 딥페이크 유포자를 식별하고 증거를 확보하는 포렌식 솔루션입니다.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500">
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 수사 전용 복호화 키</li>
                     <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500"/> 법적 증거 효력 확보</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Feedback Form */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">여러분의 피드백이 더 안전한 세상을 만듭니다</h2>
        <p className="text-slate-400 mb-8">
          OnMark는 현재 오픈 베타 테스트 중입니다. <br/>
          사용 중 불편한 점이나 개선 아이디어를 자유롭게 남겨주세요.
        </p>

        <form onSubmit={handleFeedbackSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl text-left">
           <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">의견 보내기</label>
                <textarea
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder-slate-600"
                  placeholder="예: 인스타그램에 올렸을 때 화질 저하가 있는지 궁금합니다."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                   <label className="block text-sm font-medium text-slate-300 mb-2">이메일 (답변을 원하실 경우)</label>
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
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${feedbackSent ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                  {feedbackSent ? <CheckCircle size={20} /> : <Send size={20} />}
                  {feedbackSent ? '전송 완료' : '피드백 보내기'}
                </button>
              </div>
           </div>
        </form>
      </section>

      {/* Footer with Awards & Team */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="text-slate-600" size={32} />
              <div>
                <span className="text-xl font-bold text-slate-400 block">OnMark</span>
                <span className="text-xs text-slate-600">Deepfake-Resistant Identity Protection</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
               <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 flex items-center gap-2">
                  <Award size={14} className="text-yellow-500" />
                  제12회 SW융합 해커톤 대상 (과기부 장관상)
               </div>
               <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  중부발전(KOMIPO) 1,000만원 투자 유치
               </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <p>© 2024 OnMark Project. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">이용약관</a>
              <a href="#" className="hover:text-slate-400 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-slate-400 transition-colors">문의하기</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnMarkWeb;