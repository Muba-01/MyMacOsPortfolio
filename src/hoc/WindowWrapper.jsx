import useWindowStore from '#store/window.js';
import { useGSAP } from '@gsap/react';
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

const WindowWrapper = (Component, windowKey) => {

    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, isMaximized, prevBounds } = windows[windowKey] || {};
        const ref = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen) return;

            el.style.display = 'block';

            gsap.fromTo(
                el,
                { scale: 0.8, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }, [isOpen]);
        
        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            const [instance] = Draggable.create(el, { onPress() { focusWindow(windowKey); } });
            return () => instance.kill();
        }, []);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? 'block' : 'none';
        }, [isOpen]);

        // Animate maximize / restore using GSAP
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (isMaximized) {
                gsap.killTweensOf(el);
                gsap.to(el, {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    duration: 0.35,
                    ease: 'power3.inOut',
                });
                // remove any transforms that were used for centering so fullscreen sits flush
                el.style.transform = 'none';
            } else {
                // restore: subtle scale and clear inline sizing
                gsap.killTweensOf(el);
                gsap.fromTo(el, { scale: 0.98 }, { scale: 1, duration: 0.25, ease: 'power3.out', onComplete: () => {
                    el.style.left = '';
                    el.style.top = '';
                    el.style.width = '';
                    el.style.height = '';
                    // clear transform so original CSS centering returns
                    el.style.transform = '';
                    gsap.set(el, { clearProps: 'transform' });
                }});
            }
        }, [isMaximized]);

        const classes = ['absolute'];
        if (isMaximized) classes.push('maximized');

        return (
            <section id={windowKey} ref={ref} style={{ zIndex }} className={classes.join(' ')}>
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;

    return Wrapped;

};

export default WindowWrapper;