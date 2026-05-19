import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Loader2,
  CheckCircle,
  Send,
  Building2,
  LogIn,
} from 'lucide-react';

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

export default function Internships() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchInternships = async () => {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setInternships(data || []);
    setLoading(false);
  };

  const fetchApplications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('internship_applications')
      .select('internship_id')
      .eq('student_id', user.id);
    setAppliedIds(new Set((data || []).map(a => a.internship_id)));
  };

  const openApplyModal = (id: string) => {
    if (!user) return;
    setSelectedId(id);
    setCoverLetter('');
    setShowModal(true);
  };

  const handleApply = async () => {
    if (!selectedId || !user) return;
    setApplying(selectedId);
    try {
      const { error } = await supabase.from('internship_applications').insert({
        student_id: user.id,
        internship_id: selectedId,
        cover_letter: coverLetter,
        status: 'pending',
      });
      if (error) throw error;
      setAppliedIds(prev => new Set([...prev, selectedId]));
      setShowModal(false);
    } catch {
      alert('Application failed. You may have already applied.');
    } finally {
      setApplying(null);
    }
  };

  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.company.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-cyan-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Internship Programs</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Gain real-world experience with our partner companies and kickstart your career.
          </p>
        </div>
      </section>

      <section className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!user && (
            <div className="mb-8 p-4 bg-cyan-600/10 border border-cyan-500/30 rounded-xl flex items-center gap-3 justify-center">
              <LogIn className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Sign in to apply for internships</span>
            </div>
          )}

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search internships..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-gray-600"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No internships available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map(internship => {
                const applied = appliedIds.has(internship.id);
                return (
                  <div
                    key={internship.id}
                    className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-cyan-600/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{internship.title}</h3>
                            <p className="text-sm text-cyan-400 font-medium">{internship.company}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{internship.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          {internship.location && (
                            <span className="flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                              <MapPin className="w-3 h-3" />
                              {internship.location}
                            </span>
                          )}
                          {internship.duration && (
                            <span className="flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                              <Clock className="w-3 h-3" />
                              {internship.duration}
                            </span>
                          )}
                          {internship.stipend && (
                            <span className="flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                              <DollarSign className="w-3 h-3" />
                              {internship.stipend}
                            </span>
                          )}
                        </div>
                        {internship.requirements && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-gray-400 mb-1">Requirements:</p>
                            <p className="text-xs text-gray-500">{internship.requirements}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {applied ? (
                          <span className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg border border-green-500/20">
                            <CheckCircle className="w-4 h-4" />
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => openApplyModal(internship.id)}
                            disabled={!user}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg p-6 shadow-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Apply for Internship</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Letter</label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none placeholder-gray-600"
                placeholder="Tell us why you're a great fit..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying !== null}
                className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50"
              >
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
