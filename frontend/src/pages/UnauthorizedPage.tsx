function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center text-white bg-red-900">
      <h1 className="text-2xl font-bold">
        You do not have permission to access this page
      </h1>
    </div>
  )
}

export default UnauthorizedPage