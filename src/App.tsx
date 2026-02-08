import { useAuth } from "./contexts/AuthContext";
import { LandingScreen } from "./components/LandingScreen";
import { ChatInterface } from "./components/ChatInterface";
import { AuthScreen } from "./components/AuthScreen";
import { ToastContainer } from "./components/Toast";
import ConversationPanel from "./components/ConversationPanel";
import { supabase } from "./lib/supabase";
import { getSessionId } from "./lib/sessionManager";
import { generateAIResponse } from "./services/aiService";
import { useEffect, useState } from "react";
import type { Message, Conversation } from "./types";

type AppMode = "landing" | "claims" | "recommendation";

function App() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<AppMode>("landing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Array<{ name: string; id: string }>
  >([]);
  const [refreshConversationsKey, setRefreshConversationsKey] = useState(0);

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <ToastContainer />
        <AuthScreen />
      </>
    );
  }

  const createConversation = async (type: "claims" | "recommendation") => {
    if (!user?.id) {
      console.error("User not found");
      return null;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        session_id: getSessionId(),
        conversation_type: type,
        context: {},
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    // trigger conversation list refresh
    setRefreshConversationsKey((k) => k + 1);

    return data as Conversation;
  };

  const handleSelectMode = async (
    selectedMode: "claims" | "recommendation",
  ) => {
    const conversation = await createConversation(selectedMode);
    if (conversation) {
      setConversationId(conversation.id);
      setMode(selectedMode);
      setMessages([]);
      setUploadedDocuments([]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await (supabase as any).from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content,
        metadata: {},
      });

      const aiResponse = await generateAIResponse({
        mode: mode as "claims" | "recommendation",
        messages: [...messages, userMessage],
        documents: uploadedDocuments,
        userInput: content,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await (supabase as any).from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiResponse,
        metadata: {},
      });
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessagesForConversation = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data) {
        const loaded: Message[] = data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          created_at: m.created_at,
        }));
        setMessages(loaded);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadDocument = async (file: File) => {
    if (!conversationId) return;

    const documentId = crypto.randomUUID();
    const storagePath = `documents/${conversationId}/${documentId}_${file.name}`;

    setUploadedDocuments((prev) => [
      ...prev,
      { name: file.name, id: documentId },
    ]);

    const { error } = await (supabase as any).from("documents").insert({
      conversation_id: conversationId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      extracted_data: {
        uploadedAt: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("Error saving document:", error);
    }

    handleSendMessage(`I've uploaded my insurance document: ${file.name}`);
  };

  const handleBack = () => {
    setMode("landing");
    setMessages([]);
    setConversationId(null);
    setUploadedDocuments([]);
  };

  if (mode === "landing") {
    return (
      <>
        <ToastContainer />
        <LandingScreen onSelectMode={handleSelectMode} />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex bg-gray-50">
        <ConversationPanel
          userId={user!.id}
          onSelect={(c) => {
            setConversationId(c.id);
            setMode(c.conversation_type as "claims" | "recommendation");
            fetchMessagesForConversation(c.id);
          }}
          refreshKey={refreshConversationsKey}
        />

        <main className="flex-1">
          <ChatInterface
            mode={mode as "claims" | "recommendation"}
            messages={messages}
            onSendMessage={handleSendMessage}
            onUploadDocument={handleUploadDocument}
            onBack={handleBack}
            isLoading={isLoading}
            uploadedDocuments={uploadedDocuments}
          />
        </main>
      </div>
    </>
  );
}

export default App;
