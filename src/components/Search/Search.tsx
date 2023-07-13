import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CollectionReference, Query, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { User } from '../../types'
import Loader from '../Loader/Loader'
import Avatar from '../Avatar/Avatar'
import UserName from '../User/UserName'
import SearchIcon from '../../assets/search.svg'
import './Search.sass'

const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)

  return (
    <div className='Search'>
      <SearchBar value={value} setValue={setValue} setOpen={setOpen} />
      {open && <SearchResults value={value} setOpen={setOpen} />}
    </div>
  )
}

type SearchBarProps = {
  value: string
  setValue: (value: string) => void
  setOpen: (open: boolean) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ value, setValue, setOpen }) => {
  const input = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className='SearchBar'>
      <SearchIcon />
      <input type="search" value={value} onChange={handleChange} placeholder='Search Twitter' ref={input} onFocus={() => setOpen(true)} />
    </div>
  )
}

type SearchResultsProps = {
  value: string
  setOpen: (open: boolean) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ value, setOpen }) => {
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const fetchResults = async (value: string) => {
    const usersCollection = collection(db, 'users') as CollectionReference<User>
    const q1 = query(usersCollection, where('username', '>=', value), where('username', '<=', value + '\uf8ff'))
    const q2 = query(usersCollection, where('name', '>=', value), where('name', '<=', value + '\uf8ff'))

    const fetch = async (query: Query) => {
      const querySnapshot = await getDocs(query)
      const results = querySnapshot.docs.map((doc) => doc.data() as User)
      return results
    }

    const [usernameResults, nameResults] = await Promise.all([fetch(q1), fetch(q2)])

    const results = [...usernameResults, ...nameResults].filter((user, id, arr) => arr.findIndex((u) => u.id === user.id) === id)

    setResults(results)
  }

  useEffect(() => {
    (async () => {
      if (value) {
        setLoading(true)
        await fetchResults(value)
        setLoading(false)
      }
    })()
  }, [value])

  return (
    <>
      <div className='SearchResults'>
        {loading ? (
          <Loader />
        ) : !value ? (
          <p className='try-searching'>Try searching for people</p>
        ) : (
          results.map((user, id) => <SearchResult key={id} user={user} />)
        )}
      </div>
      <div className='backdrop' onClick={() => setOpen(false)} />
    </>
  )
}

type SearchResultProps = {
  user: User
}

const SearchResult: React.FC<SearchResultProps> = ({ user }) => {
  const navigate = useNavigate()

  return (
    <div className='SearchResult' onClick={() => navigate(`/${user.username}`)}>
      <Avatar src={user.profileURL} size={56} />
      <UserName user={user} dir='ver' />
    </div>
  )
}

export default Search