"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* PREMIUM cartoon cast — full body, 3D-shaded vector art              */
/* Every character gets gradient volume, rim light, specular           */
/* highlights, a soft contact shadow, and can be recoloured.           */
/* ------------------------------------------------------------------ */

export type CharacterId = "owl" | "lion" | "elephant" | "turtle" | "cat" | "rabbit";

type Props = {
  size?: number;
  className?: string;
  animate?: boolean;
  colors?: Partial<Record<"body" | "belly" | "accent" | "detail", string>>;
  outline?: boolean;
  /** show the premium contact shadow + glow */
  shadow?: boolean;
};

export const CHARACTERS: { id: CharacterId; name: string; emoji: string; bio: string }[] = [
  { id: "owl", name: "Zehn the Owl", emoji: "🦉", bio: "The wise teacher who loves books and asks big questions." },
  { id: "lion", name: "Leo the Lion", emoji: "🦁", bio: "The brave friend who is always first to try something new." },
  { id: "elephant", name: "Ellie the Elephant", emoji: "🐘", bio: "The gentle giant with an amazing memory and a long trunk." },
  { id: "turtle", name: "Tito the Turtle", emoji: "🐢", bio: "The slow and careful thinker who never gives up." },
  { id: "cat", name: "Mimi the Cat", emoji: "🐱", bio: "The curious explorer who notices every little detail." },
  { id: "rabbit", name: "Rosie the Rabbit", emoji: "🐰", bio: "The quick, happy hopper who loves counting and colours." },
];

/* --------------------------- helpers ------------------------------ */

const uid = (n: string) => `p-${n}`;

/** Vertical volume gradient — light at top-left, deeper at bottom-right. */
function Vol({ id, base, outline }: { id: string; base: string; outline?: boolean }) {
  if (outline) return null;
  return (
    <>
      <linearGradient id={id} x1="0.2" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
        <stop offset="42%" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="78%" stopColor="#000000" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
      </linearGradient>
      <radialGradient id={`${id}-hl`} cx="0.32" cy="0.24" r="0.5">
        <stop offset="0%" stopColor={base} stopOpacity="0" />
        <stop offset="100%" stopColor={base} />
      </radialGradient>
    </>
  );
}

/** Soft ellipse shadow on the ground. */
function GroundShadow() {
  return (
    <ellipse cx="100" cy="252" rx="62" ry="9" fill="#0f172a" opacity="0.16" />
  );
}

/** Apply the volume overlay to a shape. */
const vol = (id: string) => `url(#${uid(id)})`;

const shade = (base: string, outline?: boolean) => (outline ? "none" : base);

/* ------------------------------ OWL ------------------------------- */
function Owl({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#7c5cff";
  const belly = colors.belly ?? "#f3edff";
  const accent = colors.accent ?? "#ffb020";
  const K = "owl";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <Vol id={`${K}-e`} base={belly} outline={outline} />
      <defs>
        <linearGradient id={`${K}-w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade("#9b83ff", outline)} />
          <stop offset="100%" stopColor={shade("#5b3df0", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      <g stroke="#2b2342" strokeWidth={outline ? 3.4 : 3} strokeLinejoin="round">
        {/* feet */}
        <path d="M74 222 q-14 5 -18 15 h40 z" fill={shade(accent, outline)} />
        <path d="M126 222 q14 5 18 15 h-40 z" fill={shade(accent, outline)} />
        {/* tail */}
        <path d="M100 204 q-26 18 -34 36 q22 2 34 -10 q12 12 34 10 q-8 -18 -34 -36z" fill={`url(#${K}-w)`} />
        {/* wings */}
        <ellipse cx="36" cy="150" rx="21" ry="46" fill={`url(#${K}-w)`} transform="rotate(-13 36 150)" />
        <ellipse cx="164" cy="150" rx="21" ry="46" fill={`url(#${K}-w)`} transform="rotate(13 164 150)" />
        {/* body */}
        <ellipse cx="100" cy="146" rx="66" ry="80" fill={`url(#${K}-w)`} strokeWidth={3.6} />
        <ellipse cx="100" cy="146" rx="66" ry="80" fill={vol(`${K}-b`)} stroke="none" />
        {/* ear tufts */}
        <path d="M52 78 L62 38 L84 66 Z" fill={`url(#${K}-w)`} />
        <path d="M148 78 L138 38 L116 66 Z" fill={`url(#${K}-w)`} />
      </g>
      {/* belly */}
      <ellipse cx="100" cy="164" rx="44" ry="58" fill={shade(belly, outline)} stroke="#2b2342" strokeWidth="2.6" />
      {!outline && <ellipse cx="100" cy="164" rx="44" ry="58" fill={vol(`${K}-e`)} />}
      {/* face disc */}
      <ellipse cx="100" cy="104" rx="53" ry="43" fill={shade(belly, outline)} stroke="#2b2342" strokeWidth="2.6" opacity="0.95" />
      {/* eyes */}
      <g>
        <circle cx="80" cy="100" r="18" fill={outline ? "none" : "#fff"} stroke="#2b2342" strokeWidth="2.6" />
        <circle cx="120" cy="100" r="18" fill={outline ? "none" : "#fff"} stroke="#2b2342" strokeWidth="2.6" />
        {!outline && (
          <>
            <circle cx="81" cy="102" r="8" fill="#2b2342" />
            <circle cx="119" cy="102" r="8" fill="#2b2342" />
            <circle cx="78" cy="98" r="3" fill="#fff" />
            <circle cx="116" cy="98" r="3" fill="#fff" />
            <circle cx="85" cy="106" r="1.6" fill="#fff" opacity=".8" />
            <circle cx="123" cy="106" r="1.6" fill="#fff" opacity=".8" />
          </>
        )}
      </g>
      {/* beak */}
      <path d="M100 116 L87 131 Q100 144 113 131 Z" fill={shade(accent, outline)} stroke="#2b2342" strokeWidth="3" strokeLinejoin="round" />
      {!outline && <path d="M100 118 L91 129 Q100 138 108 129 Z" fill="#fff" opacity=".28" />}
      {/* cheeks */}
      {!outline && (
        <>
          <circle cx="55" cy="116" r="8" fill="#ff9fc6" opacity=".75" />
          <circle cx="145" cy="116" r="8" fill="#ff9fc6" opacity=".75" />
        </>
      )}
      {/* badge star */}
      <path d="M100 178 l5.5 11 12 1.7 -8.7 8.3 2.1 12 -10.9 -5.7 -10.9 5.7 2.1 -12 -8.7 -8.3 12 -1.7z"
        fill={shade(accent, outline)} stroke="#2b2342" strokeWidth="2.4" strokeLinejoin="round" />
      {!outline && <path d="M100 180 l4 8 8.5 1.2" stroke="#fff" strokeWidth="2" opacity=".55" fill="none" />}
      {/* rim light */}
      {!outline && (
        <path d="M44 130 q-10 40 6 74" stroke="#fff" strokeWidth="3" opacity=".3" fill="none" strokeLinecap="round" />
      )}
    </Shell>
  );
}

/* ----------------------------- LION ------------------------------- */
function Lion({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#f5a524";
  const belly = colors.belly ?? "#ffe9bd";
  const accent = colors.accent ?? "#d05a12";
  const K = "lion";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <defs>
        <linearGradient id={`${K}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade("#f0854a", outline)} />
          <stop offset="100%" stopColor={shade("#a83c07", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      {/* tail */}
      <path d="M158 200 q38 -10 30 -52" fill="none" stroke="#3a2410" strokeWidth="7" strokeLinecap="round" />
      <circle cx="188" cy="146" r="13" fill={`url(#${K}-m)`} stroke="#3a2410" strokeWidth="2.8" />
      <g stroke="#3a2410" strokeWidth="3" strokeLinejoin="round">
        {/* legs */}
        <rect x="62" y="196" width="27" height="46" rx="13.5" fill={shade(body, outline)} />
        <rect x="111" y="196" width="27" height="46" rx="13.5" fill={shade(body, outline)} />
      </g>
      {!outline && <><rect x="62" y="196" width="27" height="46" rx="13.5" fill={vol(`${K}-b`)} /><rect x="111" y="196" width="27" height="46" rx="13.5" fill={vol(`${K}-b`)} /></>}
      <ellipse cx="75" cy="242" rx="17" ry="10" fill={shade(belly, outline)} stroke="#3a2410" strokeWidth="2.8" />
      <ellipse cx="125" cy="242" rx="17" ry="10" fill={shade(belly, outline)} stroke="#3a2410" strokeWidth="2.8" />
      {/* mane */}
      {Array.from({ length: 13 }).map((_, i) => {
        const a = (i / 13) * Math.PI * 2;
        return (
          <circle key={i} cx={100 + Math.cos(a) * 55} cy={96 + Math.sin(a) * 55} r="20"
            fill={`url(#${K}-m)`} stroke="#3a2410" strokeWidth="2.4" />
        );
      })}
      {/* body */}
      <ellipse cx="100" cy="172" rx="55" ry="49" fill={shade(body, outline)} stroke="#3a2410" strokeWidth="3.4" />
      {!outline && <ellipse cx="100" cy="172" rx="55" ry="49" fill={vol(`${K}-b`)} />}
      <ellipse cx="100" cy="184" rx="34" ry="33" fill={shade(belly, outline)} stroke="#3a2410" strokeWidth="2.4" />
      {/* head */}
      <circle cx="68" cy="62" r="14" fill={shade(body, outline)} stroke="#3a2410" strokeWidth="2.8" />
      <circle cx="132" cy="62" r="14" fill={shade(body, outline)} stroke="#3a2410" strokeWidth="2.8" />
      <circle cx="100" cy="96" r="45" fill={shade(body, outline)} stroke="#3a2410" strokeWidth="3.4" />
      {!outline && <circle cx="100" cy="96" r="45" fill={vol(`${K}-b`)} />}
      {/* eyes */}
      <circle cx="84" cy="90" r="12" fill={outline ? "none" : "#fff"} stroke="#3a2410" strokeWidth="2.4" />
      <circle cx="116" cy="90" r="12" fill={outline ? "none" : "#fff"} stroke="#3a2410" strokeWidth="2.4" />
      {!outline && (
        <>
          <circle cx="85" cy="92" r="5.5" fill="#3a2410" />
          <circle cx="115" cy="92" r="5.5" fill="#3a2410" />
          <circle cx="83" cy="89" r="2" fill="#fff" />
          <circle cx="113" cy="89" r="2" fill="#fff" />
        </>
      )}
      {/* muzzle */}
      <ellipse cx="100" cy="117" rx="27" ry="20" fill={shade(belly, outline)} stroke="#3a2410" strokeWidth="2.4" />
      <path d="M100 107 L91 114 Q100 122 109 114 Z" fill={outline ? "none" : "#3a2410"} />
      <path d="M100 120 v7 M100 127 q-8 7 -15 0 M100 127 q8 7 15 0" fill="none" stroke="#3a2410" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M74 116 h-19 M74 122 h-17 M126 116 h19 M126 122 h17" stroke="#3a2410" strokeWidth="2" strokeLinecap="round" />
      {!outline && <><circle cx="66" cy="100" r="6" fill="#fca5a5" opacity=".6" /><circle cx="134" cy="100" r="6" fill="#fca5a5" opacity=".6" /></>}
    </Shell>
  );
}

/* --------------------------- ELEPHANT ----------------------------- */
function Elephant({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#9aa6c8";
  const belly = colors.belly ?? "#e7ecf8";
  const accent = colors.accent ?? "#ffc7dd";
  const K = "el";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <defs>
        <linearGradient id={`${K}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade("#b4beDB", outline)} />
          <stop offset="100%" stopColor={shade("#6f7ba0", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      <path d="M154 192 q26 12 20 36" fill="none" stroke="#38405c" strokeWidth="6" strokeLinecap="round" />
      <g stroke="#38405c" strokeWidth="3" strokeLinejoin="round">
        <rect x="54" y="188" width="31" height="54" rx="15" fill={shade(body, outline)} />
        <rect x="115" y="188" width="31" height="54" rx="15" fill={shade(body, outline)} />
      </g>
      {!outline && <><rect x="54" y="188" width="31" height="54" rx="15" fill={vol(`${K}-b`)} /><rect x="115" y="188" width="31" height="54" rx="15" fill={vol(`${K}-b`)} /></>}
      <path d="M54 232 h31 v12 h-31z M115 232 h31 v12 h-31z" fill={shade(belly, outline)} stroke="#38405c" strokeWidth="2.4" />
      {/* body */}
      <ellipse cx="100" cy="162" rx="59" ry="53" fill={`url(#${K}-t)`} stroke="#38405c" strokeWidth="3.4" />
      {!outline && <ellipse cx="100" cy="162" rx="59" ry="53" fill={vol(`${K}-b`)} />}
      <ellipse cx="100" cy="176" rx="35" ry="35" fill={shade(belly, outline)} stroke="#38405c" strokeWidth="2.4" />
      {/* ears */}
      <ellipse cx="44" cy="94" rx="31" ry="40" fill={`url(#${K}-t)`} stroke="#38405c" strokeWidth="3" transform="rotate(-15 44 94)" />
      <ellipse cx="44" cy="94" rx="19" ry="25" fill={shade(accent, outline)} opacity={outline ? 0 : 0.65} transform="rotate(-15 44 94)" />
      <ellipse cx="156" cy="94" rx="31" ry="40" fill={`url(#${K}-t)`} stroke="#38405c" strokeWidth="3" transform="rotate(15 156 94)" />
      <ellipse cx="156" cy="94" rx="19" ry="25" fill={shade(accent, outline)} opacity={outline ? 0 : 0.65} transform="rotate(15 156 94)" />
      {/* head */}
      <circle cx="100" cy="92" r="43" fill={`url(#${K}-t)`} stroke="#38405c" strokeWidth="3.4" />
      {!outline && <circle cx="100" cy="92" r="43" fill={vol(`${K}-b`)} />}
      {/* eyes */}
      <circle cx="84" cy="84" r="11" fill={outline ? "none" : "#fff"} stroke="#38405c" strokeWidth="2.4" />
      <circle cx="116" cy="84" r="11" fill={outline ? "none" : "#fff"} stroke="#38405c" strokeWidth="2.4" />
      {!outline && (
        <>
          <circle cx="85" cy="86" r="5" fill="#38405c" />
          <circle cx="115" cy="86" r="5" fill="#38405c" />
          <circle cx="83" cy="83" r="1.8" fill="#fff" />
          <circle cx="113" cy="83" r="1.8" fill="#fff" />
        </>
      )}
      {/* trunk with volume */}
      <path d="M100 102 q-9 28 2 45 q11 17 -4 26" fill="none" stroke="#38405c" strokeWidth="20" strokeLinecap="round" />
      <path d="M100 102 q-9 28 2 45 q11 17 -4 26" fill="none" stroke={`url(#${K}-t)`} strokeWidth="14" strokeLinecap="round" />
      {!outline && <path d="M98 104 q-6 26 2 42" stroke="#fff" strokeWidth="3" opacity=".3" fill="none" strokeLinecap="round" />}
      {/* tusks */}
      <path d="M80 112 q-9 13 -3 22" fill="none" stroke="#fff8e7" strokeWidth="7.5" strokeLinecap="round" />
      <path d="M120 112 q9 13 3 22" fill="none" stroke="#fff8e7" strokeWidth="7.5" strokeLinecap="round" />
      {!outline && <><circle cx="63" cy="98" r="8" fill={accent} opacity=".7" /><circle cx="137" cy="98" r="8" fill={accent} opacity=".7" /></>}
    </Shell>
  );
}

/* ---------------------------- TURTLE ------------------------------ */
function Turtle({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#4ade80";
  const belly = colors.belly ?? "#dcfce7";
  const accent = colors.accent ?? "#15803d";
  const K = "tu";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <defs>
        <linearGradient id={`${K}-s`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={shade("#22c55e", outline)} />
          <stop offset="100%" stopColor={shade("#14532d", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      <g stroke="#14532d" strokeWidth="3" strokeLinejoin="round">
        <ellipse cx="49" cy="197" rx="21" ry="16" fill={shade(body, outline)} />
        <ellipse cx="151" cy="197" rx="21" ry="16" fill={shade(body, outline)} />
        <ellipse cx="66" cy="223" rx="19" ry="15" fill={shade(body, outline)} />
        <ellipse cx="134" cy="223" rx="19" ry="15" fill={shade(body, outline)} />
      </g>
      <path d="M100 224 q7 15 0 21 q-7 -6 0 -21z" fill={shade(body, outline)} stroke="#14532d" strokeWidth="2.4" />
      {/* shell */}
      <ellipse cx="100" cy="167" rx="71" ry="57" fill={`url(#${K}-s)`} stroke="#14532d" strokeWidth="3.4" />
      <ellipse cx="100" cy="171" rx="53" ry="41" fill={shade(body, outline)} stroke="#14532d" strokeWidth="2.4" />
      {!outline && <ellipse cx="100" cy="171" rx="53" ry="41" fill={vol(`${K}-b`)} />}
      {[[100, 152], [71, 180], [129, 180], [100, 194]].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy - 16} l15 10 -5.5 17 h-19 l-5.5 -17z`}
          fill={shade(belly, outline)} stroke="#14532d" strokeWidth="2.4" strokeLinejoin="round" />
      ))}
      {!outline && <path d="M44 150 q-8 22 2 40" stroke="#fff" strokeWidth="3" opacity=".25" fill="none" strokeLinecap="round" />}
      {/* head */}
      <circle cx="100" cy="82" r="41" fill={shade(body, outline)} stroke="#14532d" strokeWidth="3.4" />
      {!outline && <circle cx="100" cy="82" r="41" fill={vol(`${K}-b`)} />}
      {/* glasses */}
      <circle cx="84" cy="78" r="17" fill={outline ? "none" : "#fff"} stroke="#14532d" strokeWidth="3.2" />
      <circle cx="116" cy="78" r="17" fill={outline ? "none" : "#fff"} stroke="#14532d" strokeWidth="3.2" />
      <path d="M100 78 h1" stroke="#14532d" strokeWidth="3.2" />
      <path d="M67 76 h-11 M133 76 h11" stroke="#14532d" strokeWidth="3.2" strokeLinecap="round" />
      {!outline && (
        <>
          <circle cx="86" cy="80" r="6.5" fill="#14532d" />
          <circle cx="114" cy="80" r="6.5" fill="#14532d" />
          <circle cx="84" cy="77" r="2.2" fill="#fff" />
          <circle cx="112" cy="77" r="2.2" fill="#fff" />
        </>
      )}
      <path d="M88 102 q12 11 24 0" fill="none" stroke="#14532d" strokeWidth="3" strokeLinecap="round" />
      {!outline && <><circle cx="61" cy="92" r="7" fill="#fca5a5" opacity=".7" /><circle cx="139" cy="92" r="7" fill="#fca5a5" opacity=".7" /></>}
    </Shell>
  );
}

/* ------------------------------ CAT ------------------------------- */
function Cat({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#fb923c";
  const belly = colors.belly ?? "#fff3e4";
  const accent = colors.accent ?? "#ea580c";
  const K = "cat";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <defs>
        <linearGradient id={`${K}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade("#fdba74", outline)} />
          <stop offset="100%" stopColor={shade("#c2410c", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      <path d="M156 206 q36 -6 30 -46" fill="none" stroke="#452008" strokeWidth="7" strokeLinecap="round" />
      <g stroke="#452008" strokeWidth="3" strokeLinejoin="round">
        <rect x="66" y="198" width="25" height="43" rx="12.5" fill={shade(body, outline)} />
        <rect x="109" y="198" width="25" height="43" rx="12.5" fill={shade(body, outline)} />
      </g>
      {!outline && <><rect x="66" y="198" width="25" height="43" rx="12.5" fill={vol(`${K}-b`)} /><rect x="109" y="198" width="25" height="43" rx="12.5" fill={vol(`${K}-b`)} /></>}
      <ellipse cx="78" cy="241" rx="16" ry="9.5" fill={shade(belly, outline)} stroke="#452008" strokeWidth="2.6" />
      <ellipse cx="122" cy="241" rx="16" ry="9.5" fill={shade(belly, outline)} stroke="#452008" strokeWidth="2.6" />
      <ellipse cx="100" cy="176" rx="51" ry="47" fill={`url(#${K}-g)`} stroke="#452008" strokeWidth="3.4" />
      {!outline && <ellipse cx="100" cy="176" rx="51" ry="47" fill={vol(`${K}-b`)} />}
      <ellipse cx="100" cy="188" rx="31" ry="30" fill={shade(belly, outline)} stroke="#452008" strokeWidth="2.4" />
      {!outline && <path d="M62 160 h22 M62 176 h18 M62 192 h20" stroke={accent} strokeWidth="5.5" strokeLinecap="round" />}
      {/* head */}
      <circle cx="100" cy="100" r="45" fill={`url(#${K}-g)`} stroke="#452008" strokeWidth="3.4" />
      {!outline && <circle cx="100" cy="100" r="45" fill={vol(`${K}-b`)} />}
      <path d="M62 72 L58 32 L92 56 Z" fill={`url(#${K}-g)`} stroke="#452008" strokeWidth="3" strokeLinejoin="round" />
      <path d="M138 72 L142 32 L108 56 Z" fill={`url(#${K}-g)`} stroke="#452008" strokeWidth="3" strokeLinejoin="round" />
      <path d="M68 66 L66 44 L84 58 Z" fill={outline ? "none" : "#ffc7dd"} />
      <path d="M132 66 L134 44 L116 58 Z" fill={outline ? "none" : "#ffc7dd"} />
      <circle cx="84" cy="96" r="13" fill={outline ? "none" : "#fff"} stroke="#452008" strokeWidth="2.6" />
      <circle cx="116" cy="96" r="13" fill={outline ? "none" : "#fff"} stroke="#452008" strokeWidth="2.6" />
      {!outline && (
        <>
          <circle cx="85" cy="98" r="6" fill="#452008" />
          <circle cx="115" cy="98" r="6" fill="#452008" />
          <circle cx="83" cy="94" r="2.2" fill="#fff" />
          <circle cx="113" cy="94" r="2.2" fill="#fff" />
        </>
      )}
      <path d="M100 112 L93 119 Q100 127 107 119 Z" fill={outline ? "none" : "#ffc7dd"} stroke="#452008" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M100 124 q-9 8 -16 1 M100 124 q9 8 16 1" fill="none" stroke="#452008" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M72 112 h-20 M72 120 h-18 M128 112 h20 M128 120 h18" stroke="#452008" strokeWidth="2" strokeLinecap="round" />
    </Shell>
  );
}

/* ---------------------------- RABBIT ------------------------------ */
function Rabbit({ colors = {}, outline, shadow = true, ...rest }: Props) {
  const body = colors.body ?? "#f9a8d4";
  const belly = colors.belly ?? "#fff5fa";
  const accent = colors.accent ?? "#ec4899";
  const K = "rb";
  return (
    <Shell {...rest} shadow={shadow} outline={outline} k={K}>
      <Vol id={`${K}-b`} base={body} outline={outline} />
      <defs>
        <linearGradient id={`${K}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade("#fbcfe8", outline)} />
          <stop offset="100%" stopColor={shade("#db2777", outline)} />
        </linearGradient>
      </defs>
      {shadow && <GroundShadow />}
      <circle cx="158" cy="208" r="17" fill={shade(belly, outline)} stroke="#4a1d35" strokeWidth="2.8" />
      <g stroke="#4a1d35" strokeWidth="3" strokeLinejoin="round">
        <rect x="68" y="196" width="25" height="44" rx="12.5" fill={shade(body, outline)} />
        <rect x="107" y="196" width="25" height="44" rx="12.5" fill={shade(body, outline)} />
      </g>
      {!outline && <><rect x="68" y="196" width="25" height="44" rx="12.5" fill={vol(`${K}-b`)} /><rect x="107" y="196" width="25" height="44" rx="12.5" fill={vol(`${K}-b`)} /></>}
      <ellipse cx="80" cy="240" rx="18" ry="10" fill={shade(belly, outline)} stroke="#4a1d35" strokeWidth="2.6" />
      <ellipse cx="120" cy="240" rx="18" ry="10" fill={shade(belly, outline)} stroke="#4a1d35" strokeWidth="2.6" />
      <ellipse cx="100" cy="174" rx="49" ry="47" fill={`url(#${K}-g)`} stroke="#4a1d35" strokeWidth="3.4" />
      {!outline && <ellipse cx="100" cy="174" rx="49" ry="47" fill={vol(`${K}-b`)} />}
      <ellipse cx="100" cy="186" rx="30" ry="29" fill={shade(belly, outline)} stroke="#4a1d35" strokeWidth="2.4" />
      {/* ears */}
      <ellipse cx="76" cy="44" rx="15" ry="40" fill={`url(#${K}-g)`} stroke="#4a1d35" strokeWidth="3" transform="rotate(-10 76 44)" />
      <ellipse cx="76" cy="46" rx="7.5" ry="27" fill={shade(accent, outline)} opacity={outline ? 0 : 0.42} transform="rotate(-10 76 46)" />
      <ellipse cx="124" cy="44" rx="15" ry="40" fill={`url(#${K}-g)`} stroke="#4a1d35" strokeWidth="3" transform="rotate(10 124 44)" />
      <ellipse cx="124" cy="46" rx="7.5" ry="27" fill={shade(accent, outline)} opacity={outline ? 0 : 0.42} transform="rotate(10 124 46)" />
      {/* head */}
      <circle cx="100" cy="104" r="43" fill={`url(#${K}-g)`} stroke="#4a1d35" strokeWidth="3.4" />
      {!outline && <circle cx="100" cy="104" r="43" fill={vol(`${K}-b`)} />}
      <circle cx="84" cy="100" r="12" fill={outline ? "none" : "#fff"} stroke="#4a1d35" strokeWidth="2.6" />
      <circle cx="116" cy="100" r="12" fill={outline ? "none" : "#fff"} stroke="#4a1d35" strokeWidth="2.6" />
      {!outline && (
        <>
          <circle cx="85" cy="102" r="5.5" fill="#4a1d35" />
          <circle cx="115" cy="102" r="5.5" fill="#4a1d35" />
          <circle cx="83" cy="98" r="2" fill="#fff" />
          <circle cx="113" cy="98" r="2" fill="#fff" />
        </>
      )}
      <path d="M100 116 L94 122 Q100 129 106 122 Z" fill={shade(accent, outline)} stroke="#4a1d35" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M100 127 v5 M100 132 q-7 6 -13 1 M100 132 q7 6 13 1" fill="none" stroke="#4a1d35" strokeWidth="2.4" strokeLinecap="round" />
      {!outline && (
        <>
          <rect x="93" y="136" width="6" height="10" rx="2.5" fill="#fff" stroke="#4a1d35" strokeWidth="1.4" />
          <rect x="101" y="136" width="6" height="10" rx="2.5" fill="#fff" stroke="#4a1d35" strokeWidth="1.4" />
          <circle cx="64" cy="112" r="8" fill="#f472b6" opacity=".6" />
          <circle cx="136" cy="112" r="8" fill="#f472b6" opacity=".6" />
        </>
      )}
    </Shell>
  );
}

const MAP: Record<CharacterId, (p: Props) => React.JSX.Element> = { owl: Owl, lion: Lion, elephant: Elephant, turtle: Turtle, cat: Cat, rabbit: Rabbit };

/* ---------------------------- wrapper ----------------------------- */

function Shell({
  size = 100, className = "", animate = true, shadow, outline, k, children,
}: Props & { k: string; children: React.ReactNode }) {
  const body = animate
    ? { animate: { y: [0, -6, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const } }
    : {};
  return (
    <motion.div className={className} style={{ width: size, height: size }} {...body}>
      <svg viewBox="0 0 200 260" width={size} height={size} aria-hidden>
        <defs>
          <Vol id={`${k}-b`} base="#7c5cff" outline={outline} />
        </defs>
        {children}
      </svg>
    </motion.div>
  );
}

export function Character({ id, ...props }: Props & { id: CharacterId }) {
  const C = MAP[id] ?? Owl;
  return <C {...props} />;
}

/** OUTLINE version for tracing / colouring-in. */
export function CharacterOutline({ id, ...props }: Props & { id: CharacterId }) {
  const C = MAP[id] ?? Owl;
  return <C {...props} outline shadow={false} />;
}

/** Premium cast row. */
export function CharacterCast({ size = 110, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex flex-wrap items-end justify-center gap-1 ${className}`}>
      {CHARACTERS.map((c, i) => (
        <motion.div key={c.id}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.09, type: "spring", bounce: 0.45 }}>
          <motion.div animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3 + i * 0.28, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
            <Character id={c.id} size={size} animate={false} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
