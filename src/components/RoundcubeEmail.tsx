import React, { useState } from "react";
import { EmailMessage } from "../types";
import { 
  Mail, 
  Inbox, 
  Send, 
  Trash2, 
  FileText, 
  Download, 
  Printer, 
  Maximize2, 
  FolderMinus,
  DownloadCloud
} from "lucide-react";

interface RoundcubeEmailProps {
  emails: EmailMessage[];
  onReadEmail: (id: string) => void;
}

export default function RoundcubeEmail({ emails, onReadEmail }: RoundcubeEmailProps) {
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "junk" | "trash">("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [pdfModalData, setPdfModalData] = useState<any | null>(null);

  // Filter messages based on folders
  const filteredEmails = emails.filter((mail) => {
    if (activeFolder === "inbox") {
      return !mail.subject.includes("[Sent]");
    }
    return false;
  }).reverse(); // Latest on top

  const unreadCount = filteredEmails.filter((m) => !m.isRead).length;
  const currentEmail = emails.find((m) => m.id === selectedEmailId);

  const handleOpenEmail = (id: string) => {
    setSelectedEmailId(id);
    onReadEmail(id);
  };

  return (
    <div className="flex h-full bg-slate-100 text-slate-800 font-sans border-r border-slate-200 overflow-hidden">
      
      {/* 1. Roundcube Navigation folders list */}
      <div className="w-52 bg-slate-50 border-r border-slate-200 flex flex-col p-3 gap-1.5 shrink-0 select-none">
        <div className="px-3 py-2 flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></div>
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase font-mono">
            ROUNDCUBE PORTAL
          </span>
        </div>

        <button
          onClick={() => setActiveFolder("inbox")}
          className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs transition-all cursor-pointer ${
            activeFolder === "inbox"
              ? "bg-sky-500 text-white font-black shadow"
              : "text-slate-650 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 shrink-0" />
            <span>INCOMING</span>
          </div>
          {unreadCount > 0 && (
            <span className={`font-mono font-black px-1.5 py-0.5 rounded-full text-[9px] leading-none ${
              activeFolder === "inbox" ? "bg-sky-600 text-white" : "bg-amber-500 text-slate-950"
            }`}>
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFolder("sent")}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs transition-all cursor-pointer ${
            activeFolder === "sent"
              ? "bg-sky-500 text-white font-black shadow"
              : "text-slate-650 text-slate-600 hover:text-slate-950 hover:bg-slate-200"
          }`}
        >
          <Send className="w-4 h-4 shrink-0" />
          <span>OUTBOX SENT</span>
        </button>

        <button
          onClick={() => setActiveFolder("junk")}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs transition-all ${
            activeFolder === "junk"
              ? "bg-slate-200/50 text-slate-405 text-slate-400 cursor-not-allowed"
              : "text-slate-400 cursor-not-allowed"
          }`}
          disabled
        >
          <FolderMinus className="w-4 h-4 shrink-0" />
          <span>JUNK CODES</span>
        </button>

        <div className="border-t border-slate-200 my-2 pt-2 text-[9px] text-slate-450 flex flex-col gap-1 px-3 uppercase font-mono tracking-wider">
          <span>Server: <strong className="text-slate-650 font-bold">localhost:25</strong></span>
          <span>SMTP Protocol: <strong className="font-bold text-sky-600">ACTIVE</strong></span>
          <span className="text-[8px] text-slate-400 pt-1 border-t border-slate-100 mt-1 block tracking-wider leading-relaxed">Written by Brian McCarthy</span>
        </div>
      </div>

      {/* 2. Messages List Index Column */}
      <div className="w-72 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0 select-none flex items-center justify-between">
          <span className="text-xs font-black text-slate-605 text-slate-600 uppercase tracking-wider font-mono">
            Inbox ({filteredEmails.length} messages)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredEmails.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs italic select-none">
              Inbox empty. Use scripts to transmit automated report emails!
            </div>
          ) : (
            filteredEmails.map((mail) => {
              const isActive = mail.id === selectedEmailId;
              const hasAlert = mail.subject.includes("Error") || mail.subject.includes("Alert") || mail.subject.includes("critical");

              return (
                <div
                  key={mail.id}
                  onClick={() => handleOpenEmail(mail.id)}
                  id={`email-item-${mail.id}`}
                  className={`p-3.5 cursor-pointer text-xs transition-all flex flex-col gap-1.5 border-b border-slate-100 ${
                    isActive
                      ? "bg-sky-50 border-l-4 border-sky-500"
                      : mail.isRead
                      ? "bg-white hover:bg-slate-100/50"
                      : "bg-amber-50/40 hover:bg-amber-50/70 font-bold border-l-4 border-amber-500"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-slate-700 font-bold flex items-center gap-1 leading-none shrink-0 truncate max-w-[130px]">
                      {mail.from}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono leading-none">
                      {mail.date}
                    </span>
                  </div>

                  <div className="flex items-start gap-1 justify-between">
                    <span className={`line-clamp-1 flex-1 leading-normal ${hasAlert ? "text-rose-600 font-bold" : "text-slate-800 font-semibold"}`}>
                      {mail.subject}
                    </span>
                    {mail.attachmentName && (
                      <FileText className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                    )}
                  </div>

                  <p className="line-clamp-1 text-slate-500 text-[10px] leading-normal font-normal">
                    {mail.body}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Detailed Email Reading Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {currentEmail ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            {/* Headers Metadata bar */}
            <div className="bg-white p-4 border-b border-slate-200 shrink-0 select-none">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 min-w-0">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    {currentEmail.subject}
                  </h2>
                  <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span>
                      Sender: <strong className="text-slate-700 font-bold">{currentEmail.from}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Recipient: <strong className="text-slate-700 font-bold">{currentEmail.to}</strong>
                    </span>
                    <span>•</span>
                    <span>Date: {currentEmail.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 border-slate-200 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 select-none font-bold shadow-sm cursor-pointer transition-all">
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email Body text content */}
            <div className="flex-1 overflow-y-auto p-5 text-slate-850 text-xs leading-relaxed space-y-4">
              <div className="whitespace-pre-wrap font-sans max-w-2xl bg-white text-slate-800 border border-slate-200 p-5 rounded-xl shadow-sm">
                {currentEmail.body}
              </div>

              {/* PDF report Attachment attachment box */}
              {currentEmail.attachmentName && currentEmail.attachmentData && (
                <div className="border border-slate-250 border-slate-205 border-slate-200 bg-white p-4 rounded-xl flex items-center justify-between max-w-lg shadow-sm select-none">
                  <div className="flex items-start gap-3">
                    <div className="bg-sky-50 border border-sky-100 text-sky-655 text-sky-600 p-2.5 rounded-lg shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold font-mono text-slate-800">
                        {currentEmail.attachmentName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Format: <strong className="text-sky-600 uppercase font-mono">ReportLab PDF Document</strong> (24.5 KB)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setPdfModalData(currentEmail.attachmentData)}
                      id="view-pdf-attachment-btn"
                      className="bg-sky-500 hover:bg-sky-600 transition-all font-mono font-black text-[10.5px] text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Report PDF</span>
                    </button>
                    <button
                      onClick={() => setPdfModalData(currentEmail.attachmentData)}
                      className="bg-white hover:bg-slate-100 transition-all text-slate-600 p-1.5 rounded-md border border-slate-200 shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 select-none">
            <Mail className="w-12 h-12 text-slate-205 text-slate-300 mb-3 animate-pulse" />
            <p className="text-xs font-medium text-slate-500">No email selected</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-normal">
              Select or open an automated notification email from the index to see generated results and attached PDF lists.
            </p>
          </div>
        )}
      </div>

      {/* 4. HIGH-FIDELITY PDF RENDERER MODAL POPUP */}
      {pdfModalData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 font-sans select-none">
            
            {/* PDF Toolbar Simulator */}
            <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-450 text-sky-400 shrink-0" />
                <span className="text-xs font-bold text-slate-300 font-mono tracking-tight">
                  Acrobat Reader Simulator - {pdfModalData.title}.pdf
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                <span className="bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  Page 1 of 1
                </span>
                <button
                  onClick={() => alert("Simulating print of document...")}
                  className="hover:text-slate-250 transition-all shrink-0 p-1 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-450" />
                </button>
                <button
                  onClick={() => alert("Simulating system download...")}
                  className="hover:text-slate-250 transition-all shrink-0 p-1 cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4 text-sky-450" />
                </button>
              </div>

              <button
                onClick={() => setPdfModalData(null)}
                className="bg-slate-950 border border-slate-800 hover:border-slate-705 hover:bg-slate-800 text-slate-350 text-white transition-all font-mono text-[11px] font-bold px-3 py-1 rounded-md cursor-pointer"
              >
                Close Document
              </button>
            </div>

            {/* PDF White Canvas Page */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-800 flex justify-center scrollbar-thin">
              <div className="bg-white w-[750px] shadow-2xl p-10 border border-gray-200 font-serif min-h-[960px] text-gray-800 flex flex-col gap-5 scale-95 origin-top transition-transform">
                {/* Title */}
                <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight leading-normal border-b-2 border-gray-200 pb-3 uppercase">
                  {pdfModalData.title}
                </h1>

                {/* Subtitle / Metadata info line */}
                <p className="text-[11px] text-gray-500 font-sans tracking-wide leading-none pb-2 mt-2">
                  {pdfModalData.additional_info}
                </p>

                {/* Report Data Details Section */}
                <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg text-xs leading-relaxed space-y-2 mt-1">
                  {pdfModalData.summaryLines?.map((line: string, idx: number) => (
                    <p key={idx} className="font-sans leading-relaxed text-gray-750">
                      ✨ {line}
                    </p>
                  ))}
                </div>

                {/* Gridded Raw Sales/Fruit listings data table */}
                {pdfModalData.tableData && (
                  <div className="mt-4 border border-gray-200 rounded overflow-hidden">
                    <table className="w-full text-xs text-left text-gray-600 font-sans border-collapse">
                      <thead className="bg-gray-105 bg-gray-100 text-gray-750 text-gray-700 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200 select-none">
                        <tr>
                          {pdfModalData.tableData[0]?.car ? (
                            <>
                              <th className="p-3 border-r border-gray-200 text-center w-16">ID</th>
                              <th className="p-3 border-r border-gray-200">Vehicle Make / Model</th>
                              <th className="p-3 border-r border-gray-200 text-right w-28">Retail Price</th>
                              <th className="p-3 text-center w-28">Total Sold</th>
                            </>
                          ) : (
                            <>
                              <th className="p-3 border-r border-gray-200">Fruit Catalogue Name</th>
                              <th className="p-3 text-center w-40">Supplied Total Weight</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pdfModalData.tableData.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-gray-50/50">
                            {row.car ? (
                              <>
                                <td className="p-3 border-r border-gray-200 text-center font-mono text-gray-500">{row.id}</td>
                                <td className="p-3 border-r border-gray-200 font-bold text-gray-900">{row.car}</td>
                                <td className="p-3 border-r border-gray-200 text-right font-mono text-emerald-700">{row.price}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-800">{row.sales}</td>
                              </>
                            ) : (
                              <>
                                <td className="p-3 border-r border-gray-200 text-gray-900 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-orange-400 block shrink-0"></span>
                                  <strong>{row.name}</strong>
                                </td>
                                <td className="p-3 text-center text-gray-800 font-mono font-bold bg-gray-50/30">{row.weight}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PDF Signatures Footer section */}
                <div className="flex-grow"></div>
                <div className="border-t border-gray-200 pt-5 mt-8 flex justify-between items-center text-[10px] text-gray-405 text-gray-400 font-sans">
                  <span>Report lab building process: <strong>SUCCESS (code 201)</strong></span>
                  <span>Digitally signed by Google Sandbox API</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
