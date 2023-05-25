import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'

export default function useAuthRedirect() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      if (loading) return
      if (user) {
        const ref = collection(db, 'users')
        const qry = query(ref, where('id', '==', user.uid), limit(1))
        const doc = await getDocs(qry)
        if (doc.empty) {
          navigate('/signup', { replace: true })
        }
      } else {
        navigate('/login', {replace: true})
      }
    })()
  }, [user, loading, navigate])
}