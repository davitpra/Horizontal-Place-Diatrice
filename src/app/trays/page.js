'use client'
import { residents } from "../data/residents"
import Title from "../components/Title"
import { TableForTrays } from "../components/TableForTrays"
  
  export default function Trays() {
    const observations =[
      "Look out for memos or tray request forms for additional trays",
      "Call each PSW before starting trays to confirm the number of residents they have",
      "To call the West Wing call to 3002",
      "To call the East Wing call to 3004",
    ]
    return (
      <>
        <Title title="Trays" observations={observations} className="mb-16"/>
        <TableForTrays residents={residents}/>
      </>
    )
  }