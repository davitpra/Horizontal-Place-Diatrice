import { createPortal } from 'react-dom';

export function ReactPortal({ children, wrapperId }) {
  return createPortal(children, document.getElementById(wrapperId));
}