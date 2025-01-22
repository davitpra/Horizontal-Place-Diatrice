//import { create } from "zustand";
import {useLocalStorage} from './useLocalStorage'


export const useTrays = ()=>{
    const [trays, setTrays] = useLocalStorage(
        'trays', 
        [
            {roomId: 23, wing: "West wing"},
            {roomId: 33, wing: "West wing"},
            {roomId: 29, wing: "West wing"},
            {roomId: 54, wing: "East wing"},
            {roomId: 40, wing: "East wing"},
        ]
    )

    function addToTrays(roomId, wing = "East wing"){
        setTrays((prevTrays) => {
          const existingTrayIndex = prevTrays.findIndex(tray => tray.roomId === roomId);
          if (existingTrayIndex !== -1) {
            // Si el roomId ya existe, actualiza el objeto correspondiente
            const updatedTrays = [...prevTrays];
            updatedTrays[existingTrayIndex] = { roomId, wing };
            return updatedTrays;
          } else {
            // Si el roomId no existe, añade el nuevo objeto al array
            return [...prevTrays, { roomId, wing }];
          }
        });
      }

    function removeFromTrays(removeFromTrays){
        setTrays(trays.filter((tray) => tray.roomId !== removeFromTrays))
    }

    return {trays, addToTrays, removeFromTrays}

}
