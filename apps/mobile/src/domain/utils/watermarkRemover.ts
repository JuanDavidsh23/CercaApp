/**
 * Pure Domain Utility for sanitizing and removing invisible AI watermarks from text.
 *
 * Handles Layer A Unicode carriers injected by LLMs (Claude, ChatGPT, Gemini, etc.):
 * - Zero-width spaces and joiners (\u200B, \u200C, \u200D, \uFEFF, \u2060)
 * - Soft hyphens and invisible format controls (\u00AD, \u034F, \u061C, \u180B-\u180E)
 * - Bidirectional (bidi) format controls (\u200E, \u200F, \u202A-\u202E, \u2066-\u2069)
 * - Space homoglyphs and exotic non-breaking spaces (\u00A0, \u3000, \u2000-\u200A)
 *
 * Rules compliance:
 * - Domain layer: Pure TypeScript, zero React/Expo/Native imports.
 * - No `any` type usage.
 */

/**
 * Regex matching invisible Unicode control, format, and zero-width characters.
 */
const INVISIBLE_CHARS_REGEX =
  /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\uFE00-\uFE0F\uFFF9-\uFFFB]/g;

/**
 * Regex matching non-standard space homoglyphs to be replaced with standard U+0020 space.
 */
const SPACE_HOMOGLYPHS_REGEX = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;

/**
 * Sanitizes input text by removing invisible AI watermark characters
 * and normalizing space homoglyphs to standard ASCII spaces.
 *
 * @param text - The raw string input to sanitize.
 * @returns The sanitized text string free of invisible watermarks.
 */
export function removeAIWatermarks(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  return text.replace(INVISIBLE_CHARS_REGEX, "").replace(SPACE_HOMOGLYPHS_REGEX, " ");
}
