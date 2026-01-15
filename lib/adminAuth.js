import { auth } from '@/auth';

/**
 * Checks if the current session user is an admin.
 * Use this in API routes to protect them.
 * * Usage:
 * const { error, status } = await checkAdmin();
 * if (error) return NextResponse.json({ message: error }, { status });
 */
export async function checkAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  if (session.user.role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 };
  }

  return { user: session.user };
}