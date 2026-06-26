export interface DateOption {
  day: string;
  date: string;
}

export interface Activity {
  icon: string;
  label: string;
  sub: string;
}

export interface TimeOption {
  time: string;
  icon: string;
  sub: string;
}

export const DATE_OPTIONS: DateOption[] = [
  { day: "Бямба",  date: "6/27" },
  { day: "Ням",    date: "6/28" },
  { day: "Даваа",  date: "6/29" },
  { day: "Мягмар", date: "6/30" },
  { day: "Лхагва", date: "7/1"  },
  { day: "Пүрэв",  date: "7/2"  },
];

export const ACTIVITIES: Activity[] = [
  { icon: "🗺️", label: "Хотын аялал",   sub: "хамгийн сонирхолтой маршрут" },
  { icon: "🏞️", label: "Байгалийн аялал", sub: "усан оргилуур, уул"        },
  { icon: "🛥️", label: "Далайн аялал",   sub: "хөвөгч тэнгис"             },
  { icon: "🏛️", label: "Соёлын аялал",   sub: "музей, түүх"                },
  { icon: "🍜", label: "Амттаны аялал",  sub: "орчны хоол"                  },
  { icon: "🌄", label: "Гэрэл зургийн аялал", sub: "тэнгэрийн өнгө"            },
];

export const TIME_OPTIONS: TimeOption[] = [
  { time: "Өглөөний 08:00", icon: "☀️", sub: "замдаа гарах"     },
  { time: "Өдрийн 13:00",   icon: "🛫", sub: "буудалдаа шалгах" },
  { time: "Оройн 18:00",    icon: "🌇", sub: "хот тойрох"       },
  { time: "Шөнийн 21:00",   icon: "🌙", sub: "талбайд зугаалах" },
];

export const ROUTE_OPTIONS = [
  { icon: "🌆", label: "Хотын аялал", sub: "сонирхолтой газар, музей, ресторанд" },
  { icon: "🏔️", label: "Уулын аялал", sub: "байгаль, цэвэр агаар, зугаалга" },
  { icon: "🌊", label: "Далайн аялал", sub: "эргийн зугаалга, спорт, амралт" },
  { icon: "🏛️", label: "Соёлын аялал", sub: "түүх, урлаг, музейг үзэх" },
];

export const PACKING_ITEMS = [
  "Аяллын хувцас", "Усны сав", "Гутал", "Гар утасны цэнэглэгч",
  "Нарны шил", "Аяллын анхны тусламж", "Ном эсвэл хөгжим", "Аяллын бичиг баримт",
  "Фото камер", "Хоолны хөнгөн зооглол", "Банк карт",
];

export const BG_EMOJIS = ["🌍","✈️","🗺️","🌄","🌊","🏞️","🧳","🌟"];
export const SPARKLE_EMOJIS = ["✨","🌟","🌍","🗺️","🏞️","🌄","🧳"];
export const CONFETTI_EMOJIS = ["🎉","✈️","🧳","🌍","🌟","🏔️","🌊","🗺️"];
