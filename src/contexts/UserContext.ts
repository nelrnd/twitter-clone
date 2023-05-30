import { DocumentData } from 'firebase/firestore'
import { createContext } from 'react'

export const UserContext = createContext<DocumentData | undefined | null>(null)
