import React from 'react';

const Loading = () => {
  return (
    <section className="loading">
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
    </section>
  );
};

export default Loading;
