import { getWeeklyMenu } from "@/strapi/menuSchedule/getWeeklyMenu";
import { useEffect, useState } from "react";

export default function WeeklyMenuGridNew() {
    const [menuData, setMenuData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getWeeklyMenu();
                console.log(data);
                setMenuData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Create date mapping for easy lookup
    const dateToSchedule = menuData.reduce((acc, item) => {
        acc[item.Date] = item;
        return acc;
    }, {});

    // Get dates for header (Monday to Sunday)
    const dates = menuData.map(item => new Date(item.Date));
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Helper function to get meal data
    const getMealData = (date, mealType, field) => {
        const schedule = dateToSchedule[date];
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

    // Define meal sections with their fields
    const mealSections = {
        Breakfast: ['feature'],
        Lunch: ['soup', 'salad', 'option_1', 'option_2', 'dessert'],
        Supper: ['option_1', 'option_2', 'side_1', 'side_2', 'side_3', 'side_4']
    };

    if (loading) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading weekly menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-lg font-semibold">Error loading menu data</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (menuData.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <p className="text-gray-600">No menu data available for this week</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                        <div className="px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-200">
                            Meal
                        </div>
                        {dates.map((date, index) => (
                            <div key={index} className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-sm font-medium text-gray-900">
                                    {dayNamesShort[date.getDay() === 0 ? 0 : date.getDay()]} / {date.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Meal Sections */}
                    {Object.entries(mealSections).map(([mealType, fields]) => (
                        <div key={mealType}>
                            {/* Meal Type Header */}
                            <div className="grid grid-cols-8 border-b border-gray-200 bg-blue-50">
                                <div className="px-4 py-2 text-sm font-semibold text-blue-900 border-r border-gray-200 flex items-center">
                                    {mealType}
                                </div>
                                {dates.map((date, index) => (
                                    <div key={index} className="px-2 py-2 text-xs font-medium text-blue-700 text-center border-r border-gray-200 last:border-r-0">
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

                                        return (
                                            <div
                                                key={index}
                                                className="px-2 py-2 text-xs text-gray-900 border-r border-gray-200 last:border-r-0 min-h-[40px] flex items-center justify-center"
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
    );
}
