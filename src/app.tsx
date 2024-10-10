import { Router, useIsRouting } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { MetaProvider, Title } from '@solidjs/meta';
import { NavAuth } from './features/auth/NavAuth';
import { cn } from './lib/utils';
import { Toaster } from './components/ui/toast';

export default function App() {
  return (
    <MetaProvider>
      <Router
        root={(props) => {
          const navigating = useIsRouting();

          return (
            <Suspense>
              <div class="grid min-h-screen grid-rows-[auto,_minmax(0,_1fr)]">
                <Title>Office Days</Title>
                <nav class="border-b relative">
                  <div
                    class={cn(
                      'absolute hidden animate-opacity-pulse bg-primary/80 h-1.5 w-full',
                      navigating() && 'block'
                    )}
                  ></div>
                  <div class="p-2 flex w-full max-w-screen-lg mx-auto">
                    <div class="flex-grow"></div>
                    <NavAuth />
                  </div>
                </nav>
                <div class="bg-gray-50">{props.children}</div>
              </div>
            </Suspense>
          );
        }}
      >
        <FileRoutes />
      </Router>
      <Toaster />
    </MetaProvider>
  );
}
