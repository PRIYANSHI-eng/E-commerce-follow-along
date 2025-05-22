import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "../../styles/styles";
import axios from "../../axiosConfig"; // Use the configured axios instance
import { useDispatch } from "react-redux";
import { setemail } from "../../store/userActions";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../styles/auth.css"; // Import our new auth styles
import AnimatedInput from "../common/AnimatedInput";
import AnimatedButton from "../common/AnimatedButton";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState("initial"); // initial, submitting, success, error

  // Animation effect when component mounts
  useEffect(() => {
    const card = document.querySelector('.auth-card');
    if (card) {
      card.classList.add('auth-fade-in');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormState("submitting");
    setIsLoading(true);
    
    try {
      const response = await axios.post("/api/v2/user/login", { email, password });
      
      // Store user info in localStorage
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      // Store token in localStorage if it's in the response
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      // Dispatch email to Redux state
      dispatch(setemail(email));
      
      // Set success state
      setFormState("success");
      
      // Redirect after a short delay to show success animation
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      console.error("There was an error logging in!", error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
      setFormState("error");
      
      // Shake animation for error
      const form = document.querySelector('form');
      if (form) {
        form.classList.add('auth-error-shake');
        setTimeout(() => form.classList.remove('auth-error-shake'), 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="auth-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="auth-heading animate-fade-in">
          Welcome Back
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 auth-error-message">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="animate-fade-in delay-100">
              <AnimatedInput
                type="email"
                name="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                icon={<FaEnvelope className="text-gray-400" size={16} />}
              />
            </div>

            <div className="animate-fade-in delay-200">
              <AnimatedInput
                type={visible ? "text" : "password"}
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                icon={<FaLock className="text-gray-400" size={16} />}
                rightIcon={
                  visible ? (
                    <AiOutlineEye size={20} className="text-gray-500" />
                  ) : (
                    <AiOutlineEyeInvisible size={20} className="text-gray-500" />
                  )
                }
                onRightIconClick={togglePasswordVisibility}
              />
            </div>

            <div className={`${styles.flexBetween} animate-fade-in delay-300`}>
              <div className={`${styles.normalFlex}`}>
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="auth-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 auth-checkbox-label">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href=".forgot-password"
                  className="auth-link"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="animate-fade-in delay-400">
              <AnimatedButton
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                variant={formState === "success" ? "success" : "primary"}
                className="py-3"
              >
                {formState === "success" ? "Success!" : "Sign In"}
              </AnimatedButton>
            </div>

            <div className="auth-divider animate-fade-in delay-500">
              <span className="auth-divider-text">or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3 animate-fade-in delay-500">
              <AnimatedButton
                type="button"
                variant="outline"
                icon={<FaGoogle size={18} className="text-[#EA4335]" />}
              >
                Google
              </AnimatedButton>
              <AnimatedButton
                type="button"
                variant="outline"
                icon={<FaFacebook size={18} className="text-[#1877F2]" />}
              >
                Facebook
              </AnimatedButton>
            </div>

            <div className={`${styles.normalFlex} w-full justify-center mt-4 animate-fade-in delay-500`}>
              <p className="text-gray-600">Don&#39;t have an account?</p>
              <a href="/signup" className="ml-2 auth-link">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;