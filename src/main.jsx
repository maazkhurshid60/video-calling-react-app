import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'

import './global-styles/_reset.scss'
import './global-styles/_colors.scss'

import { BrowserRouter, RouterProvider } from 'react-router-dom';
// import routes from './routes/AppRoutes.jsx';

import { SocketProvider } from './context/SocketProvider.jsx'

import { store } from './store/store.js'
import { Provider } from 'react-redux';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import VideoCallingApp from './VideoCallingApp.jsx'

//Changing this line for git activity

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <SocketProvider>
            <VideoCallingApp />
          </SocketProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)


{/* <RouterProvider router={routes} /> */}
