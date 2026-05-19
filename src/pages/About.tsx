import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  BookOpen,
  Briefcase,
  Shield,
} from 'lucide-react';

export default function About() {
  const values = [
    { icon: Target, title: 'Excellence', desc: 'We strive for the highest quality in everything we do, from curriculum design to student support.' },
    { icon: Heart, title: 'Passion', desc: 'We are driven by a genuine passion for cybersecurity and empowering the next generation of professionals.' },
    { icon: Users, title: 'Community', desc: 'We foster a supportive community where learners help each other grow and succeed together.' },
    { icon: Globe, title: 'Accessibility', desc: 'We believe quality tech education should be accessible to everyone, regardless of background or location.' },
  ];

  const team = [
    { name: 'Cyber Spyde Team', role: 'Founder & CEO', bio: 'Passionate about cybersecurity education and building the next generation of tech professionals.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-cyan-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Cyber Spyde</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Building the bridge between education and career success in cybersecurity and technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                To democratize access to quality cybersecurity and technology education by providing affordable, expert-led courses and connecting learners with real-world internship experiences that accelerate professional growth.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                A world where every motivated individual has the tools, knowledge, and opportunities to build a fulfilling career in cybersecurity and technology, regardless of their starting point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-950 rounded-2xl p-6 border border-gray-800">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '5,000+', label: 'Active Learners' },
              { icon: BookOpen, value: '7+', label: 'Expert Courses' },
              { icon: Briefcase, value: '50+', label: 'Partner Companies' },
              { icon: Award, value: '3,500+', label: 'Certificates Issued' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Dedicated professionals committed to your success.
            </p>
          </div>
          <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6 max-w-md mx-auto">
            {team.map(({ name, role, bio }) => (
              <div key={name} className="bg-gray-950 rounded-2xl p-6 text-center border border-gray-800">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{name}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">{role}</p>
                <p className="text-gray-500 text-sm">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
