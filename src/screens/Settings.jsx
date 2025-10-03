import { useState, useEffect } from 'react';
import { Bell, Download, Upload, Trash2, Info, RefreshCw, Clock, Palette, Globe, Database, AlertTriangle } from 'lucide-react';
import { DefaultLayout } from '../components/layouts';
import { PageHeader } from '../components/headers';
import { Text } from '../components/design-system/Typography';
import { ContentBody } from '../components/design-system';
import { Switch } from '../components/ui/switch';
import SettingsSection from '../components/SettingsSection';
import { ConfirmDialog } from '../components/dialogs';
import { ThemeToggleWithLabel } from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import usePreferencesStore from '../stores/preferences';
import useProgressStore from '../stores/progress';
import useCollapsibleSections from '../hooks/useCollapsibleSections';
import useTranslation from '../hooks/useTranslation';
import { exportData, importData, getDataSize, getStorageQuota, getBackupInfo } from '../utils/dataExport';
import { dismissBackupReminder } from '../utils/dataExport';

/**
 * Settings Screen
 * Comprehensive settings for voice coaching, notifications, data management, and about info
 */
function Settings() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCustomRest, setShowCustomRest] = useState(false);
  const [importing, setImporting] = useState(false);
  const [storageQuota, setStorageQuota] = useState(null);
  const [backupInfo, setBackupInfo] = useState(null);

  // Translation hook
  const { t } = useTranslation();

  // Collapsible sections state - all closed by default
  const { openSections, toggleSection } = useCollapsibleSections({
    language: false,
    appearance: false,
    practice: false,
    popups: false,
    notifications: false,
    data: false,
    about: false
  });

  // Preferences store
  const {
    restDuration,
    practiceReminders,
    streakAlerts,
    reminderTime,
    yoga,
    breathing,
    setRestDuration,
    setPracticeReminders,
    setStreakAlerts,
    setReminderTime,
    toggleYogaMoodCheck,
    toggleBreathingMoodCheck,
    resetOnboarding,
  } = usePreferencesStore();

  // Progress store
  const { resetProgress } = useProgressStore();

  // Load storage info on mount
  useEffect(() => {
    const loadStorageInfo = async () => {
      const quota = await getStorageQuota();
      setStorageQuota(quota);

      const backup = getBackupInfo();
      setBackupInfo(backup);
    };

    loadStorageInfo();
  }, []);

  const handleExportData = () => {
    exportData();
    // Reload backup info
    const backup = getBackupInfo();
    setBackupInfo(backup);
    dismissBackupReminder();
  };

  const handleImportClick = () => {
    setShowImportDialog(true);
  };

  const handleImportConfirm = async (file) => {
    if (!file) return;

    setImporting(true);
    try {
      await importData(file);
      setShowImportDialog(false);
      // Reload page to reflect imported data
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = () => {
    resetProgress();
    setShowClearDialog(false);
    // Optionally show a success message
  };

  const handleFeedback = () => {
    window.location.href = 'mailto:feedback@yoga-app.example.com?subject=Yoga App Feedback';
  };

  const handleResetTutorial = () => {
    resetOnboarding();
    // Reload the page to ensure Onboarding component re-renders with new state
    window.location.href = '/';
  };

  return (
    <DefaultLayout
      header={<PageHeader title="Settings" showBack={false} />}
    >
      <ContentBody size="lg" spacing="md">
        {/* Language Section */}
        <SettingsSection
          id="language"
          title={t('screens.settings.language')}
          subtitle={t('screens.settings.languageSubtitle')}
          icon={Globe}
          iconBgColor="bg-muted"
          isOpen={openSections.language}
          onToggle={() => toggleSection('language')}
        >
          <LanguageSelector />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          id="appearance"
          title={t('screens.settings.appearance')}
          subtitle={t('screens.settings.appearanceSubtitle')}
          icon={Palette}
          iconBgColor="bg-muted"
          isOpen={openSections.appearance}
          onToggle={() => toggleSection('appearance')}
        >
          <div className="py-2">
            <ThemeToggleWithLabel />
          </div>
        </SettingsSection>

        {/* Practice Settings Section */}
        <SettingsSection
          id="practice"
          title="Practice Settings"
          subtitle="Customize your practice experience"
          icon={Clock}
          iconBgColor="bg-muted"
          isOpen={openSections.practice}
          onToggle={() => toggleSection('practice')}
        >
          {/* Rest Duration Setting */}
          <div className="py-2">
            <div className="mb-3">
              <Text className="text-foreground font-medium">Rest Time Between Poses</Text>
              <Text variant="caption" className="text-muted-foreground">Time to transition between poses</Text>
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { value: 0, label: 'None' },
                { value: 5, label: '5s' },
                { value: 10, label: '10s' },
                { value: 15, label: '15s' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setRestDuration(option.value);
                    setShowCustomRest(false);
                  }}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    restDuration === option.value && !showCustomRest
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-muted text-muted-foreground hover:bg-muted hover:scale-105'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom button */}
            <button
              onClick={() => setShowCustomRest(!showCustomRest)}
              className={`w-full py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                showCustomRest
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted'
              }`}
            >
              Custom
            </button>

            {/* Custom Rest Duration Input - shown when Custom is selected */}
            {showCustomRest && (
              <div className="mt-3 p-3 bg-muted rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-300">
                <Text className="text-foreground font-medium mb-2 text-sm">Enter Custom Duration</Text>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={restDuration}
                    onChange={(e) => setRestDuration(e.target.value)}
                    placeholder="Enter seconds..."
                    className="w-24 px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <Text variant="caption" className="text-muted-foreground">seconds (0-60)</Text>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-3 p-3 bg-muted rounded-lg border border-border">
              <Text variant="caption" className="text-muted-foreground">
                {restDuration === 0 && !showCustomRest && 'Poses will transition immediately without rest periods.'}
                {restDuration === 5 && !showCustomRest && 'Short rest periods - great for faster-paced practices.'}
                {restDuration === 10 && !showCustomRest && 'Medium rest periods - balanced for most practices.'}
                {restDuration === 15 && !showCustomRest && 'Longer rest periods - perfect for gentle, restorative sessions.'}
                {showCustomRest && `Custom rest period of ${restDuration} seconds between poses.`}
              </Text>
            </div>
          </div>
        </SettingsSection>

        {/* Popup Preferences Section */}
        <SettingsSection
          id="popups"
          title="Popup Preferences"
          subtitle="Mood tracking and prompts"
          icon={Info}
          iconBgColor="bg-muted"
          isOpen={openSections.popups}
          onToggle={() => toggleSection('popups')}
        >
          {/* Yoga Mood Tracking Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-foreground font-medium">Yoga Mood Tracking</Text>
              <Text variant="caption" className="text-muted-foreground">Show mood check before/after yoga practice</Text>
            </div>
            <Switch
              checked={yoga.showMoodCheck}
              onCheckedChange={toggleYogaMoodCheck}
            />
          </div>

          <div className="border-t border-border" />

          {/* Breathing Mood Tracking Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-foreground font-medium">Breathing Mood Tracking</Text>
              <Text variant="caption" className="text-muted-foreground">Show mood check before/after breathing exercises</Text>
            </div>
            <Switch
              checked={breathing.showMoodCheck}
              onCheckedChange={toggleBreathingMoodCheck}
            />
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          id="notifications"
          title="Notifications"
          subtitle="Reminders and alerts"
          icon={Bell}
          iconBgColor="bg-gold-100 text-accent"
          isOpen={openSections.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <div className="text-sm text-accent bg-gold-50 p-3 rounded-lg border border-gold-200">
            Note: Notifications are coming in a future update. These settings will be saved for when they are available.
          </div>

          {/* Practice Reminders */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-foreground font-medium">Practice Reminders</Text>
              <Text variant="caption" className="text-muted-foreground">Daily reminder to practice</Text>
            </div>
            <Switch
              checked={practiceReminders}
              onCheckedChange={setPracticeReminders}
            />
          </div>

          {/* Reminder Time */}
          {practiceReminders && (
            <div className="py-2">
              <Text className="text-foreground font-medium mb-2">Reminder Time</Text>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          )}

          <div className="border-t border-border" />

          {/* Streak Alerts */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="text-foreground font-medium">Streak Alerts</Text>
              <Text variant="caption" className="text-muted-foreground">Get notified about your streak</Text>
            </div>
            <Switch
              checked={streakAlerts}
              onCheckedChange={setStreakAlerts}
            />
          </div>
        </SettingsSection>

        {/* Data & Privacy Section */}
        <SettingsSection
          id="data"
          title="Data & Privacy"
          subtitle="Manage your practice data"
          icon={Info}
          iconBgColor="bg-muted"
          isOpen={openSections.data}
          onToggle={() => toggleSection('data')}
        >
          {/* Storage Quota Info */}
          {storageQuota && (
            <div className="mb-3 p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <Text className="text-foreground font-medium">Storage Used</Text>
              </div>
              <div className="text-2xl font-bold mb-1 text-foreground">
                {storageQuota.usage} MB
              </div>
              <Text variant="caption" className="text-muted-foreground mb-2">
                of {storageQuota.quota} MB ({storageQuota.percent}%)
              </Text>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    parseFloat(storageQuota.percent) > 80
                      ? 'bg-state-error'
                      : parseFloat(storageQuota.percent) > 60
                      ? 'bg-amber-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${storageQuota.percent}%` }}
                />
              </div>
              {parseFloat(storageQuota.percent) > 80 && (
                <div className="mt-2 flex items-start gap-2 text-state-error">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <Text variant="caption" className="text-state-error">
                    Storage is running low. Export your data to create a backup.
                  </Text>
                </div>
              )}
            </div>
          )}

          {/* Backup Info */}
          {backupInfo && (
            <div className="mb-3 p-3 bg-muted rounded-lg border border-border">
              <Text className="text-foreground font-medium mb-1">Last Backup</Text>
              {backupInfo.hasNeverBackedUp ? (
                <Text variant="caption" className="text-amber-600 dark:text-amber-400">
                  Never backed up - Export your data to create a backup
                </Text>
              ) : (
                <Text variant="caption" className="text-muted-foreground">
                  {backupInfo.daysSinceBackup === 0
                    ? 'Today'
                    : backupInfo.daysSinceBackup === 1
                    ? 'Yesterday'
                    : `${backupInfo.daysSinceBackup} days ago`}
                </Text>
              )}
            </div>
          )}

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-300 group border border-border"
          >
            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 transition-colors">
              <Download className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-foreground font-medium">Export Your Data</Text>
              <Text variant="caption" className="text-muted-foreground">
                Download backup file ({getDataSize()} KB)
              </Text>
            </div>
          </button>

          {/* Import Data */}
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-300 group border border-border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 transition-colors">
              <Upload className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-foreground font-medium">Import Data</Text>
              <Text variant="caption" className="text-muted-foreground">
                {importing ? 'Importing...' : 'Restore from backup file'}
              </Text>
            </div>
          </button>

          {/* Clear Data */}
          <button
            onClick={() => setShowClearDialog(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-state-error/10 transition-all duration-300 group border border-state-error/30"
          >
            <div className="p-2 rounded-lg bg-state-error/20 text-state-error group-hover:bg-state-error/30 transition-colors">
              <Trash2 className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-state-error font-medium">Clear All Data</Text>
              <Text variant="caption" className="text-state-error">Delete your practice history</Text>
            </div>
          </button>
        </SettingsSection>

        {/* About Section */}
        <SettingsSection
          id="about"
          title="About"
          subtitle="App information and credits"
          icon={Info}
          iconBgColor="bg-muted text-muted-foreground"
          isOpen={openSections.about}
          onToggle={() => toggleSection('about')}
        >
          <div className="p-3 bg-muted rounded-lg border border-border">
            <Text className="text-foreground font-medium">Mindful Yoga App</Text>
            <Text variant="caption" className="text-muted-foreground">Version 1.0.0 (Beta)</Text>
          </div>

          <div className="p-3 bg-muted rounded-lg border border-border">
            <Text className="text-foreground font-medium">Build Date</Text>
            <Text variant="caption" className="text-muted-foreground">October 2024</Text>
          </div>

          <button
            onClick={handleFeedback}
            className="w-full p-3 rounded-lg hover:bg-muted transition-all duration-300 text-left border border-border group"
          >
            <Text className="text-foreground font-medium group-hover:text-card-foreground">Send Feedback</Text>
            <Text variant="caption" className="text-muted-foreground">Help us improve the app</Text>
          </button>

          <button
            onClick={handleResetTutorial}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-300 group border border-border"
          >
            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-muted transition-colors">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <Text className="text-foreground font-medium">Show Tutorial Again</Text>
              <Text variant="caption" className="text-muted-foreground">Replay the welcome guide</Text>
            </div>
          </button>

          <div className="p-3 bg-muted rounded-lg border border-border">
            <Text className="text-foreground font-medium">Credits</Text>
            <Text variant="caption" className="text-muted-foreground">
              Built with React, Tailwind CSS, and love for yoga
            </Text>
          </div>
        </SettingsSection>
      </ContentBody>

      {/* Clear Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        message="This will permanently delete all your practice history, streaks, and progress. This action cannot be undone."
        confirmText="Clear Data"
        cancelText="Cancel"
        confirmVariant="danger"
        icon="error"
      />

      {/* Import Data Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card rounded-lg max-w-md w-full p-6 shadow-xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Import Data?
                </h3>
                <p className="text-sm text-muted-foreground">
                  This will replace all current data with the backup file. Your current data will be backed up automatically.
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
              <label className="block cursor-pointer">
                <div className="text-sm font-medium text-foreground mb-2">
                  Select Backup File
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImportConfirm(file);
                    }
                  }}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                  disabled={importing}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportDialog(false)}
                disabled={importing}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default Settings;
