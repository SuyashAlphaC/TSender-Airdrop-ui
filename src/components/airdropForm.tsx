"use client"

import { useState, useMemo, useEffect } from "react"
import { RiAlertFill, RiInformationLine, RiShieldCheckLine, RiRocketLine, RiFlaskLine } from "react-icons/ri"
import { HiSparkles, HiLightningBolt } from "react-icons/hi"
import { FaEthereum, FaCoins } from "react-icons/fa"
import {
    useChainId,
    useWriteContract,
    useAccount,
    useWaitForTransactionReceipt,
    useReadContracts,
} from "wagmi"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../constants"
import { readContract } from "@wagmi/core"
import { useConfig } from "wagmi"
import { CgSpinner } from "react-icons/cg"
import { calculateTotal, formatTokenAmount } from "@/utils"
import InputField from "./ui/inputField"
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs"
import { waitForTransactionReceipt } from "@wagmi/core"
import { parseUnits } from "viem"

interface AirdropFormProps {
    isUnsafeMode: boolean
    onModeChange: (unsafe: boolean) => void
}

export default function AirdropForm({ isUnsafeMode, onModeChange }: AirdropFormProps) {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const [isHovered, setIsHovered] = useState(false)
    const [sparkleAnimation, setSparkleAnimation] = useState(0)
    const config = useConfig()
    const account = useAccount()
    const chainId = useChainId()

    // Only fetch token data if we have a valid token address
    const { data: tokenData } = useReadContracts({
        contracts: tokenAddress && tokenAddress.length === 42 ? [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ] : undefined,
    })

    const [hasEnoughTokens, setHasEnoughTokens] = useState(true)

    const { data: hash, isPending, error, writeContractAsync } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    const total: bigint = useMemo(() => {
        try {
            return BigInt(calculateTotal(amounts))
        } catch {
            return BigInt(0)
        }
    }, [amounts])

    // Animation effects
    useEffect(() => {
        const interval = setInterval(() => {
            setSparkleAnimation(prev => (prev + 1) % 4)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    async function handleSubmit() {
        console.log('handleSubmit called!')

        if (!account.address) {
            alert('Please connect your wallet first')
            return
        }

        // Validation checks
        if (!tokenAddress || tokenAddress.length !== 42) {
            alert('Please enter a valid token address')
            return
        }

        if (!recipients.trim()) {
            alert('Please enter recipient addresses')
            return
        }

        if (!amounts.trim()) {
            alert('Please enter amounts')
            return
        }

        if (total <= 0n) {
            alert('Total amount must be greater than 0')
            return
        }

        try {
            const contractType = isUnsafeMode ? "no_check" : "tsender"
            const tSenderAddress = chainsToTSender[chainId]?.[contractType]

            console.log('Contract details:', { contractType, tSenderAddress, chainId })

            if (!tSenderAddress) {
                alert("TSender contract not available for this chain!")
                return
            }

            // Parse recipients and amounts
            const recipientList = recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== '')
            const amountList = amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== '')

            console.log('Parsed data:', { recipientList, amountList })

            if (recipientList.length !== amountList.length) {
                alert('Number of recipients must match number of amounts')
                return
            }

            // Convert amounts to BigInt array
            const amountBigIntList = amountList.map(amt => {
                try {
                    return BigInt(amt)
                } catch {
                    throw new Error(`Invalid amount: ${amt}`)
                }
            })

            // Check current approval
            const currentApproval = await getApprovedAmount(tSenderAddress)
            console.log('Current approval:', currentApproval.toString(), 'Required:', total.toString())

            // If approval is insufficient, request approval first
            if (currentApproval < total) {
                console.log('Need approval first')
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, total],
                })

                console.log('Approval transaction sent:', approvalHash)

                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approvalHash,
                })

                console.log("Approval confirmed:", approvalReceipt)
            }

            console.log('Sending airdrop transaction...')
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress as `0x${string}`,
                    recipientList as `0x${string}`[],
                    amountBigIntList,
                    total,
                ],
            })

        } catch (error) {
            console.error('Transaction failed:', error)
            alert(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async function getApprovedAmount(tSenderAddress: string): Promise<bigint> {
        if (!account.address) {
            return BigInt(0)
        }

        try {
            const response = await readContract(config, {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "allowance",
                args: [account.address, tSenderAddress as `0x${string}`],
            })
            return response as bigint
        } catch (error) {
            console.error('Error getting approved amount:', error)
            return BigInt(0)
        }
    }

    function getButtonContent() {
        if (isPending)
            return (
                <div className="flex items-center justify-center gap-3 w-full">
                    <CgSpinner className="animate-spin text-xl" />
                    <span className="font-medium">Confirming in wallet...</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            )
        if (isConfirming)
            return (
                <div className="flex items-center justify-center gap-3 w-full">
                    <CgSpinner className="animate-spin text-xl" />
                    <span className="font-medium">Processing transaction...</span>
                    <HiLightningBolt className="text-yellow-300 animate-pulse" />
                </div>
            )
        if (error || isError) {
            console.log(error)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <RiAlertFill className="text-red-300" />
                    <span>Transaction failed - check console</span>
                </div>
            )
        }
        if (isConfirmed) {
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <RiShieldCheckLine className="text-green-300" />
                    <span>Transaction confirmed successfully!</span>
                    <HiSparkles className="text-yellow-300 animate-bounce" />
                </div>
            )
        }
        return isUnsafeMode ? (
            <div className="flex items-center justify-center gap-2">
                <RiRocketLine />
                <span>Send Tokens (Unsafe Mode)</span>
                <RiFlaskLine className="animate-pulse" />
            </div>
        ) : (
            <div className="flex items-center justify-center gap-2">
                <RiShieldCheckLine />
                <span>Send Tokens Safely</span>
                <HiSparkles className={sparkleAnimation === 0 ? "animate-bounce" : ""} />
            </div>
        )
    }

    useEffect(() => {
        const savedTokenAddress = localStorage.getItem('tokenAddress')
        const savedRecipients = localStorage.getItem('recipients')
        const savedAmounts = localStorage.getItem('amounts')

        if (savedTokenAddress) setTokenAddress(savedTokenAddress)
        if (savedRecipients) setRecipients(savedRecipients)
        if (savedAmounts) setAmounts(savedAmounts)
    }, [])

    useEffect(() => {
        localStorage.setItem('tokenAddress', tokenAddress)
    }, [tokenAddress])

    useEffect(() => {
        localStorage.setItem('recipients', recipients)
    }, [recipients])

    useEffect(() => {
        localStorage.setItem('amounts', amounts)
    }, [amounts])

    useEffect(() => {
        if (tokenAddress && total > 0n && tokenData?.[2]?.result !== undefined) {
            const userBalance = tokenData[2].result as bigint;
            setHasEnoughTokens(userBalance >= total);
        } else {
            setHasEnoughTokens(true);
        }
    }, [tokenAddress, total, tokenData]);

    return (
        <div className="max-w-2xl min-w-full xl:min-w-lg w-full lg:mx-auto relative">
            {/* Animated background glow */}
            <div className={`absolute inset-0 rounded-3xl blur-2xl transition-all duration-1000 ${isUnsafeMode
                ? 'bg-gradient-to-r from-red-500/20 via-orange-500/20 to-pink-500/20'
                : 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20'
                } animate-pulse`}></div>

            <div
                className={`relative p-8 flex flex-col gap-8 backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border-2 transition-all duration-500 ${isUnsafeMode
                    ? "border-red-300 shadow-red-500/20"
                    : "border-blue-300 shadow-blue-500/20"
                    } hover:shadow-3xl transform hover:scale-[1.02]`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${isUnsafeMode
                            ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
                            : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                            } backdrop-blur-sm border border-white/20`}>
                            {isUnsafeMode ? (
                                <RiRocketLine className="text-2xl text-red-600" />
                            ) : (
                                <RiShieldCheckLine className="text-2xl text-blue-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                T-Sender
                            </h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <HiLightningBolt className="w-3 h-3" />
                                Gas Optimized Airdrops
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <Tabs defaultValue={"false"}>
                            <TabsList className="bg-gray-100/80 backdrop-blur-sm border border-white/20 rounded-2xl p-1">
                                <TabsTrigger
                                    value={"false"}
                                    onClick={() => onModeChange(false)}
                                    className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                                >
                                    <RiShieldCheckLine className="w-4 h-4" />
                                    Safe Mode
                                </TabsTrigger>
                                <TabsTrigger
                                    value={"true"}
                                    onClick={() => onModeChange(true)}
                                    className="flex items-center gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
                                >
                                    <RiRocketLine className="w-4 h-4" />
                                    Unsafe Mode
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="relative">
                        <InputField
                            label="Token Address"
                            placeholder="0x..."
                            value={tokenAddress}
                            onChange={e => setTokenAddress(e.target.value)}
                        />
                        {tokenAddress && tokenAddress.length === 42 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        )}
                    </div>

                    <InputField
                        label="Recipients (comma or new line separated)"
                        placeholder="0x123..., 0x456..."
                        value={recipients}
                        onChange={e => setRecipients(e.target.value)}
                        large={true}
                    />

                    <InputField
                        label="Amounts (wei; comma or new line separated)"
                        placeholder="100, 200, 300..."
                        value={amounts}
                        onChange={e => setAmounts(e.target.value)}
                        large={true}
                    />

                    {/* Enhanced Transaction Details */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200/50 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <FaCoins className="text-yellow-500" />
                                <h3 className="text-lg font-semibold text-gray-800">Transaction Summary</h3>
                                <HiSparkles className={`text-blue-500 transition-transform duration-300 ${sparkleAnimation === 1 ? 'scale-125' : ''
                                    }`} />
                            </div>

                            <div className="grid gap-4">
                                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40">
                                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <FaEthereum className="w-4 h-4" />
                                        Token Name:
                                    </span>
                                    <span className="font-mono font-semibold text-gray-900 px-3 py-1 bg-blue-100 rounded-lg">
                                        {tokenData?.[1]?.result as string || "Loading..."}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40">
                                    <span className="text-sm font-medium text-gray-600">Total Amount (wei):</span>
                                    <span className="font-mono font-semibold text-gray-900 px-3 py-1 bg-purple-100 rounded-lg">
                                        {total.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-white/40">
                                    <span className="text-sm font-medium text-gray-600">Formatted Amount:</span>
                                    <span className="font-mono font-semibold text-gray-900 px-3 py-1 bg-green-100 rounded-lg">
                                        {formatTokenAmount(Number(total), tokenData?.[0]?.result as number)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Unsafe Mode Warning */}
                    {isUnsafeMode && (
                        <div className="relative mb-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-500 rounded-xl">
                                        <RiAlertFill size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-red-800 flex items-center gap-2">
                                            <span>Unsafe Mode Active</span>
                                            <RiFlaskLine className="animate-pulse" />
                                        </div>
                                        <p className="text-sm text-red-600 mt-1">
                                            Super gas optimized - skips safety checks
                                        </p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <RiInformationLine className="cursor-help w-6 h-6 text-red-500 hover:text-red-600 transition-colors" />
                                    <div className="absolute bottom-full right-0 mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-72 shadow-2xl">
                                        <div className="font-semibold mb-2">⚠️ Advanced Users Only</div>
                                        <p className="text-xs leading-relaxed">
                                            This mode bypasses safety checks for maximum gas efficiency.
                                            Only use if you can verify transaction calldata manually.
                                        </p>
                                        <div className="absolute top-full right-4 -translate-y-1 border-8 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Animated danger indicators */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                        </div>
                    )}

                    {/* Enhanced Submit Button */}
                    <button
                        type="button"
                        className={`group relative overflow-hidden w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-500 transform hover:scale-[1.02] ${isUnsafeMode
                            ? "bg-gradient-to-r from-red-500 via-red-600 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg shadow-red-500/30"
                            : "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                            } ${(!hasEnoughTokens && tokenAddress) || isPending || isConfirming ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl cursor-pointer"}`}
                        onClick={handleSubmit}
                        disabled={isPending || isConfirming || (!hasEnoughTokens && tokenAddress !== "")}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Animated background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                            } ${isUnsafeMode
                                ? 'bg-gradient-to-r from-red-400/20 to-orange-400/20 blur-xl'
                                : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl'
                            }`}></div>

                        {/* Button content */}
                        <div className="relative z-10">
                            {isPending || error || isConfirming || isConfirmed
                                ? getButtonContent()
                                : !hasEnoughTokens && tokenAddress
                                    ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <RiAlertFill />
                                            <span>Insufficient token balance</span>
                                        </div>
                                    )
                                    : getButtonContent()}
                        </div>

                        {/* Border highlight */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}