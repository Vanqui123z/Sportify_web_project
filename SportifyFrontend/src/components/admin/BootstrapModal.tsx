import React, { useEffect } from 'react';

interface BootstrapModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  scrollable?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const BootstrapModal: React.FC<BootstrapModalProps> = ({
  show,
  onHide,
  title,
  size,
  centered = true,
  scrollable = true,
  backdrop = true,
  keyboard = true,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (keyboard && event.keyCode === 27) {
        onHide();
      }
    };
    
    if (show) {
      document.addEventListener('keydown', handleEsc, false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
      document.body.style.overflow = 'unset';
    };
  }, [show, keyboard, onHide]);

  if (!show) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (backdrop === true && e.target === e.currentTarget) {
      onHide();
    }
  };

  const modalDialogClasses = [
    'modal-dialog',
    centered && 'modal-dialog-centered',
    scrollable && 'modal-dialog-scrollable',
    size && `modal-${size}`
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Bootstrap Modal Backdrop */}
      <div 
        className={`modal fade show ${className} ` }
        style={{ 
          display: 'block',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050 // Bootstrap's default modal z-index
        }}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        onClick={handleBackdropClick}
      >
        <div className={modalDialogClasses} role="document">
          <div className="modal-content">
            {/* Modal Header */}
            <div className={`modal-header ${headerClassName}`}>
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              >
              </button>
            </div>
            
            {/* Modal Body */}
            <div className={`modal-body ${bodyClassName}`} >
              {children}
            </div>
            
            {/* Modal Footer */}
            {footer && (
              <div className={`modal-footer ${footerClassName}`}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BootstrapModal;