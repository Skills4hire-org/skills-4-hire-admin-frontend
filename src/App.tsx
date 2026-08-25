import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import About from './pages/About'
import ApplicationProfile from './pages/ApplicationProfile'
import ApprovePayment from './pages/ApprovePayment'
import AvailableServices from './pages/AvailableServices'
import Bookings from './pages/Bookings'
import HomeLayout from './components/layouts/HomeLayout'
import CustomerOffers from './pages/CustomerOffers'
import Profile from './pages/Profile'
import Experience from './pages/Experience'
import FAQs from './pages/Faq'
import Favorites from './pages/Favorites'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'
import JobOffers from './pages/JobOffers'
import Landing from './pages/Landing'
import PersonalInfo from './pages/PersonalInfo'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProviderOverview from './pages/ProviderOverview'
import Referral from './pages/Referral'
import Rewards from './pages/Rewards'
import ServiceProviderBooking from './pages/ServiceProviderBooking'
import ServiceProviderProfile from './pages/ServiceProviderProfile'
import Services from './pages/Services'
import ServicesAroundYou from './pages/ServicesAroundYou'
import ServicesSearch from './pages/ServicesSearch'
import SignIn from './pages/Signin'
import SignUp from './pages/Signup'
import SingleService from './pages/SingleService'
import Support from './pages/Support'
import TermsAndConditions from './pages/TermsAndConditions'
import Verification from './pages/Verification'
import Wallet from './pages/Wallet'
import Withdraw from './pages/Withdraw'
import Notification from './pages/Notification'
import Layout from './components/layouts/Layout'
import Posts from './pages/Posts'
import Request from './pages/Request'
import Reviews from './pages/Reviews'
import ServiceProviderServices from './pages/ServiceProviderServices'
import ServiceProviderActivity from './pages/ServiceProviderActivity'
import ServiceProviderImageGallery from './pages/ServiceProviderImageGallery'
import IndexLayout from './components/layouts/IndexLayout'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Legal from './pages/Legal'
import About2 from './pages/About2'
import CreateOffer from './pages/CreateOffer'
import UpdateOffer from './pages/UpdateOffer'
import CreatePost from './pages/CreatePost'
import TransactionHistory from './pages/TransactionHistory'
import Chat from './pages/Chat'
import ChatWindow from './components/chats/ChatWindow'
import ConversationList from './components/chats/ConversationList'
import Search from './pages/Search'
import WithdrawVerification from './pages/WithdrawVerification'
import WithdrawSuccess from './pages/WithdrawSuccess'
import WithdrawPin from './pages/WithdrawPin'
import OnboardingRole from './pages/OnboardingRole'
import UploadPhoto from './pages/UploadPhoto'
import OnboardingGuard from './pages/OnboardingGuard'

import AdminLayout from './components/layouts/AdminLayout'
import UserManagement from './pages/admin/UserManagement'
import AdminServices from './pages/admin/AdminServices'
import SupportDisputes from './pages/admin/SupportDisputes'
import Transactions from './pages/admin/Transactions'
import Finance from './pages/admin/Finance'
import ContentModeration from './pages/admin/ContentModeration'
import Analytics from './pages/admin/Analytics'
import Overview from './pages/admin/Overview'
import Jobs from './pages/admin/Jobs'

const AdminRoute = () => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('access')

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  return <AdminLayout />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'blog/:id',
        element: <BlogPost />,
      },
      {
        path: 'legal',
        element: <Legal />,
      },
      {
        path: 'about',
        element: <About2 />,
      },
    ],
  },
  {
    path: 'sign-up',
    element: <SignUp />,
  },
  {
    path: 'sign-in',
    element: <SignIn />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'password/reset-confirm',
    element: <ResetPasswordConfirm />,
  },
  {
    path: 'verification',
    element: <Verification />,
  },
  {
    path: 'onboarding',
    element: <OnboardingRole />,
  },
  {
    path: 'onboarding/:role/upload',
    element: <UploadPhoto />,
  },
  {
    path: 'onboarding/professional/personal-information',
    element: <PersonalInfo />,
  },
  {
    path: 'onboarding/professional/experience',
    element: <Experience />,
  },
  {
    path: 'onboarding/professional/application-profile',
    element: <ApplicationProfile />,
  },
  {
    path: ':userType',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: 'home',
        element: <HomeLayout />,
        children: [ 
          {
            index: true,
            element: <Navigate to="posts" />,
          },
          {
            path: 'posts',
            element: <Posts />,
          },
          {
            path: 'my-offers',
            element: <CustomerOffers />,
          },
          {
            path: 'job-offers',
            element: <JobOffers />,
          },
        ],
      },
      {
        path: 'create-offer',
        element: <CreateOffer />,
      },
      {
        path: 'create-post',
        element: <CreatePost />,
      },
      {
        path: 'edit-offer/:id',
        element: <UpdateOffer />,
      },
      {
        path: 'overview',
        element: <ProviderOverview />,
      },
      { path: 'overview/request', element: <Request /> },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'services/available-services',
        element: <AvailableServices />,
      },
      {
        path: 'services/available-services/:service',
        element: <SingleService />,
      },
      {
        path: 'services/professionals',
        element: <ServicesAroundYou />,
      },
      {
        path: 'services/search',
        element: <ServicesSearch />,
      },
      {
        path: 'professionals/:id',
        element: <ServiceProviderProfile />,
      },
      {
        path: 'professionals/:id/:profession/services',
        element: <ServiceProviderServices />,
      },
      {
        path: 'professionals/:id/activity',
        element: <ServiceProviderActivity />,
      },
      {
        path: 'professionals/:id/gallery',
        element: <ServiceProviderImageGallery />,
      },
      {
        path: 'professionals/:id/booking',
        element: <ServiceProviderBooking />,
      },
      {
        path: 'professionals/:id/endorsers',
        element: <Endorsers />,
      },
      {
        path: 'bookings',
        element: <Bookings />,
      },
      {
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'wallet/transaction-history',
        element: <TransactionHistory />,
      },
      { path: 'wallet/approve', element: <ApprovePayment /> },
      { path: 'wallet/withdraw', element: <Withdraw /> },
      { path: 'wallet/withdraw-verify', element: <WithdrawVerification /> },
      { path: 'wallet/withdraw-pin', element: <WithdrawPin /> },
      { path: 'wallet/withdraw-success', element: <WithdrawSuccess /> },
      {
        path: 'chats',
        element: <Chat />,
        children: [
          {
            index: true,
            element: <ConversationList />,
          },
          {
            path: ':conversationId',
            element: <ChatWindow />,
          },
        ],
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
      {
        path: 'rewards',
        element: <Rewards />,
      },
      {
        path: 'support',
        element: <Support />,
      },
      {
        path: 'notification',
        element: <Notification />,
      },
      {
        path: 'referral',
        element: <Referral />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/activity',
        element: <ProfileActivity />,
      },
      {
        path: 'profile/:profession/services',
        element: <ProfileServices />,
      },
      {
        path: 'profile/gallery',
        element: <ProfileGallery />,
      },
      {
        path: 'profile/endorsed',
        element: <Endorsed />,
      },

      {
        path: 'reviews',
        element: <Reviews />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "services",
        element: <AdminServices />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "support",
        element: <SupportDisputes />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "financial",
        element: <Finance />,
      },
      {
        path: "content-moderation",
        element: <ContentModeration />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "services",
        element: <AdminServices />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "support",
        element: <SupportDisputes />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "financial",
        element: <Finance />,
      },
      {
        path: "content-moderation",
        element: <ContentModeration />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
    ],
  },
  {
    path: "terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "faq",
    element: <FAQs />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
