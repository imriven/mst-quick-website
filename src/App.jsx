import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTwitter, FaYoutube, FaTiktok, FaLink, FaEnvelope, FaTwitch, FaDiscord } from "react-icons/fa";



// ASSETS
import mech from "./assets/mst-mech2.png";
import logotype from "./assets/logotype.png";
import outlineNavy from "./assets/blue.png";
import revealMp4 from "./assets/logo-reveal.mp4";
import revealWebm from "./assets/logo-reveal.webm";
import CursorFollower from "./components/CursorFollower";

// GLOBALS
const Global = createGlobalStyle`
  :root{
    --orange:#EB632D; --purple:#380636; --navy:#1B3458;
    --page-max:1320px;                 /* 🔑 site-wide column width */
    --gutter:24px;
  }
  *{ box-sizing:border-box }
  html,body,#root{ height:100%; width:100% }
  html { scroll-behavior: smooth; }

  /* anchor offset for fixed nav */
  [id] { scroll-margin-top: 72px; }
  @media (max-width: 600px){
    [id] { scroll-margin-top: 64px; }
  }

  body{
    margin:0; color:#fff;
    background: black;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    overflow-x:hidden;
    scroll-behavior:smooth;
    cursor: none;
  }
  a{ color:var(--orange); text-decoration:none; cursor:none; }

  /* ✅ One centering utility used EVERYWHERE */
  .container{
    width: min(100%, var(--page-max));
    margin-left: auto;           /* robust centering */
    margin-right: auto;
    padding-left: var(--gutter);
    padding-right: var(--gutter);
    display:block;
    /* outline: 1px solid orange;  // uncomment to debug */
  }

  section { line-height:1.65; padding:80px 0; }
  section h2 { font-family:"Orbitron", system-ui; font-size:clamp(28px,3vw,36px); margin:0 0 14px; text-align:center; color:var(--orange); }
  section p { font-size:18px; margin:0 auto 12px; max-width:900px; text-align:center; }

  .socials {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 26px;
  flex-wrap: wrap;}
  
  .socials a {
  color: #fff;
  font-size: 32px;    /* 🔑 larger icons */
  transition: color .2s ease, transform .2s ease; }
  
  .socials a:hover {
  color: var(--orange);   /* glow into your team orange */
  transform: scale(1.15); /* slight zoom */ }

  @media (max-width: 600px){
    :root{ --gutter:16px; }
  }
`;

// NAV
const Nav = styled.nav`
  position:fixed; inset:0 0 auto 0; z-index:10;
  height:56px;
  background:linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0));
  border-bottom:1px solid rgba(255,255,255,.06);
  backdrop-filter:saturate(140%) blur(6px);

  .row{
    height:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }

  .brand img {
    height:64px;
    margin-top:8px;
    filter:drop-shadow(0 4px 10px rgba(0,0,0,0.7));
  }

  .btn{
    font-family:"Orbitron", sans-serif;
    padding:6px 12px;
    margin-left:8px;
    font-weight:600;
    letter-spacing:.06em;
    border:1px solid rgba(255,255,255,.18);
    border-radius:8px;
    color:#fff;
    background:rgba(255,255,255,.04);
    transition:all .2s ease;
  }
  .btn:hover{
    border-color:var(--orange);
    box-shadow:0 0 12px rgba(235,99,45,.45),0 0 28px rgba(56,6,54,.35);
  }
`;

// HERO
const Hero = styled.header`
  position: relative;
  min-height: 100dvh; min-height: 100svh; min-height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;

  .video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transform: translate3d(0, var(--vy, 0px), 0);
    filter: brightness(0.42) contrast(1.05) saturate(1.02) blur(1.6px);
    z-index: 0; pointer-events: none;
  }
  .video-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.48);
    z-index: 1; pointer-events: none;
  }

  .grid {
    position: absolute; inset: 0 0 auto 0; height: min(60vh, 700px);
    pointer-events: none; z-index: 3;
    opacity: var(--gridOpacity, 0.45);
    transform: translate3d(0, var(--gy, 0px), 0);
    background:
      radial-gradient(1200px 500px at 50% 0%, rgba(235,99,45,.22), rgba(56,6,54,0) 70%),
      repeating-linear-gradient(to right, rgba(255,255,255,.12) 0px, rgba(255,255,255,.12) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 40px),
      repeating-linear-gradient(to bottom, rgba(255,255,255,.12) 0px, rgba(255,255,255,.12) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) 40px);
    -webkit-mask-image: linear-gradient(to bottom, black 12%, transparent 100%);
            mask-image: linear-gradient(to bottom, black 12%, transparent 100%);
  }

  .mech {
    position: absolute; inset: 0;
    background: url(${mech}) center bottom / contain no-repeat;
    opacity: .92;
    transform: translate3d(var(--mx,0px), var(--py,0px), 0) rotate(var(--tilt,0deg));
    will-change: transform;
    z-index: 2;
  }

  .content {
    position: relative; z-index: 4;
    padding: clamp(96px, 22vh, 220px) 0 64px;
    display: flex; flex-direction: column; gap: 18px; align-items: center; text-align: center;
  }

  .panel {
    display:flex; flex-direction:column; align-items:center; gap:14px;
    background: linear-gradient(180deg, rgba(10,12,18,.55), rgba(10,12,18,.35));
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 14px;
    padding: 22px 24px;
    box-shadow: 0 18px 50px rgba(0,0,0,.45);
    backdrop-filter: blur(4px);
  }

  .logotype { width: min(90vw, 720px); height: auto; filter: drop-shadow(0 8px 18px rgba(0,0,0,.6)); }
  .tag {
    font-family: "Orbitron", system-ui; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    font-size: clamp(18px, 2.4vw, 26px);
    padding: 10px 16px; border: 2px solid var(--orange); border-radius: 10px; background: rgba(0,0,0,.35);
  }

  @media (max-width: 600px) {
    .panel { padding: 18px 16px; }
    .tag { font-size: 15px; padding: 8px 12px; }
    .grid { height: 55vh; }
  }
`;

// SECTIONS
const Section = styled.section`
  position: relative;
  padding: 80px 0;

  .title{
    font-family:"Orbitron", system-ui;
    font-size: clamp(28px, 3vw, 36px);
    text-transform: uppercase; letter-spacing:.06em; text-align:center;
  }
  .rule{
    height:2px; width:88px;
    background:linear-gradient(90deg, var(--orange), transparent);
    margin:10px auto 28px;
  }
`;

const Mission = styled(Section)`
  background:
    radial-gradient(800px 400px at right -20%, rgba(235,99,45,.07), transparent 55%),
    linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.35)),
    url(${outlineNavy});
  background-size: auto 420px, auto, 460px;
  background-repeat: no-repeat, no-repeat, repeat;
  border-block:1px solid rgba(255,255,255,.06);
  p{color:#e6ebf5; line-height:1.7; font-size:18px}
  .pull{color:#fff; font-weight:800; font-size:20px; border-left:4px solid var(--orange); padding-left:12px; margin-top:18px}
`;

const Grid = styled.div`
  display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(160px,1fr));
  .card{
    display:flex; align-items:center; justify-content:center;
    padding:16px 14px; text-align:center; font-weight:800; letter-spacing:.02em;
    border:1px solid rgba(255,255,255,.18); border-radius:12px;
    background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
    transition:.18s transform ease, .18s box-shadow ease, .18s border-color ease;
    color:inherit; text-decoration:none;
  }
  .card:hover {
    transform: translateY(-2px);
    border-radius:12px;
    border-color: var(--navy);
    box-shadow: 0 0 12px rgba(27,52,88,.45), 0 0 28px rgba(56,6,54,.35);
  }
`;

const HUD = styled.div`
  background:linear-gradient(180deg, rgba(9,12,20,.7), rgba(9,12,20,.7));
  border:2px solid var(--orange); border-radius:16px; padding:18px;
  box-shadow:0 0 12px rgba(235,99,45,.45),0 0 28px rgba(56,6,54,.35);
  display:grid; gap:12px; grid-template-columns:150px 1fr 180px;
  .cell{border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.04); border-radius:10px; padding:12px 14px; font-weight:700; display:flex; align-items:center; justify-content:center; text-align:center}
  .cta{border-color:var(--orange)}
  @media (max-width:780px){ grid-template-columns:1fr; }
`;

const Footer = styled.footer`
  padding:36px 24px;
  background:linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.85));
  border-top:1px solid rgba(255,255,255,.08);
  text-align:center; color:#cbd5e1;
`;

// DATA
const teammates = [
  { name: "Tytan", url: "https://example.com/tytan" },
  { name: "Erebus", url: "https://example.com/erebus" },
  { name: "MajorHurricane", url: "https://example.com/majorhurricane" },
  { name: "Ångel", url: "https://example.com/angel" },
  { name: "LPT", url: "https://example.com/lpt" },
  { name: "DriftingLights", url: "https://example.com/driftinglights" },
  { name: "JagWar", url: "https://example.com/jagwar" },
  { name: "Oath", url: "https://example.com/oath" },
  { name: "Rockagoth", url: "https://rockagoth.com" },
  { name: "GlitterPanda", url: "https://example.com/glitterpanda" },
  { name: "Juventic", url: "https://example.com/juventic" },
  { name: "AzamiKimura", url: "https://example.com/azamikimura" },
  { name: "Japanese\nTeriyakiSauce", url: "https://example.com/teriyakichamp" },
  { name: "TheCheddarBay", url: "https://example.com/cheddarbay" }
];

export default function App() {
  // Parallax & grid fade
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.setProperty("--py", `${y * 0.08}px`);
      document.documentElement.style.setProperty("--vy", `${y * 0.03}px`);
      document.documentElement.style.setProperty("--gy", `${y * 0.12}px`);
      const mx = Math.sin(y * 0.0025) * 12;
      const tilt = Math.sin(y * 0.0025) * 2.2;
      document.documentElement.style.setProperty("--mx", `${mx}px`);
      document.documentElement.style.setProperty("--tilt", `${tilt}deg`);
      const t = Math.min(1, Math.max(0, y / 500));
      const opacity = 0.45 * (1 - t);
      document.documentElement.style.setProperty("--gridOpacity", opacity.toFixed(3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vidRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(true);
  const togglePlay = () => {
    const v = vidRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <>
      <Global className="container" />
      <CursorFollower />

      <Nav>
        <div className="container">
          <div className="row">
            <div className="brand"><img src={logotype} alt="MechaStormTitan" /></div>
            <div>
              <a className="btn" href="#mission">Mission</a>
              <a className="btn" href="#team">Team</a>
              <a className="btn" href="#events">Events</a>
              <a className="btn" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </Nav>

      <Hero id="top">
        <video className="video" autoPlay muted loop playsInline preload="metadata">
          {revealWebm && <source src={revealWebm} type="video/webm" />}
          <source src={revealMp4} type="video/mp4" />
        </video>
        <div className="video-overlay" />
        <div className="mech" />
        <div className="grid" />

        {/* Foreground content uses the SAME container as nav/sections */}
        <div className="container">
          <div className="content">
            <div className="panel">
              <img src={logotype} alt="MechaStormTitan" className="logotype" />
              <div className="tag">Feel The Storm</div>
            </div>
          </div>
        </div>
      </Hero>

      <Mission id="mission">
        <div className="container">
          <h2 className="title">Our Mission</h2>
          <div className="rule" />
          <p>Our mission is to bring positivity, passion, and fun to the fighting game community. We strive to create an environment where players, fans, and partners feel welcomed, supported, and inspired. While rooted primarily in the Pacific Northwest, with a majority of our team in Seattle, we also embrace perspectives from across the country to keep our approach fresh and inclusive.</p>
          <p>We aim to uplift the community by highlighting talent, encouraging growth, and fostering a culture of respect and inclusivity. Beyond competition, we bring creativity, collaboration, and innovation to every aspect of our team, from developing new events to sharing knowledge and skill among members. Each team member contributes unique talents, from gameplay mastery to event organization and community engagement, helping us cultivate an environment where everyone can learn, grow, and contribute.</p>
          <p>We are also committed to making a positive impact beyond the screen. Through charitable initiatives and support for the local Tekken and esports scene, we hope to strengthen both our regional community and the broader fighting game ecosystem. By combining competition, creativity, and community-driven purpose, we aim not only to showcase the excitement of esports but to build lasting connections, shared joy, and a meaningful presence within the FGC. </p>
          <p className="pull">We aim to uplift community by highlighting talent, encouraging growth, and fostering inclusivity.</p>
        </div>
      </Mission>

      <Section id="team">
        <div className="container">
          <h2 className="title">Our Team</h2>
          <div className="rule" />
          <Grid>
            {teammates.map(tm => (
              <a key={tm.name} href={tm.url} target="_blank" rel="noopener noreferrer" className="card">
                {tm.name}
              </a>
            ))}
          </Grid>
        </div>
      </Section>

      <Section id="events">
        <div className="container">
          <h2 className="title">Upcoming Events</h2>
          <div className="rule" />
          <HUD>
            <div className="cell">Aug 24, 2025</div>
            <div className="cell">Birthday Tower of Pain</div>
            <div className="cell cta"><a href="https://x.com/mechastormtitan">Details</a></div>

            <div className="cell">Aug 28, 2025</div>
            <div className="cell">Almost Pro Tekken Tournament</div>
            <div className="cell cta"><a href="https://west.paxsite.com/en-us/features/pax-arena.html">Details</a></div>

            <div className="cell">—</div>
            <div className="cell">Awaiting Orders…</div>
            <div className="cell">TBD</div>
          </HUD>
        </div>
      </Section>

      <Section id="contact">
        <div className="container">
          <h2 className="title">Contact</h2>
          <div className="rule" />
          <p>For partners, events, or press, reach out by email or on socials.</p>

          <div className="socials">
            {/* Twitter / X */}
            <a href="https://twitter.com/mechastormtitan" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <FaTwitter />
            </a>

            {/* Twitch */}
            <a href="https://twitch.tv/mechastormtitan" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
              <FaTwitch />
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@MechaStormTitan-g6s" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>

            {/* TikTok */}
            <a href="https://www.tiktok.com/@mechastormtitan" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>

            {/* Linktree (using link icon) */}
            <a href="https://linktr.ee/MechaStormTitan" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
              <FaLink />
            </a>

            {/* Email (opens default mail app) */}
            <a
              href="mailto:mechastormtitan@gmail.com?subject=MST20%Inquiry"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </Section>

      <Footer>Born of Lightning, Forged in Fire -- We carry the heart of the PNW | © MechaStormTitan</Footer>
    </>
  );
}
