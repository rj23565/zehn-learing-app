import {
  Apple, ArrowDown, ArrowLeftRight, ArrowUp, Atom,
  BadgeCheck, BatteryCharging, Bird, Bot, BookOpen, BookOpenCheck, Brain,
  Building2, Cable, Calculator, CalendarCheck, Candy, ChartColumn, Check,
  ClipboardList, Cloud, CloudRain, CloudSun, Code, Coins, Cpu, Dices, Divide,
  Droplets, Dumbbell, Earth, Equal, Eye, Factory, FileQuestion, Fish,
  FlaskConical, Flame, Flower2, Footprints, Frame, Globe, Hand, Hash, Heart,
  Keyboard, Landmark, Leaf, Lightbulb, Map,
  Monitor, MonitorPlay, Moon, Music, Orbit, Palette, PenLine, PieChart,
  PiggyBank, Power, Printer, Rabbit, Repeat, Rocket, Scale, ScanText,
  ScrollText, Search, ShieldAlert, ShieldCheck, Sigma, Snowflake, Sparkles,
  Sprout, Star, Sun, Target, TentTree, Thermometer, Timer, TreePine,
  TrendingUp, Type, Variable, Waves, WholeWord, Wind, X, Zap, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Apple, ArrowDown, ArrowLeftRight, ArrowUp, Atom, BadgeCheck, BatteryCharging,
  Bird, Bot, BookOpen, BookOpenCheck, Brain, Building2, Cable, Calculator,
  CalendarCheck, Candy, ChartColumn, Check, ClipboardList, Cloud, CloudRain,
  CloudSun, Code, Coins, Cpu, Dices, Divide, Droplets, Dumbbell, Earth, Equal,
  Eye, Factory, FileQuestion, Fish, FlaskConical, Flame, Flower2, Footprints,
  Frame, Globe, Hand, Hash, Heart, Keyboard, Landmark, Leaf, Lightbulb, Map,
  Monitor, MonitorPlay, Moon,
  Music, Orbit, Palette, PenLine, PieChart, PiggyBank, Power, Printer, Rabbit,
  Repeat, Rocket, Scale, ScanText, ScrollText, Search, ShieldAlert,
  ShieldCheck, Sigma, Snowflake, Sparkles, Sprout, Star, Sun, Target, TentTree,
  Thermometer, Timer, TreePine, TrendingUp, Type, Variable, Waves, WholeWord,
  Wind, X, Zap,
};

export function IconByName({
  name,
  className,
  strokeWidth = 2.2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = MAP[name] ?? BookOpen;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export function hasIcon(name: string) {
  return name in MAP;
}
