export default function validateEmail(email: string): boolean {
  if (!(email && typeof email === 'string')) {
    return false;
  }

  const partials = email.split('@');
  if (partials.length !== 2) {
    return false;
  }

  const [, host] = partials;
  const hostPartials = host.split('.');
  if (hostPartials.length < 2) {
    return false;
  }

  return true;
}
