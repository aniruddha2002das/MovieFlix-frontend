import React, { useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import FormContainer from "./../form/formContainer";
import { commonModalClass } from "../../utils/theme";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { useNotification } from "../../hooks";

export default function ForgetPassword() {

   //! Add busy features
   const [busy,setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return updateNotification("error", "Invalid Email!");
    }

    setBusy(true);
    const { error, message } = await forgetPassword(email);
    setBusy(false);

    // console.log(message);

    if (error) {
      return updateNotification("error",error);
    }

    updateNotification("success",message);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClass + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label="Email"
            name="email"
            placeholder="john@gmail.com"
          />
          <Submit value="Send Link" busy={busy}/>
          
          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
