const Message = ({ message, index }) => {
	return (
		<div 
			key={index} 
			style={{
				display: "flex",
				flexDirection: message.sender === "You" ? "row-reverse" : "row",
				marginBottom: 16
			}}
		>
			<div style={{
				background: message.sender === "You" ? "#2d3748" : "#e87a64",
				color: message.sender === "You" ? "#fff" : "#2d3748",
				padding: "12px 18px",
				borderRadius: 18,
				maxWidth: "70%",
				wordBreak: "break-word"
			}}>
				<strong>{message.sender}:</strong> {message.text}
			</div>
		</div>
	);
};

export default Message;