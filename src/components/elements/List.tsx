import React from 'react';

interface ItemProps {
  marker?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const Item: React.FC<ItemProps> = ({
  marker = '•',
  href,
  children,
  className = ''
}) => {
  const isStringMarker = typeof marker === 'string';
  const content = (
    <div className="cv-item-content">
      {children}
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
}

type ListComponent = React.FC<ListProps> & {
  Item: typeof Item;
};

const List: ListComponent = ({
  items,
  marker = '•',
  children,
  className = ''
}) => {
  return (
    <div className={`cv-item-list ${className}`}>
      {items?.map((item) => {
        const isObject = typeof item === 'object';
        return (
          <Item
            key={isObject ? item.text : item}
            marker={marker}
            href={isObject ? item.href : undefined}
          >
            {isObject ? item.text : item}
          </Item>
        );
      })}
      {children}
    </div>
  );
};

List.Item = Item;

export default List; 