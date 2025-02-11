import SettingsDashboard from "../components/SettingsDashboard";

export default function Settings() {
    return (
        <div className="flex flex-col min-h-screen bg-green-200 text-gray-900">
            <div className="p-8 w-full">
                <SettingsDashboard />
            </div>
        </div>
    );
}
