import { ComponentPage } from "@/demo/ComponentPage";
import { ChatPreview } from "@/demo/previews/ChatPreview";

const usage = `import {
  Chat, ChatMessageList, ChatMessage,
  ChatMessageAvatar, ChatMessageBubble,
  ChatMessageContent, ChatMessageTimestamp,
  ChatTypingIndicator, ChatInput,
} from "@/components/ui/chat"

const [messages, setMessages] = useState([])
const [input, setInput] = useState("")

function handleSend(text: string) {
  setMessages(prev => [...prev, { id: Date.now(), variant: "sent", text }])
  setInput("")
}

// Compute grouping — last message in a consecutive run
const isGroupEnd = (i: number) =>
  i === messages.length - 1 || messages[i + 1].variant !== messages[i].variant

<Chat>
  <ChatMessageList>
    {messages.map((msg, i) => (
      <ChatMessage key={msg.id} variant={msg.variant} isGroupEnd={isGroupEnd(i)}>
        {msg.variant === "received" && (
          <ChatMessageAvatar fallback="A" />
        )}
        <ChatMessageBubble onLongPress={() => handleLongPress(msg)}>
          <ChatMessageContent>{msg.text}</ChatMessageContent>
          {isGroupEnd(i) && (
            <ChatMessageTimestamp>2:30 PM</ChatMessageTimestamp>
          )}
        </ChatMessageBubble>
      </ChatMessage>
    ))}
  </ChatMessageList>

  <ChatTypingIndicator visible={isTyping} />

  <ChatInput
    value={input}
    onValueChange={setInput}
    onSend={handleSend}
  />
</Chat>`;

export function ChatDemo() {
  return (
    <ComponentPage
      title="Chat"
      description="Mobile chat interface with message bubbles, avatars, typing indicator, and auto-growing input. Supports emoji-only messages (auto-detected, rendered large without bubble), long press for message actions, multiline input (Shift+Enter), and message grouping."
      usage={usage}
      props={[
        { name: "variant", type: '"sent" | "received"', default: '"received"', description: "Message alignment and bubble color. Sent = right/primary, received = left/muted." },
        { name: "isGroupEnd", type: "boolean", default: "true", description: "Last message in a consecutive group from the same sender. Controls bubble tail and spacing." },
        { name: "onLongPress", type: "(e: PointerEvent) => void", description: "Callback on long press (~500ms). Use to show message actions like copy/delete (ChatMessageBubble)." },
        { name: "emojiOnly", type: "boolean", description: "Force emoji-only rendering (large text, no bubble). Auto-detected from text content when omitted (ChatMessageBubble)." },
        { name: "autoScroll", type: "boolean", default: "true", description: "Automatically scroll to bottom when new messages appear (ChatMessageList)." },
        { name: "visible", type: "boolean", default: "false", description: "Show the typing indicator animation (ChatTypingIndicator)." },
        { name: "value", type: "string", description: "Controlled input value (ChatInput)." },
        { name: "onValueChange", type: "(value: string) => void", description: "Callback when input text changes (ChatInput)." },
        { name: "onSend", type: "(value: string) => void", description: "Callback when user taps send or presses Enter (ChatInput)." },
        { name: "placeholder", type: "string", default: '"Message"', description: "Input placeholder text (ChatInput)." },
      ]}
    >
      <ChatPreview />
    </ComponentPage>
  );
}
