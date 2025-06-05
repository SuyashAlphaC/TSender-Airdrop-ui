"use client"

import { useState, useEffect } from "react"
import AirdropForm from "./airdropForm"
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { RiWallet3Line, RiShieldCheckLine, RiRocketLine, RiGasStationLine, RiFlaskLine, RiArrowRightLine, RiTimeLine, RiCheckboxCircleLine, RiNewsLine, RiAlertLine } from "react-icons/ri"
import { HiSparkles, HiLightningBolt } from "react-icons/hi"
import { FaEthereum } from "react-icons/fa"
import { chainsToTSender } from "../constants"

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)
    const [floatingElements, setFloatingElements] = useState(0)
    const { isConnected, address, isConnecting } = useAccount()
    const { connect, connectors, isPending } = useConnect()
    const { disconnect } = useDisconnect()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()

    // Check if current chain is supported
    const isChainSupported = chainId && chainsToTSender[chainId]
    const supportedChains = Object.keys(chainsToTSender).map(Number)

    // Animation effect for floating elements
    useEffect(() => {
        const interval = setInterval(() => {
            setFloatingElements(prev => (prev + 1) % 6)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const handleConnectWallet = () => {
        const injectedConnector = connectors.find(connector => connector.type === 'injected')
        if (injectedConnector) {
            connect({ connector: injectedConnector })
        }
    }

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getChainName = (chainId: number) => {
        const chainNames: { [key: number]: string } = {
            1: 'Ethereum',
            137: 'Polygon',
            31337: 'Localhost',
            // Add more chains as needed
        }
        return chainNames[chainId] || `Chain ${chainId}`
    }

    if (!isConnected) {
        return (
            <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    {/* Floating particles */}
                    <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                    <div className="max-w-2xl w-full">
                        <div className="relative p-12 backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 text-center">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>

                            <div className="relative">
                                {/* Header Icon */}
                                <div className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <RiWallet3Line className="w-10 h-10 text-white" />
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Welcome to T-Sender
                                </h1>

                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    The most gas-efficient way to distribute tokens. Connect your wallet to get started with batch transfers.
                                </p>

                                {/* Features Grid */}
                                <div className="grid md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                                        <RiGasStationLine className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-800 mb-2">Gas Optimized</h3>
                                        <p className="text-sm text-gray-600">Save up to 60% on gas fees with our optimized contracts</p>
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50">
                                        <RiFlaskLine className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                                        <p className="text-sm text-gray-600">Batch hundreds of transfers in a single transaction</p>
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-200/50">
                                        <RiShieldCheckLine className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-800 mb-2">Secure & Safe</h3>
                                        <p className="text-sm text-gray-600">Built-in safety checks and validation</p>
                                    </div>
                                </div>

                                {/* Connect Button */}
                                <button
                                    onClick={handleConnectWallet}
                                    disabled={isPending || isConnecting}
                                    className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {/* Animated background overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                    <div className="relative flex items-center justify-center gap-3">
                                        {isPending || isConnecting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                <span>Connecting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <RiWallet3Line className="w-6 h-6" />
                                                <span>Connect Wallet</span>
                                                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                <p className="text-sm text-gray-500 mt-4">
                                    Supports MetaMask, WalletConnect, and other Web3 wallets
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                {/* Floating elements with dynamic animation */}
                <div className={`absolute transition-all duration-2000 ${floatingElements % 2 === 0 ? 'top-10 left-10' : 'top-16 left-16'}`}>
                    <div className="w-3 h-3 bg-blue-400/60 rounded-full animate-bounce"></div>
                </div>
                <div className={`absolute transition-all duration-2000 ${floatingElements % 3 === 0 ? 'top-32 right-24' : 'top-28 right-20'}`}>
                    <HiSparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
                <div className={`absolute transition-all duration-2000 ${floatingElements % 4 === 0 ? 'bottom-40 left-1/4' : 'bottom-44 left-1/3'}`}>
                    <HiLightningBolt className="w-3 h-3 text-yellow-400 animate-ping" />
                </div>
            </div>

            {/* Header */}
            <div className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <RiRocketLine className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    T-Sender Dashboard
                                </h1>
                                <p className="text-gray-600">Gas-optimized token distribution</p>
                            </div>
                        </div>

                        {/* Wallet Info */}
                        <div className="flex items-center gap-4">
                            {/* Chain Status */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${isChainSupported
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                <RiNewsLine className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {isChainSupported ? getChainName(chainId) : 'Unsupported Chain'}
                                </span>
                                {isChainSupported ? (
                                    <RiCheckboxCircleLine className="w-4 h-4" />
                                ) : (
                                    <RiAlertLine className="w-4 h-4" />
                                )}
                            </div>

                            {/* Wallet Address */}
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <div className="flex items-center gap-2">
                                    <FaEthereum className="w-4 h-4 text-gray-600" />
                                    <span className="font-mono text-sm text-gray-700">
                                        {address && formatAddress(address)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => disconnect()}
                                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unsupported Chain Warning */}
                    {!isChainSupported && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <RiAlertLine className="w-6 h-6 text-red-500" />
                                    <div>
                                        <h3 className="font-semibold text-red-800">Unsupported Network</h3>
                                        <p className="text-sm text-red-600">
                                            Please switch to a supported network to use T-Sender
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {supportedChains.map(chain => (
                                        <button
                                            key={chain}
                                            onClick={() => switchChain({ chainId: chain })}
                                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-lg transition-colors"
                                        >
                                            {getChainName(chain)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Mode</p>
                                    <p className="text-lg font-bold text-blue-800">
                                        {isUnsafeMode ? 'Unsafe' : 'Safe'}
                                    </p>
                                </div>
                                {isUnsafeMode ? (
                                    <RiRocketLine className="w-8 h-8 text-red-500" />
                                ) : (
                                    <RiShieldCheckLine className="w-8 h-8 text-blue-500" />
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Gas Savings</p>
                                    <p className="text-lg font-bold text-green-800">Up to 60%</p>
                                </div>
                                <RiGasStationLine className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-2xl border border-purple-200/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Status</p>
                                    <p className="text-lg font-bold text-purple-800">Ready</p>
                                </div>
                                <RiCheckboxCircleLine className="w-8 h-8 text-purple-500" />
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 font-medium">Network</p>
                                    <p className="text-lg font-bold text-orange-800">
                                        {isChainSupported ? getChainName(chainId) : 'N/A'}
                                    </p>
                                </div>
                                <RiNewsLine className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {isChainSupported ? (
                <div className="relative z-10 flex items-center justify-center p-4 md:p-6 xl:p-8">
                    <AirdropForm isUnsafeMode={isUnsafeMode} onModeChange={setIsUnsafeMode} />
                </div>
            ) : (
                <div className="relative z-10 flex items-center justify-center p-8">
                    <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                        <RiAlertLine className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Network Not Supported</h2>
                        <p className="text-gray-600 mb-6">
                            Please switch to a supported network to continue using T-Sender
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {supportedChains.map(chain => (
                                <button
                                    key={chain}
                                    onClick={() => switchChain({ chainId: chain })}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Switch to {getChainName(chain)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}