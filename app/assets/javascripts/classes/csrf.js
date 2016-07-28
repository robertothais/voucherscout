class CSRF {
  static token() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token && token.getAttribute('content');
  }
  static header() {
    return 'X-CSRF-Token'
  }
}

export default CSRF