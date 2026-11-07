import { Link, useLocation } from 'react-router-dom'
import { scrollToTop } from '../../hooks/useSmoothScroll.js'

// One link component for the whole site:
// - "#top" is the home page, at the top. It links to "/" (so the address bar
//   never shows "#top") and, already on the home page, glides back up.
// - Other "#section" links point at a section of the home page. On the home
//   page they stay plain anchors, so smooth scrolling glides there; on other
//   pages they route to the home page and ScrollManager scrolls to the section.
// - "/path" links are router links between pages, with no page reload.
function SiteLink({ href, onClick, ...props }) {
  const { pathname } = useLocation()

  if (href === '#top') {
    const handleClick = (event) => {
      onClick?.(event)
      if (pathname !== '/') return
      event.preventDefault()
      scrollToTop()
    }
    return <Link to="/" onClick={handleClick} {...props} />
  }

  if (href.startsWith('#')) {
    return pathname === '/' ? (
      <a href={href} onClick={onClick} {...props} />
    ) : (
      <Link to={`/${href}`} onClick={onClick} {...props} />
    )
  }

  return <Link to={href} onClick={onClick} {...props} />
}

export default SiteLink
