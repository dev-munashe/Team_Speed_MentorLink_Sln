// src/pages/MessagesPage.tsx
import { useAppStore } from '../store/useAppStore';
import { MessagePreview } from '../components/MessagePreview';

export function MessagesPage() {
  const {
    pairs,
    mentors,
    mentees,
    scores,
    template,
    programName,
    admin,
    setTemplate,
    setProgramName,
    setAdmin,
    updatePairStatus
  } = useAppStore();

  const handleMarkAsSent = (pairId: string) => {
    updatePairStatus(pairId, 'SENT');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Message Generation</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base px-4">
          Customize templates and generate introduction messages
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
        {/* Template and Settings */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Message Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Tech Mentorship Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={admin.name}
                  onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={admin.email}
                  onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Phone (optional)
                </label>
                <input
                  type="tel"
                  value={admin.phone || ''}
                  onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Template
                </label>
                <textarea
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs sm:text-sm"
                  placeholder="Use variables like {{mentor_name}}, {{mentee_name}}, etc."
                />
              </div>

              <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Available variables:</p>
                <div className="space-y-1 font-mono text-xs">
                  <p>{'{{mentor_name}}, {{mentor_email}}'}</p>
                  <p>{'{{mentee_name}}, {{mentee_email}}'}</p>
                  <p>{'{{program_name}}, {{one_line_reason}}'}</p>
                  <p>{'{{admin_name}}, {{admin_email}}, {{admin_phone}}'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Previews */}
        <div className="xl:col-span-2">
          <MessagePreview
            pairs={pairs}
            mentors={mentors}
            mentees={mentees}
            scores={scores}
            template={template}
            programName={programName}
            admin={admin}
            onMarkAsSent={handleMarkAsSent}
          />
        </div>
      </div>

      {pairs.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-yellow-800">
            <strong>No pairs found.</strong> Create matches first in the Matching tab to generate messages.
          </div>
        </div>
      )}
    </div>
  );
}