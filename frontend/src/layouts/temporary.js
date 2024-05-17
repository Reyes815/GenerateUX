import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import DOMPurify from 'dompurify';

function Temporary() {
    
  const [html, setHtml] = useState('');
    const [typing, setTyping] = useState(false);
    const API_Key = "AIzaSyB2M82ENZgfYOHWsuBS9NqG3jHyz7xo9TQ";  // Replace with your actual API key
    const [messages, setMessages] = useState([
        {
            message: "Hello Pookie, this is Gemini",
            sender: "Gemini",
            direction: "incoming"
        }
    ]);

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        };

        const newMessages = [...messages, newMessage];
        // Update messages
        setMessages(newMessages);
        // ChatGPT is typing
        setTyping(true);
        // Process message
        await processMessageToAi(newMessages);
    };

    async function processMessageToAi(chatMessages) {
        try {
            // Replace with your private API key
            const genAI = new GoogleGenerativeAI(API_Key);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = chatMessages.map(msg => `${msg.sender}: ${msg.message}`).join('\n') + '\nGemini:';
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            console.log(text);    
            setMessages([
                ...chatMessages,
                {
                    message: text,
                    sender: "Gemini",
                    direction: "incoming"
                }
            ]);
            setTyping(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    return (
        <div className="pageWrapper d-lg-flex">
            <div style={{ position: "relative", height: "800px", width: "700px", alignItems: "center" }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            typingIndicator={typing ? <TypingIndicator content="Gemini is typing..." /> : null}
                        >
                            {messages.map((message, i) => (
                                <Message key={i} model={{
                                    message: message.message,
                                    sentTime: "just now",
                                    sender: message.sender,
                                    direction: message.direction
                                }} />
                            ))}
                        </MessageList>
                        <MessageInput placeholder='Type message here, Pookie' onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default Temporary;
