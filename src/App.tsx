import { useState, useEffect } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { ChatInterface } from './components/ChatInterface';
import { supabase } from './lib/supabase';
import { getSessionId } from './lib/sessionManager';
import { generateAIResponse } from './services/aiService';
import type { Message, Conversation } from './types';

type AppMode = 'landing' | 'claims' | 'recommendation';

function App() {
  const [mode, setMode] = useState<AppMode>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ name: string; id: string }>>([]);

  const loadConversationMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const createConversation = async (type: 'claims' | 'recommendation') => {
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        session_id: sessionId,
        conversation_type: type,
        context: {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data as Conversation;
  };

  const handleSelectMode = async (selectedMode: 'claims' | 'recommendation') => {
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
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const { error: userMsgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content,
      metadata: {},
    });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    }

    try {
      const aiResponse = await generateAIResponse({
        mode: mode as 'claims' | 'recommendation',
        messages: [...messages, userMessage],
        documents: uploadedDocuments,
        userInput: content,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const { error: aiMsgError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse,
        metadata: {},
      });

      if (aiMsgError) {
        console.error('Error saving AI message:', aiMsgError);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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

    const { error } = await supabase.from('documents').insert({
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
      console.error('Error saving document:', error);
    }

    const simulatedAnalysisMessage = `I've received your document "${file.name}". Let me analyze it and help you with your claim. What would you like to know about filing a claim based on this policy?`;

    handleSendMessage(`I've uploaded my insurance document: ${file.name}`);
  };

  const handleBack = () => {
    setMode('landing');
    setMessages([]);
    setConversationId(null);
    setUploadedDocuments([]);
  };

  if (mode === 'landing') {
    return <LandingScreen onSelectMode={handleSelectMode} />;
  }

  return (
    <ChatInterface
      mode={mode as 'claims' | 'recommendation'}
      messages={messages}
      onSendMessage={handleSendMessage}
      onUploadDocument={handleUploadDocument}
      onBack={handleBack}
      isLoading={isLoading}
      uploadedDocuments={uploadedDocuments}
    />
  );
}

export default App;
