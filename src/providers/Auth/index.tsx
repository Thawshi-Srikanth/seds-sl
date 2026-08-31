"use client";

import type { User } from "@/payload-types";
import { getClientSideURL } from "@/utilities/getURL";
import posthog from "posthog-js";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ResetPassword = (args: {
  password: string;
  passwordConfirm: string;
  token: string;
}) => Promise<void>;

type ForgotPassword = (args: { email: string }) => Promise<void>;

type Create = (args: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => Promise<void>;

type Login = (args: { email: string; password: string }) => Promise<User>;

type Logout = () => Promise<void>;

type AuthContext = {
  create: Create;
  forgotPassword: ForgotPassword;
  login: Login;
  logout: Logout;
  resetPassword: ResetPassword;
  setUser: (user: User | null) => void;
  status: "loggedIn" | "loggedOut" | undefined;
  user?: User | null;
};

const Context = createContext({} as AuthContext);

const identifyUser = (user: User) => {
  if (user?.id) {
    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name ?? undefined,
      roles: user.roles ?? undefined,
    });
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loggedIn" | "loggedOut" | undefined>();

  const create = useCallback<Create>(async (args) => {
    try {
      const res = await fetch(`${getClientSideURL()}/api/users/create`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (res.ok) {
        const { data, errors } = await res.json();
        if (errors) throw new Error(errors[0].message);
        const user = data?.loginUser?.user as User | undefined;
        if (!user) throw new Error("Invalid login");

        setUser(user);
        identifyUser(user);
        setStatus("loggedIn");
      } else {
        throw new Error("Invalid login");
      }
    } catch (e) {
      throw new Error("An error occurred while attempting to login.");
    }
  }, []);

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`${getClientSideURL()}/api/users/login`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (res.ok) {
        const { errors, user } = await res.json();
        if (errors) throw new Error(errors[0].message);
        if (!user) throw new Error("Invalid login");

        setUser(user);
        identifyUser(user);
        setStatus("loggedIn");
        return user;
      }

      throw new Error("Invalid login");
    } catch (e) {
      throw new Error("An error occurred while attempting to login.");
    }
  }, []);

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${getClientSideURL()}/api/users/logout`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (res.ok) {
        posthog.reset();
        setUser(null);
        setStatus("loggedOut");
      } else {
        throw new Error("An error occurred while attempting to logout.");
      }
    } catch (e) {
      throw new Error("An error occurred while attempting to logout.");
    }
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${getClientSideURL()}/api/users/me`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        });

        if (res.ok) {
          const { user: meUser } = await res.json();
          setUser(meUser || null);
          if (meUser) {
            identifyUser(meUser);
            setStatus("loggedIn");
          } else {
            setStatus("loggedOut");
          }
        } else {
          setUser(null);
          setStatus("loggedOut");
        }
      } catch (e) {
        setUser(null);
        setStatus("loggedOut");
      }
    };

    void fetchMe();
  }, []);

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(
        `${getClientSideURL()}/api/users/forgot-password`,
        {
          body: JSON.stringify({
            email: args.email,
          }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      if (res.ok) {
        const { data, errors } = await res.json();
        if (errors) throw new Error(errors[0].message);
        setUser(data?.loginUser?.user);
      } else {
        throw new Error("Invalid login");
      }
    } catch (e) {
      throw new Error("An error occurred while attempting to login.");
    }
  }, []);

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(
        `${getClientSideURL()}/api/users/reset-password`,
        {
          body: JSON.stringify({
            password: args.password,
            passwordConfirm: args.passwordConfirm,
            token: args.token,
          }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      if (res.ok) {
        const { data, errors } = await res.json();
        if (errors) throw new Error(errors[0].message);
        const user = data?.loginUser?.user as User | undefined;
        if (!user) throw new Error("Invalid login");

        setUser(user);
        identifyUser(user);
        setStatus("loggedIn");
      } else {
        throw new Error("Invalid login");
      }
    } catch (e) {
      throw new Error("An error occurred while attempting to login.");
    }
  }, []);

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
