import { useState } from 'react';

import { IntegrationWrapper } from '@/components/integration-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  INTEGRATION_TYPES,
  INTEGRATION_LABELS,
  type IntegrationType,
} from '@/constants/integrations';

const INTEGRATION_ROUTES: Record<
  IntegrationType,
  React.ComponentType
> = {
  [INTEGRATION_TYPES.RELAY_API]: () => <IntegrationWrapper />,
  [INTEGRATION_TYPES.RELAY_PRIVY]: () => <div>Privy</div>,
  [INTEGRATION_TYPES.BICONOMY_API]: () => <div>Biconomy</div>,
  [INTEGRATION_TYPES.BICONOMY_DYNAMIC]: () => <div>Biconomy</div>,
};

const integrations = Object.entries(INTEGRATION_ROUTES);
const labels = Object.entries(INTEGRATION_LABELS);

export function IntegrationRouter() {
  const [activeIntegration, setActiveIntegration] = useState<IntegrationType>(
    INTEGRATION_TYPES.RELAY_API,
  );

  return (
    <div className="w-full">
      <Tabs
        value={activeIntegration}
        onValueChange={setActiveIntegration as (value: string) => void}
      >
        <TabsList className="grid size-full grid-cols-2 mb-8 lg:grid-cols-4 gap-2 border-red-500">
          {labels.map(([key, label]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="text-xs lg:text-sm border-red-500 p-3"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {integrations.map(([type, Component]) => (
          <TabsContent key={type} value={type}>
            <Component integrationType={type as IntegrationType} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
