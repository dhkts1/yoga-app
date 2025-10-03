import { useState, useEffect } from "react";
import {
  Bell,
  Download,
  Upload,
  Trash2,
  Info,
  RefreshCw,
  Clock,
  Palette,
  Globe,
  Database,
  AlertTriangle,
} from "lucide-react";
import { DefaultLayout } from "../components/layouts";
import { PageHeader } from "../components/headers";
import { Text } from "../components/design-system/Typography";
import { ContentBody } from "../components/design-system";
import { Switch } from "../components/ui/switch";
import SettingsSection from "../components/SettingsSection";
import { ConfirmDialog } from "../components/dialogs";
import { ThemeToggleWithLabel } from "../components/ThemeToggle";
import {
  DARK_MODE_THEMES,
  LIGHT_MODE_THEMES,
} from "../components/ThemeProvider";
import LanguageSelector from "../components/LanguageSelector";
import ThemeColorSelector from "../components/ThemeColorSelector";
import usePreferencesStore from "../stores/preferences";
import useProgressStore from "../stores/progress";
import useCollapsibleSections from "../hooks/useCollapsibleSections";
import useTranslation from "../hooks/useTranslation";
import {
  exportData,
  importData,
  getDataSize,
  getStorageQuota,
  getBackupInfo,
} from "../utils/dataExport";
import { dismissBackupReminder } from "../utils/dataExport";

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
    about: false,
  });

  // Preferences store
  const {
    theme,
    darkModeTheme,
    customDarkColor,
    lightModeTheme,
    customLightColor,
    restDuration,
    practiceReminders,
    streakAlerts,
    reminderTime,
    yoga,
    breathing,
    setDarkModeTheme,
    setCustomDarkColor,
    setLightModeTheme,
    setCustomLightColor,
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
      console.error("Import failed:", error);
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
    window.location.href =
      "mailto:feedback@yoga-app.example.com?subject=Yoga App Feedback";
  };

  const handleResetTutorial = () => {
    resetOnboarding();
    // Reload the page to ensure Onboarding component re-renders with new state
    window.location.href = "/";
  };

  return (
    <DefaultLayout header={<PageHeader title="Settings" showBack={false} />}>
      <ContentBody size="lg" spacing="sm">
        {/* Language Section */}
        <SettingsSection
          id="language"
          title={t("screens.settings.language")}
          subtitle={t("screens.settings.languageSubtitle")}
          icon={Globe}
          iconBgColor="bg-muted"
          isOpen={openSections.language}
          onToggle={() => toggleSection("language")}
        >
          <LanguageSelector />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          id="appearance"
          title={t("screens.settings.appearance")}
          subtitle={t("screens.settings.appearanceSubtitle")}
          icon={Palette}
          iconBgColor="bg-muted"
          isOpen={openSections.appearance}
          onToggle={() => toggleSection("appearance")}
        >
          <div className="py-2">
            <ThemeToggleWithLabel />
          </div>

          {/* Light Mode Theme Selector - only show when light mode is active */}
          {theme === "light" && (
            <ThemeColorSelector
              mode="light"
              themes={LIGHT_MODE_THEMES}
              currentTheme={lightModeTheme}
              customColor={customLightColor}
              onThemeChange={setLightModeTheme}
              onColorChange={setCustomLightColor}
            />
          )}

          {/* Dark Mode Theme Selector - only show when dark mode is active */}
          {theme === "dark" && (
            <ThemeColorSelector
              mode="dark"
              themes={DARK_MODE_THEMES}
              currentTheme={darkModeTheme}
              customColor={customDarkColor}
              onThemeChange={setDarkModeTheme}
              onColorChange={setCustomDarkColor}
            />
          )}
        </SettingsSection>

        {/* Practice Settings Section */}
        <SettingsSection
          id="practice"
          title="Practice Settings"
          subtitle="Customize your practice experience"
          icon={Clock}
          iconBgColor="bg-muted"
          isOpen={openSections.practice}
          onToggle={() => toggleSection("practice")}
        >
          {/* Rest Duration Setting */}
          <div className="py-2">
            <div className="mb-3">
              <Text className="font-medium text-foreground">
                Rest Time Between Poses
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Time to transition between poses
              </Text>
            </div>

            {/* Preset buttons */}
            <div className="mb-2 grid grid-cols-4 gap-2">
              {[
                { value: 0, label: "None" },
                { value: 5, label: "5s" },
                { value: 10, label: "10s" },
                { value: 15, label: "15s" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setRestDuration(option.value);
                    setShowCustomRest(false);
                  }}
                  className={`rounded-lg p-3 text-sm font-medium transition-all duration-300 ${
                    restDuration === option.value && !showCustomRest
                      ? "scale-105 bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:scale-105 hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom button */}
            <button
              onClick={() => setShowCustomRest(!showCustomRest)}
              className={`w-full rounded-lg p-3 text-sm font-medium transition-all duration-300 ${
                showCustomRest
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted"
              }`}
            >
              Custom
            </button>

            {/* Custom Rest Duration Input - shown when Custom is selected */}
            {showCustomRest && (
              <div className="mt-3 rounded-lg border border-border bg-muted p-3 duration-300 animate-in fade-in slide-in-from-top-2">
                <Text className="mb-2 text-sm font-medium text-foreground">
                  Enter Custom Duration
                </Text>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={restDuration}
                    onChange={(e) => setRestDuration(e.target.value)}
                    placeholder="Enter seconds..."
                    className="w-24 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Text variant="caption" className="text-muted-foreground">
                    seconds (0-60)
                  </Text>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-3 rounded-lg border border-border bg-muted p-3">
              <Text variant="caption" className="text-muted-foreground">
                {restDuration === 0 &&
                  !showCustomRest &&
                  "Poses will transition immediately without rest periods."}
                {restDuration === 5 &&
                  !showCustomRest &&
                  "Short rest periods - great for faster-paced practices."}
                {restDuration === 10 &&
                  !showCustomRest &&
                  "Medium rest periods - balanced for most practices."}
                {restDuration === 15 &&
                  !showCustomRest &&
                  "Longer rest periods - perfect for gentle, restorative sessions."}
                {showCustomRest &&
                  `Custom rest period of ${restDuration} seconds between poses.`}
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
          onToggle={() => toggleSection("popups")}
        >
          {/* Yoga Mood Tracking Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="font-medium text-foreground">
                Yoga Mood Tracking
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Show mood check before/after yoga practice
              </Text>
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
              <Text className="font-medium text-foreground">
                Breathing Mood Tracking
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Show mood check before/after breathing exercises
              </Text>
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
          onToggle={() => toggleSection("notifications")}
        >
          <div className="rounded-lg border border-gold-200 bg-gold-50 p-3 text-sm text-accent">
            Note: Notifications are coming in a future update. These settings
            will be saved for when they are available.
          </div>

          {/* Practice Reminders */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="font-medium text-foreground">
                Practice Reminders
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Daily reminder to practice
              </Text>
            </div>
            <Switch
              checked={practiceReminders}
              onCheckedChange={setPracticeReminders}
            />
          </div>

          {/* Reminder Time */}
          {practiceReminders && (
            <div className="py-2">
              <Text className="mb-2 font-medium text-foreground">
                Reminder Time
              </Text>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div className="border-t border-border" />

          {/* Streak Alerts */}
          <div className="flex items-center justify-between py-2">
            <div>
              <Text className="font-medium text-foreground">Streak Alerts</Text>
              <Text variant="caption" className="text-muted-foreground">
                Get notified about your streak
              </Text>
            </div>
            <Switch checked={streakAlerts} onCheckedChange={setStreakAlerts} />
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
          onToggle={() => toggleSection("data")}
        >
          {/* Storage Quota Info */}
          {storageQuota && (
            <div className="mb-3 rounded-lg border border-border bg-muted p-4">
              <div className="mb-2 flex items-center gap-2">
                <Database className="size-4 text-muted-foreground" />
                <Text className="font-medium text-foreground">
                  Storage Used
                </Text>
              </div>
              <div className="mb-1 text-2xl font-bold text-foreground">
                {storageQuota.usage} MB
              </div>
              <Text variant="caption" className="mb-2 text-muted-foreground">
                of {storageQuota.quota} MB ({storageQuota.percent}%)
              </Text>
              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div
                  className={`h-full transition-all duration-300 ${
                    parseFloat(storageQuota.percent) > 80
                      ? "bg-state-error"
                      : parseFloat(storageQuota.percent) > 60
                        ? "bg-state-warning"
                        : "bg-primary"
                  }`}
                  style={{ width: `${storageQuota.percent}%` }}
                />
              </div>
              {parseFloat(storageQuota.percent) > 80 && (
                <div className="mt-2 flex items-start gap-2 text-state-error">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <Text variant="caption" className="text-state-error">
                    Storage is running low. Export your data to create a backup.
                  </Text>
                </div>
              )}
            </div>
          )}

          {/* Backup Info */}
          {backupInfo && (
            <div className="mb-3 rounded-lg border border-border bg-muted p-3">
              <Text className="mb-1 font-medium text-foreground">
                Last Backup
              </Text>
              {backupInfo.hasNeverBackedUp ? (
                <Text variant="caption" className="text-state-warning">
                  Never backed up - Export your data to create a backup
                </Text>
              ) : (
                <Text variant="caption" className="text-muted-foreground">
                  {backupInfo.daysSinceBackup === 0
                    ? "Today"
                    : backupInfo.daysSinceBackup === 1
                      ? "Yesterday"
                      : `${backupInfo.daysSinceBackup} days ago`}
                </Text>
              )}
            </div>
          )}

          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="group flex w-full items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-muted"
          >
            <div className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-primary/10">
              <Download className="size-4" />
            </div>
            <div className="flex-1 text-left">
              <Text className="font-medium text-foreground">
                Export Your Data
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Download backup file ({getDataSize()} KB)
              </Text>
            </div>
          </button>

          {/* Import Data */}
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="group flex w-full items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-primary/10">
              <Upload className="size-4" />
            </div>
            <div className="flex-1 text-left">
              <Text className="font-medium text-foreground">Import Data</Text>
              <Text variant="caption" className="text-muted-foreground">
                {importing ? "Importing..." : "Restore from backup file"}
              </Text>
            </div>
          </button>

          {/* Clear Data */}
          <button
            onClick={() => setShowClearDialog(true)}
            className="group flex w-full items-center gap-3 rounded-lg border border-state-error/30 p-3 transition-all duration-300 hover:bg-state-error/10"
          >
            <div className="rounded-lg bg-state-error/20 p-2 text-state-error transition-colors group-hover:bg-state-error/30">
              <Trash2 className="size-4" />
            </div>
            <div className="flex-1 text-left">
              <Text className="font-medium text-state-error">
                Clear All Data
              </Text>
              <Text variant="caption" className="text-state-error">
                Delete your practice history
              </Text>
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
          onToggle={() => toggleSection("about")}
        >
          <div className="rounded-lg border border-border bg-muted p-3">
            <Text className="font-medium text-foreground">
              Mindful Yoga App
            </Text>
            <Text variant="caption" className="text-muted-foreground">
              Version 1.0.0 (Beta)
            </Text>
          </div>

          <div className="rounded-lg border border-border bg-muted p-3">
            <Text className="font-medium text-foreground">Build Date</Text>
            <Text variant="caption" className="text-muted-foreground">
              October 2024
            </Text>
          </div>

          <button
            onClick={handleFeedback}
            className="group w-full rounded-lg border border-border p-3 text-left transition-all duration-300 hover:bg-muted"
          >
            <Text className="font-medium text-foreground group-hover:text-foreground">
              Send Feedback
            </Text>
            <Text variant="caption" className="text-muted-foreground">
              Help us improve the app
            </Text>
          </button>

          <button
            onClick={handleResetTutorial}
            className="group flex w-full items-center gap-3 rounded-lg border border-border p-3 transition-all duration-300 hover:bg-muted"
          >
            <div className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-muted">
              <RefreshCw className="size-4" />
            </div>
            <div className="flex-1 text-left">
              <Text className="font-medium text-foreground">
                Show Tutorial Again
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                Replay the welcome guide
              </Text>
            </div>
          </button>

          <div className="rounded-lg border border-border bg-muted p-3">
            <Text className="font-medium text-foreground">Credits</Text>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 duration-200 animate-in fade-in">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl duration-200 animate-in zoom-in-95">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-lg bg-state-warning/20 p-2 text-state-warning">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  Import Data?
                </h3>
                <p className="text-sm text-muted-foreground">
                  This will replace all current data with the backup file. Your
                  current data will be backed up automatically.
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-border bg-muted p-3">
              <label className="block cursor-pointer">
                <div className="mb-2 text-sm font-medium text-foreground">
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
                  className="w-full text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                  disabled={importing}
                />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowImportDialog(false)}
                disabled={importing}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
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
