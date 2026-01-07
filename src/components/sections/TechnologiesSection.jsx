import { Card, Row, Col, Tag } from "antd";
import {
  Html5Outlined,
  ApiOutlined,
  DatabaseOutlined,
  RobotOutlined,
  BgColorsOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const TechnologiesSection = () => {
  const techStack = [
    {
      category: "Frontend",
      icon: <Html5Outlined />,
      color: "blue",
      technologies: [
        { name: "HTML", logo: "🌐" },
        { name: "CSS", logo: "🎨" },
        { name: "JavaScript", logo: "⚡" },
        { name: "React.js", logo: "⚛️" },
      ],
    },
    {
      category: "Backend",
      icon: <ApiOutlined />,
      color: "green",
      technologies: [
        { name: "Django", logo: "🐍" },
        { name: "Flask", logo: "🔥" },
        { name: "Node.js", logo: "🟢" },
      ],
    },
    {
      category: "Database",
      icon: <DatabaseOutlined />,
      color: "orange",
      technologies: [
        { name: "MySQL", logo: "🐬" },
        { name: "PostgreSQL", logo: "🐘" },
      ],
    },
    {
      category: "AI & ML",
      icon: <RobotOutlined />,
      color: "purple",
      technologies: [
        { name: "Python", logo: "🐍" },
        { name: "Scikit-Learn", logo: "🤖" },
        { name: "TensorFlow", logo: "🧠" },
      ],
    },
    {
      category: "Design",
      icon: <BgColorsOutlined />,
      color: "pink",
      technologies: [
        { name: "Figma", logo: "🎨" },
        { name: "Adobe XD", logo: "✨" },
      ],
    },
    {
      category: "Version Control",
      icon: <GithubOutlined />,
      color: "cyan",
      technologies: [
        { name: "Git", logo: "📦" },
        { name: "GitHub", logo: "🐙" },
      ],
    },
  ];

  return (
    <section
      id="technologies"
      className="w-full py-16 sm:py-20 lg:py-24 bg-linear-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Technologies <span className="gradient-text">Used</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with modern, industry-standard technologies for optimal
            performance
          </p>
        </div>

        {/* Tech Stack Grid */}
        <Row gutter={[16, 16]} className="sm:gutter-24">
          {techStack.map((stack, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card className="h-full hover-card-effect border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-r from-${stack.color}-500 to-${stack.color}-600 flex items-center justify-center text-white text-xl sm:text-2xl shrink-0`}>
                      {stack.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stack.category}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {stack.technologies.map((tech, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-linear-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all">
                        <span className="text-3xl">{tech.logo}</span>
                        <span className="text-gray-700 font-medium">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Architecture Highlight */}
        <div className="mt-16">
          <Card className="bg-linear-to-r from-purple-600 to-indigo-600 text-white border-0">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Modern Architecture</h3>
              <p className="text-lg opacity-90 mb-8 max-w-4xl mx-auto">
                SSMS is built using a modern, scalable architecture that ensures
                high performance, security, and maintainability.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-4xl mb-2">🚀</div>
                  <div className="font-semibold">Fast</div>
                  <div className="text-sm opacity-80">
                    Optimized Performance
                  </div>
                </div>
                <div>
                  <div className="text-4xl mb-2">🔒</div>
                  <div className="font-semibold">Secure</div>
                  <div className="text-sm opacity-80">
                    Enterprise-Grade Security
                  </div>
                </div>
                <div>
                  <div className="text-4xl mb-2">📱</div>
                  <div className="font-semibold">Responsive</div>
                  <div className="text-sm opacity-80">
                    Mobile-Friendly Design
                  </div>
                </div>
                <div>
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="font-semibold">Scalable</div>
                  <div className="text-sm opacity-80">
                    Grows With Your Needs
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;
