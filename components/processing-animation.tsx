import { Mic } from "lucide-react"

export default function ProcessingAnimation() {
  return (
    <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center h-24 w-24">
        <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping" />
        <div className="relative flex items-center justify-center h-20 w-20 bg-purple-500 rounded-full text-white shadow-lg">
          <Mic className="w-10 h-10" />
        </div>
      </div>

      <div className="flex items-end justify-center space-x-2 h-12">
        <div className="w-3 bg-purple-400 animate-sound-wave rounded-full" style={{ animationDelay: "0s" }} />
        <div className="w-3 bg-purple-400 animate-sound-wave rounded-full" style={{ animationDelay: "0.1s" }} />
        <div className="w-3 bg-purple-400 animate-sound-wave rounded-full" style={{ animationDelay: "0.2s" }} />
        <div className="w-3 bg-purple-400 animate-sound-wave rounded-full" style={{ animationDelay: "0.3s" }} />
        <div className="w-3 bg-purple-400 animate-sound-wave rounded-full" style={{ animationDelay: "0.4s" }} />
      </div>

      <div>
        <p className="mt-4 text-xl text-gray-700 font-bold">Turning sounds into signs...</p>
        <p className="text-md text-gray-500">Listening carefully!</p>
      </div>
    </div>
  )
}
