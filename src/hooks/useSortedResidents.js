export const useSortedResidents = (residents = [], onSeating, mealNumber) => {
    if (!Array.isArray(residents)) {
        console.error("Expected residents to be an array, but got:", residents);
        residents = [];
    }
    return residents
        .filter((person) => person.Seating === onSeating)
        .filter((person) => person.meals[mealNumber]?.onTray !== true);
}