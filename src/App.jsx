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
import ReportManagement from "./components/Admin/Report Management/ReportManagement"
import Reason from "./components/Admin/Report Management/Reason"
import Reported from "./components/User/Notification/Reported"
import AdoptionStatistics from "./components/Admin/Adoption Statistics/AdoptionStatistics"
import AdNotification from "./components/Admin/Notification/Notification"
import AdPost from "./components/Admin/Notification/Post"
import AdChat from "./components/Admin/Chat/Chat"
import AdConversation from "./components/Admin/Chat/Conversation"
import AdProfile from "./components/Admin/Profile/Profile"
import AdAdoptionApplications from "./components/Admin/Profile/AdoptionApplications"
import AdAcceptedApplication from "./components/Admin/Profile/AcceptedApplication"
import AdApplication from "./components/Admin/Profile/Application"
import AdRehomedPets from "./components/Admin/Profile/RehomedPets"
import AdNewsFeed from "./components/Admin/News Feed/NewsFeed"
import AdViewProfile from "./components/Admin/Profile/View Profile/ViewProfile"
import Verification from "./components/Admin/User Management/Verification"


function App() {
  
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

                    {/* ADMIN ROUTE */}
                    <Route element={<PrivateRoute allowedRoles={['admin', 'superadmin']} />}>
                      <Route path="/admin/*" element={<AdDashboard />} >

                        {/* PET MANAGEMENT SECTION */}
                        <Route path="pet-management" element={<PetManagement />} />
                        <Route path="pet-management/:petID" element={<AdPetInfo />} />
                        <Route path="pet-management/rehomed/:rehomedID" element={<RehomeInfo />} />

                        {/* USER MANAGEMENT SECTION */}
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="user-management/profile/:userID" element={<UserProfile />} />
                        <Route path="user-management/verification/:verifyID" element={<Verification />} />

                        {/* ADOPTION STATISTICS */}
                        <Route path="adoption-stats" element={<AdoptionStatistics />} />

                        {/* REPORT MANAGEMENT */}
                        <Route path="report-management" element={<ReportManagement />} />
                        <Route path="report-management/reason/user/:reportID" element={<Reason />} />
                        <Route path="report-management/reason/post/:reportID" element={<Reason />} />



                        {/* NOTIFICATIONS */}
                        <Route path="notification" element={<AdNotification />} />
                        <Route path="notification/post/:postID" element={<AdPost />} />

                        {/* NEWS FEED */}
                        <Route path="news-feed" element={<AdNewsFeed />} />

                        {/* CHAT */}
                        <Route path="chat" element={<AdChat />} >
                          <Route path="convo/:chatID" element={<AdConversation />} />
                        </Route>

                        {/* PROFILE */}
                        <Route path="profile" element={<AdProfile />} />

                        {/* VIEW OTHER PROFILE */}
                        <Route path="profile/:userID" element={<AdViewProfile />} />

                        <Route path="profile/applications/active" element={<AdAdoptionApplications initialTab="Active" />} />
                        <Route path="profile/applications/accepted" element={<AdAdoptionApplications initialTab="Accepted" />} />
                        <Route path="profile/applications/rejected" element={<AdAdoptionApplications initialTab="Rejected" />} />
                        <Route path="profile/applications/closed" element={<AdAdoptionApplications initialTab="Closed" />} />
                        <Route path="profile/applications/rehomed" element={<AdAdoptionApplications initialTab="Rehomed" />} />

                        {/* APPLICATIONS */}
                        <Route path="profile/applications/accepted/:applicationID" element={<AdAcceptedApplication />} />
                        <Route path="profile/applications/rehomed/:rehomedID" element={<AdRehomedPets />} />
                        <Route path="profile/applications/active/application/:applicationID" element={<AdApplication />} />
                        <Route path="profile/applications/application/:applicationID" element={<AdApplication />} />
                        <Route path="profile/applications/closed/application/:applicationID" element={<AdApplication />} />
                        <Route path="profile/applications/rejected/application/:applicationID" element={<AdApplication />} />

                      
                      </Route>
                    </Route>


                    {/* USER ROUTE */}
                    <Route element={<PrivateRoute allowedRoles={['user']} />}>
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
                        <Route path="notification/report/user/:reportID" element={<Reported />} />
                        <Route path="notification/report/post/:reportID" element={<Reported />} />

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