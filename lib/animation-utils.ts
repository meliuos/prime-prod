import gsap from 'gsap';

/**
 * Common GSAP animation presets and utilities
 */

export const easings = {
    smooth: 'power3.out',
    bounce: 'elastic.out(1, 0.5)',
    snap: 'power4.inOut',
    gentle: 'power2.out',
} as const;

export const durations = {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
    verySlow: 1.5,
} as const;

/**
 * Fade in from bottom animation
 */
export const fadeInUp = (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: durations.normal,
            ease: easings.smooth,
            delay,
        }
    );
};

/**
 * Scale in animation
 */
export const scaleIn = (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
        element,
        { opacity: 0, scale: 0.9 },
        {
            opacity: 1,
            scale: 1,
            duration: durations.normal,
            ease: easings.smooth,
            delay,
        }
    );
};

/**
 * Slide in from left
 */
export const slideInLeft = (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
        element,
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: durations.normal,
            ease: easings.smooth,
            delay,
        }
    );
};

/**
 * Slide in from right
 */
export const slideInRight = (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
        element,
        { opacity: 0, x: 50 },
        {
            opacity: 1,
            x: 0,
            duration: durations.normal,
            ease: easings.smooth,
            delay,
        }
    );
};

/**
 * Stagger children animation
 */
export const staggerChildren = (
    container: gsap.TweenTarget,
    childSelector: string,
    staggerAmount = 0.1
) => {
    return gsap.fromTo(
        gsap.utils.toArray(`${container} ${childSelector}`),
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: durations.normal,
            ease: easings.smooth,
            stagger: staggerAmount,
        }
    );
};

/**
 * Common ScrollTrigger configuration
 */
export const scrollTriggerConfig = {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
} as const;

/**
 * Magnetic effect for interactive elements
 */
export const createMagneticEffect = (element: HTMLElement, strength = 0.3) => {
    const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
            x: x * strength,
            y: y * strength,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
        });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
    };
};
