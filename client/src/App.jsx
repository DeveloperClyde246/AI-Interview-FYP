import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'; 

//auth
// import Users from "./pages/Users";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
//admin
import AdminDashboard from "./pages/admin/AdminDashboard";
//recruiter
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterInterviewDetails from "./pages/recruiter/RecruiterInterviewDetails";
import RecruiterInterviewResults from "./pages/recruiter/RecruiterInterviewResults";
import NotificationDetails from "./pages/recruiter/NotificationDetails";
import RecruiterCandidateDetails from "./pages/recruiter/RecruiterCandidateDetails";
import RecruiterInterviewEdit from "./pages/recruiter/RecruiterInterviewEdit";
import RecruiterManageCandidate from "./pages/recruiter/RecruiterManageCandidate";
import RecruiterProfileDetails from "./pages/recruiter/RecruiterProfileDetails";
import RecruiterEditProfile from "./pages/recruiter/RecruiterEditProfile";

//candidate
import CreateInterview from "./pages/recruiter/CreateInterview";
import CandidateFAQ from "./pages/candidate/CandidateFAQ";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateInterviews from "./pages/candidate/CandidateInterviews"; 
import CandidateNotificationDetails from "./pages/candidate/CandidateNotificationDetails";
import CandidateAnswer from "./pages/candidate/CandidateAnswer";
import CandidateProfileDetails from "./pages/candidate/CandidateProfileDetails";
import CandidateEditProfile from "./pages/candidate/CandidateEditProfile";
import CandidateInterviewDetails from "./pages/candidate/CandidateInterviewDetails";
import CandidateInterviewResults from "./pages/candidate/CandidateInterviewResults";
import CandidateChangePassword from "./pages/candidate/CandidateChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* recruiter */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
        <Route path="/recruiter/interview/:id" element={<RecruiterInterviewDetails />} />
        <Route path="/recruiter/interview-results" element={<RecruiterInterviewResults />} />
        <Route path="/recruiter/notifications/:id" element={<NotificationDetails />} />
        <Route path="/recruiter/create-interview" element={<CreateInterview />} />
        <Route path="/recruiter/candidate-details/:interviewId/:candidateId" element={<RecruiterCandidateDetails />}/>
        <Route path="/recruiter/interview/:id/edit-form" element={<RecruiterInterviewEdit />} />
        <Route path="/recruiter/interview/:id/manage-candidates" element={<RecruiterManageCandidate />} />
        <Route path="/recruiter/profile" element={<RecruiterProfileDetails />} />
        <Route path="/recruiter/profile/edit" element={<RecruiterEditProfile />} />

        {/* candidate */}
        <Route path="/candidate/faq" element={<CandidateFAQ />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/interviews" element={<CandidateInterviews />} /> 
        <Route path="/candidate/notifications/:id" element={<CandidateNotificationDetails />} />
        <Route path="/candidate/interview/:id" element={<CandidateAnswer />} />
        <Route path="/candidate/profile" element={<CandidateProfileDetails />} />
        <Route path="/candidate/profile/edit" element={<CandidateEditProfile />} />
        <Route path="/candidate/interview-details/:id" element={<CandidateInterviewDetails />} />
        <Route path="/candidate/interview/:id/results" element={<CandidateInterviewResults />} />
        <Route path="/candidate/profile/change-password" element={<CandidateChangePassword />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
