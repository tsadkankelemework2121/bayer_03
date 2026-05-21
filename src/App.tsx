import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardContent } from './components/DashboardContent';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-page)' }}>
        <DashboardContent />
      </div>
    </QueryClientProvider>
  );
}

export default App;
