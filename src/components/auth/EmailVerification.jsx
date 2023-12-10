import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/formContainer";
import { commonModalClass } from "../../utils/theme";
import { verifyUserEmail,resendEmailVerificationToken } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks/index";


const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  }

  return valid;
};

export default function EmailVerification() {

   //! Add busy features
   const [busy,setBusy] = useState(false);


  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified; //! If user not login then profile will be null.

  const inputRef = useRef();
  const { updateNotification } = useNotification();

  const { state } = useLocation();
  // console.log(state.user.id);
  const user = state?.user; //! If state is undefined then '?' is used

  const navigate = useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

    if (!value) focusPrevInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);
    setOtp([...newOtp]);
  };

  const handleOTPResend = async() => {
    // console.log(user.id);
   const { error,message } = await resendEmailVerificationToken(user.id);

   if(error) return updateNotification('error',error);

   updateNotification('success',message);

  };

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) {
      return updateNotification("error", "Invalid OTP");
    }

    //* submit OTP

    // console.log(user.id);
    setBusy(true);
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""), //! otp is array format so to convert into string we usse join method
      userId: user.id,
    });

    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) {
      navigate("/not-found");
    }
    // console.log(isLoggedIn);
    if (isLoggedIn && isVerified) {
      navigate("/");
    }
  }, [user, isLoggedIn,isVerified]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClass}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>

          <div>
            <Submit value="Verify Account" busy={busy}/>
            <button type='button' onClick={handleOTPResend} className="dark:text-white text-blue-500 font-semibold hover:underline mt-2">
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}













