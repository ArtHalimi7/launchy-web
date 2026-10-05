import { Frame } from "@/components/Frame";
import { Opening } from "@/components/Opening";
import { Providers } from "@/components/Providers";
import { Earn } from "@/components/scenes/Earn";
import { Film } from "@/components/scenes/Film";
import { Finale } from "@/components/scenes/Finale";
import { Hero } from "@/components/scenes/Hero";
import { Manifesto } from "@/components/scenes/Manifesto";
import { Pick } from "@/components/scenes/Pick";
import { Post } from "@/components/scenes/Post";

/**
 * One page, one take: seven scenes shot in order, inside a viewfinder whose timecode runs with the
 * scroll. Rolling, the idea, pick, film, post, earn, and that's a wrap.
 */
export default function Home() {
  return (
    <Providers>
      <Opening />
      <Frame />
      <main>
        <Hero />
        <Manifesto />
        <Pick />
        <Film />
        <Post />
        <Earn />
        <Finale />
      </main>
    </Providers>
  );
}
