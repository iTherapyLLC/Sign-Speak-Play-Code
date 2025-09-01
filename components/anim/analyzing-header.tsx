import type * as React from "react"
import { Stack, Typography } from "@mui/material"
import { ConversationWave } from "./conversation-wave"
import { SpeechBubbles } from "./speech-bubbles"

export const AnalyzingHeader: React.FC<{ title?: string }> = ({ title = "Analyzing communication context" }) => {
  return (
    <Stack spacing={1.25} alignItems="center">
      <ConversationWave width={260} height={110} />
      <SpeechBubbles leftLabel="Parent" rightLabel="Child" />
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {title}
      </Typography>
    </Stack>
  )
}
