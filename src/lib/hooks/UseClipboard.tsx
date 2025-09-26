import { useState } from "react";

/**
 * Hook for copying text content to browswer clipboard
 *
 * @param {number} [duration=4000] - Duration in milliseconds for how long the copied/error state should persist
 * @returns {Object} An object containing the following:
 * @returns {boolean} copied - Boolean indicating if the text was successfully copied
 * @returns {string | null} clipboardError - Error message if copying failed, null otherwise
 * @returns {(text: string) => Promise<void>} copyToClipboard - Async function to copy text to clipboard
 */
export const useClipboard = (duration = 6000) => {
  const [copied, setCopied] = useState<number | null>(null);
  const [clipboardError, setClipboardError] = useState<string | null>(null);

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not supported");
      }

      await navigator.clipboard.writeText(text);
      setCopied(index ? index : 0);
      setClipboardError(null);

      setTimeout(() => {
        setCopied(null);
      }, duration);
    } catch (err) {
      setClipboardError("Failed to copy text to clipboard");
      setCopied(null);

      setTimeout(() => {
        setClipboardError(null);
      }, duration);
    }
  };

  return {
    copied,
    clipboardError,
    copyToClipboard,
  };
};
