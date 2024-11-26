import { useEffect, useRef } from 'react';

export function useIntersectionObserverPosts(elementsRefs, onIntersect, options) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Передаём элемент и его состояние isIntersecting
                onIntersect(entry.target, entry.isIntersecting);
            });
        }, options);


        elementsRefs.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            elementsRefs.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [elementsRefs, onIntersect, options]);
}
