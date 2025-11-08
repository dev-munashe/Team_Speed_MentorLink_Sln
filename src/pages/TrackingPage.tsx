// src/pages/TrackingPage.tsx
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { PairStatus, Pairing } from '../types/domain';

// Simple Progress Overview
function SimpleProgress({ pairs }: { pairs: Pairing[] }) {
  const statusCounts = {
    NOT_SENT: pairs.filter(p => p.status === 'NOT_SENT').length,
    SENT: pairs.filter(p => p.status === 'SENT').length,
    BOOKED: pairs.filter(p => p.status === 'BOOKED').length,
  };

  const total = pairs.length;
  if (total === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h2>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{statusCounts.NOT_SENT}</div>
          <div className="text-xs sm:text-sm text-gray-600">Need to Send</div>
        </div>
        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{statusCounts.SENT}</div>
          <div className="text-xs sm:text-sm text-gray-600">Waiting</div>
        </div>
        <div className="text-center p-2">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{statusCounts.BOOKED}</div>
          <div className="text-xs sm:text-sm text-gray-600">Connected</div>
        </div>
      </div>

      {/* Simple Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((statusCounts.BOOKED / total) * 100)}% Connected</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${(statusCounts.BOOKED / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      {statusCounts.NOT_SENT > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-medium text-orange-900">
                {statusCounts.NOT_SENT} pairs need introduction messages
              </div>
              <div className="text-sm text-orange-700">Ready to send to mentors and mentees</div>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
              Send All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Pair List
function SimplePairList({ 
  pairs, 
  mentors, 
  mentees, 
  onStatusChange 
}: { 
  pairs: Pairing[],
  mentors: any[],
  mentees: any[],
  onStatusChange: (pairId: string, status: PairStatus) => void
}) {
  const [filter, setFilter] = useState<PairStatus | 'ALL'>('ALL');
  
  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  const filteredPairs = filter === 'ALL' ? pairs : pairs.filter(p => p.status === filter);

  const getStatusInfo = (status: PairStatus) => {
    switch (status) {
      case 'NOT_SENT':
        return { label: 'Not Sent', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' };
      case 'SENT':
        return { label: 'Sent', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' };
      case 'BOOKED':
        return { label: 'Connected', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">All Pairs ({pairs.length})</h2>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'NOT_SENT', 'SENT', 'BOOKED'].map((status) => {
              const isActive = filter === status;
              const count = status === 'ALL' ? pairs.length : pairs.filter(p => p.status === status).length;
              
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status as PairStatus | 'ALL')}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {status === 'ALL' ? 'All' : 
                   status === 'NOT_SENT' ? 'Need to Send' :
                   status === 'SENT' ? 'Waiting' : 'Connected'} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredPairs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === 'ALL' ? 'No pairs created yet' : 'No pairs in this status'}
          </div>
        ) : (
          filteredPairs.map((pair) => {
            const mentor = getMentor(pair.mentorId);
            const mentee = getMentee(pair.menteeId);
            const statusInfo = getStatusInfo(pair.status);

            if (!mentor || !mentee) return null;

            return (
              <div key={pair.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Mobile/tablet layout - vertical stack */}
                    <div className="lg:hidden space-y-4">
                      {/* Mentor */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Mentor</div>
                        <div className="font-medium text-gray-900 truncate">{mentor.name}</div>
                        <div className="text-sm text-gray-600 truncate">{mentor.email}</div>
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          Skills: {mentor.skills?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="text-center text-gray-400 text-xl">↓</div>
                      
                      {/* Mentee */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Mentee</div>
                        <div className="font-medium text-gray-900 truncate">{mentee.name}</div>
                        <div className="text-sm text-gray-600 truncate">{mentee.email}</div>
                        <div className="text-xs text-green-600 mt-1 truncate">
                          Wants: {mentee.preferred_skills?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - horizontal */}
                    <div className="hidden lg:flex items-center space-x-4">
                      {/* Mentor */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{mentor.name}</div>
                        <div className="text-sm text-gray-600 truncate">{mentor.email}</div>
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          Skills: {mentor.skills?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="text-gray-400 text-xl px-4 shrink-0">→</div>
                      
                      {/* Mentee */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{mentee.name}</div>
                        <div className="text-sm text-gray-600 truncate">{mentee.email}</div>
                        <div className="text-xs text-green-600 mt-1 truncate">
                          Wants: {mentee.preferred_skills?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Score */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Match Score:</span> 
                        <span className={`ml-1 font-semibold ${
                          pair.score >= 80 ? 'text-green-600' : 
                          pair.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {pair.score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:ml-6">
                    {/* Status */}
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    {/* Quick Actions */}
                    <select
                      value={pair.status}
                      onChange={(e) => onStatusChange(pair.id, e.target.value as PairStatus)}
                      className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                    >
                      <option value="NOT_SENT">Not Sent</option>
                      <option value="SENT">Sent</option>
                      <option value="BOOKED">Connected</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function TrackingPage() {
  const { pairs, mentors, mentees, updatePairStatus } = useAppStore();

  const handleStatusChange = (pairId: string, status: PairStatus) => {
    updatePairStatus(pairId, status);
  };

  if (pairs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Pair Tracking</h1>
          <p className="text-gray-600 text-sm sm:text-base px-4 mb-8 max-w-2xl mx-auto">
            Track the progress of mentor-mentee pairs from introduction to first meeting.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">🤝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pairs to Track Yet</h3>
          <p className="text-gray-600 mb-6">
            Create mentor-mentee matches first, then return here to track their progress.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <strong>Available data:</strong> {mentors.length} mentors, {mentees.length} mentees
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pair Tracking</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Monitor and manage mentor-mentee introductions
        </p>
      </div>

      {/* Simple Progress Overview */}
      <SimpleProgress pairs={pairs} />

      {/* Simple Pair List */}
      <SimplePairList
        pairs={pairs}
        mentors={mentors}
        mentees={mentees}
        onStatusChange={handleStatusChange}
      />

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-3 text-sm">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center mr-2 font-bold shrink-0">1</div>
              <span className="font-medium text-blue-900">Not Sent</span>
            </div>
            <p className="text-blue-800 text-xs">Introductions ready to be sent to mentor and mentee</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center mr-2 font-bold shrink-0">2</div>
              <span className="font-medium text-blue-900">Sent</span>
            </div>
            <p className="text-blue-800 text-xs">Waiting for mentor and mentee to connect</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center mr-2 font-bold shrink-0">3</div>
              <span className="font-medium text-blue-900">Connected</span>
            </div>
            <p className="text-blue-800 text-xs">First meeting scheduled - success!</p>
          </div>
        </div>
      </div>
    </div>
  );
}