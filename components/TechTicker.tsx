'use client';

import React from 'react';

const techs = ['REACT', 'NODE.JS', 'DOCKER', 'AWS', 'POSTGRES', 'REDIS', 'NEXT.JS', 'KUBERNETES', 'SYMFONY', 'PHP', 'PYTHON', 'TYPESCRIPT'];

export const TechTicker = () => {
  return (
    <section className="py-12 bg-surface-container-lowest overflow-hidden border-y border-outline-variant/10">
      <div className="flex whitespace-nowrap opacity-30 animate-ticker">
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center gap-4 font-headline text-3xl md:text-4xl font-bold text-on-surface uppercase tracking-tighter mr-4">
            {techs.map((tech, i) => (
              <React.Fragment key={`${set}-${i}`}>
                <span>{tech}</span>
                {i < techs.length - 1 && <span className="text-tertiary mx-2">/</span>}
              </React.Fragment>
            ))}
            <span className="text-tertiary mx-2">/</span>
          </div>
        ))}
      </div>
    </section>
  );
};
