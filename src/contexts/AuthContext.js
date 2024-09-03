import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "config/firebase";  // Make sure the path to your Firebase config is correct

const Auth = createContext();

const initialState = { isAuthenticated: false, user: {}, role: null };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_LOGGED_IN":
      return { isAuthenticated: true, user: payload.user, role: payload.role };
    case "SET_PROFILE":
      return { ...state, user: payload.user, role: payload.role };
    case "SET_LOGGED_OUT":
      return initialState;
    default:
      return state;
  }
};

export default function AuthContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);
  let navigate = useNavigate();

  const fetchUserRole = async (user) => {
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data().role;  // Assuming 'role' is a field in the user's Firestore document
    }
    return null;
  };

  const readProfile = useCallback(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await fetchUserRole(user);
        dispatch({ type: "SET_LOGGED_IN", payload: { user, role } });
      } else {
        console.log("User not found");
      }
    });
    setTimeout(() => {
      setIsAppLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    readProfile();
  }, [readProfile]);

  const handleLogout = () => {
    dispatch({ type: "SET_LOGGED_OUT" });
    navigate("/auth/register");
  };

  return (
    <Auth.Provider
      value={{
        ...state,
        dispatch,
        isAppLoading,
        setIsAppLoading,
        handleLogout,
      }}
    >
      {children}
    </Auth.Provider>
  );
}

export const useAuthContext = () => useContext(Auth);
