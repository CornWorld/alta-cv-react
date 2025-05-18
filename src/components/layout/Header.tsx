import React from 'react';
import Typography from '../elements/Typography';

interface Contact {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

interface HeaderProps {
  name: string;
  tagline: string;
  photoUrl?: string;
  contacts?: Contact[];
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  name,
  tagline,
  photoUrl,
  contacts = [],
  className = ''
}) => {
  const renderContact = (contact: Contact) => {
    const content = (
      <div className='flex items-center gap-1'>
        <span className="w-3 h-3 flex items-center justify-center text-[var(--color-cv-accent)]">
          {contact.icon}
        </span>
        <span>{contact.text}</span>
      </div>
    );

    return contact.href ? (
      <a
        key={contact.text}
        href={contact.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:text-[var(--color-cv-accent)] transition-colors"
      >
        {content}
      </a>
    ) : (
      <div key={contact.text} className="flex items-center gap-3">
        {content}
      </div>
    );
  };

  return (
    <header className={`relative flex justify-between items-start gap-8 ${className}`}>
      <div className="flex-grow">
        <Typography variant="name" className='mb-1'>
          {name}
        </Typography>
        
        <Typography variant="tagline" className="mb-1">
          {tagline}
        </Typography>
 
        <div className="flex flex-wrap gap-4 text-sm">
          {contacts.map(renderContact)}
        </div>
      </div>

      {photoUrl && (
        <div className="flex-shrink-0">
          <img
            src={photoUrl}
            alt={`Photo of ${name}`}
            className="w-26 h-26 rounded-full object-cover border-[var(--color-cv-accent)]"
          />
        </div>
      )}
    </header>
  );
};

export default Header; 