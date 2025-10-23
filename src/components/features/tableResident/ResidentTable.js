"use client";
import { Fragment } from "react";
import TableHeader from "./TableHeader";
import CheckboxCell from "./CheckboxCell";
import ResidentInfo from "./ResidentInfo";
import ActionButtons from "./ActionButtons";

const ResidentTable = ({
  // Data props
  residents = [],
  mealData = [],
  selectedResidents = [],
  
  // Selection props
  checked = false,
  onSelectAll = () => {},
  onSelectItem = () => {},
  
  // Action props
  onComplete = () => {},
  onOpenInfo = () => {},
  onChangeSelection = () => {},
  
  // Configuration props
  disabled = false,
  showTableGroups = false,
  tableColumnCount = 5,
  emptyMessage = "No residents found",
  
  // Styling props
  wrapperClassName = "mt-8 flow-root",
  tableClassName = "min-w-full divide-y divide-gray-300",
  
  // Custom render props
  customRenderTableGroup = null,
  customRenderDrinksColumn = null,
}) => {
  const getCheckKey = (mealItem) => {
    return `${mealItem?.documentId}-${mealItem?.onTray}`;
  };

  const isResidentSelected = (mealItem) => {
    const checkKey = getCheckKey(mealItem);
    return selectedResidents.some(
      ({ documentId, onTray }) =>
        documentId === mealItem?.documentId && onTray === mealItem?.onTray
    );
  };

  const renderDrinksContent = (mealItem) => {
    if (customRenderDrinksColumn) {
      return customRenderDrinksColumn(mealItem);
    }

    const drinkEntries = mealItem?.filterDrinks 
      ? Object.entries(mealItem.filterDrinks) 
      : mealItem?.meals?.[0] 
        ? Object.entries(mealItem.meals[0]) 
        : [];

    return drinkEntries.map(([key, value]) => (
      <div key={key} className="py-0 grid grid-cols-2 gap-0 px-0 items-center justify-center">
        <dt className="text-sm/6 font-medium text-gray-900 block text-center">{key}</dt>
        <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-center">
          {typeof value === "boolean" ? (value ? "Add" : "none") : value}
        </dd>
      </div>
    ));
  };

  const renderResidentRow = (resident, index, mealItem) => {
    if (!mealItem) return null;

    const isChecked = isResidentSelected(mealItem);
    const checkKey = getCheckKey(mealItem);

    return (
      <tr key={resident.documentId}>
        <td className="relative text-center">
          <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
          <div className="flex justify-center items-center h-full">
            <CheckboxCell
              checked={isChecked}
              onChange={() => onSelectItem(mealItem)}
              disabled={disabled}
              label={`Select ${resident.full_name}`}
            />
          </div>
        </td>
        <td className="whitespace-nowrap py-5 text-sm">
          <ResidentInfo resident={resident} mealInfo={mealItem} />
        </td>
        <td className="hidden md:table-cell whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-center">
          {renderDrinksContent(mealItem)}
        </td>
        <ActionButtons
          resident={resident}
          index={index}
          went_out_to_eat={mealItem?.went_out_to_eat}
          isComplete={mealItem?.complete}
          onComplete={() => onComplete(mealData, index)}
          onOpenInfo={onOpenInfo}
          onChangeSelection={onChangeSelection}
        />
      </tr>
    );
  };

  const renderTableGroupContent = (tableNumber, residentsAtTable) => {
    if (!showTableGroups) return null;

    if (customRenderTableGroup) {
      return customRenderTableGroup(tableNumber, residentsAtTable);
    }

    return (
      <Fragment key={tableNumber}>
        <tr className="border-t border-gray-200">
          <th
            colSpan={tableColumnCount}
            className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-900"
          >
            Table {tableNumber}
          </th>
        </tr>
        {residentsAtTable.map((resident) => {
          const index = residents.findIndex(r => r.documentId === resident.documentId);
          const mealItem = mealData[index];
          return renderResidentRow(resident, index, mealItem);
        })}
      </Fragment>
    );
  };

  const renderSimpleList = () => {
    return residents.map((resident, index) => {
      const mealItem = mealData[index];
      return renderResidentRow(resident, index, mealItem);
    });
  };

  return (
    <div className={wrapperClassName}>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className={tableClassName}>
            <TableHeader
              checked={checked}
              onSelectAll={onSelectAll}
              disabled={disabled}
            />
            <tbody className="divide-y divide-gray-200 bg-white">
              {residents.length === 0 ? (
                <tr>
                  <td colSpan={tableColumnCount} className="py-12 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : showTableGroups ? (
                // Render grouped by tables
                Object.entries(
                  residents.reduce((groups, resident) => {
                    const tableNumber = resident.table || 'Unknown';
                    if (!groups[tableNumber]) groups[tableNumber] = [];
                    groups[tableNumber].push(resident);
                    return groups;
                  }, {})
                ).map(([tableNumber, residentsAtTable]) =>
                  renderTableGroupContent(tableNumber, residentsAtTable)
                )
              ) : (
                // Render simple list
                renderSimpleList()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentTable;
