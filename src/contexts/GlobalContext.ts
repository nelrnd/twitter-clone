import { createContext } from "react";
import { Notification, User, Chat } from "../types";

type GlobalContextType = {
  authUser: User | null | undefined
  notifications: Notification[] | null | undefined
  chats: Chat[] | null | undefined
}

export const GlobalContext = createContext<GlobalContextType>({authUser: null, notifications: null, chats: null})