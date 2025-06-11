import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 })
    }

    // Gọi API NestJS của bạn
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080'}/chat/chat-with-ai`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get AI response')
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}
