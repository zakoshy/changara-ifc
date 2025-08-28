'use server';

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/reset-password?token=${token}`;
  
  // In a real app with an email service, you would send an email here.
  // For this prototype, we log the link to the console for the developer to access.
  console.log(`Password reset link for ${email}: ${resetLink}`);

  // The function needs to be async to match the interface of a real email function.
  return Promise.resolve();
}
