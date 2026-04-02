import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

type TokenFlowVisualizationProps = {
  isActive: boolean;
  currentStep: number;
  fromToken?: string;
  toToken?: string;
  destination?: string;
};

export function TokenFlowVisualization({
  isActive,
  currentStep,
  fromToken = 'ETH',
  toToken = 'USDC',
  destination = 'Aave',
}: TokenFlowVisualizationProps) {
  if (!isActive || currentStep < 2) {
    return null;
  }

  const tokens = [
    { symbol: fromToken, color: 'from-purple-500 to-purple-600' },
    { symbol: toToken, color: 'from-blue-500 to-blue-600' },
    { symbol: destination, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="relative mb-4 flex h-16 items-center justify-center">
      <div className="relative z-10 flex items-center gap-4">
        {tokens.map((token, index) => {
          const stepActive = currentStep >= index + 2;
          const isPast = currentStep > index + 2;

          return (
            <div key={token.symbol} className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: stepActive ? 1 : 0.8,
                  opacity: stepActive ? 1 : 0.3,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.3,
                }}
                className="relative"
              >
                {stepActive && !isPast ? (
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${token.color} blur-lg`}
                  />
                ) : null}

                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${token.color} text-xs font-bold text-white shadow-lg`}
                >
                  {token.symbol}
                </div>
              </motion.div>

              {index < tokens.length - 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: currentStep > index + 2 ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{ delay: (index + 1) * 0.3 }}
                >
                  <ArrowRight
                    className={`h-5 w-5 ${
                      currentStep > index + 2
                        ? 'text-pay-fg-accent'
                        : 'text-pay-border-strong'
                    }`}
                  />
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
