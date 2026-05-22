import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import PaymentModal from '../components/PaymentModal';
import {
  BookOpen,
  Clock,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Loader2,
  Star,
  LogIn,
  CreditCard,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  category: string;
  level: string;
  instructor: string;
  status: string;
}

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [ratingCourse, setRatingCourse] = useState<string | null>(null);
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) fetchEnrollments();
  }, [user]);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user.id);
    setEnrolledIds(new Set((data || []).map(e => e.course_id)));
  };

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setPaymentCourse(course);
    }
  };

  const handlePaymentComplete = async (transactionId: string) => {
    if (!user || !paymentCourse) return;
    setEnrolling(paymentCourse.id);
    try {
      // Record payment
      await supabase.from('payments').insert({
        student_id: user.id,
        course_id: paymentCourse.id,
        amount: paymentCourse.price,
        transaction_id: transactionId,
        status: 'completed',
        payment_date: new Date().toISOString(),
      });

      // Create enrollment
      const { error } = await supabase.from('enrollments').insert({
        student_id: user.id,
        course_id: paymentCourse.id,
        status: 'active',
        payment_status: 'paid',
      });
      if (error) throw error;
      setEnrolledIds(prev => new Set([...prev, paymentCourse.id]));
      setPaymentCourse(null);

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enrollment-confirm`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_email: user.email,
            student_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            course_title: paymentCourse?.title || '',
          }),
        });
      } catch {
        // Email confirmation is non-critical
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };

  const handleRating = async (courseId: string, rating: number) => {
    if (!user || !enrolledIds.has(courseId)) return;
    try {
      await supabase.from('course_ratings').insert({
        student_id: user.id,
        course_id: courseId,
        rating: rating,
      });
      setRatings(prev => ({ ...prev, [courseId]: rating }));
      setRatingCourse(null);
    } catch {
      alert('Failed to submit rating.');
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-cyan-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Courses</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Expert-led courses in cybersecurity, programming, and AI-powered development.
          </p>
        </div>
      </section>

      <section className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user && (
            <div className="mb-8 p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-xl flex items-center gap-3 justify-center">
              <LogIn className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Sign in to enroll in courses and view full details</span>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-gray-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => {
                const enrolled = enrolledIds.has(course.id);
                return (
                  <div
                    key={course.id}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-600/30 transition-all group"
                  >
                    <div className="h-44 bg-gradient-to-br from-cyan-900 to-gray-900 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-cyan-500/10" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${levelColors[course.level] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-sm">
                          {course.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        {course.instructor && (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {course.instructor}
                          </span>
                        )}
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </span>
                        )}
                      </div>
                      {enrolled && ratingCourse === course.id ? (
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                          <span className="text-xs text-gray-400">Rate course:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => handleRating(course.id, star)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-4 h-4 ${star <= (ratings[course.id] || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setRatingCourse(null)}
                            className="text-xs text-gray-500 hover:text-gray-400 ml-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <span className="flex items-center gap-1 text-lg font-bold text-cyan-400">
                            <DollarSign className="w-4 h-4" />
                            {course.price === 0 ? 'Free' : `${course.price}`}
                          </span>
                          {enrolled ? (
                            <button
                              onClick={() => setRatingCourse(course.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Rate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrolling === course.id || !user}
                              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50"
                            >
                              {enrolling === course.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4" />
                              )}
                              {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        open={!!paymentCourse}
        onClose={() => setPaymentCourse(null)}
        courseTitle={paymentCourse?.title || ''}
        coursePrice={paymentCourse?.price || 400}
        studentEmail={user?.email || ''}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
