export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          session_id: string;
          conversation_type: 'claims' | 'recommendation';
          context: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          conversation_type: 'claims' | 'recommendation';
          context?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          conversation_type?: 'claims' | 'recommendation';
          context?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          conversation_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          extracted_data: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          extracted_data?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          storage_path?: string;
          extracted_data?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
  };
}
