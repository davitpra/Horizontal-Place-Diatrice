import { useRef, useState, useLayoutEffect } from 'react';

export const useCheckboxSelection = (items) => {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useLayoutEffect(() => {
    const isAllSelected = selectedItems.length === items.length;
    const isIndeterminate = selectedItems.length > 0 && !isAllSelected;
    
    // Only update checked state if it's different
    if (checked !== isAllSelected) {
      setChecked(isAllSelected);
    }
    
    // Only update indeterminate state if it's different
    if (indeterminate !== isIndeterminate) {
      setIndeterminate(isIndeterminate);
    }
    
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedItems, items, checked, indeterminate]);

  const handleSelectAll = () => {
    if (checked) {
      setSelectedItems([]);
      setChecked(false);
    } else {
      setSelectedItems(items);
      setChecked(true);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prev) => {
      if (prev.some((i) => i.documentId === item.documentId)) {
        return prev.filter((i) => i.documentId !== item.documentId);
      } else {
        return [...prev, item];
      }
    });
  };

  const resetSelection = () => {
    setSelectedItems([]);
    setChecked(false);
    setIndeterminate(false);
    if (checkbox.current) {
      checkbox.current.indeterminate = false;
    }
  };

  return {
    checkbox,
    checked,
    indeterminate,
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    resetSelection,
  };
};
