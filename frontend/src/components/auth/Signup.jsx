import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaUser, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ValidationFormObject from "../../validation";
import { useDispatch } from 'react-redux';
import { setemail } from "../../store/userActions";
import "../../styles/auth.css"; // Import our new auth styles
import AnimatedInput from "../common/AnimatedInput";
import AnimatedButton from "../common/AnimatedButton";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [signupStep, setSignupStep] = useState(1);
  const [formState, setFormState] = useState("initial"); // initial, submitting, success, error
  
  // Animation effect when component mounts
  useEffect(() => {
    const card = document.querySelector('.auth-card');
    if (card) {
      card.classList.add('auth-fade-in');
    }
  }, []);
  
  const handleFileSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };
  
  const validateFields = () => {
    const nameError = ValidationFormObject.validteName(name);
    const emailError = ValidationFormObject.validteEmail(email);
    const passwordError = ValidationFormObject.validtePass(password);
    const newErrors = {};
    
    if (nameError !== true) newErrors.name = nameError;
    if (emailError !== true) newErrors.email = emailError;
    if (passwordError !== true) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  
  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateFields()) {
      // Add transition animation
      const card = document.querySelector('.auth-card');
      if (card) {
        card.classList.add('animate-slide-left');
        setTimeout(() => {
          setSignupStep(2);
          card.classList.remove('animate-slide-left');
          card.classList.add('animate-slide-right');
          
          // Remove animation class after it completes
          setTimeout(() => {
            card.classList.remove('animate-slide-right');
          }, 500);
        }, 300);
      } else {
        setSignupStep(2);
      }
      
      // Scroll animation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };
  
  const handlePrevStep = () => {
    // Add transition animation
    const card = document.querySelector('.auth-card');
    if (card) {
      card.classList.add('animate-slide-right');
      setTimeout(() => {
        setSignupStep(1);
        card.classList.remove('animate-slide-right');
        card.classList.add('animate-slide-left');
        
        // Remove animation class after it completes
        setTimeout(() => {
          card.classList.remove('animate-slide-left');
        }, 500);
      }, 300);
    } else {
      setSignupStep(1);
    }
  };
  
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }
    
    setIsLoading(true);
    setServerError("");
    setFormState("submitting");
    
    const newForm = new FormData();
    newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "any",
      },
    };
    
    // Axios request to backend
    axios
      .post("http://localhost:3000/api/v2/user/create-user", newForm, config)
      .then((res) => {
        // Set success state
        setFormState("success");
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      })
      .catch((err) => {
        setServerError(err.response ? err.response.data.message : err.message);
        setFormState("error");
        
        // Shake animation for error
        const form = document.querySelector('form');
        if (form) {
          form.classList.add('auth-error-shake');
          setTimeout(() => form.classList.remove('auth-error-shake'), 500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <div className="auth-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="auth-heading animate-fade-in">
          {signupStep === 1 ? "Create your account" : "Complete your profile"}
        </h2>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 auth-error-message">
              {serverError}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={signupStep === 1 ? handleNextStep : handleSubmit}>
            {signupStep === 1 ? (
              <>
                <div className="animate-fade-in delay-100">
                  <AnimatedInput
                    type="text"
                    name="name"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                    error={errors.name}
                    icon={<FaUser className="text-gray-400" size={16} />}
                  />
                </div>
                
                <div className="animate-fade-in delay-200">
                  <AnimatedInput
                    type="email"
                    name="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    error={errors.email}
                    icon={<FaEnvelope className="text-gray-400" size={16} />}
                  />
                </div>
                
                <div className="animate-fade-in delay-300">
                  <AnimatedInput
                    type={visible ? "text" : "password"}
                    name="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    error={errors.password}
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
                
                <div className="animate-fade-in delay-400">
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    className="py-3"
                    icon={<FaArrowRight />}
                    iconPosition="right"
                  >
                    Continue
                  </AnimatedButton>
                </div>
                
                <div className="auth-divider animate-fade-in delay-500">
                  <span className="auth-divider-text">or sign up with</span>
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
              </>
            ) : (
              <>
                <div className="avatar-upload animate-fade-in">
                  <div className="avatar-preview">
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <RxAvatar />
                    )}
                  </div>
                  <label
                    htmlFor="file-input"
                    className="avatar-upload-button"
                  >
                    <span>Upload profile picture</span>
                    <input
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSubmit}
                      className="sr-only"
                    />
                  </label>
                </div>
                
                <div className="flex space-x-3 animate-fade-in delay-200">
                  <AnimatedButton
                    type="button"
                    onClick={handlePrevStep}
                    variant="secondary"
                    className="flex-1"
                    icon={<FaArrowLeft />}
                    iconPosition="left"
                  >
                    Back
                  </AnimatedButton>
                  
                  <AnimatedButton
                    type="submit"
                    className="flex-1"
                    loading={isLoading}
                    disabled={isLoading}
                    variant={formState === "success" ? "success" : "primary"}
                  >
                    {formState === "success" ? "Success!" : "Complete Signup"}
                  </AnimatedButton>
                </div>
              </>
            )}
            
            <div className="flex items-center justify-center w-full mt-4 animate-fade-in delay-500">
              <p className="text-gray-600">Already have an account?</p>
              <Link to="/login" className="ml-2 auth-link">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;