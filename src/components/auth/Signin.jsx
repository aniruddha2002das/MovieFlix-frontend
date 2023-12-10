import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "./../CustomLink";
import { commonModalClass } from "./../../utils/theme";
import FormContainer from "../form/formContainer";
import { useNotification, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from '../../utils/helper'

const validateUserInfo = ({ email, password }) => {

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 charecter long!!" };

  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending,isLoggedIn } = authInfo;

  // console.log(authInfo);

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error); // (type,value)

    handleLogin(userInfo.email, userInfo.password);
  };

  // useEffect(() => {
  //   // console.log("heee");
  //   if(isLoggedIn){
  //     navigate('/');
  //   }
  // },[isLoggedIn])

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClass + " w-72"}>
          <Title>Sign in</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            name="email"
            placeholder="john@gmail.com"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            name="password"
            placeholder="********"
            type="password"
          />
          <Submit value="Sign in" busy={isPending} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}





