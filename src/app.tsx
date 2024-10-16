import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { MetaProvider } from '@solidjs/meta';
import { Toaster } from './components/ui/toast';
import { AppBackground } from './components/Layout/AppBackground';
import { AppTitle } from './components/AppTitle';
import { Navbar } from './features/nav/Navbar';

export default function App() {
  return (
    <MetaProvider>
      <AppTitle />
      <Router
        root={(props) => {
          return (
            <Suspense>
              <div class="grid min-h-screen grid-rows-[auto,_minmax(0,_1fr)]">
                <Navbar />
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
