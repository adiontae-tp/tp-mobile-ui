import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, type AvatarProps } from "@/components/ui/avatar";

/* ---------------------------------- Helpers --------------------------------- */

/** Returns true if the string contains only emoji characters (no letters, digits, or punctuation). */
const emojiOnlyRegex =
  /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\ufe0f\s]+$/u;

function isEmojiOnly(text: string): boolean {
  return text.length > 0 && text.length <= 20 && emojiOnlyRegex.test(text);
}

/* ---------------------------------- Context --------------------------------- */

type ChatVariant = "sent" | "received";

const ChatMessageContext = React.createContext<{
  variant: ChatVariant;
  isGroupEnd: boolean;
  emojiOnly: boolean;
}>({ variant: "received", isGroupEnd: true, emojiOnly: false });

function useChatMessage() {
  return React.useContext(ChatMessageContext);
}

/* -------------------------------- Long Press -------------------------------- */

const LONG_PRESS_MS = 500;

function useLongPress(
  onLongPress?: (e: React.PointerEvent) => void
) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();
  const activeRef = React.useRef(false);
  const [pressed, setPressed] = React.useState(false);

  const clear = React.useCallback(() => {
    clearTimeout(timerRef.current);
    activeRef.current = false;
    setPressed(false);
  }, []);

  const handlers = React.useMemo(() => {
    if (!onLongPress) return {};

    return {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        activeRef.current = true;
        setPressed(true);
        timerRef.current = setTimeout(() => {
          if (activeRef.current) {
            navigator.vibrate?.(10);
            onLongPress(e);
            clear();
          }
        }, LONG_PRESS_MS);
      },
      onPointerUp: clear,
      onPointerCancel: clear,
      onPointerLeave: clear,
      onContextMenu: (e: React.MouseEvent) => {
        // Prevent native context menu on long press
        e.preventDefault();
      },
    };
  }, [onLongPress, clear]);

  return { handlers, pressed };
}

/* ----------------------------------- Chat ----------------------------------- */

/** Semantic grouping wrapper. Does not impose layout — use inside a Page. */
const Chat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("contents", className)}
    {...props}
  />
));
Chat.displayName = "Chat";

/* ------------------------------ ChatMessageList ----------------------------- */

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, autoScroll = true, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const scrollToBottom = React.useCallback(() => {
      const el = innerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, []);

    React.useEffect(() => {
      if (autoScroll && isAtBottom) {
        const el = innerRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }
    }, [children, autoScroll, isAtBottom]);

    const handleScroll = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      setIsAtBottom(
        el.scrollHeight - el.scrollTop - el.clientHeight < 40
      );
    }, []);

    return (
      <div className="relative h-full">
        <div
          ref={innerRef}
          onScroll={handleScroll}
          className={cn(
            "absolute inset-0 flex flex-col overflow-y-auto px-3 py-4",
            className
          )}
          {...props}
        >
          {children}
        </div>

        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={scrollToBottom}
              className="absolute bottom-3 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm active:bg-accent"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
ChatMessageList.displayName = "ChatMessageList";

/* ------------------------------- ChatMessage -------------------------------- */

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChatVariant;
  /** Last message in a consecutive group from the same sender. Controls tail shape and spacing. Default true. */
  isGroupEnd?: boolean;
  /** Enable entrance animation. Default false. */
  animated?: boolean;
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, variant = "received", isGroupEnd = true, animated = false, ...props }, ref) => {
    const sharedClassName = cn(
      "flex items-end gap-1.5",
      variant === "sent" ? "flex-row-reverse" : "flex-row",
      isGroupEnd ? "mb-3" : "mb-0.5",
      className
    );

    return (
      <ChatMessageContext.Provider value={{ variant, isGroupEnd, emojiOnly: false }}>
        {animated ? (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={sharedClassName}
            {...props}
          />
        ) : (
          <div ref={ref} className={sharedClassName} {...props} />
        )}
      </ChatMessageContext.Provider>
    );
  }
);
ChatMessage.displayName = "ChatMessage";

/* ----------------------------- ChatMessageAvatar ---------------------------- */

const ChatMessageAvatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const { isGroupEnd } = useChatMessage();

    if (!isGroupEnd) {
      return <div className="w-8 shrink-0" />;
    }

    return (
      <Avatar
        ref={ref}
        size={size}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  }
);
ChatMessageAvatar.displayName = "ChatMessageAvatar";

/* ----------------------------- ChatMessageBubble ---------------------------- */

interface ChatMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback fired on long press (~500ms). Useful for showing message actions. */
  onLongPress?: (e: React.PointerEvent) => void;
  /** Render as emoji-only (no background, larger text). Auto-detected from children when not set. */
  emojiOnly?: boolean;
}

const ChatMessageBubble = React.forwardRef<
  HTMLDivElement,
  ChatMessageBubbleProps
>(({ className, children, onLongPress: onLongPressProp, emojiOnly: emojiOnlyProp, ...props }, ref) => {
  const { variant, isGroupEnd } = useChatMessage();
  const { handlers, pressed } = useLongPress(onLongPressProp);

  // Auto-detect emoji-only from text children
  const autoEmojiOnly = React.useMemo(() => {
    if (emojiOnlyProp !== undefined) return emojiOnlyProp;
    // Walk children to find text content from ChatMessageContent
    let text = "";
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // Check direct string children of the element
        const childProps = child.props as { children?: React.ReactNode };
        if (typeof childProps.children === "string") {
          text += childProps.children;
        }
      } else if (typeof child === "string") {
        text += child;
      }
    });
    return text ? isEmojiOnly(text) : false;
  }, [children, emojiOnlyProp]);

  const isSent = variant === "sent";
  const tail = isGroupEnd
    ? isSent
      ? "rounded-br-[4px]"
      : "rounded-bl-[4px]"
    : "";

  const emojiContext = React.useMemo(
    () => ({ variant, isGroupEnd, emojiOnly: autoEmojiOnly }),
    [variant, isGroupEnd, autoEmojiOnly]
  );

  if (autoEmojiOnly) {
    return (
      <ChatMessageContext.Provider value={emojiContext}>
        <div
          ref={ref}
          className={cn(
            "max-w-[78%] select-none px-1 py-0.5",
            pressed && "scale-95",
            "transition-transform duration-100",
            className
          )}
          {...handlers}
          {...props}
        >
          {children}
        </div>
      </ChatMessageContext.Provider>
    );
  }

  return (
    <ChatMessageContext.Provider value={emojiContext}>
      <div
        ref={ref}
        className={cn(
          "max-w-[78%] select-none rounded-[18px] px-3 py-2",
          isSent
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
          tail,
          pressed && "scale-[0.97] opacity-90",
          "transition-[transform,opacity] duration-100",
          className
        )}
        {...handlers}
        {...props}
      />
    </ChatMessageContext.Provider>
  );
});
ChatMessageBubble.displayName = "ChatMessageBubble";

/* ----------------------------- ChatMessageContent --------------------------- */

interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as large emoji (no wrapping needed — auto-detected from text). */
  emojiOnly?: boolean;
}

const ChatMessageContent = React.forwardRef<
  HTMLDivElement,
  ChatMessageContentProps
>(({ className, children, emojiOnly: emojiOnlyProp, ...props }, ref) => {
  const autoEmoji =
    emojiOnlyProp ??
    (typeof children === "string" && isEmojiOnly(children));

  return (
    <div
      ref={ref}
      className={cn(
        "whitespace-pre-wrap",
        autoEmoji
          ? "text-[40px] leading-tight"
          : "text-[15px] leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ChatMessageContent.displayName = "ChatMessageContent";

/* ---------------------------- ChatMessageTimestamp --------------------------- */

const ChatMessageTimestamp = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { variant, emojiOnly } = useChatMessage();

  return (
    <span
      ref={ref}
      className={cn(
        "mt-1 block text-[10px] leading-none",
        emojiOnly || variant !== "sent"
          ? "text-muted-foreground"
          : "text-right text-primary-foreground/60",
        className
      )}
      {...props}
    />
  );
});
ChatMessageTimestamp.displayName = "ChatMessageTimestamp";

/* ----------------------------- ChatTypingIndicator -------------------------- */

interface ChatTypingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
}

const dotTransition = {
  duration: 0.45,
  repeat: Infinity,
  repeatType: "reverse" as const,
  ease: "easeInOut" as const,
};

const ChatTypingIndicator = React.forwardRef<
  HTMLDivElement,
  ChatTypingIndicatorProps
>(({ className, visible = false, ...props }, ref) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className={cn("flex items-end gap-1.5 overflow-hidden px-3 pb-2", className)}
        {...props}
      >
        <div className="w-8 shrink-0" />
        <div className="flex items-center gap-[3px] rounded-[18px] rounded-bl-[4px] bg-secondary px-3.5 py-2.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[5px] w-[5px] rounded-full bg-muted-foreground/50"
              animate={{ y: [0, -3, 0] }}
              transition={{ ...dotTransition, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));
ChatTypingIndicator.displayName = "ChatTypingIndicator";

/* --------------------------------- ChatInput -------------------------------- */

interface ChatInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value?: string;
  onValueChange?: (value: string) => void;
  onSend?: (value: string) => void;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    { className, value, onValueChange, onSend, placeholder = "Message", ...props },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const adjustHeight = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, []);

    React.useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleSend = React.useCallback(() => {
      const trimmed = (value ?? "").trim();
      if (!trimmed) return;
      onSend?.(trimmed);
      innerRef.current?.focus();
    }, [value, onSend]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const hasValue = (value ?? "").trim().length > 0;
    const isMultiline = (value ?? "").includes("\n");

    return (
      <div
        className={cn(
          "flex items-end gap-2 border-t border-border bg-background px-3 py-2 pb-safe-bottom",
          className
        )}
      >
        <div className="relative min-h-[44px] flex-1">
          <textarea
            ref={innerRef}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={cn(
              "max-h-[120px] min-h-[44px] w-full resize-none bg-secondary px-4 py-2 text-[15px] leading-snug placeholder:text-muted-foreground focus-visible:outline-none appearance-none",
              isMultiline ? "rounded-2xl" : "rounded-full"
            )}
            {...props}
          />
        </div>
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!hasValue}
          aria-label="Send message"
          className="mb-px flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
          animate={{ scale: hasValue ? 1 : 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      </div>
    );
  }
);
ChatInput.displayName = "ChatInput";

/* --------------------------------- Exports ---------------------------------- */

export {
  Chat,
  ChatMessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageBubble,
  ChatMessageContent,
  ChatMessageTimestamp,
  ChatTypingIndicator,
  ChatInput,
  isEmojiOnly,
};
