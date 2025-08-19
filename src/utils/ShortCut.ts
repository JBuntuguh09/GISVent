export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0');        // Add leading zero if needed
    return `${year}-${month}-${day}`;
  }

  export function formatDateGH(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0');        // Add leading zero if needed
    return `${day}-${month}-${year}`;
  }

  export function currentDate(): string{
    const now = new Date();

    const year = now.getFullYear();       // e.g., 2025
    const month = now.getMonth() + 1;     // Months are zero-based (0-11), so add 1
    const day = now.getDate();            // Day of the month (1-31)
    return `${day}-${month}-${year}`
  }

