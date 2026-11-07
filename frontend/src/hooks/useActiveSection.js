import { useEffect, useState } from 'react'

// Returns the id of the section currently crossing the middle of the screen,
// so the navigation can mark where the visitor is. Pass the current page path
// so it looks for the sections again after a page change.
export function useActiveSection(ids, pathname) {
  const [activeId, setActiveId] = useState(ids[0])
  const key = ids.join(',')

  useEffect(() => {
    const sections = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key, pathname])

  return activeId
}
