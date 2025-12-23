"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
import { CohereClient } from "cohere-ai";
import { supabase } from "@/utils/supabase";

import { useEffect, useRef, useState } from "react";
import { LoaderFive } from "@/components/ui/loader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

gsap.registerPlugin(useGSAP, TextPlugin);
const controller = new AbortController();
export default function Div() {
  let conversationId = (Math.random() * 1000000).toString();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState(false);
  const el = useRef<HTMLButtonElement>(null);
  const el1 = useRef<HTMLButtonElement>(null);
  const el2 = useRef<HTMLButtonElement>(null);
  const el3 = useRef<HTMLButtonElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const offset = 0;

  useGSAP(() => {
    gsap.to(".box ", {
      opacity: 1,
      height: "80%",
      width: "88%",
      gridTemplateRows: "90% 10%",
      duration: 0.8,
      delay: 0.5 + offset,
    });

    gsap.to(".text", {
      opacity: 1,
      y: -7,
      duration: 0.8,
      delay: 1.5 + offset,
    });

    gsap.to(".text", {
      text: "Learnie Genie",
      scale: 0.8,
      duration: 1.2,

      delay: 2.6 + offset,
    });
    gsap.to(".input", {
      opacity: 1,
      width: "70%",
      duration: 0.8,

      delay: 4 + offset,
    });
    gsap.to(".button", {
      opacity: 1,
      width: "2rem",
      height: "2rem",
      duration: 0.5,

      delay: 4.2 + offset,
    });

    const hoverAnim = gsap.to(el.current, {
      width: "2.35rem",
      height: "2.35rem",
      duration: 0.4,

      ease: "power2.out",
      paused: true,
    });
    const hoverAnim5 = gsap.to(el3.current, {
      width: "2.35rem",
      height: "2.35rem",
      duration: 0.4,

      ease: "power2.out",
      paused: true,
    });

    const hoverAnim3 = gsap.to(el1.current, {
      width: "2.35rem",
      height: "2.35rem",
      duration: 0.4,

      ease: "power2.out",
      paused: true,
    });
    const hoverAnim4 = gsap.to(el2.current, {
      width: "2.35rem",
      height: "2.35rem",
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
    el3.current?.addEventListener("mouseenter", () => hoverAnim5.play());
    el3.current?.addEventListener("mouseleave", () => hoverAnim5.reverse());
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
  async function get_sved_data() {
    const { data, error } = await supabase
      .from("chat_main")
      .select("content")
      .eq("chat_id", conversationId);
    return data?.[0]?.content;
  }

  async function fetch_data() {
    setText("");
    const content = inputRef.current?.value || "";
    setStream(true);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const { data, error } = await supabase
      .from("chat_main")
      .select("chat_id")
      .eq("chat_id", conversationId);

    if (data!.length === 0) {
      const { error: insertErr } = await supabase
        .from("chat_main")
        .insert([{ chat_id: conversationId }]);
    }
    const newController = new AbortController();
    abortControllerRef.current = newController;
    const signal = newController.signal;
    const json_object = [];

    try {
      const stream = await cohere.chatStream(
        {
          model: "command-a-03-2025",
          message: content,
          conversationId,

          preamble:
            "You are a helpful AI modeled after J.A.R.V.I.S from Iron Man. " +
            "Use concise, formal responses." +
            "Do not use markdown for math." +
            "your are J.A.R.V.I.S in this app" +
            "your creator is sheshadrinivas and his team",
        },
        { abortSignal: signal },
      );

      let fullResponse = "";

      for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
          setStream(false);
          setText((prev) => prev + chat.text);
          fullResponse += chat.text;
        }
      }
      const saved_data = await get_sved_data();
      json_object.push(saved_data);

      json_object.push({ role: "USER", message: content });
      json_object.push({ role: "CHATBOT", message: fullResponse });

      const { error: updateError } = await supabase
        .from("chat_main")
        .update({ content: json_object })
        .eq("chat_id", conversationId);

      abortControllerRef.current = null;
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream cancelled successfully.");
      } else {
        console.error("Error:", error);
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

  async function new_chat() {
    setText("new chat started");
    setTimeout(clear, 50000);
    setText(conversationId);
    conversationId = (Math.random() * 100).toString();
    await supabase.from("id_").insert([{ chat_id: conversationId }]);
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
      <div className="h-screen w-screen gap-y-5 flex flex-col justify-center items-center container">
        <p className=" text font-tomorrow text-6xl inline-block bg-gradient-to-tr from-zinc-300 to-zinc-500 bg-clip-text text-transparent opacity-0">
          Welcome Back!
        </p>

        <div className="box opacity-0 h-[0rem] w-[0rem] border border-zinc-400 rounded-lg grid grid-rows-[90%,10%] grid-cols-1 justify-center  items-center p-5   font-code text-xl">
          <div className=" h-full row-2 flex  flex-row justify-center gap-10 col-1  items-center   font-code text-xl">
            <button
              className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-accent1  text-accent1  rounded-2xl"
              ref={el3}
              onClick={new_chat}
            >
              ✺
            </button>
            <input
              className="input opacity-0 border-b-1 border-1 p-2 text-sm font-medium font-tomorrow border-b-zinc-400 border-zinc-500 rounded-2xl  w-0 outline-none  "
              ref={inputRef}
            />
            <button
              className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-accent1  text-accent1  rounded-2xl"
              ref={el}
              onClick={fetch_data}
            >
              ➤
            </button>

            <button
              className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-accent  text-accent  rounded-2xl"
              ref={el1}
              onClick={stop}
            >
              ⊙
            </button>
            <button
              className="opacity-0 w-18 h-18 flex justify-center items-center button border-2 border-background2  text-background2  rounded-2xl"
              ref={el2}
              onClick={clear}
            >
              ✕
            </button>
          </div>
          <div className=" h-full  text-md overflow-y-scroll scroll-smooth  row-1 col-1  p-6 ">
            {stream && <LoaderFive text="Thinking..." />}
            {/*<div className=" h-ful w-full font-code">{text}</div>*/}
            <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}
