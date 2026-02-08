import { Bot, User } from "lucide-react";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  mode: "claims" | "recommendation";
}

export function MessageList({ messages, mode }: MessageListProps) {
  if (messages.length === 0) {
    const welcomeMessages = {
      claims: {
        title: "Let's help you file your claim",
        subtitle:
          "Upload your insurance documents or describe your situation to get started.",
      },
      recommendation: {
        title: "Let's find the right insurance for you",
        subtitle:
          "Tell me about your situation, and I'll recommend the best insurance options.",
      },
    };

    const welcome = welcomeMessages[mode];

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {welcome.title}
        </h2>
        <p className="text-gray-600 max-w-md">{welcome.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
        >
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              message.role === "assistant"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {message.role === "assistant" ? (
              <Bot className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div
            className={`flex-1 max-w-3xl ${
              message.role === "user" ? "flex justify-end" : ""
            }`}
          >
            <div
              className={`rounded-2xl px-5 py-3 ${
                message.role === "assistant"
                  ? "bg-white border border-gray-200"
                  : "bg-gray-900 text-white"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed m-0">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
