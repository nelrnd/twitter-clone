import { createContext } from 'react'
import { Notification } from '../types'

export const NotificationContext = createContext<Notification[] | undefined | null>(null)
