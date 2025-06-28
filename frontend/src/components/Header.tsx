import React from 'react'
import { ThemeToggle } from './ui/theme-toggle'
import { WalletControls } from './WalletControl'
import Link from 'next/link'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between p-6">
        <Link href="/" className="cursor-pointer">
            <div className="flex items-center space-x-2">
                <img src="./logo.png" alt="umi-logo" width={25} height={25} />
                <span className="text-primary dark:text-white text-xl font-semibold tracking-tight">
                Umi
                </span>
            </div>
        </Link>
    <div className="flex items-center space-x-4">
        <ThemeToggle />
        <WalletControls />
    </div>
    </header>
  )
}

export default Header