import React, { useState } from 'react';
import { FileDown, FileText, Globe, Copy, Check, X, ExternalLink } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { exportToGoogleDocs, downloadAsHTML, downloadAsText } from '../../services/exportService';

const ExportButton = () => {
    const { project } = useProject();
    const [isOpen, setIsOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleGoogleDocsExport = async () => {
        setExporting(true);
        try {
            const result = await exportToGoogleDocs(project);
            if (result.success) {
                setCopied(true);
                setShowSuccess(true);

                // Open Google Docs
                window.open(result.googleDocsUrl, '_blank');

                setTimeout(() => {
                    setCopied(false);
                    setShowSuccess(false);
                    setIsOpen(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Export error:', error);
        } finally {
            setExporting(false);
        }
    };

    const handleHTMLExport = () => {
        downloadAsHTML(project);
        setIsOpen(false);
    };

    const handleTextExport = () => {
        downloadAsText(project);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Main Export Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
                <FileDown size={18} />
                <span>Esporta Progetto</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Esporta Documentazione</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="mx-4 mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                                <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-green-400 text-sm font-medium">Contenuto copiato!</p>
                                    <p className="text-green-400/70 text-xs mt-1">
                                        Incolla con Ctrl+V / Cmd+V nel nuovo documento Google Docs
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Export Options */}
                        <div className="p-4 space-y-2">
                            {/* Google Docs Option */}
                            <button
                                onClick={handleGoogleDocsExport}
                                disabled={exporting}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-indigo-500/50 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Globe size={20} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium text-sm">Google Docs</span>
                                        <ExternalLink size={12} className="text-zinc-500" />
                                    </div>
                                    <p className="text-zinc-400 text-xs mt-0.5">
                                        {exporting ? 'Preparazione in corso...' : 'Copia e apri Google Docs'}
                                    </p>
                                </div>
                                {copied ? (
                                    <Check size={18} className="text-green-400" />
                                ) : (
                                    <Copy size={18} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                )}
                            </button>

                            {/* HTML Option */}
                            <button
                                onClick={handleHTMLExport}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-indigo-500/50 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="text-white font-medium text-sm block">File HTML</span>
                                    <p className="text-zinc-400 text-xs mt-0.5">
                                        Scarica documento formattato
                                    </p>
                                </div>
                                <FileDown size={18} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                            </button>

                            {/* Plain Text Option */}
                            <button
                                onClick={handleTextExport}
                                className="w-full flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-indigo-500/50 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center flex-shrink-0">
                                    <FileText size={20} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <span className="text-white font-medium text-sm block">Testo Semplice</span>
                                    <p className="text-zinc-400 text-xs mt-0.5">
                                        Scarica come file .txt
                                    </p>
                                </div>
                                <FileDown size={18} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
                            <p className="text-zinc-500 text-xs text-center">
                                {project.name ? `Progetto: ${project.name}` : 'Nessun nome progetto definito'}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;
