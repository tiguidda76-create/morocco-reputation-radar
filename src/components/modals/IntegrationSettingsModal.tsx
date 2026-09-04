import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Download, 
  Key, 
  Mail, 
  MessageCircle,
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';
import { 
  getIntegrationConfig, 
  saveIntegrationConfig, 
  testN8nConnection,
  IntegrationConfig
} from '../../services/n8nOutreachService';

interface IntegrationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const IntegrationSettingsModal: React.FC<IntegrationSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const [config, setConfig] = useState<IntegrationConfig>(() => getIntegrationConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAutoFill = () => {
    const autoConfig: IntegrationConfig = {
      n8nWebhookUrl: 'http://localhost:5678/webhook/morocco-outreach',
      resendApiKey: config.resendApiKey || '',
      metaWhatsAppToken: config.metaWhatsAppToken || '',
      metaPhoneId: config.metaPhoneId || '',
      metaWabaId: config.metaWabaId || '',
      senderEmail: 'tiguidda76@gmail.com',
      senderName: 'Hassan Tiguidda — Morocco Radar'
    };
    setConfig(autoConfig);
    saveIntegrationConfig(autoConfig);
    setSaveSuccess(true);
    if (onConfigUpdated) onConfigUpdated();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSave = () => {
    saveIntegrationConfig(config);
    setSaveSuccess(true);
    if (onConfigUpdated) onConfigUpdated();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestN8n = async () => {
    if (!config.n8nWebhookUrl) {
      setTestResult({ success: false, message: 'Veuillez saisir une URL de webhook n8n d\'abord.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const result = await testN8nConnection(config.n8nWebhookUrl);
    setIsTesting(false);
    setTestResult(result);
  };

  const handleDownloadN8nWorkflow = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/n8n_morocco_radar_workflow.json');
    element.setAttribute('download', 'n8n_morocco_radar_workflow.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                Canaux d'Outreach Réel & Intégration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configuration du moteur d'envoi d'emails réels et WhatsApp 1-clic.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Auto-Fill Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Auto-Configuration Hassan Tiguidda</div>
                <div className="text-[11px] text-slate-400">Remplit instantanément avec Gmail SMTP (`tiguidda76@gmail.com`) et votre serveur local.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Auto-Remplir & Sauvegarder</span>
            </button>
          </div>

          {/* Status Banner */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>✓ Paramètres réels sauvegardés avec succès !</span>
            </div>
          )}

          {/* SECTION 1: n8n / Local Webhook */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  ⚡ SMTP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Serveur Local & Moteur SMTP (Recommandé)</h4>
                  <p className="text-[11px] text-slate-400">Routage automatique vers Gmail SMTP avec accusé et tracking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadN8nWorkflow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-lg text-xs font-semibold transition-all"
                title="Télécharger le fichier template à importer dans n8n"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Workflow .json</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>URL Webhook Inbound (Serveur ou n8n) :</span>
                <span className="text-[10px] text-slate-500 font-mono">Port 5678</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="http://localhost:5678/webhook/morocco-outreach"
                  value={config.n8nWebhookUrl}
                  onChange={(e) => setConfig({ ...config, n8nWebhookUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleTestN8n}
                  disabled={isTesting || !config.n8nWebhookUrl}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Tester</span>
                </button>
              </div>
            </div>

            {/* Test Feedback */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* SECTION 2: Expéditeur Réel */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-sky-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Coordonnées de l'Expéditeur</h4>
                <p className="text-[11px] text-slate-400">Identité officielle apparaissant sur les rapports et devis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nom de l'Expéditeur</label>
                <input
                  type="text"
                  value={config.senderName}
                  onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email Expéditeur</label>
                <input
                  type="email"
                  value={config.senderEmail}
                  onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Direct Gmail SMTP • tiguidda76@gmail.com
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/50"
            >
              Sauvegarder
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
