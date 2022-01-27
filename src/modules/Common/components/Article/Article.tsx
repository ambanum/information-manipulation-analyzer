import React from 'react';
import classNames from 'classnames';
import s from './Article.module.scss';

type ArticleProps = {
  // TODO
} & React.HTMLAttributes<HTMLDivElement>;

const Article: React.FC<ArticleProps> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(s.article, className)} {...props}>
      {children}
    </div>
  );
};

export default Article;
