"use client";
import {OpenRouter} from "@openrouter/sdk";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {TextPlugin} from "gsap/TextPlugin";
import {SplitText} from "gsap/SplitText";
import {Draggable} from "gsap/Draggable";
import {InertiaPlugin} from "gsap/InertiaPlugin";
import {useEffect, useRef, useState} from "react";

gsap.registerPlugin(useGSAP, TextPlugin, SplitText, Draggable, InertiaPlugin);
const controller = new AbortController();
export default function Div() {
    const [text, setText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useGSAP(() => {
        gsap.to('.box ', {

            height: '80%',
            width: '88%',
            duration: 0.5,
            delay: 0.5,
        })


        gsap.to('.text', {

            opacity: 1,
            y: -7,
            duration: 0.5,
            delay: 1.5,
        })

        gsap.to('.text', {
            text: "Better-AI",
            duration: 1.5,

            delay: 2.6,


        })
        gsap.to('.input', {
            opacity: 1,
            width: "70%",
            duration: 0.5,

            delay: 4,


        })
        gsap.to('.button', {
            opacity: 1,
            duration: 0.5,

            delay: 4.2,


        })


    }, [])
    const openRouter = new OpenRouter({
        apiKey: process.env.NEXT_PUBLIC_OPENROUTER_KEY,
    });


    async function fetch_data() {
        setText("");
        const content = inputRef.current?.value || "";


        try {
            const stream = await openRouter.chat.send({
                model: 'nvidia/nemotron-nano-12b-v2-vl:free',
                messages: [{role: 'user', content: content}],
                stream: true,
            }, {
                signal: controller.signal,
            });

            for await (const chunk of stream) {
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                    setText((prev) => prev + content);
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Stream cancelled');
            } else {
                throw error;
            }
        }

// To cancel the stream:


    }


    function stop() {
        controller.abort();
    }

    useEffect(() => {

        inputRef.current?.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                console.log("Enter");
                fetch_data();
            }
        });
    }, []);

    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center container">
                <p className=' text font-tomorrow text-xl inline-block bg-gradient-to-tr from-zinc-300 to-zinc-500 bg-clip-text text-transparent opacity-0'> Welcome
                    Back!</p>

                <div
                    className="box h-[0rem] w-[0rem] border border-gray-200 rounded-lg flex flex-col justify-center gap-10  items-center p-6  font-code text-xl">
                    <input className="input opacity-0 border-2 p-2 border-foreground rounded-2xl w-0 "
                           ref={inputRef}/>

                    <button className=" opacity-0  button border-2 border-foreground p-2 rounded-2xl"
                            onClick={stop}>stop
                    </button>
                    <div className="text-area font-code text-md overflow-scroll">
                        {text}
                    </div>
                </div>
            </div>
        </>
    )
}