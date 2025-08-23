import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

// ASSETS
// Put these files in src/assets and keep names exactly, or update imports
import mech from "./assets/mst-mech2.png";
import logotype from "./assets/logotype.png";        // your graffiti wordmark
import outlineNavy from "./assets/blue.png"; // your outline tile
import revealMp4 from "./assets/logo-reveal.mp4";    // optional MP4
import revealWebm from "./assets/logo-reveal.webm";  // optional WebM
import CursorFollower from "./components/CursorFollower";

// COLORS
const Global = createGlobalStyle`
  :root{
    --orange:#EB632D; --purple:#380636; --navy:#1B3458;
     --page-max:1200px; --gutter:24px; 
  }
  *{ box-sizing:border-box }
  html,body,#root{ height:100% }
  html { scroll-behavior: smooth; }

/* make anchors stop *below* the fixed nav */
[id] { scroll-margin-top: 72px; }   /* tweak to your nav height */
@media (max-width: 600px){
  [id] { scroll-margin-top: 64px; }
}

  body{
    margin:0; color:#fff;
    background:
      radial-gradient(1200px 600px at 70% -10%, rgba(255,255,255,.06), transparent 60%),
      linear-gradient(180deg, var(--navy) 0%, var(--purple) 40%, #12081a 100%);
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    overflow-x:hidden;
    scroll-behavior:smooth;
    cursor: none; 
  }
  a{ color:var(--orange); text-decoration:none }

  /* ✅ Centering utility for the whole site */
  .container { width:min(100%, var(--page-max)); margin-inline:auto; padding-inline:var(--gutter); }

  section { line-height:1.65; padding:80px 0; }
  
  section h2 { font-family:"Orbitron", system-ui; font-size:clamp(28px,3vw,36px); margin:0 0 14px; text-align:center; color:var(--orange); }
  
  section p { font-size:18px; margin:0 auto 12px; max-width:900px; text-align:center; }

  @media (max-width: 600px){
    :root{ --gutter:16px; }       /* tighter padding on phones */
  }
`;



const Nav = styled.nav`
  position:fixed; inset:0 0 auto 0; z-index:10;
  display:flex; align-items:center; justify-content:space-between;
  height:56px; /* <<< skinnier bar */
  padding:0 24px; /* tightened vertical padding */
  background:linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,0));
  border-bottom:1px solid rgba(255,255,255,.06);
  backdrop-filter:saturate(140%) blur(6px);

  .brand {
    position:relative;
    display:flex; align-items:center;
  }

  .brand img {
    height:64px; /* stays large */
    margin-top:8px; /* overlap effect */
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


const Hero = styled.header`
  position: relative;
  /* use dvh to avoid mobile URL bar issues, and fallbacks */
  min-height: 100dvh;
  min-height: 100svh;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;

  /* ===== FULL-BLEED VIDEO (ambient) ===== */
  .video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;              /* <-- ensures it fills the hero */
    transform: translate3d(0, var(--vy, 0px), 0);   /* parallax */
    filter: brightness(0.42) contrast(1.05) saturate(1.02) blur(1.6px);
    z-index: 0;
    pointer-events: none;           /* never block scrolling/clicks */
  }
  .video-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.48);
    z-index: 1;
    pointer-events: none;
  }

  /* ===== Top grid overlay (fades on scroll) ===== */
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

  /* ===== Mech PNG above video ===== */
  .mech {
  position: absolute; inset: 0;
  background: url(${mech}) center bottom / contain no-repeat;
  opacity: .92;
  transform: translate3d(var(--mx,0px), var(--py,0px), 0) rotate(var(--tilt,0deg));
  will-change: transform;
  z-index: 2;
}


  /* ===== Foreground content (centered) ===== */
  .content {
    position: relative; z-index: 4;
    padding: clamp(96px, 22vh, 220px) 0 64px;
    display: flex; flex-direction: column; gap: 18px; align-items: center; text-align: center;

    width: 100%;
    margin-inline: auto;
    padding-inline: var(--gutter, 24px);
  }

  /* translucent HUD panel behind logo/tagline */
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




const VideoPanel = styled.div`
  width:min(820px, 88vw); margin-top:16px;
  border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,.15);
  box-shadow:0 10px 30px rgba(0,0,0,.45); background:rgba(0,0,0,.35);
  .frame{ width:100%; display:block; aspect-ratio:16/9; background:#000; }
  .controls{ display:flex; gap:10px; justify-content:center; padding:8px }
  button{
    border:1px solid rgba(255,255,255,.25); background:rgba(255,255,255,.06);
    color:#fff; font-weight:700; padding:8px 12px; border-radius:8px; cursor:pointer;
  }
  button:hover{ border-color:var(--orange); box-shadow:0 0 12px rgba(235,99,45,.45),0 0 28px rgba(56,6,54,.35) }
`;

const Section = styled.section`
  padding:80px 24px; position:relative;
  .wrap{max-width:1100px; margin:0 auto}
  .title{font-family:"Orbitron", system-ui; font-size:34px; text-transform:uppercase; letter-spacing:.06em}
  .rule{height:2px; width:88px; background:linear-gradient(90deg, var(--orange), transparent); margin:10px 0 28px}
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
    padding:16px 14px; text-align:center; font-weight:800; letter-spacing:.02em;
    border:1px solid rgba(255,255,255,.18); border-radius:12px;
    background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
    transition:.18s transform ease, .18s box-shadow ease, .18s border-color ease;
  }
  .card:hover{transform:translateY(-2px); border-color:var(--orange); box-shadow:0 0 12px rgba(235,99,45,.45),0 0 28px rgba(56,6,54,.35)}
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
const names = [
  "Tytan", "Erebus", "Ångel", "LPT", "DriftingLights", "JagWar", "Oath",
  "Rockagoth", "GlitterPanda", "Juventic", "AzamiKimura", "JapaneseTeriyakiSauce", "TheCheddarBay"
];

export default function App() {
  // Light parallax on the mech background
  React.useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY;
    document.documentElement.style.setProperty("--py", `${y * 0.08}px`);  // mech
    document.documentElement.style.setProperty("--vy", `${y * 0.03}px`);  // video
    document.documentElement.style.setProperty("--gy", `${y * 0.12}px`);  // grid

    // 🔹 new orbiting mech effect
    const mx = Math.sin(y * 0.0025) * 12;    // subtle left/right drift
    const tilt = Math.sin(y * 0.0025) * 2.2; // small rotation
    document.documentElement.style.setProperty("--mx", `${mx}px`);
    document.documentElement.style.setProperty("--tilt", `${tilt}deg`);

    // fade grid out by 500px
    const t = Math.min(1, Math.max(0, y / 500));
    const opacity = 0.45 * (1 - t);
    document.documentElement.style.setProperty("--gridOpacity", opacity.toFixed(3));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);




  // Video controls
  const vidRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(true);
  const togglePlay = () => {
    const v = vidRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <>
      <Global />
      <CursorFollower />
      <Nav>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div className="brand"><img src={logotype} alt="MechaStormTitan" /></div>
          <div>
            <a className="btn" href="#mission">Mission</a>
            <a className="btn" href="#team">Team</a>
            <a className="btn" href="#events">Events</a>
            <a className="btn" href="#contact">Contact</a>
          </div>
        </div>
      </Nav>

      <Hero id="top">
        {/* Background video */}
        <video className="video" autoPlay muted loop playsInline preload="metadata">
          {revealWebm && <source src={revealWebm} type="video/webm" />}
          <source src={revealMp4} type="video/mp4" />
        </video>
        <div className="video-overlay" />

        {/* Mech overlay */}
        <div className="mech" />

        {/* Grid overlay */}
        <div className="grid" />

        {/* Foreground content (panel restores the “framed” look) */}
        <div className="content">
          <div className="panel">
            <img src={logotype} alt="MechaStormTitan" className="logotype" />
            <div className="tag">Positivity. Passion. Power.</div>
          </div>
        </div>
      </Hero>




      <Mission id="mission">
        <div className="wrap">
          <h2 className="title">Our Mission</h2>
          <div className="rule" />
<p>Our mission is to bring positivity, passion, and fun to the fighting game community. We strive to create an environment where players, fans, and partners feel welcomed, supported, and inspired. While rooted primarily in the Pacific Northwest, with a majority of our team in Seattle, we also embrace perspectives from across the country to keep our approach fresh and inclusive.</p>

<p>We aim to uplift the community by highlighting talent, encouraging growth, and fostering a culture of respect and inclusivity. Beyond competition, we bring creativity, collaboration, and innovation to every aspect of our team, from developing new events to sharing knowledge and skill among members. Each team member contributes unique talents, from gameplay mastery to event organization and community engagement, helping us cultivate an environment where everyone can learn, grow, and contribute.</p>

<p>We are also committed to making a positive impact beyond the screen. Through charitable initiatives and support for the local Tekken and esports scene, we hope to strengthen both our regional community and the broader fighting game ecosystem. By combining competition, creativity, and community-driven purpose, we aim not only to showcase the excitement of esports but to build lasting connections, shared joy, and a meaningful presence within the FGC. </p>
          <p className="pull">We aim to uplift community by highlighting talent, encouraging growth, and fostering inclusivity.</p>
        </div>
      </Mission>



      <Section id="team">
        <div className="wrap">
          <h2 className="title">Our Team</h2>
          <div className="rule" />
          <Grid>
            {names.map(n => <div key={n} className="card">{n}</div>)}
          </Grid>
        </div>
      </Section>

      <Section id="events">
        <div className="wrap">
          <h2 className="title">Upcoming Events</h2>
          <div className="rule" />
          <HUD>
            <div className="cell">Oct 4, 2025</div>
            <div className="cell">Seattle Local Tekken Night</div>
            <div className="cell cta"><a href="#">Details</a></div>

            <div className="cell">Oct 18, 2025</div>
            <div className="cell">PNW Community Meetup + Coaching</div>
            <div className="cell cta"><a href="#">Details</a></div>

            <div className="cell">—</div>
            <div className="cell">Awaiting Orders…</div>
            <div className="cell">TBD</div>
          </HUD>
        </div>
      </Section>

      <Section id="contact">
        <div className="wrap">
          <h2 className="title">Contact</h2>
          <div className="rule" />
          <p>For partners, events, or press, reach out on socials. Add links here.</p>
        </div>
      </Section>


      <Footer>Made with passion in the Pacific Northwest | © MechaStormTitan</Footer>
    </>
  );
}
