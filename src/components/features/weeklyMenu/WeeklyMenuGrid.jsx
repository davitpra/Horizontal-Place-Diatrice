import { DAY_NAMES, DAY_NAMES_SHORT, MEAL_SECTIONS } from '@/constants/mealConstants';

export default function WeeklyMenuGrid({ menuData = [], loading = false, error = null, menuDataSelected = [] }) {

    // Create date mapping for easy lookup
    const dateToSchedule = menuData.reduce((acc, item) => {
        acc[item.Date] = item;
        return acc;
    }, {});


    // Create date mapping for selected menu items
    const dateToSelected = menuDataSelected?.reduce((acc, item) => {
        acc[item.Date] = item;
        return acc;
    }, {}) || {};

    // Get dates for header (Monday to Sunday)
    const dates = menuData.map(item => new Date(item.Date));

    // Helper function to check if a field is selected
    const isFieldSelected = (date, mealType, field) => {
        const selected = dateToSelected?.[date];
        if (!selected) return false;

        const mealKey = mealType.toLowerCase();
        return Boolean(selected[mealKey]?.[field]);
    };

    // Helper function to get meal data
    const getMealData = (date, mealType, field) => {
        const schedule = dateToSchedule?.[date];
        if (!schedule) return '';

        if (mealType === 'Breakfast') {
            return schedule.Breakfast?.[field] || '';
        } else if (mealType === 'Lunch') {
            return schedule.Lunch?.[field] || '';
        } else if (mealType === 'Supper') {
            return schedule.Dinner?.[field] || '';
        }
        return '';
    };

    if (loading) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 text-center">Loading weekly menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="text-red-600 text-center max-w-md">
                    <p className="text-lg font-semibold">Error loading menu data</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (menuData.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <p className="text-gray-600 text-center">No menu data available for this week</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4">
            {/* Mobile View - Card Layout */}
            <div className="block lg:hidden space-y-4">
                {dates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const schedule = dateToSchedule?.[dateStr];
                    
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Day Header */}
                            <div className="bg-indigo-50 text-indigo-900 px-4 py-3">
                                <h3 className="text-lg font-semibold">
                                    {DAY_NAMES[date.getDay() === 0 ? 0 : date.getDay()]} / {date.getDate() + 1}
                                </h3>
                            </div>

                            {/* Meals for the day */}
                            <div className="p-4 space-y-4">
                                {Object.entries(MEAL_SECTIONS).map(([mealType, fields]) => (
                                    <div key={mealType} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                                        <h4 className="text-sm font-semibold text-indigo-900 mb-2 uppercase tracking-wide">
                                            {mealType}
                                        </h4>
                                        <div className="space-y-2">
                                            {fields.map((field) => {
                                                const content = getMealData(dateStr, mealType, field);
                                                const isSelected = isFieldSelected(dateStr, mealType, field);
                                                return (
                                                    <div 
                                                        key={field} 
                                                        className={`flex justify-between items-start p-2 rounded transition-colors ${
                                                            isSelected 
                                                                ? 'bg-green-100 border-l-4 border-green-500' 
                                                                : 'bg-transparent'
                                                        }`}
                                                    >
                                                        <span className={`text-xs font-medium capitalize min-w-[80px] ${
                                                            isSelected ? 'text-green-800' : 'text-gray-600'
                                                        }`}>
                                                            {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                        </span>
                                                        <span className={`text-sm text-right flex-1 ml-2 ${
                                                            isSelected ? 'text-green-900 font-semibold' : 'text-gray-900'
                                                        }`}>
                                                            {content || '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto">
                    <div className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
                        {/* Header */}
                        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                            <div className="px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-200">
                                Meal
                            </div>
                            {dates.map((date, index) => (
                                <div key={index} className="px-3 py-3 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="text-sm font-medium text-gray-900">
                                        {DAY_NAMES_SHORT[date.getDay() === 0 ? 0 : date.getDay()]} / {date.getDate() + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Meal Sections */}
                        {Object.entries(MEAL_SECTIONS).map(([mealType, fields]) => (
                            <div key={mealType}>
                                {/* Meal Type Header */}
                                <div className="grid grid-cols-8 border-b border-gray-200 bg-indigo-50">
                                    <div className="px-4 py-2 text-sm font-semibold text-indigo-900 border-r border-gray-200 flex items-center">
                                        {mealType}
                                    </div>
                                    {dates.map((date, index) => (
                                        <div key={index} className="px-2 py-2 text-xs font-medium text-indigo-700 text-center border-r border-gray-200 last:border-r-0">
                                            {mealType}
                                        </div>
                                    ))}
                                </div>

                                {/* Meal Fields */}
                                {fields.map((field) => (
                                    <div key={field} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50">
                                        <div className="px-4 py-2 text-xs text-gray-600 border-r border-gray-200 flex items-center">
                                            {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </div>
                                        {dates.map((date, index) => {
                                            const dateStr = date.toISOString().split('T')[0];
                                            const content = getMealData(dateStr, mealType, field);
                                            const isSelected = isFieldSelected(dateStr, mealType, field);

                                            return (
                                                <div
                                                    key={index}
                                                    className={`px-2 py-2 text-xs border-r border-gray-200 last:border-r-0 min-h-[40px] flex items-center justify-center transition-colors ${
                                                        isSelected 
                                                            ? 'bg-green-100 border-l-4 border-green-500 font-semibold text-green-900' 
                                                            : 'text-gray-900'
                                                    }`}
                                                >
                                                    <span className="text-center break-words">
                                                        {content || '-'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
