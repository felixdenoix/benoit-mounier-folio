import { type StringContext, StringModule, StringData, StringObject, styleTxn } from "@fiddle-digital/string-tune";
import { round } from "./index";

export class StringProximity extends StringModule {
  constructor(context: StringContext) {
    super(context);
    this.htmlKey = "proximity";
    this.defaultModeScope = ["smooth"];

    this.cssProperties = [{ name: "--distance", syntax: "<number>", initialValue: "1", inherits: true }];

    this.attributesToMap = [
      ...this.attributesToMap,
      { key: "radius", type: "dimension", fallback: 100 },
      { key: "easing", type: "easing", fallback: "cubic-bezier(0.25, 0.25, 0.25, 0.25)" },
      { key: "duration", type: "number", fallback: 0.3 },
      { key: "lerp", type: "number", fallback: 0.1 },
    ];
  }

  override onObjectConnected(object: StringObject): void {
    const proximity = this.data.scroll.mode === "smooth" ? 0 : 1;
    object.setProperty("proximity-distance", proximity);
    object.setProperty("target-proximity", proximity);
  }

  override onResize(): void {
    this.measure(this.data);
  }

  override onMouseMoveMeasure(data: StringData): void {
    this.measure(data);
  }

  override onScrollMeasure(data: StringData): void {
    this.measure(data);
  }

  private measure(data: StringData): void {
    if (this.data.scroll.mode !== "smooth") return;

    if (this.objects.length) {
      const cursorX = data.cursor.smoothedX;
      const cursorY = data.cursor.smoothedY;

      for (let i = 0; i < this.objects.length; i++) {
        const object = this.objects[i];
        const rect = this.tools.boundingClientRect.process({ element: object.htmlElement });
        const radius = object.getProperty<number>("radius") ?? 100;
        const easing = object.getProperty<(t: number) => number>("easing");

        const dx = Math.max(rect.left - cursorX, 0, cursorX - rect.right);
        const dy = Math.max(rect.top - cursorY, 0, cursorY - rect.bottom);
        const dist = Math.hypot(dx, dy);

        // 1 when inside/on the rect, 0 at radius distance from the rect
        let proximity = Math.max(0, 1 - dist / radius);

        if (easing) {
          proximity = easing(proximity);
        }

        object.setProperty("target-proximity", round(proximity, 4));
      }
    }
  }

  override onFrame(data: StringData): void {
    if (this.objects.length === 0) return;

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const target = object.getProperty<number>("target-proximity") ?? 0;
      const current = object.getProperty<number>("proximity-distance") ?? 0;
      const duration = object.getProperty<number>("duration") ?? 0.3;

      if (current === target) {
        continue;
      }

      // Calculate progress factor based on frame delta and desired duration
      // This ensures the animation takes a consistent amount of time regardless of FPS
      const progress = duration > 0 ? data.time.delta / (duration * 1000) : 1;

      const step = this.tools.lerp.process({
        from: current,
        to: target,
        progress: Math.min(progress, 1),
      });

      // Snap to target if step is extremely small or we are close enough
      const next = Math.abs(target - current) < 0.00001 ? target : round(current + step, 6);

      object.setProperty("proximity-distance", next);
    }
  }

  override onMutate(): void {
    if (this.objects.length === 0) return;

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const proximity = object.getProperty<number>("proximity-distance");
      const target = object.getProperty<number>("target-proximity") ?? 0;

      if (proximity === target) continue;

      if (proximity !== undefined) {
        styleTxn.setVar(object.htmlElement, "--distance", round(proximity, 4));

        // for (const mirror of object.mirrorObjects) {
        //   const mirrorString = mirror.htmlElement.getAttribute('string') || mirror.htmlElement.getAttribute('data-string') || '';
        //   if (!mirrorString.includes('proximity')) {
        //     styleTxn.setVar(mirror.htmlElement, '--distance', round(proximity, 4));
        //   }
        // }
      }
    }
  }

  override onObjectDisconnected(object: StringObject): void {
    const clear = (el: HTMLElement) => {
      el.style.removeProperty("--distance");
    };

    clear(object.htmlElement);
    for (const mirror of object.mirrorObjects) {
      clear(mirror.htmlElement);
    }
  }

  // override enterObject(id: string, object: StringObject): void {
  //   console.log('enterObject', id, object);
  // }

  // override exitObject(id: string): void {
  //   console.log('exitObject', id);
  // }
}
