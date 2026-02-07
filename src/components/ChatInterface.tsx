import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { MessageList } from './MessageList';
import { DocumentUpload } from './DocumentUpload';
import type { Message } from '../types';

interface ChatInterfaceProps {
  mode: 'claims' | 'recommendation';
  messages: Message[];
  onSendMessage: (content: string) => void;
  onUploadDocument: (file: File) => void;
  onBack: () => void;
  isLoading: boolean;
  uploadedDocuments: Array<{ name: string; id: string }>;
}

export function ChatInterface({
  mode,
  messages,
  onSendMessage,
  onUploadDocument,
  onBack,
  isLoading,
  uploadedDocuments,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showUpload, setShowUpload] = useState(mode === 'claims');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const modeConfig = {
    claims: {
      title: 'Claims Assistance',
      color: 'blue',
      placeholder: 'Describe your claim situation or ask a question...',
    },
    recommendation: {
      title: 'Insurance Recommendations',
      color: 'green',
      placeholder: 'Tell me what you need insurance for...',
    },
  };

  const config = modeConfig[mode];
  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-white',
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      text: 'text-green-600',
      border: 'border-green-200',
      gradient: 'from-green-50 to-white',
    },
  }[config.color];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <header className={`${colorClasses.bg} text-white py-4 px-6 shadow-lg`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">{config.title}</h1>
          </div>
          {mode === 'claims' && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload Document</span>
            </button>
          )}
        </div>
      </header>

      {showUpload && mode === 'claims' && (
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto p-4">
            <DocumentUpload
              onUpload={onUploadDocument}
              uploadedDocuments={uploadedDocuments}
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <MessageList messages={messages} mode={mode} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={config.placeholder}
              className="flex-1 resize-none rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`${colorClasses.bg} ${colorClasses.hover} text-white px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
