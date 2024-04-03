import React, { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";

// toast.success("Hello WOrld");
const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!email.trim() || !password.trim()) {
        toast.error("Email and password are required", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return; 
      }

      const data = {
        email,
        password,
      };

      await axios
        .post("https://bagadia-travels.onrender.com/api/v1/user/login", data,{ withCredentials: true })
        .then((response) => {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setEmail("")
          setPassword("")
          router.push("/admin-dashboard");
        })
        .catch((error) => {
          toast.error(
            error.response ? error.response.data.message : "An error occurred",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
        });
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   // transition: Bounce,
      // });

      console.log(e.message)
    }
  };
  return (
    <>
      <ToastContainer />
      <div
        className="modal login-modal"
        id="user-login"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-close-btn" data-bs-dismiss="modal" />
            <div className="modal-header">
              <img
                src="/assets/img/home1/login-modal-header-img.jpg"
                alt="loginImage"
              />
            </div>
            <div className="modal-body">
              <div className="login-registration-form">
                <div className="form-title">
                  <h2>Sign in to continue</h2>
                  <p>Enter your email address for Login.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-inner mb-20">
                    <input
                      type="text"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-inner mb-20">
                    <input
                      type="text"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="login-btn mb-25">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
