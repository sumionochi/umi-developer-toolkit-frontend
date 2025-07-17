"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import Editor, { OnMount } from "@monaco-editor/react"
import type * as monaco from "monaco-editor"

export default function CodeEditor({
  language,
  code,
  onChange,
}: {
  language: "solidity" | "move"
  code: string
  onChange: (v: string) => void
}) {
  const monacoRef = useRef<typeof monaco | null>(null)
  const { theme } = useTheme()

  const handleMount: OnMount = (editor, monacoInstance) => {
    monacoRef.current = monacoInstance
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true, 
    })
  }

  return (
    <div className="flex-1">
      <Editor
      height="100%"
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      language={language}
      value={code}
      onChange={(value) => onChange(value ?? "")}
      onMount={handleMount}
      options={{
        scrollBeyondLastLine: false,
        padding: {
          top: 16,
        },
      }}
    />
    </div>
  )
}