import { useEffect, useRef, useState } from "react";

const Message = ({ message, index, type }) => {
    const [displayedText, setDisplayedText] = useState(message.text);
    const intervalRef = useRef(null);

    console.log(type)
    useEffect(() => {
        if (type && message.sender !== "You") {
            setDisplayedText("");
            let i = 0;
            intervalRef.current = setInterval(() => {
                setDisplayedText((prev) => prev + message.text[i]);
                i++;
                if (i >= message.text.length) {
                    clearInterval(intervalRef.current);
                }
            }, 40);
            return () => clearInterval(intervalRef.current);
        } else {
            setDisplayedText(message.text);
        }
    }, [message.text, type]);

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
                background: message.sender === "You" ? "#3182ce" : "#e2e8f0",
                color: message.sender === "You" ? "#fff" : "#2d3748",
                padding: "12px 18px",
                borderRadius: 18,
                maxWidth: "70%",
                wordBreak: "break-word"
            }}>
                <strong>{message.sender}:</strong> {displayedText}
            </div>
        </div>
    );
};

export default Message;