import React from 'react';
import classNames from 'classnames';
import s from './Hero.module.css';

type HeroProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const Hero: React.FC<HeroProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(s.hero, className)} {...props}>
      {children}
    </div>
  );
};

export default Hero;
