import Loading from '../../assets/loading.png'
import './Loader.sass'

const Loader: React.FC = () => {
  return (
    <div className="Loader">
      <img src={Loading} alt="Loading..." />
    </div>
  )
}

export default Loader
