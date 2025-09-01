"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Hand, Eye } from "lucide-react"

interface SignTipProps {
  word: string
}

const SIGN_APPROXIMATIONS = {
  more: {
    perfect: "Fingertips tapping together",
    acceptable: ["Any hand-to-hand contact", "Clapping hands", "Touching palms together"],
    icon: Hand,
  },
  yes: {
    perfect: "Fist nodding up and down",
    acceptable: ["Head nodding", "Any up-down hand movement", "Thumbs up"],
    icon: CheckCircle,
  },
  no: {
    perfect: "Index and middle finger closing on thumb",
    acceptable: ["Head shaking", "Waving hand side to side", "Any side-to-side movement"],
    icon: AlertCircle,
  },
  help: {
    perfect: "Flat hand on top of fist, both moving up",
    acceptable: ["Reaching toward you", "Any upward hand movement", "Touching your arm"],
    icon: Hand,
  },
  "all done": {
    perfect: "Both hands shaking with palms down",
    acceptable: ["Pushing away", "Waving hands", "Any 'finished' gesture"],
    icon: Hand,
  },
  want: {
    perfect: "Curved hands pulling toward body",
    acceptable: ["Reaching for item", "Pointing", "Any pulling motion toward self"],
    icon: Hand,
  },
  eat: {
    perfect: "Fingertips to mouth repeatedly",
    acceptable: ["Hand to mouth", "Pretend eating motion", "Touching lips"],
    icon: Hand,
  },
  drink: {
    perfect: "Thumb to mouth like holding cup",
    acceptable: ["Hand to mouth", "Pretend drinking motion", "Tilting head back"],
    icon: Hand,
  },
}

export function SignTip({ word }: SignTipProps) {
  const tipData = SIGN_APPROXIMATIONS[word.toLowerCase() as keyof typeof SIGN_APPROXIMATIONS]

  if (!tipData) {
    // Generic tip for words not in our specific list
    return (
      <Card className="mt-4 bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Parent Tip: Accept Approximations!</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Your child doesn't need to form the perfect sign. Any attempt to communicate "{word}" counts as success!
              </p>
              <p className="text-xs text-yellow-600">
                <strong>Why this matters:</strong> Accepting approximations reduces your anxiety, prevents giving up too
                early, and accelerates your child's communication attempts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Icon = tipData.icon

  return (
    <Card className="mt-4 bg-yellow-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Parent Tip: Accept Approximations!</h4>

            <div className="space-y-3">
              <div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 mb-2">
                  Perfect Sign
                </Badge>
                <p className="text-sm text-gray-700">{tipData.perfect}</p>
              </div>

              <div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 mb-2">
                  Also Counts As "{word}"
                </Badge>
                <ul className="text-sm text-gray-700 space-y-1">
                  {tipData.acceptable.map((approximation, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {approximation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Why this matters:</strong> Accepting approximations reduces your anxiety about perfection,
                prevents giving up too early, and accelerates your child's initial success by rewarding any
                communication attempt.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
