import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserDataWithId } from './useUserData'

export default function useAuthRedirect() {
  const [user, loading] = useAuthState(auth)
  const [userData, dataLoading] = useUserDataWithId((!!user && user.uid) || '_')
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!loading && !dataLoading) {
      if (!user) {
        navigate('/login', { replace: true })
        return
      }
      if (!userData) navigate('/signup', { replace: true })
    }
  })
}
