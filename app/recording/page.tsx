'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mic, MicOff, Play, Pause, Download, Trash2, FileText } from 'lucide-react'
import Link from 'next/link'

export default function RecordingPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<any[]>([])
  const [currentRecording, setCurrentRecording] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        const newRecording = {
          id: Date.now().toString(),
          audioUrl,
          blob: audioBlob,
          duration: 0,
          createdAt: new Date(),
          transcription: ''
        }

        setRecordings(prev => [newRecording, ...prev])
        setCurrentRecording(newRecording)
        setIsRecording(false)

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('无法访问麦克风，请检查权限设置')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const playRecording = (recording: any) => {
    if (audioRef.current) {
      if (isPlaying && currentRecording?.id === recording.id) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.src = recording.audioUrl
        audioRef.current.play()
        setCurrentRecording(recording)
        setIsPlaying(true)
      }
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const transcribeAudio = async (recording: any) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', recording.blob, `recording-${recording.id}.wav`)

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setTranscription(data.text)
        
        setRecordings(prev => prev.map(r => 
          r.id === recording.id ? { ...r, transcription: data.text } : r
        ))
      } else {
        throw new Error('Transcription failed')
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      alert('语音转文字失败，请重试')
    } finally {
      setIsTranscribing(false)
    }
  }

  const downloadRecording = (recording: any) => {
    const link = document.createElement('a')
    link.href = recording.audioUrl
    link.download = `recording-${recording.id}.wav`
    link.click()
  }

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id))
    if (currentRecording?.id === id) {
      setCurrentRecording(null)
      setTranscription('')
    }
  }

  const useTranscription = () => {
    if (transcription) {
      localStorage.setItem('transcription', transcription)
      alert('转录内容已保存，可以在病历创建页面使用')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">语音录音</h1>
            <p className="text-sm text-gray-600">录制语音并转换为文字</p>
          </div>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>录音控制</CardTitle>
              <CardDescription>点击开始按钮进行录音</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <Button 
                    size="lg" 
                    onClick={startRecording}
                    className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600"
                  >
                    <Mic className="w-12 h-12" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={stopRecording}
                    className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 animate-pulse"
                  >
                    <MicOff className="w-12 h-12" />
                  </Button>
                )}
              </div>
              {isRecording && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">录音中...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {currentRecording && (
            <Card>
              <CardHeader>
                <CardTitle>当前录音</CardTitle>
                <CardDescription>
                  {new Date(currentRecording.createdAt).toLocaleString('zh-CN')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio 
                  ref={audioRef}
                  onEnded={handleAudioEnded}
                  className="w-full"
                  controls
                />
                
                <div className="flex gap-2">
                  <Button onClick={() => playRecording(currentRecording)}>
                    {isPlaying && currentRecording?.id === currentRecording.id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        暂停
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        播放
                      </>
                    )}
                  </Button>
                  <Button onClick={() => transcribeAudio(currentRecording)} disabled={isTranscribing}>
                    <FileText className="w-4 h-4 mr-2" />
                    {isTranscribing ? '转换中...' : '转文字'}
                  </Button>
                  <Button variant="outline" onClick={() => downloadRecording(currentRecording)}>
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>
                </div>

                {transcription && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">转录结果：</div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{transcription}</p>
                    </div>
                    <Button onClick={useTranscription}>
                      使用此转录内容
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {recordings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>录音历史</CardTitle>
                <CardDescription>共 {recordings.length} 条录音</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div 
                      key={recording.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(recording.createdAt).toLocaleString('zh-CN')}
                        </div>
                        {recording.transcription && (
                          <div className="text-xs text-gray-600 mt-1">
                            {recording.transcription.substring(0, 50)}...
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => playRecording(recording)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => transcribeAudio(recording)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadRecording(recording)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteRecording(recording.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}