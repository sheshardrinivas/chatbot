"use client";

import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {TextPlugin} from "gsap/TextPlugin";
import {CohereClient} from "cohere-ai";


import {useEffect, useRef, useState} from "react";
import {LoaderFive} from "@/components/ui/loader";

gsap.registerPlugin(useGSAP, TextPlugin);
const controller = new AbortController();
export default function Div() {
    const [text, setText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState(false);
    const el = useRef<HTMLButtonElement>(null);
    const el1 = useRef<HTMLButtonElement>(null);
    const el2 = useRef<HTMLButtonElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useGSAP(() => {
        gsap.to(".box ", {
            height: "80%",
            width: "88%",
            gridTemplateRows: "20% 80%",
            duration: 0.8,
            delay: 0.5,
        });

        gsap.to(".text", {
            opacity: 1,
            y: -7,
            duration: 0.8,
            delay: 1.5,
        });

        gsap.to(".text", {
            text: "Better-AI",
            duration: 1.2,

            delay: 2.6,
        });
        gsap.to(".input", {
            opacity: 1,
            width: "70%",
            duration: 0.8,

            delay: 4,
        });
        gsap.to(".button", {
            opacity: 1,
            width: "2rem",
            height: "2rem",
            duration: 0.5,

            delay: 4.2,
        });

        const hoverAnim = gsap.to(el.current, {
            width: "2.3rem",
            height: "2.3rem",
            duration: 0.4,

            ease: "power2.out",
            paused: true,
        });
        const hoverAnim3 = gsap.to(el1.current, {
            width: "2.3rem",
            height: "2.3rem",
            duration: 0.4,

            ease: "power2.out",
            paused: true,
        });
        const hoverAnim4 = gsap.to(el2.current, {
            width: "2.3rem",
            height: "2.3rem",
            duration: 0.4,

            ease: "power2.out",
            paused: true,
        });
        el.current?.addEventListener("mouseenter", () => hoverAnim.play());
        el.current?.addEventListener("mouseleave", () => hoverAnim.reverse());
        el1.current?.addEventListener("mouseenter", () => hoverAnim3.play());
        el1.current?.addEventListener("mouseleave", () => hoverAnim3.reverse());
        el2.current?.addEventListener("mouseenter", () => hoverAnim4.play());
        el2.current?.addEventListener("mouseleave", () => hoverAnim4.reverse());
        const hoverAnim2 = gsap.to(inputRef.current, {
            scale: 1.02,
            duration: 0.5,

            ease: "power2.out",
            paused: true,
        });

        inputRef.current?.addEventListener("mouseenter", () => hoverAnim2.play());
        inputRef.current?.addEventListener("mouseleave", () =>
            hoverAnim2.reverse(),
        );
    }, []);
    const cohere = new CohereClient({
        token: process.env.NEXT_PUBLIC_TOKEN,
    });

    async function fetch_data() {
        setText("");
        const content = inputRef.current?.value || "";
        setStream(true)

        const newController = new AbortController();
        abortControllerRef.current = newController;
        const signal = newController.signal;

        try {

            const stream = await cohere.chatStream({
                    model: "command-a-03-2025",
                    message: content,
                },
                {abortSignal: signal,}
            );


            // 3. Iterate over the stream
            for await (const chat of stream) {
                if (chat.eventType === "text-generation") {
                    setStream(false)
                    setText((prev) => prev + chat.text);
                }
            }
            abortControllerRef.current = null;


        } catch (error: any) {
            // 4. Handle the cancellation error
            if (error.name === "AbortError") {
                console.log("\nStream cancelled successfully by AbortController.");
            } else {
                console.error("\nAn error occurred:", error);
            }
            abortControllerRef.current = null;
        }

    }

    function stop() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setStream(false);
            setText("<<answer generation stopped by user>>");
        }
    }

    function clear() {
        setText("");
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
                <p className=" text font-tomorrow text-xl inline-block bg-gradient-to-tr from-zinc-300 to-zinc-500 bg-clip-text text-transparent opacity-0">

                    Welcome Back!
                </p>

                <div
                    className="box h-[0rem] w-[0rem] border border-zinc-400 rounded-lg grid grid-rows-[20%,80%] grid-cols-1 justify-center  items-center p-5   font-code text-xl">
                    <div
                        className=" h-full row-1 flex  flex-row justify-center gap-10 col-1  items-center   font-code text-xl">
                        <input
                            className="input opacity-0 border-b-1 border-1 p-2 text-sm font-medium font-tomorrow border-b-zinc-400 border-zinc-500 rounded-2xl  w-0 outline-none  "
                            ref={inputRef}
                        />
                        <button
                            className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-accent1  text-accent1  rounded-2xl"
                            ref={el}
                            onClick={fetch_data}
                        >➤
                        </button>

                        <button
                            className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-accent  text-accent  rounded-2xl"
                            ref={el1}
                            onClick={stop}
                        >⊙
                        </button>
                        <button
                            className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-background2  text-background2  rounded-2xl"
                            ref={el2}
                            onClick={clear}
                        >✕
                        </button>

                    </div>
                    <div
                        className=" h-full  text-md overflow-y-scroll row-2 col-1  p-6 ">
                        {stream && (<LoaderFive text="Thinking..."/>)}
                        <div className=" h-ful w-full font-code">{text}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
