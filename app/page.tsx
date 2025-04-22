import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-xl font-bold">GroupVC</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            機能
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            料金
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            サポート
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    シンプルなグループビデオ通話
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    友達や同僚と簡単につながりましょう。アカウント登録不要で、すぐに始められます。
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/create-room">
                    <Button size="lg" className="w-full">
                      新しいルームを作成
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/join-room">
                    <Button size="lg" variant="outline" className="w-full">
                      ルームに参加
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                alt="ビデオ通話の様子"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="/diverse-group-video-call.png"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">主な機能</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  GroupVCは、シンプルで使いやすいビデオ通話アプリです。
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">高品質ビデオ</h3>
                <p className="text-gray-500 dark:text-gray-400">クリアな映像と音声で、快適な通話体験を提供します。</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">最大20人</h3>
                <p className="text-gray-500 dark:text-gray-400">一度に最大20人までのグループ通話に対応しています。</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">画面共有</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  プレゼンテーションやコラボレーションに便利な画面共有機能。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 GroupVC. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            利用規約
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            プライバシーポリシー
          </Link>
        </nav>
      </footer>
    </div>
  )
}
