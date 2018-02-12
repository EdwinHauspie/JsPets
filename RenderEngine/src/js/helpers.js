function esc(str) {
    return str.replace(/&/g, '&amp;') // first!
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

export function html (literalSections, ...substs) {
    //http://2ality.com/2015/01/template-strings-html.html
    // Use raw literal sections: we don’t want backslashes (\n etc.) to be interpreted
    let raw = literalSections.raw;
    let result = '';

    substs.forEach((subst, i) => {
        // Retrieve the literal section preceding the current substitution
        let lit = raw[i];

        // In the example, map() returns an array: If substitution is an array (and not a string), we turn it into a string
        if (Array.isArray(subst)) subst = subst.join('');

        // If the substitution is preceded by a dollar sign, escape special characters in it
        if (lit.endsWith('$')) {
            subst = esc(subst);
            lit = lit.slice(0, -1);
        }
        result += lit + subst;
    });

    // Take care of last literal section (Never fails, because an empty template string produces one literal section, an empty string)
    result += raw[raw.length - 1]; // (A)

    return result;
}

export function getRandom(min = 1, max = 1000) {
    return Math.floor(Math.random() * max) + min
}