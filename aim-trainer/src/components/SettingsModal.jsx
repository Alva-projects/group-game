import React from 'react';
// ===== ICON IMPORTS =====
// Icons from lucide-react for UI elements
import { X, Palette, Settings } from 'lucide-react';
// Import all available themes from constants
import { THEMES } from '../utils/constants';

// ===== SETTINGS MODAL COMPONENT =====
// Modal overlay that appears when user clicks the settings button
// Allows user to change the application theme
// Displays all available theme options with preview
const SettingsModal = ({ 
    theme,              // Current theme object for styling the modal
    setShowSettings,    // Function to toggle modal visibility
    currentThemeId,     // ID of currently selected theme
    changeTheme         // Function to change to a new theme
}) => {
    
    // ===== HANDLE THEME CHANGE =====
    // Called when user clicks a theme option
    // Changes theme and closes modal for better UX
    const handleThemeChange = (id) => {
        changeTheme(id);                    // Update the selected theme
        setShowSettings(false);             // Close settings modal automatically
    };

    return (
        // ===== MODAL OVERLAY =====
        // Fixed position overlay covering entire screen
        // Clicking outside the modal (on the overlay) closes it
        // Backdrop blur provides visual focus on the modal
        <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in"
            onClick={() => setShowSettings(false)}  // Close when clicking outside modal
        >
            {/* ===== MODAL PANEL ===== */}
            {/* Inner panel that contains the settings */}
            {/* Stops click propagation to prevent closing when clicking inside */}
            <div 
                className={`w-full max-w-md ${theme.panelBg} p-6 rounded-2xl border ${theme.panelBorder} shadow-2xl transition-colors duration-500`}
                onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside
            >
                {/* ===== HEADER ===== */}
                {/* Title and close button */}
                <div className="flex justify-between items-center mb-6 border-b pb-3 border-slate-700">
                    <h2 className={`text-2xl font-bold ${theme.textMain} flex items-center gap-2`}>
                        <Settings size={24} /> Application Settings
                    </h2>
                    {/* Close Button */}
                    {/* X button in top right to close modal */}
                    <button 
                        onClick={() => setShowSettings(false)}
                        className={`${theme.textSec} hover:opacity-90 p-2 rounded-full transition-colors cursor-pointer ${theme.accentBgSubtle}`}
                        title="Close Settings"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* ===== THEME SELECTION SECTION ===== */}
                <section className="space-y-4">
                    {/* Section heading */}
                    <h3 className={`text-lg font-semibold ${theme.accentText} flex items-center gap-2`}>
                        <Palette size={18} /> Theme Selection
                    </h3>
                    
                    {/* ===== THEME BUTTONS GRID ===== */}
                    {/* Grid layout displaying all available themes (2 columns) */}
                    {/* Each theme button shows theme name and description */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Map through all themes from constants */}
                        {Object.entries(THEMES).map(([id, t]) => (
                            <button
                                key={id}
                                onClick={() => handleThemeChange(id)}  // Change theme when clicked
                                className={`
                                    p-3 rounded-lg text-left transition-all duration-300
                                    ${theme.inputBg} border cursor-pointer
                                    ${currentThemeId === id 
                                        ? `${t.accentBg}/20 ${t.accentText} border-2 ${t.accentBorder} shadow-lg`  // Styling when selected
                                        : `${theme.panelBg}/70 ${theme.textSec} ${theme.accentBgSubtle} border-slate-700`            // Styling when not selected (theme-aware subtle hover)
                                    }
                                `}
                            >
                                {/* Theme name in theme-specific accent color */}
                                <p className={`font-bold text-sm ${t.accentText}`}>{t.label}</p>
                                {/* Theme description */}
                                <p className="text-xs mt-1 text-slate-500">{`Activate the '${t.label}' theme.`}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                {/* Version information */}
                <div className={`mt-6 pt-4 border-t ${theme.panelBorder} text-right`}>
                    <p className="text-xs text-slate-500">Aim Trainer v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;