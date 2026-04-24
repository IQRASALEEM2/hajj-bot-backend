import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Send, Volume2, MoreVertical } from "lucide-react";
import botAvatar from "@/assets/bot-avatar.png";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  onBack: () => void;
}

type Language = "en" | "ur" | "ar";

const copy = {
  en: {
    greeting:
      "Assalamu Alaikum! Welcome to ZiyaulHarmayn. Ask me about Hajj and Umrah.",
    status: "Online • Ready to help",
    placeholder: "Type your question...",
    audio: "Play audio",
    fallback: "Sorry, I couldn't process your question.",
    connection: "Sorry, I'm having trouble connecting. Please try again.",
  },
  ur: {
    greeting:
      "السلام علیکم! زیاء الحرمین میں خوش آمدید۔ حج و عمرہ کے بارے میں سوال پوچھیں۔",
    status: "آن لائن • مدد کے لیے حاضر",
    placeholder: "اپنا سوال لکھیں...",
    audio: "آواز سنیں",
    fallback: "معذرت، میں آپ کا سوال سمجھ نہیں سکا۔",
    connection: "رابطہ قائم نہیں ہو رہا، دوبارہ کوشش کریں۔",
  },
  ar: {
    greeting:
      "السلام عليكم! أهلاً بك في ضياء الحرمين. اسأل عن الحج والعمرة.",
    status: "متصل • جاهز للمساعدة",
    placeholder: "اكتب سؤالك...",
    audio: "تشغيل الصوت",
    fallback: "عذراً، لم أتمكن من معالجة السؤال.",
    connection: "تعذر الاتصال، يرجى المحاولة مرة أخرى.",
  },
} satisfies Record<Language, Record<string, string>>;

const ChatScreen = ({ onBack }: ChatScreenProps) => {
  const [selectedLang, setSelectedLang] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: copy.en.greeting,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRtl = selectedLang === "ur" || selectedLang === "ar";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].role !== "bot") return prev;
      return [{ ...prev[0], content: copy[selectedLang].greeting }];
    });
  }, [selectedLang]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Use same-origin in dev via Vite proxy (/api -> backend).
      // In production, set VITE_API_BASE_URL (e.g. https://api.example.com) to avoid mixed-content issues.
      const apiBase =
        (import.meta as any).env?.VITE_API_BASE_URL?.toString().trim() || "";
      const endpoint = apiBase
        ? `${apiBase.replace(/\/+$/, "")}/ask`
        : "/api/ask";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, language: selectedLang }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.answer || copy[selectedLang].fallback,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: copy[selectedLang].connection,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="iconSm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={botAvatar} alt="Bot" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">ZiyaulHarmayn</h2>
                <p className="text-xs text-muted-foreground">{copy[selectedLang].status}</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="iconSm">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.role === "bot" && (
              <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border shadow-card rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.role === "bot" && (
                <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{copy[selectedLang].audio}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full object-cover" />
            <div className="bg-card border border-border shadow-card rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={copy[selectedLang].placeholder}
              className="w-full h-12 px-4 rounded-2xl bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <Button
            variant={isRecording ? "destructive" : "icon"}
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "animate-pulse-soft" : ""}
          >
            <Mic className="w-5 h-5" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Language quick switch */}
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => setSelectedLang("en")}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              selectedLang === "en"
                ? "bg-primary/10 text-primary font-medium"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang("ur")}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              selectedLang === "ur"
                ? "bg-primary/10 text-primary font-medium"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            اردو
          </button>
          <button
            onClick={() => setSelectedLang("ar")}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              selectedLang === "ar"
                ? "bg-primary/10 text-primary font-medium"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
