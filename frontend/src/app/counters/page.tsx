"use client"

import { useState } from "react"
import MoveCounter from "@/components/MoveCounter"
import EVMCounter from "@/components/EVMCounter"
import Header from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Circle, Code, Terminal, FileText, Rocket, Settings } from "lucide-react"

type Props = {}

const Counters = (props: Props) => {
  const [moveSteps, setMoveSteps] = useState({
    install: false,
    env: false,
    checkFile: false,
    compile: false,
    deploy: false,
  })

  const [evmSteps, setEvmSteps] = useState({
    install: false,
    env: false,
    checkFile: false,
    compile: false,
    deploy: false,
    address: false,
  })

  const updateMoveStep = (step: keyof typeof moveSteps) => {
    setMoveSteps((prev) => ({ ...prev, [step]: !prev[step] }))
  }

  const updateEvmStep = (step: keyof typeof evmSteps) => {
    setEvmSteps((prev) => ({ ...prev, [step]: !prev[step] }))
  }

  const moveStepsCompleted = Object.values(moveSteps).filter(Boolean).length
  const evmStepsCompleted = Object.values(evmSteps).filter(Boolean).length
  const totalMoveSteps = Object.keys(moveSteps).length
  const totalEvmSteps = Object.keys(evmSteps).length

  const allMoveStepsComplete = moveStepsCompleted === totalMoveSteps
  const allEvmStepsComplete = evmStepsCompleted === totalEvmSteps

  const allMoveSelected = moveStepsCompleted === totalMoveSteps;
const allEvmSelected  = evmStepsCompleted  === totalEvmSteps;

// --- new toggle handlers ---
const toggleAllMove = () =>
  setMoveSteps((prev) =>
    Object.fromEntries(Object.keys(prev).map((k) => [k, !allMoveSelected])) as typeof prev
  );

const toggleAllEvm = () =>
  setEvmSteps((prev) =>
    Object.fromEntries(Object.keys(prev).map((k) => [k, !allEvmSelected])) as typeof prev
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2 sm:mb-4">
            Smart Contract Counters
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg px-2">
            Deploy and interact with Move and EVM smart contracts on Umi
          </p>
        </div>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 max-w-7xl mx-auto">
          {/* Move Counter Section */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-0 flex gap-2 flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-black dark:text-white flex items-center space-x-2 text-lg sm:text-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">🦀</span>
                    </div>
                    <span>Move Counter Setup</span>
                  </CardTitle>
                  <div className="flex items-center flex-row gap-">
                    <Badge className="flex bg-secondary flew-row gap-2 items-center">
                      <Checkbox
                        checked={allMoveSelected}
                        onCheckedChange={toggleAllMove}
                        className="cursor-pointer flex-shrink-0"
                      />
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className=" font-medium text-black dark:text-white text-xs">
                        Select all
                      </span>
                    </Badge>
                    <Badge variant={allMoveStepsComplete ? "default" : "secondary"} className="text-xs">
                      {moveStepsCompleted}/{totalMoveSteps} Complete
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Follow these steps to deploy and use the Move smart contract
                </CardDescription>
              </div>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                {/* Step 0.1 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={moveSteps.install}
                    onCheckedChange={() => updateMoveStep("install")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Install Dependencies
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Install all necessary node modules in root directory for UmiCLI to work
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm install
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 0.2 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={moveSteps.env}
                    onCheckedChange={() => updateMoveStep("env")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Configure Environment
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Fill .env file in root directory with your wallet details. <br />• Private Key of you wallet.{" "}
                      <br />• Public Key of the same wallet as deployer address.
                    </p>
                    <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono overflow-x-auto">
                      <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        # 👉 Devnet burner wallet recommended
                      </div>
                      <div className="text-green-600 dark:text-green-400 break-all">PRIVATE_KEY="0xabc123…"</div>
                      <div className="text-green-600 dark:text-green-400 break-all">
                        PUBLIC_KEY_DEPLOYER_ADDR="0xYourEOA20Byte"
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 1 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={moveSteps.checkFile}
                    onCheckedChange={() => updateMoveStep("checkFile")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Review Contract Code
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Check out the Move contract file
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 break-all">
                      contracts/move/sources/Counter.move
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 2 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={moveSteps.compile}
                    onCheckedChange={() => updateMoveStep("compile")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Code className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Compile Contract
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Compile the Move smart contract
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm run compile
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 3 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={moveSteps.deploy}
                    onCheckedChange={() => updateMoveStep("deploy")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Deploy Contract
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Deploy the Move contract to Umi network
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm run deploy:move
                    </code>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                      Move can "guess" the module because modules live at the signer's address, hence you don't need to
                      specify the address in the component.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Move Counter Component */}
            <Card
              className={`transition-all duration-300 ${allMoveStepsComplete ? "border-green-500 dark:border-green-400" : "border-gray-200 dark:border-gray-700 opacity-50"}`}
            >
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-black dark:text-white flex items-center space-x-2 text-lg sm:text-xl">
                  {allMoveStepsComplete ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span>Move Counter</span>
                </CardTitle>
                {!allMoveStepsComplete && (
                  <CardDescription className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
                    Complete all setup steps above to enable the counter
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className={allMoveStepsComplete ? "" : "pointer-events-none"}>
                  <MoveCounter />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* EVM Counter Section */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="p-6 pb-0 flex gap-2 flex-col">                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-black dark:text-white flex items-center space-x-2 text-lg sm:text-xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">⚙️</span>
                    </div>
                    <span>EVM Counter Setup</span>
                  </CardTitle>
                  <div className="flex items-center flex-row gap-2">
                    <Badge className="flex bg-secondary flew-row gap-2 items-center">
                      <Checkbox
                        checked={allEvmSelected}
                        onCheckedChange={toggleAllEvm}
                        className="cursor-pointer flex-shrink-0"
                      />
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className=" font-medium text-black dark:text-white text-xs">
                        Select all
                      </span>
                    </Badge>
                    <Badge variant={allEvmStepsComplete ? "default" : "secondary"} className="text-xs">
                      {evmStepsCompleted}/{totalEvmSteps} Complete
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Follow these steps to deploy and use the EVM smart contract
                </CardDescription>
              </div>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                {/* Similar structure for EVM steps with mobile responsive classes */}
                {/* Step 0.1 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.install}
                    onCheckedChange={() => updateEvmStep("install")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Install Dependencies
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Install all necessary node modules in root directory for UmiCLI to work
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm install
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 0.2 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.env}
                    onCheckedChange={() => updateEvmStep("env")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Configure Environment
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Fill .env file in root directory with your wallet details. <br />• Private Key of you wallet.{" "}
                      <br />• Public Key of the same wallet as deployer address.
                    </p>
                    <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono overflow-x-auto">
                      <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        # 👉 Devnet burner wallet recommended
                      </div>
                      <div className="text-green-600 dark:text-green-400 break-all">PRIVATE_KEY="0xabc123…"</div>
                      <div className="text-green-600 dark:text-green-400 break-all">
                        PUBLIC_KEY_DEPLOYER_ADDR="0xYourEOA20Byte"
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 1 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.checkFile}
                    onCheckedChange={() => updateEvmStep("checkFile")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Review Contract Code
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Check out the Solidity contract file
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 break-all">
                      contracts/evm/Counter.sol
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 2 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.compile}
                    onCheckedChange={() => updateEvmStep("compile")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Code className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Compile Contract
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Compile the Solidity smart contract
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm run compile
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 3 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.deploy}
                    onCheckedChange={() => updateEvmStep("deploy")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Deploy Contract
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Deploy the EVM contract to Umi network
                    </p>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-green-600 dark:text-green-400 break-all">
                      npm run deploy:evm
                    </code>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Step 4 */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={evmSteps.address}
                    onCheckedChange={() => updateEvmStep("address")}
                    className="mt-1 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-black dark:text-white text-sm sm:text-base">
                        Set Contract Address
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enter the deployed contract address in the counter component
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                      EVM contracts get fresh addresses on each deployment as the Solidity contract is an independent
                      object created by a deploy transaction, hence you need to specify the address in the component.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EVM Counter Component */}
            <Card
              className={`transition-all duration-300 ${allEvmStepsComplete ? "border-green-500 dark:border-green-400" : "border-gray-200 dark:border-gray-700 opacity-50"}`}
            >
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-black dark:text-white flex items-center space-x-2 text-lg sm:text-xl">
                  {allEvmStepsComplete ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span>EVM Counter</span>
                </CardTitle>
                {!allEvmStepsComplete && (
                  <CardDescription className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
                    Complete all setup steps above to enable the counter
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className={allEvmStepsComplete ? "" : "pointer-events-none"}>
                  <EVMCounter />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Counters
