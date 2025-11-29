// app/api/hello/route.js

import {NextResponse} from 'next/server';
import {OpenRouter} from '@openrouter/sdk';

const api_key = process.env.OPEN;

const openRouter = new OpenRouter({
    apiKey: `${api_key}`,

});

export async function callAI(query: string) {


    const completion = await openRouter.chat.send({
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: [
            {
                role: 'user',
                content: query,
            },
        ],
        stream: false,
    });

    const data = completion.choices[0].message.content;
    return data;
}

export async function POST(
    request: Request// Type definition for params
) {
    const query = await request.json();
    const data = await callAI(query.query);
    // Return a JSON response
    return NextResponse.json({
        data: data,
    });
}
