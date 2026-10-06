import type { CSSProperties } from "react";

import { GetApp } from "@/components/GetApp";
import { Qr } from "@/components/Qr";
import { Wordmark } from "@/components/Wordmark";
import { CTA, FORMATS, STORY, SUB, TESTFLIGHT_URL, TITLE } from "@/content";

import { Iphone } from "./Iphone";
import { Screens } from "./Screens";
import { StoryDriver } from "./StoryDriver";
import { storyCss } from "./timeline";
import "./story.css";

const CSS = storyCss();

/**
 * Launchy, told by the phone. It wakes in the dark in an orange aura, turns to show itself, picks
 * an idea, films, spins round to the finished video, comes back with the money, and ends facing you. One sticky stage; the scroll is the playhead. The phone's body is a 3D model drawn on the
 * canvas once it loads; its screen is the HTML one, laid over it.
 */
export function Story() {
  return (
    <section data-story className="story" aria-labelledby="title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="stage" data-scene="hero">
        <div className="aura s-aura" data-a aria-hidden>
          <div className="aura-in">
            <i className="aura-haze" />
            <i className="aura-ember" />
            <i className="aura-core" />
            <i className="aura-flare" />
          </div>
        </div>

        <div className="hero">
          <div className="hero-mark s-aside" data-a>
            {/* The launch has just written it big: here it simply arrives with the rest. */}
            <div className="rise" style={{ "--d": "0.1s" } as CSSProperties}>
              <Wordmark dot="#FFFFFF" write={false} />
            </div>
          </div>
          <h1 id="title" className="hero-title">
            <span className="s-get" data-a>
              <span className="rise inline-block" style={{ "--d": "0.2s" } as CSSProperties}>
                {TITLE[0]}
              </span>
            </span>{" "}
            <span className="s-film" data-a>
              <span className="rise inline-block" style={{ "--d": "0.32s" } as CSSProperties}>
                {TITLE[1]}
              </span>
            </span>
          </h1>
          <div className="hero-aside s-aside" data-a>
            <p className="hero-sub rise" style={{ "--d": "0.42s" } as CSSProperties}>
              {SUB}
            </p>
            <GetApp className="rise mt-6 landscape:mt-8" />
          </div>
          <div className="hero-qr s-aside" data-a>
            <div className="rise flex items-center gap-4" style={{ "--d": "0.5s" } as CSSProperties}>
              <div className="rounded-[18px] bg-white p-2.5">
                <Qr value={TESTFLIGHT_URL} className="w-[72px]" />
              </div>
              <p>{CTA.scan}</p>
            </div>
          </div>
        </div>

        <div className="world">
          <canvas className="phone-gl" aria-hidden />
          <div className="persp">
            <div className="tilt">
              <div className="rig s-rig">
                <div className="intro">
                  <Iphone>
                    <div className="wake absolute inset-0">
                      <Screens />
                    </div>
                  </Iphone>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="beats">
          <Beat name="beat-phone" {...STORY.phone} />
          <div className="beat s-beat-idea" data-a>
            <h2>{STORY.idea.title}</h2>
            <ul className="formats">
              {FORMATS.map((f, i) => (
                <li key={f.id} className={`s-fmt${i}`} data-a>
                  <span>
                    <i className={`s-fmt-dot${i}`} data-a aria-hidden />
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
            <div className="formats-say" aria-hidden>
              {FORMATS.map((f, i) => (
                <p key={f.id} className={`s-fmt-say${i}`} data-a>
                  {f.say}
                </p>
              ))}
            </div>
          </div>
          <Beat name="beat-film" {...STORY.film} />
          <Beat name="beat-edit" {...STORY.edit} />
          <Beat name="beat-paid" {...STORY.paid} />
          <div className="beat s-beat-end" data-a>
            <h2>{STORY.end.title}</h2>
            <p className="portrait:hidden">{STORY.end.scan}</p>
            <div className="cta mt-8 flex items-center gap-5 portrait:mt-6">
              <GetApp />
              <span className="text-[15px] text-white/55 portrait:hidden">{STORY.end.tap}</span>
            </div>
          </div>
        </div>

        <div className="pill s-pill" data-a>
          <GetApp />
        </div>
      </div>
      <StoryDriver />
    </section>
  );
}

function Beat({ name, title, body }: { name: string; title: string; body: string }) {
  return (
    <div className={`beat s-${name}`} data-a>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
