import { Router, useIsRouting } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { MetaProvider } from '@solidjs/meta';
import { NavAuth } from './features/auth/NavAuth';
import { cn } from './lib/utils';
import { Toaster } from './components/ui/toast';
import { AppBackground } from './components/Layout/AppBackground';
import { AppTitle } from './components/AppTitle';

export default function App() {
  return (
    <MetaProvider>
      <AppTitle />
      <Router
        root={(props) => {
          const navigating = useIsRouting();

          return (
            <Suspense>
              <div class="grid min-h-screen grid-rows-[auto,_minmax(0,_1fr)]">
                <nav class="border-b relative bg-white/60">
                  <div
                    class={cn(
                      'absolute hidden animate-opacity-pulse bg-primary/80 h-1.5 w-full',
                      navigating() && 'block'
                    )}
                  ></div>
                  <div class="p-2 flex w-full max-w-screen-lg mx-auto">
                    <div class="flex-grow"></div>

                    <Suspense>
                      <NavAuth />
                    </Suspense>
                  </div>
                </nav>
                <AppBackground>
                  <Suspense>{props.children}</Suspense>
                </AppBackground>
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
