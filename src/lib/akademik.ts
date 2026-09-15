export function formatTanggal(isoDate?: string | null): string {
    if (!isoDate) return '-';
    try {
        // Append noon to prevent timezone shifts when parsing YYYY-MM-DD
        const dateStr = isoDate.includes('T') ? isoDate : `${isoDate}T12:00:00`;
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return isoDate;
    }
}

export function formatSemester(semester?: string | null): string {
    if (!semester) return '-';
    return semester.toLowerCase() === 'ganjil' ? 'Ganjil' : 'Genap';
}
