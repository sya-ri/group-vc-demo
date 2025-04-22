"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function JoinRoomPage() {
  const [roomId, setRoomId] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [enableVideo, setEnableVideo] = useState(true)
  const router = useRouter()

  const handleJoinRoom = () => {
    if (!roomId.trim()) return

    setIsJoining(true)
    router.push(`/room/${roomId}?video=${enableVideo}`)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ルームに参加</CardTitle>
          <CardDescription>ルームIDを入力して、ビデオ通話に参加しましょう。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-id">ルームID</Label>
            <Input
              id="room-id"
              placeholder="ルームIDを入力"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="video-mode" checked={enableVideo} onCheckedChange={setEnableVideo} />
            <Label htmlFor="video-mode">ビデオを有効にする</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleJoinRoom} disabled={isJoining || !roomId.trim()}>
            {isJoining ? "参加中..." : "ルームに参加"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
