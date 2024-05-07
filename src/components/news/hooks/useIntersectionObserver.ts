import { useEffect, useRef } from 'react';

export function useIntersectionObserver(elementRef, onIntersect, options) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
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
