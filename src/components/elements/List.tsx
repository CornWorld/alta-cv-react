import React from 'react';

interface ItemProps {
  marker?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  className?: string;
  autoSpace?: boolean;
}

// 在中日韩字符与英文/数字之间插入空格，避免直接相邻造成阅读与换行问题
const insertCJKSpaces = (text: string) =>
  text
    .replace(/[\u4E00-\u9FFF]([A-Za-z0-9])/g, '$& $1')
    .replace(/([A-Za-z0-9])[\u4E00-\u9FFF]/g, '$1 $&')
    .replace(/([\u4E00-\u9FFF])([A-Za-z0-9])/g, '$1 $2')
    .replace(/([A-Za-z0-9])([\u4E00-\u9FFF])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ');

const Item: React.FC<ItemProps> = ({
  marker = '•',
  href,
  children,
  className = '',
  autoSpace = false
}) => {
  const isStringMarker = typeof marker === 'string';
  const processedChildren = autoSpace && typeof children === 'string' ? insertCJKSpaces(children) : children;
  const content = (
    <div className="cv-item-content">
      {processedChildren}
    </div>
  );

  return (
    <div
      className={`cv-item ${className}`}
      {...(isStringMarker ? { 'data-marker': marker } : {})}
    >
      {!isStringMarker && (
        <span className="cv-item-marker">{marker}</span>
      )}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="cv-item-link">
          {content}
        </a>
      ) : content}
    </div>
  );
};

interface ListProps {
  items?: (string | { text: string; href?: string })[];
  marker?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  autoSpace?: boolean;
}

type ListComponent = React.FC<ListProps> & {
  Item: typeof Item;
};

const List: ListComponent = ({
  items,
  marker = '•',
  children,
  className = '',
  autoSpace = false
}) => {
  return (
    <div className={`cv-item-list ${className}`}>
      {items?.map((item) => {
        const isObject = typeof item === 'object';
        const text = isObject ? item.text : item;
        const processedText = autoSpace && typeof text === 'string' ? insertCJKSpaces(text) : text;
        return (
          <Item
            key={isObject ? item.text : item}
            marker={marker}
            href={isObject ? item.href : undefined}
            autoSpace={autoSpace}
          >
            {processedText}
          </Item>
        );
      })}
      {children}
    </div>
  );
};

List.Item = Item;

export default List;