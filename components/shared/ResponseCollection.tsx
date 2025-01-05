'use client';
import Card from '@/components/shared/Card';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';

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
    const [resultDetails, setResultDetails] = useState<ResultDetail[]>([]);

    const getResponseDetails = async (id: string) => {
        setVisible(true)
        const ResponseDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => response.json())
            .then((data) => data?.data);
        setResultDetails(ResponseDetails)
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

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div>
            <ul className='collection-list'>
                {
                    data && data.map((item:ResultDetail) => (
                        <li key={item.id}
                            onClick={() => getResponseDetails(item.response_id)} className='cursor-pointer'>
                            <Card
                                id={item.response_id}
                                title={item.assistant_name}
                                url={item.image_url}
                            />
                        </li>
                    ))
                }
            </ul>

            <Dialog open={isVisible} onOpenChange={setVisible}>
                <DialogContent className="h-[600px] max-w-md mx-auto flex flex-col">
                    <div className="flex-1 scrollable-content p-4">
                        <h3 className=''>{resultDetails && resultDetails[0]?.assistant_name}</h3>
                        <Image
                            src={resultDetails && resultDetails[0]?.image_url}
                            alt={resultDetails && resultDetails[0]?.assistant_name}
                            width={300}
                            height={300}
                            layout="responsive"
                            className='rounded-lg mt-3 mb-3'
                        />
                        <p>{resultDetails ? resultDetails[0]?.response_text : ''}</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => deleteHandler(resultDetails[0]?.response_id)}>Delete</Button>
                        <Button onClick={() => ReportHandler(resultDetails[0]?.response_id)}>Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ResponseCollection