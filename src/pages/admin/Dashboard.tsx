import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import {
  Users,
  BookOpen,
  Briefcase,
  Award,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  CreditCard,
} from 'lucide-react';

type Tab = 'overview' | 'courses' | 'internships' | 'students' | 'applications' | 'payments' | 'messages';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  level: string;
  instructor: string;
  status: string;
}

interface Internship {
  id: string;
  title: string;
  description: string;
  duration: string;
  stipend: string;
  requirements: string;
  location: string;
  company: string;
  status: string;
}

interface Student {
  id: string;
  full_name: string;
  created_at: string;
}

interface AppItem {
  id: string;
  student_id: string;
  internship_id: string;
  status: string;
  cover_letter: string;
  applied_at: string;
  profiles: { full_name: string }[];
  internships: { title: string; company: string }[];
}

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  status: string;
  payment_status: string;
  progress: number;
  enrolled_at: string;
  profiles: { full_name: string }[];
  courses: { title: string; price: number }[];
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState<Course[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [applications, setApplications] = useState<AppItem[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '', price: 0, category: 'general', level: 'beginner', instructor: '', status: 'active' });

  const [showInternModal, setShowInternModal] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Internship | null>(null);
  const [internForm, setInternForm] = useState({ title: '', description: '', duration: '', stipend: '', requirements: '', location: '', company: '', status: 'active' });

  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [c, i, s, a, e, m] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('internships').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, created_at').eq('role', 'student').order('created_at', { ascending: false }),
      supabase.from('internship_applications').select('id, student_id, internship_id, status, cover_letter, applied_at, profiles(full_name), internships(title, company)').order('applied_at', { ascending: false }),
      supabase.from('enrollments').select('id, student_id, course_id, status, payment_status, progress, enrolled_at, profiles(full_name), courses(title, price)').order('enrolled_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);
    setCourses(c.data || []);
    setInternships(i.data || []);
    setStudents(s.data || []);
    setApplications(a.data || []);
    setEnrollments(e.data || []);
    setMessages(m.data || []);
    setLoading(false);
  };

  const openCourseModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({ title: course.title, description: course.description, duration: course.duration, price: course.price, category: course.category, level: course.level, instructor: course.instructor, status: course.status });
    } else {
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', duration: '', price: 0, category: 'general', level: 'beginner', instructor: '', status: 'active' });
    }
    setShowCourseModal(true);
  };

  const saveCourse = async () => {
    setSaving(true);
    try {
      if (editingCourse) {
        await supabase.from('courses').update(courseForm).eq('id', editingCourse.id);
      } else {
        await supabase.from('courses').insert(courseForm);
      }
      setShowCourseModal(false);
      fetchAll();
    } catch { alert('Failed to save course.'); }
    finally { setSaving(false); }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    await supabase.from('courses').delete().eq('id', id);
    fetchAll();
  };

  const openInternModal = (intern?: Internship) => {
    if (intern) {
      setEditingIntern(intern);
      setInternForm({ title: intern.title, description: intern.description, duration: intern.duration, stipend: intern.stipend, requirements: intern.requirements, location: intern.location, company: intern.company, status: intern.status });
    } else {
      setEditingIntern(null);
      setInternForm({ title: '', description: '', duration: '', stipend: '', requirements: '', location: '', company: '', status: 'active' });
    }
    setShowInternModal(true);
  };

  const saveIntern = async () => {
    setSaving(true);
    try {
      if (editingIntern) {
        await supabase.from('internships').update(internForm).eq('id', editingIntern.id);
      } else {
        await supabase.from('internships').insert(internForm);
      }
      setShowInternModal(false);
      fetchAll();
    } catch { alert('Failed to save internship.'); }
    finally { setSaving(false); }
  };

  const deleteIntern = async (id: string) => {
    if (!confirm('Delete this internship?')) return;
    await supabase.from('internships').delete().eq('id', id);
    fetchAll();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from('internship_applications').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
    fetchAll();
  };

  const updatePaymentStatus = async (id: string, payment_status: string) => {
    await supabase.from('enrollments').update({ payment_status }).eq('id', id);
    fetchAll();
  };

  const markMessageRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchAll();
  };

  const totalRevenue = enrollments.filter(e => e.payment_status === 'paid').reduce((sum, e) => sum + (e.courses?.[0]?.price || 0), 0);
  const pendingPayments = enrollments.filter(e => e.payment_status === 'unpaid');
  const paidEnrollments = enrollments.filter(e => e.payment_status === 'paid');

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: Eye },
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'internships', label: 'Internships', icon: Briefcase },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'applications', label: 'Applications', icon: Award },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
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
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-cyan-100">Manage courses, internships, students, and more.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto mb-6 bg-gray-900 rounded-xl p-1 shadow-sm border border-gray-800">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                tab === key ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{courses.length}</p>
                    <p className="text-xs text-gray-500">Courses</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{internships.length}</p>
                    <p className="text-xs text-gray-500">Internships</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{students.length}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{pendingPayments.length}</p>
                    <p className="text-xs text-gray-500">Pending Payments</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{messages.filter(m => !m.is_read).length}</p>
                    <p className="text-xs text-gray-500">Unread Messages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        {tab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Manage Courses</h2>
              <button onClick={() => openCourseModal()} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors">
                <Plus className="w-4 h-4" /> Add Course
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Title</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Level</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {courses.map(c => (
                      <tr key={c.id} className="hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{c.title}</td>
                        <td className="px-4 py-3 capitalize text-gray-300">{c.level}</td>
                        <td className="px-4 py-3 text-gray-300">${c.price}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openCourseModal(c)} className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCourse(c.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Internships */}
        {tab === 'internships' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Manage Internships</h2>
              <button onClick={() => openInternModal()} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors">
                <Plus className="w-4 h-4" /> Add Internship
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Title</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Company</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Location</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {internships.map(i => (
                      <tr key={i.id} className="hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{i.title}</td>
                        <td className="px-4 py-3 text-gray-300">{i.company}</td>
                        <td className="px-4 py-3 text-gray-300">{i.location}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${i.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openInternModal(i)} className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteIntern(i.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Registered Students</h2>
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{s.full_name || 'Unnamed'}</td>
                        <td className="px-4 py-3 text-gray-300">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Applications */}
        {tab === 'applications' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Internship Applications</h2>
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Internship</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {applications.map(a => (
                      <tr key={a.id} className="hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{a.profiles?.[0]?.full_name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-gray-300">{a.internships?.[0]?.title}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            a.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                            a.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          {a.status === 'pending' && (
                            <>
                              <button onClick={() => updateAppStatus(a.id, 'accepted')} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Accept">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => updateAppStatus(a.id, 'rejected')} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments */}
        {tab === 'payments' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Payment Management</h2>

            {/* Payment summary cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{paidEnrollments.length}</p>
                    <p className="text-xs text-gray-500">Paid Enrollments</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{pendingPayments.length}</p>
                    <p className="text-xs text-gray-500">Pending Payments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollments with payment status */}
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Course</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Payment</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-400">Enrollment</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {enrollments.map(e => (
                      <tr key={e.id} className="hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{e.profiles?.[0]?.full_name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-gray-300">{e.courses?.[0]?.title}</td>
                        <td className="px-4 py-3 text-gray-300">${e.courses?.[0]?.price || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            e.payment_status === 'paid' ? 'bg-green-500/10 text-green-400' :
                            e.payment_status === 'refunded' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-700'
                          }`}>{e.payment_status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            e.status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                            e.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                            'bg-gray-700 text-gray-400'
                          }`}>{e.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {e.payment_status === 'unpaid' && (
                            <button
                              onClick={() => updatePaymentStatus(e.id, 'paid')}
                              className="px-3 py-1 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                          {e.payment_status === 'paid' && (
                            <button
                              onClick={() => updatePaymentStatus(e.id, 'refunded')}
                              className="px-3 py-1 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              Refund
                            </button>
                          )}
                          {e.payment_status === 'refunded' && (
                            <button
                              onClick={() => updatePaymentStatus(e.id, 'unpaid')}
                              className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {enrollments.length === 0 && (
                <div className="p-8 text-center">
                  <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No enrollments yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Contact Messages</h2>
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`bg-gray-900 rounded-xl p-5 shadow-sm border ${m.is_read ? 'border-gray-800' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{m.name}</span>
                        <span className="text-xs text-gray-500">{m.email}</span>
                        {!m.is_read && <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full">New</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-300 mb-1">{m.subject}</p>
                      <p className="text-sm text-gray-500">{m.message}</p>
                    </div>
                    {!m.is_read && (
                      <button onClick={() => markMessageRead(m.id)} className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors flex-shrink-0" title="Mark as read">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                  <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No messages yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea rows={3} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input value={courseForm.duration} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. 8 weeks" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input type="number" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                  <select value={courseForm.level} onChange={e => setCourseForm(f => ({ ...f, level: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instructor</label>
                  <input value={courseForm.instructor} onChange={e => setCourseForm(f => ({ ...f, instructor: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select value={courseForm.status} onChange={e => setCourseForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg">Cancel</button>
              <button onClick={saveCourse} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingCourse ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internship Modal */}
      {showInternModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editingIntern ? 'Edit Internship' : 'Add Internship'}</h3>
              <button onClick={() => setShowInternModal(false)} className="p-1 hover:bg-gray-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input value={internForm.title} onChange={e => setInternForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea rows={3} value={internForm.description} onChange={e => setInternForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                  <input value={internForm.company} onChange={e => setInternForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                  <input value={internForm.location} onChange={e => setInternForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input value={internForm.duration} onChange={e => setInternForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. 3 months" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stipend</label>
                  <input value={internForm.stipend} onChange={e => setInternForm(f => ({ ...f, stipend: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="e.g. $500/month" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Requirements</label>
                <textarea rows={2} value={internForm.requirements} onChange={e => setInternForm(f => ({ ...f, requirements: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select value={internForm.status} onChange={e => setInternForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowInternModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg">Cancel</button>
              <button onClick={saveIntern} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editingIntern ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
