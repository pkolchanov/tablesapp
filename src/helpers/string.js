export function humanizeLink(link) {
    try {
        link = decodeURIComponent(link);
    }
    catch (e) {
        //Do nothing
    }
    return link
        .replace(/^(?:(?:ftp|https?):\/\/(www\.)?|mailto:)/i, "")
        .replace(/\/$/i, "");
}

export function plural(n, s1, s2, s5) {
    if (s5 === undefined) {
        s5 = s2;
    }

    return n % 10 === 1 && n % 100 !== 11 ? s1 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? s2 : s5);
}
