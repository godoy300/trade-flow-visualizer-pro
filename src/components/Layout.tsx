
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "./Dashboard";
import TradeCalculator from "./TradeCalculator";
import TradeHistory from "./TradeHistory";
import GoalsTracker from "./GoalsTracker";
import { TradeProvider } from "@/context/TradeContext";

const Layout = () => {
  return (
    <TradeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground animate-fade-in">
        <header className="border-b border-border bg-card py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Crypto Trade Analytics</h1>
            <span className="text-muted-foreground">Dashboard v1.0</span>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="calculator">Trade Calculator</TabsTrigger>
              <TabsTrigger value="history">Trade History</TabsTrigger>
              <TabsTrigger value="goals">Goals Tracker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="calculator">
              <TradeCalculator />
            </TabsContent>
            
            <TabsContent value="history">
              <TradeHistory />
            </TabsContent>
            
            <TabsContent value="goals">
              <GoalsTracker />
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="border-t border-border bg-card py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Crypto Trade Analytics Dashboard</p>
          </div>
        </footer>
      </div>
    </TradeProvider>
  );
};

export default Layout;
