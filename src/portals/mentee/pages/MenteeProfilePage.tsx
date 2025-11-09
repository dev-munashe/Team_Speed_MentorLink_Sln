// src/portals/mentee/pages/MenteeProfilePage.tsx
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { User, Mail, Calendar, MapPin, Star, Edit, Save, X, CheckCircle } from 'lucide-react';

export function MenteeProfilePage() {
  const { user } = useAuth();
  const { mentees } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Find the mentee data or use compelling mock data
  let menteeProfile = mentees.find(m => m.email === user?.email);
  
  if (!menteeProfile) {
    menteeProfile = {
      id: 'mock-mentee-1',
      name: 'Alex Johnson',
      email: user?.email || 'mentee@mentorlink.com',
      phone: '+1 (555) 987-6543',
      program_track: 'Computer Science - Senior Year',
      goals: ['Land software engineering internship', 'Master system design', 'Build portfolio projects'],
      interests: ['Full-Stack Development', 'Machine Learning', 'Startup Culture'],
      preferred_skills: ['React', 'Python', 'System Design', 'Data Structures'],
      availability_slots: ['Mon 19:00-21:00', 'Wed 18:00-20:00', 'Fri 17:00-19:00'],
      location: 'Austin, TX'
    } as any;
  }

  // Form state for editing
  const [formData, setFormData] = useState({
    name: menteeProfile?.name || '',
    phone: menteeProfile?.phone || '',
    program_track: menteeProfile?.program_track || '',
    location: menteeProfile?.location || '',
    goals: menteeProfile?.goals?.join(', ') || '',
    interests: menteeProfile?.interests?.join(', ') || '',
    preferred_skills: menteeProfile?.preferred_skills?.join(', ') || ''
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle save changes
  const handleSave = () => {
    console.log('Saving mentee profile changes:', formData);
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Handle cancel editing
  const handleCancel = () => {
    setFormData({
      name: menteeProfile?.name || '',
      phone: menteeProfile?.phone || '',
      program_track: menteeProfile?.program_track || '',
      location: menteeProfile?.location || '',
      goals: menteeProfile?.goals?.join(', ') || '',
      interests: menteeProfile?.interests?.join(', ') || '',
      preferred_skills: menteeProfile?.preferred_skills?.join(', ') || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-700">Manage your mentee profile and learning goals</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEditing ? <X size={16} /> : <Edit size={16} />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
        
        {/* Success notification */}
        {showSaveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Profile updated successfully!</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{menteeProfile?.email || 'No email'}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.location || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Track</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.program_track}
                    onChange={(e) => handleInputChange('program_track', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.program_track || 'Not specified'}</p>
                )}
              </div>
            </div>

            {(menteeProfile as any)?.gpa && (
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                  <p className="text-gray-900">{(menteeProfile as any).gpa}/4.0</p>
                </div>
              </div>
            )}

            {(menteeProfile as any)?.graduation_year && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                  <p className="text-gray-900">{(menteeProfile as any).graduation_year}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Career Goals</label>
          {isEditing ? (
            <textarea
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              placeholder="Enter your career goals separated by commas"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {menteeProfile?.goals?.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {goal}
                </span>
              )) || <span className="text-gray-500">No goals specified</span>}
            </div>
          )}
        </div>

        {/* Interests */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
          {isEditing ? (
            <textarea
              value={formData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
              placeholder="Enter your interests separated by commas"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {menteeProfile?.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {interest}
                </span>
              )) || <span className="text-gray-500">No interests specified</span>}
            </div>
          )}
        </div>

        {/* Skills to Learn */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Skills I Want to Learn</label>
          {isEditing ? (
            <textarea
              value={formData.preferred_skills}
              onChange={(e) => handleInputChange('preferred_skills', e.target.value)}
              placeholder="Enter skills you want to learn separated by commas"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {menteeProfile?.preferred_skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              )) || <span className="text-gray-500">No skills specified</span>}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Available Times</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {menteeProfile?.availability_slots?.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">{slot}</span>
              </div>
            )) || <span className="text-gray-500">No availability specified</span>}
          </div>
        </div>
      </div>
    </div>
  );
}