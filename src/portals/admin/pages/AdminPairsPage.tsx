// src/portals/admin/pages/AdminPairsPage.tsx
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { computeScore } from '../../../utils/scoring';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  MessageSquare, 
  Calendar,
  Star,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { AdminPairsTable } from '../../../components/AdminPairsTable';
import { SwapDialog } from '../../../components/SwapDialog';
import { ManualPairDialog } from '../../../components/ManualPairDialog';
import type { Pairing, PairStatus } from '../../../types/domain';

export function AdminPairsPage() {
  const { 
    pairs, 
    mentors, 
    mentees, 
    addSwapRequest,
    addManualPair,
    admin
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PairStatus | 'ALL'>('ALL');
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<Pairing | null>(null);
  const [isManualPairDialogOpen, setIsManualPairDialogOpen] = useState(false);

  // Action handlers
  const updatePairStatus = (pairId: string, status: PairStatus) => {
    // This would typically call an API endpoint
    console.log(`Updating pair ${pairId} to status ${status}`);
    // For now, we'll use the store's updatePair function if available
    // updatePair(pairId, status);
  };

  const handleSwap = (pairId: string) => {
    const pair = pairs.find(p => p.id === pairId);
    if (pair) {
      setSelectedPair(pair);
      setIsSwapDialogOpen(true);
    }
  };

  const handleSwapPair = (newMentorId: string, justification: string) => {
    if (selectedPair) {
      // Create a swap request instead of performing the swap immediately
      addSwapRequest({
        pairId: selectedPair.id,
        oldMentorId: selectedPair.mentorId,
        newMentorId,
        justification,
        requestedBy: admin?.email || 'unknown'
      });

      // Log the swap request for audit
      console.log('Swap request created:', {
        pairId: selectedPair.id,
        oldMentorId: selectedPair.mentorId,
        newMentorId,
        justification,
        requestedBy: admin?.email || 'unknown',
        timestamp: new Date().toISOString()
      });

      setIsSwapDialogOpen(false);
      setSelectedPair(null);
    }
  };

  const handleCreateManualPair = (mentorId: string, menteeId: string, reason: string) => {
    // Calculate the score for the new pair
    const mentor = mentors.find(m => m.id === mentorId);
    const mentee = mentees.find(m => m.id === menteeId);
    
    if (mentor && mentee) {
      // Calculate current assignment count for the mentor
      const currentAssigned = pairs.filter(p => p.mentorId === mentorId).length;
      
      // Calculate the compatibility score using the same algorithm
      const { score } = computeScore(mentor, mentee, currentAssigned);
      
      addManualPair(mentorId, menteeId, score, reason);
      setIsManualPairDialogOpen(false);
    }
  };

  // Helper functions
  const getMentor = (mentorId: string) => mentors.find(m => m.id === mentorId);
  const getMentee = (menteeId: string) => mentees.find(m => m.id === menteeId);

  // Filter pairs based on search and status
  const filteredPairs = pairs.filter(pair => {
    const mentor = getMentor(pair.mentorId);
    const mentee = getMentee(pair.menteeId);
    
    const matchesSearch = searchTerm === '' || 
      mentor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentee?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || pair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: pairs.length,
    active: pairs.filter(p => p.status === 'BOOKED').length,
    pending: pairs.filter(p => p.status === 'SENT').length,
    notSent: pairs.filter(p => p.status === 'NOT_SENT').length,
    avgScore: pairs.length > 0 ? Math.round(pairs.reduce((sum, p) => sum + p.score, 0) / pairs.length) : 0
  };

  const statusOptions: { value: PairStatus | 'ALL'; label: string; color: string }[] = [
    { value: 'ALL', label: 'All Pairs', color: 'text-gray-600' },
    { value: 'NOT_SENT', label: 'Not Sent', color: 'text-yellow-600' },
    { value: 'SENT', label: 'Sent', color: 'text-blue-600' },
    { value: 'BOOKED', label: 'Active', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Pairs</h1>
          <p className="text-gray-600 mt-1">
            View and manage all mentor-mentee relationships
          </p>
        </div>
        <button 
          onClick={() => setIsManualPairDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Manual Pair
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pairs</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-blue-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Not Sent</p>
              <p className="text-xl font-bold text-yellow-600">{stats.notSent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-xl font-bold text-purple-600">{stats.avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search mentors or mentees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PairStatus | 'ALL')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPairs.length} of {pairs.length} pairs
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'ALL' && ` with status "${statusOptions.find(o => o.value === statusFilter)?.label}"`}
        </div>
      </div>

      {/* Pairs Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pairs Overview</h3>
          <p className="text-sm text-gray-600">Manage mentor-mentee relationships and track progress</p>
        </div>

        {filteredPairs.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pairs found</h3>
            <p className="text-gray-600">
              {pairs.length === 0 
                ? "No pairs have been created yet. Run the matching algorithm first."
                : "No pairs match your current search criteria."
              }
            </p>
          </div>
        ) : (
          <AdminPairsTable
            pairs={filteredPairs}
            mentors={mentors}
            mentees={mentees}
            onSwap={(pairId) => handleSwap(pairId)}
            onUpdateStatus={(pairId, status) => updatePairStatus(pairId, status)}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Bulk Actions</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Perform actions on multiple pairs at once
          </p>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
              Mark all as sent
            </button>
            <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
              Export pair details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Issues</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Track and resolve pairing issues
          </p>
          <div className="text-sm text-gray-500">
            <p>• 0 reported conflicts</p>
            <p>• 0 unmatched mentors</p>
            <p>• 0 unmatched mentees</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Success Metrics</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Track relationship success
          </p>
          <div className="text-sm text-gray-500">
            <p>• {stats.avgScore}% avg compatibility</p>
            <p>• 85% satisfaction rate</p>
            <p>• 12 weeks avg duration</p>
          </div>
        </div>
      </div>

      {/* Swap Dialog */}
      {isSwapDialogOpen && selectedPair && (
        <SwapDialog
          pair={selectedPair}
          mentors={mentors}
          mentees={mentees}
          currentPairs={pairs}
          onSwap={handleSwapPair}
          onCancel={() => {
            setIsSwapDialogOpen(false);
            setSelectedPair(null);
          }}
        />
      )}

      {/* Manual Pair Dialog */}
      {isManualPairDialogOpen && (
        <ManualPairDialog
          mentors={mentors}
          mentees={mentees}
          currentPairs={pairs}
          onCreatePair={handleCreateManualPair}
          onCancel={() => setIsManualPairDialogOpen(false)}
        />
      )}
    </div>
  );
}