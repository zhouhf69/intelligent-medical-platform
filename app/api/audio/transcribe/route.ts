import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([arrayBuffer], { type: audioFile.type })
    const audioUrl = URL.createObjectURL(audioBlob)

    try {
      const transcription = await transcribeAudio(audioUrl)
      
      return NextResponse.json({
        success: true,
        text: transcription,
        confidence: 0.95
      })
    } catch (error) {
      console.error('Speech recognition error:', error)
      
      return NextResponse.json({
        success: false,
        error: 'Speech recognition not supported in this environment',
        message: '请使用支持Web Speech API的浏览器（Chrome、Edge等）'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing audio:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}

function transcribeAudio(audioUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Speech recognition only works in browser'))
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported'))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = true
    recognition.interimResults = true

    let finalTranscript = ''

    recognition.onresult = (event: any) => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        resolve(finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      reject(new Error(event.error))
    }

    recognition.onend = () => {
      if (!finalTranscript) {
        reject(new Error('No speech detected'))
      }
    }

    recognition.start()

    setTimeout(() => {
      recognition.stop()
    }, 30000)
  })
}