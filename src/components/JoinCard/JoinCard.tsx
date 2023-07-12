import './JoinCard.sass'

type JoinCardProps = {
  children: boolean | string | JSX.Element | (boolean|string|JSX.Element)[]
  width: number
}

const JoinCard: React.FC<JoinCardProps> = ({ children, width }) => {
  return (
    <div className='JoinCard'>
      <div className='JoinCard_content' style={{width: width}}>
        {children}
      </div>
    </div>
  )
}

export default JoinCard