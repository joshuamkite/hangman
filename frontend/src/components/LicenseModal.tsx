import { licenseText } from '../licenseText';
import '../styles/LicenseModal.css';

interface LicenseModalProps {
    onClose: () => void;
}

export default function LicenseModal({ onClose }: LicenseModalProps) {
    // Process license text: split into paragraphs, remove hard line breaks within paragraphs
    const processedText = licenseText
        .split('\n\n')
        .map(para => para.replace(/\n/g, ' ').trim())
        .filter(para => para.length > 0);

    return (
        <div className="license-container">
            <div className="license-header">
                <h1>License</h1>
                <button className="close-license-button" onClick={onClose}>
                    ✕ Close
                </button>
            </div>
            <div className="license-text-wrapper">
                {processedText.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            <div className="license-footer">
                <button className="close-license-button" onClick={onClose}>
                    ✕ Close
                </button>
            </div>
        </div>
    );
}
