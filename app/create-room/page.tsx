"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateRoom = async () => {
    setIsCreating(true)

    // 実際のアプリでは、ここでAPIを呼び出してルームを作成します
    // この例では、ランダムなルームIDを生成しています
    setTimeout(() => {
      const generatedRoomId = Math.random().toString(36).substring(2, 10)
      setRoomId(generatedRoomId)
      setIsCreated(true)
      setIsCreating(false)
    }, 1000)
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    toast({
      title: "コピーしました",
      description: "ルームIDがクリップボードにコピーされました",
    })
  }

  const joinRoom = () => {
    router.push(`/room/${roomId}`)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>新しいルームを作成</CardTitle>
          <CardDescription>ビデオ通話ルームを作成して、友達や同僚を招待しましょう。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCreated ? (
              <div className="space-y-2">
                <Label htmlFor="room-name">ルーム名（任意）</Label>
                <Input
                    id="room-name"
                    placeholder="ミーティング名を入力"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                <p className="text-sm font-medium mb-1">ルームID</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded border dark:bg-gray-950">{roomId}</code>
                  <Button size="icon" variant="outline" onClick={copyRoomId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                  このIDを共有して、他の人をルームに招待できます
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isCreated ? (
            <Button className="w-full" onClick={handleCreateRoom} disabled={isCreating}>
              {isCreating ? "作成中..." : "ルームを作成"}
            </Button>
          ) : (
            <Button className="w-full" onClick={joinRoom}>
              ルームに入室
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
