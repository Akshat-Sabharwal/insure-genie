import { useRef, useState } from "react";
import { Upload, File, CheckCircle } from "lucide-react";

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  uploadedDocuments: Array<{ name: string; id: string }>;
}

export function DocumentUpload({
  onUpload,
  uploadedDocuments,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="hidden"
        />
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium mb-1">
          Drop your insurance document here
        </p>
        <p className="text-sm text-gray-500 mb-3">
          or{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX</p>
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded:</p>
          {uploadedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              <File className="w-5 h-5 text-blue-600" />
              <span className="flex-1 text-sm text-gray-700 truncate">
                {doc.name}
              </span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
