'use client';
import Card from '@/components/shared/Card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import soundIcon from '../../public/assets/icons/sound.svg';
import { translateText } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Spinner } from '../ui/spinner';
interface ResultDetail {
    id: string;
    response_id: string;
    assistant_name: string;
    image_url: string;
    response_text: string;
}

const ResponseCollection = () => {
    const [data, setData] = useState<ResultDetail[]>();
    const [isVisible, setVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);
    const [translation, setTranslation] = useState<string>('')

    const getSingleResponse = (id: string) => {
        setVisible(true)
        const restult = data?.filter((item) => item.response_id === id)
        if (restult) {
            setResultDetails(restult);
        }
    }
    const fetchData = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => response.json())
            .then((data) => setData(data?.data));
    }
    const deleteHandler = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        } finally {
            setVisible(false)
            fetchData()
        }
    }

    const ReportHandler = async (id: string) => {
        alert("Comming Soon...",)
        console.log(id)
    }

    const speechSynthesis = () => {
        const synth = window.speechSynthesis;
        const speakText = translation ? translation : resultDetails[0]?.response_text
        const utterThis = new SpeechSynthesisUtterance(speakText);
        const voices = synth.getVoices();

        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');

        if (hindiVoice) {
            utterThis.voice = hindiVoice;
        } else {
            console.warn('Hindi voice not found');
        }
        synth.speak(utterThis);
    }


    const Translation = async () => {
        setLoading(true)
        const text = resultDetails[0]?.response_text;
        const data = await translateText(text, 'hindi', 'english');
        setLoading(false)
        setTranslation(data)
    }

    const dialogHandler = () => {
        console.log("working....")
        setVisible(false)
    }

    useEffect(() => {
        if (!isVisible) {
            window.speechSynthesis.cancel();
        }
        setTranslation('')
    }, [isVisible]);

    useEffect(() => {
        if (translation) {
            speechSynthesis();
        }
    }, [translation]);

    useEffect(() => {
        fetchData()
    }, [])
    console.log(resultDetails)
    return (
        <div>
            {
                !data && <Spinner
                    show={true}
                    size="large"
                />

            }
            <ul className='collection-list'>
                {
                    data && data.map((item: ResultDetail) => (
                        <li key={item.id}
                            onClick={() => getSingleResponse(item.response_id)} className='cursor-pointer'>
                            <Card
                                id={item.response_id}
                                title={item.assistant_name}
                                url={item.image_url}
                            />
                        </li>
                    ))
                }
            </ul>

            <Dialog open={isVisible} onOpenChange={dialogHandler}>
                {
                    resultDetails !== null && (
                        <DialogContent className="h-[600px] max-w-md mx-auto flex flex-col">
                            <DialogHeader>
                                <DialogTitle />
                            </DialogHeader>
                            <div className='flex justify-between items-center'>
                                <h3 className=''>{resultDetails[0]?.assistant_name}</h3>
                                <Image
                                    src={soundIcon}
                                    alt='sound'
                                    width={25}
                                    height={25}
                                    className='hover:cursor-pointer'
                                    onClick={speechSynthesis}
                                />
                            </div>
                            <div className="flex-1 scrollable-content p-4">
                                <Image
                                    src={resultDetails[0]?.image_url}
                                    alt={resultDetails ? resultDetails[0]?.assistant_name : 'image'}
                                    width={200}
                                    height={200}
                                    layout="responsive"
                                    className='mt-3 mb-3'
                                />
                                {isLoading ? (
                                    <Spinner
                                        show={true}
                                        size="medium"
                                    />
                                ) : (
                                    <p> {translation ? translation : resultDetails[0]?.response_text}</p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button onClick={Translation}>Translation</Button>
                                <Button onClick={() => deleteHandler(resultDetails[0]?.response_id)}>Delete</Button>
                                <Button onClick={() => ReportHandler(resultDetails[0]?.response_id)}>Chat</Button>
                            </DialogFooter>
                        </DialogContent>
                    )
                }
            </Dialog>
        </div>
    )
}

export default ResponseCollection