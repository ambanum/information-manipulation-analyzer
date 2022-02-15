import React from 'react';

const Loading = ({
  size,
  className,
  message = 'Loading...',
  showMessage = true,
}: {
  size?: 'sm';
  className?: string;
  message?: string;
  showMessage?: boolean;
}) => {
  if (size === 'sm') {
    return (
      <div className={`loading--sm ${className || ''}`}>
        <div className="spinner-icon"></div>
        {message && showMessage && (
          <div className="fr-text--sm text-center msgsmall">{message}</div>
        )}
      </div>
    );
  }

  return (
    <section className={`loading ${className}`}>
      <div>
        <div>
          <span className="one h6"></span>
          <span className="two h3"></span>
        </div>
      </div>
      <div>
        <div>
          <span className="one h1"></span>
          <span className="two h4"></span>
        </div>
      </div>
      <div>
        <div>
          <span className="one h5"></span>
          <span className="two h2"></span>
        </div>
      </div>
      <div className="hex"></div>
      {message && showMessage && <div className="fr-text--sm text-center msg">{message}</div>}
    </section>
  );
};

export default Loading;
