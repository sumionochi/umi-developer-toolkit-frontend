"use client"
import { useRef } from "react"
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
    const handleMount: OnMount = (ed, m) => {
    monacoRef.current = m
    ed.updateOptions({ fontSize: 14, minimap: { enabled: false } })
  }
  return (
    <Editor
      theme="vs-dark"
      height="100%"
      defaultLanguage={language}
      defaultValue={code}
      onChange={v => onChange(v ?? "")}
      onMount={handleMount}
    />
  )
}
