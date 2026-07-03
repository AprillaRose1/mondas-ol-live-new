'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animate, motion, useMotionValue, type PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HERO_CAROUSEL_INTERVAL_MS } from '@/lib/hero-images';

const swipeTransition = { duration: 0.65, ease: [0.32, 0.72, 0, 1] as const };
const SWIPE_OFFSET_THRESHOLD = 36;
const SWIPE_VELOCITY_THRESHOLD = 320;

const CONTROLS_Z = 'z-[60]';

type HeroCarouselProps = {
  images: readonly string[];
  alt: string;
  intervalMs?: number;
  priority?: boolean;
  className?: string;
};

/** Clone first/last for seamless loop animation (last → first slides naturally). */
function buildSlides(images: readonly string[]) {
  if (images.length <= 1) return [...images];
  return [images[images.length - 1], ...images, images[0]];
}

function toRealIndex(position: number, count: number) {
  if (count <= 1) return 0;
  if (position === 0) return count - 1;
  if (position === count + 1) return 0;
  return position - 1;
}

export function HeroCarousel({
  images,
  alt,
  intervalMs = HERO_CAROUSEL_INTERVAL_MS,
  priority = true,
  className,
}: HeroCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slides = useMemo(() => buildSlides(images), [images]);
  const count = images.length;
  const looped = count > 1;

  const [position, setPosition] = useState(looped ? 1 : 0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [usePointerDrag, setUsePointerDrag] = useState(false);
  const positionRef = useRef(looped ? 1 : 0);
  const pauseUntilRef = useRef(0);
  const skipAnimationRef = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const x = useMotionValue(0);

  const realIndex = toRealIndex(position, count);

  const snapWithoutAnimation = useCallback(
    (nextPosition: number) => {
      skipAnimationRef.current = true;
      positionRef.current = nextPosition;
      setPosition(nextPosition);
      if (slideWidth > 0) {
        x.set(-nextPosition * slideWidth);
      }
    },
    [slideWidth, x],
  );

  const moveTo = useCallback(
    (nextPosition: number) => {
      if (!looped) return;
      positionRef.current = nextPosition;
      setPosition(nextPosition);
      pauseUntilRef.current = Date.now() + intervalMs;
    },
    [intervalMs, looped],
  );

  const goToReal = useCallback(
    (real: number) => {
      if (!looped) return;
      moveTo(real + 1);
    },
    [looped, moveTo],
  );

  const goNext = useCallback(() => {
    if (!looped) return;
    moveTo(positionRef.current + 1);
  }, [looped, moveTo]);

  const goPrev = useCallback(() => {
    if (!looped) return;
    moveTo(positionRef.current - 1);
  }, [looped, moveTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => setSlideWidth(el.clientWidth);
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setUsePointerDrag(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (slideWidth === 0) return;

    const target = -position * slideWidth;

    if (skipAnimationRef.current) {
      x.set(target);
      skipAnimationRef.current = false;
      return;
    }

    const controls = animate(x, target, {
      ...swipeTransition,
      onComplete: () => {
        if (!looped) return;
        const pos = positionRef.current;
        if (pos === 0) {
          snapWithoutAnimation(count);
        } else if (pos === count + 1) {
          snapWithoutAnimation(1);
        }
      },
    });

    return () => controls.stop();
  }, [position, slideWidth, count, looped, snapWithoutAnimation, x]);

  const onDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!looped || slideWidth === 0) return;

      const { offset, velocity } = info;
      const curr = positionRef.current;

      let next = curr;
      if (offset.x < -SWIPE_OFFSET_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
        next = curr + 1;
      } else if (offset.x > SWIPE_OFFSET_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
        next = curr - 1;
      }

      if (next === curr) {
        animate(x, -curr * slideWidth, swipeTransition);
        return;
      }

      moveTo(next);
    },
    [looped, moveTo, slideWidth, x],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    touchStartY.current = e.touches[0]?.clientY ?? 0;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!looped) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      if (Math.abs(deltaX) < SWIPE_OFFSET_THRESHOLD) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev, looped],
  );

  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (!looped) return;
    pauseUntilRef.current = Date.now() + intervalMs;

    const tick = () => {
      if (Date.now() < pauseUntilRef.current) return;
      moveTo(positionRef.current + 1);
    };

    const id = window.setInterval(tick, 400);
    return () => window.clearInterval(id);
  }, [intervalMs, looped, moveTo]);

  if (images.length === 0) return null;

  const dragConstraints =
    slideWidth > 0 && looped
      ? { left: -(slides.length - 1) * slideWidth, right: 0 }
      : { left: 0, right: 0 };

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 z-0 touch-pan-y overflow-hidden bg-bg-page', className)}
      aria-roledescription="carousel"
      aria-label={alt}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <motion.div
        className="flex h-full md:cursor-grab md:active:cursor-grabbing"
        style={{ x, width: slideWidth > 0 ? slideWidth * slides.length : '100%' }}
        drag={looped && usePointerDrag ? 'x' : false}
        dragConstraints={dragConstraints}
        dragElastic={0.08}
        dragMomentum
        onDragEnd={onDragEnd}
      >
        {slides.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-full shrink-0 overflow-hidden"
            style={slideWidth > 0 ? { width: slideWidth } : { width: `${100 / slides.length}%` }}
            aria-hidden={looped ? toRealIndex(i, count) !== realIndex : i !== realIndex}
          >
            {/* Blurred fill so letterbox gaps are never empty */}
            <Image
              src={src}
              alt=""
              fill
              quality={30}
              unoptimized
              sizes="100vw"
              aria-hidden
              className="pointer-events-none select-none scale-110 object-cover object-center blur-2xl"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
            {/* Full image, uncropped */}
            <Image
              src={src}
              alt={
                looped
                  ? toRealIndex(i, count) === realIndex
                    ? images.length > 1
                      ? `${alt} (${realIndex + 1}/${images.length})`
                      : alt
                    : ''
                  : i === 0
                    ? alt
                    : ''
              }
              fill
              priority={priority && (looped ? i === 1 : i === 0)}
              quality={100}
              unoptimized
              sizes="100vw"
              className="pointer-events-none relative select-none object-contain object-center"
              draggable={false}
            />
          </div>
        ))}
      </motion.div>

      {looped && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className={cn(
              CONTROLS_Z,
              'absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex',
            )}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className={cn(
              CONTROLS_Z,
              'absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex',
            )}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
          <div className={cn(CONTROLS_Z, 'absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2')}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === realIndex}
                onClick={() => goToReal(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === realIndex ? 'w-8 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/70',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
