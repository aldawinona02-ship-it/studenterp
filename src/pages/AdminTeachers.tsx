import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Search, Filter, Star, Plus, Edit2, Mail, Phone, Hash } from 'lucide-react';

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    teacher_id: '',
    department: 'Computer Science',
    email: '',
    phone: ''
  });

  const fetchTeachers = () => {
    fetch('/api/admin/teachers')
      .then(res => res.json())
      .then(data => {
        setTeachers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `/api/admin/teachers/${formData.id}` : '/api/admin/teachers';
    const method = isEditing ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    fetchTeachers();
    setIsModalOpen(false);
  };

  const handleEdit = (teacher: any) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      teacher_id: teacher.teacher_id || '',
      department: teacher.department,
      email: teacher.email || '',
      phone: teacher.phone || ''
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      id: 0,
      name: '',
      teacher_id: '',
      department: 'Computer Science',
      email: '',
      phone: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const filteredTeachers = teachers.filter(t => {
    if (departmentFilter !== 'All' && t.department !== departmentFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="p-8 text-slate-400">Loading teachers...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Management</h1>
        <p className="text-slate-400">Manage teaching staff, view performance ratings, and assign subjects.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Teachers</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#0b1220] border border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
            <button 
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Teacher Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Performance</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-slate-800 hover:bg-slate-800/50 hover:shadow-[inset_4px_0_0_0_rgba(99,102,241,1)] transition-all duration-200">
                    <td className="px-4 py-3 font-medium text-slate-200">{teacher.name}</td>
                    <td className="px-4 py-3 text-slate-400">{teacher.teacher_id || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-400">{teacher.department}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {teacher.email && (
                          <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {teacher.email}
                          </div>
                        )}
                        {teacher.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {teacher.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Star className="w-4 h-4 fill-emerald-400" />
                        {teacher.rating || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleEdit(teacher)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                        title="Edit Teacher"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTeachers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No teachers found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teacher Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teacher ID</label>
                <input type="text" required value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                <select required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">{isEditing ? 'Save Changes' : 'Add Teacher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
