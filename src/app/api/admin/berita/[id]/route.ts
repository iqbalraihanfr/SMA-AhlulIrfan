import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
        return NextResponse.json({ error: 'ID berita tidak valid.' }, { status: 400 });
    }
    try { await requireAdmin(); }
    catch { return NextResponse.json({ error: 'Hanya admin yang dapat menghapus berita.' }, { status: 403 }); }

    const { error } = await supabase.from('berita').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
