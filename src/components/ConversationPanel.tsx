import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Conversation } from "../types";
import { MenuIcon } from "lucide-react";

interface ConversationPanelProps {
  userId: string;
  onSelect: (conversation: Conversation) => void;
  refreshKey?: number;
}

export function ConversationPanel({
  userId,
  onSelect,
  refreshKey,
}: ConversationPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("conversations")
      .select("id, session_id, conversation_type, updated_at, created_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      return;
    }

    setConversations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchConversations();
  }, [refreshKey]);

  return (
    <div
      className={`flex flex-col ${open ? "w-72" : "w-12"} bg-white border-r border-gray-200 transition-width duration-200`}
    >
      <div
        className={`flex items-center justify-between ${open ? "p-4" : "p-1 mt-3"} text-xl max-h-[90vh] overflow-y-scroll`}
      >
        {open && <div className="font-semibold">Conversations</div>}
        <button
          aria-label="Toggle conversations"
          className="px-2 py-1 text-sm text-gray-600 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon size={25} />
        </button>
      </div>

      {open && (
        <div className="flex-1 overflow-y-auto p-2">
          {/* {loading && <div className="text-sm text-gray-500">Loading...</div>} */}
          {!loading && conversations.length === 0 && (
            <div className="text-sm text-gray-500">No conversations</div>
          )}
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                onClick={() => onSelect(c as Conversation)}
                title={c.session_id}
              >
                <div className="text-sm font-medium">{c.conversation_type}</div>
                <div className="text-xs text-gray-500">
                  {new Date(c.updated_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ConversationPanel;

