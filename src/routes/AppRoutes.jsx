import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
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
    CreateUserPage
} from '../pages';

import { AuthLayout } from '../components';

const routes = createBrowserRouter(
    createRoutesFromElements([
        <Route >
            <Route path='/login' element={<LoginPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/verify-otp' element={<VerifyOTPPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route path='/password-changed' element={<PasswordChangedSuccessfullyPage />} />
        </Route>,
        <Route path='/' element={  <DashboardLayout /> }>
            <Route path='' element={<DashboardPage />} />
            <Route path='/incoming-calls' element={<IncomingCallsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/create-user' element={<CreateUserPage />} />
        </Route>
    ])
);

export default routes;