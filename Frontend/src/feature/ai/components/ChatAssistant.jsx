import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../hook/useAI';

const ChatAssistant = () => {
    const { 
        messages, 
        isOpen, 
        loading, 
        lastAction, 
        sendMessage, 
        toggleChat, 
        resetAction 
    } = useAI();
    
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (lastAction) {
            handleAction(lastAction);
            resetAction();
        }
    }, [lastAction]);

    const handleAction = (action) => {
        if (action.triggerAction === "RAZORPAY_POPUP") {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SkVCVCdqmnE9bO",
                amount: action.amount * 100,
                currency: action.currency,
                name: "SNITCH",
                description: "AI Checkout",
                order_id: action.razorpayOrderId,
                handler: async function (response) {
                    navigate(`/order/success/${action.orderId}`);
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: action.shippingAddress?.phone || "9999999999"
                },
                theme: { color: "#000000" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        }
    };

    const handleSend = (text = input) => {
        const messageText = typeof text === 'string' ? text : input;
        if (!messageText.trim() || loading) return;
        sendMessage(messageText);
        setInput('');
    };

    const quickActions = [
        "Show new arrivals",
        "Track my order",
        "Checkout my cart",
        "Help with style"
    ];

    if (!isOpen) {
        return (
            <button 
                onClick={toggleChat}
                className="fixed bottom-8 right-8 w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[9999] group border-4 border-white dark:border-black"
            >
                <div className="absolute -top-12 right-0 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Ask Assistant
                </div>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] max-w-[calc(100vw-4rem)] max-h-[calc(100vh-4rem)] bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex flex-col z-[9999] border border-white/20 overflow-hidden animate-scale-in font-inter">
            {/* Header */}
            <div className="p-8 pb-6 flex justify-between items-center">
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">SNITCH AI</h3>
                    <p className="text-2xl font-black text-black dark:text-white leading-none tracking-tighter">Assistant</p>
                </div>
                <button 
                    onClick={toggleChat} 
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-8 py-2 space-y-6 scroll-smooth no-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-black text-white rounded-tr-none shadow-xl' 
                            : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-none'
                        }`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-white/10 p-5 rounded-[1.5rem] rounded-tl-none border border-gray-100 dark:border-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar pt-4">
                {quickActions.map((action, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(action)}
                        className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-[10px] font-black uppercase tracking-widest rounded-full transition-all whitespace-nowrap border border-transparent shadow-sm"
                    >
                        {action}
                    </button>
                ))}
            </div>

            {/* Input Footer */}
            <div className="p-8 pt-0">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center"
                >
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="w-full bg-gray-100 dark:bg-white/10 border-none rounded-2xl px-6 py-5 text-sm font-semibold focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 transition-all text-black dark:text-white placeholder-gray-400 shadow-inner"
                    />
                    <button 
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 w-12 h-12 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatAssistant;
