import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage, type Conversation, type Message } from '../services/messageService';
import { getUser } from '../services/userService';
import { Send, Loader2, Lock, MoreVertical, Search, CheckCheck, Sparkles, MessageSquare } from 'lucide-react';

export function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation['user'] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate smart suggestions based on the last message
  const generateSuggestions = useCallback((msgs: Message[]) => {
    if (msgs.length === 0) {
      setSuggestions(['Hi there!', 'I have a question.', 'Are you available?']);
      return;
    }

    const lastMsg = msgs[msgs.length - 1];
    // Only suggest if the last message was from the other person
    const isFromMe = lastMsg.sender === user?._id || (typeof lastMsg.sender === 'object' && lastMsg.sender._id === user?._id);
    
    if (isFromMe) {
      setSuggestions([]);
      return;
    }

    const content = lastMsg.content.toLowerCase();
    
    const newSuggestions = [];
    if (content.includes('schedule') || content.includes('meet') || content.includes('time') || content.includes('call')) {
      newSuggestions.push('I am available tomorrow.', 'What time works for you?', 'Let me check my calendar.');
    } else if (content.includes('thanks') || content.includes('thank you')) {
      newSuggestions.push("You're welcome!", "No problem.", "Happy to help.");
    } else if (content.includes('?') || content.includes('what') || content.includes('how')) {
      newSuggestions.push('Yes, that works.', 'I need to think about it.', 'Could you clarify?');
    } else if (content.includes('job') || content.includes('opportunity') || content.includes('application')) {
      newSuggestions.push('I am interested!', 'Can you send more details?', 'I applied online.');
    } else {
      newSuggestions.push('Sounds good.', 'Thanks for the update.', 'I understand.');
    }
    
    setSuggestions(newSuggestions.slice(0, 3));
  }, [user]);

  // Initialize with userId from URL if present
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const convs = await getConversations();
        setConversations(convs);

        const userIdParam = searchParams.get('userId');
        if (userIdParam) {
          // Check if we already have a conversation with this user
          const existingConv = convs.find(c => c.user._id === userIdParam);
          if (existingConv) {
            setSelectedUser(existingConv.user);
          } else {
            // If not, fetch their details to start a new one
            try {
              const userData = await getUser(userIdParam);
              // Construct a temporary user object compatible with Conversation['user']
              const tempUser = {
                _id: userData._id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                image: userData.image
              };
              setSelectedUser(tempUser);
            } catch (err) {
              console.error("Failed to fetch user details", err);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [searchParams]);

  // Poll for new messages/conversations
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (selectedUser) {
        const msgs = await getMessages(selectedUser._id);
        // Only update if length changed to avoid jitter (simple check)
        setMessages(prev => {
          if (msgs.length !== prev.length) return msgs;
          // Deep check could be better but this suffices for MVP
          return prev;
        });
      }
      const convs = await getConversations();
      setConversations(convs);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [selectedUser]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const data = await getMessages(selectedUser._id);
          setMessages(data);
          generateSuggestions(data);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, generateSuggestions]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, content: string = newMessage) => {
    if (e) e.preventDefault();
    if (!selectedUser || !content.trim()) return;

    // Optimistic update
    const tempId = Date.now().toString();
    const tempMsg: Message = {
      _id: tempId,
      content: content,
      sender: user?._id || '',
      recipient: selectedUser._id,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');
    setSuggestions([]);
    setIsSending(true);

    try {
      const sentMsg = await sendMessage(selectedUser._id, content);
      // Replace temp message with real one
      setMessages(prev => prev.map(m => m._id === tempId ? sentMsg : m));
      
      // Update conversations list immediately
      const updatedConvs = await getConversations();
      setConversations(updatedConvs);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m._id !== tempId));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    `${conv.user.firstName} ${conv.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white overflow-hidden rounded-xl shadow-sm border border-neutral-light mx-4 my-6">
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-1/3 border-r border-neutral-light flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-neutral-light bg-white">
          <h2 className="text-xl font-heading font-bold text-neutral-dark mb-4">Messages</h2>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search conversations..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
             />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading && conversations.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-neutral-gray">
              <p className="text-sm">No conversations found.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.user._id}
                onClick={() => setSelectedUser(conv.user)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-white transition-all flex items-start gap-3 group ${
                  selectedUser?._id === conv.user._id ? 'bg-white border-l-4 border-l-primary shadow-sm' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden shrink-0">
                    {conv.user.image ? (
                      <img src={conv.user.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      conv.user.firstName[0]
                    )}
                  </div>
                  {/* Online Indicator (Mock) */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold truncate ${selectedUser?._id === conv.user._id ? 'text-primary' : 'text-neutral-dark'}`}>
                      {conv.user.firstName} {conv.user.lastName}
                    </h3>
                    <span className="text-xs text-neutral-gray whitespace-nowrap">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate flex items-center gap-1 ${
                    !conv.lastMessage.read && conv.lastMessage.sender !== user?._id 
                      ? 'font-bold text-neutral-dark' 
                      : 'text-neutral-gray'
                  }`}>
                    {conv.lastMessage.sender === user?._id && <span className="text-xs">You:</span>}
                    {conv.lastMessage.content}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-light flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden p-1 -ml-2 text-neutral-gray"
                >
                  <Search className="h-5 w-5 rotate-90" /> {/* Back arrow placeholder */}
                </button>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                  {selectedUser.image ? (
                    <img src={selectedUser.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    selectedUser.firstName[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-dark">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <p className="text-xs text-neutral-gray capitalize">{selectedUser.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-neutral-gray">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <Lock className="h-3 w-3" />
                  <span className="text-xs font-medium">Encrypted</span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                  <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Send className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-neutral-dark font-medium">No messages yet</p>
                  <p className="text-sm text-neutral-gray">Start the conversation with {selectedUser.firstName}</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender === user?._id || (typeof msg.sender === 'object' && msg.sender._id === user?._id);
                  
                  return (
                    <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`max-w-[70%] group relative ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div 
                          className={`px-5 py-3 shadow-sm text-sm leading-relaxed ${
                            isMe 
                              ? 'bg-primary text-white rounded-2xl rounded-tr-none' 
                              : 'bg-white text-neutral-dark border border-gray-200 rounded-2xl rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className={`text-[10px] mt-1 flex items-center gap-1 opacity-70 ${isMe ? 'text-neutral-gray mr-1' : 'text-neutral-gray ml-1'}`}>
                          {formatDate(msg.createdAt)}
                          {isMe && <CheckCheck className="h-3 w-3 text-primary" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area & Suggestions */}
            <div className="p-4 bg-white border-t border-neutral-light">
              {/* Smart Suggestions */}
              {suggestions.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex items-center gap-1 text-xs font-bold text-primary mr-2 uppercase tracking-wider shrink-0">
                    <Sparkles className="h-3 w-3" />
                    Suggested
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(undefined, suggestion)}
                      className="whitespace-nowrap px-4 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={(e) => handleSend(e)} className="flex items-end gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-1 max-h-32"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="h-10 w-10 bg-primary text-white rounded-full hover:bg-primary-dark transition-all flex items-center justify-center disabled:opacity-50 disabled:scale-95 shadow-md hover:shadow-lg"
                >
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-gray bg-gray-50/30 p-8">
            <div className="h-32 w-32 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
              <MessageSquare className="h-16 w-16 text-primary/40" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-dark mb-2">Your Messages</h3>
            <p className="max-w-md text-center text-neutral-gray leading-relaxed">
              Connect with {user?.role === 'employer' ? 'candidates' : 'employers'} directly. 
              Select a conversation from the sidebar to start messaging securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
