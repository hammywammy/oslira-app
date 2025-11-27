import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  id?: string;
}

export function Portal({ children, id = 'portal-root' }: PortalProps) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find or create portal root element
    let element = document.getElementById(id);

    if (!element) {
      element = document.createElement('div');
      element.id = id;
      document.body.appendChild(element);
    }

    setPortalElement(element);

    // Cleanup: only remove if we created it
    return () => {
      // Don't remove the element on cleanup - keep it for reuse
      // This prevents flickering when multiple portals mount/unmount
    };
  }, [id]);

  if (!portalElement) {
    return null;
  }

  return createPortal(children, portalElement);
}
