import { useEffect, useRef } from 'react';

export function useIntersectionObserverPosts(elementRef, onIntersect, options) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Передаём isIntersecting в onIntersect
                onIntersect(entry.isIntersecting);
            });
        }, options);

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [elementRef, onIntersect, options]);
}
