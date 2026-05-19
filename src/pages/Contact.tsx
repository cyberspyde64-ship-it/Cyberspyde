import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'cyberspyde64@gmail.com', href: 'mailto:cyberspyde64@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+91 9003822475', href: 'tel:+919003822475' },
    { icon: MapPin, label: 'Address', value: 'India', href: '#' },
    { icon: Clock, label: 'Hours', value: 'Mon-Sat: 9AM - 7PM IST', href: '#' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-cyan-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-900 transition-colors group"
                >
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-sm text-gray-400">{value}</p>
                  </div>
                </a>
              ))}

              <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Quick Response</h3>
                </div>
                <p className="text-sm text-gray-400">
                  We typically respond within 24 hours on business days. For urgent matters, call us directly.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none placeholder-gray-600"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-medium rounded-xl hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
