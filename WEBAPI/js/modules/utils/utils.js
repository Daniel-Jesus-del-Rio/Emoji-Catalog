class Utils {

    static EXPIRING_DAYS = 9999;

    static slugify(text, needle, slugSeparator) {
        return text.replaceAll(needle, slugSeparator);
    }

    static unslugify(text, slugSeparator, replacement) {
        return text.replaceAll(slugSeparator, replacement);
    }

    static escape(htmlStr) {
        return htmlStr.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");
     }
}

export { Utils };