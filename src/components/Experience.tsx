import React from 'react';
import Section from './Section';
import { Building2, Calendar } from 'lucide-react';
import experienceData from '../data/experience.json';

const Experience = () => {
  return (
    <Section>
      <div className="space-y-8">
        {experienceData.experiences.map((exp, index) => (
          <div
            key={index}
            className="relative pl-8 pb-8 border-l-2 border-gray-700 last:pb-0"
          >
            <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
            <div className="mb-2">
              <div className="flex items-center space-x-2 text-xl font-semibold text-blue-400">
                <Building2 size={20} />
                <span>{exp.company}</span>
              </div>
              <div className="text-lg font-medium">{exp.position}</div>
              <div className="flex items-center space-x-2 text-gray-400 mt-1">
                <Calendar size={16} />
                <span>{exp.period}</span>
              </div>
            </div>
            <p className="text-gray-300">{exp.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Experience;