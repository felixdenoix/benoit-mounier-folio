import { Transition } from "@unseenco/taxi";
import gsap from "gsap";
import { frameDOM } from "@fiddle-digital/string-tune";

export interface TransitionParams {
  trigger: string | HTMLElement | false;
  done: () => void;
}

export type LeaveTransitionParams = {
  from: HTMLElement;
} & TransitionParams;

export type EnterTransitionParams = {
  to: HTMLElement;
} & TransitionParams;

export default class BaseTransition extends Transition {
  /**
   * Handle the transition leaving the previous page.
   * @param { { from: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
   */
  onLeave({ from, done }: LeaveTransitionParams) {
    // do something ...
    gsap.to(from, {
      autoAlpha: 0,
      duration: 1,
      onStart: () => {
        frameDOM.mutate(() => {
          document.body.classList.add("cursor-progress");
        });
      },
      onComplete: () => {
        globalThis.app.smoothScroll?.scrollTo({ position: 0, immediate: true });
        done();
      },
    });
  }

  /**
   * Handle the transition entering the next page.
   * @param { { to: HTMLElement, trigger: string|HTMLElement|false, done: function } } props
   */
  onEnter({ to, done }: EnterTransitionParams) {
    // do something else ...
    gsap.fromTo(
      to,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        onComplete: () => {
          frameDOM.mutate(() => {
            document.body.classList.remove("cursor-progress");
          });
          done();
        },
        duration: 1,
      },
    );
    done();
  }
}
