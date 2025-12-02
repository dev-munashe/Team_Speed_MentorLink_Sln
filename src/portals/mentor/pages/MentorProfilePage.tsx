// src/portals/mentor/pages/MentorProfilePage.tsx
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { User, Mail, Briefcase, MapPin, Calendar, Edit, Save, X, CheckCircle } from 'lucide-react';

export function MentorProfilePage() {
  const { user } = useAuth();
  const { mentors } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Find the mentor data based on logged in user, or use compelling mock data
  let mentorProfile = mentors.find(m => m.email === user?.email);
  
  // If no real data found, use rich mock data for demonstration
  if (!mentorProfile) {
    mentorProfile = {
      id: 'mock-mentor-1',
      name: 'Sarah Chen',
      email: user?.email || 'mentor@mentorlink.com',
      phone: '+1 (555) 123-4567',
      role: 'Senior Software Engineer',
      org: 'TechCorp Innovation Labs',
      skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Team Leadership', 'Product Strategy'],
      interests: ['AI/ML', 'Startup Mentoring', 'Diversity in Tech', 'Career Development'],
      capacity: 3,
      availability_slots: ['Mon 18:00-20:00', 'Wed 17:00-19:00', 'Sat 10:00-12:00'],
      location: 'San Francisco, CA',
      assignedCount: 2
    };
  }

  // Form state for editing
  const [formData, setFormData] = useState({
    name: mentorProfile.name,
    phone: mentorProfile.phone || '',
    role: mentorProfile.role || '',
    org: mentorProfile.org || '',
    location: mentorProfile.location || '',
    skills: mentorProfile.skills.join(', '),
    capacity: mentorProfile.capacity.toString()
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle save changes
  const handleSave = () => {
    // In a real app, this would update the backend/store
    console.log('Saving profile changes:', formData);
    
    // Update the local profile object for demonstration
    Object.assign(mentorProfile, {
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      org: formData.org,
      location: formData.location,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      capacity: parseInt(formData.capacity)
    });

    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Handle cancel editing
  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: mentorProfile.name,
      phone: mentorProfile.phone || '',
      role: mentorProfile.role || '',
      org: mentorProfile.org || '',
      location: mentorProfile.location || '',
      skills: mentorProfile.skills.join(', '),
      capacity: mentorProfile.capacity.toString()
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-700">Manage your mentor profile and availability</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <p className="text-gray-900">{mentorProfile.email}</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.location || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.role || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.org}
                    onChange={(e) => handleInputChange('org', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.org || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentee Capacity</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{formData.capacity} mentees max</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Skills & Expertise</label>
          {isEditing ? (
            <textarea
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="Enter skills separated by commas"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {mentorProfile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability & Schedule</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Current Availability</h3>
            <div className="space-y-2">
              {mentorProfile.availability_slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{slot}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Mentoring Capacity</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-800 font-medium">Current Load</span>
                <span className="text-green-600">{mentorProfile.assignedCount || 0}/{mentorProfile.capacity}</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${((mentorProfile.assignedCount || 0) / mentorProfile.capacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-green-700 text-sm mt-2">
                {mentorProfile.capacity - (mentorProfile.assignedCount || 0)} spots available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mentoring Experience */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentoring Experience</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-blue-800">Mentees Guided</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">4.9</div>
            <div className="text-sm text-green-800">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">2 yrs</div>
            <div className="text-sm text-purple-800">Mentoring Since</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Areas of Expertise</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technical Skills</h4>
              <ul className="space-y-1">
                <li>• Full-stack web development</li>
                <li>• System architecture & design</li>
                <li>• Code review & best practices</li>
                <li>• Technical interview preparation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Career Development</h4>
              <ul className="space-y-1">
                <li>• Leadership transition guidance</li>
                <li>• Goal setting & planning</li>
                <li>• Industry networking</li>
                <li>• Work-life balance strategies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Recent Testimonial</h3>
          <blockquote className="italic text-gray-700">
            "Tendai's guidance was instrumental in my career transition. Her technical expertise and empathetic approach helped me land my dream job at a top tech company. Highly recommend!"
          </blockquote>
          <cite className="text-sm text-gray-600 mt-2 block">- Kudzai Chigwedere, Software Engineer</cite>
        </div>
      </div>
    </div>
  );
}