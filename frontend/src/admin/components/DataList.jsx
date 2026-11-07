// Records as a table on wide screens and as cards on phones, so nothing
// forces the page wider than the screen and every action stays reachable.
//
// columns: [{ key, label, render(item), primary?: true, className? }]
//   primary: shown as the card title on phones.
// actions(item): buttons for the row (Edit, Publish, Delete…).
function DataList({ columns, items, actions, caption }) {
  const primary = columns.find((column) => column.primary) ?? columns[0]
  const secondary = columns.filter((column) => column !== primary)
  const cell = (column, item) => (column.render ? column.render(item) : item[column.key])

  return (
    <>
      {/* Phones and small tablets */}
      <ul className="divide-y divide-admin-border md:hidden">
        {items.map((item) => (
          <li key={item.id} className="min-w-0 px-4 py-4">
            <div className="min-w-0 break-words font-semibold text-admin-text">{cell(primary, item)}</div>
            <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
              {secondary.map((column) => (
                <div key={column.key} className="contents">
                  <dt className="text-admin-muted">{column.label}</dt>
                  <dd className="min-w-0 break-words text-admin-text">{cell(column, item)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="mt-3 flex flex-wrap gap-2">{actions(item)}</div>}
          </li>
        ))}
      </ul>

      {/* Tablets and computers: the table scrolls inside its own box if needed */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-admin-border bg-admin-subtle text-xs uppercase tracking-wide text-admin-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={`px-4 py-3 font-semibold first:pl-5 ${column.className ?? ''}`}>
                  {column.label}
                </th>
              ))}
              {actions && (
                <th scope="col" className="px-4 py-3 pr-5 text-right font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {items.map((item) => (
              <tr key={item.id} className="align-middle hover:bg-admin-subtle/60">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 text-admin-text first:pl-5 ${column.className ?? ''}`}>
                    {cell(column, item)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-2 pr-5">
                    <div className="flex flex-wrap justify-end gap-1.5">{actions(item)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default DataList
