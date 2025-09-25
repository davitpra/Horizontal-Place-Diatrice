"use client";

export const Table = ({ children }) => {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

export const TableHead = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column}
            scope="col"
            className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white text-center">
      {children}
    </tbody>
  );
};

export const EmptyRow = ({ colSpan, message = "No data available" }) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-3.5 text-center text-sm text-gray-900"
      >
        {message}
      </td>
    </tr>
  );
};
