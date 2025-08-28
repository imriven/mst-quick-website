import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaTwitter, FaYoutube, FaTiktok, FaLink, FaEnvelope, FaTwitch, FaInstagram, FaGlobe } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
// ASSETS
import mech from "./assets/mst-mech2.png";
import logotype from "./assets/logotype.png";
import outlineNavy from "./assets/blue.png";
import revealMp4 from "./assets/logo-reveal.mp4";
import revealWebm from "./assets/logo-reveal.webm";
// import CursorFollower from "./components/CursorFollower";
import SpotifyBadge from "./assets/Spotify.png"
// Team Pics
import Angel from "./assets/Angel.png";
import BandUpMitch from "./assets/bandupmitch.png";
import DriftingLights from "./assets/DriftingLights.png";
import Erebus from "./assets/Erebus.png";
import GlitterPanda from "./assets/GlitterPanda.png";
import Goth from "./assets/goth.jpg";
import Jagwar from "./assets/Jagwar.png";
import JTS from "./assets/JTS.png";
import Juvetic from "./assets/Juvetic.png";
import LBP from "./assets/LBP.png";
import MH from "./assets/MH.png";
import Oath from "./assets/Oath.png";
import Tytan from "./assets/tytan.png";
import Cheddar from "./assets/cheddar.png";
import Holder from "./assets/purple.png"; // placeholder for missing photos



// GLOBALS
const Global = createGlobalStyle`
  :root{
    --orange:#EB632D; --purple:#380636; --navy:#1B3458;
    --page-max:1320px; --gutter:24px;
    --bg: 
      radial-gradient(1200px 600px at 70% -10%, rgba(255,255,255,.06), transparent 60%),
      linear-gradient(180deg, var(--navy) 0%, var(--purple) 40%, #12081a 100%);
    color-scheme: dark;            /* tell the browser “we are dark” */
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
    margin:0;
    color:#e9edf5;                 /* slightly lighter than pure white */
    background:#000;               /* hard dark fallback */
    background-image: var(--bg);   /* our gradient/space vibe */
    background-attachment: fixed;  /* nicer on tall pages; drop if janky on mobile */
    overflow-x:hidden;

  }

  a{ color:var(--orange); text-decoration:none; cursor:none; }

  /* ✅ One centering utility used EVERYWHERE */
  .container{
    width:min(100%, var(--page-max));
    margin-inline:auto;
    padding-inline:var(--gutter);
    display:block;
    /* outline: 1px solid orange;  // uncomment to debug */
  }

    /* --- Podcast section helpers --- */
  .podcast-actions{
    display:flex; align-items:center; justify-content:center; gap:18px; flex-wrap:wrap;
  }

  /* .live-pill{
    display:inline-flex; align-items:center; gap:10px;
    padding:10px 14px; border-radius:999px;
    background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
    border:1px solid rgba(255,255,255,.18);
    box-shadow:0 8px 24px rgba(0,0,0,.25);
    font-weight:700; letter-spacing:.02em;
  }

  .live-pill .dot{
    width:10px; height:10px; border-radius:50%;
    background:#f43; box-shadow:0 0 14px #f43;
  } */

  .spotify-badge{
    height:44px;
    filter: drop-shadow(0 6px 16px rgba(0,0,0,.35));
    transition: transform .18s ease;
  }
  .spotify-badge:hover{ transform: translateY(-1px) scale(1.03); }


  section { line-height:1.65; padding:80px 0; }
  section h2 { font-family:"Orbitron", system-ui; font-size:clamp(28px,3vw,36px); margin:0 0 14px; text-align:center; color:var(--orange); }
  section p { font-size:18px; margin:0 auto 12px; max-width:900px; text-align:center; }

  .socials {
  display: flex;
  justify-content: center;
  gap: 14px;                   /* adjust spacing between icons */
  }
  
  .socials a {
  color: #fff;
  font-size: 32px;    /* 🔑 larger icons */
  transition: color .2s ease, transform .2s ease; }
  
  .socials a:hover {
   color: var(--purple);
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
   background: linear-gradient(180deg, rgba(10,12,18,.55), rgba(10,12,18,.35));   border: 1px solid rgba(255,255,255,.16);   border-radius: 14px;   padding: 22px 16px;                 /* a hair narrower on small screens */   box-shadow: 0 18px 50px rgba(0,0,0,.45);   backdrop-filter: blur(4px);   width: 100%;
   max-width: 720px;                    /* cap so it never grows past column */
   margin-inline: auto;                 /* center inside container */
 }
 .logotype {
   width: 100%;                         /* fill panel width safely */
   max-width: 640px;                    /* optional inner cap */   height: auto;
   filter: drop-shadow(0 8px 18px rgba(0,0,0,.6));
 }

  @media (max-width: 600px) {
    .panel { padding: 16px 12px; }
    .tag { font-size: 15px; padding: 8px 12px; }
    .grid { height: 55vh; }
  }

  @media (max-width: 700px){
  .content{
    display: flex;
    justify-content: center;   /* horizontally center */
    align-items: center;       /* vertically center */
    text-align: center;
    width: 100%;
    padding: 160px 16px 60px;  /* tweak vertical spacing */
  }

  .panel{
    margin: 0 auto;            /* ensure it’s centered in flow */
    max-width: 90%;            /* prevent edge clipping */
  }

  @media (min-width: 701px) and (max-width: 1024px){
  .content{
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 160px 32px 80px;
  }

  .panel{
    margin: 0 auto;
    max-width: 75%;            /* let it breathe a bit wider */
    }
  }
  }

`;

// SECTIONS
const Section = styled.section`
  position: relative;
  padding: 80px 0;

  /* clean, subtle dark background for most sections */
  background: linear-gradient(180deg, #0c0f14, #0a0d12);

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
    /* stop the metallic animation on Mission specifically */
  /* animation: none; */
  animation: shine 30s ease-in-out infinite;

  background:
    radial-gradient(800px 400px at right -20%, rgba(235,99,45,.07), transparent 55%),
    linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.35)),
    url(${outlineNavy});
  background-size: auto 420px, auto, 460px;
  background-repeat: no-repeat, no-repeat, repeat;
  border-block:1px solid rgba(255,255,255,.06);
  p{color:#e6ebf5; line-height:1.7; font-size:18px;text-align: justify ;}
  .pull{color:#fff; font-weight:800; font-size:20px; border-left:4px solid var(--orange); padding-left:12px; margin-top:18px;
  text-align: justify ;}
  

  /* 📱 Phones: center the tile and stop repeating */
  @media (max-width: 700px){
    /* keep the glow/overlay centered */
    background-position:
      center -60px,   /* radial */
      center 0,       /* linear overlay */
      center 20px;    /* outlineNavy tile */

    /* scale the tile a bit larger so it reads on small screens */
    background-size:
      900px 420px,    /* radial */
      auto,           /* linear */
      520px auto;     /* outlineNavy */

    /* don't tile the outline on phones */
    background-repeat:
      no-repeat,
      no-repeat,
      no-repeat;
  }

  /* 📲 Tablets: still centered, allow a subtle repeat if needed */
  @media (min-width: 701px) and (max-width: 1024px){
    background-position:
      center -80px,
      center 0,
      center top;

    background-size:
      1200px 520px,
      auto,
      600px auto;

    /* single tile is usually enough at this width too */
    background-repeat:
      no-repeat,
      no-repeat,
      no-repeat;
  }

`;

const TeamSection = styled(Section)`
  /* bolder metallic sweep using team palette */
  background: linear-gradient(
      135deg,
      #0c0f14 0%,
      var(--navy) 22%,
      #0b0d12 38%,
      var(--purple) 58%,
      #10131a 74%,
      #1a0d1c 86%,
      #0c0f14 100%
    );
  background-size: 320% 320%;
  animation: teamShine 18s ease-in-out infinite;

  &::before{
    content:"";
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(600px 200px at 12% 10%, rgba(235,99,45,.18), transparent 60%),
      radial-gradient(500px 220px at 88% 18%, rgba(235,99,45,.10), transparent 65%);
    mix-blend-mode: screen;
    opacity:.8;
  }

  @keyframes teamShine{
    0%{   background-position: 0% 50% }
    50%{  background-position: 100% 50% }
    100%{ background-position: 0% 50% }
  }
`;


const Grid = styled.div`
  display:grid; gap:18px; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));

  .card{
    display:flex; flex-direction:column; align-items:center; gap:10px;
    padding:20px; text-align:center; font-weight:800; letter-spacing:.02em;
    border:1px solid rgba(255,255,255,.15);
    border-radius:14px;
    background: linear-gradient(180deg, rgba(40,40,45,0.9), rgba(25,25,30,0.9));
    box-shadow: 0 6px 16px rgba(0,0,0,0.6), inset 0 0 12px rgba(235,99,45,.22);
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    color:inherit; text-decoration:none;
  }
  .card:hover{
    transform: translateY(-4px);
    border-color: var(--orange);
    box-shadow: 0 0 16px rgba(235,99,45,.5), 0 0 34px rgba(56,6,54,.4);
  }

  /* 🔥 banner container with dark team gradient behind images */
  .photo{
    width:100%;
    height:130px;
    border-radius:10px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.22);
    box-shadow: inset 0 2px 6px rgba(0,0,0,.4);
    background:
      radial-gradient(240px 120px at 20% 15%, rgba(235,99,45,.22), transparent 60%),
      linear-gradient(135deg, rgba(56,6,54,.95), rgba(27,52,88,.95) 60%, rgba(235,99,45,.35));
  }

  .photo img{
    width:100%; height:100%;
    object-fit: cover;        /* keeps the banner look */
    object-position: top center;
    display:block;
  }

  .meta{ text-align:center; }
  .name{ font-weight:800; margin-bottom:4px; }
  .sub{ font-size:14px; opacity:.88; display:flex; align-items:center; gap:8px; justify-content:center; }
  .dot{ opacity:.6 }

  .socials{ display:flex; gap:12px; justify-content:center; margin-top:6px; }
  .social-icon{ font-size:28px; color:var(--orange); transition: transform .18s ease, color .18s ease; }
  .social-icon:hover{ transform:scale(1.2); color:var(--purple); }
`;



const LivePill = styled.span`
  --pill-bg: linear-gradient(180deg, #ff6b3a3a 0%, #eb632d 60%, #c74e22 100%);
  --edge: #8a2f14;                 /* darker edge for 3D rim */
  --text: #111;                    /* dark text for contrast on bright pill */
  --glow: rgba(235,99,45,.55);

  display:inline-flex; align-items:center; gap:8px;
  padding: 8px 14px;
  border-radius: 999px;
  font: 800 12px/1.1 "Orbitron", system-ui;
  letter-spacing:.08em;
  text-transform: uppercase;
  color: var(--text);
  background: var(--pill-bg);
  position: relative;
  transform: translateZ(0);
  border: 1px solid var(--edge);

  /* Outer depth */
  box-shadow:
    0 10px 18px rgba(0,0,0,.35),
    0 3px 0 0 var(--edge);

  /* Inner “pressed metal” rim */
  &::before{
    content:"";
    position:absolute; inset:1px;
    border-radius:inherit;
    box-shadow: inset 0 6px 10px rgba(0,0,0,.25),
                inset 0 -2px 0 rgba(255,255,255,.08);
    pointer-events:none;
  }

  
  svg {
  font-size: 20px;
  color: #9146FF; /* Twitch purple */
  filter: drop-shadow(0 0 2px #000) 
          drop-shadow(0 0 1px #000); /* dark outline effect */
}


  /* Glossy top highlight */
  /* &::after{
    content:"";
    position:absolute; left:10%; right:10%; top:2px; height:40%;
    border-radius:999px;
    background: linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,0));
    filter: blur(1px);
    pointer-events:none;
    mix-blend-mode: screen;
  } */

  /* Subtle pulsing aura to imply “live” */
  animation: livePulse 2.2s ease-in-out infinite;

  /* Hover/Active pop */
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  &:hover{
    transform: translateY(-1px);
    box-shadow:
      0 14px 24px rgba(0,0,0,.38),
      0 4px 0 0 var(--edge),
      0 0 22px var(--glow);
    filter: saturate(1.06);
  }
  &:active{
    transform: translateY(1px);
    box-shadow:
      0 6px 10px rgba(0,0,0,.35),
      0 1px 0 0 var(--edge);
  }

  /* Little red dot */
  .dot{
  position:relative;
  width:12px; height:12px; border-radius:50%;
  /* richer red with depth */
  background: radial-gradient(circle at 40% 35%,
              #ff9a9a 0%, #ff4d4d 40%, #e01919 65%, #8a0f0f 100%);
  /* inner + outer shadows to “lift” it from the orange */
  box-shadow:
    inset 0 1px 2px rgba(0,0,0,.55),         /* inner rim */
    0 0 8px rgba(255,45,45,.85),             /* red glow */
    0 2px 6px rgba(0,0,0,.35);               /* dark drop */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,.35)); /* extra separation */
  }

    .dot::after{
    content:"";
    position:absolute;
    top:15%; left:20%;
    width:50%; height:40%;
    border-radius:50%;
    background: radial-gradient(circle, rgba(236, 207, 207, 0.65), rgba(255,255,255,0) 80%);
    filter: blur(1px);
    opacity:.8;
    pointer-events:none;
  }


  /* soft dark halo under the LED (no visible border) */
  .dot::before{
    content:"";
    position:absolute; inset:-6px; border-radius:50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.38), rgba(0,0,0,0) 70%);
    filter: blur(2px);
    pointer-events:none;
    z-index:-1;
  }

  @keyframes livePulse{
    0%,100% { box-shadow: 0 10px 18px rgba(0,0,0,.35), 0 3px 0 0 var(--edge); }
    50%     { box-shadow: 0 10px 18px rgba(0,0,0,.35), 0 3px 0 0 var(--edge), 0 0 18px var(--glow); }
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
  // contain group
  {
    name: "Ångel",
    main: "Alisa",
    state: "Washington",
    photo: Angel,
    socials: ["https://linktr.ee/ooangeloo"],
    imageStyle: { objectFit: "contain" }
  },
  {
    name: "GlitterPanda",
    main: "Zafina",
    state: "Illinois",
    photo: GlitterPanda,
    socials: ["https://www.twitch.tv/theglitterpanda"],
    imageStyle: { objectFit: "contain" }
  },
  {
    name: "BandUpMitch",
    main: "Shaheen",
    state: "Georgia",
    photo: BandUpMitch,
    socials: ["https://linktr.ee/bandupmitch?utm_source=linktree_profile_share&ltsid=0ad94050-428d-43d3-9a8e-85c02d26c49a"],
    imageStyle: { objectFit: "contain" }
  },
  {
    name: "Oath",
    main: "Panda",
    state: "Georgia",
    photo: Oath,
    socials: ["https://linktr.ee/oath_aug"],
    imageStyle: { objectFit: "contain" }
  },
  {
    name: "LBP",
    main: "Law",
    state: "New York",
    photo: LBP,
    socials: ["https://x.com/LBP_TK"],
    imageStyle: { objectFit: "contain" }
  },
  {
    name: "DriftingLights",
    main: "Jin",
    state: "Oklahoma",
    photo: DriftingLights,
    socials: ["https://www.youtube.com/@DriftingLightsOVD"],
    imageStyle: { objectFit: "contain" }
  },

  // cover + top center group
  {
    name: "Erebus",
    main: "King",
    state: "Texas",
    photo: Erebus,
    socials: ["https://linktr.ee/msterebus"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "Jagwar",
    main: "Shaheen",
    state: "California",
    photo: Jagwar,
    socials: ["https://www.youtube.com/@jagwar08"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "JapaneseTeriyakiSauce",
    main: "Zafina",
    state: "Washington",
    photo: JTS,
    socials: ["https://www.twitch.tv/kingt_3521"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "Tytan",
    main: "Shaheen",
    state: "Washington",
    photo: Tytan,
    socials: ["https://linktr.ee/Tytanjay"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "MajorHurricane",
    main: "Kuma",
    state: "Washington",
    photo: MH,
    socials: ["https://linktr.ee/majorhurricane"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "Rockagoth",
    main: "Lili",
    state: "Washington",
    photo: Goth,
    socials: ["https://linktr.ee/rockagoth", "https://rockagoth.com"], // globe icon will show for your site
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "Juvetic",
    main: "King",
    state: "Thailand",
    photo: Juvetic,
    socials: ["https://www.instagram.com/juvetic"],
    imageStyle: { objectFit: "cover", objectPosition: "top center" }
  },
  {
    name: "TheCheddarBay",
    main: "Steve",
    state: "Washington",
    photo: Cheddar,
    socials: ["https://linktr.ee/balantac1995"],
    imageStyle: { objectFit: "contain" }
  },

  // using Holder (no photo provided yet)
  {
    name: "AzamiKimura",
    main: "Reina",
    state: "Massachusetts",
    photo: Holder,
    socials: ["https://linktr.ee/azamikimura"],
    imageStyle: { objectFit: "contain" }
  },
];


const iconFor = (url) => {
  if (!url) return FaGlobe;
  const u = url.toLowerCase();
  if (u.includes("twitter.com") || u.includes("x.com")) return FaTwitter;
  if (u.includes("youtube.com") || u.includes("youtu.be")) return FaYoutube;
  if (u.includes("twitch.tv")) return FaTwitch;
  if (u.includes("tiktok.com")) return FaTiktok;
  if (u.includes("linktr.ee")) return SiLinktree;
  if (u.includes("instagram.com")) return FaGlobe;      // swap for FaInstagram if you import it
  if (u.startsWith("mailto:")) return FaEnvelope;
  return FaGlobe; // default: globe/website
};

function getSocialIcon(url) {
  if (url.includes("twitter.com") || url.includes("x.com")) return <FaTwitter />;
  if (url.includes("youtube.com")) return <FaYoutube />;
  if (url.includes("twitch.tv")) return <FaTwitch />;
  if (url.includes("tiktok.com")) return <FaTiktok />;
  if (url.includes("linktr.ee")) return <SiLinktree />;
  if (url.includes("instagram.com")) return <FaInstagram />;
  if (url.startsWith("mailto:")) return <FaEnvelope />;

  // ✅ If it's your own site (or any general domain), show a globe instead of a link
  if (url.match(/\.(com|net|org|gg|io|dev|co)/i)) return <FaGlobe />;

  return <FaLink />; // final fallback
}



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
      {/* <CursorFollower /> */}

      <Nav>
        <div className="container">
          <div className="row">
            <div className="brand"><img src={logotype} alt="MechaStormTitan" /></div>
            <div>
              <a className="btn" href="#mission">Mission</a>
              <a className="btn" href="#team">Team</a>
              <a className="btn" href="#podcast">Podcast</a>   {/* ✅ NEW */}
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
              <div className="tag">Unleash The Storm</div>
            </div>
          </div>
        </div>
      </Hero>

      <Mission id="mission">
        <div className="container">
          <h2 className="title">Our Mission</h2>
          <div className="rule" />
          <p>Our mission is to bring positivity, passion, and fun to the fighting game community. We strive to create a welcoming and supportive environment where players, fans, and partners feel inspired to grow and contribute.</p>

          <p>Rooted in the Pacific Northwest yet open to perspectives nationwide, we celebrate diversity, highlight talent, and foster respect and inclusivity. Beyond competition, we emphasize creativity, collaboration, and innovation—whether through hosting events, sharing knowledge, or building connections.</p>

          <p>Together, our team members bring unique strengths that help the community learn, thrive, and evolve. We are also committed to making a positive impact beyond the screen, supporting local esports, uplifting the Tekken scene, and giving back through charitable initiatives.</p>

          <p>By uniting competition, creativity, and community-driven purpose, we aim not only to showcase the excitement of esports but also to build lasting connections, shared joy, and a meaningful presence within the FGC.
          </p>

          <p className="pull">We aim to uplift community by highlighting talent, encouraging growth, and fostering inclusivity.</p>
        </div>
      </Mission>

      <TeamSection id="team">
        <div className="container">
          <h2 className="title">Our Team</h2>
          <div className="rule" />
          <Grid>
            {teammates
              .slice() // clone so we don’t mutate the original
              .sort((a, b) => a.name.localeCompare(b.name)) // alphabetize by name
              .map(tm => (
                <div key={tm.name} className="card">
                  <div className="photo">
                    <img src={tm.photo || Holder} alt={tm.name} style={tm.imageStyle} />
                  </div>
                  <div className="meta">
                    <div className="name">{tm.name}</div>
                    <div className="sub">
                      {tm.main} <span className="dot">•</span> {tm.state}
                    </div>
                    <div className="socials">
                      {tm.socials.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="social-icon">
                          {getSocialIcon(url)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </Grid>
        </div>
      </TeamSection>

      <Section id="podcast">
        <div className="container">
          <h2 className="title">MechaStorm Radio</h2>
          <div className="rule" />
          <p>
            Unleashing the power of Anime, Gaming, and the FGC! We’re here to talk about anime, gaming and fighting games, bringing you
            insightful conversations with experts, tips, debates, and our perspective on relevant events happening.
          </p>

          {/* Spotify Embed (auto-updates to latest episode) */}
          <div style={{ margin: "28px 0" }}>
            <iframe
              src="https://open.spotify.com/embed/show/0Jwc92YAbBfrktnFrOzSTW?utm_source=generator"
              width="100%"
              height="232"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="MechaStorm Radio on Spotify"
            />
          </div>

          {/* Action row: Spotify badge + Live notice */}
          <div className="podcast-actions">
            {/* Local badge image you imported, e.g. import SpotifyBadge from "./assets/spotify-badge.png" */}
            <a
              href="https://open.spotify.com/show/0Jwc92YAbBfrktnFrOzSTW?si=jLR7zzBIQ7O7qTmVpddaBQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Spotify"
            >
              <img src={SpotifyBadge} alt="Listen on Spotify" className="spotify-badge" />
            </a>

            {/* Next live show pill */}
            <a
              className="live-pill"
              href="https://twitch.tv/mechastormtitan"
              target="_blank"
              rel="noopener noreferrer"
            >

              <LivePill>
                <span className="dot" />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <FaTwitch style={{ fontSize: 18, color: "#9146FF" }} />
                  Next live: <strong>Aug 28 · 8:00 PM PT</strong> on Twitch
                </span>
              </LivePill>

              <span className="dot" />

            </a>
          </div>
        </div>
      </Section>



      <Section id="events">
        <div className="container">
          <h2 className="title">Upcoming Events</h2>
          <div className="rule" />
          <HUD>

            <div className="cell">Aug 28, 2025</div>
            <div className="cell">Almost Pro Tekken Tournament</div>
            <div className="cell cta"><a href="https://west.paxsite.com/en-us/features/pax-arena.html">Details</a></div>

            <div className="cell">9/11</div>
            <div className="cell">Project Aegis</div>
            <div className="cell cta"><a href="https://x.com/mechastormtitan/status/1959121831757324628">Details</a></div>

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

      <Footer>Born of Lightning, Forged in Fire -- We carry the heart of the PNW | Developed by Rockagoth with Care ♥ | © MechaStormTitan 2025</Footer>
    </>
  );
}
