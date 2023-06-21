import SearchIcon from '../../assets/search.svg'
import { useRef, useState } from 'react'
import { CollectionReference, collection, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import Loader from '../Loader/Loader'
import { User } from '../../types'
import ProfileCard from '../Profile/ProfileCard'
import './Search.sass'

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <>
      <div className="SearchBar_wrapper" onClick={() => input.current && input.current.focus()}>
        <SearchIcon />
        <input type="search" value={searchValue} onChange={handleChange} placeholder='Search Twitter' ref={input} onFocus={() => setOpen(true)} />
        {open && <SearchResults searchValue={searchValue} />}
      </div>
      {open && <div className='Search_backdrop' onClick={() => setOpen(false)} />}
    </>
  )
}

type SearchResultsProps = {
  searchValue: string
}

const SearchResults: React.FC<SearchResultsProps> = ({searchValue}) => {
  const usernameQuery = query(collection(db, 'users') as CollectionReference<User>, where('username', '>=', searchValue), where('username', '<=', searchValue + '\uf8ff'))
  const nameQuery = query(collection(db, 'users') as CollectionReference<User>, where('name', '>=', searchValue), where('name', '<=', searchValue + '\uf8ff'))
  const [usernameResults, usernameLoading] = useCollectionDataOnce(searchValue ? usernameQuery : null)
  const [nameResults, nameLoading] = useCollectionDataOnce(searchValue ? nameQuery : null)

  const results = usernameResults?.concat(nameResults || []).filter((res, id, arr) => arr.findIndex((u) => u.id === res.id) === id)

  return (
    <div className="SearchResults">
      {usernameLoading || nameLoading && <Loader />}
      {!searchValue ? (
        <p style={{padding: 16, textAlign: 'center'}}>Try searching for people</p>
      ) : (
        results?.map((res, id) => <ProfileCard key={id} user={res} showBio={false} showFollow={false} />)
      )}
    </div>
  )
}

export default SearchBar