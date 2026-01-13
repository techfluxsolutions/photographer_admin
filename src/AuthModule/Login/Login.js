// import React, { useState } from "react";
// import OtpModal from "../OtpModal/OtpModal";
// import "./Login.css";
// import { LoginAPI } from "../../utils/APIs/credentialsApis";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../Template/Loader/Loader";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [step, setStep] = useState(0);
//   const [SucMsg, setSucMsg] = useState("Enter OTP sent to your email");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginClick = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Email is required");
//       return;
//     }

//     const body = { email };

//     try {
//       setLoading(true); 
//       const response = await LoginAPI(body);
//       console.log("RESPONSE", response?.data);
//       setLoading(false);

//       if (response?.data?.success) {
//         toast.success(response?.data?.message || "OTP sent successfully");
//         setStep(2);
//       } else {
//         toast.error(response?.data?.message || "Something went wrong");
//       }
//     } catch (error) {
//       setLoading(false);
//       toast.error(
//         error?.response?.data?.message || "Server error, please try again"
//       );
//     }
//   };

//   return (
//     <>
//     {loading && <Loader />}
//       <div className="main-container" style={{ marginTop: "12vh" }}>
//         <div className="container login-container">
//           <form className="login-form" onSubmit={handleLoginClick}>
//             <h2
//               style={{
//                 cursor: "default",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 position: "relative",
//                 fontSize: "24px",
//                 boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                 padding: "10px 20px",
//                 borderRadius: "8px",
//                 marginBottom: "20px",
//               }}
//             >
//               <span style={{ textAlign: "center" }}>Super Admin - Login</span>
//             </h2>

//             <label htmlFor="email" className="login-label">
//               Email <span className="text-danger">*</span>
//             </label>

//             <input
//               type="email"
//               id="email"
//               className="login-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email address"
//               required
//             />

//             <div className="login-btn-container">
//               <button
//                 type="submit"
//                 className="login-btn"
//                 style={{ width: "30%" }}
//               >
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {step === 2 && (
//         <OtpModal
//           isOpen={step === 2}
//           onHide={() => setStep(0)}
//           email={email}
//           SucMsg={SucMsg}
//           onSuccess={() => {
//   sessionStorage.setItem("loggedIn", "true");
//   navigate("/dashboard");  
// }}

//         />
//       )}
//     </>
//   );
// };

// export default Login;



import React, { useState } from "react";
import OtpModal from "../OtpModal/OtpModal";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (!email) return;

    setStep(2); // open OTP modal
  };

  return (
    <>
      <div className="main-container" style={{ marginTop: "12vh" }}>
        <div className="container login-container">
          <form className="login-form" onSubmit={handleLoginClick}>
            <h2 className="text-center mb-4">Super Admin - Login</h2>

            <label className="login-label">
              Email <span className="text-danger">*</span>
            </label>

            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <div className="login-btn-container">
              <button type="submit" className="login-btn" style={{ width: "30%" }}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {step === 2 && (
        <OtpModal
          isOpen={true}
          onHide={() => setStep(0)}
          SucMsg="Enter OTP sent to your email"
          onSuccess={() => {
            sessionStorage.setItem("loggedIn", "true");
            navigate("/dashboard");
          }}
        />
      )}
    </>
  );
};

export default Login;
// hiii