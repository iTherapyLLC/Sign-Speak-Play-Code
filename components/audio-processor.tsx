"use client"

import { useRef, useState, useCallback } from "react"

// ============================================================================
// AUDIO PROCESSING UTILITIES
// ============================================================================

/**
 * Core audio processing class that handles recording and compression
 * Optimized for speech recognition accuracy
 */
class AudioProcessor {
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Float32Array[] = []
  private sampleRate = 16000 // Optimal for speech recognition
  private stream: MediaStream | null = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null

  /**
   * Initialize audio context and setup recording pipeline
   */
  async initialize(): Promise<void> {
    try {
      // Request microphone access with optimal constraints
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1, // Mono
          sampleRate: 16000, // 16kHz for speech
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleSize: 16,
        },
      })

      // Create audio context with target sample rate
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.sampleRate,
      })

      // Create source node from microphone stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream)

      // Create script processor for raw audio access (4096 samples buffer)
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1)

      // Clear any previous chunks
      this.audioChunks = []
    } catch (error) {
      console.error("Failed to initialize audio:", error)
      throw new Error("Microphone access denied or not available")
    }
  }

  /**
   * Start recording audio
   */
  startRecording(): void {
    if (!this.audioContext || !this.sourceNode || !this.scriptProcessor) {
      throw new Error("Audio not initialized")
    }
    this.audioChunks = []

    // Process audio data
    this.scriptProcessor.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0)
      const processedData = this.processAudioData(inputData)
      this.audioChunks.push(processedData)
    }

    // Connect the audio graph
    this.sourceNode.connect(this.scriptProcessor)
    this.scriptProcessor.connect(this.audioContext.destination)
  }

  /**
   * Process raw audio data for optimal speech recognition
   */
  private processAudioData(inputData: Float32Array): Float32Array {
    const processed = new Float32Array(inputData.length)

    // Apply basic audio processing
    for (let i = 0; i < inputData.length; i++) {
      let sample = inputData[i]

      // Apply gentle high-pass filter to remove DC offset and very low frequencies
      if (i > 0) {
        sample = sample - inputData[i - 1] * 0.95
      }

      // Normalize and limit
      sample = Math.max(-1, Math.min(1, sample * 1.5))

      processed[i] = sample
    }

    return processed
  }

  /**
   * Stop recording and return processed audio blob
   */
  async stopRecording(): Promise<Blob> {
    if (!this.scriptProcessor || !this.sourceNode) {
      throw new Error("Recording not active")
    }

    // Disconnect audio nodes
    this.sourceNode.disconnect()
    this.scriptProcessor.disconnect()
    this.scriptProcessor.onaudioprocess = null

    // Combine all audio chunks
    const totalLength = this.audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const combinedAudio = new Float32Array(totalLength)
    let offset = 0

    for (const chunk of this.audioChunks) {
      combinedAudio.set(chunk, offset)
      offset += chunk.length
    }

    // Convert to WAV format
    const wavBlob = this.createWAVBlob(combinedAudio, this.sampleRate)

    // Clean up
    this.cleanup()

    return wavBlob
  }

  /**
   * Create WAV blob from float32 audio data
   */
  private createWAVBlob(audioData: Float32Array, sampleRate: number): Blob {
    const length = audioData.length
    const arrayBuffer = new ArrayBuffer(44 + length * 2)
    const view = new DataView(arrayBuffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    // RIFF chunk
    writeString(0, "RIFF")
    view.setUint32(4, 36 + length * 2, true)
    writeString(8, "WAVE")

    // fmt chunk
    writeString(12, "fmt ")
    view.setUint32(16, 16, true) // fmt chunk size
    view.setUint16(20, 1, true) // PCM format
    view.setUint16(22, 1, true) // Mono channel
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true) // Byte rate
    view.setUint16(32, 2, true) // Block align
    view.setUint16(34, 16, true) // Bits per sample

    // data chunk
    writeString(36, "data")
    view.setUint32(40, length * 2, true)

    // Convert float samples to 16-bit PCM
    let offset = 44
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]))
      view.setInt16(offset, sample * 0x7fff, true)
      offset += 2
    }
    return new Blob([arrayBuffer], { type: "audio/wav" })
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.mediaRecorder = null
    this.scriptProcessor = null
    this.sourceNode = null
    this.audioChunks = []
  }
}

// ============================================================================
// REACT HOOK
// ============================================================================

interface UseAudioProcessorOptions {
  onTranscriptionComplete?: (text: string) => void
  onError?: (error: string) => void
}

export function useAudioProcessor(options: UseAudioProcessorOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processorRef = useRef<AudioProcessor | null>(null)

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null)

      // Initialize processor if needed
      if (!processorRef.current) {
        processorRef.current = new AudioProcessor()
      }

      await processorRef.current.initialize()
      processorRef.current.startRecording()
      setIsRecording(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start recording"
      setError(errorMsg)
      options.onError?.(errorMsg)
    }
  }, [options])

  /**
   * Stop recording and transcribe
   */
  const stopRecording = useCallback(async () => {
    if (!processorRef.current || !isRecording) return

    try {
      setIsRecording(false)
      setIsProcessing(true)

      // Get processed audio
      const audioBlob = await processorRef.current.stopRecording()

      // Create form data for API
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      // Send to transcription API
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || `Transcription failed: ${response.statusText}`)
      }

      const result = await response.json()
      const text = result.text || ""

      options.onTranscriptionComplete?.(text)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Transcription failed"
      setError(errorMsg)
      options.onError?.(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }, [isRecording, options])

  /**
   * Clean up on unmount
   */
  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.cleanup()
      processorRef.current = null
    }
  }, [])

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    cleanup,
  }
}
