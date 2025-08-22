import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  INTEGRATION_TYPES,
  INTEGRATION_LABELS,
  type IntegrationType,
} from '@/constants/integrations';
import { BiconomyEoa } from '@/integrations/biconomy-eoa/biconomy-eoa';
import { RelayEoa } from '@/integrations/relay-eoa/relay-eoa';

const INTEGRATION_ROUTES: Record<IntegrationType, React.ComponentType> = {
  [INTEGRATION_TYPES.RELAY_API]: () => <RelayEoa />,
  [INTEGRATION_TYPES.RELAY_PRIVY]: () => <div>Privy</div>,
  [INTEGRATION_TYPES.BICONOMY_API]: () => <BiconomyEoa />,
  [INTEGRATION_TYPES.BICONOMY_DYNAMIC]: () => <div>Biconomy</div>,
};

const integrations = Object.entries(INTEGRATION_ROUTES);
const labels = Object.entries(INTEGRATION_LABELS);

export function IntegrationRouter() {
  const [activeIntegration, setActiveIntegration] = useState<IntegrationType>(
    INTEGRATION_TYPES.BICONOMY_API,
  );

  return (
    <div>
      <Tabs
        value={activeIntegration}
        onValueChange={setActiveIntegration as (value: string) => void}
      >
        <TabsList className="mb-8 grid size-full grid-cols-2 gap-2 border-red-500 lg:grid-cols-4">
          {labels.map(([key, label]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="border-red-500 p-3 text-xs lg:text-sm"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {integrations.map(([type, Component]) => (
          <TabsContent key={type} value={type}>
            <div className="flex justify-center">
              <Component />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
