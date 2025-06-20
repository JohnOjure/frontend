import { useState, useRef, useEffect, useMemo } from "react";

const SIDEBAR_MIN_WIDTH = 60;
const SIDEBAR_MAX_WIDTH = 300;

const AI_SHA_WELCOME = "Hello! I'm Aisha, your AI Insurance Copilot. How can I assist you today?";

// Helpers for localStorage
const LS_CHAT_HISTORY = "aisha_chat_history";
const LS_ALL_MESSAGES = "aisha_all_messages";
const LS_CURRENT_CHAT_ID = "aisha_current_chat_id";

function loadFromLS(key, fallback) {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : fallback;
	} catch {
		return fallback;
	}
}
function saveToLS(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Intentionally ignore write errors
	}
}

const AishaDashboard = () => {
	const [chatHistory, setChatHistory] = useState(() =>
		loadFromLS(LS_CHAT_HISTORY, [
			{ id: 1, title: "Chat with Aisha", date: "2024-06-01" }
		])
	);
	const [currentChatId, setCurrentChatId] = useState(() =>
		loadFromLS(LS_CURRENT_CHAT_ID, 1)
	);
	const [allMessages, setAllMessages] = useState(() =>
		loadFromLS(LS_ALL_MESSAGES, {
			1: [{ sender: "Aisha", text: AI_SHA_WELCOME }]
		})
	);
	const [input, setInput] = useState("");
	const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_MAX_WIDTH);
	const [isResizing, setIsResizing] = useState(false);
	const messagesEndRef = useRef(null);
	const sidebarRef = useRef(null);

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
	const messages = useMemo(() => allMessages[currentChatId] || [], [allMessages, currentChatId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, currentChatId]);

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

	// Helper to summarize input
	const summarize = (text) => {
		const words = text.trim().split(/\s+/);
		return words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
	};

	const handleSend = (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		setAllMessages((prev) => ({
			...prev,
			[currentChatId]: [
				...(prev[currentChatId] || []),
				{ sender: "You", text: input }
			]
		}));

		// If this is the first user message in a new chat, update chat title
		if (
			messages.length === 1 &&
			messages[0].sender === "Aisha" &&
			chatHistory.find((c) => c.id === currentChatId)?.title === "New Chat"
		) {
			setChatHistory((prev) =>
				prev.map((c) =>
					c.id === currentChatId
						? { ...c, title: summarize(input) }
						: c
				)
			);
		}

		setTimeout(() => {
			setAllMessages((prev) => ({
				...prev,
				[currentChatId]: [
					...(prev[currentChatId] || []),
					{ sender: "Aisha", text: "Thank you for your message. How can I help you with your insurance today?" }
				]
			}));
		}, 1000);
		setInput("");
	};

	// Add new chat handler
	const handleNewChat = () => {
		const newId = chatHistory.length ? Math.max(...chatHistory.map(c => c.id)) + 1 : 1;
		setChatHistory([
			...chatHistory,
			{
				id: newId,
				title: "New Chat",
				date: new Date().toISOString().slice(0, 10)
			}
		]);
		setAllMessages((prev) => ({
			...prev,
			[newId]: [{ sender: "Aisha", text: AI_SHA_WELCOME }]
		}));
		setCurrentChatId(newId);
		setInput("");
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
				<div
					style={{
						padding: "20px 16px",
						borderBottom: "1px solid #2d3748",
						fontWeight: 700,
						fontSize: 18,
						letterSpacing: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: sidebarWidth === SIDEBAR_MIN_WIDTH ? "center" : "flex-start",
						cursor: "pointer",
						userSelect: "none"
					}}
					onClick={() =>
						setSidebarWidth(
							sidebarWidth === SIDEBAR_MIN_WIDTH
								? SIDEBAR_MAX_WIDTH
								: SIDEBAR_MIN_WIDTH
						)
					}
					title="Toggle sidebar"
				>
					{sidebarWidth === SIDEBAR_MIN_WIDTH ? (
						<svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
					) : (
						"History"
					)}
				</div>
				{sidebarWidth !== SIDEBAR_MIN_WIDTH && (
					<div style={{ flex: 1, overflowY: "auto" }}>
						<button
							onClick={handleNewChat}
							style={{
								width: "90%",
								margin: "12px 5%",
								padding: "10px",
								borderRadius: 8,
								border: "none",
								background: "#3182ce",
								color: "#fff",
								fontWeight: 600,
								fontSize: 16,
								cursor: "pointer"
							}}
						>
							New Chat
						</button>
						{chatHistory.length === 0 ? (
							null
						)
						 : (
							chatHistory.map((chat) => (
								<div
									key={chat.id}
									style={{
										display: "flex",
										alignItems: "center",
										padding: "16px",
										borderBottom: "1px solid #2d3748",
										background: chat.id === currentChatId ? "#2d3748" : "transparent"
									}}
								>
									<div
										onClick={() => handleSelectChat(chat.id)}
										style={{
											flex: 1,
											cursor: "pointer",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										}}
									>
										<div style={{ fontWeight: 600 }}>{chat.title}</div>
										<div style={{ fontSize: 12, color: "#a0aec0" }}>{chat.date}</div>
									</div>
									<button
										onClick={() => {
											// Remove chat from chatHistory and allMessages
											setChatHistory(prev => {
												const updated = prev.filter(c => c.id !== chat.id);
												// If deleted chat is current, switch to another
												if (chat.id === currentChatId && updated.length > 0) {
													setCurrentChatId(updated[0].id);
												} else if (updated.length === 0) {
													// If no chats left, create a new one
													handleNewChat();
												}
												return updated;
											});
											setAllMessages(prev => {
												const { [chat.id]: _, ...rest } = prev;
												return rest;
											});
											// Remove from localStorage immediately
											setTimeout(() => {
												const updatedChats = loadFromLS(LS_CHAT_HISTORY, []).filter(c => c.id !== chat.id);
												const updatedMessages = (() => {
													const prev = loadFromLS(LS_ALL_MESSAGES, {});
													delete prev[chat.id];
													return prev;
												})();
												saveToLS(LS_CHAT_HISTORY, updatedChats);
												saveToLS(LS_ALL_MESSAGES, updatedMessages);
												// If deleted chat is current, update LS_CURRENT_CHAT_ID
												if (chat.id === currentChatId && updatedChats.length > 0) {
													saveToLS(LS_CURRENT_CHAT_ID, updatedChats[0].id);
												}
												// If no chats left, create a new one
												if (updatedChats.length === 0) {
													handleNewChat();
												}
											}, 0);
										}}
										title="Delete chat"
										style={{
											background: "none",
											border: "none",
											color: "#a0aec0",
											cursor: "pointer",
											marginLeft: 8,
											padding: 4,
											display: "flex",
											alignItems: "center"
										}}
									>
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="3 6 5 6 21 6" />
											<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
											<line x1="10" y1="11" x2="10" y2="17" />
											<line x1="14" y1="11" x2="14" y2="17" />
										</svg>
									</button>
								</div>
							))
						)}
					</div>
				)}
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
					AiSHA - Insurance Copilot
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
