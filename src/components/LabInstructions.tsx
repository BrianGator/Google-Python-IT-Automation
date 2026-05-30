import React from "react";
import { Lab, LabTask } from "../types";
import { BookOpen, CheckCircle, HelpCircle, Award, Terminal as TermIcon, FileText } from "lucide-react";

interface LabInstructionsProps {
  labs: Lab[];
  activeLabId: string;
  setActiveLabId: (id: string) => void;
  completedTasks: Record<string, boolean>;
  toggleTask: (labId: string, taskId: string) => void;
}

export default function LabInstructions({
  labs,
  activeLabId,
  setActiveLabId,
  completedTasks,
  toggleTask,
}: LabInstructionsProps) {
  const activeLab = labs.find((l) => l.id === activeLabId) || labs[0];

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 text-slate-800 overflow-hidden font-sans">
      {/* Header Tabs */}
      <div className="bg-white p-4 border-b border-slate-200 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="text-sky-500 w-4 h-4 animate-pulse" />
          <h2 className="text-xs font-black tracking-widest uppercase text-slate-500 font-mono">
            SELECT PROTOCOL TASK
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {labs.map((lab) => {
            const isSelected = lab.id === activeLabId;
            const completedCount = lab.tasks.filter((t) => completedTasks[`${lab.id}-${t.id}`]).length;
            const isDone = completedCount === lab.tasks.length;

            return (
              <button
                key={lab.id}
                id={`lab-tab-${lab.id}`}
                onClick={() => setActiveLabId(lab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-500 text-white font-black border border-sky-400 shadow shadow-sky-500/20 scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-transparent"
                }`}
              >
                <span className="text-[10px] font-black tracking-wider block uppercase">
                  LAB {lab.id === "lab1" ? "1" : lab.id === "lab2" ? "2" : lab.id === "lab3" ? "3" : "4"}
                </span>
                <span className="text-[9px] font-bold tracking-tight leading-tight line-clamp-1 uppercase">
                  {lab.id === "lab1" ? "Feedback API" : lab.id === "lab2" ? "Email & PDF" : lab.id === "lab3" ? "Fruit Store" : "Auto-Testing"}
                </span>
                {isDone ? (
                  <CheckCircle className="w-3 h-3 text-emerald-950 fill-emerald-400 mt-1" />
                ) : (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full mt-1 font-mono font-bold ${
                    isSelected ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {completedCount}/{lab.tasks.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Overview Block */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-start gap-3">
        <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200 text-sky-600 shrink-0 mt-0.5 shadow-sm">
          <Award className="w-5 h-5 font-bold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-950 tracking-tight leading-none uppercase">
              {activeLab.title}
            </h1>
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono shrink-0 border border-slate-200 ${
                activeLab.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : activeLab.difficulty === "Medium"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-rose-500/10 text-rose-600"
              }`}
            >
              {activeLab.difficulty}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed font-sans">
            {activeLab.shortDescription}
          </p>
          <div className="flex items-center gap-3 mt-2.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1">
              ⏱️ speed: <strong className="text-slate-700 font-black">{activeLab.timeMinutes} mins</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              user: <strong className="text-sky-600 font-black">student@example.com</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Instructions & Tasks Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Step-by-Step tasks checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
              PROTOCOL TASKS CHECKLIST
            </h2>
            <span className="text-[9px] font-black uppercase tracking-wider font-mono text-sky-600">
              GRADE CHECKPOINT
            </span>
          </div>

          <div className="space-y-2.5">
            {activeLab.tasks.map((task, idx) => {
              const taskKey = `${activeLab.id}-${task.id}`;
              const isChecked = !!completedTasks[taskKey];

              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(activeLab.id, task.id)}
                  id={`task-card-${task.id}`}
                  className={`group flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isChecked
                      ? "bg-emerald-50 text-slate-900 border-emerald-500/50 shadow-sm"
                      : "bg-white text-slate-900 border-slate-200 hover:border-sky-400 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <button
                    className={`mt-0.5 shrink-0 rounded border-2 transition-all flex items-center justify-center ${
                      isChecked
                        ? "w-4 h-4 bg-emerald-500 border-emerald-500 text-slate-950"
                        : "w-4 h-4 bg-transparent border-slate-400 hover:border-sky-500"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 font-bold"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-xs font-semibold leading-relaxed text-slate-800">
                      <span className="text-sky-600 font-mono mr-1.5 font-black">
                        Step {idx + 1}.
                      </span>
                      {task.text}
                    </p>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-700 font-sans leading-normal">
                      💡 {task.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Help Guide Card */}
        <div className="bg-white text-slate-800 p-4 rounded-xl border-2 border-slate-200 space-y-3.5 shadow-md">
          <div className="flex items-center gap-2 text-sky-650 text-sky-600">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider font-mono">
              Interactive Lab Guidelines
            </span>
          </div>
          <div className="text-slate-600 text-xs space-y-2 leading-relaxed">
            <p>
              This is a full sandboxed emulation of the actual Coursera python capstone project! You do not need to write python from scratch if you are learning; you can review the guide files, edit codes, or click the **"Autocomplete Solution"** button inside the editor tabs to check out correct python implementations.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 font-mono text-[10px] text-slate-700 space-y-1.5 border border-slate-200">
              <div className="flex items-start gap-1">
                <TermIcon className="w-3.5 h-3.5 mt-0.5 text-sky-600 shrink-0" />
                <span>
                  <strong>Run Script</strong>: Triggers simulated python terminal output compiling database arrays.
                </span>
              </div>
              <div className="flex items-start gap-1">
                <FileText className="w-3.5 h-3.5 mt-0.5 text-amber-600 shrink-0" />
                <span>
                  <strong>Database Visualizer</strong>: Directly watch Django and webmail servers react to POST requests!
                </span>
              </div>
            </div>
            <p className="border-t border-slate-200 pt-3 text-[11px] text-slate-550 italic">
              <strong>Grading Note</strong>: Successfully running scripts will trigger checklists automatically turning green representing passed graded checkpoints!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
