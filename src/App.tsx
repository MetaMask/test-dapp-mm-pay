import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <ModeToggle />
          </div>
          <div className="flex flex-col items-center space-y-8">
            <h1 className="text-4xl font-bold text-center">
              MetaMask Pay DApp
            </h1>

            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Welcome to MetaMask Pay</CardTitle>
                <CardDescription>
                  A modern payment solution built with React, TypeScript, and
                  shadcn/ui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Button className="w-full">Connect Wallet</Button>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
