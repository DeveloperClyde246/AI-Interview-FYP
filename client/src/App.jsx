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
//candidate
import CreateInterview from "./pages/recruiter/CreateInterview";
import CandidateFAQ from "./pages/candidate/CandidateFAQ";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateInterviews from "./pages/candidate/CandidateInterviews"; 
import CandidateNotificationDetails from "./pages/candidate/CandidateNotificationDetails";
import CandidateAnswer from "./pages/candidate/CandidateAnswer";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateInterviewDetails from "./pages/candidate/CandidateInterviewDetails";
import CandidateInterviewResults from "./pages/candidate/CandidateInterviewResults";

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

        {/* candidate */}
        <Route path="/candidate/faq" element={<CandidateFAQ />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/interviews" element={<CandidateInterviews />} /> 
        <Route path="/candidate/notifications/:id" element={<CandidateNotificationDetails />} />
        <Route path="/candidate/interview/:id" element={<CandidateAnswer />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/interview-details/:id" element={<CandidateInterviewDetails />} />
        <Route path="/candidate/interview/:id/results" element={<CandidateInterviewResults />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
