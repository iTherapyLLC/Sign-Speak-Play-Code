"use client"

import type React from "react"
import {
  Apple,
  HandMetal,
  CheckCircle,
  Hand,
  Gift,
  ArrowRight,
  Megaphone,
  Eye,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  Lightbulb,
  Heading as Waving,
  Handshake,
  PartyPopper,
  Target,
} from "lucide-react"

interface TeachingStepsComicProps {
  word: string
}

export const TeachingStepsComic: React.FC<TeachingStepsComicProps> = ({ word }) => {
  const WORD_FUNCTIONS = {
    // REQUESTS
    want: "request",
    more: "request",
    help: "request",
    eat: "request",
    drink: "request",
    go: "request",
    play: "request",
    up: "request",
    open: "request",
    give: "request",
    please: "request",
    bathroom: "request",

    // REFUSALS
    no: "refusal",
    "don't want": "refusal",
    "don't like": "refusal",
    stop: "refusal",
    "all done": "refusal",
    finished: "refusal",
    away: "refusal",
    yucky: "refusal",

    // COMMANDS
    come: "command",
    sit: "command",
    wait: "command",
    look: "command",

    // COMMENTS
    like: "comment",
    happy: "comment",
    sad: "comment",
    mad: "comment",
    sick: "comment",
    hurt: "comment",
    hot: "comment",
    cold: "comment",
    good: "comment",
    bad: "comment",
    fun: "comment",
    pretty: "comment",

    // QUESTIONS
    what: "question",
    where: "question",
    who: "question",
    why: "question",

    // SOCIAL
    hello: "social",
    hi: "social",
    bye: "social",
    "thank you": "social",

    // AFFIRMATIONS
    yes: "affirmation",
    okay: "affirmation",
  }

  const wordLower = word.toLowerCase()
  const socialFunction = WORD_FUNCTIONS[wordLower] || "comment"

  const functionStrategies = {
    refusal: [
      {
        title: "Offer to Refuse",
        description: "Present non-preferred item",
        icon: <Apple className="w-8 h-8 text-red-600" />,
        color: "bg-red-100 border-red-300",
      },
      {
        title: "Model Refusal",
        description: `Show "${word}" + head shake`,
        icon: <HandMetal className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Honor Immediately",
        description: "Remove item instantly",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    request: [
      {
        title: "Create Want",
        description: "Show desired item, wait",
        icon: <Target className="w-8 h-8 text-blue-600" />,
        color: "bg-blue-100 border-blue-300",
      },
      {
        title: "Model Request",
        description: `Sign "${word}" while reaching`,
        icon: <Hand className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Give Quickly",
        description: "Provide after any attempt",
        icon: <Gift className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    command: [
      {
        title: "Wait for Direction",
        description: "Let child lead you",
        icon: <ArrowRight className="w-8 h-8 text-purple-600" />,
        color: "bg-purple-100 border-purple-300",
      },
      {
        title: "Model Command",
        description: `Show "${word}" sign`,
        icon: <Megaphone className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Follow Command",
        description: "Do what they direct",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    comment: [
      {
        title: "Share Moment",
        description: "Notice something together",
        icon: <Eye className="w-8 h-8 text-blue-600" />,
        color: "bg-blue-100 border-blue-300",
      },
      {
        title: "Model Comment",
        description: `Sign "${word}" naturally`,
        icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Acknowledge",
        description: "Respond to attempts",
        icon: <ThumbsUp className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    question: [
      {
        title: "Create Curiosity",
        description: "Set up question opportunity",
        icon: <HelpCircle className="w-8 h-8 text-yellow-600" />,
        color: "bg-yellow-100 border-yellow-300",
      },
      {
        title: "Model Question",
        description: `Show "${word}" sign`,
        icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Answer After Sign",
        description: "Respond to any attempt",
        icon: <Lightbulb className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    social: [
      {
        title: "Social Moment",
        description: "Greetings, transitions",
        icon: <Waving className="w-8 h-8 text-pink-600" />,
        color: "bg-pink-100 border-pink-300",
      },
      {
        title: "Model Routine",
        description: `Use "${word}" consistently`,
        icon: <Handshake className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Celebrate Use",
        description: "Make it fun and natural",
        icon: <PartyPopper className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
    affirmation: [
      {
        title: "Ask Yes/No",
        description: "Create choice moments",
        icon: <HelpCircle className="w-8 h-8 text-indigo-600" />,
        color: "bg-indigo-100 border-indigo-300",
      },
      {
        title: "Model Agreement",
        description: `Show "${word}" with nod`,
        icon: <ThumbsUp className="w-8 h-8 text-orange-600" />,
        color: "bg-orange-100 border-orange-300",
      },
      {
        title: "Accept Any Yes",
        description: "Honor head nods too",
        icon: <CheckCircle className="w-8 h-8 text-green-600" />,
        color: "bg-green-100 border-green-300",
      },
    ],
  }

  const steps = functionStrategies[socialFunction] || functionStrategies["comment"]

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-center text-gray-800 mb-4">3-Step Teaching Process for "{word}"</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, index) => (
          <div key={index} className={`${step.color} border-2 rounded-lg p-4 text-center`}>
            <div className="flex justify-center mb-3">{step.icon}</div>
            <h5 className="font-bold text-sm mb-2">
              Step {index + 1}: {step.title}
            </h5>
            <p className="text-xs text-gray-700 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium text-center">
          <Lightbulb className="w-4 h-4 inline mr-1" />
          Remember: Any attempt counts as success! Accept approximations to encourage communication.
        </p>
      </div>
    </div>
  )
}
