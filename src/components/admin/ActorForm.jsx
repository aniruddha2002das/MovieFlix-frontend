import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import { useNotification } from "../../hooks";
import { ImSpinner3 } from "react-icons/im";

const defaultActorInfo = {
  name: "",
  about: "",
  gender: "",
  avatar: null,
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ name, about, gender, avatar }) => {
  if (!name.trim()) {
    return { error: "Actor name is missing!" };
  }

  if (!about.trim()) {
    return { error: "About section is empty!" };
  }

  if (!gender.trim()) {
    return { error: "Actor gender is missing!" };
  }

  if (avatar && !avatar.type?.startsWith("image")) {
    return { error: "Invalid image/avatar file!" };
  }

  return { error: null };
};

export default function ActorForm({
  title,
  initialState,
  btnTitle,
  busy,
  onSubmit,
}) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setselectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const updataPosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setselectedAvatarForUI(url); //! It create URL of the poster
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === "avatar") {
      const file = files[0];
      updataPosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);

    if (error) {
      return updateNotification("error", error);
    }

    //* Submit Form
    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) {
        formData.append(key, actorInfo[key]);
      }
    }
    onSubmit(formData);
  };

  useEffect(() => {
    if(initialState){
      setActorInfo({ ...initialState, avatar: null });
      setselectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  
  const { name, about, gender } = actorInfo;
  return (
    <form
      onSubmit={handleSubmit}
      className=" dark:bg-primary bg-white p-3 w-[35rem] rounded"
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className=" flex items-center justify-center h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      <div className="flex space-x-2">
        <PosterSelector
          label="Select Avatar"
          accept="image/jpg,image.jpeg,image/png"
          name="avatar"
          onChange={handleChange}
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover rounded"
        />

        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            onChange={handleChange}
            value={name}
          />
          <textarea
            name="about"
            onChange={handleChange}
            value={about}
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
}
