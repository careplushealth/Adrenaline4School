export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const phase = searchParams.get('phase') || 'all';
    const type = searchParams.get('type') || 'all';
    const localAuthority = searchParams.get('localAuthority') || 'all';
    const status = searchParams.get('status') || 'all'; // 'all' | 'customer' | 'prospect'
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'DESC' : 'ASC';
    const format = searchParams.get('format');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const offset = (page - 1) * limit;

    const conditions: string[] = ['1=1'];
    const params: any[] = [];

    // Search filter
    if (q) {
      conditions.push(`(
        d.name ILIKE ? OR 
        d.urn ILIKE ? OR 
        d.postcode ILIKE ? OR 
        d.town_city ILIKE ? OR 
        d.headteacher_name ILIKE ? OR 
        d.local_authority ILIKE ?
      )`);
      const term = `%${q}%`;
      params.push(term, term, term, term, term, term);
    }

    // Phase filter
    if (phase && phase !== 'all') {
      conditions.push('d.phase = ?');
      params.push(phase);
    }

    // Type filter
    if (type && type !== 'all') {
      if (type === 'Academy') {
        conditions.push("d.type ILIKE '%Academy%'");
      } else if (type === 'Community') {
        conditions.push("d.type ILIKE '%Community%'");
      } else if (type === 'Independent') {
        conditions.push("d.type ILIKE '%Independent%'");
      } else if (type === 'Voluntary') {
        conditions.push("d.type ILIKE '%Voluntary%'");
      } else if (type === 'Special') {
        conditions.push("d.type ILIKE '%Special%'");
      } else {
        conditions.push('d.type = ?');
        params.push(type);
      }
    }

    // Local authority filter
    if (localAuthority && localAuthority !== 'all') {
      conditions.push('d.local_authority = ?');
      params.push(localAuthority);
    }

    // Customer status filter
    if (status === 'customer') {
      conditions.push('s.id IS NOT NULL');
    } else if (status === 'prospect') {
      conditions.push('s.id IS NULL');
    }

    const whereClause = conditions.join(' AND ');

    // Valid sort columns
    const allowedSortCols: Record<string, string> = {
      name: 'd.name',
      urn: 'd.urn',
      town_city: 'd.town_city',
      phase: 'd.phase',
      type: 'd.type',
      local_authority: 'd.local_authority',
      postcode: 'd.postcode',
    };
    const sortCol = allowedSortCols[sortBy] || 'd.name';

    // If format is CSV, stream full filtered set (up to 2,000 for export safety)
    if (format === 'csv') {
      const csvQuery = `
        SELECT 
          d.urn,
          d.name,
          d.phase,
          d.type,
          d.local_authority,
          d.address_line1,
          d.address_line2,
          d.town_city,
          d.postcode,
          d.phone,
          d.headteacher_name,
          d.headteacher_email,
          d.office_email,
          CASE WHEN s.id IS NOT NULL THEN 'Customer' ELSE 'Prospect' END as customer_status
        FROM uk_schools_directory d
        LEFT JOIN schools s ON d.urn = s.urn
        WHERE ${whereClause}
        ORDER BY ${sortCol} ${sortOrder}
        LIMIT 2000
      `;

      const rows = await db.prepare(csvQuery).all(...params);

      const csvHeaders = [
        'URN',
        'School Name',
        'Phase',
        'Type',
        'Local Authority',
        'Address Line 1',
        'Address Line 2',
        'Town / City',
        'Postcode',
        'Phone',
        'Headteacher Name',
        'Headteacher Email',
        'Office Email',
        'Account Status',
      ];

      const csvRows = rows.map((r: any) => [
        `"${(r.urn || '').replace(/"/g, '""')}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.phase || '').replace(/"/g, '""')}"`,
        `"${(r.type || '').replace(/"/g, '""')}"`,
        `"${(r.local_authority || '').replace(/"/g, '""')}"`,
        `"${(r.address_line1 || '').replace(/"/g, '""')}"`,
        `"${(r.address_line2 || '').replace(/"/g, '""')}"`,
        `"${(r.town_city || '').replace(/"/g, '""')}"`,
        `"${(r.postcode || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.headteacher_name || '').replace(/"/g, '""')}"`,
        `"${(r.headteacher_email || '').replace(/"/g, '""')}"`,
        `"${(r.office_email || '').replace(/"/g, '""')}"`,
        `"${r.customer_status}"`,
      ].join(','));

      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="uk-schools-export-${Date.now()}.csv"`,
        },
      });
    }

    // 1. Get total count
    const countSql = `
      SELECT COUNT(DISTINCT d.urn) as count
      FROM uk_schools_directory d
      LEFT JOIN schools s ON d.urn = s.urn
      WHERE ${whereClause}
    `;
    const countRow = await db.prepare(countSql).get(...params) as { count: number | string };
    const total = parseInt(String(countRow?.count || 0), 10);

    // 2. Query paginated schools with customer and order details
    const listSql = `
      SELECT 
        d.urn,
        d.name,
        d.phase,
        d.type,
        d.local_authority,
        d.address_line1,
        d.address_line2,
        d.town_city,
        d.postcode,
        d.phone,
        d.headteacher_name,
        d.headteacher_email,
        d.office_email,
        d.created_at,
        s.id as customer_school_id,
        COUNT(o.id) as orders_count
      FROM uk_schools_directory d
      LEFT JOIN schools s ON d.urn = s.urn
      LEFT JOIN orders o ON s.id = o.school_id
      WHERE ${whereClause}
      GROUP BY 
        d.urn, d.name, d.phase, d.type, d.local_authority, 
        d.address_line1, d.address_line2, d.town_city, d.postcode, 
        d.phone, d.headteacher_name, d.headteacher_email, d.office_email, 
        d.created_at, s.id
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const schools = await db.prepare(listSql).all(...params, limit, offset);

    // 3. Get directory-wide aggregate statistics (for top dashboard pills)
    const statsSql = `
      SELECT 
        COUNT(*) as total_all,
        COUNT(*) FILTER (WHERE phase = 'Primary') as total_primary,
        COUNT(*) FILTER (WHERE phase = 'Secondary' OR phase = '16 plus') as total_secondary,
        COUNT(*) FILTER (WHERE type ILIKE '%Academy%') as total_academy,
        COUNT(*) FILTER (WHERE type ILIKE '%Independent%') as total_independent
      FROM uk_schools_directory
    `;
    const statsRow = await db.prepare(statsSql).get() as any;

    const customerCountSql = `SELECT COUNT(*) as count FROM schools`;
    const customerCountRow = await db.prepare(customerCountSql).get() as any;

    return NextResponse.json({
      success: true,
      schools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalAll: parseInt(statsRow?.total_all || '27180', 10),
        totalPrimary: parseInt(statsRow?.total_primary || '0', 10),
        totalSecondary: parseInt(statsRow?.total_secondary || '0', 10),
        totalAcademy: parseInt(statsRow?.total_academy || '0', 10),
        totalIndependent: parseInt(statsRow?.total_independent || '0', 10),
        totalCustomers: parseInt(customerCountRow?.count || '0', 10),
      },
      filters: {
        phases: [
          'Primary',
          'Secondary',
          'All-through',
          '16 plus',
          'Nursery',
          'Middle deemed primary',
          'Middle deemed secondary',
        ],
        types: [
          { label: 'All Types', value: 'all' },
          { label: 'Academies & Free Schools', value: 'Academy' },
          { label: 'Community / Maintained', value: 'Community' },
          { label: 'Voluntary Aided / Controlled', value: 'Voluntary' },
          { label: 'Independent / Private', value: 'Independent' },
          { label: 'Special Educational Needs', value: 'Special' },
        ],
      },
    });
  } catch (error: any) {
    console.error('API /admin/schools error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to query UK schools directory.' },
      { status: 500 }
    );
  }
}
