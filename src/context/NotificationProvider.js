import React, { useState, createContext } from "react";

export const NotificationContext = createContext();

let timeoutID;

export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState("");
  const [classes, setClasses] = useState("");

  const updateNotification = (type, value) => {
    //! The code schedules an action to be executed after 3 seconds. However, if the action has already been scheduled but not yet executed, the code cancels the previous scheduling and replaces it with a new one.
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;

      case "success":
        setClasses("bg-green-500");
        break;

      case "warning":
        setClasses("bg-orange-500");
        break;

      default:
        setClasses("bg-red-500");
    }

    setNotification(value);

    //! Whenever we use setTimeout or setInterval it returns an ID. If setTimeout executes before timeout then setTimeout returns immediately an activeTimeout(true) then if block will be executed.
    timeoutID = setTimeout(() => {
      // console.log('lo');
      setNotification("");
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24 ">
          <div className="bounce-custom shadow-md shadow-gray-400 rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold rounded"}>
              {notification}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
