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
    <section className="py-16 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-slate-900/60 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="premium-card group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={22} className={item.color} />
                  </div>
                  
                  {/* Subtle indicator dot */}
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors duration-300 group-hover:bg-primary-500" />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
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
