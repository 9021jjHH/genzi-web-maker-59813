import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

type MessageContent = string | { type: "text" | "image_url"; text?: string; image_url?: { url: string } }[];
type Message = { role: "user" | "assistant"; content: MessageContent; images?: string[] };

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const streamChat = async (userMessage: string, files: File[]) => {
    let userContent: MessageContent = userMessage;
    const imageUrls: string[] = [];

    // Convert files to base64 if present
    if (files.length > 0) {
      const contentParts: { type: "text" | "image_url"; text?: string; image_url?: { url: string } }[] = [
        { type: "text", text: userMessage }
      ];

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const base64 = await fileToBase64(file);
          imageUrls.push(base64);
          contentParts.push({
            type: "image_url",
            image_url: { url: base64 }
          });
        }
      }

      userContent = contentParts;
    }

    const newMessages = [...messages, { role: "user" as const, content: userContent, images: imageUrls }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          toast.error("Przekroczono limit zapytań. Spróbuj za chwilę.");
          return;
        }
        if (response.status === 402) {
          toast.error("Brak środków na koncie. Skontaktuj się z administratorem.");
          return;
        }
        throw new Error("Błąd połączenia z AI");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {}
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Wystąpił błąd podczas komunikacji z AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = input.trim() || "Przeanalizuj załączone pliki";
    const files = [...attachments];
    setInput("");
    setAttachments([]);
    await streamChat(userMessage, files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => {
      if (f.size > 20 * 1024 * 1024) {
        toast.error(`Plik ${f.name} jest za duży (max 20MB)`);
        return false;
      }
      if (!f.type.startsWith("image/")) {
        toast.error(`Obsługiwane są tylko pliki graficzne`);
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles].slice(0, 10));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-card backdrop-blur-sm border-primary/20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Chat z AI</h3>
            <p className="text-sm text-muted-foreground">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4 mb-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Rozpocznij rozmowę z AI</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.images && msg.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {msg.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Załącznik ${i + 1}`}
                          className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">
                    {typeof msg.content === "string" 
                      ? msg.content 
                      : Array.isArray(msg.content) 
                        ? msg.content.find(c => c.type === "text")?.text || ""
                        : ""}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
            {attachments.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded border border-primary/20"
                />
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || attachments.length >= 10}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            disabled={isLoading}
            className="flex-1 bg-background/50 border-primary/20 focus:border-primary/40"
          />
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="bg-gradient-primary hover:shadow-glow-primary"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
