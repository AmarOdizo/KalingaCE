import { CalendarDays, GraduationCap, Users, Building2 } from "lucide-react";

export default function Statistics() {
  const stats = [
    {
      title: "Opening Date",
      value: "15 Jan 2024",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Passout Students",
      value: "12,580+",
      icon: GraduationCap,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Available Students",
      value: "2,350+",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Total Faculty",
      value: "85+",
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <section className="py-14 bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6"
              >
                <div
                  className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}
                >
                  <Icon size={20} className={item.color} />
                </div>

                <h3 className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {item.title}
                </h3>

                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
