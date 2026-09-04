import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Trash2, Edit3, Download, Upload,
  CheckCircle, FileText, Sparkles, RefreshCw, X, AlertCircle, Eye
} from 'lucide-react';
import type { Syllabus } from '../types';
import { INITIAL_SYLLABUS_LIST } from '../data/initialSyllabus';

interface SyllabusAdminProps {
  isSuperAdmin?: boolean;
}

const SyllabusAdmin: React.FC<SyllabusAdminProps> = ({ isSuperAdmin = false }) => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Syllabus | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    courseTitle: '',
    courseCode: '',
    category: 'Technical',
    duration: '',
    eligibility: '',
    description: '',
    modulesText: '',
    practicalRatio: '70% Practical / 30% Theory',
    fileName: '',
    fileSize: '',
    fileData: '',
  });

  const loadSyllabi = () => {
    const saved = localStorage.getItem('abhinav_syllabi');
    if (saved) {
      try {
        setSyllabi(JSON.parse(saved));
      } catch {
        setSyllabi(INITIAL_SYLLABUS_LIST);
      }
    } else {
      setSyllabi(INITIAL_SYLLABUS_LIST);
      localStorage.setItem('abhinav_syllabi', JSON.stringify(INITIAL_SYLLABUS_LIST));
    }
  };

  useEffect(() => {
    loadSyllabi();
    window.addEventListener('storage', loadSyllabi);
    return () => window.removeEventListener('storage', loadSyllabi);
  }, []);

  const saveToStorage = (updated: Syllabus[]) => {
    setSyllabi(updated);
    localStorage.setItem('abhinav_syllabi', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      courseTitle: '',
      courseCode: `ATI-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Technical',
      duration: '6 Months',
      eligibility: '10th Standard Pass',
      description: '',
      modulesText: 'Safety & Tools Basics\nPractical Wiring / Lab Work\nTesting & Troubleshooting\nIndustrial Best Practices',
      practicalRatio: '75% Practical / 25% Theory',
      fileName: '',
      fileSize: '',
      fileData: '',
    });
    setShowModal(true);
    setErrorMsg('');
  };

  const handleOpenEdit = (s: Syllabus) => {
    setEditingId(s.id);
    setForm({
      courseTitle: s.courseTitle,
      courseCode: s.courseCode,
      category: s.category,
      duration: s.duration,
      eligibility: s.eligibility,
      description: s.description,
      modulesText: s.modules.join('\n'),
      practicalRatio: s.practicalRatio,
      fileName: s.fileName || '',
      fileSize: s.fileSize || '',
      fileData: s.fileData || '',
    });
    setShowModal(true);
    setErrorMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit. Please upload a smaller PDF or document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      setForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeFormatted,
        fileData: base64,
      }));
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseTitle.trim() || !form.courseCode.trim()) {
      setErrorMsg('Please enter both course title and code.');
      return;
    }

    const modules = form.modulesText
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const now = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (editingId) {
      // Update existing
      const updated = syllabi.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            courseTitle: form.courseTitle.trim(),
            courseCode: form.courseCode.trim().toUpperCase(),
            category: form.category,
            duration: form.duration.trim(),
            eligibility: form.eligibility.trim(),
            description: form.description.trim(),
            modules: modules.length > 0 ? modules : ['Curriculum details available at institute'],
            practicalRatio: form.practicalRatio,
            fileName: form.fileName || s.fileName,
            fileSize: form.fileSize || s.fileSize,
            fileData: form.fileData || s.fileData,
            updatedAt: now,
          };
        }
        return s;
      });
      saveToStorage(updated);
      setSuccessMsg('Syllabus successfully updated!');
    } else {
      // Add new
      const newSyllabus: Syllabus = {
        id: `syl-${Date.now()}`,
        courseTitle: form.courseTitle.trim(),
        courseCode: form.courseCode.trim().toUpperCase(),
        category: form.category,
        duration: form.duration.trim(),
        eligibility: form.eligibility.trim(),
        description: form.description.trim() || `Official practical curriculum for ${form.courseTitle}`,
        modules: modules.length > 0 ? modules : ['Course Module 1: Fundamentals', 'Course Module 2: Practical Lab'],
        practicalRatio: form.practicalRatio,
        fileName: form.fileName || `${form.courseCode}_Curriculum.pdf`,
        fileSize: form.fileSize || '1.5 MB',
        fileData: form.fileData,
        updatedAt: now,
      };
      saveToStorage([newSyllabus, ...syllabi]);
      setSuccessMsg('New course syllabus uploaded & published!');
    }

    setShowModal(false);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the syllabus for "${title}"?`)) {
      const updated = syllabi.filter(s => s.id !== id);
      saveToStorage(updated);
      setSuccessMsg('Syllabus deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all course syllabi to institute factory defaults? Any custom uploaded files will be replaced.')) {
      saveToStorage(INITIAL_SYLLABUS_LIST);
      setSuccessMsg('Syllabus library reset to default curriculum.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const downloadSyllabusFile = (syllabus: Syllabus) => {
    if (syllabus.fileData) {
      if (syllabus.fileData.startsWith('http://') || syllabus.fileData.startsWith('https://')) {
        window.open(syllabus.fileData, '_blank');
        return;
      }
      const a = document.createElement('a');
      a.href = syllabus.fileData;
      a.download = syllabus.fileName || `${syllabus.courseCode}_Syllabus.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `ABHINAV TECHNICAL INSTITUTE\nSyllabus: ${syllabus.courseTitle} (${syllabus.courseCode})\nDuration: ${syllabus.duration}\nEligibility: ${syllabus.eligibility}\n\nModules:\n${syllabus.modules.map((m, i) => `${i+1}. ${m}`).join('\n')}\n\nUpdated: ${syllabus.updatedAt}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${syllabus.courseCode}_Syllabus.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Course Syllabus & Curriculum Manager
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
              {syllabi.length} Active Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload official syllabus PDFs, manage course modules, and allow prospective students to download curriculum guides.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset to institute defaults"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Upload New Syllabus
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Syllabi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {syllabi.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
                  {s.courseCode}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {s.updatedAt}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-1">
                {s.courseTitle}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {s.description}
              </p>

              <div className="space-y-1.5 py-2 border-y border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-slate-800">{s.duration}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className="font-semibold text-slate-800">{s.eligibility}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">Modules:</span>
                  <span className="font-semibold text-slate-800">{s.modules.length} Topics</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="text-slate-400">File:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]" title={s.fileName}>
                    {s.fileName || `${s.courseCode}.pdf`}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-3 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => downloadSyllabusFile(s)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                title="Test download syllabus"
              >
                <Download className="h-3.5 w-3.5" />
                Download File
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPreviewItem(s)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  title="Edit Syllabus"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.courseTitle)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingId ? 'Edit Course Syllabus' : 'Upload & Publish New Syllabus'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add curriculum topics, eligibility, duration, and optional PDF upload
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-grow">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Electrician Trade Training"
                    value={form.courseTitle}
                    onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ATI-ELEC-101"
                    value={form.courseCode}
                    onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Computer">Computer</option>
                    <option value="Vocational">Vocational</option>
                    <option value="Education">Education</option>
                    <option value="Short Term">Short Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year / 6 Months"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Eligibility
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10th Pass / ITI"
                    value={form.eligibility}
                    onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Overview & Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of course scope and industrial training..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Curriculum Modules (1 Topic per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter each module or topic on a new line..."
                  value={form.modulesText}
                  onChange={(e) => setForm({ ...form, modulesText: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono text-xs"
                />
              </div>

              {/* PDF Document Upload Area */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official PDF / Curriculum Document (Upload File or Paste Link)
                </label>

                {/* Direct Link Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    🔗 Option A: Direct PDF / Document Link (URL or Path)
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /gr/my-syllabus.pdf or Google Drive link"
                    value={form.fileData && !form.fileData.startsWith('data:') ? form.fileData : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        fileData: val,
                        fileName: val ? (prev.fileName || `${form.courseCode || 'Course'}_Curriculum.pdf`) : prev.fileName,
                        fileSize: val ? 'Web Document' : '',
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                  />
                </div>

                {/* File Upload Dropzone */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    📁 Option B: Upload PDF / Document from Device
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors text-center cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-700">
                      {form.fileName ? (
                        <span className="text-emerald-700 font-bold">Selected: {form.fileName} ({form.fileSize || 'Attached'})</span>
                      ) : (
                        'Click or drag to upload syllabus PDF (Max 5MB)'
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400">PDF, DOC, or TXT files supported</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm hover:shadow"
                >
                  {editingId ? 'Update Syllabus' : 'Save & Publish Syllabus'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {previewItem.courseCode}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">{previewItem.courseTitle}</h3>
            <p className="text-xs text-slate-600">{previewItem.description}</p>
            
            <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs text-slate-700">
              <div><strong>Duration:</strong> {previewItem.duration}</div>
              <div><strong>Eligibility:</strong> {previewItem.eligibility}</div>
              <div><strong>Practical Ratio:</strong> {previewItem.practicalRatio}</div>
              <div><strong>File:</strong> {previewItem.fileName || 'Standard Generated'}</div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase text-slate-800 mb-1.5">Modules:</h5>
              <ul className="space-y-1 text-xs text-slate-600">
                {previewItem.modules.map((m, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SyllabusAdmin;
