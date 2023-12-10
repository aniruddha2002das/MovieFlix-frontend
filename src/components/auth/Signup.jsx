import React, { useState, useEffect } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "./../CustomLink";
import { commonModalClass } from "./../../utils/theme";
import FormContainer from "./../form/formContainer";
import { createUser } from "./../../api/auth";
import { useNavigate } from "react-router-dom";
import { useNotification, useAuth } from "../../hooks";

const validateUserInfo = ({ name, email, password }) => {
  const isValidEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail.test(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!!" };

  return { ok: true };
};

export default function Signup() {

  //! Add busy features
  const [busy,setBusy] = useState(false); 


  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  // console.log(authInfo);

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    //! { ...userInfo, [name]: value } uses the spread operator (...) to create a new object that copies all the properties of the userInfo object and then updates the property specified by [name] with the value value.
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error); // (type,value)


    //! Add busy feature 
    setBusy(true);
    const response = await createUser(userInfo);
    setBusy(false);

    if (response.error) return updateNotification("error", response.error);

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    }); //! If we use replace true then user can not back tp previous screen.
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const { name, email, password } = userInfo;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClass + " w-72"}>
          <Title>Sign up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            name="name"
            placeholder="John Doe"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            name="email"
            placeholder="john@gmail.com"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            name="password"
            placeholder="********"
            type="password"
          />
          <Submit value="Sign up" busy={busy}/>

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
