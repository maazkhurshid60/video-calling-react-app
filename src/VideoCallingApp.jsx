import { Routes, Route } from 'react-router-dom'
// import './VideoCallingApp.scss'

import { 
  LoginPage, 
  ForgotPasswordPage, 
  VerifyOTPPage, 
  ResetPasswordPage, 
  PasswordChangedSuccessfullyPage,
  DashboardLayout,
  DashboardPage,
  IncomingCallsPage,
  ProfilePage,
  CreateUserPage,
  CallRoomPage,
  ErrorBounday
} from '../src/pages';

import { AuthLayout } from './components/index'
import App from './App';

function VideoCallingApp() {

  return (
    <>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/verify-otp' element={<VerifyOTPPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/password-changed' element={<PasswordChangedSuccessfullyPage />} />
        <Route path='/dashboard' element={ <AuthLayout path={'/dashboard/home'} ><DashboardLayout /></AuthLayout> }>
          <Route path='/dashboard/home' element={ <AuthLayout path={'/dashboard/home'} ><DashboardPage /></AuthLayout> } />
          <Route path='/dashboard/incoming-calls' element={ <AuthLayout path={'/dashboard/incoming-calls'}><IncomingCallsPage /></AuthLayout> } />
          <Route path='/dashboard/profile' element={ <AuthLayout path={'/dashboard/profile'}><ProfilePage /></AuthLayout> } />
          <Route path='/dashboard/create-user' element={ <AuthLayout path={'/dashboard/create-user'}><CreateUserPage /></AuthLayout> } />
        </Route>
        <Route path='/dashboard/call-room/:roomId' element={ <AuthLayout path={'/dashboard/call-room/:roomId'}> <CallRoomPage /> </AuthLayout> } />
        <Route path='*' element={<ErrorBounday />} />
      </Routes>
    </>
  )
}

export default VideoCallingApp