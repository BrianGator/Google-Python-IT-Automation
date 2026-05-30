import React, { useState } from "react";
import { FeedbackItem, FruitItem, SystemMetrics } from "../types";
import { 
  Globe, 
  Image as ImageIcon, 
  RefreshCw,
  Sliders
} from "lucide-react";

interface SimulatedSitesProps {
  feedbacks: FeedbackItem[];
  fruits: FruitItem[];
  uploadedFiles: string[];
  metrics: SystemMetrics;
  onPostFeedback: (title: string, name: string, date: string, feedback: string) => Promise<any>;
  onPostFruit: (name: string, weight: number, description: string, image_name: string) => Promise<any>;
  onUpdateMetrics: (m: Partial<SystemMetrics>) => Promise<void>;
  onResetDatabase: () => Promise<void>;
}

export default function SimulatedSites({
  feedbacks,
  fruits,
  uploadedFiles,
  metrics,
  onPostFeedback,
  onPostFruit,
  onUpdateMetrics,
  onResetDatabase,
}: SimulatedSitesProps) {
  const [activeSiteTab, setActiveSiteTab] = useState<"corpweb" | "rest-api" | "fruitstore" | "media" | "health">("corpweb");

  // REST API simulated input state
  const [rawJsonContent, setRawJsonContent] = useState(
    '{"title": "Experienced salespeople", "name": "Alex H.", "date": "2020-02-02", "feedback": "It was great to talk to the salespeople in the team, they understood my needs and were able to guide me in the right direction"}'
  );
  const [feedbackResponse, setFeedbackResponse] = useState<string | null>(null);

  // Manual interactive metrics trigger sliders
  const handleMetricChange = async (key: keyof SystemMetrics, val: any) => {
    await onUpdateMetrics({ [key]: val });
  };

  const handlePostJson = async () => {
    try {
      const parsed = JSON.parse(rawJsonContent);
      if (parsed.title && parsed.name && parsed.date && parsed.feedback) {
        const res = await onPostFeedback(parsed.title, parsed.name, parsed.date, parsed.feedback);
        setFeedbackResponse(`Success (201 Created):\n${JSON.stringify(res, null, 2)}`);
      } else if (parsed.name && parsed.weight && parsed.description) {
        const res = await onPostFruit(parsed.name, Number(parsed.weight), parsed.description, parsed.image_name || "icon.sheet.png");
        setFeedbackResponse(`Success (201 Created):\n${JSON.stringify(res, null, 2)}`);
      } else {
        setFeedbackResponse("Error (400 Bad Request):\nRequired fields mismatch.");
      }
    } catch (err: any) {
      setFeedbackResponse(`Error (Json Syntax Validation):\n${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200 text-slate-800 overflow-hidden font-sans">
      
      {/* simulated Browser Navbar */}
      <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
        
        {/* simulated Address Bar */}
        <div className="flex-1 max-w-lg bg-white border border-slate-200 hover:border-slate-300 rounded px-3 py-1.5 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 select-all truncate uppercase tracking-wider">
            {activeSiteTab === "corpweb" && "http://corpweb_django_v1.local/"}
            {activeSiteTab === "rest-api" && "http://corpweb.local/feedback/"}
            {activeSiteTab === "fruitstore" && "http://fruitstore.local/"}
            {activeSiteTab === "media" && "http://fruitstore.local/media/images/"}
            {activeSiteTab === "health" && "http://qwiklabs.local/health_check_monitor/"}
          </span>
        </div>

        <div className="text-[8.5px] font-mono font-black text-slate-400 uppercase tracking-widest shrink-0 ml-4 hidden lg:block border border-slate-200 px-2 py-1 bg-white rounded">
          Written by Brian McCarthy
        </div>

        <div className="flex items-center gap-1.5 ml-3">
          <button
            onClick={onResetDatabase}
            title="Wipe sandbox tables and start fresh"
            className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-mono font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all rounded shadow-sm"
          >
            <RefreshCw className="w-3 h-3 text-sky-500 shrink-0 inline mr-1" />
            <span>RESET DATABASE</span>
          </button>
        </div>
      </div>

      {/* View Selectors Sidebar / Top Row tabs */}
      <div className="bg-slate-100 border-b border-slate-200 flex overflow-x-auto whitespace-nowrap scrollbar-none shrink-0 border-t border-slate-100 p-1 gap-1">
        <button
          onClick={() => setActiveSiteTab("corpweb")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all rounded-md cursor-pointer ${
            activeSiteTab === "corpweb"
              ? "bg-white text-sky-600 font-black shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🚗 Django Corpweb
        </button>

        <button
          onClick={() => setActiveSiteTab("rest-api")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all rounded-md cursor-pointer ${
            activeSiteTab === "rest-api"
              ? "bg-white text-sky-600 font-black shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🔌 REST Portal
        </button>

        <button
          onClick={() => setActiveSiteTab("fruitstore")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all rounded-md cursor-pointer ${
            activeSiteTab === "fruitstore"
              ? "bg-white text-sky-600 font-black shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🍎 Fruit Store
        </button>

        <button
          onClick={() => setActiveSiteTab("media")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all rounded-md cursor-pointer ${
            activeSiteTab === "media"
              ? "bg-white text-sky-600 font-black shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📂 inventory media
        </button>

        <button
          onClick={() => setActiveSiteTab("health")}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all rounded-md cursor-pointer ${
            activeSiteTab === "health"
              ? "bg-white text-sky-600 font-black shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🎛️ Diagnostics Dials
        </button>
      </div>

      {/* Browser Client Page Viewport viewport canvas */}
      <div className="flex-1 overflow-y-auto bg-white">
        
        {/* VIEW 1: Django Corpweb Car customer reviews page */}
        {activeSiteTab === "corpweb" && (
          <div className="p-6 space-y-6">
            <header className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                  🚗 corpweb
                </h1>
                <p className="text-xs text-slate-500">
                  Second hand automobiles quality reviews, consumer insights, & testimonials catalog
                </p>
              </div>
            </header>

            <div className="space-y-4">
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                Customer Feedback Stream
              </h2>

              <div className="grid grid-cols-1 gap-3.5">
                {feedbacks.map((item) => (
                  <div
                    key={item.id}
                    id={`feedback-card-${item.id}`}
                    className="bg-white border text-slate-900 border-slate-200 p-4 rounded-xl space-y-2.5 transition-all hover:border-sky-300 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-black text-sky-800">
                        "{item.title}"
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {item.feedback}
                    </p>

                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Submitted by: <strong className="text-slate-900 font-bold font-sans">{item.name}</strong></span>
                      <span className="text-[10px] font-mono text-emerald-600 font-black uppercase leading-none">
                        ● Published
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Django REST framework GUI browser */}
        {activeSiteTab === "rest-api" && (
          <div className="p-6 space-y-6">
            <header className="border-b border-slate-200 pb-4">
              <h1 className="text-lg font-extrabold text-slate-900">
                Django REST framework
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Api Endpoint: POST/GET /feedback
              </p>
            </header>

            {/* Simulated POST Field panel exactly as described in lab */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between select-none">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-500 uppercase">
                  Content POST request payload body (JSON text)
                </span>
                <span className="text-[9px] bg-sky-50 border border-sky-200 text-sky-600 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest font-bold">
                  Raw Data
                </span>
              </div>

              <div className="p-4 space-y-4">
                <textarea
                  value={rawJsonContent}
                  onChange={(e) => setRawJsonContent(e.target.value)}
                  className="w-full h-36 bg-slate-900 text-emerald-400 p-3 font-mono text-[11.5px] outline-none rounded-lg border border-slate-200 focus:border-sky-500 leading-relaxed"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handlePostJson}
                    id="django-post-json-btn"
                    className="bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all active:scale-95"
                  >
                    POST Request
                  </button>
                  <button
                    onClick={() => {
                      setRawJsonContent(
                        '{"name": "Watermelon", "weight": 500, "description": "Watermelon is good for relieving heat, eliminating annoyance and quenching thirst. It contains a lot of water.", "image_name": "010.jpeg"}'
                      );
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-mono text-xs px-3 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    Load Fruit Payload Template
                  </button>
                </div>
              </div>
            </div>

            {/* REST Response output terminal display */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                Server Response Viewer
              </h3>
              <pre className="bg-slate-900 border border-slate-200 p-4 rounded-xl text-xs text-slate-300 font-mono whitespace-pre overflow-x-auto min-h-24">
                {feedbackResponse || "Waiting to accept POST payloads..."}
              </pre>
            </div>
          </div>
        )}

        {/* VIEW 3: Django fruit storefront storefront */}
        {activeSiteTab === "fruitstore" && (
          <div className="p-6 space-y-6">
            <header className="border-b border-orange-500/10 pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                  🏪 Fruit Catalog
                </h1>
                <p className="text-xs text-slate-500">
                  Supplier Online Marketplace Catalog management dashboard
                </p>
              </div>
            </header>

            {fruits.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs italic">
                Fruit inventory currently empty. Modify, save and run `run_catalog.py` to upload supplier fruits!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fruits.map((fr) => {
                  return (
                    <div
                      key={fr.id}
                      id={`fruit-card-${fr.name}`}
                      className="bg-white border text-slate-900 border-slate-200 p-0 rounded-xl overflow-hidden flex flex-col hover:border-sky-305 hover:border-sky-400 transition-all shadow-sm"
                    >
                      {/* Fruit Graphic placeholder / generated thumbnail */}
                      <div className="h-32 bg-slate-50 flex items-center justify-center relative select-none border-b border-slate-100">
                        <span className="text-5xl shrink-0 animate-bounce duration-1000 mt-2">
                          {fr.name === "Apple" && "🍎"}
                          {fr.name === "Avocado" && "🥑"}
                          {fr.name === "Mango" && "🥭"}
                          {fr.name === "Watermelon" && "🍉"}
                          {!["Apple", "Avocado", "Mango", "Watermelon"].includes(fr.name) && "🍒"}
                        </span>
                        <div className="absolute top-2 right-2 bg-orange-600 font-sans font-black text-[10px] text-white px-2 py-0.5 rounded-full select-none shadow">
                          {fr.weight} lbs
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-extrabold text-slate-900 font-sans uppercase tracking-tight">
                            {fr.name}
                          </h3>
                          <p className="text-[11px] text-slate-650 leading-relaxed font-sans line-clamp-3">
                            {fr.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
                          <span>Img: <strong className="text-sky-600 font-mono font-bold">{fr.image_name}</strong></span>
                          <span>SKU: #{fr.id + 104}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: Static Media listings exactly as described */}
        {activeSiteTab === "media" && (
          <div className="p-6 space-y-6">
            <header className="border-b border-slate-200 pb-4">
              <h1 className="text-lg font-extrabold text-slate-900">
                Index of /media/images
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Simulated server upload directory assets
              </p>
            </header>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left text-slate-500 border-collapse">
                <thead className="bg-slate-100 font-mono text-slate-500 border-b border-slate-200 uppercase text-[9px] tracking-wide select-none">
                  <tr>
                    <th className="p-3 pl-4">Asset File name</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono bg-white">
                  {uploadedFiles.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-slate-400 italic font-sans">
                        No image assets uploaded. Execute `supplier_image_upload.py` first!
                      </td>
                    </tr>
                  ) : (
                    uploadedFiles.map((fn, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 pl-4 text-slate-705 font-mono flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span>{fn}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold leading-none select-none">
                            Success
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: Diagnostics Stress Test gauges panel */}
        {activeSiteTab === "health" && (
          <div className="p-6 space-y-6">
            <header className="border-b border-slate-200 pb-4">
              <h1 className="text-lg font-extrabold text-slate-900">
                🎛️ Diagnostic Control Panel
              </h1>
              <p className="text-xs text-slate-500">
                Simulate failing hardware conditions to stress-test your `health_check.py` alerts trigger!
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Dial 1: CPU load */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-sm">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs font-bold font-mono text-slate-500 uppercase">
                    CPU Core Stress Load
                  </span>
                  <span className={`text-xs font-mono font-bold ${metrics.cpuUsage > 80 ? "text-rose-605 text-rose-600 animate-pulse font-black" : "text-emerald-605 text-emerald-600"}`}>
                    {metrics.cpuUsage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={metrics.cpuUsage}
                  id="cpu-stress-range"
                  onChange={(e) => handleMetricChange("cpuUsage", Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono select-none">
                  <span>Idle</span>
                  <span className="text-rose-500 font-bold">Alert Trigger (&gt;80%)</span>
                </div>
              </div>

              {/* Dial 2: Disk space */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-sm">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs font-bold font-mono text-slate-550 text-slate-500 uppercase">
                    Disk Space Free Portion
                  </span>
                  <span className={`text-xs font-mono font-bold ${metrics.diskFreePercent < 20 ? "text-rose-600 animate-pulse font-black" : "text-emerald-700"}`}>
                    {metrics.diskFreePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={metrics.diskFreePercent}
                  id="disk-stress-range"
                  onChange={(e) => handleMetricChange("diskFreePercent", Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono select-none text-rose-505 text-rose-500 font-bold">
                  <span>Alert (&lt;20%)</span>
                  <span className="text-slate-400 font-normal">Full Available</span>
                </div>
              </div>

              {/* Dial 3: memory */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-sm">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs font-bold font-mono text-slate-500 uppercase">
                    Available System RAM
                  </span>
                  <span className={`text-xs font-mono font-bold ${metrics.memoryAvailableMB < 100 ? "text-rose-600 animate-pulse font-black" : "text-emerald-700"}`}>
                    {metrics.memoryAvailableMB} MB
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1024"
                  value={metrics.memoryAvailableMB}
                  id="memory-stress-range"
                  onChange={(e) => handleMetricChange("memoryAvailableMB", Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono select-none">
                  <span className="text-rose-500 font-bold">Alert Trigger (&lt;100MB)</span>
                  <span>1024 MB Complete</span>
                </div>
              </div>

              {/* Dial 4: DNS Localhost resolution flag */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm select-none">
                <div className="space-y-1">
                  <span className="text-xs font-bold font-mono text-slate-500 uppercase block">
                    DNS Localhost Resolution
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-normal">
                    Check if hostname "localhost" maps to "127.0.0.1"
                  </span>
                </div>

                <button
                  onClick={() => handleMetricChange("localhostResolves", !metrics.localhostResolves)}
                  id="dns-resolves-toggle"
                  className={`px-3 py-1.5 font-mono text-[10.5px] font-bold rounded-md cursor-pointer transition-all ${
                    metrics.localhostResolves
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border border-rose-200 text-rose-700"
                  }`}
                >
                  {metrics.localhostResolves ? "OK (127.0.0.1)" : "ERROR DNS"}
                </button>
              </div>

            </div>

            {/* Simulated instructions */}
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl flex items-start gap-3 select-none">
              <Sliders className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 leading-normal">
                💡 <strong>Try this pipeline test</strong>: Drag the **CPU Core Stress Load** slider above 80%, then run `health_check.py` from code editor or terminal. You will instantly receive an automated warning email with subject line <strong>"Error - CPU usage is over 80%"</strong> inside your Roundcube Webmail sandbox!
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
