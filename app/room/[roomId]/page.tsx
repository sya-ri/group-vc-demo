"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {PhoneOff, SettingsIcon} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  TrackToggle,
  DisconnectButton,
  MediaDeviceSelect,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';

export default function RoomPage() {
  const { roomId } = useParams()
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

  const [isMicOn, setIsMicOn] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isScreenShare, setIsScreenShare] = useState(false)
  const [isOpenSettings, setIsOpenSettings] = useState(false)

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">接続中...</div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <h1 className="font-bold">ルーム: {roomId}</h1>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <MyVideoConference />
        </main>

        <footer className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-center gap-2 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsOpenSettings(!isOpenSettings)}>
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>デバイス設定</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <TrackToggle source={Track.Source.Microphone} onChange={(enabled) => setIsMicOn(enabled)}></TrackToggle>
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
                <Button variant="outline" size="icon">
                  <TrackToggle source={Track.Source.Camera} onChange={(enabled) => setIsVideoOn(enabled)}></TrackToggle>
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
                <Button variant="outline" size="icon">
                  <TrackToggle source={Track.Source.ScreenShare} onChange={(enabled) => setIsScreenShare(enabled)}></TrackToggle>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isScreenShare ? "画面共有を終了する" : "画面共有する"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon">
                  <DisconnectButton><PhoneOff className="h-4 w-4" /></DisconnectButton>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>通話を終了</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </footer>
        <RoomAudioRenderer />

        <Dialog open={isOpenSettings} onOpenChange={setIsOpenSettings}>
          <DialogContent>
            <DialogHeader className="border-b pb-4">
              <DialogTitle>デバイス設定</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="mic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mic">マイク</TabsTrigger>
                <TabsTrigger value="speaker">スピーカー</TabsTrigger>
                <TabsTrigger value="camera">カメラ</TabsTrigger>
              </TabsList>
              <div className="h-[300px] mt-4">
                <TabsContent value="mic" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                  <div className="flex-1 overflow-y-auto pr-4">
                    <MediaDeviceSelect kind="audioinput" className="w-full" />
                  </div>
                </TabsContent>
                <TabsContent value="speaker" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                  <div className="flex-1 overflow-y-auto pr-4">
                    <MediaDeviceSelect kind="audiooutput" className="w-full" />
                  </div>
                </TabsContent>
                <TabsContent value="camera" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                  <div className="flex-1 overflow-y-auto pr-4">
                    <MediaDeviceSelect kind="videoinput" className="w-full" />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
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
