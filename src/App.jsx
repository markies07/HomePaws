import React, { useContext } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./components/Landing Page/LandingPage"
import Dashboard from "./components/User/Dashboard"
import { ToastContainer } from "react-toastify"
import { AuthContext, AuthProvider } from "./components/General/AuthProvider"
import PrivateRoute from "./components/General/PrivateRoute"
import FindPet from "./components/User/Find Pet/FindPet"
import NewsFeed from "./components/User/News Feed/NewsFeed"
import Chat from "./components/User/Chat/Chat"
import Profile from "./components/User/Profile/Profile"
import PetInfo from "./components/User/Find Pet/PetInfo"
import AdoptionForm from "./components/User/Find Pet/AdoptionForm"
import Notification from "./components/User/Notification/Notification"
import Application from "./components/User/Profile/Application"
import { UserDataProvider } from "./components/General/UserDataProvider"
import { AdoptionDataProvider } from "./components/General/AdoptionDataProvider"
import { UserPostsProvider } from "./components/General/UserPostsContext"
import { LikesAndCommentsProvider } from "./components/General/LikesAndCommentsContext"
import { ImageModalProvider } from "./components/General/ImageModalContext"
import Conversation from "./components/User/Chat/Conversation"
import Post from "./components/User/Notification/Post"
import AdoptionApplications from "./components/User/Profile/AdoptionApplications"
import AcceptedApplication from "./components/User/Profile/AcceptedApplication"
import RehomedPets from "./components/User/Profile/RehomedPets"
import ViewProfile from "./components/User/Profile/View Profile/ViewProfile"

// ADMIN IMPORTS
import AdDashboard from "./components/Admin/Admin"
import PetManagement from "./components/Admin/Pet Management/PetManagement"
import AdPetInfo from "./components/Admin/Pet Management/PetInfo"
import RehomeInfo from "./components/Admin/Pet Management/RehomeInfo"
import UserManagement from "./components/Admin/User Management/UserManagement"
import UserProfile from "./components/Admin/User Management/UserProfile"


function App() {
  // Create a new component to handle the default redirect based on user role
  const DefaultRedirect = () => {
    const { userData } = useContext(AuthContext);
    
    // Redirect based on role
    if (userData?.role === 'admin') {
      return <Navigate replace to="/admin/pet-management" />;
    }
    else if(userData?.role === 'user'){
      return <Navigate replace to="/dashboard/find-pet" />;
    }
  };
  
  return (
    <AuthProvider>
      <UserDataProvider>
        <UserPostsProvider>
          <AdoptionDataProvider>
            <LikesAndCommentsProvider>
              <ImageModalProvider>
                <Router>
                  <Routes>
                    {/* PUBLIC ROUTE */}
                    <Route path="/" element={<LandingPage />} />

                    {/* DEFAULT REDIRECT ROUTE */}
                    <Route path="/admin" element={<DefaultRedirect />} />

                    {/* ADMIN ROUTE */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/admin/*" element={<AdDashboard />} >

                        {/* PET MANAGEMENT SECTION */}
                        <Route path="pet-management" element={<PetManagement />} />
                        <Route path="pet-management/:petID" element={<AdPetInfo />} />
                        <Route path="pet-management/rehomed/:rehomedID" element={<RehomeInfo />} />

                        {/* USER MANAGEMENT SECTION */}
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="user-management/profile/:userID" element={<UserProfile />} />
                      
                      </Route>
                    </Route>


                    {/* USER ROUTE */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard/*" element={<Dashboard />}>
                        {/* FIND PET SECTION */}
                        <Route path="find-pet" element={<FindPet />} />
                        <Route path="find-pet/:petID" element={<PetInfo />} />
                        <Route path="find-pet/removed/:petID" element={<PetInfo />} />
                        <Route path="find-pet/adoption/:petID" element={<AdoptionForm />} />

                        {/* NEWS FEED SECTION */}
                        <Route path="news-feed" element={<NewsFeed />} />

                        {/* NOTIFICATION SECTION */}
                        <Route path="notification" element={<Notification />} />
                        <Route path="notification/post/:postID" element={<Post />} />

                        {/* CHAT SECTION */}
                        <Route path="chat" element={<Chat />} >
                          <Route path="convo/:chatID" element={<Conversation />} />
                        </Route>

                        {/* PROFILE SECTION */}
                        <Route path="profile" element={<Profile />} />

                        {/* VIEW OTHER PROFILE */}
                        <Route path="profile/:userID" element={<ViewProfile />} />

                        {/* APPLICATIONS */}
                        <Route path="profile/applications/active" element={<AdoptionApplications initialTab="Active" />} />
                        <Route path="profile/applications/accepted" element={<AdoptionApplications initialTab="Accepted" />} />
                        <Route path="profile/applications/rejected" element={<AdoptionApplications initialTab="Rejected" />} />
                        <Route path="profile/applications/closed" element={<AdoptionApplications initialTab="Closed" />} />
                        <Route path="profile/applications/rehomed" element={<AdoptionApplications initialTab="Rehomed" />} />

                        <Route path="profile/applications/accepted/:applicationID" element={<AcceptedApplication />} />
                        <Route path="profile/applications/rehomed/:rehomedID" element={<RehomedPets />} />
                        <Route path="profile/applications/active/application/:applicationID" element={<Application />} />
                        <Route path="profile/applications/application/:applicationID" element={<Application />} />
                        <Route path="profile/applications/closed/application/:applicationID" element={<Application />} />
                        <Route path="profile/applications/rejected/application/:applicationID" element={<Application />} />
                      </Route>
                    </Route>

                  </Routes>
                  <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                  />
                </Router>
              </ImageModalProvider>
            </LikesAndCommentsProvider>
          </AdoptionDataProvider>
        </UserPostsProvider>
      </UserDataProvider>
    </AuthProvider>
  )
}

export default App