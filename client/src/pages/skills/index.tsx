import React, { useState } from 'react';
import { FaReact, FaCode, FaShieldAlt, FaTools, FaPlus, FaMinus, FaFileDownload } from 'react-icons/fa';
import { IoMdCheckmark, IoMdSchool } from 'react-icons/io';

type Skill = {
  name: string;
  details: string[];
  grade?: string;
};

type SkillCategory = {
  title: string;
  icon: React.JSX.Element;
  skills: Skill[];
};

const SkillsPage: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpansion = (categoryIndex: number) => {
    const key = `${categoryIndex}`;
    setExpandedCategories((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Development',
      icon: <FaReact className="w-6 h-6" />,
      skills: [
        { name: 'React', details: ['Next.js', 'React Router', 'React Query'] },
        { name: 'JavaScript', details: ['ES6+', 'Async Programming'] },
        { name: 'TypeScript', details: ['Type Safety', 'Interfaces', 'Generics'] },
        { name: 'UI/UX Frameworks', details: ['Tailwind CSS', 'Bootstrap'] },
      ],
    },
    {
      title: 'Backend Development',
      icon: <FaCode className="w-6 h-6" />,
      skills: [
        { name: '.NET Development', details: ['C#', 'ASP.NET Core', 'Entity Framework'] },
        {
          name: 'Node.js',
          details: ['Express.js', 'Fastify', 'Prisma ORM', 'JWT Authentication', 'Mongoose'],
        },
        {
          name: 'Databases',
          details: ['MySQL', 'MongoDB', 'PostgreSQL', 'SQL Server'],
        },
      ],
    },
    {
      title: 'Security & Networking',
      icon: <FaShieldAlt className="w-6 h-6" />,
      skills: [
        { name: 'Web Security', details: ['OWASP', 'XSS', 'SQL Injection Prevention'] },
        { name: 'Authentication', details: ['JWT', 'OAuth', 'Session Management'] },
        { name: 'Networking', details: ['HTTP/HTTPS', 'DNS', 'TCP/IP', 'SSH'] },
      ],
    },
    {
      title: 'DevOps & Tools',
      icon: <FaTools className="w-6 h-6" />,
      skills: [
        { name: 'Version Control', details: ['Git', 'GitHub Actions', 'CI/CD'] },
        { name: 'Containers', details: ['Docker', 'Docker Compose'] },
        { name: 'Testing', details: ['xUnit', 'TDD', 'BDD', 'Moq'] },
      ],
    },
    {
      title: 'Degree in Programming',
      icon: <IoMdSchool className="w-6 h-6" />,
      skills: [
        {
          name: 'Basic Programming',
          details: [
            'The Basic Programming course teaches the core techniques of programming using C#. The concepts learned are transferable to most modern programming languages. It prepares students for programming in an object-oriented environment.',
          ],
          grade: '75%',
        },
        {
          name: 'Databases',
          details: [
            'The Databases course covers the basics of relational databases and managing data within the database. It prepares students for applying databases in projects, focusing on general principles of database design and implementation. Basic SQL is introduced, along with an introduction to non-relational databases.',
          ],
          grade: '90%',
        },
        {
          name: 'IT Essentials',
          details: [
            'The IT Essentials course covers the foundational knowledge needed for any IT profession. It includes practical tasks involving computer systems, along with a deep dive into the internal workings of computers. These topics serve as the base for many other courses in the program.',
          ],
          grade: '90%',
        },
        {
          name: 'Web Technologies',
          details: [
            'The Web Technologies course teaches how to create interactive and graphical websites using HTML, CSS, and JavaScript. It prepares students to create fully dynamic websites.',
          ],
          grade: '80%',
        },
        {
          name: 'Cloud Systems',
          details: [
            'The Cloud Systems course covers two main areas: the basics of computer networks within the TCP/IP stack and development in cloud environments. The first part replaces the older Networking course and focuses on the fundamentals of networking in the first 6 weeks of lessons.',
          ],
          grade: '85%',
        },
        {
          name: 'Object-Oriented Programming',
          details: [
            'The Object-Oriented Programming course covers the basic concepts of object-oriented programming: encapsulation, abstraction, inheritance, and polymorphism. C# is used to learn these concepts, which prepares students for writing their own APIs using ASP.NET.',
          ],
          grade: '85%',
        },
        {
          name: 'Web Development',
          details: [
            'The Web Development course focuses on developing dynamic web applications, covering both front-end and back-end aspects. It prepares students for developing advanced single-page web applications.',
          ],
          grade: '85%',
        },
        {
          name: 'API Development ',
          details: [
            'The API Development course focuses on creating web services based on open standards such as XML, JSON, and HTTP(s), allowing applications to communicate with each other for data exchange. It covers API development with ASP.NET Core 8.',
          ],
          grade: '100%',
        },
        {
          name: 'Testing & Security',
          details: [
            'The Testing & Security course addresses the security of software projects, focusing on both application security and the protection of data/information. It prepares students to apply security best practices and testing principles in web or software application development.',
          ],
          grade: '90%',
        },
        {
          name: 'Web Frameworks',
          details: [
            'The Web Frameworks course covers the development of web applications using the most commonly used frameworks.',
          ],
          grade: '95%',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <section>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Technical Skills</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-12">
            Full-stack developer with expertise in modern JavaScript frameworks, .NET, and web security. Specializing in
            building secure and scalable web applications.
          </p>

          <div className="space-y-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-gray-700 dark:text-gray-300">{category.icon}</span>
                  <h2 className="text-2xl font-semibold dark:text-white">{category.title}</h2>
                </div>
                <div>
                  <button
                    onClick={() => toggleCategoryExpansion(categoryIndex)}
                    className="flex justify-center items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors dark:text-white"
                  >
                    <FaPlus className={`${expandedCategories[`${categoryIndex}`] ? 'hidden' : 'block'}`} size={14} />
                    <FaMinus className={`${expandedCategories[`${categoryIndex}`] ? 'block' : 'hidden'}`} size={14} />
                  </button>
                  {expandedCategories[`${categoryIndex}`] && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {category.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="mb-4">
                          <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">{skill.name}</h3>
                          <ul className="list-disc pl-5">
                            {skill.details.map((detail, idx) => (
                              <li key={idx}>
                                {detail}
                                {skill.grade && idx === skill.details.length - 1 && (
                                  <span className="flex justify-start text-green-500 items-center gap-1">
                                    <IoMdCheckmark /> Passed with a percentage of {skill.grade}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsPage;
