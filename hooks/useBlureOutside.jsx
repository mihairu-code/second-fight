import { useEffect } from 'react';

export default function useBlurOutside(ref, handler) {
  useEffect(() => {
    const handleBlur = event => {
      if (!ref.current || ref.current.contains(event.relatedTarget)) {
        return;
      }
      handler();
    };

    if (ref.current) {
      ref.current.addEventListener('focusout', handleBlur);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('focusout', handleBlur);
      }
    };
  }, [ref, handler]);
}
