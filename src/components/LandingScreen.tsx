import { FileText, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LandingScreenProps {
  onSelectMode: (mode: "claims" | "recommendation") => void;
}

export function LandingScreen({ onSelectMode }: LandingScreenProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">InsureGenie</h1>
          </div>
          <p className="text-xl text-gray-600">
            Your AI-powered insurance assistant
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">Welcome, {user.email}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectMode("claims")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 text-left"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <FileText className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              File a Claim
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Upload your insurance documents and get step-by-step guidance on
              filing your claim.
            </p>
          </button>

          <button
            onClick={() => onSelectMode("recommendation")}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500 text-left"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <ShieldCheck className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Get Insurance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Receive personalized insurance recommendations tailored to your
              needs.
            </p>
          </button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">Secure • Private • AI-Powered</p>
        </div>
      </div>
    </div>
  );
}
