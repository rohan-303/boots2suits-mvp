import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/user';
import { Send, Mic, Bot, FileText, Briefcase, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const PersonaBuilderPage: React.FC = () => {
  const { user, updateUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! I'm here to help you create a professional persona summary. Let's start with your military background."
    },
    {
      id: '2',
      sender: 'bot',
      text: "What was your military role or title?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(25);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [personaData, setPersonaData] = useState<{
    role?: string;
    yearsOfService?: string;
    skills?: string[];
    goals?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "What was your military role or title?",
    "How many years did you serve?",
    "What were your key skills? (e.g. Leadership, Logistics, Teamwork)",
    "What are your civilian career goals?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Save answer to temporary state based on current question
    const answer = inputValue.trim();
    setPersonaData(prev => {
      const newData = { ...prev };
      if (currentQuestionIndex === 0) newData.role = answer;
      else if (currentQuestionIndex === 1) newData.yearsOfService = answer;
      else if (currentQuestionIndex === 2) newData.skills = answer.split(',').map(s => s.trim());
      else if (currentQuestionIndex === 3) newData.goals = answer;
      return newData;
    });

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response and next question
    setTimeout(async () => {
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < questions.length) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: questions[nextIndex]
        }]);
        setCurrentQuestionIndex(nextIndex);
        setProgress(prev => Math.min(prev + 25, 100));
      } else {
        // Chat complete, save to backend
        setIsSaving(true);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "Great! I've gathered enough information to build your persona. Saving your profile..."
        }]);
        setProgress(100);

        try {
          // Prepare final data including the last answer (goals) which is in the local scope but state update might be pending
          // Actually, state update in React is batched/async, so we need to rely on the local 'answer' if it's the last question
          // or use a ref. But simpler is to construct the final object here.
          
          const finalPersona = {
            role: currentQuestionIndex === 0 ? answer : personaData.role,
            yearsOfService: currentQuestionIndex === 1 ? answer : personaData.yearsOfService,
            skills: currentQuestionIndex === 2 ? answer.split(',').map(s => s.trim()) : personaData.skills,
            goals: currentQuestionIndex === 3 ? answer : personaData.goals,
            bio: `A dedicated veteran with ${currentQuestionIndex === 1 ? answer : personaData.yearsOfService} years of service as ${currentQuestionIndex === 0 ? answer : personaData.role}.` // Simple generated bio
          };

          const updatedUser = await updateProfile({
            persona: finalPersona
          });

          if (user?.token) {
            updateUser({
              ...updatedUser,
              token: user.token
            });
          }

          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            sender: 'bot',
            text: "Profile saved successfully! Redirecting to dashboard..."
          }]);
          
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
          console.error('Failed to save profile:', error);
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            sender: 'bot',
            text: "There was an error saving your profile. Please try again."
          }]);
          setIsSaving(false);
        }
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chat Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-[#4A5D23]/10 p-2 rounded-lg">
                  <Bot className="h-6 w-6 text-[#4A5D23]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI Persona Builder</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Question {Math.min(currentQuestionIndex + 1, 4)} of 4</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4A5D23] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-125 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      msg.sender === 'user' ? 'bg-[#C5A059] ml-3' : 'bg-[#4A5D23] mr-3'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="h-6 w-6 text-white" />
                      ) : (
                        <Bot className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-white text-gray-900 rounded-tr-none' 
                        : 'bg-[#4A5D23]/10 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer here..."
                    className="w-full pl-4 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/50 focus:border-[#4A5D23] transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#4A5D23] transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSaving}
                  className="p-4 bg-[#4A5D23] text-white rounded-xl hover:bg-[#3b4a1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#4A5D23]/20"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Profile Completion</span>
                <span className="text-[#4A5D23]">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#4A5D23] to-[#6a8236] transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Complete the persona builder to unlock personalized job matches.
              </p>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Career Resources</h3>
            <div className="space-y-4">
              <div className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                <div className="bg-[#C5A059]/10 p-2 rounded-lg mr-3 group-hover:bg-[#C5A059]/20 transition-colors">
                  <FileText className="h-5 w-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Resume Templates</h4>
                  <p className="text-xs text-gray-500">Military-to-civilian resume formats</p>
                </div>
              </div>

              <div className="group flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                <div className="bg-[#4A5D23]/10 p-2 rounded-lg mr-3 group-hover:bg-[#4A5D23]/20 transition-colors">
                  <Briefcase className="h-5 w-5 text-[#4A5D23]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Interview Prep</h4>
                  <p className="text-xs text-gray-500">Practice common civilian interview questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PersonaBuilderPage;
