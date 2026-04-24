import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  PAY_ACTION_LOGOS,
  type PayDemoActionType,
} from '@/constants/pay-action-assets';
import { cn } from '@/lib/utils';

export type { PayDemoActionType };

type ActionSelectorProps = {
  selectedAction: PayDemoActionType;
  onSelectAction: (action: PayDemoActionType) => void;
  disabled?: boolean;
};

const actions: {
  id: PayDemoActionType;
  title: string;
  description: string;
}[] = [
  {
    id: 'aave',
    title: 'Deposit to Aave',
    description: 'Supply assets to Aave lending protocol',
  },
  {
    id: 'hyperliquid',
    title: 'Fund Hyperliquid account',
    description: 'Deposit funds to your Hyperliquid trading account',
  },
  {
    id: 'polymarket',
    title: 'Fund Polymarket account',
    description: 'Add funds to your Polymarket prediction account',
  },
];

export function ActionSelector({
  selectedAction,
  onSelectAction,
  disabled,
}: ActionSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="mb-3 text-sm text-pay-fg-muted">
        Select an action to demo
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {actions.map((action) => {
          const isSelected = selectedAction === action.id;
          const isInteractive = disabled !== true;
          const { src: logoSrc, label: logoLabel } =
            PAY_ACTION_LOGOS[action.id];

          return (
            <motion.div
              key={action.id}
              whileHover={isInteractive ? { scale: 1.02 } : undefined}
              whileTap={isInteractive ? { scale: 0.98 } : undefined}
              className="w-full"
            >
              <Button
                type="button"
                variant="payAction"
                size="payTile"
                disabled={disabled}
                className={cn(
                  isSelected &&
                    'border-pay-accent bg-pay-accent/10 hover:border-pay-accent hover:bg-pay-accent/15',
                )}
                onClick={() => {
                  if (isInteractive) {
                    onSelectAction(action.id);
                  }
                }}
              >
                <img
                  src={logoSrc}
                  alt={logoLabel}
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-md object-contain"
                />
                <div className="min-w-0 flex-1 text-left">
                  <h4
                    className={cn(
                      'mb-1 text-sm',
                      isSelected ? 'text-pay-fg-accent' : 'text-pay-fg',
                    )}
                  >
                    {action.title}
                  </h4>
                  <p className="text-xs text-pay-fg-subtle">
                    {action.description}
                  </p>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
