import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import FormContainer from "./../form/formContainer";
import { commonModalClass } from "./../../utils/theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { verifyPasswordResetToken,resetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";

export default function ConfirmPassword() {

   //! Add busy features
   const [busy,setBusy] = useState(false);


  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    isValidToken();
  }, []);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  // console.log(token, id);

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);

    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.one.trim()) {
      return updateNotification("error", "Paswword is missing!");
    }

    if (password.one.trim().length < 8) {
      return updateNotification("error", "Paswword must be 8 characters!");
    }
    
    if (password.one !== password.two) {
      return updateNotification("error", "Password do not match!");
    }
    // console.log(password);
    setBusy(true);
    const { error, message } = await resetPassword({ newPassword: password.one, userId: id, token });
    setBusy(false);

    if(error) {
      return updateNotification("error",error);
    }

    updateNotification("success", message);
    navigate('/auth/signin', { replace: true });

  };

  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Please wait we are verifying your token!
            </h1>
            <ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );

  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h1 className="text-4xl font-semibold dark:text-white text-primary">
            Sorry the token is invalid!
          </h1>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClass + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput
            value={password.one}
            onChange={handleChange}
            label="New Password"
            name="one"
            placeholder="********"
            type="password"
          />
          <FormInput
            value={password.two}
            onChange={handleChange}
            label="Confirm Password"
            name="two"
            placeholder="********"
            type="password"
          />
          <Submit value="Confirm Password" busy={busy}/>
        </form>
      </Container>
    </FormContainer>
  );
}
