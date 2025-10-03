import { Globe } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import useTranslation from '../hooks/useTranslation';
import { supportedLanguages } from '../i18n/translations';

/**
 * Language selector component for Settings
 */
export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="space-y-3">
      <RadioGroup value={language} onValueChange={setLanguage}>
        {supportedLanguages.map((lang) => (
          <div key={lang.code} className="flex items-center space-x-3 rtl:space-x-reverse">
            <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
            <Label
              htmlFor={`lang-${lang.code}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-sage-600" />
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-sm text-sage-500">({lang.name})</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
