import React, { useState, useEffect } from "react";
import { EditorFile } from "../types";
import { 
  FileCode, 
  Play, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Layers, 
  FileJson,
  Check,
  Folder,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Terminal as TermIcon,
  HelpCircle,
  Filter
} from "lucide-react";

interface CodeEditorProps {
  files: EditorFile[];
  activeFilePath: string;
  setActiveFilePath: (path: string) => void;
  onSaveFile: (path: string, content: string) => Promise<void>;
  onExecuteScript: (path: string) => Promise<void>;
  onAutocomplete: (path: string) => void;
  isExecuting: boolean;
}

export default function CodeEditor({
  files,
  activeFilePath,
  setActiveFilePath,
  onSaveFile,
  onExecuteScript,
  onAutocomplete,
  isExecuting,
}: CodeEditorProps) {
  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];
  const [editorContent, setEditorContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pytest visualizer filter
  const [reportFilter, setReportFilter] = useState<"all" | "passed" | "failed">("all");
  const [expandedTestIdx, setExpandedTestIdx] = useState<number | null>(null);

  // Gemini AI Coach State
  const [coachInput, setCoachInput] = useState("");
  const [coachConversation, setCoachConversation] = useState<
    Array<{ sender: "user" | "ai"; text: string }>
  >([
    {
      sender: "ai",
      text: "👋 Hello! I'm your **Google IT Automation Lab Partner**.\n\nStuck on a script, need to review how to use `os.listdir()`, resize images with `PIL.Image`, format a `reportlab` table, or handle requests? Ask me, and I'll debug your draft or guide you on the lab solutions!",
    },
  ]);
  const [coachLoading, setCoachLoading] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
    }
  }, [activeFilePath, files]);

  const handleSave = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    await onSaveFile(activeFile.path, editorContent);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRun = async () => {
    if (!activeFile) return;
    // Auto save first
    await onSaveFile(activeFile.path, editorContent);
    await onExecuteScript(activeFile.path);
  };

  const askCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim() || coachLoading) return;

    const userMessage = coachInput;
    setCoachConversation((prev) => [...prev, { sender: "user", text: userMessage }]);
    setCoachInput("");
    setCoachLoading(true);

    try {
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
          currentFile: activeFile?.name,
          code: editorContent,
        }),
      });

      const data = await response.json();
      setCoachConversation((prev) => [
        ...prev,
        { sender: "ai", text: data.text || "Sorry, I spent too long thinking, please retry!" },
      ]);
    } catch (err: any) {
      setCoachConversation((prev) => [
        ...prev,
        { sender: "ai", text: `⚠️ Error contacting API: ${err.message}` },
      ]);
    } finally {
      setCoachLoading(false);
    }
  };

  // Organize files for Directory Explorer Sidebar
  const folders: Record<string, EditorFile[]> = {};
  const rootFiles: EditorFile[] = [];

  files.forEach((f) => {
    if (f.path.includes("/")) {
      const parts = f.path.split("/");
      const folderName = parts[0];
      if (!folders[folderName]) {
        folders[folderName] = [];
      }
      folders[folderName].push(f);
    } else {
      rootFiles.push(f);
    }
  });

  const isHtmlReport = activeFile?.path === "test-results/report.html";

  // Detailed 20 tests E2E suite outcomes mimicking conftest.py makereport hook output
  const testSuiteResults = [
    { id: 1, name: "tests/test_github.py::test_01_successful_login", status: "passed", duration: "0.18s", desc: "Verifies user login with valid environmental secrets.", error: null },
    { id: 2, name: "tests/test_github.py::test_02_failed_login", status: "failed", duration: "5.06s", desc: "Forces wrong validation credentials and expect errors.", error: "expect(error_message).to_be_visible() timed out after 5000ms\n\n>       expect(error_message).to_be_visible()\nE       TimeoutError: Page.expect_selector: Timeout 5000ms exceeded.\nE       ==================== Logs ====================\nE       waiting for locator(\".flash-error\")\nE         locator resolved to hidden <div class=\"flash\">Incorrect username or password.</div>\nE       ==============================================\n\ntests/test_github.py:44: TimeoutError" },
    { id: 3, name: "tests/test_github.py::test_03_password_reset_flow", status: "passed", duration: "0.11s", desc: "Validates reset pass form interactions and recovery triggers.", error: null },
    { id: 4, name: "tests/test_github.py::test_04_profile_bio_update", status: "passed", duration: "0.15s", desc: "Saves new descriptive profile bio details correctly.", error: null },
    { id: 5, name: "tests/test_github.py::test_05_repository_search", status: "passed", duration: "0.12s", desc: "Searches public GitHub projects database with filter tags.", error: null },
    { id: 6, name: "tests/test_github.py::test_06_add_repo_to_stars", status: "passed", duration: "0.13s", desc: "Stars sandbox target repositories dynamically.", error: null },
    { id: 7, name: "tests/test_github.py::test_07_remove_repo_from_stars", status: "passed", duration: "0.14s", desc: "Unstars sandboxed repository and verifies state status colors.", error: null },
    { id: 8, name: "tests/test_github.py::test_08_repository_creation_simulation", status: "passed", duration: "0.15s", desc: "Creates mock sandbox repos for automation verification.", error: null },
    { id: 9, name: "tests/test_github.py::test_09_infinite_scroll_explore", status: "passed", duration: "2.11s", desc: "Drives page scrolling and ensures more feed loads sequentially.", error: null },
    { id: 10, name: "tests/test_github.py::test_10_repository_issues_form_validation", status: "failed", duration: "0.12s", desc: "Validates form missing attributes errors checks.", error: "AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.\n\n>       assert \"Title cannot be blank\" in error_message\nE       AssertionError: Expected validation error 'Title cannot be blank' but instead received 'Field is required'.\nE       assert 'Title cannot be blank' in 'Field is required'\n\ntests/test_github.py:126: AssertionError" },
    { id: 11, name: "tests/test_github.py::test_11_profile_avatar_upload", status: "passed", duration: "0.22s", desc: "Uploads profile avatar image file and inspects HTML file choose classes.", error: null },
    { id: 12, name: "tests/test_github.py::test_12_delete_repository_modal", status: "passed", duration: "0.16s", desc: "Interacts with dangerous modals confirmation prompts.", error: null },
    { id: 13, name: "tests/test_github.py::test_13_multi_tab_navigation", status: "passed", duration: "0.31s", desc: "Verifies browser multi tab navigation hooks.", error: null },
    { id: 14, name: "tests/test_github.py::test_14_api_network_mocking", status: "passed", duration: "0.18s", desc: "Fulfills mock JSON payload response interceptors.", error: null },
    { id: 15, name: "tests/test_github.py::test_15_release_asset_download_verification", status: "passed", duration: "0.44s", desc: "Spins file downloads and checks output archives suffix content.", error: null },
    { id: 16, name: "tests/test_github.py::test_16_appearance_settings_toggle", status: "passed", duration: "0.15s", desc: "Switches dark dimmed skin headers dynamically.", error: null },
    { id: 17, name: "tests/test_github.py::test_17_commit_pagination", status: "passed", duration: "0.33s", desc: "Paginates older commit records via Older hyperlinks.", error: null },
    { id: 18, name: "tests/test_github.py::test_18_pull_request_sorting", status: "passed", duration: "0.19s", desc: "Sorts pull requests list and tests URL format variables.", error: null },
    { id: 19, name: "tests/test_github.py::test_19_file_tree_filtering", status: "passed", duration: "0.21s", desc: "Filters repository file tree nodes dynamically.", error: null },
    { id: 20, name: "tests/test_github.py::test_20_session_state_persistence", status: "passed", duration: "0.17s", desc: "Loads cookies into state contexts and tests user dashboards.", error: null }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-slate-50 border-r border-slate-200 text-slate-800 overflow-hidden font-sans">
      
      {/* 1. Left Side: Interactive Lab File System Tree */}
      <div className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto">
        <div className="p-3.5 border-b border-slate-200 bg-white">
          <span className="text-[9px] font-mono font-black text-slate-400 tracking-widest uppercase block">Workspace Explorer</span>
          <span className="text-xs font-black text-slate-800 tracking-tight block mt-0.5 uppercase">📁 QWIKLABS_OS_WORKSPACE</span>
        </div>
        <div className="p-2 space-y-2">
          {Object.entries(folders).map(([folderName, folderFiles]) => (
            <div key={folderName} className="space-y-0.5">
              <div id={`folder-${folderName}`} className="flex items-center gap-1.5 px-2 py-1 text-xs font-black text-slate-500 uppercase tracking-wide">
                <Folder className="w-4 h-4 text-sky-500 fill-sky-100 shrink-0" />
                <span>{folderName}</span>
              </div>
              <div className="pl-3.5 space-y-0.5 border-l border-slate-200/60 ml-3.5">
                {folderFiles.map((file) => {
                  const isSelected = file.path === activeFilePath;
                  const isPy = file.language === "python";
                  const isHtml = file.path.endsWith(".html");
                  const isJson = file.path.endsWith(".json");
                  return (
                    <button
                      key={file.path}
                      id={`file-tree-${file.name.replace(/\./g, "-")}`}
                      onClick={() => setActiveFilePath(file.path)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-sky-500 text-white font-black shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-205 hover:bg-slate-205 hover:bg-slate-200/50"
                      }`}
                    >
                      {isHtml ? (
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-rose-500"}`} />
                      ) : isPy ? (
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-amber-500"}`} />
                      ) : isJson ? (
                        <FileJson className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-emerald-500"}`} />
                      ) : (
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-sky-500"}`} />
                      )}
                      <span className="truncate">{file.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Root Level Files */}
          {rootFiles.length > 0 && (
            <div className="space-y-0.5 border-t border-slate-200/60 pt-2 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black text-slate-500 uppercase tracking-wide">
                <span>📁 ROOT_SCRIPTS</span>
              </div>
              {rootFiles.map((file) => {
                const isSelected = file.path === activeFilePath;
                const isPy = file.language === "python";
                return (
                  <button
                    key={file.path}
                    id={`file-tree-root-${file.name.replace(/\./g, "-")}`}
                    onClick={() => setActiveFilePath(file.path)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-sky-500 text-white font-black shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                  >
                    {isPy ? (
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-amber-500"}`} />
                    ) : (
                      <FileJson className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-slate-500"}`} />
                    )}
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Middle Editor Screen */}
      <div className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
        
        {/* Tab Headers */}
        <div className="bg-slate-100 border-b border-slate-200 flex items-center justify-between px-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 select-none">
          <div className="flex items-center gap-1.5 pt-0.5">
            {files.map((f) => {
              const isSelected = f.path === activeFilePath;
              const isPy = f.language === "python";
              return (
                <button
                  key={f.path}
                  onClick={() => setActiveFilePath(f.path)}
                  id={`file-tab-${f.name}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-sky-600 border border-b-0 border-slate-200 font-bold shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {isPy ? (
                    <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <FileJson className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  )}
                  <span>{f.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Populate / Complete Code */}
            <button
              onClick={() => {
                onAutocomplete(activeFile.path);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 1500);
              }}
              title="Autocomplete python skeleton for Google grader"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 px-3 py-1.5 rounded text-[10px] transition-all font-mono font-black tracking-widest uppercase shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Autocomplete Solution</span>
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              PATH: <strong className="text-slate-700 font-black">~/ {activeFile?.path}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1.5 font-mono text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded transition-all cursor-pointer ${
                saveSuccess 
                  ? "bg-emerald-500 text-white border border-emerald-505 border-emerald-500 text-white"
                  : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold"
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span>Save</span>
                </>
              )}
            </button>

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isExecuting}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-450 active:bg-sky-600 text-slate-950 font-mono text-[10px] uppercase font-black tracking-wider px-3.5 py-1.5 rounded-md border border-sky-400 shadow cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current shrink-0 text-slate-950" />
                  <span>Run Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* High-fidelity coding textarea wrapper or dynamic report viewer */}
        <div className="flex-1 relative flex overflow-hidden min-h-[305px]">
          {isHtmlReport ? (
            /* INTERACTIVE CUSTOM DASHBOARD TEST REPORT */
            <div id="pytest-html-interactive-dashboard" className="flex-1 overflow-y-auto p-6 bg-slate-50 select-none space-y-6">
              
              {/* Header stats bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">HTML Pytest Automation Runner Report</h2>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    SUITE STATUS: <span className="text-rose-600 font-black">2 FAILURES IDENTIFIED</span> • COMPILED IN conftest.py HOOK
                  </p>
                </div>
                {/* Stats figures */}
                <div className="flex items-center gap-6">
                  <div className="text-center px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-[10px] font-mono font-black text-slate-400 block tracking-widest uppercase">Passed</span>
                    <span className="text-xl font-black text-emerald-600">18 passed</span>
                  </div>
                  <div className="text-center px-4 py-1.5 bg-rose-50 border border-rose-200 rounded-lg animate-pulse">
                    <span className="text-[10px] font-mono font-black text-slate-400 block tracking-widest uppercase">Failed</span>
                    <span className="text-xl font-black text-rose-600">2 failed</span>
                  </div>
                  <div className="text-center px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
                    <span className="text-[10px] font-mono font-black text-slate-400 block tracking-widest uppercase">Timing</span>
                    <span className="text-sm font-bold text-slate-700 font-mono mt-1 block">11.53s</span>
                  </div>
                </div>
              </div>

              {/* Filters list tab bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Filter Test Cases:</span>
                </div>
                <div className="flex gap-1.5 bg-slate-200/50 p-1 rounded-lg">
                  <button
                    onClick={() => setReportFilter("all")}
                    className={`px-3 py-1 rounded text-xs tracking-wider uppercase font-extrabold transition-all cursor-pointer ${
                      reportFilter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All (20)
                  </button>
                  <button
                    onClick={() => setReportFilter("passed")}
                    className={`px-3 py-1 rounded text-xs tracking-wider uppercase font-extrabold transition-all cursor-pointer ${
                      reportFilter === "passed" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Passed (18)
                  </button>
                  <button
                    onClick={() => setReportFilter("failed")}
                    className={`px-3 py-1 rounded text-xs tracking-wider uppercase font-extrabold transition-all cursor-pointer ${
                      reportFilter === "failed" ? "bg-white text-slate-805 text-rose-600 shadow-sm font-black" : "text-slate-500 hover:text-rose-600"
                    }`}
                  >
                    Failed (2)
                  </button>
                </div>
              </div>

              {/* Interactive test outcomes table */}
              <div className="space-y-3">
                {testSuiteResults
                  .filter((t) => {
                    if (reportFilter === "passed") return t.status === "passed";
                    if (reportFilter === "failed") return t.status === "failed";
                    return true;
                  })
                  .map((t) => {
                    const isOpen = expandedTestIdx === t.id;
                    const isPassed = t.status === "passed";
                    return (
                      <div
                        key={t.id}
                        onClick={() => setExpandedTestIdx(isOpen ? null : t.id)}
                        className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-150 cursor-pointer ${
                          isPassed 
                            ? "hover:border-emerald-300 border-slate-200"
                            : "border-rose-300 ring-1 ring-rose-300/30 hover:border-rose-400"
                        }`}
                      >
                        <div className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {isPassed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            )}
                            <div>
                              <h3 className="text-xs font-mono font-black text-slate-800 truncate block md:max-w-2xl">{t.name}</h3>
                              <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-mono">{t.duration}</span>
                            {isPassed ? (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">PASSED</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 animate-pulse">FAILED</span>
                            )}
                            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                          </div>
                        </div>

                        {/* Collapsed Failures stacked frame */}
                        {isOpen && (
                          <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50 space-y-3">
                            <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest font-mono">
                              <span>Trace exception details:</span>
                              <span className="text-[10px] text-rose-600 font-black">FAILING EXCEPTION REASON</span>
                            </div>
                            {t.error ? (
                              <pre className="bg-rose-950 text-rose-250 text-rose-200 p-4 font-mono text-[11px] rounded-lg border border-rose-900 leading-relaxed overflow-x-auto whitespace-pre">
                                <code>{t.error}</code>
                              </pre>
                            ) : (
                              <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 border-emerald-100 rounded-lg p-4 font-sans text-xs">
                                ✓ Tested successfully under browser sandbox context. Network endpoints intercepted and mock asset download hashes verified manually.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            /* CODE TEXTAREA EDITOR */
            <>
              {/* Mock gutter numbers */}
              <div className="bg-slate-50 font-mono text-right text-[11px] text-slate-450 pr-3 pl-4 pt-4 border-r border-slate-200 select-none leading-relaxed flex flex-col sticky top-0 h-full">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span key={i} className="block block-line-idx select-none">
                    {i + 1}
                  </span>
                ))}
              </div>

              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                id="python-code-editor-box"
                className="flex-1 font-mono text-[11.5px] p-4 leading-relaxed bg-white outline-none resize-none overflow-y-auto text-slate-800 selection:bg-sky-100 selection:text-slate-900"
                style={{ tabSize: 4 }}
                placeholder="# Write your Python automation scripts here..."
              />
            </>
          )}
        </div>
      </div>

      {/* 3. Right Column: AI Qwiklabs Assistant Panel */}
      <div className="w-full lg:w-[350px] flex flex-col h-[350px] lg:h-full bg-slate-50 border-l border-slate-200 overflow-hidden shrink-0">
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
            <h3 className="text-[10px] font-black font-mono tracking-widest text-slate-500 uppercase">
              AI ASSISTANT COACH
            </h3>
          </div>
          <span className="text-[9px] bg-sky-500/10 border border-sky-500/30 text-sky-600 px-2 py-0.5 rounded font-mono font-black uppercase tracking-wider">
            GEMINI API
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 text-xs bg-slate-50 border-l border-slate-205">
          {coachConversation.map((msg, idx) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={idx}
                className={`flex gap-2.5 items-start ${
                  isAI ? "justify-start" : "justify-end"
                }`}
              >
                {isAI && (
                  <div className="bg-sky-100 p-1.5 rounded-md border border-sky-200 text-sky-600 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2.5 leading-relaxed overflow-hidden ${
                    isAI
                      ? "bg-white text-slate-800 whitespace-pre-wrap flex flex-col gap-1 text-[11.5px] border border-slate-200 shadow-sm"
                      : "bg-sky-600 font-semibold text-white shadow-sm self-end"
                  }`}
                >
                  {/* Basic markdown parsing support helper */}
                  {msg.text.split("\n\n").map((para, pIdx) => {
                    const isCode = para.trim().startsWith("```");
                    if (isCode) {
                      const cleanCode = para.replace(/```python|```/g, "").trim();
                      return (
                        <pre key={pIdx} className="bg-slate-950 text-[10px] text-amber-400 p-2.5 rounded border border-slate-900 font-mono overflow-x-auto whitespace-pre my-1">
                          <code>{cleanCode}</code>
                        </pre>
                      );
                    }
                    
                    // Bold highlighting formatting
                    let renderedText: React.ReactNode = para;
                    if (para.includes("**")) {
                      const parts = para.split("**");
                      renderedText = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-sky-700 font-black">{part}</strong> : part);
                    }

                    return (
                      <p key={pIdx} className="leading-relaxed">
                        {renderedText}
                      </p>
                    );
                  })}
                </div>
                {!isAI && (
                  <div className="bg-slate-200 p-1.5 rounded-md border border-slate-300 text-slate-600 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {coachLoading && (
            <div className="flex gap-2.5 items-start justify-start">
              <div className="bg-sky-100 p-1.5 rounded-md border border-sky-200 text-sky-600 shrink-0 animate-pulse mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-600 flex items-center gap-2 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600 shrink-0" />
                <span className="font-mono text-[10px] text-slate-500 font-bold">Analyzing script drafts...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={askCoach}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 border-l border-slate-200"
        >
          <input
            type="text"
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
            placeholder="Ask Qwiklabs Coach... (e.g. 'how to parse file?')"
            className="flex-1 bg-slate-50 text-xs border border-slate-200 hover:border-slate-300 focus:border-sky-500 rounded-md py-2 px-3 text-slate-800 outline-none placeholder:text-slate-400 font-sans shadow-inner"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 transition-all text-white p-2 rounded-md cursor-pointer shrink-0 disabled:opacity-40"
            disabled={!coachInput.trim() || coachLoading}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
