"use client"

import { FileText } from "lucide-react"

interface SignDescriptionProps {
  sign: string
  description: string | null
}

export default function SignDescription({ sign, description }: SignDescriptionProps) {
  return (
    <div className="w-full bg-blue-50 rounded-2xl flex flex-col justify-center items-center p-8 text-center border-2 border-blue-200">
      <FileText className="w-16 h-16 text-blue-400 mb-4" />
      <h3 className="text-2xl font-bold text-blue-800 mb-2">How to sign "{sign}"</h3>
      <p className="text-lg text-blue-700 max-w-md">{description || "No description available."}</p>
    </div>
  )
}
