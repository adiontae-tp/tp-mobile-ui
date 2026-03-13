import { useState, useCallback, useMemo, useRef } from "react";
import {
  Chat,
  ChatMessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBubble,
  ChatMessageContent,
  ChatMessageTimestamp,
  ChatTypingIndicator,
  ChatInput,
} from "@/components/ui/chat";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Copy, RotateCcw, Trash2 } from "lucide-react";

interface Message {
  id: string;
  variant: "sent" | "received";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  { id: "1", variant: "received", text: "Hey! Are we still on for lunch today?", time: "10:30 AM" },
  { id: "2", variant: "sent", text: "Yes! How about that new place on Main St?", time: "10:31 AM" },
  { id: "3", variant: "received", text: "The Thai place? I've been wanting to try that!", time: "10:31 AM" },
  { id: "4", variant: "received", text: "Let's do 12:30?", time: "10:32 AM" },
  { id: "5", variant: "sent", text: "Perfect, see you there!\nI'll grab us a table", time: "10:32 AM" },
  { id: "6", variant: "received", text: "\u{1F60B}\u{1F37C}", time: "10:33 AM" },
  { id: "7", variant: "sent", text: "\u{1F44D}\u{1F525}", time: "10:33 AM" },
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const selectedMsgRef = useRef<Message | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const groupEnds = useMemo(() => {
    return messages.map(
      (msg, i) => i === messages.length - 1 || messages[i + 1].variant !== msg.variant
    );
  }, [messages]);

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), variant: "sent", text, time: formatTime() },
    ]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), variant: "received", text: "Sounds good! \u{1F44D}", time: formatTime() },
      ]);
    }, 1500);
  }, []);

  const handleLongPress = useCallback((msg: Message) => {
    selectedMsgRef.current = msg;
    setActionOpen(true);
  }, []);

  const handleCopy = useCallback(() => {
    if (selectedMsgRef.current) {
      navigator.clipboard?.writeText(selectedMsgRef.current.text);
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedMsgRef.current) {
      const id = selectedMsgRef.current.id;
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  }, []);

  return (
    <div ref={containerRef} className="flex h-[480px] flex-col bg-background">
      <Chat className="flex-1">
        <ChatMessageList>
          {messages.map((msg, i) => {
            const isEnd = groupEnds[i];
            return (
              <ChatMessage key={msg.id} variant={msg.variant} isGroupEnd={isEnd} animated>
                {msg.variant === "received" && (
                  <ChatMessageAvatar fallback="A" />
                )}
                <ChatMessageBubble onLongPress={() => handleLongPress(msg)}>
                  <ChatMessageContent>{msg.text}</ChatMessageContent>
                  {isEnd && (
                    <ChatMessageTimestamp>{msg.time}</ChatMessageTimestamp>
                  )}
                </ChatMessageBubble>
              </ChatMessage>
            );
          })}
        </ChatMessageList>

        <ChatTypingIndicator visible={isTyping} />

        <ChatInput
          value={input}
          onValueChange={setInput}
          onSend={handleSend}
        />
      </Chat>

      <ActionSheet
        open={actionOpen}
        onOpenChange={setActionOpen}
        container={containerRef.current}
        actions={[
          {
            label: "Copy",
            icon: <Copy className="h-4 w-4" />,
            onSelect: handleCopy,
          },
          {
            label: "Reply",
            icon: <RotateCcw className="h-4 w-4" />,
            onSelect: () => {},
          },
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onSelect: handleDelete,
            destructive: true,
          },
        ]}
      />
    </div>
  );
}
