"use client";

import {motion} from "motion/react";
import {easeInOut} from "motion";

export const LoaderOne = () => {
    const transition = (x: number) => {
        return {
            duration: 1,
            repeat: Infinity,
            repeatType: "loop" as const,
            delay: x * 0.2,
            ease: easeInOut, // FIXED
        };
    };

    return (
        <div className="flex items-center gap-2">
            <motion.div
                initial={{y: 0}}
                animate={{y: [0, 10, 0]}}
                transition={transition(0)}
                className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300"
            />
            <motion.div
                initial={{y: 0}}
                animate={{y: [0, 10, 0]}}
                transition={transition(1)}
                className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300"
            />
            <motion.div
                initial={{y: 0}}
                animate={{y: [0, 10, 0]}}
                transition={transition(2)}
                className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300"
            />
        </div>
    );
};

export const LoaderTwo = () => {
    return (
        <div className="flex gap-2 items-center">
            <motion.span
                className="w-2 h-8 bg-gray-400 rounded"
                animate={{scaleY: [1, 2, 1]}}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: easeInOut,
                }}
            />
            <motion.span
                className="w-2 h-8 bg-gray-500 rounded"
                animate={{scaleY: [1, 2, 1]}}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: easeInOut,
                    delay: 0.2,
                }}
            />
            <motion.span
                className="w-2 h-8 bg-gray-600 rounded"
                animate={{scaleY: [1, 2, 1]}}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: easeInOut,
                    delay: 0.4,
                }}
            />
        </div>
    );
};

export const LoaderThree = ({
                                borderColor = "border-gray-500",
                            }: {
    borderColor?: string;
}) => {
    return (
        <motion.div
            className={`w-10 h-10 rounded-full border-4 ${borderColor} border-t-transparent`}
            animate={{rotate: 360}}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: easeInOut,
            }}
        />
    );
};

export const LoaderFour = ({text = "Loading..."}: { text?: string }) => {
    return (
        <div className="relative font-bold text-black [perspective:1000px] dark:text-white">
            <motion.span
                animate={{
                    skewX: [0, -40, 0],
                    scaleX: [1, 2, 1],
                }}
                transition={{
                    duration: 0.05,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2,
                    ease: easeInOut,
                    times: [0, 0.2, 0.5, 0.8, 1],
                }}
                className="relative z-20 inline-block"
            >
                {text}
            </motion.span>

            <motion.span
                className="absolute inset-0 text-[#00e571]/50 dark:text-[#00e571]"
                animate={{
                    x: [-2, 4, -3, 1.5, -2],
                    y: [-2, 4, -3, 1.5, -2],
                    opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: easeInOut,
                }}
            >
                {text}
            </motion.span>

            <motion.span
                className="absolute inset-0 text-[#8b00ff]/50 dark:text-[#8b00ff]"
                animate={{
                    x: [0, 1, -1.5, 1.5, -1, 0],
                    y: [0, -1, 1.5, -0.5, 0],
                    opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: easeInOut,
                }}
            >
                {text}
            </motion.span>
        </div>
    );
};

export const LoaderFive = ({text = "Loading..."}: { text?: string }) => {
    return (
        <div className="flex items-center gap-3 text-xl font-semibold">
            <span>{text}</span>
            <motion.div
                animate={{rotate: 360}}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: easeInOut,
                }}
                className="h-5 w-5 border-4 border-gray-500 border-t-transparent rounded-full"
            />
        </div>
    );
};
