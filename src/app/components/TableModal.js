'use client'
import React, { useEffect } from "react"
import { ReactPortal } from "./ReactPortal"
import { useTableModal } from "../hooks/useTableModal"
import { useTableNumber } from "../hooks/useTableNumber"


export function TableModal({children, isOpen, handleClose, wrapperId}) {

  const tableModal = useTableModal()
  const selectTable = useTableNumber()

  if (!tableModal.isOpen) return null

  return (
    <div>TableModal {selectTable.tableNumber}</div>
  )
}
