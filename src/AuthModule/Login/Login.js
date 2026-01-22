import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import { LoginAPI } from "../../utils/APIs/credentialsApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";
import { encryptData } from "../../utils/CRYPTO/cryptoFunction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()

  //  const handleLoginClick = async (e) => {
  //   e.preventDefault();
  //   if (!email || !password) return;
  //   setLoading(true);

  //   try {
  //     const body = { 
  //       email ,
  //       password
  //     };

  //     const response = await LoginAPI(body);
  //     // debug:
  //     console.log("SIGN In", response?.data);

  //     if (response?.data?.success && response?.status===200) {
  //       const token = encryptData(response?.data?.data?.token)
  //       sessionStorage.setItem("token",token)
  //       sessionStorage.setItem("loggedIn",true)
  //       toast.success(response?.data?.message)
  //       navigate("/dashboard")
  //     } else {
  //       toast.error(response?.data?.message || "Login Failed!")
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message || "Sign-up failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const DEV_BYPASS = false; // 🔴 turn OFF in production

const handleLoginClick = async (e) => {
  e.preventDefault();
  if (!email || !password) return;

  setLoading(true);

  try {
    const body = { email, password };
    const response = await LoginAPI(body);

    if (response?.data?.success && response?.status === 200) {
      const token = encryptData(response?.data?.data?.token);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("myId",response?.data?.data?.admin?.id)
      toast.success(response?.data?.message);
      navigate("/dashboard");
    } else {
      if (DEV_BYPASS) {
        sessionStorage.setItem("token", "DEV_TOKEN");
        sessionStorage.setItem("loggedIn", "true");
        toast.warn("DEV MODE: Login bypassed");
        navigate("/dashboard");
      } else {
        toast.error(response?.data?.message || "Login Failed!");
      }
    }
  } catch (err) {
    if (DEV_BYPASS) {
      sessionStorage.setItem("token", "DEV_TOKEN");
      sessionStorage.setItem("loggedIn", "true");
      toast.warn("DEV MODE: API down, bypass login");
      navigate("/dashboard");
    } else {
      toast.error(err.message || "Login failed");
    }
  } finally {
    setLoading(false);
  }
};



  if(loading){
    return <Loader/>
  }

  return (
    <div className="main-container">
      <div className="container login-container">
        <form className="login-form" onSubmit={handleLoginClick}>
          <h2 className="text-center mb-4 login-text"
          style={{fontWeight:"600"}}
          >Admin - Login</h2>

          <label className="login-label">Email </label>
          <input
            type="email"
            className="login-input login-input-manual"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label mt-3">Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
