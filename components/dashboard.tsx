"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { competitions, matches, player, teams } from "@/data/football";
import { careerStats, detailedStats, filterMatches, resultOf, streaks, teamCareerStats } from "@/lib/stats";

const resultLabel = { W: "Победа", D: "Ничья", L: "Поражение" };
const resultRu = { W: "В", D: "Н", L: "П" };

function TeamMark({ teamId, large = false }: { teamId: string; large?: boolean }) {
  const team = teams.find((item) => item.id === teamId)!;
  return <div className={`team-mark ${large ? "team-mark--large" : ""}`} style={{ "--team-accent": team.accent } as React.CSSProperties}>
    {team.crest ? <Image src={team.crest} alt={`Эмблема ${team.name}`} fill sizes={large ? "180px" : "72px"}
      style={{ objectFit: "contain", objectPosition: team.crestPosition, padding: large ? "8%" : "7%" }} /> : <span>{team.monogram}</span>}
  </div>;
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (node) node.textContent = String(value); return;
    }
    const state = { value: Number(node.textContent) || 0 };
    gsap.to(state, { value, duration: .42, ease: "power3.out", overwrite: true,
      onUpdate: () => { node.textContent = String(Math.round(state.value)); } });
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

export default function Dashboard() {
  const root = useRef<HTMLElement>(null);
  const [teamId, setTeamId] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [openMatch, setOpenMatch] = useState<string | null>(null);
  const filtered = useMemo(() => filterMatches({ teamId, competitionId }), [teamId, competitionId]);
  const detail = detailedStats(filtered);
  const run = streaks(filtered);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      const lenis = new Lenis({ lerp: .09, smoothWheel: true });
      let raf = 0;
      const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      return () => { cancelAnimationFrame(raf); lenis.destroy(); };
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .from(".hero-photo", { clipPath: "inset(10% 8% 20% 8%)", scale: .96, opacity: 0, duration: 1, ease: "power3.out" })
        .from(".hero-name", { x: -36, opacity: 0, duration: .65, ease: "power4.out" }, "-=.65")
        .from(".hero-stat", { x: 46, opacity: 0, stagger: .09, duration: .55, ease: "power4.out" }, "-=.35")
        .from(".award-line span", { y: 15, opacity: 0, stagger: .08, duration: .35, ease: "power3.out" }, "-=.25");
      gsap.to(".hero-photo img", { yPercent: 9, scale: 1.06, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .7 } });
      gsap.from(".form-node", { y: 70, opacity: 0, stagger: .09, duration: .7, ease: "power4.out",
        scrollTrigger: { trigger: ".form-track", start: "top 82%", once: true } });
      gsap.utils.toArray<HTMLElement>(".match-row").forEach((node, index) => {
        gsap.from(node, { x: index % 2 ? 44 : -44, opacity: 0, duration: .55, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 92%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".team-dossier").forEach((node, index) => {
        gsap.from(node.querySelector(".team-mark"), { rotation: index % 2 ? 7 : -7, scale: .88, opacity: 0,
          duration: .7, ease: "back.out(1.25)", scrollTrigger: { trigger: node, start: "top 82%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        const kind = node.dataset.reveal;
        gsap.from(node, { y: kind === "quiet" ? 18 : 34, opacity: 0,
          clipPath: kind === "chapter" ? "inset(0 0 14% 0)" : "inset(0 0 0% 0)",
          duration: kind === "chapter" ? .65 : .42, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true } });
      });
      gsap.fromTo(".tactical-path", { strokeDashoffset: 1100 }, { strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: .6 } });
    }, root);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".match-list", { opacity: .35, filter: "blur(3px)", y: 8 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: .24, ease: "power3.out", overwrite: true });
  }, [teamId, competitionId]);

  return <main ref={root} className="site-shell">
    <svg className="tactical-overlay" aria-hidden="true" viewBox="0 0 1000 4000" preserveAspectRatio="none">
      <path className="tactical-path" pathLength="1100" d="M845 20 C690 250 870 410 655 640 S390 950 580 1250 S750 1650 450 1910 S170 2360 480 2710 S800 3180 510 3970" />
    </svg>

    <header className="topbar">
      <a href="#" className="brand" aria-label="В начало"><b>SL</b><span>Персональный матч-центр</span></a>
      <nav aria-label="Навигация">
        <a href="#matches">Матчи</a><a href="#teams">Команды</a><a href="#records">Рекорды</a>
      </nav>
      <span className="update">Обновлено 04.08.2026</span>
    </header>

    <section className="hero">
      <div className="hero-photo">
        <Image src={player.photo} alt="Сергей Лапин на футбольном поле под дождём" fill priority sizes="(max-width: 800px) 100vw, 68vw" />
        <div className="photo-wash" />
      </div>
      <div className="hero-index" aria-hidden="true">11</div>
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot" /> Профиль игрока · {player.position}</div>
        <h1 className="hero-name">Сергей<br />Лапин</h1>
      </div>
      <div className="hero-scoreboard" aria-label="Главная статистика">
        <div className="hero-stat hero-stat--primary"><span>Матчи</span><strong><AnimatedNumber value={careerStats.matches} /></strong></div>
        <div className="hero-stat"><span>Голы</span><strong><AnimatedNumber value={careerStats.goals} /></strong></div>
        <div className="hero-stat"><span>Ассисты</span><strong><AnimatedNumber value={careerStats.assists} /></strong></div>
        <div className="hero-stat"><span>Гол + пас</span><strong><AnimatedNumber value={careerStats.contributions} /></strong></div>
      </div>
      <div className="award-line">
        <span><b>{careerStats.motm}</b> MOTM</span><span><b>{careerStats.teamOfRound}</b> в сборной тура</span><span><b>{careerStats.playerOfRound}</b> игрок тура</span>
      </div>
    </section>

    <section className="form-section" data-reveal="chapter">
      <div className="stadium-lights" aria-hidden="true"><i /><i /></div>
      <div className="section-intro"><span>Последние игры</span><h2>Форма последних матчей</h2></div>
      <div className="form-track">
        {matches.slice(-5).map((match, index) => {
          const result = resultOf(match);
          return <button key={match.id} className={`form-node result-${result}`} onClick={() => {
            setTeamId(""); setCompetitionId(""); setOpenMatch(match.id);
            document.querySelector("#matches")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <span className="form-date">{new Date(match.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</span>
            <b>{resultRu[result]}</b><small>{match.goalsFor}:{match.goalsAgainst}</small>
            <i style={{ height: `${24 + (match.playerGoals + match.playerAssists) * 8}px` }} />
            <em>{index + 1}</em>
          </button>;
        })}
      </div>
    </section>

    <section id="matches" className="matches-section">
      <div className="section-intro section-intro--right" data-reveal="chapter"><span>Результаты и личная статистика</span><h2>Последние матчи</h2></div>
      <div className="filters">
        <div className="filter-group" aria-label="Фильтр по команде">
          <button className={!teamId ? "active" : ""} onClick={() => setTeamId("")}>Все команды</button>
          {teams.map((team) => <button key={team.id} className={teamId === team.id ? "active" : ""} onClick={() => setTeamId(team.id)}>{team.name}</button>)}
        </div>
        <div className="filter-group filter-group--sub" aria-label="Фильтр по турниру">
          <button className={!competitionId ? "active" : ""} onClick={() => setCompetitionId("")}>Все турниры</button>
          {competitions.map((cup) => <button key={cup.id} className={competitionId === cup.id ? "active" : ""} onClick={() => setCompetitionId(cup.id)}>{cup.name}</button>)}
        </div>
      </div>

      <div className="filtered-summary">
        <div><span>В выборке</span><strong>{detail.matches}</strong><small>подробных матчей</small></div>
        <div><span>В · Н · П</span><strong>{detail.wins} · {detail.draws} · {detail.losses}</strong><small>{detail.winRate}% побед</small></div>
        <div><span>Голевые действия</span><strong>{detail.contributions}</strong><small>{detail.contributionsPerMatch.toFixed(2)} за матч</small></div>
        <div><span>Текущая серия</span><strong>{run.currentWins}</strong><small>побед подряд</small></div>
      </div>

      <div className="match-list" aria-live="polite">
        {filtered.length ? filtered.map((match) => {
          const team = teams.find((item) => item.id === match.teamId)!;
          const cup = competitions.find((item) => item.id === match.competitionId);
          const result = resultOf(match);
          const isOpen = openMatch === match.id;
          return <article key={match.id} className={`match-row result-${result} ${isOpen ? "is-open" : ""}`}>
            <button onClick={() => setOpenMatch(isOpen ? null : match.id)} aria-expanded={isOpen}>
              <div className="match-date"><b>{new Date(match.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</b><span>2026</span></div>
              <div className="match-club"><TeamMark teamId={team.id} /><span><b>{team.name}</b><small>{cup?.name ?? "Турнир не указан"}</small></span></div>
              <div className="match-score"><span>{match.goalsFor}</span><i>:</i><span>{match.goalsAgainst}</span></div>
              <div className="match-output"><b>{match.playerGoals}+{match.playerAssists}</b><span>гол + пас</span></div>
              <div className="match-result"><b>{resultLabel[result]}</b><span>{isOpen ? "−" : "+"}</span></div>
            </button>
            <div className="match-details">
              <span>Соперник<strong>{match.opponent ?? "будет добавлен"}</strong></span>
              <span>Голы<strong>{match.playerGoals}</strong></span><span>Ассисты<strong>{match.playerAssists}</strong></span>
              <span>Вклад в голы<strong>{Math.round((match.playerGoals + match.playerAssists) / match.goalsFor * 100)}%</strong></span>
              {match.awards?.motm && <span className="motm">Игрок матча · MOTM</span>}
              {match.comment && <div className="match-comment"><span>Комментарий к матчу</span><p>{match.comment}</p></div>}
            </div>
          </article>;
        }) : <div className="empty-state"><b>Матчей в этом срезе пока нет</b><span>Сбросьте один из фильтров или добавьте новую игру в data/football.ts.</span></div>}
      </div>
    </section>

    <section id="teams" className="teams-section">
      <div className="section-intro section-intro--center"><span>Все команды игрока</span><h2>Статистика по командам</h2></div>
      <div className="team-dossiers">
        {teams.map((team, index) => {
          const stats = teamCareerStats(team.id);
          return <article className="team-dossier" key={team.id} style={{ "--team-accent": team.accent } as React.CSSProperties}>
            <div className="team-number">0{index + 1}</div><TeamMark teamId={team.id} large />
            <div className="team-copy"><span>Досье игрока</span><h3>{team.name}</h3><p>{stats.contributions} голевых действий в {stats.matches} матчах.</p></div>
            <dl><div><dt>Матчи</dt><dd>{stats.matches}</dd></div><div><dt>Голы</dt><dd>{stats.goals}</dd></div><div><dt>Ассисты</dt><dd>{stats.assists}</dd></div><div><dt>MOTM</dt><dd>{stats.motm}</dd></div></dl>
          </article>;
        })}
      </div>
    </section>

    <section id="records" className="records-section">
      <div className="section-intro section-intro--right" data-reveal="chapter"><span>Лучшие показатели</span><h2>Рекорды и достижения</h2></div>
      <div className="record-wall">
        <article className="record-main"><span>Лучший известный матч</span><strong>3+3</strong><h3>Арарат · 14.07</h3><p>Шесть голевых действий в одном матче. Ничья 7:7.</p></article>
        <article><span>Награды</span><strong>{careerStats.motm}</strong><h3>MOTM</h3><p>Последняя — за Ауру 19.07, 3 гола и ассист.</p></article>
        <article><span>Карьера</span><strong>{careerStats.contributions}</strong><h3>Гол + пас</h3><p>{(careerStats.contributions / careerStats.matches).toFixed(2)} результативного действия за матч.</p></article>
        <article className="record-wide"><span>Самый быстрый гол</span><strong>15″</strong><h3>Аура · 01.08</h3><p>Гол на 15-й секунде в матче Summer Cup 2.</p></article>
      </div>
    </section>

    <footer><div className="footer-mark">SL<span>11</span></div><p>Сергей Лапин<br />Персональный матч-центр</p><a href="#">Вернуться наверх ↑</a></footer>
  </main>;
}
