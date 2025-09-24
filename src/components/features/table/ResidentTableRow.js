"use client";
import CheckboxCell from "./CheckboxCell";
import ResidentInfo from "./ResidentInfo";
import ActionButtons from "./ActionButtons";

const ResidentTableRow = ({
  resident,
  index,
  isSelected,
  onSelect,
  disabled,
  mealInfo,
  isComplete,
  onComplete,
  onOpenInfo,
  onChangeSelection,
}) => {

  return (
    <tr key={resident.documentId}>
      <td className="relative px-7 sm:w-12 sm:px-6">
        <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />
        <div className="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
          <CheckboxCell
            checked={isSelected}
            onChange={() => onSelect(resident)}
            disabled={disabled}
            label={`Select ${resident.full_name}`}
          />
        </div>
      </td>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
        <ResidentInfo resident={resident} mealInfo={mealInfo}/>
      </td>
      <td className="hidden sm:block whitespace-nowrap px-3 py-2 text-sm text-gray-500">
        {Object.entries(mealInfo?.filterDrinks || {}).map(([key, value]) => (
          <div key={key} className="py-0 grid grid-cols-2 gap-0 px-0">
            <dt className="text-sm/6 font-medium text-gray-900 block">{key}</dt>
            <dd className="text-sm/6 text-gray-700 mt-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {typeof value === "boolean" ? (value ? "Add" : "none") : value}
            </dd>
          </div>
        ))}
      </td>
      <ActionButtons
        resident={resident}
        index={index}
        isComplete={isComplete}
        onComplete={onComplete}
        onOpenInfo={onOpenInfo}
        onChangeSelection={onChangeSelection}
      />
    </tr>
  );
};

export default ResidentTableRow;
