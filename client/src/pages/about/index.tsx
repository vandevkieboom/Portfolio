import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* About Me Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-96 lg:h-auto">
              <img
                src="/api/placeholder/800/600"
                alt="Profile"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6">About Me</h2>
              <p className="text-gray-600 mb-8">
                Hi! I'm John Doe, a passionate web developer intern. Currently pursuing my degree in Computer Science,
                I'm excited to apply my knowledge in a real-world setting at TechCorp.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <span>Intern Web Developer at TechCorp</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span>Amsterdam, Netherlands</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://linkedin.com/in/johndoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                ></a>
                <a
                  href="https://github.com/johndoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                ></a>
                <a
                  href="mailto:john@example.com"
                  className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                ></a>
              </div>
            </div>
          </div>
        </div>

        {/* Internship Info Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8">About My Internship</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">TechCorp - Web Development Team</h3>
                <p className="text-gray-600 mb-6">
                  At TechCorp, I'm working with the web development team on building modern, scalable web applications.
                  My role involves frontend development using React, working with APIs, and learning about modern
                  development practices.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Responsibilities</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    Developing new features for the company's main product
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    Collaborating with senior developers on complex problems
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    Learning and implementing best practices in web development
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    Contributing to team meetings and planning sessions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
