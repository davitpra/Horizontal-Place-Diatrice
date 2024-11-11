  export function Message({title, message}) {
    return (
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <p className="mt-8 text-left text-sm/6 text-gray-600 md:order-1 md:mt-0 md:pr-4 font-bold">
            {title}
          </p>
          <p className="mt-8 text-left text-sm/6 text-gray-600 md:order-1 md:mt-0">
            {message}
          </p>
        </div>
      </footer>
    )
  }
  