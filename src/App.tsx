import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
// import Sidebar from "@/pages/SideBar";
import CustomerProfile from "@/pages/CustomerProfile";
import Test from "@/pages/Test";
import SignupPage from "@/pages/SignupPage";
import EmailVarfication from "@/pages/EmailVarfication";
import ComponyDetails from "@/pages/ComponyDetails";
import ForgotPassword from "@/pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="customerprofile" element={<CustomerProfile />} />
          <Route path="emailvarfication" element={<EmailVarfication />} />
          <Route path="componydetails" element={<ComponyDetails />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
