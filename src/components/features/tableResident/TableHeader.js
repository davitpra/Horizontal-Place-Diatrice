"use client";

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th className="text-center" />
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
