import './Layout.sass'

type LayoutProps = {
  children: string | JSX.Element | JSX.Element[]
}

function Layout({children}: LayoutProps) {
  return (
    <div className='Layout'>
      {children}
    </div>
  )
}

export default Layout