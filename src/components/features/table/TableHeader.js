"use client";
import CheckboxCell from "./CheckboxCell";

const TableHeader = ({ checked, onSelectAll, disabled }) => {
  return (
    <thead>
      <tr>
        <th scope="col" className="relative px-7 w-12 px-6">
          <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
          <div className="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
            <CheckboxCell
              checked={checked}
              onChange={onSelectAll}
              disabled={disabled}
              label="Select all residents"
            />
          </div>
        </th>
        <th className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 pl-0">
          Name
        </th>
        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          To Serve
        </th>
        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Status
        </th>
        <th className="relative py-3.5 pl-3 pr-4 pr-0">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
