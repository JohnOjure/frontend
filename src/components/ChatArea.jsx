import { useRef, useEffect, useState } from "react";
import Message from "./Message";
import aisha from "../assets/aisha.svg"
const ChatArea = ({ messages, input, setInput, handleSend }) => {
	const messagesEndRef = useRef(null);
	const textareaRef = useRef(null);
	const [type, setType] = useState(false);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Auto-resize textarea based on content
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		setType(true);
		handleSend(e);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleFormSubmit(e);
		}
	};

	return (
		<div style={{
			flex: 1,
			display: "flex",
			flexDirection: "column",
			height: "100vh",
			background: "#132541"
		}}>
			<div style={{
				display: "flex",
				alignItems: "center",
				padding: "20px 24px",
				background: "#132541"
			}}>
				<figure style={{
					width: "50px",
					height: "fit-content",
					margin: 0,
					marginRight: "16px"
				}}>
					<img 
						src={aisha} 
						alt="aisha logo" 
						style={{
							width: "100%",
							height: "100%"
						}}
					/>
				</figure>
				<div style={{
					fontWeight: 600,
					color: "#e87a64",
					fontSize: 24
				}}>
					AiSHA - Insurance Copilot
				</div>
			</div>

			<div style={{
				flex: 1,
				overflowY: "auto",
				padding: "24px",
				background: "#132541"
			}}>
				{messages.map((msg, idx) => (
					<Message key={idx} message={msg} index={idx} type={type} />
				))}
				<div ref={messagesEndRef} />
			</div>

			<form
				onSubmit={handleFormSubmit}
				style={{
					display: "flex",
					alignItems: "center",
					padding: "16px",
					background: "#132541"
				}}
			>
				<textarea
					ref={textareaRef}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type your message..."
					rows={1}
					style={{
						flex: 1,
						padding: "12px",
						borderRadius: 8,
						border: "1px solid #132541",
						background: "#fff",
						fontSize: 16,
						outline: "none",
						resize: "none",
						wordBreak: "break-word",
						overflowWrap: "break-word",
						minHeight: "44px",
						maxHeight: "120px",
						overflowY: "auto",
						fontFamily: "inherit",
						lineHeight: "1.4"
					}}
				/>
				<button
					type="submit"
					disabled={!input.trim()}
					style={{
						marginLeft: 12,
						padding: "0 24px",
						borderRadius: 8,
						border: "none",
						background: input.trim() ? "#d35400" : "#999",
						color: "#fff",
						fontWeight: 600,
						fontSize: 16,
						cursor: input.trim() ? "pointer" : "not-allowed",
						height: "44px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						transition: "background-color 0.2s ease"
					}}
				>
					Send
				</button>
			</form>

			<style jsx="true" >{`
				textarea::-webkit-scrollbar {
					width: 4px;
				}
				textarea::-webkit-scrollbar-track {
					background: transparent;
				}
				textarea::-webkit-scrollbar-thumb {
					background: #ccc;
					border-radius: 2px;
				}
				textarea::-webkit-scrollbar-thumb:hover {
					background: #999;
				}
			`}</style>
		</div>
	);
};

export default ChatArea;