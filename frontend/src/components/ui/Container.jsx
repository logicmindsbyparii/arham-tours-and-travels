function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  )
}

export default Container
