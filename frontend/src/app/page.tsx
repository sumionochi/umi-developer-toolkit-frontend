// src/app/page.tsx
import MoveCounter from '@/components/MoveCounter';
import EVMCounter  from '@/components/EVMCounter';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
    ArrowRight,
    BookOpen,
    Droplets,
    Compass,
  } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { queryClient } from "@/components/Provider";
import { WalletControls } from '@/components/WalletControl';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <img src="./logo.png" alt="umi-logo" width={25} height={25} />
          <span className="text-primary dark:text-white text-xl font-semibold tracking-tight">
            Umi
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <WalletControls />
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="mb-16">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm">
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              Start building on Umi with NextJs and Foundry!
            </span>
          </div>
        </div>

        <div className="text-center mb-20">
          <div className="mb-8 relative">
            <div className="absolute -inset-40 w-96 h-96 mx-auto bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 blur-2xl rounded-full opacity-60" />
            <div className="relative flex items-center justify-center space-x-3">
              <img src="./logo.png" alt="umi-logo" width={70} height={70} />
              <span className="text-primary dark:text-white text-6xl font-bold tracking-tight">
                Umi
              </span>
            </div>
          </div>

          <h1 className="text-primary dark:text-white text-2xl font-semibold mb-4 tracking-tight">
            Watch this page update as you edit src/page.tsx.
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Connect your wallet to unlock a not-so-secret page where you can
            <br />
            start interacting with smart contracts right away :
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-3 gap-6
            max-w-6xl w-full
            [grid-auto-rows:1fr]
          "
        >
          {[
            {
              href: "https://docs.uminetwork.com/",
              Icon: BookOpen,
              title: "Docs",
              desc: "Find in-depth information about Umi.",
            },
            {
              href: "https://faucet.uminetwork.com/",
              Icon: Droplets,
              title: "Faucet",
              desc: "Receive free tokens on the Umi Devnet to start exploring and testing.",
            },
            {
              href: "https://uminetwork.com/",
              Icon: Compass,
              title: "Explore",
              desc: "Learn more about the Umi ecosystem",
            },
          ].map(({ href, Icon, title, desc }) => (
            <Link key={title} href={href} target="_blank" className="no-underline h-full">
              <Card className="flex flex-col h-full bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800/70 transition-colors cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary dark:text-white flex items-center space-x-2 font-semibold tracking-tight">
                      <Icon className="w-5 h-5" />
                      <span>{title}</span>
                    </CardTitle>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                    {desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}