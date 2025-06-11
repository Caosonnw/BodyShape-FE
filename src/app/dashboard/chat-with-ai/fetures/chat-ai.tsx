'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// const SAMPLE_PROMPTS = [
//   'I am male, 28 years old, 1m75 tall, weighing 80kg. I want to reduce belly fat and increase muscle. What should I practice?',
//   'I want to increase my hands and shoulders for 2 months. Is it possible to schedule me to schedule?',
//   'What should I eat to support weight loss and keep muscle?'
// ]

const SAMPLE_PROMPTS = [
  'Tôi là nam, 28 tuổi, cao 1m75, nặng 80kg. Tôi muốn giảm mỡ bụng và tăng cơ. Tôi nên tập gì?',
  'Tôi muốn tăng cơ tay và vai trong 2 tháng. Bạn có thể lên lịch tập cho tôi không?',
  'Tôi nên ăn gì để hỗ trợ giảm cân mà vẫn giữ được cơ bắp?'
]

export default function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (data.success) {
        // If data.data is null, show error message
        if (data.data == null) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, there was a mistake. Please try again.',
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, errorMessage])
        } else {
          // Parse the response body if it's a string
          let aiContent = data.data
          if (typeof aiContent === 'string') {
            try {
              const parsed = JSON.parse(aiContent)
              aiContent = parsed.output?.message || parsed.content || aiContent
            } catch {
              // If parsing fails, use the string as is
            }
          }

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiContent,
            timestamp: new Date()
          }

          setMessages((prev) => [...prev, aiMessage])
        }
      } else {
        throw new Error(data.message || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was a mistake. Please try again.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className=' mx-auto flex items-center gap-3'>
          <div className='w-8 h-8 bg-[#f7244f] rounded-lg flex items-center justify-center'>
            <Bot className='w-5 h-5 text-white' />
          </div>
          <h1 className='text-xl font-semibold text-gray-800'>AI Chat Assistant</h1>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className=' mx-auto space-y-6'>
          {messages.length === 0 ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-[#f7244f] rounded-full flex items-center justify-center mx-auto mb-4'>
                <Sparkles className='w-8 h-8 text-white' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Welcome to the bodyshape's chat AI</h2>
              <p className='text-gray-600 mb-8'>
                Choose one of the suggestions below or enter your question to choose one of the suggestions below or
                enter your question
              </p>

              {/* Sample Prompts */}
              <div className='grid gap-3 max-w-2xl mx-auto'>
                {SAMPLE_PROMPTS.map((prompt, index) => (
                  <Card
                    key={index}
                    className='cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#f7244f]'
                    onClick={() => handlePromptClick(prompt)}
                  >
                    <CardContent className='p-4'>
                      <p className='text-left text-gray-700'>{prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className='w-8 h-8 bg-[#f7244f] rounded-full flex items-center justify-center flex-shrink-0'>
                    <Bot className='w-5 h-5 text-white' />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-[#f7244f] text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className='whitespace-pre-wrap'>{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString('vi-VN')}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0'>
                    <User className='w-5 h-5 text-white' />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className='flex gap-4 justify-start'>
              <div className='w-8 h-8 bg-[#f7244f] rounded-full flex items-center justify-center flex-shrink-0'>
                <Bot className='w-5 h-5 text-white' />
              </div>
              <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3'>
                <div className='flex space-x-1'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className='bg-white border-t border-gray-200 p-4'>
        <div className=' mx-auto'>
          <form onSubmit={handleSubmit} className='flex gap-3'>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter your message ...'
              disabled={isLoading}
              className='flex-1 rounded focus:border-[#f7244f] focus:ring-0 hover:border-[#f7244f]'
            />
            <Button
              type='submit'
              disabled={isLoading || !input.trim()}
              className='rounded bg-[#f7244f] hover:bg-[#f50637] hover:cursor-pointer px-6'
            >
              <Send className='w-4 h-4' />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
