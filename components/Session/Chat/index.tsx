import React, { useCallback, useEffect, useRef, useState } from "react";
import { Transcript,VoiceEvent} from "realtime-ai";
import { useVoiceClientEvent } from "realtime-ai-react";

import { Button } from "@/components/ui/button";

interface Message {
    text: string;
    sender: string;
}

const Chat: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sentencesBuffer, setSentencesBuffer] = useState<string[]>([]);
    const displayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useVoiceClientEvent(
        VoiceEvent.BotTranscript,
        useCallback((text: string) => {
            setSentencesBuffer((s) => [...s, text.trim()]);
        }, [])
    );

    useVoiceClientEvent(
        VoiceEvent.UserTranscript,
        useCallback((data: Transcript) => {
            setMessages((msgs) => [...msgs, { text: data.text.trim(), sender: 'user' }]);
        }, [])
    );

    useEffect(() => {
        if (sentencesBuffer.length > 0) {
            displayIntervalRef.current = setTimeout(() => {
                setMessages((msgs) => [...msgs, { text: sentencesBuffer[0], sender: 'bot' }]);
                setSentencesBuffer((s) => s.slice(1));
            }, 1000); // Assuming 1 second delay for each message
        }
        return () => {
            if (displayIntervalRef.current) {
                clearTimeout(displayIntervalRef.current);
            }
        };
    }, [sentencesBuffer]);


    // const textToSpeech = async (text: string) => {
    //     try {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/text-to-speech`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ text }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Error generating audio');
    //         }

    //         const audioBlob = await response.blob();
    //         const audioUrl = URL.createObjectURL(audioBlob);

    //         const audio = new Audio(audioUrl);
    //         audio.play();
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
        }
    };

    return (
        <div className="flex flex-col h-[560px]">
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block max-w-xs break-words px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Type a message..."
                />
                <Button onClick={handleSend} disabled className="ml-auto mt-2 w-full  rounded-lg">
                    Send
                </Button>
            </div>
        </div>
    );
}

export default Chat;
