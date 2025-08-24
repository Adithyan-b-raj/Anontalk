import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Message, type InsertMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, Send, Smile } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [onlineCount] = useState(Math.floor(Math.random() * 50) + 20);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: InsertMessage) => {
      const response = await apiRequest("POST", "/api/messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({ content: trimmedMessage });
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Format time
  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Determine if message is "sent" by current user (simulate with random for anonymity)
  const isMessageSent = (messageId: string) => {
    return messageId.charCodeAt(0) % 3 === 0; // Simple way to randomize sent/received
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg">
      {/* Header */}
      <header className="bg-whatsapp-green text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Users className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Anonymous Chat</h1>
            <p className="text-sm text-green-100" data-testid="text-online-count">
              {onlineCount} people online
            </p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto bg-chat-bg p-4 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        data-testid="message-container"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 text-center">
              <div className="text-lg mb-2">👋</div>
              <div>No messages yet. Be the first to say hello!</div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = isMessageSent(msg.id);
            return (
              <div
                key={msg.id}
                className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}
                data-testid={`message-${msg.id}`}
              >
                <div className="max-w-xs lg:max-w-md">
                  <div
                    className={`${
                      isSent ? "bg-sent-msg" : "bg-received-msg"
                    } rounded-lg px-4 py-2 shadow-sm`}
                  >
                    <p className="text-gray-800 text-sm" data-testid={`text-message-content-${msg.id}`}>
                      {msg.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 text-right" data-testid={`text-message-time-${msg.id}`}>
                      {formatTime(msg.timestamp)}
                      {isSent && " ✓✓"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent text-sm pr-12"
              disabled={sendMessageMutation.isPending}
              data-testid="input-message"
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-emoji"
            >
              <Smile className="text-lg" />
            </button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="w-12 h-12 bg-whatsapp-green hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg p-0"
            data-testid="button-send"
          >
            <Send className="text-lg" />
          </Button>
        </div>

        {/* Typing indicator placeholder */}
        <div className="mt-2 text-xs text-gray-500 h-4">
          {sendMessageMutation.isPending && (
            <span data-testid="text-sending-indicator">Sending...</span>
          )}
        </div>
      </div>
    </div>
  );
}
