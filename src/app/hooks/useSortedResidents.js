export const useSortedResidents = (residents, onSeating, mealNumber) => {
    return residents
        .filter((person) => person.Seating === onSeating)
        .filter((person) => person.meals[mealNumber]?.onTray !== true);
}