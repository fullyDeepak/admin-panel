import pgSqlClient from '@/utils/db';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: Response) {
  const { searchParams } = new URL(req.url);
  const village_id = searchParams.get('village_id');
  try {
    if (!village_id) {
      return NextResponse.json(
        {
          message: 'bad request',
          data: null,
        },
        { status: 400 }
      );
    }
    const dbRes =
      await pgSqlClient`SELECT * from etl.village_name_replacements WHERE village_id=${+village_id}`;
    if (dbRes.count > 0) {
      return NextResponse.json(
        {
          message: 'success',
          data: dbRes,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: 'Not Found',
          data: null,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        data: null,
        error: error,
      },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {}
// export async function DELETE() {}
