// Stands in for a page banner (or the home hero) that is unpublished or
// deleted in the admin panel: a dark strip as tall as the fixed header, so the
// header's white links stay readable and the content does not slide under it.
// Keeps id="top" for "Back to top" and the logo link.
function HeaderSpacer({ title }) {
  return (
    <div id="top" className="h-[4.5rem] bg-ink">
      {title && <h1 className="sr-only">{title}</h1>}
    </div>
  )
}

export default HeaderSpacer
