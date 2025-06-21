import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { loadFromLS, saveToLS, summarize } from "../helpers/utils";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

const SIDEBAR_MAX_WIDTH = 300;
const AI_SHA_WELCOME = "Hello! I am Aisha, your personal AI assistant for insurance queries. How can I help you today?";
const LS_CHAT_HISTORY = "chatHistory";
const LS_ALL_MESSAGES = "allMessages";
const LS_CURRENT_CHAT_ID = "currentChatId";

async function sendChatRequest(userMessage, conversationHistory = []) {
    const url = "http://127.0.0.1:8000/api/chat";
    // const url = "https://deadly-one-seasnail.ngrok-free.app/api/chat";
    const payload = {
        user_message: userMessage,
        conversation_history: conversationHistory,
    };
    console.log("Sending request to:", url);
    console.log("Request payload:", payload);
    try {
        const response = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = response.data;
        console.log("Received response:", responseData);
        return responseData;
    } catch (error) {
        if (error.response) {
            console.error(
                "Server responded with an error:",
                error.response.status,
                error.response.data
            );
            console.error("Error details:", error.response.data.detail);
        } else if (error.request) {
            console.error("No response received:", error.request);
            console.error("Is the FastAPI server running at", url, "?");
        } else {
            console.error("Error setting up request:", error.message);
        }
        return null;
    }
}

const AishaDashboard = () => {
    const [chatHistory, setChatHistory] = useState(() =>
        loadFromLS(LS_CHAT_HISTORY, [
            { id: 1, title: "Chat with Aisha", date: "2024-06-01" },
        ])
    );
    const [currentChatId, setCurrentChatId] = useState(() =>
        loadFromLS(LS_CURRENT_CHAT_ID, 1)
    );
    const [allMessages, setAllMessages] = useState(() =>
        loadFromLS(LS_ALL_MESSAGES, {
            1: [{ sender: "Aisha", text: AI_SHA_WELCOME }],
        })
    );
    const [input, setInput] = useState("");
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MAX_WIDTH);
    const [isResizing, setIsResizing] = useState(false);

    // Add new chat handler
    const handleNewChat = () => {
        const newId = chatHistory.length
            ? Math.max(...chatHistory.map((c) => c.id)) + 1
            : 1;
        setChatHistory([
            ...chatHistory,
            {
                id: newId,
                title: "New Chat",
                date: new Date().toISOString().slice(0, 10),
            },
        ]);
        setAllMessages((prev) => ({
            ...prev,
            [newId]: [{ sender: "Aisha", text: AI_SHA_WELCOME }],
        }));
        setCurrentChatId(newId);
        setInput("");
    };

    // If no chats, create a new chat automatically
    useEffect(() => {
        if (chatHistory.length === 0) {
            handleNewChat();
        }
        // eslint-disable-next-line
    }, [chatHistory]);

    // Save chatHistory, allMessages, currentChatId to localStorage on change
    useEffect(() => {
        saveToLS(LS_CHAT_HISTORY, chatHistory);
    }, [chatHistory]);

    useEffect(() => {
        saveToLS(LS_ALL_MESSAGES, allMessages);
    }, [allMessages]);

    useEffect(() => {
        saveToLS(LS_CURRENT_CHAT_ID, currentChatId);
    }, [currentChatId]);

    // Get messages for current chat
    const messages = useMemo(
        () => allMessages[currentChatId] || [],
        [allMessages, currentChatId]
    );

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessageText = input;
        setInput(""); // Clear input immediately

        const newUserMessage = { sender: "You", text: userMessageText };

        // 1. **Optimistically update the UI with the user's message.**
        // This 'prevMessages' will correctly include the welcome message if it's the only one.
        const currentChatMessages = allMessages[currentChatId] || [];
        const updatedMessagesForDisplay = [...currentChatMessages, newUserMessage];

        setAllMessages((prev) => ({
            ...prev,
            [currentChatId]: updatedMessagesForDisplay,
        }));

        // 2. **Update chat title if it's a new chat and the first user message.**
        if (
            currentChatMessages.length === 1 &&
            currentChatMessages[0].sender === "Aisha" &&
            chatHistory.find((c) => c.id === currentChatId)?.title === "New Chat"
        ) {
            setChatHistory((prev) =>
                prev.map((c) =>
                    c.id === currentChatId ? { ...c, title: summarize(userMessageText) } : c
                )
            );
        }

        // 3. **Prepare conversation history for the API call.**
        // This is where the fix is: construct the API history from `updatedMessagesForDisplay`
        // which now *definitely* includes the user's latest message.
        const conversationHistoryForApi = updatedMessagesForDisplay
            .filter((msg) => msg.text !== AI_SHA_WELCOME) // Exclude welcome message from history sent to API
            .map((msg) => ({
                role: msg.sender === "You" ? "user" : "assistant",
                content: msg.text,
            }));

        // Call the backend API
        const response = await sendChatRequest(
            userMessageText, // Still send the specific user message for the `user_message` field
            conversationHistoryForApi // Send the full, updated conversation history
        );

        if (response && response.psi_response) {
            // Add Aisha's response to the chat
            setAllMessages((prev) => ({
                ...prev,
                [currentChatId]: [
                    ...(prev[currentChatId] || []),
                    { sender: "Aisha", text: response.psi_response },
                ],
            }));
        } else {
            // Handle cases where the API call failed or response was empty
            console.error("Failed to get a response from Aisha.");
            setAllMessages((prev) => ({
                ...prev,
                [currentChatId]: [
                    ...(prev[currentChatId] || []),
                    {
                        sender: "Aisha",
                        text: "I'm sorry, I couldn't get a response at this moment. Please try again later.",
                    },
                ],
            }));
        }
    };

    // Switch chat handler
    const handleSelectChat = (id) => {
        setCurrentChatId(id);
        setInput("");
    };

    return (
		<div style={{
			display: "flex",
			width: "100vw",
			height: "100vh",
			background: "#f4f6f8"
		}}>
			<Sidebar
				sidebarWidth={sidebarWidth}
				setSidebarWidth={setSidebarWidth}
				isResizing={isResizing}
				setIsResizing={setIsResizing}
				chatHistory={chatHistory}
				setChatHistory={setChatHistory}
				currentChatId={currentChatId}
				setCurrentChatId={setCurrentChatId}
				allMessages={allMessages}
				setAllMessages={setAllMessages}
				handleNewChat={handleNewChat}
				handleSelectChat={handleSelectChat}
			/>
			<ChatArea
				messages={messages}
				input={input}
				setInput={setInput}
				handleSend={handleSend}
			/>
		</div>
	);
};

export default AishaDashboard;