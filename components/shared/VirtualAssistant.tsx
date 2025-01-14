'use client'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { fetchAPI } from "@/lib/fetch";
import { GOOGLE_APP_API_KEY, prompt } from "@/lib/config";

const VirtualAssistant: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(false);
    const [solution, setSolution] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);


    const getCameraStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: 'environment' }, // Prefer back camera
                },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.warn('Back camera not available, switching to front camera', error);
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }, // Fallback to front camera
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (fallbackError) {
                console.error('Error accessing any camera', fallbackError);
            }
        }
    };
    useEffect(() => {
        getCameraStream();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const analyzeProblem = async () => {
        setLoading(true);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (videoRef.current && context) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/jpeg").split(",")[1];
            setImagePreview(canvas.toDataURL("image/jpeg"));
            try {
                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ image: `data:image/jpeg;base64,${imageData}` })
                });
                const uploadData = await uploadResponse.json();
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_APP_API_KEY}`,
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt
                                    },
                                    { inline_data: { mime_type: "image/jpeg", data: imageData } },
                                ],
                            },
                        ]
                    },
                    { headers: { "Content-Type": "application/json" } }
                );
                const solutionText = response.data.candidates[0].content.parts[0].text;
                await fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/api/response`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        response_id: Math.random().toString(36).substr(2, 9),
                        assistant_name: "Problem Solver",
                        response_text: solutionText,
                        image_url: uploadData?.data?.secure_url
                    })
                });
                setSolution(solutionText);
            } catch (error: unknown) {
                console.error('Error asking question:', error)
                setErrorMessage(`Sorry, I encountered an error while processing your question. Error details: ${error}`)
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNewProblem = () => {
        setImagePreview(null);
        setSolution("");
        setErrorMessage(null);
        getCameraStream();
    };
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

            {errorMessage && (
                <div className="w-full mb-4 p-4 text-red-700 bg-red-100 rounded">
                    {errorMessage}
                </div>
            )}

            {!loading && !stream &&
                <div className="flex justify-center">
                    <div className="loader"></div>
                </div>}

            <div className="mt-3 w-full flex justify-center">
                <video
                    autoPlay
                    ref={videoRef}
                    className="w-500 h-auto border-none rounded-lg"
                />
            </div>
            {stream && !imagePreview && (
                <div className="w-full flex items-center justify-center mt-2">
                    <button
                        onClick={analyzeProblem}
                        className="bg-purple-gradient text-white rounded-full px-6 py-3 font-semibold text-lg shadow-md hover:bg-green-600 transition duration-300"
                    >
                        Show Me the Magic ✨
                    </button>
                </div>
            )}
            {loading && (
                <div className="flex flex-col items-center">
                    <div className="loader">

                    </div>
                    <p className="mt-2 text-gray-600">
                        Analyzing the problem, please wait...
                        <div className="loader mt-4"></div>
                    </p>
                </div>
            )}

            {!loading && solution && (
                <div className="w-[70%] m-3 border-2 border-gray-400 rounded-lg bg-white shadow-md leading-relaxed transition duration-300 hover:border-orange-500 hover:shadow-lg">
                    <p className="text-center mt-4 mx-auto mb-4 p-4 text-lg text-gray-800  ">
                        {solution}
                    </p>
                </div>
            )}

            {solution && (
                <button
                    onClick={handleNewProblem}
                    className="bg-purple-gradient text-white 
                    rounded-full px-6 py-3 
                    font-semibold text-lg 
                    shadow-md hover:bg-orange-600 
                    transition duration-300"
                >
                    New Task 🔄
                </button>
            )}
        </div>
    );
};

export default VirtualAssistant;