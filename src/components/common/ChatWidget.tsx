import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const ChatWidget = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: t('chat.welcome', 'Hello! How can I help you with your olive oil choice today?') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = t('chat.default_response', 'Thank you for your question! All our olive oils come directly from the Messinia region in Greece and are of the highest quality (Extra Virgin). Would you like to know more about a specific variety?');
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-bg-card shadow-2xl border border-border-subtle flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest">{t('chat.support_title', 'Olea Support')}</h4>
                  <p className="text-[10px] opacity-70">{t('chat.support_subtitle', 'Typical response time: seconds')}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 text-text-main">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "max-w-[80%] p-3 text-xs leading-relaxed",
                  m.role === 'user' 
                    ? "ml-auto bg-primary text-white rounded-l-lg rounded-tr-lg" 
                    : "mr-auto bg-bg-page text-text-main border border-border-subtle rounded-r-lg rounded-tl-lg font-medium"
                )}>
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div className="mr-auto bg-bg-page border border-border-subtle p-3 rounded-r-lg rounded-tl-lg flex gap-1">
                  <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-subtle bg-bg-card">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.placeholder', 'How can I help?')}
                  className="flex-grow bg-bg-page text-text-main border border-border-subtle px-4 py-2 text-xs focus:ring-1 focus:ring-primary h-[40px] rounded-sm"
                />
                <button 
                  onClick={handleSend}
                  className="bg-primary text-white px-3 flex items-center justify-center hover:brightness-110 rounded-sm"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:brightness-110 transition-all"
      >
        <MessageCircle size={20} />
      </motion.button>
    </div>
  );
};
