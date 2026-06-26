import { useEffect, useMemo, useRef, useState } from "react";
import { RiMoonLine, RiSunLine } from "react-icons/ri";

const MOODS = [
  {
    id: "very_unpleasant",
    label: "非常不愉快",
    whisper: "让低落先有一处停靠",
    color: "oklch(0.68 0.17 286)",
    icon: "/mood-icons/mood-very-unpleasant.png",
    poem: {
      title: "Hope is the thing with feathers",
      author: "Emily Dickinson",
      lines: [
        ["Hope is the thing with feathers", "希望像有羽翼的事物"],
        ["That perches in the soul", "安静停在灵魂里"],
        ["And sings the tune without the words", "不需要词语，也能继续歌唱"],
        ["And never stops at all", "它从不真正停下"],
      ],
    },
  },
  {
    id: "unpleasant",
    label: "有点不愉快",
    whisper: "把皱起的心慢慢放平",
    color: "oklch(0.68 0.16 236)",
    icon: "/mood-icons/mood-unpleasant.png",
    poem: {
      title: "Song of Myself",
      author: "Walt Whitman",
      lines: [
        ["I exist as I am, that is enough", "我如我所是，已然足够"],
        ["If no other in the world be aware", "即使世界尚未察觉"],
        ["I sit and look out", "我仍静坐，向外望去"],
        ["And find the day returning", "看见白昼一点点回来"],
      ],
    },
  },
  {
    id: "neutral",
    label: "一般",
    whisper: "普通的一刻也可以发光",
    color: "oklch(0.84 0.13 86)",
    icon: "/mood-icons/mood-neutral.png",
    poem: {
      title: "The Tempest",
      author: "William Shakespeare",
      lines: [
        ["We are such stuff", "我们由梦的质地织成"],
        ["As dreams are made on", "也被梦温柔托住"],
        ["And our little life", "这短短的一生"],
        ["Is rounded with a sleep", "被一场睡眠轻轻收拢"],
      ],
    },
  },
  {
    id: "pleasant",
    label: "有点愉快",
    whisper: "让这一点亮意继续展开",
    color: "oklch(0.72 0.15 145)",
    icon: "/mood-icons/mood-pleasant.png",
    poem: {
      title: "I Wandered Lonely as a Cloud",
      author: "William Wordsworth",
      lines: [
        ["And then my heart with pleasure fills", "于是我的心被欢喜盛满"],
        ["And dances with the daffodils", "同水仙一起轻轻起舞"],
        ["The inward eye remembers", "内心的眼睛记得"],
        ["A bright field after rain", "雨后一片发亮的原野"],
      ],
    },
  },
  {
    id: "very_pleasant",
    label: "非常愉快",
    whisper: "把喜悦留成一片星光",
    color: "oklch(0.78 0.16 55)",
    icon: "/mood-icons/mood-very-pleasant.png",
    poem: {
      title: "Endymion",
      author: "John Keats",
      lines: [
        ["A thing of beauty is a joy for ever", "美的事物，是长久的欢喜"],
        ["Its loveliness increases", "它的可爱会继续生长"],
        ["It will never pass into nothingness", "不会轻易散入虚无"],
        ["It keeps a bower quiet for us", "它为我们留下一处安静的荫蔽"],
      ],
    },
  },
];

const STAR_COUNT = 92;
const PARTICLE_COUNT = 38;
const METEOR_COUNT = 7;

function getBeijingPhase() {
  const forced = new URLSearchParams(window.location.search).get("phase");
  if (forced === "morning" || forced === "night") {
    return forced;
  }

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Shanghai",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );

  return hour >= 5 && hour < 18 ? "morning" : "night";
}

function makeFallingItems(moodId) {
  return Array.from({ length: 84 }, (_, index) => {
    const drift = Math.sin(index * 1.73) * 84 + Math.cos(index * 0.47) * 36;
    return {
      id: `${moodId}-${index}-${Date.now()}`,
      x: (index * 37) % 100,
      delay: (index % 19) * 0.055,
      duration: 2.25 + (index % 9) * 0.12,
      size: 18 + (index % 7) * 5,
      rotate: (index * 29) % 360,
      drift,
    };
  });
}

function App() {
  const [phase, setPhase] = useState(getBeijingPhase);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [screen, setScreen] = useState("select");
  const [fallingItems, setFallingItems] = useState([]);
  const wheelLock = useRef(0);
  const poetryTimer = useRef(null);
  const mainRef = useRef(null);

  const selectedMood = MOODS[selectedIndex];
  const greeting =
    phase === "morning"
      ? { cn: "早上好", en: "Good morning", detail: "北京时间的晨光已经抵达" }
      : { cn: "晚上好", en: "Good evening", detail: "北京时间的星夜正在发亮" };

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, index) => ({
        id: `star-${index}`,
        x: (index * 53) % 100,
        y: (index * 31) % 100,
        size: 1 + (index % 4) * 0.7,
        delay: (index % 17) * 0.19,
      })),
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
        id: `particle-${index}`,
        x: (index * 41) % 100,
        y: (index * 23) % 100,
        delay: (index % 13) * 0.23,
      })),
    [],
  );

  const meteors = useMemo(
    () =>
      Array.from({ length: METEOR_COUNT }, (_, index) => ({
        id: `meteor-${index}`,
        x: 18 + ((index * 19) % 74),
        y: 4 + ((index * 13) % 38),
        delay: 0.8 + index * 1.85,
        duration: 2.4 + (index % 3) * 0.55,
        length: 116 + (index % 4) * 34,
      })),
    [],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setPhase(getBeijingPhase()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    mainRef.current?.focus();
    return () => window.clearTimeout(poetryTimer.current);
  }, []);

  function moveSelection(direction) {
    setSelectedIndex((current) => (current + direction + MOODS.length) % MOODS.length);
  }

  function beginPoetry(index = selectedIndex) {
    if (screen !== "select") return;
    setSelectedIndex(index);
    setFallingItems(makeFallingItems(MOODS[index].id));
    setScreen("fall");
    window.clearTimeout(poetryTimer.current);
    poetryTimer.current = window.setTimeout(() => setScreen("poetry"), 2300);
  }

  function resetExperience() {
    window.clearTimeout(poetryTimer.current);
    setScreen("select");
    setFallingItems([]);
    window.setTimeout(() => mainRef.current?.focus(), 0);
  }

  function handleWheel(event) {
    if (screen !== "select") return;
    event.preventDefault();
    const now = Date.now();
    if (now - wheelLock.current < 190 || Math.abs(event.deltaY) < 8) return;
    wheelLock.current = now;
    moveSelection(event.deltaY > 0 ? 1 : -1);
  }

  function handleKeyDown(event) {
    if (screen === "select") {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        beginPoetry();
      }
    }

    if (screen === "poetry" && event.key === "Escape") {
      resetExperience();
    }
  }

  return (
    <main
      ref={mainRef}
      className={`experience phase-${phase} state-${screen}`}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ "--mood-color": selectedMood.color }}
      aria-label="情绪交互治愈网站"
    >
      <Atmosphere phase={phase} stars={stars} particles={particles} meteors={meteors} />

      <section className="welcome" aria-hidden={screen === "poetry"}>
        <div className="time-chip">
          {phase === "morning" ? <RiSunLine aria-hidden="true" /> : <RiMoonLine aria-hidden="true" />}
          <span>北京时间 · {phase === "morning" ? "晨" : "夜"}</span>
        </div>

        <div className="greeting-block">
          <p className="overline">{greeting.detail}</p>
          <h1>{greeting.cn}</h1>
          <p className="english-greeting">{greeting.en}</p>
        </div>

        <div className="mood-composer">
          <div className="mood-intro">
            <p className="overline">滚动选择此刻心情</p>
            <h2>让一个小图标，替你先落下来。</h2>
            <p>
              鼠标滚轮切换，点击任一心情直接进入诗句。也可以用方向键选择，再按 Enter。
            </p>
          </div>

          <div className="mood-wheel" role="radiogroup" aria-label="选择此刻心情">
            {MOODS.map((mood, index) => {
              const distance = index - selectedIndex;
              return (
                <button
                  className={`mood-orb ${index === selectedIndex ? "is-selected" : ""}`}
                  key={mood.id}
                  type="button"
                  role="radio"
                  aria-checked={index === selectedIndex}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => beginPoetry(index)}
                  style={{
                    "--offset": distance,
                    "--abs-offset": Math.abs(distance),
                    "--item-color": mood.color,
                  }}
                >
                  <span className="mood-icon-wrap">
                    <img className="mood-icon-image" src={mood.icon} alt="" aria-hidden="true" />
                  </span>
                  <span className="mood-label">{mood.label}</span>
                  <span className="mood-whisper">{mood.whisper}</span>
                </button>
              );
            })}
          </div>

        </div>

        <p className="care-note">这是一次美学安抚体验，不替代专业心理或医疗支持。</p>
      </section>

      <FallingLayer active={screen === "fall"} items={fallingItems} mood={selectedMood} />

      <section className="poetry-screen" aria-hidden={screen !== "poetry"}>
        <div className="poetry-haze" />
        <div className="poetry-meta">
          <span>{selectedMood.label}</span>
          <span>{selectedMood.poem.author}</span>
        </div>
        <div className="poetry-lines">
          <p className="poetry-title">{selectedMood.poem.title}</p>
          {selectedMood.poem.lines.map(([en, zh], index) => (
            <article className="poem-line" key={`${en}-${index}`} style={{ "--line": index }}>
              <p lang="en">{en}</p>
              <p lang="zh-Hans">{zh}</p>
            </article>
          ))}
        </div>
        <button className="again-button" type="button" onClick={resetExperience}>
          再选一次
        </button>
      </section>
    </main>
  );
}

function Atmosphere({ phase, stars, particles, meteors }) {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="sun-radiance" />
      <div className="sun-beam beam-one" />
      <div className="sun-beam beam-two" />
      <div className="sun-beam beam-three" />
      <div className="horizon" />
      <div className="celestial-body" />
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="cloud cloud-three" />
      <div className="astral-ring ring-one" />
      <div className="astral-ring ring-two" />
      <div className="star-field">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="particle-field">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="meteor-field">
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="meteor"
            style={{
              left: `${meteor.x}%`,
              top: `${meteor.y}%`,
              width: `${meteor.length}px`,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`,
            }}
          />
        ))}
      </div>
      <div className={`phase-label ${phase}`}>{phase === "morning" ? "dawn" : "night"}</div>
    </div>
  );
}

function FallingLayer({ active, items, mood }) {
  return (
    <div className={`falling-layer ${active ? "is-active" : ""}`} aria-hidden="true">
      {items.map((item) => (
        <img
          key={item.id}
          className="falling-icon falling-icon-image"
          src={mood.icon}
          alt=""
          style={{
            left: `${item.x}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            "--rotate": `${item.rotate}deg`,
            "--drift": `${item.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export { App };
