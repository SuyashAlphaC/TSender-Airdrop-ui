// "use client"

// import { ConnectButton } from "@rainbow-me/rainbowkit"
// import { FaGithub } from "react-icons/fa"
// import Image from "next/image"

// export default function Header() {
//     return (
//       <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg rounded-b-xl">
//             <div className="flex items-center gap-2.5 md:gap-6">
//                 <a href="/" className="flex items-center gap-1 text-zinc-800">
//                     <Image src="tsender-ui/T-Sender.svg" alt="TSender" width={36} height={36} />
//                     <h1 className="font-bold text-2xl hidden md:block">TSender</h1>
//                 </a>
//                 <a
//                     href="https://github.com/SuyashAlphaC/TSender-Airdrop-ui"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border-2 border-zinc-600 hover:border-zinc-500 cursor-alias hidden md:block"
//                 >
//                     <FaGithub className="h-5 w-5 text-white" />
//                 </a>
//             </div>
//             <h3 className="italic text-left hidden text-black-500 lg:block">
//                 The most gas efficient airdrop contract on earth, built in huff 🐎
//             </h3>
//             <div className="flex items-center gap-4">
//                 <ConnectButton />
//             </div>
//         </nav>
//     )
// }


"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub, FaRocket } from "react-icons/fa"
import { HiSparkles } from "react-icons/hi"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [sparkleIndex, setSparkleIndex] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)

        // Sparkle animation
        const sparkleInterval = setInterval(() => {
            setSparkleIndex(prev => (prev + 1) % 3)
        }, 2000)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            clearInterval(sparkleInterval)
        }
    }, [])
    return (
        <nav className={`relative flex items-center justify-between p-4 transition-all duration-500 ${scrolled
            ? 'bg-black/90 backdrop-blur-xl shadow-2xl'
            : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900'
            } text-white shadow-lg rounded-b-3xl border-b border-white/10 overflow-hidden`}>

            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-ping"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative z-10 flex items-center gap-3 md:gap-8">
                <a href="/" className="group flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    <div className="relative p-2 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl">
                        <Image
                            src="/T-Sender.svg"
                            alt="TSender"
                            width={32}
                            height={32}
                            className="group-hover:rotate-12 transition-transform duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="font-black text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                            TSender
                        </h1>
                        <div className="flex items-center gap-1 text-xs text-blue-200/80">
                            <FaRocket className="w-3 h-3" />
                            <span>Gas Efficient</span>
                        </div>
                    </div>
                </a>

                <a
                    href="https://github.com/SuyashAlphaC/TSender-Airdrop-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-110 hidden md:block"
                >
                    <FaGithub className="h-5 w-5 text-white group-hover:text-blue-200 transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                </a>
            </div>
            <div className="relative z-10 hidden lg:block max-w-md">
                <div className="relative p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <HiSparkles className={`w-4 h-4 transition-all duration-500 ${sparkleIndex === 0 ? 'text-yellow-400 scale-125' :
                            sparkleIndex === 1 ? 'text-blue-400 scale-110' : 'text-purple-400'
                            }`} />
                        <span className="text-sm font-semibold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                            Ultra Efficient
                        </span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                        The most gas efficient airdrop contract on earth,
                        <span className="text-orange-300 font-semibold"> built in huff</span>
                        <span className="inline-block ml-1 animate-bounce">🐎</span>
                    </p>

                    {/* Floating particles */}
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="relative">
                    <ConnectButton />
                    {/* Glow effect behind connect button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
                </div>
            </div>

            {/* Subtle animated border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </nav>
    )
}
