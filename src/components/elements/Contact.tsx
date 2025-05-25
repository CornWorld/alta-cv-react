import React from 'react';

interface ContactProps {
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}

interface ContactsProps {
  children?: React.ReactNode;
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ icon, href, children }) => {
  const content = (
    <div className='flex items-center gap-1'>
      <span className="w-3 h-3 flex items-center justify-center text-[var(--color-cv-accent)]">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 hover:text-[var(--color-cv-accent)] transition-colors"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3">
      {content}
    </div>
  );
};

const Contacts: React.FC<ContactsProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-4 text-base ${className}`}>
      {children}
    </div>
  );
};

const ContactNamespace = {
  Root: Contacts,
  Item: Contact,
};

export default ContactNamespace; 