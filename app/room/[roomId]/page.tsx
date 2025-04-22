"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';

export default function RoomPage() {
  const { roomId } = useParams()
  const searchParams = useSearchParams()
  const videoEnabled = searchParams.get("video") !== "false"
  const [token, setToken] = useState('')
  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));

  // LiveKitの接続処理
  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const resp = await fetch(`/api/token?room=${roomId}&username=user-${Math.random().toString(36).substring(7)}`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
          await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
        }
      } catch (e) {
        console.error(e);
      }
    };

    connectToRoom();

    return () => {
      roomInstance.disconnect();
    };
  }, [roomId, roomInstance]);

  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(videoEnabled)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: "1", sender: "田中さん", text: "こんにちは！", time: "14:30" },
    { id: "2", sender: "佐藤さん", text: "今日の会議の議題は何ですか？", time: "14:31" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()
  const isMobile = useMobile()

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const leaveRoom = () => {
    roomInstance.disconnect();
    window.location.href = "/"
  }

  const shareScreen = () => {
    toast({
      title: "画面共有",
      description: "この機能はデモでは利用できません",
    })
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      sender: "あなた",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">接続中...</div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 px-4 py-2 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <h1 className="font-bold">ルーム: {roomId}</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareScreen}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>画面共有</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className={`flex-1 p-4 ${isChatOpen && !isMobile ? "pr-[320px]" : ""}`}>
            <div className="h-full">
              <MyVideoConference />
            </div>
          </div>

          {isChatOpen && (
            <div className={`${isMobile ? "absolute inset-0 z-10 bg-white dark:bg-gray-900" : "w-[320px] border-l"} flex flex-col`}>
              <div className="p-3 border-b flex items-center justify-between">
                <h2 className="font-medium">チャット</h2>
                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                    閉じる
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.sender === "あなた" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">{message.sender}</span>
                      <span className="text-xs text-gray-400">{message.time}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        message.sender === "あなた" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                <Input
                  placeholder="メッセージを入力..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="sm">
                  送信
                </Button>
              </form>
            </div>
          )}
        </main>

        <footer className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-center gap-2 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={isMicOn ? "outline" : "secondary"} size="icon" onClick={toggleMic}>
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMicOn ? "マイクをオフにする" : "マイクをオンにする"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={isVideoOn ? "outline" : "secondary"} size="icon" onClick={toggleVideo}>
                  {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isVideoOn ? "カメラをオフにする" : "カメラをオンにする"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={leaveRoom}>
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>通話を終了</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isChatOpen ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isChatOpen ? "チャットを閉じる" : "チャットを開く"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </footer>
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  )
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
