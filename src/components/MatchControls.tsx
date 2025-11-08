// src/components/MatchControls.tsx

interface MatchControlsProps {
  onRunMatching: (threshold: number) => void;
  onReset: () => void;
  isLoading?: boolean;
  threshold: number;
  onThresholdChange: (threshold: number) => void;
}

export function MatchControls({ 
  onRunMatching, 
  onReset, 
  isLoading = false, 
  threshold, 
  onThresholdChange 
}: MatchControlsProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Matching Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Match Threshold: {threshold}%
          </label>

          {/* Scrollable slider container with subtle contrast to stand out from white page */}
          <div className="overflow-x-auto rounded-md bg-gray-300 p-3 border border-gray-200">
            {/* Inner wrapper wider than the container to encourage horizontal scrolling */}
            <div style={{ minWidth: 640 }} className="flex flex-col gap-2">
              <input
                type="range"
                min="40"
                max="80"
                value={threshold}
                onChange={(e) => onThresholdChange(parseInt(e.target.value))}
                aria-label="Minimum match threshold"
                title="Drag the thumb or scroll horizontally to change the threshold"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{ WebkitAppearance: 'none' }}
              />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            Lower threshold = more matches, higher threshold = better quality matches. Scroll the control area if the slider is not fully visible.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onRunMatching(threshold)}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Running...' : 'Run Matching'}
          </button>
          
          <button
            onClick={onReset}
            disabled={isLoading}
            className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}