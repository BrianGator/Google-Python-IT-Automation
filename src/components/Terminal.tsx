import React, { useRef, useEffect } from "react";
import { TerminalLine } from "../types";
import { Terminal as TermIcon, Trash2, Server } from "lucide-react";

interface TerminalProps {
  lines: TerminalLine[];
  onClearLines: () => void;
  activeFilePath: string;
}

export default function Terminal({
  lines,
  onClearLines,
  activeFilePath,
}: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="flex flex-col h-full bg-slate-50 font-mono text-xs border-r border-slate-200 text-slate-700">
      {/* Terminal Title Bar */}
      <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 shrink-0 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block"></span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1 flex items-center gap-1 font-mono">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            STUDENT@LINUX:~
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
            ACTIVE: <strong className="text-sky-600 font-black">{activeFilePath.split("/").pop()}</strong>
          </span>
          <button
            onClick={onClearLines}
            title="Clean CLI Terminal logs"
            className="text-slate-400 hover:text-slate-700 transition-all p-1 hover:bg-slate-200 rounded cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Lines Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="text-slate-450 text-[10px] leading-relaxed border-b border-slate-200 pb-3 mb-3 select-none uppercase tracking-wider font-bold">
          📝 <strong className="text-slate-600">QWIKLABS TERMINAL EMULATOR</strong>
          <br />
          READY FOR SCRIPT EXECUTION check.
        </div>

        {lines.length === 0 ? (
          <div className="text-slate-400 italic select-none">
            No terminal output logs yet. Select a python script above and run it!
          </div>
        ) : (
          lines.map((line, idx) => {
            let textColor = "text-slate-700";
            if (line.type === "input") textColor = "text-sky-700 font-black";
            if (line.type === "stderr") textColor = "text-rose-600 font-semibold";
            if (line.type === "system") textColor = "text-emerald-800 border-l-4 border-emerald-500 pl-2 font-medium bg-emerald-50/50 py-0.5";

            const isCommand = line.text.startsWith("$");

            return (
              <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${textColor}`}>
                {line.type === "input" && !isCommand && <span className="text-slate-400 mr-1.5 font-bold">student:~$</span>}
                <span>{line.text}</span>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Static Footer shell bar */}
      <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 select-none shrink-0 font-mono">
        <div className="flex items-center gap-1.5">
          <TermIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="uppercase tracking-widest font-black">LINUX CONSOLE ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">ONLINE</span>
          </span>
        </div>
      </div>
    </div>
  );
}
