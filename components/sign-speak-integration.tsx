"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Video, Mic, MicOff, Loader2 } from "lucide-react"

const API_KEY = process.env.NEXT_PUBLIC_SIGNSPEAKAPIKEY || process.env.SIGNSPEAKAPIKEY

export default function SignSpeakIntegration() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [englishText, setEnglishText] = useState("Hello, how are you?")
  const [avatarVideoUrl, setAvatarVideoUrl] = useState("")
  const [error, setError] = useState("")

  const mediaRecorderRef = useRef(null)
  const videoChunksRef = useRef([])
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // ASL Recognition - Video to Text
  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      })

      mediaRecorderRef.current = mediaRecorder
      videoChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError("Failed to access camera: " + err.message)
    }
  }

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return

    setIsRecording(false)
    setIsProcessing(true)

    mediaRecorderRef.current.stop()

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    // Wait for final chunks
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Convert to base64
    const blob = new Blob(videoChunksRef.current, { type: "video/webm" })
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1]

      try {
        const response = await fetch("https://api.sign-speak.com/recognize-sign", {
          method: "POST",
          headers: {
            "X-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: base64,
            single_recognition_mode: false,
            request_class: "BLOCKING",
            model_version: "SLR.2.sm",
          }),
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        if (data.prediction && data.prediction.length > 0) {
          const text = data.prediction
            .map((p) => p.prediction)
            .filter(Boolean)
            .join(" ")
          setRecognizedText(text || "No text recognized")
        } else if (data.batch_id) {
          setRecognizedText("Processing... Request ID: " + data.batch_id)
        }
      } catch (err) {
        setError("Recognition failed: " + err.message)
      } finally {
        setIsProcessing(false)
      }
    }

    reader.readAsDataURL(blob)
  }

  // ASL Production - Text to Avatar
  const generateAvatar = async () => {
    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("https://api.sign-speak.com/produce-sign", {
        method: "POST",
        headers: {
          "X-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          english: englishText,
          request_class: "BLOCKING",
          identity: "MALE",
          model_version: "SLP.2.sm",
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAvatarVideoUrl(url)
    } catch (err) {
      setError("Avatar generation failed: " + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (avatarVideoUrl) {
        URL.revokeObjectURL(avatarVideoUrl)
      }
    }
  }, [avatarVideoUrl])

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sign-Speak API Integration</h1>

      <Tabs defaultValue="recognize" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recognize">ASL Recognition</TabsTrigger>
          <TabsTrigger value="produce">ASL Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="recognize">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sign to Text</h2>

            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  variant={isRecording ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> Start Recording
                    </>
                  )}
                </Button>
              </div>

              {recognizedText && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Recognized Text:</p>
                  <p className="mt-2">{recognizedText}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="produce">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Text to ASL Avatar</h2>

            <div className="space-y-4">
              <Textarea
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                placeholder="Enter text to convert to ASL..."
                className="min-h-[100px]"
              />

              <Button onClick={generateAvatar} disabled={isProcessing || !englishText} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" /> Generate ASL Avatar
                  </>
                )}
              </Button>

              {avatarVideoUrl && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video src={avatarVideoUrl} controls autoPlay className="w-full h-full" />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
    </div>
  )
}
