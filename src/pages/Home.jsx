import React, { useState, useRef, useEffect } from "react";

const SIDEBAR_MIN_WIDTH = 60;
const SIDEBAR_MAX_WIDTH = 300;

const AishaDashboard = () => {
    const [messages, setMessages] = useState([
        { sender: "Aisha", text: "Hello! I'm Aisha, your AI Insurance Copilot. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MAX_WIDTH);
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = Math.min(
                Math.max(e.clientX, SIDEBAR_MIN_WIDTH),
                SIDEBAR_MAX_WIDTH
            );
            setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages((msgs) => [
            ...msgs,
            { sender: "You", text: input }
        ]);
        setTimeout(() => {
            setMessages((msgs) => [
                ...msgs,
                { sender: "Aisha", text: "Thank you for your message. How can I help you with your insurance today?" }
            ]);
        }, 1000);
        setInput("");
    };

    // Example chat history (replace with real data as needed)
    const chatHistory = [
        { id: 1, title: "Chat with Aisha", date: "2024-06-01" },
        { id: 2, title: "Renewal Inquiry", date: "2024-05-28" },
        { id: 3, title: "Claims Process", date: "2024-05-20" }
    ];

    return (
        <div style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            background: "#f4f6f8"
        }}>
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                style={{
                    width: sidebarWidth,
                    minWidth: SIDEBAR_MIN_WIDTH,
                    maxWidth: SIDEBAR_MAX_WIDTH,
                    background: "#222e3a",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid #e0e0e0",
                    transition: isResizing ? "none" : "width 0.2s",
                    position: "relative",
                    zIndex: 2
                }}
            >
                <div style={{
                    padding: "20px 16px",
                    borderBottom: "1px solid #2d3748",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 1
                }}>
                    History
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {chatHistory.map((chat) => (
                        <div key={chat.id} style={{
                            padding: "16px",
                            borderBottom: "1px solid #2d3748",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            <div style={{ fontWeight: 600 }}>{chat.title}</div>
                            <div style={{ fontSize: 12, color: "#a0aec0" }}>{chat.date}</div>
                        </div>
                    ))}
                </div>
                {/* Sidebar resizer */}
                <div
                    onMouseDown={() => setIsResizing(true)}
                    style={{
                        width: 6,
                        cursor: "col-resize",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        background: "rgba(0,0,0,0.05)"
                    }}
                />
            </div>
            {/* Main Chat Area */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                background: "#fff"
            }}>
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#f7f9fa",
                    fontWeight: 600,
                    color: "#2d3748",
                    fontSize: 24
                }}>
                    Aisha - Insurance Copilot
                </div>
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px",
                    background: "#fafbfc"
                }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            display: "flex",
                            flexDirection: msg.sender === "You" ? "row-reverse" : "row",
                            marginBottom: 16
                        }}>
                            <div style={{
                                background: msg.sender === "You" ? "#3182ce" : "#e2e8f0",
                                color: msg.sender === "You" ? "#fff" : "#2d3748",
                                padding: "12px 18px",
                                borderRadius: 18,
                                maxWidth: "70%",
                                wordBreak: "break-word"
                            }}>
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} style={{
                    display: "flex",
                    borderTop: "1px solid #f0f0f0",
                    padding: "16px",
                    background: "#f7f9fa"
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: 8,
                            border: "1px solid #e2e8f0",
                            fontSize: 16,
                            outline: "none"
                        }}
                    />
                    <button type="submit" style={{
                        marginLeft: 12,
                        padding: "12px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: "#3182ce",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: "pointer"
                    }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AishaDashboard;
