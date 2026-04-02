import { motion } from 'motion/react';

type ComingSoonActionPanelProps = {
  actionTitle: string;
};

export function ComingSoonActionPanel({
  actionTitle,
}: ComingSoonActionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-pay-border bg-pay-surface p-10 text-center shadow-xl"
    >
      <p className="text-lg text-pay-fg">{actionTitle}</p>
      <p className="mt-2 text-sm text-pay-fg-subtle">
        This demo flow is not wired up yet. Select Aave to try MetaMask Pay.
      </p>
    </motion.div>
  );
}
