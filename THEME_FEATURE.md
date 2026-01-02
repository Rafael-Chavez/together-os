# Theme Switcher Feature

## 🎨 Overview

Together OS now supports two beautiful themes that you can toggle between:

1. **🌿 Warm Theme** (Default) - Calm, warm neutrals with green accent
2. **🌸 Pink Theme** - Soft, light pink with rose accent

---

## 🎯 How to Use

### Toggle Theme

Click the theme button in the header:
- **🌸 emoji** = Click to switch to Pink theme
- **🌿 emoji** = Click to switch to Warm theme

The theme button appears:
- ✅ On the login screen (top right)
- ✅ In the dashboard header (next to your name)

### Theme Persistence

Your theme choice is **automatically saved** to your browser's local storage, so it persists:
- ✅ Between sessions
- ✅ After signing out/in
- ✅ Across different tabs
- ✅ Each user can have their own theme preference on their device

---

## 🎨 Theme Details

### Warm Theme (Default)
```css
Background: #fafaf9 (soft stone)
Cards: #ffffff (white)
Accent: #84cc16 (lime green)
Text: #292524 (warm black)
```

**Vibe:** Calm, earthy, grounded, minimalist

---

### Pink Theme
```css
Background: #fff5f7 (blush white)
Cards: #ffffff (white)
Accent: #ec4899 (pink/rose)
Text: #4a1c2b (deep plum)
Border: #ffc9d6 (soft pink)
```

**Vibe:** Warm, soft, romantic, gentle

---

## 📁 Files Changed

### New Files:
- `src/contexts/ThemeContext.js` - Theme state management
- `src/components/ThemeToggle/ThemeToggle.js` - Toggle button component
- `src/components/ThemeToggle/ThemeToggle.css` - Toggle button styles

### Modified Files:
- `src/index.css` - Added pink theme CSS variables
- `src/App.js` - Added ThemeProvider wrapper
- `src/components/Dashboard/Dashboard.js` - Added ThemeToggle to header
- `src/components/Auth/Login.js` - Added ThemeToggle to login page
- `src/components/Auth/Login.css` - Positioned theme toggle

---

## 🔧 Technical Implementation

### How It Works

1. **CSS Variables**: Both themes use the same variable names, just different values
   ```css
   :root { --accent: #84cc16; } /* Warm theme */
   [data-theme="pink"] { --accent: #ec4899; } /* Pink theme */
   ```

2. **Context API**: `ThemeContext` manages theme state globally
3. **LocalStorage**: Theme preference saved to `together-theme` key
4. **Data Attribute**: Theme applied via `data-theme="pink"` on `<html>`

### Component Usage

```jsx
import { useTheme } from '../../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

---

## 🎨 Adding More Themes (Future)

To add a new theme (e.g., "dark"):

1. **Add CSS variables in `src/index.css`:**
   ```css
   [data-theme="dark"] {
     --bg-primary: #1a1a1a;
     --bg-secondary: #2d2d2d;
     --text-primary: #ffffff;
     /* etc... */
   }
   ```

2. **Update `ThemeContext.js`:**
   ```js
   const themes = ['warm', 'pink', 'dark'];
   const toggleTheme = () => {
     const currentIndex = themes.indexOf(theme);
     const nextIndex = (currentIndex + 1) % themes.length;
     setTheme(themes[nextIndex]);
   };
   ```

3. **Update `ThemeToggle.js` icon:**
   ```jsx
   const icons = { warm: '🌿', pink: '🌸', dark: '🌙' };
   return <button>{icons[theme]}</button>;
   ```

---

## 🌈 Design Philosophy

### Why These Themes?

**Warm Theme:**
- Calm, not sterile
- Green accent = growth, life, action
- Neutral enough for anyone

**Pink Theme:**
- Requested by user
- Soft, not aggressive
- Rose accent = care, warmth, connection
- Still professional, not childish

### Theme Design Principles

1. **High Contrast**: Text always readable on backgrounds
2. **Calm Colors**: No bright, jarring colors
3. **Consistent Spacing**: Themes only change colors, not layout
4. **Accessible**: Both themes meet WCAG AA contrast standards
5. **No Animations**: Theme switch is instant, no distraction

---

## ✅ Testing Checklist

- [x] Theme toggle appears on login screen
- [x] Theme toggle appears in dashboard header
- [x] Theme persists after page reload
- [x] Theme persists after sign out/in
- [x] Pink theme displays correctly
- [x] Warm theme displays correctly
- [x] All text is readable in both themes
- [x] Buttons work in both themes
- [x] Forms work in both themes
- [x] Cards display correctly in both themes

---

## 🎯 User Experience

### No Pressure, Just Choice

The theme toggle:
- ✅ Doesn't interrupt workflow
- ✅ Doesn't nag or prompt
- ✅ Doesn't have a "default" bias
- ✅ Is discoverable but not pushy
- ✅ Works immediately (no save button needed)

This aligns with the app's calm, low-pressure philosophy.

---

**Enjoy your personalized Together OS!** 🌸🌿
