import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
  BookOpen,
  Briefcase,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Terminal,
  Cpu,
  Globe,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Cybersecurity Training',
      desc: 'Master ethical hacking, networking, and security fundamentals with hands-on labs.',
    },
    {
      icon: Terminal,
      title: 'Programming Courses',
      desc: 'Learn Python, C Programming, and Linux from industry experts with real projects.',
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      desc: 'Earn recognized certificates to boost your career and showcase your skills.',
    },
    {
      icon: Cpu,
      title: 'AI-Powered Development',
      desc: 'Build websites and presentations using cutting-edge AI tools and techniques.',
    },
  ];

  const stats = [
    { value: '5K+', label: 'Students Trained' },
    { value: '7+', label: 'Expert Courses' },
    { value: '50+', label: 'Companies Partnered' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Arun Kumar',
      role: 'Security Analyst',
      text: 'Cyber Spyde ethical hacking course gave me the skills to land my first cybersecurity role. The hands-on labs were incredible.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Python Developer',
      text: 'The Python course was well-structured and practical. I went from beginner to building real applications in weeks.',
      rating: 5,
    },
    {
      name: 'Rahul Dev',
      role: 'System Administrator',
      text: 'Linux and networking courses here are top-notch. The instructors explain complex concepts in a simple way.',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900 min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-lime-400 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Logo 3D Display */}
            <div className="flex items-center justify-center md:order-2">
              <div className="relative w-full max-w-md h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-lime-400/30 rounded-2xl blur-3xl animate-pulse"></div>
                <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-600/10 to-lime-400/10 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 transform hover:scale-110 transition-all duration-500 flex items-center justify-center h-full animate-float">
                  {/* Spider Logo SVG */}
                  <svg className="w-80 h-80 drop-shadow-2xl filter brightness-125 hover:brightness-150 transition-all duration-500" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Spider body */}
                    <circle cx="200" cy="180" r="45" fill="#06b6d4" opacity="0.8" />
                    <ellipse cx="200" cy="220" rx="30" ry="40" fill="#0891b2" opacity="0.9" />

                    {/* Spider eyes */}
                    <circle cx="185" cy="170" r="8" fill="#86efac" />
                    <circle cx="215" cy="170" r="8" fill="#86efac" />
                    <circle cx="185" cy="170" r="4" fill="#1a1a1a" />
                    <circle cx="215" cy="170" r="4" fill="#1a1a1a" />

                    {/* Front left legs */}
                    <path d="M 160 190 Q 120 160 100 120" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 160 210 Q 110 200 80 180" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" fill="none" />

                    {/* Front right legs */}
                    <path d="M 240 190 Q 280 160 300 120" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 240 210 Q 290 200 320 180" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" fill="none" />

                    {/* Back left legs */}
                    <path d="M 170 250 Q 130 280 100 320" stroke="#15803d" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 180 260 Q 140 300 110 350" stroke="#15803d" strokeWidth="8" strokeLinecap="round" fill="none" />

                    {/* Back right legs */}
                    <path d="M 230 250 Q 270 280 300 320" stroke="#15803d" strokeWidth="8" strokeLinecap="round" fill="none" />
                    <path d="M 220 260 Q 260 300 290 350" stroke="#15803d" strokeWidth="8" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 backdrop-blur-sm rounded-full text-sm text-cyan-300 mb-6 border border-cyan-500/20">
                <Shield className="w-4 h-4" />
                <span>Cybersecurity & Tech Training</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Master the Art of
                <span className="block text-cyan-400">Cyber & Code</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Join Cyber Spyde and learn ethical hacking, programming, networking, and AI-powered development. Build real skills for the digital age.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20"
                  >
                    Explore Courses
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/courses"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/about"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-gray-700/50">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Course Completed!</p>
                        <p className="text-gray-400 text-xs">Ethical Hacking Fundamentals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-gray-700/50">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Certificate Earned</p>
                        <p className="text-gray-400 text-xs">Python Programming</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-gray-700/50">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Internship Accepted</p>
                        <p className="text-gray-400 text-xs">Security Analyst at CyberSpyde</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-cyan-400">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Cyber Spyde?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to master cybersecurity and technology in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-cyan-600/30 transition-all group"
              >
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Start learning in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your free account and set up your learner profile.', icon: Users },
              { step: '02', title: 'Enroll', desc: 'Browse courses and internships, then enroll in the ones that match your goals.', icon: BookOpen },
              { step: '03', title: 'Achieve', desc: 'Complete courses, earn certificates, and land your dream role.', icon: Award },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center">
                <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-600/20">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-cyan-400 mb-2 block">STEP {step}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 font-semibold text-sm">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-cyan-700 to-cyan-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-cyan-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already building their future with Cyber Spyde.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-colors shadow-lg"
          >
            Browse Courses
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
