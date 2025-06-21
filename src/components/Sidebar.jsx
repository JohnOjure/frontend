import { useRef, useEffect } from "react";
import { 
	SIDEBAR_MIN_WIDTH, 
	SIDEBAR_MAX_WIDTH,
	loadFromLS,
	saveToLS,
	LS_CHAT_HISTORY,
	LS_ALL_MESSAGES,
	LS_CURRENT_CHAT_ID
} from "../helpers/utils.js";

const Sidebar = ({
	sidebarWidth,
	setSidebarWidth,
	isResizing,
	setIsResizing,
	chatHistory,
	setChatHistory,
	currentChatId,
	setCurrentChatId,
	setAllMessages,
	handleNewChat,
	handleSelectChat
}) => {
	const sidebarRef = useRef(null);

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
	}, [isResizing, setSidebarWidth, setIsResizing]);

	const handleDeleteChat = (chatId) => {
		// Remove chat from chatHistory and allMessages
		setChatHistory(prev => {
			const updated = prev.filter(c => c.id !== chatId);
			// If deleted chat is current, switch to another
			if (chatId === currentChatId && updated.length > 0) {
				setCurrentChatId(updated[0].id);
			} else if (updated.length === 0) {
				// If no chats left, create a new one
				handleNewChat();
			}
			return updated;
		});

		setAllMessages(prev => {
			const { [chatId]: _, ...rest } = prev;
			return rest;
		});

		// Remove from localStorage immediately
		setTimeout(() => {
			const updatedChats = loadFromLS(LS_CHAT_HISTORY, []).filter(c => c.id !== chatId);
			const updatedMessages = (() => {
				const prev = loadFromLS(LS_ALL_MESSAGES, {});
				delete prev[chatId];
				return prev;
			})();

			saveToLS(LS_CHAT_HISTORY, updatedChats);
			saveToLS(LS_ALL_MESSAGES, updatedMessages);

			// If deleted chat is current, update LS_CURRENT_CHAT_ID
			if (chatId === currentChatId && updatedChats.length > 0) {
				saveToLS(LS_CURRENT_CHAT_ID, updatedChats[0].id);
			}

			// If no chats left, create a new one
			if (updatedChats.length === 0) {
				handleNewChat();
			}
		}, 0);
	};

	const toggleSidebar = () => {
		setSidebarWidth(
			sidebarWidth === SIDEBAR_MIN_WIDTH
				? SIDEBAR_MAX_WIDTH
				: SIDEBAR_MIN_WIDTH
		);
	};

	return (
		<div
			ref={sidebarRef}
			style={{
				width: sidebarWidth,
				minWidth: SIDEBAR_MIN_WIDTH,
				maxWidth: SIDEBAR_MAX_WIDTH,
				background: "#132541",
				color: "#e87a64",
				display: "flex",
				flexDirection: "column",
				borderRight: "1px solid #222e3a",
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
				onClick={toggleSidebar}
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
							background: "#d35400",
							color: "#fff",
							fontWeight: 600,
							fontSize: 16,
							cursor: "pointer"
						}}
					>
						New Chat
					</button>

					{chatHistory.length === 0 ? null : (
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
									onClick={() => handleDeleteChat(chat.id)}
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
	);
};

export default Sidebar;