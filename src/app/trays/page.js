'use client'
import { residents } from "../data/residents"
import Title from "../components/Title"
import { TableForTrays } from "../components/TableForTrays"
import { MealBar } from "../components/MealBar"
  
  export default function Trays() {
    const observations =[
      "Look out for memos or tray request forms for additional trays",
      "Call each PSW before starting trays to confirm the number of residents they have",
      "To call the West Wing call to 3002",
      "To call the East Wing call to 3004",
      "Always prepare one extra tray",
    ]

    const roomIdCounts = residents.reduce((acc, resident) => {
      acc[resident.roomId] = (acc[resident.roomId] || 0) + 1;
      return acc;
    }, {});

    const duplicateRoomIds = Object.keys(roomIdCounts).filter(roomId => roomIdCounts[roomId] > 1);

    if (duplicateRoomIds.length > 0) {
      console.log(`Duplicate roomIds found: ${duplicateRoomIds.join(', ')}`);
    } else {
      console.log('No duplicate roomIds found');
    }
    return (
      <>
        <Title title="Trays" observations={observations}/>
        <MealBar />
        <TableForTrays residents={residents}/>
      </>
    )
  }