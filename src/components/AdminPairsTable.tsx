// src/components/AdminPairsTable.tsx
import { 
  MessageSquare, 
  UserCheck, 
  RefreshCw, 
  Mail
} from 'lucide-react';
import type { Mentor, Mentee, Pairing, PairStatus } from '../types/domain';

interface AdminPairsTableProps {
  pairs: Pairing[];
  mentors: Mentor[];
  mentees: Mentee[];
  onSwap: (pairId: string) => void;
  onUpdateStatus: (pairId: string, status: PairStatus) => void;
}

export function AdminPairsTable({ pairs, mentors, mentees, onSwap, onUpdateStatus }: AdminPairsTableProps) {
  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  const getStatusBadge = (status: PairStatus) => {
    switch (status) {
      case 'NOT_SENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'BOOKED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: PairStatus) => {
    switch (status) {
      case 'NOT_SENT':
        return 'Not Sent';
      case 'SENT':
        return 'Pending';
      case 'BOOKED':
        return 'Active';
      default:
        return status;
    }
  };

  if (pairs.length === 0) {
    return (
      <div className="p-12 text-center">
        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No pairs found</h3>
        <p className="text-gray-600">No mentor-mentee pairs match your current criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {pairs.map((pair) => {
          const mentor = getMentor(pair.mentorId);
          const mentee = getMentee(pair.menteeId);
          
          return (
            <div key={pair.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(pair.status)}`}>
                  {getStatusLabel(pair.status)}
                </span>
                <span className="text-sm font-medium text-purple-600">{pair.score}% match</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mentor?.name || 'Unknown Mentor'}</p>
                    <p className="text-xs text-gray-500">{mentor?.skills?.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mentee?.name || 'Unknown Mentee'}</p>
                    <p className="text-xs text-gray-500">{mentee?.interests?.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onSwap(pair.id)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Swap
                </button>
                <select
                  value={pair.status}
                  onChange={(e) => onUpdateStatus(pair.id, e.target.value as PairStatus)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NOT_SENT">Not Sent</option>
                  <option value="SENT">Pending</option>
                  <option value="BOOKED">Active</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compatibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pairs.map((pair) => {
              const mentor = getMentor(pair.mentorId);
              const mentee = getMentee(pair.menteeId);
              
              return (
                <tr key={pair.id} className="hover:bg-gray-50">
                  {/* Mentor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{mentor?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{mentor?.org || mentor?.role}</div>
                        <div className="text-xs text-gray-400">
                          {mentor?.skills?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mentee */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{mentee?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{mentee?.program_track || 'Student'}</div>
                        <div className="text-xs text-gray-400">
                          {mentee?.interests?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Compatibility */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${
                            pair.score >= 70 ? 'bg-green-500' :
                            pair.score >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${pair.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{pair.score}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={pair.status}
                      onChange={(e) => onUpdateStatus(pair.id, e.target.value as PairStatus)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-none focus:ring-2 focus:ring-blue-500 ${getStatusBadge(pair.status)}`}
                    >
                      <option value="NOT_SENT">Not Sent</option>
                      <option value="SENT">Pending</option>
                      <option value="BOOKED">Active</option>
                    </select>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{mentor?.email?.substring(0, 20)}...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{mentee?.email?.substring(0, 20)}...</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSwap(pair.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Swap mentor"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Send message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}