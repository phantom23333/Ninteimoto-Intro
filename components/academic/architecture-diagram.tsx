import React from 'react';

export function ArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <svg viewBox="0 0 1000 500" className="w-full min-w-[1000px] h-auto font-sans bg-white rounded-xl border border-slate-100 shadow-sm" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
          
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* --- Top Layer: Output Tokens --- */}
        <g transform="translate(0, 0)">
           {/* Text Tokens Output */}
           {['S','1','2','3','4','B'].map((t, i) => (
             <g key={`t-out-${i}`} transform={`translate(${180 + i * 40}, 70)`}>
               <circle r="12" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
               <text y="4" textAnchor="middle" className="text-[10px] font-mono font-bold fill-yellow-700">{t}</text>
               {/* Arrow from Model Top (y=150) to Token Bottom (y=82) */}
               <path d="M0 80 L0 15" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
             </g>
           ))}
           {/* Acoustic Tokens Output */}
           {['1','2','3','4','5','T'].map((t, i) => (
             <g key={`a-out-${i}`} transform={`translate(${420 + i * 40}, 70)`}>
               <circle r="12" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
               <text y="4" textAnchor="middle" className="text-[10px] font-mono font-bold fill-blue-700">{t}</text>
               {/* Arrow from Model Top (y=150) to Token Bottom (y=82) */}
               <path d="M0 80 L0 15" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
             </g>
           ))}
        </g>

        {/* --- Middle Layer: Models --- */}

        {/* TTS Language Model */}
        <rect x="50" y="150" width="600" height="80" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" filter="url(#shadow)" />
        <text x="350" y="195" textAnchor="middle" className="text-2xl font-black fill-slate-800 tracking-tight">TTS Language Model</text>

        {/* Latent Connection */}
        <path d="M650 190 L685 190" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="4 2" />
        <text x="670" y="180" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono font-bold">Latent</text>

        {/* BigVGAN2 Decoder */}
        <rect x="690" y="150" width="200" height="80" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" filter="url(#shadow)" />
        <text x="790" y="195" textAnchor="middle" className="text-xl font-black fill-slate-800 tracking-tight">BigVGAN2 Decoder</text>

        {/* Output Waveform */}
        <g transform="translate(790, 60)">
           <path d="M-40 0 C-30 -20, -20 20, -10 -30 C0 30, 10 -15, 20 10 C30 -5, 40 0, 40 0" stroke="#2563eb" strokeWidth="3" fill="none" />
           {/* Arrow from Decoder Top (y=150) to Waveform Bottom (y=70) */}
           <path d="M0 90 L0 15" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
        </g>


        {/* --- Input Processing Layer (Inputs to LM) --- */}

        {/* Perceiver Section */}
        <g transform="translate(100, 260)">
           {/* Vectors */}
           <g transform="translate(0, 0)">
             <rect x="-10" y="0" width="20" height="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
             <path d="M0 0 L0 -25" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
           </g>
           <g transform="translate(40, 0)">
             <rect x="-10" y="0" width="20" height="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
             <path d="M0 0 L0 -25" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
           </g>
           <text x="20" y="20" textAnchor="middle" className="text-xs font-bold fill-green-700">...</text>
           
           {/* Perceiver Box */}
           <rect x="-30" y="60" width="100" height="60" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" filter="url(#shadow)" />
           <text x="20" y="85" textAnchor="middle" className="text-sm font-bold fill-slate-800">Perceiver</text>
           <text x="20" y="105" textAnchor="middle" className="text-sm font-bold fill-slate-800">Conditioner</text>
           
           {/* Arrows from Perceiver to Vectors */}
           <path d="M0 60 L0 35" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
           <path d="M40 60 L40 35" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        </g>

        {/* Text Tokenizer Section */}
        <g transform="translate(280, 260)">
           {/* Input Text Tokens */}
           {['S','1','2','3','4'].map((t, i) => (
             <g key={`t-in-${i}`} transform={`translate(${-60 + i * 30}, 15)`}>
                <text x="0" y="0" textAnchor="middle" className="text-[10px] font-mono fill-slate-500 font-bold">{t}</text>
                {/* Arrow from Token to Model Bottom (y=230) */}
                <path d="M0 -15 L0 -40" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Arrow from Tokenizer Top (y=320) to Token (y=275) */}
                <path d="M0 45 L0 10" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
             </g>
           ))}

           {/* Tokenizer Box */}
           <rect x="-80" y="60" width="160" height="60" rx="8" fill="#fefce8" stroke="#eab308" strokeWidth="2" filter="url(#shadow)" />
           <text x="0" y="85" textAnchor="middle" className="text-sm font-bold fill-slate-800">Text Tokenizer</text>
           <text x="0" y="105" textAnchor="middle" className="text-[10px] font-black fill-blue-600 tracking-wide">+ LANG EMB</text>
        </g>

        {/* Audio Codec Section */}
        <g transform="translate(500, 260)">
           {/* Input Acoustic Tokens */}
           {['B','1','2','3','4','5'].map((t, i) => (
             <g key={`a-in-${i}`} transform={`translate(${-75 + i * 30}, 15)`}>
                <text x="0" y="0" textAnchor="middle" className="text-[10px] font-mono fill-slate-500 font-bold">{t}</text>
                {/* Arrow from Token to Model Bottom (y=230) */}
                <path d="M0 -15 L0 -40" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Arrow from Codec Top (y=320) to Token (y=275) */}
                <path d="M0 45 L0 10" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
             </g>
           ))}

           {/* Codec Box */}
           <rect x="-90" y="60" width="180" height="60" rx="8" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" filter="url(#shadow)" />
           <text x="0" y="95" textAnchor="middle" className="text-sm font-bold fill-slate-800">Audio Codec</text>
        </g>

        {/* Speaker Encoder Section */}
        <g transform="translate(790, 260)">
           {/* Speaker Vector */}
           <rect x="-6" y="-10" width="12" height="30" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" rx="2" />
           {/* Arrow from Vector Top to Decoder Bottom (y=230) */}
           <path d="M0 -10 L0 -25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead-red)" />

           {/* Encoder Box */}
           <rect x="-75" y="60" width="150" height="60" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" filter="url(#shadow)" />
           <text x="0" y="95" textAnchor="middle" className="text-sm font-bold fill-slate-800">Speaker Encoder</text>
           
           {/* Arrow from Encoder Top to Vector Bottom */}
           <path d="M0 60 L0 25" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead-red)" />
        </g>


        {/* --- Far Bottom Layer: Raw Inputs --- */}

        {/* Prompt Speech (Left) */}
        <g transform="translate(120, 420)">
           <path d="M-40 0 L-35 5 L-30 -5 L-25 8 L-20 -8 L-15 12 L-10 -12 L-5 15 L0 -15 L5 12 L10 -8 L15 8 L20 -5 L25 5 L30 -3 L35 3 L40 0" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
           <text x="0" y="25" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase">Prompt Speech</text>
           <path d="M0 -10 L0 -35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
        </g>

        {/* Text Input */}
        <g transform="translate(280, 420)">
           <rect x="-30" y="-5" width="60" height="10" rx="4" fill="#e2e8f0" />
           <text x="0" y="25" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase">Text Input</text>
           <path d="M0 -10 L0 -35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
        </g>

        {/* GT Speech */}
        <g transform="translate(500, 420)">
           <path d="M-40 0 L-30 10 L-20 -10 L-10 15 L0 -15 L10 15 L20 -10 L30 10 L40 0" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
           <text x="0" y="25" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase">GT Speech</text>
           <path d="M0 -15 L0 -35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
        </g>

        {/* Prompt Speech (Right) */}
        <g transform="translate(790, 420)">
           <path d="M-40 0 L-35 5 L-30 -5 L-25 8 L-20 -8 L-15 12 L-10 -12 L-5 15 L0 -15 L5 12 L10 -8 L15 8 L20 -5 L25 5 L30 -3 L35 3 L40 0" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
           <text x="0" y="25" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase">Prompt Speech</text>
           <path d="M0 -10 L0 -35" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
        </g>


        {/* --- Legend (Far Right) --- */}
        <g transform="translate(910, 150)">
           <rect x="0" y="0" width="85" height="220" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="url(#shadow)" />
           
           <g transform="translate(10, 25)">
             <rect width="8" height="12" fill="#dcfce7" stroke="#22c55e" />
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">CONDITION</text>
           </g>
           
           <g transform="translate(10, 55)">
             <rect width="8" height="12" fill="#fee2e2" stroke="#ef4444" />
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">SPEAKER</text>
           </g>

           <g transform="translate(10, 85)">
             <circle r="5" cx="4" cy="6" fill="#fef08a" stroke="#eab308" />
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">TEXT</text>
           </g>

           <g transform="translate(10, 115)">
             <circle r="5" cx="4" cy="6" fill="#dbeafe" stroke="#3b82f6" />
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">ACOUSTIC</text>
           </g>

           <g transform="translate(10, 145)">
             <text x="4" y="10" textAnchor="middle" className="text-[8px] font-bold fill-slate-600 font-mono">S</text>
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">START TXT</text>
           </g>

           <g transform="translate(10, 175)">
             <text x="4" y="10" textAnchor="middle" className="text-[8px] font-bold fill-slate-600 font-mono">B</text>
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">START SPE</text>
           </g>

           <g transform="translate(10, 205)">
             <text x="4" y="10" textAnchor="middle" className="text-[8px] font-bold fill-slate-600 font-mono">T</text>
             <text x="15" y="10" className="text-[8px] font-bold fill-slate-600">END SPE</text>
           </g>
        </g>

        {/* Figure Caption */}
        <text x="500" y="480" textAnchor="middle" className="text-xs font-bold fill-slate-500 tracking-widest uppercase">
          Figure 1: TTS Language Model Architecture with Token-Level Language Embedding Fusion
        </text>

      </svg>
    </div>
  );
}
