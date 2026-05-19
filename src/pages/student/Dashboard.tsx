import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import {
  BookOpen,
  Briefcase,
  Award,
  Clock,
  Download,
  Loader2,
  CheckCircle,
  BarChart3,
  User,
  Save,
  Camera,
} from 'lucide-react';

type Tab = 'courses' | 'internships' | 'certificates' | 'profile';

interface Enrollment {
  id: string;
  course_id: string;
  status: string;
  payment_status: string;
  progress: number;
  enrolled_at: string;
  courses: { title: string; duration: string; level: string }[];
}

interface Application {
  id: string;
  internship_id: string;
  status: string;
  applied_at: string;
  internships: { title: string; company: string; location: string }[];
}

interface Certificate {
  id: string;
  certificate_number: string;
  issued_at: string;
  course_id: string;
  courses: { title: string }[];
}

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const certRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setProfileForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
    }
  }, [profile]);

  const fetchData = async () => {
    if (!user) return;
    const [enrollRes, appRes, certRes] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, course_id, status, payment_status, progress, enrolled_at, courses(title, duration, level)')
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false }),
      supabase
        .from('internship_applications')
        .select('id, internship_id, status, applied_at, internships(title, company, location)')
        .eq('student_id', user.id)
        .order('applied_at', { ascending: false }),
      supabase
        .from('certificates')
        .select('id, certificate_number, issued_at, course_id, courses(title)')
        .eq('student_id', user.id)
        .order('issued_at', { ascending: false }),
    ]);
    setEnrollments(enrollRes.data || []);
    setApplications(appRes.data || []);
    setCertificates(certRes.data || []);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profileForm.full_name, phone: profileForm.phone, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      alert('Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const downloadCertificate = (cert: Certificate) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = '#0e7490';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 810);

    // Inner border
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 1130, 780);

    // Corner accents
    const cornerSize = 30;
    ctx.fillStyle = '#0e7490';
    [[35, 35], [1165 - cornerSize, 35], [35, 815 - cornerSize], [1165 - cornerSize, 815 - cornerSize]].forEach(([x, y]) => {
      ctx.fillRect(x, y, cornerSize, 3);
      ctx.fillRect(x, y, 3, cornerSize);
    });

    // Header line
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(200, 100, 800, 3);

    // Title
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 600, 170);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Georgia, serif';
    ctx.fillText('This is to certify that', 600, 230);

    // Student name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText(profile?.full_name || user?.email || 'Student', 600, 300);

    // Decorative line under name
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(350, 320, 500, 2);

    // Course description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Georgia, serif';
    ctx.fillText('has successfully completed the course', 600, 380);

    // Course name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Georgia, serif';
    ctx.fillText(cert.courses?.[0]?.title || 'Course', 600, 440);

    // Date
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Georgia, serif';
    ctx.fillText(`Issued on ${new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 600, 510);

    // Certificate number
    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText(`Certificate ID: ${cert.certificate_number || cert.id.slice(0, 8).toUpperCase()}`, 600, 560);

    // Bottom line
    ctx.fillStyle = '#0e7490';
    ctx.fillRect(200, 620, 800, 3);

    // Signatures
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Georgia, serif';
    ctx.fillText('_________________________', 350, 700);
    ctx.fillText('_________________________', 850, 700);
    ctx.font = '14px Georgia, serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Program Director', 350, 725);
    ctx.fillText('Lead Instructor', 850, 725);

    // Cyber Spyde branding
    ctx.fillStyle = '#0e7490';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('Cyber Spyde', 600, 790);

    // Download
    const link = document.createElement('a');
    link.download = `certificate-${cert.certificate_number || cert.id.slice(0, 8)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const statusColors: Record<string, string> = {
    active: 'bg-cyan-500/10 text-cyan-400',
    completed: 'bg-green-500/10 text-green-400',
    pending: 'bg-yellow-500/10 text-yellow-400',
    dropped: 'bg-red-500/10 text-red-400',
    paid: 'bg-green-500/10 text-green-400',
    unpaid: 'bg-yellow-500/10 text-yellow-400',
    refunded: 'bg-red-500/10 text-red-400',
    accepted: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
    withdrawn: 'bg-gray-800 text-gray-400',
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'courses', label: 'My Courses', icon: BookOpen },
    { key: 'internships', label: 'Internships', icon: Briefcase },
    { key: 'certificates', label: 'Certificates', icon: Award },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-cyan-100">Welcome back, {profile?.full_name || user?.email}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{enrollments.length}</p>
                <p className="text-xs text-gray-500">Enrolled Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{enrollments.filter(e => e.status === 'completed').length}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{applications.length}</p>
                <p className="text-xs text-gray-500">Applications</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{certificates.length}</p>
                <p className="text-xs text-gray-500">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-6 bg-gray-900 rounded-xl p-1 shadow-sm border border-gray-800">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                tab === key ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {tab === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My Courses</h2>
              <Link to="/courses" className="text-sm text-cyan-400 hover:underline">Browse More</Link>
            </div>
            {enrollments.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-800">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{enrollment.courses?.[0]?.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[enrollment.status] || 'bg-gray-800 text-gray-400'}`}>
                            {enrollment.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[enrollment.payment_status] || 'bg-gray-800 text-gray-400'}`}>
                            {enrollment.payment_status}
                          </span>
                        </div>
                        {enrollment.status === 'active' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span className="font-medium text-gray-300">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div className="bg-cyan-600 h-2 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Internships Tab */}
        {tab === 'internships' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My Applications</h2>
              <Link to="/internships" className="text-sm text-cyan-400 hover:underline">View All Internships</Link>
            </div>
            {applications.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-800">
                <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">You haven't applied to any internships yet.</p>
                <Link to="/internships" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors">
                  Browse Internships
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{app.internships?.[0]?.title}</p>
                        <p className="text-sm text-gray-400">{app.internships?.[0]?.company} {app.internships?.[0]?.location && ` - ${app.internships[0].location}`}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[app.status] || 'bg-gray-800 text-gray-400'}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {tab === 'certificates' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">My Certificates</h2>
            {certificates.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-800">
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No certificates yet.</p>
                <p className="text-sm text-gray-500">Complete a course to earn your certificate.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-800 hover:border-gray-700 transition-colors group">
                    <div className="h-36 bg-gradient-to-br from-cyan-500/10 to-cyan-900/20 flex items-center justify-center relative">
                      <Award className="w-16 h-16 text-cyan-800 group-hover:text-cyan-400 transition-colors" />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-gray-950/80 text-cyan-400 px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                          Verified
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-white truncate">{cert.courses?.[0]?.title}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">{cert.certificate_number || cert.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Issued {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <button
                        onClick={() => downloadCertificate(cert)}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Settings</h2>
            <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
              {/* Avatar section */}
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {(profile?.full_name || user?.email || 'S')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{profile?.full_name || 'Set your name'}</p>
                    <p className="text-cyan-200 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-800 rounded-xl text-sm bg-gray-950 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-800 rounded-xl text-sm bg-gray-950 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-800 rounded-xl text-sm bg-gray-950 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                  <input
                    type="text"
                    value={profile?.role || 'student'}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-800 rounded-xl text-sm bg-gray-950 text-gray-500 capitalize cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Member Since</label>
                  <input
                    type="text"
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-800 rounded-xl text-sm bg-gray-950 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : profileSaved ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {profileSaved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={certRef} className="hidden" />
    </div>
  );
}
