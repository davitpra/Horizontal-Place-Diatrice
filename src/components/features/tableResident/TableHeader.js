"use client";

const TableHeader = ({ checked, onSelectAll, disabled = false }) => {
  return (
    <thead>
      <tr>
        <th scope="col" className="relative px-6 text-center">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 size-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100"
            checked={checked}
            onChange={onSelectAll}
            disabled={disabled}
            aria-label="Select all residents"
          />
        </th>
        <th className="py-3.5 pr-3 text-center text-sm font-semibold text-gray-900 pl-0">
          Name
        </th>
        <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
          To Serve
        </th>
        <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
          Status
        </th>
        <th className="relative py-3.5 pl-3 pr-4 pr-0 text-center">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
