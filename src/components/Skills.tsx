import React from 'react';
import Section from './Section';
import { Code2, Database, Cloud, Palette } from 'lucide-react';
import skillsData from '../data/skills.json';

const iconMap = {
  Code2,
  Database,
  Cloud,
  Palette
};

const Skills = () => {
  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillsData.categories.map((category, index) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          
          return (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <IconComponent className={category.iconColor} size={24} />
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-400">
                      {category.level}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div
                    style={{ width: `${category.level}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400"
                  ></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;